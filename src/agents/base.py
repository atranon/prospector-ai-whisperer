"""Base agent class."""
import json
import re
import logging
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional
from dataclasses import dataclass

from src.services.llm import LLMService, get_llm

logger = logging.getLogger(__name__)

InputT = TypeVar("InputT")
OutputT = TypeVar("OutputT")


@dataclass
class AgentResult(Generic[OutputT]):
    """Result from an agent run."""
    success: bool
    data: Optional[OutputT] = None
    error: Optional[str] = None
    reasoning: Optional[str] = None  # Chain-of-thought reasoning from the model


class Agent(ABC, Generic[InputT, OutputT]):
    """
    Base class for all agents.

    Agents are responsible for specific tasks like analyzing JDs, scoring fit, etc.
    They use the LLM service with structured prompts and handle parsing responses.

    For reasoning models (DeepSeek-R1, Qwen3-thinking), the model's thinking
    process is captured in <think>...</think> tags and stored separately.
    """

    def __init__(self, llm: LLMService = None, verbose: bool = False):
        self.llm = llm or get_llm()
        self.verbose = verbose

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """System prompt for this agent."""
        pass

    @abstractmethod
    def build_user_prompt(self, input_data: InputT) -> str:
        """Build the user prompt from input data."""
        pass

    @abstractmethod
    def parse_response(self, response: str) -> OutputT:
        """Parse the LLM response into structured output."""
        pass

    async def run(self, input_data: InputT) -> AgentResult[OutputT]:
        """
        Execute the agent with the given input.

        Returns:
            AgentResult with success status, data, and optional reasoning
        """
        try:
            # Build messages
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": self.build_user_prompt(input_data)},
            ]

            if self.verbose:
                logger.info(f"Running {self.__class__.__name__}")
                logger.debug(f"User prompt: {messages[1]['content'][:500]}...")

            # Call LLM
            response = await self.llm.generate(messages, json_mode=self.uses_json_mode)

            # Extract thinking and content
            content = response.content
            reasoning = None

            # Check for <think>...</think> tags (reasoning models)
            think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
            if think_match:
                reasoning = think_match.group(1).strip()
                content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

            if self.verbose:
                logger.info(f"Response length: {len(content)} chars")
                if reasoning:
                    logger.debug(f"Reasoning: {reasoning[:500]}...")

            # Parse response
            parsed = self.parse_response(content)

            return AgentResult(
                success=True,
                data=parsed,
                reasoning=reasoning,
            )

        except Exception as e:
            logger.error(f"Agent {self.__class__.__name__} failed: {e}")
            return AgentResult(
                success=False,
                error=str(e),
            )

    @property
    def uses_json_mode(self) -> bool:
        """Whether this agent expects JSON output."""
        return True

    def extract_json(self, text: str) -> dict:
        """Extract JSON from text, handling markdown code blocks."""
        # Try to find JSON in code blocks
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            text = json_match.group(1)

        # Try to find JSON object or array
        json_match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
        if json_match:
            text = json_match.group(1)

        return json.loads(text)
