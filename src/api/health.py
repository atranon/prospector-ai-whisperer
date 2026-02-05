"""Health check endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.services.llm import get_llm
from src.services.embedding import get_embedding_service
from src.config import settings

router = APIRouter()


@router.get("")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Check health of all services.

    Returns status of:
    - Database connection
    - LLM service (Ollama/vLLM)
    - Embedding service
    """
    llm = get_llm()
    embedding = get_embedding_service()

    # Check database
    db_ok = False
    try:
        await db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        pass

    # Check LLM
    llm_ok = await llm.check_health()

    # Check embedding
    embedding_ok = await embedding.check_health()

    all_ok = db_ok and llm_ok
    status = "healthy" if all_ok else "degraded"

    return {
        "status": status,
        "services": {
            "database": {"available": db_ok},
            "llm": {
                "available": llm_ok,
                "provider": settings.llm_provider,
                "model": settings.llm_model,
            },
            "embedding": {
                "available": embedding_ok,
                "model": settings.embedding_model,
            },
        },
    }
