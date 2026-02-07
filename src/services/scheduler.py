"""Task scheduler service for autonomous operations."""
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, Callable, Dict, Any

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import async_session
from src.models.task import Task, TaskStatus, TaskType

logger = logging.getLogger(__name__)


class TaskScheduler:
    """
    Background task scheduler that runs autonomous recruiting tasks.

    The scheduler:
    1. Polls for pending tasks in the database
    2. Executes tasks using registered handlers
    3. Handles retries and failures
    4. Supports recurring tasks
    """

    def __init__(self, poll_interval: int = 10):
        self.poll_interval = poll_interval  # seconds
        self.running = False
        self.handlers: Dict[TaskType, Callable] = {}
        self._task: Optional[asyncio.Task] = None
        self._current_task_id: Optional[int] = None

    def register_handler(self, task_type: TaskType, handler: Callable):
        """Register a handler for a task type."""
        self.handlers[task_type] = handler
        logger.info(f"Registered handler for {task_type.value}")

    async def start(self):
        """Start the scheduler background loop."""
        if self.running:
            logger.warning("Scheduler already running")
            return

        self.running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("Task scheduler started")

    async def stop(self):
        """Stop the scheduler gracefully."""
        self.running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Task scheduler stopped")

    async def _run_loop(self):
        """Main scheduler loop."""
        while self.running:
            try:
                await self._process_pending_tasks()
            except Exception as e:
                logger.error(f"Scheduler error: {e}")

            await asyncio.sleep(self.poll_interval)

    async def _process_pending_tasks(self):
        """Process pending tasks from the database."""
        async with async_session() as db:
            # Get pending tasks that are ready to run
            now = datetime.utcnow()
            result = await db.execute(
                select(Task)
                .where(
                    Task.status == TaskStatus.PENDING,
                    or_(
                        Task.scheduled_for.is_(None),
                        Task.scheduled_for <= now
                    )
                )
                .order_by(Task.priority, Task.created_at)
                .limit(5)  # Process up to 5 tasks at a time
            )
            tasks = result.scalars().all()

            for task in tasks:
                await self._execute_task(db, task)

    async def _execute_task(self, db: AsyncSession, task: Task):
        """Execute a single task."""
        handler = self.handlers.get(task.task_type)

        if not handler:
            logger.warning(f"No handler for task type: {task.task_type}")
            task.status = TaskStatus.FAILED
            task.error_message = f"No handler registered for {task.task_type.value}"
            await db.commit()
            return

        # Update task status
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.attempts += 1
        self._current_task_id = task.id
        await db.commit()

        try:
            logger.info(f"Executing task {task.id}: {task.task_type.value}")

            # Execute handler
            result = await handler(
                db=db,
                task=task,
                job_id=task.job_id,
                candidate_id=task.candidate_id,
                client_id=task.client_id,
                parameters=task.parameters or {},
            )

            # Update task with result
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            task.result = result

            # Handle recurring tasks
            if task.recurring and task.recurrence_interval:
                await self._schedule_next_occurrence(db, task)

            logger.info(f"Task {task.id} completed successfully")

        except Exception as e:
            logger.error(f"Task {task.id} failed: {e}")
            task.error_message = str(e)

            # Retry or fail
            if task.attempts < task.max_attempts:
                task.status = TaskStatus.PENDING
                task.scheduled_for = datetime.utcnow() + timedelta(minutes=task.attempts * 5)
                logger.info(f"Task {task.id} will retry in {task.attempts * 5} minutes")
            else:
                task.status = TaskStatus.FAILED
                task.completed_at = datetime.utcnow()
                logger.error(f"Task {task.id} failed after {task.attempts} attempts")

        finally:
            self._current_task_id = None
            await db.commit()

    async def _schedule_next_occurrence(self, db: AsyncSession, task: Task):
        """Schedule the next occurrence of a recurring task."""
        new_task = Task(
            task_type=task.task_type,
            priority=task.priority,
            job_id=task.job_id,
            candidate_id=task.candidate_id,
            client_id=task.client_id,
            parameters=task.parameters,
            recurring=True,
            recurrence_interval=task.recurrence_interval,
            scheduled_for=datetime.utcnow() + timedelta(minutes=task.recurrence_interval),
        )
        db.add(new_task)
        logger.info(f"Scheduled next occurrence of task {task.task_type.value}")


# Singleton instance
_scheduler: Optional[TaskScheduler] = None


def get_scheduler() -> TaskScheduler:
    """Get or create scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = TaskScheduler()
    return _scheduler


async def create_task(
    task_type: TaskType,
    job_id: str = None,
    candidate_id: str = None,
    client_id: str = None,
    parameters: dict = None,
    priority: int = 5,
    scheduled_for: datetime = None,
    recurring: bool = False,
    recurrence_interval: int = None,
) -> Task:
    """Create and save a new task."""
    async with async_session() as db:
        task = Task(
            task_type=task_type,
            job_id=job_id,
            candidate_id=candidate_id,
            client_id=client_id,
            parameters=parameters or {},
            priority=priority,
            scheduled_for=scheduled_for,
            recurring=recurring,
            recurrence_interval=recurrence_interval,
        )
        db.add(task)
        await db.commit()
        await db.refresh(task)
        logger.info(f"Created task {task.id}: {task_type.value}")
        return task
