"""Application configuration."""
from typing import Literal
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/recruiting_brain"

    # LLM - supports Ollama (local) or vLLM
    llm_provider: Literal["ollama", "vllm"] = "ollama"
    llm_base_url: str = "http://localhost:11434"
    llm_model: str = "deepseek-r1:32b"  # or qwen3:30b
    llm_temperature: float = 0.7
    llm_max_tokens: int = 4096

    # Embedding model (via Ollama)
    embedding_model: str = "nomic-embed-text"
    embedding_dimensions: int = 768

    # Memory/RAG settings
    memory_top_k: int = 5  # Number of similar examples to retrieve

    # Fine-tuning
    min_examples_for_finetune: int = 500

    class Config:
        env_file = ".env"


settings = Settings()
