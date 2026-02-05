"""Resume/Profile Analyst Agent."""
from dataclasses import dataclass
from typing import Optional

from src.agents.base import Agent


@dataclass
class ResumeAnalystInput:
    """Input for resume analysis."""
    resume_text: str
    source: Optional[str] = None  # linkedin, resume, github, etc.


@dataclass
class ResumeAnalystOutput:
    """Structured output from resume analysis."""
    name: str
    email: Optional[str]
    phone: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    current_title: Optional[str]
    current_company: Optional[str]
    years_experience: Optional[int]
    location: Optional[str]
    skills: list[str]
    domains: list[str]
    previous_companies: list[str]
    education: list[dict]
    work_history: list[dict]
    summary: str
    strengths: list[str]
    seniority_level: Optional[str]
    career_trajectory: str


class ResumeAnalystAgent(Agent[ResumeAnalystInput, ResumeAnalystOutput]):
    """
    Agent for analyzing resumes and profiles.

    Parses resume/LinkedIn text into structured fields and generates:
    - Professional summary
    - Key strengths
    - Career trajectory analysis
    """

    @property
    def system_prompt(self) -> str:
        return """You are an expert recruiting analyst specializing in candidate evaluation.
Your job is to analyze resumes, CVs, and professional profiles to extract structured information
and provide insights about the candidate.

You will:
1. Extract contact and professional information
2. Parse work history and education
3. Identify key skills and domains of expertise
4. Assess seniority level and career trajectory
5. Summarize strengths and potential

Always respond with valid JSON matching the required schema."""

    def build_user_prompt(self, input_data: ResumeAnalystInput) -> str:
        source_hint = f"(Source: {input_data.source})" if input_data.source else ""

        return f"""Analyze this professional profile/resume {source_hint}:

---
{input_data.resume_text}
---

Extract the following information and return as JSON:

{{
  "name": "full name",
  "email": "email or null",
  "phone": "phone or null",
  "linkedin_url": "linkedin URL or null",
  "github_url": "github URL or null",
  "current_title": "current job title or null",
  "current_company": "current company or null",
  "years_experience": integer total years or null,
  "location": "location or null",
  "skills": ["list", "of", "technical", "and", "professional", "skills"],
  "domains": ["industries", "or", "domains", "worked", "in"],
  "previous_companies": ["list", "of", "past", "employers"],
  "education": [
    {{"degree": "degree", "school": "school", "year": "year or null", "field": "field of study"}}
  ],
  "work_history": [
    {{
      "title": "job title",
      "company": "company",
      "duration": "duration (e.g., '2 years' or '2020-2022')",
      "description": "brief description of role and achievements"
    }}
  ],
  "summary": "2-3 sentence professional summary of the candidate",
  "strengths": ["list", "of", "key", "strengths", "and", "achievements"],
  "seniority_level": "junior|mid|senior|lead|principal|director|vp|c-level or null",
  "career_trajectory": "brief analysis of career progression and likely next steps"
}}"""

    def parse_response(self, response: str) -> ResumeAnalystOutput:
        data = self.extract_json(response)

        return ResumeAnalystOutput(
            name=data.get("name", ""),
            email=data.get("email"),
            phone=data.get("phone"),
            linkedin_url=data.get("linkedin_url"),
            github_url=data.get("github_url"),
            current_title=data.get("current_title"),
            current_company=data.get("current_company"),
            years_experience=data.get("years_experience"),
            location=data.get("location"),
            skills=data.get("skills", []),
            domains=data.get("domains", []),
            previous_companies=data.get("previous_companies", []),
            education=data.get("education", []),
            work_history=data.get("work_history", []),
            summary=data.get("summary", ""),
            strengths=data.get("strengths", []),
            seniority_level=data.get("seniority_level"),
            career_trajectory=data.get("career_trajectory", ""),
        )
