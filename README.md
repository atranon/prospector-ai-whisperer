# Recruiting Brain

Self-hosted AI "business brain" for recruiting workflows. Runs entirely on your infrastructure with local LLMs.

## Features

- **JD Analysis**: Parse job descriptions into structured data with ideal candidate profiles
- **Resume Analysis**: Extract skills, experience, and career trajectory from resumes
- **Fit Scoring**: AI-powered candidate-job fit evaluation with reasoning
- **Smart Outreach**: Generate personalized messages that learn from your feedback
- **Vector Search**: Semantic search across jobs, candidates, and clients
- **Fine-tuning**: Periodic LoRA fine-tuning to permanently learn your style

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   FastAPI   │────▶│  PostgreSQL │
│  (Browser)  │     │   Backend   │     │  (pgvector) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   Ollama    │
                    │    (LLM)    │
                    └─────────────┘
```

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 16+ with pgvector extension
- [Ollama](https://ollama.ai) for local LLM inference
- 16GB+ RAM (32GB recommended for 32B models)
- GPU with 24GB+ VRAM (optional, for faster inference)

### 1. Install Ollama and Pull Models

```bash
# Install Ollama (Linux/macOS)
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve

# Pull models (in another terminal)
ollama pull deepseek-r1:32b      # Main reasoning model (or :14b for less VRAM)
ollama pull nomic-embed-text     # Embedding model
```

### 2. Set Up PostgreSQL

```bash
# Install PostgreSQL with pgvector (Ubuntu/Debian)
sudo apt install postgresql-16 postgresql-16-pgvector

# Create database
sudo -u postgres psql -c "CREATE DATABASE recruiting_brain;"
sudo -u postgres psql -d recruiting_brain -c "CREATE EXTENSION vector;"
```

### 3. Install and Run

```bash
# Clone and enter directory
git clone <repo>
cd recruiting-brain

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/recruiting_brain
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=deepseek-r1:32b
EMBEDDING_MODEL=nomic-embed-text
EOF

# Run the server
uvicorn src.main:app --reload --port 8000
```

### 4. Access the API

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/health

## Docker Setup

```bash
# Start PostgreSQL and API
docker compose up -d

# Make sure Ollama is running on host
ollama serve
```

## API Usage

### Analyze a Job Description

```bash
curl -X POST http://localhost:8000/api/jobs/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "We are looking for a Senior Software Engineer...",
    "company": "Acme Inc"
  }'
```

### Analyze a Resume

```bash
curl -X POST http://localhost:8000/api/candidates/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe - Software Engineer with 5 years...",
    "source": "linkedin"
  }'
```

### Score Candidate-Job Fit

```bash
curl -X POST http://localhost:8000/api/candidates/score-fit \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "uuid-here",
    "job_id": "uuid-here"
  }'
```

### Generate Outreach (with learning)

```bash
# Generate draft
curl -X POST http://localhost:8000/api/outreach/generate \
  -H "Content-Type: application/json" \
  -d '{
    "outreach_type": "candidate",
    "job_id": "uuid-here",
    "candidate_id": "uuid-here",
    "message_type": "initial"
  }'

# After editing, save feedback (this teaches the system!)
curl -X POST http://localhost:8000/api/outreach/{outreach_id}/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "user_final": "Your edited message here...",
    "feedback_tags": ["shorter", "more_direct"],
    "approved": true
  }'
```

## Learning System

The outreach generator learns from your feedback in two ways:

### 1. Immediate Learning (Prompt + Memory)

When you edit a generated message and save it with feedback:
- The example is stored with embeddings for retrieval
- Feedback tags are aggregated to derive style rules
- Future generations use similar examples as few-shot prompts

**Recommended feedback tags:**
- `shorter`, `longer` - Length preferences
- `more_direct`, `more_casual`, `more_formal` - Tone
- `include_comp`, `no_comp` - Compensation mentions
- `add_cta`, `personalize` - Content preferences
- `less_salesy` - Style adjustments

### 2. Periodic Fine-tuning (LoRA)

After collecting 500+ approved examples, run fine-tuning to permanently adapt the model:

```bash
# Export training data
python scripts/fine_tune.py --export-data

# Run fine-tuning (requires GPU)
python scripts/fine_tune.py --train --base-model deepseek-ai/DeepSeek-R1-Distill-Qwen-32B

# Optional: Merge LoRA weights
python scripts/fine_tune.py --merge
```

## Configuration

Environment variables (`.env`):

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/recruiting_brain

# LLM Provider: ollama or vllm
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434

# Models
LLM_MODEL=deepseek-r1:32b          # or qwen3:30b, deepseek-r1:14b
EMBEDDING_MODEL=nomic-embed-text

# Learning
MEMORY_TOP_K=5                      # Number of similar examples to retrieve
MIN_EXAMPLES_FOR_FINETUNE=500       # Minimum examples before fine-tuning
```

## Model Options

| Model | VRAM Required | Notes |
|-------|---------------|-------|
| deepseek-r1:7b | 8GB | Fast, good for testing |
| deepseek-r1:14b | 16GB | Good balance |
| deepseek-r1:32b | 24GB+ | Best quality |
| qwen3:30b | 24GB+ | Alternative option |

For production with high throughput, consider [vLLM](https://github.com/vllm-project/vllm) instead of Ollama.

## Project Structure

```
recruiting-brain/
├── src/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Settings
│   ├── database.py       # Database connection
│   ├── models/           # SQLAlchemy models
│   │   ├── job.py
│   │   ├── candidate.py
│   │   ├── client.py
│   │   ├── outreach.py
│   │   └── embedding.py
│   ├── agents/           # AI agents
│   │   ├── jd_analyst.py
│   │   ├── resume_analyst.py
│   │   ├── fit_scorer.py
│   │   └── outreach.py
│   ├── services/         # Business logic
│   │   ├── llm.py
│   │   ├── embedding.py
│   │   └── memory.py
│   └── api/              # API routes
├── scripts/
│   └── fine_tune.py      # LoRA fine-tuning
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## Windows Setup

1. Install [Python 3.11+](https://python.org/downloads) (check "Add to PATH")
2. Install [PostgreSQL](https://postgresql.org/download/windows/)
3. Install [Ollama for Windows](https://ollama.ai/download/windows)

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE recruiting_brain;"

# Set up Python environment
cd recruiting-brain
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create .env file (use notepad or echo)
# Run server
uvicorn src.main:app --reload --port 8000
```

## License

MIT
