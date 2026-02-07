"""Task management API endpoints."""
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.task import Task, TaskStatus, TaskType
from src.services.scheduler import create_task

router = APIRouter()


# Request/Response Models
class CreateTaskRequest(BaseModel):
    """Request to create a new task."""
    task_type: TaskType
    job_id: Optional[str] = None
    candidate_id: Optional[str] = None
    client_id: Optional[str] = None
    parameters: Optional[dict] = Field(default_factory=dict)
    priority: int = Field(default=5, ge=1, le=10)
    scheduled_for: Optional[datetime] = None
    recurring: bool = False
    recurrence_interval: Optional[int] = Field(None, description="Minutes between recurring runs")


class TaskResponse(BaseModel):
    """Task response."""
    id: int
    task_type: TaskType
    status: TaskStatus
    priority: int
    job_id: Optional[str]
    candidate_id: Optional[str]
    parameters: Optional[dict]
    result: Optional[dict]
    error_message: Optional[str]
    attempts: int
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    scheduled_for: Optional[datetime]
    recurring: bool

    class Config:
        from_attributes = True


class StartAutonomousRequest(BaseModel):
    """Request to start autonomous recruiting for a job."""
    job_id: str
    source_candidates: bool = True
    score_candidates: bool = True
    generate_outreach: bool = True
    min_score: float = Field(default=0.7, ge=0, le=1)
    recurring: bool = True
    interval_minutes: int = Field(default=60, ge=5)


# Endpoints
@router.post("/", response_model=TaskResponse)
async def create_new_task(
    request: CreateTaskRequest,
    db: AsyncSession = Depends(get_db)
):
    """Create a new background task."""
    task = await create_task(
        task_type=request.task_type,
        job_id=request.job_id,
        candidate_id=request.candidate_id,
        client_id=request.client_id,
        parameters=request.parameters,
        priority=request.priority,
        scheduled_for=request.scheduled_for,
        recurring=request.recurring,
        recurrence_interval=request.recurrence_interval,
    )
    return task


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status: Optional[TaskStatus] = None,
    task_type: Optional[TaskType] = None,
    job_id: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List tasks with optional filters."""
    query = select(Task).order_by(Task.created_at.desc()).limit(limit)

    conditions = []
    if status:
        conditions.append(Task.status == status)
    if task_type:
        conditions.append(Task.task_type == task_type)
    if job_id:
        conditions.append(Task.job_id == job_id)

    if conditions:
        query = query.where(and_(*conditions))

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific task by ID."""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/{task_id}/cancel")
async def cancel_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Cancel a pending task."""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status not in [TaskStatus.PENDING, TaskStatus.RUNNING]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel task in {task.status} status")

    task.status = TaskStatus.CANCELLED
    task.completed_at = datetime.utcnow()
    await db.commit()

    return {"message": f"Task {task_id} cancelled"}


@router.post("/start-autonomous", response_model=List[TaskResponse])
async def start_autonomous_recruiting(
    request: StartAutonomousRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Start autonomous recruiting for a job.

    This creates multiple recurring tasks that work continuously:
    1. Source candidates - Find new candidates
    2. Score candidates - Evaluate fit
    3. Generate outreach - Create personalized messages
    """
    tasks = []

    if request.source_candidates:
        task = await create_task(
            task_type=TaskType.SOURCE_CANDIDATES,
            job_id=request.job_id,
            parameters={"min_score": request.min_score},
            priority=3,
            recurring=request.recurring,
            recurrence_interval=request.interval_minutes,
        )
        tasks.append(task)

    if request.score_candidates:
        task = await create_task(
            task_type=TaskType.SCORE_CANDIDATES,
            job_id=request.job_id,
            priority=4,
            recurring=request.recurring,
            recurrence_interval=request.interval_minutes,
        )
        tasks.append(task)

    if request.generate_outreach:
        task = await create_task(
            task_type=TaskType.GENERATE_OUTREACH,
            job_id=request.job_id,
            parameters={"min_score": request.min_score},
            priority=5,
            recurring=request.recurring,
            recurrence_interval=request.interval_minutes,
        )
        tasks.append(task)

    return tasks


@router.post("/stop-autonomous/{job_id}")
async def stop_autonomous_recruiting(
    job_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Stop all autonomous tasks for a job."""
    result = await db.execute(
        select(Task)
        .where(
            Task.job_id == job_id,
            Task.status.in_([TaskStatus.PENDING, TaskStatus.RUNNING]),
            Task.recurring == True
        )
    )
    tasks = result.scalars().all()

    cancelled = 0
    for task in tasks:
        task.status = TaskStatus.CANCELLED
        task.completed_at = datetime.utcnow()
        task.recurring = False  # Stop future recurrence
        cancelled += 1

    await db.commit()

    return {"message": f"Stopped {cancelled} autonomous tasks for job {job_id}"}


@router.get("/stats/summary")
async def get_task_stats(db: AsyncSession = Depends(get_db)):
    """Get task execution statistics."""
    # Count by status
    result = await db.execute(
        select(Task.status, Task.task_type)
    )
    tasks = result.all()

    status_counts = {}
    type_counts = {}
    for status, task_type in tasks:
        status_counts[status.value] = status_counts.get(status.value, 0) + 1
        type_counts[task_type.value] = type_counts.get(task_type.value, 0) + 1

    return {
        "by_status": status_counts,
        "by_type": type_counts,
        "total": len(tasks)
    }
