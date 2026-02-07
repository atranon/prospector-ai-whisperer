"""Main FastAPI application."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy import text

from src.config import settings
from src.database import engine, Base
from src.api import router as api_router
from src.services.scheduler import get_scheduler
from src.agents.autonomous import register_task_handlers

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

    # Start the autonomous task scheduler
    scheduler = get_scheduler()
    register_task_handlers(scheduler)
    await scheduler.start()
    logger.info("Autonomous scheduler started")

    yield

    # Stop scheduler
    await scheduler.stop()
    logger.info("Scheduler stopped")

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


CHAT_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recruiting Brain</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a2e;
            color: #eee;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        header {
            background: #16213e;
            padding: 1rem 2rem;
            border-bottom: 1px solid #0f3460;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        header h1 { font-size: 1.5rem; color: #00d9ff; }
        .status { font-size: 0.8rem; color: #888; }
        .status.active { color: #00ff88; }
        #chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .message {
            max-width: 80%;
            padding: 1rem;
            border-radius: 12px;
            line-height: 1.5;
        }
        .message.user {
            background: #0f3460;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .message.assistant {
            background: #16213e;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #0f3460;
        }
        .message pre {
            background: #0a0a15;
            padding: 0.5rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 0.5rem 0;
        }
        .message code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
        }
        #input-container {
            padding: 1rem 2rem;
            background: #16213e;
            border-top: 1px solid #0f3460;
            display: flex;
            gap: 1rem;
        }
        #message-input {
            flex: 1;
            padding: 1rem;
            border: 1px solid #0f3460;
            border-radius: 8px;
            background: #1a1a2e;
            color: #eee;
            font-size: 1rem;
            resize: none;
        }
        #message-input:focus {
            outline: none;
            border-color: #00d9ff;
        }
        #send-btn {
            padding: 1rem 2rem;
            background: #00d9ff;
            color: #1a1a2e;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        #send-btn:hover { background: #00b8d9; }
        #send-btn:disabled { background: #555; cursor: not-allowed; }
        .typing {
            display: flex;
            gap: 4px;
            padding: 1rem;
        }
        .typing span {
            width: 8px;
            height: 8px;
            background: #00d9ff;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
        }
        .quick-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1rem;
        }
        .quick-action {
            padding: 0.5rem 1rem;
            background: #0f3460;
            border: 1px solid #00d9ff;
            border-radius: 20px;
            color: #00d9ff;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        .quick-action:hover {
            background: #00d9ff;
            color: #1a1a2e;
        }
        .actions-taken {
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: #0a3d2a;
            border-radius: 6px;
            font-size: 0.85rem;
            color: #00ff88;
        }
    </style>
</head>
<body>
    <header>
        <h1>Recruiting Brain</h1>
        <div class="status" id="status">Connecting...</div>
    </header>

    <div id="chat-container">
        <div class="quick-actions">
            <button class="quick-action" onclick="sendQuick('What can you help me with?')">What can you do?</button>
            <button class="quick-action" onclick="sendQuick('Show me active tasks')">Task Status</button>
            <button class="quick-action" onclick="sendQuick('Start autonomous recruiting for our latest job')">Start Recruiting</button>
            <button class="quick-action" onclick="sendQuick('Give me market intel for software engineers')">Market Intel</button>
        </div>
        <div class="message assistant">
            Hello! I'm your Recruiting Brain assistant. I can help you with:
            <br><br>
            - Analyzing job descriptions and resumes<br>
            - Scoring candidate-job fit<br>
            - Generating personalized outreach<br>
            - Running autonomous recruiting campaigns<br>
            - Providing market intelligence<br><br>
            What would you like to work on today?
        </div>
    </div>

    <div id="input-container">
        <textarea id="message-input" placeholder="Type your message... (Enter to send, Shift+Enter for new line)" rows="1"></textarea>
        <button id="send-btn" onclick="sendMessage()">Send</button>
    </div>

    <script>
        let conversationId = null;
        const chatContainer = document.getElementById('chat-container');
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        const status = document.getElementById('status');

        // Check health
        async function checkHealth() {
            try {
                const res = await fetch('/api/health');
                if (res.ok) {
                    status.textContent = 'Connected';
                    status.classList.add('active');
                }
            } catch (e) {
                status.textContent = 'Disconnected';
                status.classList.remove('active');
            }
        }
        checkHealth();
        setInterval(checkHealth, 30000);

        // Auto-resize textarea
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });

        // Enter to send
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        function sendQuick(msg) {
            input.value = msg;
            sendMessage();
        }

        function addMessage(content, role, actions = null) {
            const div = document.createElement('div');
            div.className = 'message ' + role;
            div.innerHTML = formatMessage(content);
            if (actions && actions.length > 0) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions-taken';
                actionsDiv.innerHTML = 'Actions: ' + actions.map(a => a.action + ' (' + a.task_type + ')').join(', ');
                div.appendChild(actionsDiv);
            }
            chatContainer.appendChild(div);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function formatMessage(text) {
            // Convert markdown-like formatting
            return text
                .replace(/\\n/g, '<br>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
        }

        function showTyping() {
            const div = document.createElement('div');
            div.className = 'message assistant typing';
            div.id = 'typing';
            div.innerHTML = '<span></span><span></span><span></span>';
            chatContainer.appendChild(div);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function hideTyping() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
        }

        async function sendMessage() {
            const msg = input.value.trim();
            if (!msg) return;

            addMessage(msg, 'user');
            input.value = '';
            input.style.height = 'auto';
            sendBtn.disabled = true;
            showTyping();

            try {
                const res = await fetch('/api/chat/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: msg,
                        conversation_id: conversationId
                    })
                });

                const data = await res.json();
                hideTyping();

                if (data.conversation_id) {
                    conversationId = data.conversation_id;
                }

                addMessage(data.message, 'assistant', data.actions_taken);
            } catch (e) {
                hideTyping();
                addMessage('Error: Could not connect to server. Please check if the API is running.', 'assistant');
            }

            sendBtn.disabled = false;
            input.focus();
        }
    </script>
</body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the chat interface."""
    return CHAT_HTML
