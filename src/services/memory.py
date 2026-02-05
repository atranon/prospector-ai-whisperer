"""Memory service for learning from user feedback."""
import json
import logging
from typing import Optional
from collections import Counter

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import settings
from src.models.outreach import OutreachLog, OutreachType
from src.services.embedding import get_embedding_service, EmbeddingType

logger = logging.getLogger(__name__)


class MemoryService:
    """
    Memory service for retrieval-augmented generation.

    This implements the "learning" behavior without model training:
    1. Stores all outreach interactions with user feedback
    2. Retrieves similar past examples when generating new outreach
    3. Extracts style rules from recurring feedback patterns
    4. Builds few-shot prompts from user-approved examples
    """

    def __init__(self, top_k: int = None):
        self.top_k = top_k or settings.memory_top_k
        self.embedding_service = get_embedding_service()

    async def log_outreach(
        self,
        db: AsyncSession,
        outreach_type: OutreachType,
        input_context: dict,
        model_draft: str,
        job_id: str = None,
        candidate_id: str = None,
        client_id: str = None,
        subject: str = None,
        message_type: str = "initial",
    ) -> OutreachLog:
        """
        Log an outreach interaction for future learning.

        Args:
            db: Database session
            outreach_type: Type of outreach (candidate or client)
            input_context: Full context used to generate the message
            model_draft: The model's generated draft
            job_id: Associated job ID
            candidate_id: Associated candidate ID
            client_id: Associated client ID
            subject: Email subject
            message_type: Type of message (initial, follow_up, nurture)

        Returns:
            Created OutreachLog object
        """
        from uuid import UUID

        log = OutreachLog(
            outreach_type=outreach_type,
            input_context=input_context,
            model_draft=model_draft,
            job_id=UUID(job_id) if job_id else None,
            candidate_id=UUID(candidate_id) if candidate_id else None,
            client_id=UUID(client_id) if client_id else None,
            subject=subject,
            message_type=message_type,
        )
        db.add(log)
        await db.flush()

        return log

    async def update_with_feedback(
        self,
        db: AsyncSession,
        outreach_id: str,
        user_final: str,
        feedback_tags: list[str] = None,
        approved: bool = False,
    ) -> OutreachLog:
        """
        Update outreach log with user's edited version and feedback.

        This is called when the user edits the model's draft and saves it.
        The edited version becomes a training example for future generations.

        Args:
            db: Database session
            outreach_id: ID of the outreach log
            user_final: User's final edited message
            feedback_tags: Tags describing changes made (e.g., "shorter", "more direct")
            approved: Whether user explicitly approved this for training

        Returns:
            Updated OutreachLog object
        """
        from uuid import UUID

        result = await db.execute(
            select(OutreachLog).where(OutreachLog.id == UUID(outreach_id))
        )
        log = result.scalar_one_or_none()

        if not log:
            raise ValueError(f"Outreach log {outreach_id} not found")

        log.user_final = user_final
        log.feedback_tags = feedback_tags or []
        log.user_approved = approved

        # Store embedding for the context + final message for RAG retrieval
        context_text = self._serialize_context(log.input_context)
        combined_text = f"{context_text}\n\nFinal message:\n{user_final}"

        await self.embedding_service.update_embedding(
            db,
            EmbeddingType.OUTREACH,
            log.id,
            combined_text,
            metadata={
                "outreach_type": log.outreach_type.value,
                "message_type": log.message_type,
                "approved": approved,
            },
        )

        return log

    async def retrieve_similar_examples(
        self,
        db: AsyncSession,
        input_context: dict,
        outreach_type: OutreachType,
        limit: int = None,
    ) -> list[dict]:
        """
        Retrieve similar past outreach examples for few-shot prompting.

        Args:
            db: Database session
            input_context: Current context to match against
            outreach_type: Type of outreach to filter by
            limit: Maximum number of examples

        Returns:
            List of example dicts with context, final message, and feedback
        """
        k = limit or self.top_k
        context_text = self._serialize_context(input_context)

        # Search for similar embeddings
        similar_ids = await self.embedding_service.search_similar(
            db,
            context_text,
            source_type=EmbeddingType.OUTREACH,
            limit=k * 2,  # Get more than needed, filter by type
        )

        if not similar_ids:
            return []

        # Fetch the actual outreach logs
        from uuid import UUID

        result = await db.execute(
            select(OutreachLog).where(
                OutreachLog.id.in_([UUID(str(sid)) for sid, _ in similar_ids]),
                OutreachLog.outreach_type == outreach_type,
                OutreachLog.user_final.isnot(None),  # Only examples with user edits
            )
        )
        logs = result.scalars().all()

        # Sort by similarity and return formatted examples
        id_to_score = {str(sid): score for sid, score in similar_ids}
        logs_sorted = sorted(logs, key=lambda x: id_to_score.get(str(x.id), 0), reverse=True)

        examples = []
        for log in logs_sorted[:k]:
            examples.append({
                "context_summary": self._summarize_context(log.input_context),
                "final_message": log.user_final,
                "feedback_tags": log.feedback_tags,
                "similarity": id_to_score.get(str(log.id), 0),
            })

        return examples

    async def get_style_rules(
        self,
        db: AsyncSession,
        outreach_type: OutreachType,
        min_count: int = 3,
    ) -> list[str]:
        """
        Extract recurring style rules from feedback tags.

        Analyzes all feedback tags to find patterns the user consistently applies,
        turning them into explicit rules for the system prompt.

        Args:
            db: Database session
            outreach_type: Type of outreach to analyze
            min_count: Minimum occurrences for a tag to become a rule

        Returns:
            List of style rules derived from feedback patterns
        """
        # Get all approved outreach logs with feedback tags
        result = await db.execute(
            select(OutreachLog.feedback_tags).where(
                OutreachLog.outreach_type == outreach_type,
                OutreachLog.user_approved == True,  # noqa: E712
                OutreachLog.feedback_tags.isnot(None),
            )
        )

        # Count tag frequencies
        all_tags = []
        for (tags,) in result.all():
            if tags:
                all_tags.extend(tags)

        tag_counts = Counter(all_tags)

        # Convert frequent tags to rules
        rules = []
        for tag, count in tag_counts.most_common():
            if count >= min_count:
                rule = self._tag_to_rule(tag)
                if rule:
                    rules.append(rule)

        return rules

    async def get_training_data_count(self, db: AsyncSession) -> dict:
        """Get count of available training examples."""
        result = await db.execute(
            select(
                OutreachLog.outreach_type,
                func.count(OutreachLog.id),
            )
            .where(
                OutreachLog.user_final.isnot(None),
                OutreachLog.user_approved == True,  # noqa: E712
            )
            .group_by(OutreachLog.outreach_type)
        )

        counts = {row[0].value: row[1] for row in result.all()}
        return {
            "candidate_outreach": counts.get("candidate_outreach", 0),
            "client_outreach": counts.get("client_outreach", 0),
            "total": sum(counts.values()),
            "ready_for_finetune": sum(counts.values()) >= settings.min_examples_for_finetune,
        }

    def _serialize_context(self, context: dict) -> str:
        """Serialize context dict to text for embedding."""
        parts = []
        if "job" in context:
            job = context["job"]
            parts.append(f"Job: {job.get('title', '')} at {job.get('company', '')}")
            if job.get("skills_required"):
                parts.append(f"Required skills: {', '.join(job['skills_required'][:10])}")

        if "candidate" in context:
            cand = context["candidate"]
            parts.append(f"Candidate: {cand.get('name', '')} - {cand.get('current_title', '')}")
            if cand.get("skills"):
                parts.append(f"Skills: {', '.join(cand['skills'][:10])}")

        if "client" in context:
            client = context["client"]
            parts.append(f"Client: {client.get('company_name', '')} - {client.get('industry', '')}")

        if "notes" in context:
            parts.append(f"Notes: {context['notes']}")

        return "\n".join(parts)

    def _summarize_context(self, context: dict) -> str:
        """Create a brief summary of context for few-shot examples."""
        parts = []
        if "job" in context:
            parts.append(f"{context['job'].get('title', 'Role')} at {context['job'].get('company', 'Company')}")
        if "candidate" in context:
            parts.append(f"Candidate: {context['candidate'].get('current_title', 'Professional')}")
        if "client" in context:
            parts.append(f"Client: {context['client'].get('company_name', 'Company')}")
        return " | ".join(parts) if parts else "Context"

    def _tag_to_rule(self, tag: str) -> Optional[str]:
        """Convert a feedback tag to an explicit style rule."""
        tag_rules = {
            "shorter": "Keep messages concise, ideally under 150 words",
            "longer": "Provide more detail and context in messages",
            "more_direct": "Be direct and get to the point quickly",
            "more_formal": "Use formal, professional language",
            "more_casual": "Use a conversational, friendly tone",
            "include_comp": "Always mention compensation range when available",
            "no_comp": "Do not mention compensation in initial outreach",
            "add_cta": "End with a clear call to action",
            "personalize": "Include specific details about the recipient",
            "highlight_remote": "Emphasize remote work options when available",
            "mention_company_culture": "Reference company culture and values",
            "focus_growth": "Highlight growth and learning opportunities",
            "less_salesy": "Avoid pushy or sales-like language",
        }
        return tag_rules.get(tag.lower().replace(" ", "_"))


# Singleton instance
_memory_service: Optional[MemoryService] = None


def get_memory_service() -> MemoryService:
    """Get or create memory service instance."""
    global _memory_service
    if _memory_service is None:
        _memory_service = MemoryService()
    return _memory_service
