"""Candidate management API endpoints."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.candidate import Candidate, CandidateStatus
from src.models.job import Job
from src.models.embedding import EmbeddingType
from src.agents import ResumeAnalystAgent, FitScorerAgent
from src.agents.resume_analyst import ResumeAnalystInput
from src.agents.fit_scorer import FitScorerInput
from src.services.embedding import get_embedding_service

router = APIRouter()


class AnalyzeResumeRequest(BaseModel):
    """Request to analyze a resume."""
    resume_text: str
    source: Optional[str] = None  # linkedin, resume, github


class ScoreFitRequest(BaseModel):
    """Request to score candidate-job fit."""
    candidate_id: str
    job_id: str
    notes: Optional[str] = None


@router.post("/analyze")
async def analyze_resume(
    request: AnalyzeResumeRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze a resume/profile using AI.

    Parses the text and extracts:
    - Structured candidate information
    - Skills and experience
    - Career trajectory analysis
    """
    agent = ResumeAnalystAgent(verbose=True)
    result = await agent.run(ResumeAnalystInput(
        resume_text=request.resume_text,
        source=request.source,
    ))

    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)

    data = result.data

    # Create candidate record
    candidate = Candidate(
        name=data.name,
        email=data.email,
        phone=data.phone,
        linkedin_url=data.linkedin_url,
        github_url=data.github_url,
        resume_text=request.resume_text,
        source=request.source,
        current_title=data.current_title,
        current_company=data.current_company,
        years_experience=data.years_experience,
        location=data.location,
        skills=data.skills,
        domains=data.domains,
        previous_companies=data.previous_companies,
        education=data.education,
        work_history=data.work_history,
        summary=data.summary,
        strengths=data.strengths,
        seniority_level=data.seniority_level,
        career_trajectory=data.career_trajectory,
        status=CandidateStatus.NEW,
    )
    db.add(candidate)
    await db.flush()

    # Generate embedding
    embedding_service = get_embedding_service()
    embedding_text = f"{data.name}. {data.current_title} at {data.current_company}. {data.summary}. Skills: {', '.join(data.skills)}"
    try:
        await embedding_service.store_embedding(
            db, EmbeddingType.CANDIDATE, candidate.id, embedding_text,
            metadata={"name": data.name, "title": data.current_title},
        )
    except Exception:
        pass

    return {
        "success": True,
        "candidate": _candidate_to_dict(candidate),
        "reasoning": result.reasoning,
    }


@router.post("/score-fit")
async def score_fit(
    request: ScoreFitRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Score how well a candidate fits a job.

    Returns:
    - Overall fit score (0-100)
    - Skills/experience/culture scores
    - Recommendation
    - Interview focus areas
    """
    # Get candidate
    result = await db.execute(
        select(Candidate).where(Candidate.id == UUID(request.candidate_id))
    )
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Get job
    result = await db.execute(
        select(Job).where(Job.id == UUID(request.job_id))
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Score fit
    agent = FitScorerAgent(verbose=True)
    result = await agent.run(FitScorerInput(
        job=_job_to_dict(job),
        candidate=_candidate_to_dict(candidate),
        notes=request.notes,
    ))

    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)

    data = result.data

    return {
        "success": True,
        "fit_score": {
            "overall_score": data.overall_score,
            "skills_match_score": data.skills_match_score,
            "experience_match_score": data.experience_match_score,
            "culture_fit_score": data.culture_fit_score,
            "recommendation": data.recommendation,
            "match_reasons": data.match_reasons,
            "concerns": data.concerns,
            "missing_skills": data.missing_skills,
            "exceeds_requirements": data.exceeds_requirements,
            "interview_focus_areas": data.interview_focus_areas,
            "summary": data.summary,
        },
        "reasoning": result.reasoning,
    }


@router.get("")
async def list_candidates(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all candidates, optionally filtered by status."""
    query = select(Candidate).order_by(Candidate.created_at.desc())

    if status:
        query = query.where(Candidate.status == status)

    result = await db.execute(query)
    candidates = result.scalars().all()

    return {"candidates": [_candidate_to_dict(c) for c in candidates]}


@router.get("/{candidate_id}")
async def get_candidate(candidate_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific candidate by ID."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return {"candidate": _candidate_to_dict(candidate)}


@router.delete("/{candidate_id}")
async def delete_candidate(candidate_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a candidate."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    await db.delete(candidate)
    return {"success": True}


def _candidate_to_dict(candidate: Candidate) -> dict:
    """Convert candidate to dictionary."""
    return {
        "id": str(candidate.id),
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "linkedin_url": candidate.linkedin_url,
        "github_url": candidate.github_url,
        "source": candidate.source,
        "current_title": candidate.current_title,
        "current_company": candidate.current_company,
        "years_experience": candidate.years_experience,
        "location": candidate.location,
        "skills": candidate.skills,
        "domains": candidate.domains,
        "previous_companies": candidate.previous_companies,
        "education": candidate.education,
        "work_history": candidate.work_history,
        "summary": candidate.summary,
        "strengths": candidate.strengths,
        "seniority_level": candidate.seniority_level,
        "career_trajectory": candidate.career_trajectory,
        "status": candidate.status.value,
        "notes": candidate.notes,
        "created_at": candidate.created_at.isoformat(),
    }


def _job_to_dict(job: Job) -> dict:
    """Convert job to dictionary for fit scoring."""
    return {
        "id": str(job.id),
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "skills_required": job.skills_required,
        "skills_preferred": job.skills_preferred,
        "seniority_level": job.seniority_level,
        "location": job.location,
        "remote_policy": job.remote_policy,
        "industry": job.industry,
    }
