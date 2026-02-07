"""Coding Brain API endpoints."""
import logging
from typing import Optional, List, Dict
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from src.agents.coding_brain import get_coding_brain, CodeResult

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory conversation storage
coding_conversations: dict = {}


class GenerateCodeRequest(BaseModel):
    """Request to generate code."""
    requirements: str = Field(..., description="What the code should do")
    language: str = Field(default="python", description="Programming language")
    context: Optional[str] = Field(None, description="Additional context")


class ReviewCodeRequest(BaseModel):
    """Request to review code."""
    code: str = Field(..., description="Code to review")
    language: Optional[str] = Field(None, description="Programming language")
    focus: Optional[str] = Field(None, description="Areas to focus on")


class FixBugRequest(BaseModel):
    """Request to fix a bug."""
    code: str = Field(..., description="Code with bug")
    error_message: Optional[str] = Field(None, description="Error message if any")
    bug_description: Optional[str] = Field(None, description="Description of the bug")
    language: Optional[str] = Field(None, description="Programming language")


class RefactorRequest(BaseModel):
    """Request to refactor code."""
    code: str = Field(..., description="Code to refactor")
    goals: Optional[str] = Field(None, description="Refactoring goals")
    language: Optional[str] = Field(None, description="Programming language")


class GenerateTestsRequest(BaseModel):
    """Request to generate tests."""
    code: str = Field(..., description="Code to test")
    framework: str = Field(default="pytest", description="Test framework")
    language: str = Field(default="python", description="Programming language")


class ExplainCodeRequest(BaseModel):
    """Request to explain code."""
    code: str = Field(..., description="Code to explain")
    detail_level: str = Field(default="medium", description="brief, medium, or detailed")
    language: Optional[str] = Field(None, description="Programming language")


class ArchitectureRequest(BaseModel):
    """Request to design architecture."""
    requirements: str = Field(..., description="System requirements")
    constraints: Optional[str] = Field(None, description="Design constraints")
    tech_stack: Optional[str] = Field(None, description="Preferred technologies")


class ChatRequest(BaseModel):
    """Chat request."""
    message: str
    conversation_id: Optional[str] = None


class CodeResponse(BaseModel):
    """Response with code."""
    success: bool
    content: str
    language: Optional[str] = None
    explanation: Optional[str] = None
    reasoning: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response."""
    conversation_id: str
    message: str


@router.post("/generate", response_model=CodeResponse)
async def generate_code(request: GenerateCodeRequest):
    """Generate code from requirements."""
    brain = get_coding_brain()
    result = await brain.generate_code(
        requirements=request.requirements,
        language=request.language,
        context=request.context
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        explanation=result.explanation,
        reasoning=result.reasoning
    )


@router.post("/review", response_model=CodeResponse)
async def review_code(request: ReviewCodeRequest):
    """Review code and provide feedback."""
    brain = get_coding_brain()
    result = await brain.review_code(
        code=request.code,
        language=request.language,
        focus=request.focus
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        reasoning=result.reasoning
    )


@router.post("/fix-bug", response_model=CodeResponse)
async def fix_bug(request: FixBugRequest):
    """Fix a bug in code."""
    brain = get_coding_brain()
    result = await brain.fix_bug(
        code=request.code,
        error_message=request.error_message,
        bug_description=request.bug_description,
        language=request.language
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        explanation=result.explanation,
        reasoning=result.reasoning
    )


@router.post("/refactor", response_model=CodeResponse)
async def refactor_code(request: RefactorRequest):
    """Refactor code for better quality."""
    brain = get_coding_brain()
    result = await brain.refactor(
        code=request.code,
        goals=request.goals,
        language=request.language
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        explanation=result.explanation,
        reasoning=result.reasoning
    )


@router.post("/generate-tests", response_model=CodeResponse)
async def generate_tests(request: GenerateTestsRequest):
    """Generate test cases for code."""
    brain = get_coding_brain()
    result = await brain.generate_tests(
        code=request.code,
        framework=request.framework,
        language=request.language
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        explanation=result.explanation,
        reasoning=result.reasoning
    )


@router.post("/explain", response_model=CodeResponse)
async def explain_code(request: ExplainCodeRequest):
    """Explain what code does."""
    brain = get_coding_brain()
    result = await brain.explain_code(
        code=request.code,
        detail_level=request.detail_level,
        language=request.language
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        language=result.language,
        reasoning=result.reasoning
    )


@router.post("/architecture", response_model=CodeResponse)
async def design_architecture(request: ArchitectureRequest):
    """Design system architecture."""
    brain = get_coding_brain()
    result = await brain.design_architecture(
        requirements=request.requirements,
        constraints=request.constraints,
        tech_stack=request.tech_stack
    )
    return CodeResponse(
        success=result.success,
        content=result.content,
        reasoning=result.reasoning
    )


@router.post("/chat", response_model=ChatResponse)
async def coding_chat(request: ChatRequest):
    """Chat with the coding brain."""
    brain = get_coding_brain()

    conv_id = request.conversation_id or str(uuid4())
    if conv_id not in coding_conversations:
        coding_conversations[conv_id] = []

    # Add user message
    coding_conversations[conv_id].append({
        "role": "user",
        "content": request.message
    })

    # Generate response
    response = await brain.chat(
        message=request.message,
        history=coding_conversations[conv_id]
    )

    # Add assistant response
    coding_conversations[conv_id].append({
        "role": "assistant",
        "content": response
    })

    # Keep history manageable
    if len(coding_conversations[conv_id]) > 100:
        coding_conversations[conv_id] = coding_conversations[conv_id][-50:]

    return ChatResponse(
        conversation_id=conv_id,
        message=response
    )


@router.get("/conversations/{conversation_id}")
async def get_coding_conversation(conversation_id: str):
    """Get coding conversation history."""
    if conversation_id not in coding_conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "conversation_id": conversation_id,
        "messages": coding_conversations[conversation_id]
    }


@router.delete("/conversations/{conversation_id}")
async def clear_coding_conversation(conversation_id: str):
    """Clear coding conversation."""
    if conversation_id in coding_conversations:
        del coding_conversations[conversation_id]
    return {"message": "Conversation cleared"}
