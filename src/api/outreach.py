"""Outreach generation API with learning from feedback."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.job import Job
from src.models.candidate import Candidate
from src.models.client import Client
from src.models.outreach import OutreachLog, OutreachType, OutreachStatus
from src.agents import OutreachAgent
from src.agents.outreach import OutreachInput
from src.services.memory import get_memory_service

router = APIRouter()


class GenerateOutreachRequest(BaseModel):
    """Request to generate outreach."""
    outreach_type: str  # "candidate" or "client"
    job_id: Optional[str] = None
    candidate_id: Optional[str] = None
    client_id: Optional[str] = None
    message_type: str = "initial"  # initial, follow_up, nurture
    notes: Optional[str] = None


class UpdateOutreachRequest(BaseModel):
    """Request to update outreach with user edits."""
    user_final: str
    feedback_tags: Optional[list[str]] = None
    approved: bool = False


class SendOutreachRequest(BaseModel):
    """Request to mark outreach as sent."""
    sent_via: str = "manual"  # manual, email_api, linkedin_api


@router.post("/generate")
async def generate_outreach(
    request: GenerateOutreachRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate personalized outreach using AI.

    The system learns from past user edits:
    1. Retrieves similar past examples for few-shot prompting
    2. Applies style rules derived from feedback patterns
    3. Returns a draft that the user can edit

    After editing, call /outreach/{id}/feedback to save changes
    and improve future generations.
    """
    memory = get_memory_service()
    outreach_type = OutreachType(request.outreach_type + "_outreach")

    # Build context based on outreach type
    context = {}
    job = None
    candidate = None
    client = None

    if request.job_id:
        result = await db.execute(select(Job).where(Job.id == UUID(request.job_id)))
        job = result.scalar_one_or_none()
        if job:
            context["job"] = _job_to_dict(job)

    if request.candidate_id:
        result = await db.execute(select(Candidate).where(Candidate.id == UUID(request.candidate_id)))
        candidate = result.scalar_one_or_none()
        if candidate:
            context["candidate"] = _candidate_to_dict(candidate)

    if request.client_id:
        result = await db.execute(select(Client).where(Client.id == UUID(request.client_id)))
        client = result.scalar_one_or_none()
        if client:
            context["client"] = _client_to_dict(client)

    if request.notes:
        context["notes"] = request.notes

    # Get learning context from memory
    similar_examples = await memory.retrieve_similar_examples(db, context, outreach_type)
    style_rules = await memory.get_style_rules(db, outreach_type)

    # Generate outreach
    agent = OutreachAgent(verbose=True)
    result = await agent.run(OutreachInput(
        outreach_type=request.outreach_type,
        job=context.get("job"),
        candidate=context.get("candidate"),
        client=context.get("client"),
        message_type=request.message_type,
        notes=request.notes,
        style_rules=style_rules,
        similar_examples=similar_examples,
    ))

    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)

    data = result.data

    # Log the outreach for learning
    log = await memory.log_outreach(
        db,
        outreach_type=outreach_type,
        input_context=context,
        model_draft=data.body,
        job_id=request.job_id,
        candidate_id=request.candidate_id,
        client_id=request.client_id,
        subject=data.subject,
        message_type=request.message_type,
    )

    return {
        "success": True,
        "outreach_id": str(log.id),
        "subject": data.subject,
        "body": data.body,
        "personalization_notes": data.personalization_notes,
        "tone": data.tone,
        "call_to_action": data.call_to_action,
        "learning_context": {
            "similar_examples_used": len(similar_examples),
            "style_rules_applied": len(style_rules),
        },
        "reasoning": result.reasoning,
    }


@router.post("/{outreach_id}/feedback")
async def update_outreach_feedback(
    outreach_id: UUID,
    request: UpdateOutreachRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Update outreach with user's edited version and feedback.

    This is critical for learning:
    - The edited message becomes a training example
    - Feedback tags help derive style rules
    - Approved messages are used for few-shot prompting

    Recommended feedback tags:
    - shorter, longer
    - more_direct, more_casual, more_formal
    - include_comp, no_comp
    - add_cta, personalize
    - less_salesy
    """
    memory = get_memory_service()

    try:
        log = await memory.update_with_feedback(
            db,
            str(outreach_id),
            request.user_final,
            request.feedback_tags,
            request.approved,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {
        "success": True,
        "outreach_id": str(log.id),
        "feedback_recorded": True,
        "approved_for_training": request.approved,
    }


@router.post("/{outreach_id}/send")
async def mark_outreach_sent(
    outreach_id: UUID,
    request: SendOutreachRequest,
    db: AsyncSession = Depends(get_db),
):
    """Mark outreach as sent."""
    from datetime import datetime

    result = await db.execute(select(OutreachLog).where(OutreachLog.id == outreach_id))
    log = result.scalar_one_or_none()

    if not log:
        raise HTTPException(status_code=404, detail="Outreach not found")

    log.status = OutreachStatus.SENT
    log.sent_at = datetime.utcnow()

    return {"success": True, "status": "sent"}


@router.get("/stats")
async def get_outreach_stats(db: AsyncSession = Depends(get_db)):
    """
    Get statistics about outreach and training data.

    Returns counts needed to determine if fine-tuning is ready.
    """
    memory = get_memory_service()
    counts = await memory.get_training_data_count(db)

    return {
        "training_data": counts,
        "recommendation": (
            "Ready for fine-tuning! Run scripts/fine_tune.py"
            if counts["ready_for_finetune"]
            else f"Need {500 - counts['total']} more approved examples before fine-tuning"
        ),
    }


@router.get("")
async def list_outreach(
    outreach_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List outreach logs."""
    query = select(OutreachLog).order_by(OutreachLog.created_at.desc()).limit(limit)

    if outreach_type:
        query = query.where(OutreachLog.outreach_type == outreach_type + "_outreach")
    if status:
        query = query.where(OutreachLog.status == status)

    result = await db.execute(query)
    logs = result.scalars().all()

    return {
        "outreach": [
            {
                "id": str(log.id),
                "outreach_type": log.outreach_type.value,
                "message_type": log.message_type,
                "subject": log.subject,
                "model_draft": log.model_draft[:200] + "..." if len(log.model_draft) > 200 else log.model_draft,
                "user_final": log.user_final[:200] + "..." if log.user_final and len(log.user_final) > 200 else log.user_final,
                "feedback_tags": log.feedback_tags,
                "approved": log.user_approved,
                "status": log.status.value,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ]
    }


def _job_to_dict(job: Job) -> dict:
    return {
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "skills_required": job.skills_required,
        "location": job.location,
        "remote_policy": job.remote_policy,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "salary_currency": job.salary_currency,
    }


def _candidate_to_dict(candidate: Candidate) -> dict:
    return {
        "name": candidate.name,
        "current_title": candidate.current_title,
        "current_company": candidate.current_company,
        "years_experience": candidate.years_experience,
        "location": candidate.location,
        "skills": candidate.skills,
        "summary": candidate.summary,
    }


def _client_to_dict(client: Client) -> dict:
    return {
        "company_name": client.company_name,
        "industry": client.industry,
        "company_size": client.company_size,
        "headquarters": client.headquarters,
        "primary_contact_name": client.primary_contact_name,
        "contacts": client.contacts,
        "icp_match_reasons": client.icp_match_reasons,
    }
