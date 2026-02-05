"""Agent implementations."""
from src.agents.base import Agent
from src.agents.jd_analyst import JDAnalystAgent
from src.agents.resume_analyst import ResumeAnalystAgent
from src.agents.fit_scorer import FitScorerAgent
from src.agents.outreach import OutreachAgent

__all__ = [
    "Agent",
    "JDAnalystAgent",
    "ResumeAnalystAgent",
    "FitScorerAgent",
    "OutreachAgent",
]
