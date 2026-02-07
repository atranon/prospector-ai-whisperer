"""Chat API for conversational interactions."""
import logging
from typing import List, Optional
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.job import Job
from src.models.candidate import Candidate
from src.models.task import Task, TaskStatus, TaskType
from src.services.llm import get_llm
from src.services.scheduler import create_task

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory conversation storage (use Redis in production)
conversations: dict = {}


class ChatMessage(BaseModel):
    """A single chat message."""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Request to send a chat message."""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response from chat."""
    conversation_id: str
    message: str
    actions_taken: Optional[List[dict]] = None


SYSTEM_PROMPT = """You are an AI recruiting assistant called "Recruiting Brain". You help users with recruiting tasks by having natural conversations.

You can help with:
1. Analyzing job descriptions - understanding requirements and ideal candidates
2. Reviewing resumes - extracting skills, experience, and fit
3. Scoring candidate-job fit - evaluating matches with reasoning
4. Generating outreach - personalized messages to candidates or clients
5. Starting autonomous recruiting - continuous sourcing and outreach for a job
6. Market intelligence - salary info, hiring trends, competition

When the user wants to:
- Start recruiting for a role: Create tasks for sourcing, scoring, and outreach
- Analyze a JD or resume: Parse and provide structured insights
- Score a candidate: Evaluate fit and provide reasoning
- Send outreach: Generate personalized messages

Keep responses conversational but actionable. When you identify a task, execute it directly.

Current capabilities:
- Autonomous sourcing that runs continuously
- Learning from user feedback on outreach
- Market analysis for roles/industries

Always be helpful, proactive, and focused on recruiting outcomes."""


def parse_intent(message: str) -> dict:
    """Parse user intent from message."""
    message_lower = message.lower()

    # Check for job-related intents
    if any(w in message_lower for w in ["analyze job", "parse jd", "job description", "new job", "new role"]):
        return {"intent": "analyze_job"}

    if any(w in message_lower for w in ["analyze resume", "parse resume", "candidate resume", "review resume"]):
        return {"intent": "analyze_resume"}

    if any(w in message_lower for w in ["score", "fit", "match", "evaluate candidate"]):
        return {"intent": "score_fit"}

    if any(w in message_lower for w in ["outreach", "message", "email", "reach out", "contact"]):
        return {"intent": "generate_outreach"}

    if any(w in message_lower for w in ["start recruiting", "autonomous", "source candidates", "find candidates"]):
        return {"intent": "start_autonomous"}

    if any(w in message_lower for w in ["stop recruiting", "pause", "stop sourcing"]):
        return {"intent": "stop_autonomous"}

    if any(w in message_lower for w in ["market", "salary", "trends", "competition", "intel"]):
        return {"intent": "market_intel"}

    if any(w in message_lower for w in ["status", "tasks", "what's running", "progress"]):
        return {"intent": "check_status"}

    return {"intent": "general"}


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Send a chat message and get a response.

    The assistant can:
    - Answer questions about recruiting
    - Execute tasks based on conversation
    - Provide status updates
    - Start/stop autonomous operations
    """
    llm = get_llm()

    # Get or create conversation
    conv_id = request.conversation_id or str(uuid4())
    if conv_id not in conversations:
        conversations[conv_id] = []

    # Add user message to history
    conversations[conv_id].append({
        "role": "user",
        "content": request.message
    })

    # Parse intent for special handling
    intent = parse_intent(request.message)
    actions_taken = []

    # Handle special intents
    if intent["intent"] == "start_autonomous":
        # Look for a recent job or ask for one
        result = await db.execute(
            select(Job).order_by(Job.created_at.desc()).limit(1)
        )
        job = result.scalar_one_or_none()

        if job:
            # Create autonomous tasks
            task = await create_task(
                task_type=TaskType.SOURCE_CANDIDATES,
                job_id=str(job.id),
                recurring=True,
                recurrence_interval=60,
                priority=3
            )
            actions_taken.append({
                "action": "created_task",
                "task_type": "source_candidates",
                "job": job.title,
                "recurring": True
            })

            # Add context about what we did
            conversations[conv_id].append({
                "role": "system",
                "content": f"[System: Started autonomous sourcing for {job.title} at {job.company}. Task ID: {task.id}]"
            })

    elif intent["intent"] == "check_status":
        # Get task status
        result = await db.execute(
            select(Task)
            .where(Task.status.in_([TaskStatus.PENDING, TaskStatus.RUNNING]))
            .order_by(Task.created_at.desc())
            .limit(10)
        )
        tasks = result.scalars().all()

        if tasks:
            status_info = "\n".join([
                f"- {t.task_type.value}: {t.status.value}"
                for t in tasks
            ])
            conversations[conv_id].append({
                "role": "system",
                "content": f"[System: Active tasks:\n{status_info}]"
            })

    elif intent["intent"] == "market_intel":
        # Create market intel task
        task = await create_task(
            task_type=TaskType.MARKET_INTEL,
            parameters={"role": request.message},
            priority=4
        )
        actions_taken.append({
            "action": "created_task",
            "task_type": "market_intel"
        })

    # Build messages for LLM
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(conversations[conv_id][-20:])  # Last 20 messages

    # Generate response
    response = await llm.generate(messages, temperature=0.7)

    # Add assistant response to history
    conversations[conv_id].append({
        "role": "assistant",
        "content": response.content
    })

    # Keep conversation history manageable
    if len(conversations[conv_id]) > 100:
        conversations[conv_id] = conversations[conv_id][-50:]

    return ChatResponse(
        conversation_id=conv_id,
        message=response.content,
        actions_taken=actions_taken if actions_taken else None
    )


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history."""
    if conversation_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "conversation_id": conversation_id,
        "messages": conversations[conversation_id],
        "message_count": len(conversations[conversation_id])
    }


@router.delete("/conversations/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear conversation history."""
    if conversation_id in conversations:
        del conversations[conversation_id]
    return {"message": "Conversation cleared"}
