"""Job Description Analyst Agent."""
from dataclasses import dataclass
from typing import Optional

from src.agents.base import Agent


@dataclass
class JDAnalystInput:
    """Input for JD analysis."""
    raw_text: str
    company: Optional[str] = None


@dataclass
class JDAnalystOutput:
    """Structured output from JD analysis."""
    title: str
    company: str
    department: Optional[str]
    description: str
    skills_required: list[str]
    skills_preferred: list[str]
    responsibilities: list[str]
    qualifications: list[str]
    seniority_level: Optional[str]
    employment_type: Optional[str]
    industry: Optional[str]
    location: Optional[str]
    remote_policy: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    salary_currency: str
    ideal_candidate_profile: dict
    search_strategies: list[dict]


class JDAnalystAgent(Agent[JDAnalystInput, JDAnalystOutput]):
    """
    Agent for analyzing job descriptions.

    Parses raw JD text into structured fields and generates:
    - Ideal candidate profile
    - Search strategies for finding candidates
    """

    @property
    def system_prompt(self) -> str:
        return """You are an expert recruiting analyst. Your job is to analyze job descriptions and extract structured information.

You will:
1. Parse the job description into structured fields
2. Infer an "ideal candidate profile" based on the requirements
3. Suggest search strategies to find matching candidates

Always respond with valid JSON matching the required schema."""

    def build_user_prompt(self, input_data: JDAnalystInput) -> str:
        company_hint = f"(Company: {input_data.company})" if input_data.company else ""

        return f"""Analyze this job description {company_hint}:

---
{input_data.raw_text}
---

Extract the following information and return as JSON:

{{
  "title": "job title",
  "company": "company name",
  "department": "department if mentioned, null otherwise",
  "description": "brief summary of the role (2-3 sentences)",
  "skills_required": ["list", "of", "required", "skills"],
  "skills_preferred": ["list", "of", "preferred/nice-to-have", "skills"],
  "responsibilities": ["list", "of", "key", "responsibilities"],
  "qualifications": ["list", "of", "qualifications"],
  "seniority_level": "junior|mid|senior|lead|principal|director|vp|c-level or null",
  "employment_type": "full-time|part-time|contract|intern or null",
  "industry": "industry/domain or null",
  "location": "location or null",
  "remote_policy": "remote|hybrid|onsite or null",
  "salary_min": integer or null,
  "salary_max": integer or null,
  "salary_currency": "USD",
  "ideal_candidate_profile": {{
    "background": "ideal background description",
    "experience_years": "X-Y years",
    "must_have_skills": ["critical skills"],
    "nice_to_have_skills": ["bonus skills"],
    "target_companies": ["types of companies to source from"],
    "target_titles": ["titles to search for"],
    "red_flags": ["things that would disqualify a candidate"]
  }},
  "search_strategies": [
    {{
      "channel": "linkedin|github|stackoverflow|etc",
      "query": "search query or boolean string",
      "filters": {{"location": "", "experience": "", "etc": ""}}
    }}
  ]
}}"""

    def parse_response(self, response: str) -> JDAnalystOutput:
        data = self.extract_json(response)

        return JDAnalystOutput(
            title=data.get("title", ""),
            company=data.get("company", ""),
            department=data.get("department"),
            description=data.get("description", ""),
            skills_required=data.get("skills_required", []),
            skills_preferred=data.get("skills_preferred", []),
            responsibilities=data.get("responsibilities", []),
            qualifications=data.get("qualifications", []),
            seniority_level=data.get("seniority_level"),
            employment_type=data.get("employment_type"),
            industry=data.get("industry"),
            location=data.get("location"),
            remote_policy=data.get("remote_policy"),
            salary_min=data.get("salary_min"),
            salary_max=data.get("salary_max"),
            salary_currency=data.get("salary_currency", "USD"),
            ideal_candidate_profile=data.get("ideal_candidate_profile", {}),
            search_strategies=data.get("search_strategies", []),
        )
