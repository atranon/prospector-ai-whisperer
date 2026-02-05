"""Candidate-Job Fit Scorer Agent."""
from dataclasses import dataclass
from typing import Optional

from src.agents.base import Agent


@dataclass
class FitScorerInput:
    """Input for fit scoring."""
    job: dict  # Structured job data
    candidate: dict  # Structured candidate data
    notes: Optional[str] = None


@dataclass
class FitScorerOutput:
    """Output from fit scoring."""
    overall_score: int  # 0-100
    skills_match_score: int  # 0-100
    experience_match_score: int  # 0-100
    culture_fit_score: int  # 0-100
    recommendation: str  # strong_yes, yes, maybe, no, strong_no
    match_reasons: list[str]
    concerns: list[str]
    missing_skills: list[str]
    exceeds_requirements: list[str]
    interview_focus_areas: list[str]
    summary: str


class FitScorerAgent(Agent[FitScorerInput, FitScorerOutput]):
    """
    Agent for scoring candidate-job fit.

    Evaluates how well a candidate matches a job based on:
    - Skills match
    - Experience level
    - Domain/industry experience
    - Potential culture fit

    Provides reasoning for the score and suggestions for interview focus.
    """

    @property
    def system_prompt(self) -> str:
        return """You are an expert recruiting analyst specializing in candidate-job fit evaluation.
Your job is to objectively assess how well a candidate matches a job opportunity.

You will:
1. Compare required skills vs candidate skills
2. Evaluate experience level alignment
3. Consider domain/industry relevance
4. Identify strengths, gaps, and concerns
5. Provide actionable interview focus areas

Be objective and thorough in your analysis. Scores should be calibrated:
- 80-100: Excellent match, strong hire signal
- 60-79: Good match, worth interviewing
- 40-59: Moderate match, consider if pipeline is thin
- 20-39: Weak match, significant gaps
- 0-19: Poor match, likely not suitable

Always respond with valid JSON matching the required schema."""

    def build_user_prompt(self, input_data: FitScorerInput) -> str:
        job = input_data.job
        candidate = input_data.candidate

        job_section = f"""JOB:
- Title: {job.get('title', 'N/A')}
- Company: {job.get('company', 'N/A')}
- Required Skills: {', '.join(job.get('skills_required', []))}
- Preferred Skills: {', '.join(job.get('skills_preferred', []))}
- Seniority: {job.get('seniority_level', 'N/A')}
- Location: {job.get('location', 'N/A')} ({job.get('remote_policy', 'N/A')})
- Industry: {job.get('industry', 'N/A')}"""

        candidate_section = f"""CANDIDATE:
- Name: {candidate.get('name', 'N/A')}
- Current: {candidate.get('current_title', 'N/A')} at {candidate.get('current_company', 'N/A')}
- Experience: {candidate.get('years_experience', 'N/A')} years
- Skills: {', '.join(candidate.get('skills', []))}
- Domains: {', '.join(candidate.get('domains', []))}
- Location: {candidate.get('location', 'N/A')}
- Seniority: {candidate.get('seniority_level', 'N/A')}"""

        notes_section = f"\nADDITIONAL NOTES:\n{input_data.notes}" if input_data.notes else ""

        return f"""Evaluate the fit between this candidate and job:

{job_section}

{candidate_section}
{notes_section}

Provide a detailed fit analysis as JSON:

{{
  "overall_score": 0-100,
  "skills_match_score": 0-100,
  "experience_match_score": 0-100,
  "culture_fit_score": 0-100,
  "recommendation": "strong_yes|yes|maybe|no|strong_no",
  "match_reasons": ["reasons why this candidate is a good fit"],
  "concerns": ["potential concerns or red flags"],
  "missing_skills": ["required skills the candidate lacks"],
  "exceeds_requirements": ["areas where candidate exceeds expectations"],
  "interview_focus_areas": ["topics to probe during interview"],
  "summary": "2-3 sentence summary of the fit assessment"
}}"""

    def parse_response(self, response: str) -> FitScorerOutput:
        data = self.extract_json(response)

        return FitScorerOutput(
            overall_score=data.get("overall_score", 0),
            skills_match_score=data.get("skills_match_score", 0),
            experience_match_score=data.get("experience_match_score", 0),
            culture_fit_score=data.get("culture_fit_score", 0),
            recommendation=data.get("recommendation", "maybe"),
            match_reasons=data.get("match_reasons", []),
            concerns=data.get("concerns", []),
            missing_skills=data.get("missing_skills", []),
            exceeds_requirements=data.get("exceeds_requirements", []),
            interview_focus_areas=data.get("interview_focus_areas", []),
            summary=data.get("summary", ""),
        )
