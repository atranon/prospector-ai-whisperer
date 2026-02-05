"""Job management API endpoints."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.job import Job, JobStatus
from src.models.embedding import EmbeddingType
from src.agents import JDAnalystAgent
from src.agents.jd_analyst import JDAnalystInput
from src.services.embedding import get_embedding_service

router = APIRouter()


class AnalyzeJobRequest(BaseModel):
    """Request to analyze a job description."""
    raw_text: str
    company: Optional[str] = None


class JobResponse(BaseModel):
    """Job response."""
    id: str
    title: str
    company: str
    description: Optional[str]
    skills_required: list[str]
    skills_preferred: list[str]
    seniority_level: Optional[str]
    location: Optional[str]
    remote_policy: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    ideal_candidate_profile: Optional[dict]
    search_strategies: Optional[list]
    status: str
    created_at: str

    class Config:
        from_attributes = True


@router.post("/analyze")
async def analyze_job(
    request: AnalyzeJobRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze a job description using AI.

    Parses the JD text and extracts:
    - Structured job information
    - Ideal candidate profile
    - Search strategies for sourcing
    """
    agent = JDAnalystAgent(verbose=True)
    result = await agent.run(JDAnalystInput(
        raw_text=request.raw_text,
        company=request.company,
    ))

    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)

    data = result.data

    # Create job record
    job = Job(
        title=data.title,
        company=data.company,
        department=data.department,
        raw_text=request.raw_text,
        description=data.description,
        skills_required=data.skills_required,
        skills_preferred=data.skills_preferred,
        responsibilities=data.responsibilities,
        qualifications=data.qualifications,
        seniority_level=data.seniority_level,
        employment_type=data.employment_type,
        industry=data.industry,
        location=data.location,
        remote_policy=data.remote_policy,
        salary_min=data.salary_min,
        salary_max=data.salary_max,
        salary_currency=data.salary_currency,
        ideal_candidate_profile=data.ideal_candidate_profile,
        search_strategies=data.search_strategies,
        status=JobStatus.ACTIVE,
    )
    db.add(job)
    await db.flush()

    # Generate embedding for semantic search
    embedding_service = get_embedding_service()
    embedding_text = f"{data.title} at {data.company}. {data.description}. Skills: {', '.join(data.skills_required)}"
    try:
        await embedding_service.store_embedding(
            db, EmbeddingType.JOB, job.id, embedding_text,
            metadata={"title": data.title, "company": data.company},
        )
    except Exception as e:
        # Non-fatal
        pass

    return {
        "success": True,
        "job": _job_to_dict(job),
        "reasoning": result.reasoning,
    }


@router.get("")
async def list_jobs(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all jobs, optionally filtered by status."""
    query = select(Job).order_by(Job.created_at.desc())

    if status:
        query = query.where(Job.status == status)

    result = await db.execute(query)
    jobs = result.scalars().all()

    return {"jobs": [_job_to_dict(j) for j in jobs]}


@router.get("/{job_id}")
async def get_job(job_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific job by ID."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"job": _job_to_dict(job)}


@router.delete("/{job_id}")
async def delete_job(job_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a job."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    await db.delete(job)
    return {"success": True}


def _job_to_dict(job: Job) -> dict:
    """Convert job to dictionary."""
    return {
        "id": str(job.id),
        "title": job.title,
        "company": job.company,
        "department": job.department,
        "description": job.description,
        "skills_required": job.skills_required,
        "skills_preferred": job.skills_preferred,
        "responsibilities": job.responsibilities,
        "qualifications": job.qualifications,
        "seniority_level": job.seniority_level,
        "employment_type": job.employment_type,
        "industry": job.industry,
        "location": job.location,
        "remote_policy": job.remote_policy,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "salary_currency": job.salary_currency,
        "ideal_candidate_profile": job.ideal_candidate_profile,
        "search_strategies": job.search_strategies,
        "status": job.status.value,
        "created_at": job.created_at.isoformat(),
    }
