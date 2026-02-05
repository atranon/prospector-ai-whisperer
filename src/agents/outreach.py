"""Outreach Generation Agent with learning from feedback."""
from dataclasses import dataclass
from typing import Optional

from src.agents.base import Agent


@dataclass
class OutreachInput:
    """Input for outreach generation."""
    outreach_type: str  # "candidate" or "client"
    job: Optional[dict] = None  # Job data (for candidate outreach)
    candidate: Optional[dict] = None  # Candidate data (for candidate outreach)
    client: Optional[dict] = None  # Client data (for client outreach)
    message_type: str = "initial"  # initial, follow_up, nurture
    notes: Optional[str] = None  # Additional context/instructions

    # Learning context (populated by memory service)
    style_rules: Optional[list[str]] = None  # Derived from feedback patterns
    similar_examples: Optional[list[dict]] = None  # Past approved examples


@dataclass
class OutreachOutput:
    """Output from outreach generation."""
    subject: str
    body: str
    personalization_notes: list[str]  # What was personalized
    tone: str  # formal, casual, etc.
    call_to_action: str


class OutreachAgent(Agent[OutreachInput, OutreachOutput]):
    """
    Agent for generating personalized outreach messages.

    This agent learns from user feedback in two ways:
    1. Style rules - recurring feedback patterns become explicit rules
    2. Few-shot examples - similar past approved messages guide generation

    The memory service provides both of these at generation time.
    """

    @property
    def system_prompt(self) -> str:
        return """You are an expert recruiting and business development professional.
Your job is to write personalized outreach messages that are:
- Authentic and human-sounding (not generic or templated)
- Respectful of the recipient's time
- Clear about the value proposition
- Ending with a soft but clear call to action

You adapt your style based on the rules provided and learn from successful past examples."""

    def build_user_prompt(self, input_data: OutreachInput) -> str:
        parts = []

        # Add style rules if provided
        if input_data.style_rules:
            rules_text = "\n".join(f"- {rule}" for rule in input_data.style_rules)
            parts.append(f"STYLE RULES (follow these carefully):\n{rules_text}")

        # Add similar examples if provided
        if input_data.similar_examples:
            examples_text = ""
            for i, ex in enumerate(input_data.similar_examples[:3], 1):
                examples_text += f"\nExample {i} ({ex.get('context_summary', 'Context')}):\n"
                examples_text += f'"""\n{ex.get("final_message", "")}\n"""'
                if ex.get("feedback_tags"):
                    examples_text += f"\n(Applied: {', '.join(ex['feedback_tags'])})"
            parts.append(f"APPROVED EXAMPLES (match this style):{examples_text}")

        # Build context based on outreach type
        if input_data.outreach_type == "candidate":
            parts.append(self._build_candidate_context(input_data))
        else:
            parts.append(self._build_client_context(input_data))

        # Add notes if provided
        if input_data.notes:
            parts.append(f"ADDITIONAL INSTRUCTIONS:\n{input_data.notes}")

        # Add output format
        parts.append(self._get_output_format(input_data.message_type))

        return "\n\n".join(parts)

    def _build_candidate_context(self, input_data: OutreachInput) -> str:
        job = input_data.job or {}
        candidate = input_data.candidate or {}

        return f"""CANDIDATE OUTREACH CONTEXT:

Job Opportunity:
- Title: {job.get('title', 'N/A')}
- Company: {job.get('company', 'N/A')}
- Location: {job.get('location', 'N/A')} ({job.get('remote_policy', 'flexible')})
- Key Skills: {', '.join(job.get('skills_required', [])[:5])}
{f"- Salary Range: {job.get('salary_min')}-{job.get('salary_max')} {job.get('salary_currency', 'USD')}" if job.get('salary_min') else ""}

Candidate:
- Name: {candidate.get('name', 'N/A')}
- Current Role: {candidate.get('current_title', 'N/A')} at {candidate.get('current_company', 'N/A')}
- Experience: {candidate.get('years_experience', 'N/A')} years
- Key Skills: {', '.join(candidate.get('skills', [])[:5])}
- Location: {candidate.get('location', 'N/A')}

Message Type: {input_data.message_type}"""

    def _build_client_context(self, input_data: OutreachInput) -> str:
        client = input_data.client or {}
        contacts = client.get('contacts', [{}])
        primary = contacts[0] if contacts else {}

        return f"""CLIENT OUTREACH CONTEXT:

Target Company:
- Company: {client.get('company_name', 'N/A')}
- Industry: {client.get('industry', 'N/A')}
- Size: {client.get('company_size', 'N/A')}
- Location: {client.get('headquarters', 'N/A')}

Contact:
- Name: {primary.get('name', client.get('primary_contact_name', 'N/A'))}
- Title: {primary.get('title', 'N/A')}

Why They're a Good Fit:
{chr(10).join(f"- {reason}" for reason in client.get('icp_match_reasons', ['Matches target profile']))}

Message Type: {input_data.message_type}"""

    def _get_output_format(self, message_type: str) -> str:
        type_guidance = {
            "initial": "This is an initial outreach - focus on making a strong first impression and generating interest.",
            "follow_up": "This is a follow-up message - reference the previous outreach and add new value or urgency.",
            "nurture": "This is a nurture message - provide value without being pushy, maintain the relationship.",
        }

        guidance = type_guidance.get(message_type, type_guidance["initial"])

        return f"""MESSAGE GUIDANCE:
{guidance}

Respond with JSON:
{{
  "subject": "email subject line (compelling, not clickbait)",
  "body": "the full message body",
  "personalization_notes": ["what you personalized", "based on their profile"],
  "tone": "the tone used (formal/casual/friendly/professional)",
  "call_to_action": "the specific CTA in the message"
}}"""

    def parse_response(self, response: str) -> OutreachOutput:
        data = self.extract_json(response)

        return OutreachOutput(
            subject=data.get("subject", ""),
            body=data.get("body", ""),
            personalization_notes=data.get("personalization_notes", []),
            tone=data.get("tone", "professional"),
            call_to_action=data.get("call_to_action", ""),
        )
