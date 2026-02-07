"""Autonomous recruiting brain agent."""
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.job import Job
from src.models.candidate import Candidate
from src.models.task import Task, TaskType, TaskStatus
from src.models.outreach import OutreachLog, OutreachType, MessageType
from src.agents.jd_analyst import JDAnalyst
from src.agents.resume_analyst import ResumeAnalyst
from src.agents.fit_scorer import FitScorer
from src.agents.outreach import OutreachAgent
from src.services.llm import LLMService, get_llm

logger = logging.getLogger(__name__)


class AutonomousRecruiter:
    """
    Autonomous recruiting brain that works continuously.

    This agent:
    1. Sources candidates for active jobs
    2. Scores candidates against jobs
    3. Generates personalized outreach
    4. Analyzes feedback to improve
    5. Provides market intelligence
    """

    def __init__(self, llm: LLMService = None):
        self.llm = llm or get_llm()
        self.jd_analyst = JDAnalyst(self.llm)
        self.resume_analyst = ResumeAnalyst(self.llm)
        self.fit_scorer = FitScorer(self.llm)
        self.outreach_agent = OutreachAgent(self.llm)

    async def handle_source_candidates(
        self,
        db: AsyncSession,
        task: Task,
        job_id: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Find and analyze potential candidates for a job.

        This is where you would integrate with:
        - LinkedIn API
        - Resume databases
        - Job board APIs
        - Internal candidate database
        """
        if not job_id:
            raise ValueError("job_id required for sourcing")

        # Get the job
        result = await db.execute(select(Job).where(Job.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            raise ValueError(f"Job {job_id} not found")

        logger.info(f"Sourcing candidates for: {job.title} at {job.company}")

        # In a real implementation, this would:
        # 1. Search LinkedIn/Indeed/etc for matching candidates
        # 2. Parse their profiles/resumes
        # 3. Store them in the candidates table
        # 4. Create scoring tasks for each candidate

        # For now, score existing unscored candidates
        result = await db.execute(
            select(Candidate)
            .where(Candidate.fit_score.is_(None))
            .limit(10)
        )
        candidates = result.scalars().all()

        scored_count = 0
        for candidate in candidates:
            # Score the candidate
            score_result = await self.fit_scorer.run({
                "job": {
                    "title": job.title,
                    "company": job.company,
                    "required_skills": job.required_skills,
                    "nice_to_have": job.nice_to_have,
                    "min_experience": job.min_experience,
                },
                "candidate": {
                    "name": candidate.name,
                    "current_title": candidate.current_title,
                    "skills": candidate.skills,
                    "years_experience": candidate.years_experience,
                    "summary": candidate.summary,
                }
            })

            if score_result.success:
                candidate.fit_score = score_result.data.get("overall_score", 0) / 100
                candidate.fit_reasoning = score_result.data.get("summary", "")
                scored_count += 1

        await db.commit()

        return {
            "job_id": job_id,
            "candidates_found": len(candidates),
            "candidates_scored": scored_count,
            "message": f"Scored {scored_count} candidates for {job.title}"
        }

    async def handle_score_candidates(
        self,
        db: AsyncSession,
        task: Task,
        job_id: str = None,
        candidate_id: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Score one or more candidates against a job."""
        if not job_id:
            raise ValueError("job_id required for scoring")

        # Get job
        job = await db.get(Job, job_id)
        if not job:
            raise ValueError(f"Job {job_id} not found")

        # Get candidate(s)
        if candidate_id:
            candidate = await db.get(Candidate, candidate_id)
            candidates = [candidate] if candidate else []
        else:
            # Score all unscored candidates
            result = await db.execute(
                select(Candidate).where(Candidate.fit_score.is_(None)).limit(20)
            )
            candidates = result.scalars().all()

        scored = []
        for candidate in candidates:
            result = await self.fit_scorer.run({
                "job": {
                    "title": job.title,
                    "company": job.company,
                    "required_skills": job.required_skills,
                    "nice_to_have": job.nice_to_have,
                },
                "candidate": {
                    "name": candidate.name,
                    "skills": candidate.skills,
                    "years_experience": candidate.years_experience,
                }
            })

            if result.success:
                candidate.fit_score = result.data.get("overall_score", 0) / 100
                candidate.fit_reasoning = result.data.get("summary", "")
                scored.append({
                    "candidate_id": str(candidate.id),
                    "name": candidate.name,
                    "score": candidate.fit_score,
                })

        await db.commit()

        return {
            "job_id": job_id,
            "scored_candidates": scored,
            "count": len(scored)
        }

    async def handle_generate_outreach(
        self,
        db: AsyncSession,
        task: Task,
        job_id: str = None,
        candidate_id: str = None,
        parameters: dict = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate outreach for high-scoring candidates."""
        if not job_id:
            raise ValueError("job_id required for outreach generation")

        job = await db.get(Job, job_id)
        if not job:
            raise ValueError(f"Job {job_id} not found")

        # Get candidates to reach out to
        min_score = (parameters or {}).get("min_score", 0.7)

        if candidate_id:
            candidate = await db.get(Candidate, candidate_id)
            candidates = [candidate] if candidate else []
        else:
            result = await db.execute(
                select(Candidate)
                .where(Candidate.fit_score >= min_score)
                .order_by(Candidate.fit_score.desc())
                .limit(10)
            )
            candidates = result.scalars().all()

        generated = []
        for candidate in candidates:
            # Check if outreach already exists
            existing = await db.execute(
                select(OutreachLog)
                .where(
                    OutreachLog.candidate_id == candidate.id,
                    OutreachLog.job_id == job.id,
                )
            )
            if existing.scalar_one_or_none():
                continue  # Skip if already reached out

            # Generate outreach
            result = await self.outreach_agent.run(
                db=db,
                outreach_type=OutreachType.CANDIDATE,
                job_id=str(job.id),
                candidate_id=str(candidate.id),
                message_type=MessageType.INITIAL,
            )

            if result.success:
                generated.append({
                    "candidate_id": str(candidate.id),
                    "candidate_name": candidate.name,
                    "preview": result.data.get("message", "")[:100] + "..."
                })

        return {
            "job_id": job_id,
            "generated_count": len(generated),
            "outreach": generated
        }

    async def handle_improve_outreach(
        self,
        db: AsyncSession,
        task: Task,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Analyze feedback patterns and suggest improvements.

        This task:
        1. Analyzes approved vs rejected outreach
        2. Identifies common edit patterns
        3. Suggests prompt improvements
        """
        # Get recent approved and rejected outreach
        result = await db.execute(
            select(OutreachLog)
            .where(OutreachLog.user_final.isnot(None))
            .order_by(OutreachLog.created_at.desc())
            .limit(50)
        )
        logs = result.scalars().all()

        if not logs:
            return {"message": "No feedback data yet"}

        # Analyze patterns
        approved = [l for l in logs if l.user_approved]
        rejected = [l for l in logs if not l.user_approved]

        # Collect all feedback tags
        all_tags = []
        for log in approved:
            if log.feedback_tags:
                all_tags.extend(log.feedback_tags)

        # Count tag frequency
        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

        # Ask LLM to analyze patterns
        analysis_prompt = f"""Analyze these outreach feedback patterns:

Approved messages: {len(approved)}
Rejected messages: {len(rejected)}
Common feedback tags: {tag_counts}

Sample approved message edits:
{chr(10).join([f"- Original: {l.ai_generated[:100]}... -> Final: {l.user_final[:100]}..." for l in approved[:3]])}

Suggest 3-5 specific improvements for future outreach generation."""

        response = await self.llm.generate([
            {"role": "system", "content": "You are an outreach optimization expert."},
            {"role": "user", "content": analysis_prompt}
        ])

        return {
            "approved_count": len(approved),
            "rejected_count": len(rejected),
            "top_feedback_tags": dict(sorted(tag_counts.items(), key=lambda x: -x[1])[:10]),
            "analysis": response.content
        }

    async def handle_market_intel(
        self,
        db: AsyncSession,
        task: Task,
        job_id: str = None,
        parameters: dict = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Gather market intelligence for a role or industry.

        In a real implementation, this would:
        1. Analyze salary data
        2. Track hiring trends
        3. Monitor competitor activity
        4. Identify skill demand changes
        """
        params = parameters or {}
        industry = params.get("industry", "technology")
        role = params.get("role", "software engineer")

        # Use LLM to generate market analysis
        prompt = f"""Provide market intelligence for hiring {role} roles in {industry}:

1. Current talent market conditions
2. Typical salary ranges
3. Key skills in demand
4. Hiring challenges
5. Recommended sourcing strategies

Be specific and actionable."""

        response = await self.llm.generate([
            {"role": "system", "content": "You are a recruiting market analyst."},
            {"role": "user", "content": prompt}
        ])

        return {
            "industry": industry,
            "role": role,
            "analysis": response.content,
            "generated_at": datetime.utcnow().isoformat()
        }

    async def handle_analyze_feedback(
        self,
        db: AsyncSession,
        task: Task,
        **kwargs
    ) -> Dict[str, Any]:
        """Analyze user feedback to extract learning patterns."""
        # Get feedback stats
        result = await db.execute(
            select(
                func.count(OutreachLog.id).label("total"),
                func.sum(func.cast(OutreachLog.user_approved, db.bind.dialect.name == 'postgresql' and "INTEGER" or "INT")).label("approved")
            )
            .where(OutreachLog.user_final.isnot(None))
        )
        stats = result.one()

        total = stats[0] or 0
        approved = stats[1] or 0
        approval_rate = approved / total if total > 0 else 0

        # Get tag distributions
        result = await db.execute(
            select(OutreachLog.feedback_tags)
            .where(OutreachLog.feedback_tags.isnot(None))
        )
        all_tags = []
        for row in result:
            if row[0]:
                all_tags.extend(row[0])

        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

        return {
            "total_feedback": total,
            "approved": approved,
            "approval_rate": round(approval_rate * 100, 1),
            "top_tags": dict(sorted(tag_counts.items(), key=lambda x: -x[1])[:10]),
            "ready_for_finetune": total >= 500
        }


# Create singleton
_recruiter: Optional[AutonomousRecruiter] = None


def get_autonomous_recruiter() -> AutonomousRecruiter:
    """Get or create autonomous recruiter instance."""
    global _recruiter
    if _recruiter is None:
        _recruiter = AutonomousRecruiter()
    return _recruiter


def register_task_handlers(scheduler):
    """Register all task handlers with the scheduler."""
    recruiter = get_autonomous_recruiter()

    scheduler.register_handler(TaskType.SOURCE_CANDIDATES, recruiter.handle_source_candidates)
    scheduler.register_handler(TaskType.SCORE_CANDIDATES, recruiter.handle_score_candidates)
    scheduler.register_handler(TaskType.GENERATE_OUTREACH, recruiter.handle_generate_outreach)
    scheduler.register_handler(TaskType.IMPROVE_OUTREACH, recruiter.handle_improve_outreach)
    scheduler.register_handler(TaskType.MARKET_INTEL, recruiter.handle_market_intel)
    scheduler.register_handler(TaskType.ANALYZE_FEEDBACK, recruiter.handle_analyze_feedback)

    logger.info("Registered autonomous recruiter task handlers")
