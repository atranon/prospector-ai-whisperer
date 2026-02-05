"""Main FastAPI application."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from src.config import settings
from src.database import engine, Base
from src.api import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


async def check_pgvector(conn) -> bool:
    """Check if pgvector extension is available."""
    try:
        result = await conn.execute(text("SELECT 1 FROM pg_extension WHERE extname = 'vector'"))
        return result.fetchone() is not None
    except Exception:
        return False


def create_tables(conn, has_pgvector: bool):
    """Create database tables."""
    if has_pgvector:
        Base.metadata.create_all(conn)
    else:
        # Skip embeddings table if pgvector not available
        tables = [t for t in Base.metadata.sorted_tables if t.name != "embeddings"]
        Base.metadata.create_all(conn, tables=tables)
        logger.warning("pgvector not available - embeddings table skipped")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info("Starting Recruiting Brain...")

    # Create database tables
    async with engine.begin() as conn:
        has_pgvector = await check_pgvector(conn)
        await conn.run_sync(lambda c: create_tables(c, has_pgvector))

    logger.info("Database tables created")
    yield

    # Cleanup
    await engine.dispose()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Recruiting Brain",
    description="""
Self-hosted AI recruiting assistant.

## Features

- **JD Analysis**: Parse job descriptions into structured data
- **Resume Analysis**: Extract candidate information from resumes
- **Fit Scoring**: AI-powered candidate-job fit evaluation
- **Outreach Generation**: Personalized messages that learn from your edits
- **Vector Search**: Semantic search across jobs, candidates, and clients

## Learning System

The outreach generator learns from your feedback:
1. Edit the generated message
2. Add feedback tags (e.g., "shorter", "more_direct")
3. Mark as approved for training
4. System improves over time

After 500+ approved examples, run fine-tuning for permanent model improvement.
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Recruiting Brain",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }
