"""LLM service supporting Ollama and vLLM."""
import json
import logging
from typing import Optional, AsyncGenerator
from dataclasses import dataclass

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import settings

logger = logging.getLogger(__name__)


@dataclass
class LLMResponse:
    """Response from LLM."""
    content: str
    model: str
    usage: Optional[dict] = None


class LLMService:
    """
    LLM service that supports Ollama and vLLM backends.

    For reasoning models like DeepSeek-R1, the model will show its
    thinking process in <think>...</think> tags.
    """

    def __init__(
        self,
        provider: str = None,
        base_url: str = None,
        model: str = None,
        temperature: float = None,
        max_tokens: int = None,
    ):
        self.provider = provider or settings.llm_provider
        self.base_url = base_url or settings.llm_base_url
        self.model = model or settings.llm_model
        self.temperature = temperature or settings.llm_temperature
        self.max_tokens = max_tokens or settings.llm_max_tokens

        # Set API endpoint based on provider
        if self.provider == "ollama":
            self.api_url = f"{self.base_url}/api/chat"
        else:  # vLLM uses OpenAI-compatible API
            self.api_url = f"{self.base_url}/v1/chat/completions"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate(
        self,
        messages: list[dict],
        temperature: float = None,
        max_tokens: int = None,
        json_mode: bool = False,
    ) -> LLMResponse:
        """
        Generate a response from the LLM.

        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Override default temperature
            max_tokens: Override default max tokens
            json_mode: Request JSON output format

        Returns:
            LLMResponse with generated content
        """
        temp = temperature if temperature is not None else self.temperature
        tokens = max_tokens if max_tokens is not None else self.max_tokens

        async with httpx.AsyncClient(timeout=120.0) as client:
            if self.provider == "ollama":
                response = await self._ollama_generate(client, messages, temp, tokens, json_mode)
            else:
                response = await self._vllm_generate(client, messages, temp, tokens, json_mode)

        return response

    async def _ollama_generate(
        self,
        client: httpx.AsyncClient,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
        json_mode: bool,
    ) -> LLMResponse:
        """Generate using Ollama API."""
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        if json_mode:
            payload["format"] = "json"

        response = await client.post(self.api_url, json=payload)
        response.raise_for_status()
        data = response.json()

        return LLMResponse(
            content=data["message"]["content"],
            model=data.get("model", self.model),
            usage={
                "prompt_tokens": data.get("prompt_eval_count", 0),
                "completion_tokens": data.get("eval_count", 0),
            },
        )

    async def _vllm_generate(
        self,
        client: httpx.AsyncClient,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
        json_mode: bool,
    ) -> LLMResponse:
        """Generate using vLLM (OpenAI-compatible API)."""
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        response = await client.post(self.api_url, json=payload)
        response.raise_for_status()
        data = response.json()

        return LLMResponse(
            content=data["choices"][0]["message"]["content"],
            model=data.get("model", self.model),
            usage=data.get("usage"),
        )

    async def generate_stream(
        self,
        messages: list[dict],
        temperature: float = None,
        max_tokens: int = None,
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens from the LLM."""
        temp = temperature if temperature is not None else self.temperature
        tokens = max_tokens if max_tokens is not None else self.max_tokens

        async with httpx.AsyncClient(timeout=300.0) as client:
            if self.provider == "ollama":
                async for chunk in self._ollama_stream(client, messages, temp, tokens):
                    yield chunk
            else:
                async for chunk in self._vllm_stream(client, messages, temp, tokens):
                    yield chunk

    async def _ollama_stream(
        self,
        client: httpx.AsyncClient,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
    ) -> AsyncGenerator[str, None]:
        """Stream from Ollama."""
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }

        async with client.stream("POST", self.api_url, json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "message" in data and "content" in data["message"]:
                        yield data["message"]["content"]

    async def _vllm_stream(
        self,
        client: httpx.AsyncClient,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
    ) -> AsyncGenerator[str, None]:
        """Stream from vLLM."""
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }

        async with client.stream("POST", self.api_url, json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    if data_str.strip() == "[DONE]":
                        break
                    data = json.loads(data_str)
                    if data["choices"][0]["delta"].get("content"):
                        yield data["choices"][0]["delta"]["content"]

    async def check_health(self) -> bool:
        """Check if LLM service is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                if self.provider == "ollama":
                    response = await client.get(f"{self.base_url}/api/tags")
                else:
                    response = await client.get(f"{self.base_url}/v1/models")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"LLM health check failed: {e}")
            return False


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm() -> LLMService:
    """Get or create LLM service instance."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
