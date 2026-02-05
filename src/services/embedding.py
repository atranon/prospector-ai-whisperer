"""Embedding service for vector operations."""
import hashlib
import logging
from typing import Optional
from uuid import UUID

import httpx
import numpy as np
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import settings
from src.models.embedding import Embedding, EmbeddingType, PGVECTOR_AVAILABLE

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service for generating and managing embeddings.

    Uses Ollama for embedding generation (nomic-embed-text by default).
    Stores embeddings in PostgreSQL with pgvector for similarity search.
    """

    def __init__(
        self,
        base_url: str = None,
        model: str = None,
    ):
        self.base_url = base_url or settings.llm_base_url
        self.model = model or settings.embedding_model
        self.dimensions = settings.embedding_dimensions

    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generate embedding vector for text using Ollama.

        Args:
            text: Text to embed

        Returns:
            List of floats representing the embedding vector
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/api/embeddings",
                json={"model": self.model, "prompt": text},
            )
            response.raise_for_status()
            data = response.json()
            return data["embedding"]

    async def store_embedding(
        self,
        db: AsyncSession,
        source_type: EmbeddingType,
        source_id: UUID,
        text: str,
        metadata: dict = None,
    ) -> Optional[Embedding]:
        """
        Generate and store embedding for a document.

        Args:
            db: Database session
            source_type: Type of source (job, candidate, etc.)
            source_id: ID of the source document
            text: Text content to embed
            metadata: Optional metadata to store with embedding

        Returns:
            Created Embedding object or None if pgvector not available
        """
        if not PGVECTOR_AVAILABLE:
            logger.warning("pgvector not available - embedding not stored")
            return None

        # Generate content hash for deduplication
        content_hash = hashlib.sha256(text.encode()).hexdigest()

        # Check if embedding already exists
        existing = await db.execute(
            select(Embedding).where(
                Embedding.source_type == source_type,
                Embedding.source_id == source_id,
                Embedding.content_hash == content_hash,
            )
        )
        if existing.scalar_one_or_none():
            return None  # Already exists

        # Generate embedding
        embedding_vector = await self.generate_embedding(text)

        # Store in database
        embedding = Embedding(
            source_type=source_type,
            source_id=source_id,
            content_hash=content_hash,
            embedding=embedding_vector,
            metadata=metadata,
        )
        db.add(embedding)
        await db.flush()

        return embedding

    async def update_embedding(
        self,
        db: AsyncSession,
        source_type: EmbeddingType,
        source_id: UUID,
        text: str,
        metadata: dict = None,
    ) -> Optional[Embedding]:
        """
        Update embedding for a document (deletes old, creates new).
        """
        if not PGVECTOR_AVAILABLE:
            return None

        # Delete existing embeddings for this source
        await db.execute(
            delete(Embedding).where(
                Embedding.source_type == source_type,
                Embedding.source_id == source_id,
            )
        )

        # Create new embedding
        return await self.store_embedding(db, source_type, source_id, text, metadata)

    async def search_similar(
        self,
        db: AsyncSession,
        query_text: str,
        source_type: Optional[EmbeddingType] = None,
        limit: int = 10,
    ) -> list[tuple[UUID, float]]:
        """
        Search for similar documents using cosine similarity.

        Args:
            db: Database session
            query_text: Text to search for
            source_type: Optional filter by source type
            limit: Maximum number of results

        Returns:
            List of (source_id, similarity_score) tuples
        """
        if not PGVECTOR_AVAILABLE:
            logger.warning("pgvector not available - search not possible")
            return []

        # Generate query embedding
        query_embedding = await self.generate_embedding(query_text)

        # Build query with cosine distance
        from pgvector.sqlalchemy import Vector

        query = select(
            Embedding.source_id,
            Embedding.embedding.cosine_distance(query_embedding).label("distance"),
        )

        if source_type:
            query = query.where(Embedding.source_type == source_type)

        query = query.order_by("distance").limit(limit)

        result = await db.execute(query)
        rows = result.all()

        # Convert distance to similarity (1 - distance for cosine)
        return [(row.source_id, 1 - row.distance) for row in rows]

    async def check_health(self) -> bool:
        """Check if embedding service is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    models = [m["name"] for m in data.get("models", [])]
                    return self.model in models or any(self.model in m for m in models)
            return False
        except Exception as e:
            logger.warning(f"Embedding health check failed: {e}")
            return False


# Singleton instance
_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """Get or create embedding service instance."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service
