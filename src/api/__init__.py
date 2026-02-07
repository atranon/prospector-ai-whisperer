"""API routes."""
from fastapi import APIRouter

from src.api import jobs, candidates, clients, outreach, health, tasks, chat, coding

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
router.include_router(clients.router, prefix="/clients", tags=["clients"])
router.include_router(outreach.router, prefix="/outreach", tags=["outreach"])
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(coding.router, prefix="/coding", tags=["coding"])
