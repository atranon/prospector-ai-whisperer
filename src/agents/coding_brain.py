"""Coding Brain agent for software development tasks."""
import logging
import re
from typing import Optional, Dict, Any, List
from dataclasses import dataclass

from src.services.llm import LLMService, get_llm

logger = logging.getLogger(__name__)


@dataclass
class CodeResult:
    """Result from a code operation."""
    success: bool
    content: str
    language: Optional[str] = None
    file_path: Optional[str] = None
    explanation: Optional[str] = None
    reasoning: Optional[str] = None


class CodingBrain:
    """
    Autonomous coding assistant brain.

    This agent helps with:
    1. Code generation - Writing new code from requirements
    2. Code review - Analyzing code for issues
    3. Bug fixing - Identifying and fixing bugs
    4. Refactoring - Improving code structure
    5. Documentation - Writing docs and comments
    6. Testing - Generating test cases
    7. Architecture - Designing system architecture
    """

    def __init__(self, llm: LLMService = None):
        self.llm = llm or get_llm()

    @property
    def system_prompt(self) -> str:
        return """You are an expert software engineer and coding assistant called "Coding Brain".

Your capabilities:
1. Write clean, efficient, well-documented code
2. Review code and identify bugs, security issues, and improvements
3. Refactor code for better maintainability
4. Generate comprehensive test cases
5. Design system architectures
6. Explain complex code in simple terms
7. Debug issues with detailed analysis

When writing code:
- Use modern best practices
- Include error handling
- Add helpful comments
- Consider edge cases
- Follow the language's conventions

When reviewing code:
- Check for bugs and logic errors
- Identify security vulnerabilities
- Suggest performance improvements
- Note maintainability concerns

Always provide explanations for your suggestions and code.
Format code in proper markdown code blocks with language tags."""

    async def generate_code(
        self,
        requirements: str,
        language: str = "python",
        context: str = None
    ) -> CodeResult:
        """Generate code from requirements."""
        prompt = f"""Generate {language} code for the following requirements:

{requirements}

{f'Context: {context}' if context else ''}

Provide:
1. The complete, working code
2. Brief explanation of the implementation
3. Any important notes or considerations"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.3)
        content = response.content

        # Extract reasoning if present
        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        # Extract code blocks
        code_match = re.search(r"```(?:\w+)?\s*([\s\S]*?)```", content)
        code = code_match.group(1).strip() if code_match else content

        return CodeResult(
            success=True,
            content=code,
            language=language,
            explanation=content,
            reasoning=reasoning
        )

    async def review_code(
        self,
        code: str,
        language: str = None,
        focus: str = None
    ) -> CodeResult:
        """Review code and provide feedback."""
        prompt = f"""Review this code and provide detailed feedback:

```{language or ''}
{code}
```

{f'Focus on: {focus}' if focus else 'Provide comprehensive review covering bugs, security, performance, and maintainability.'}

Format your response as:
1. Summary of issues found
2. Detailed findings with line references
3. Suggested improvements with code examples"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.3)
        content = response.content

        # Extract reasoning
        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        return CodeResult(
            success=True,
            content=content,
            language=language,
            reasoning=reasoning
        )

    async def fix_bug(
        self,
        code: str,
        error_message: str = None,
        bug_description: str = None,
        language: str = None
    ) -> CodeResult:
        """Fix a bug in code."""
        prompt = f"""Fix the bug in this code:

```{language or ''}
{code}
```

{f'Error message: {error_message}' if error_message else ''}
{f'Bug description: {bug_description}' if bug_description else ''}

Provide:
1. The fixed code
2. Explanation of what was wrong
3. How the fix addresses the issue"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.2)
        content = response.content

        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        # Extract fixed code
        code_match = re.search(r"```(?:\w+)?\s*([\s\S]*?)```", content)
        fixed_code = code_match.group(1).strip() if code_match else ""

        return CodeResult(
            success=True,
            content=fixed_code,
            language=language,
            explanation=content,
            reasoning=reasoning
        )

    async def refactor(
        self,
        code: str,
        goals: str = None,
        language: str = None
    ) -> CodeResult:
        """Refactor code for better quality."""
        prompt = f"""Refactor this code:

```{language or ''}
{code}
```

{f'Goals: {goals}' if goals else 'Improve readability, maintainability, and performance.'}

Provide:
1. The refactored code
2. List of changes made
3. Explanation of improvements"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.3)
        content = response.content

        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        code_match = re.search(r"```(?:\w+)?\s*([\s\S]*?)```", content)
        refactored = code_match.group(1).strip() if code_match else ""

        return CodeResult(
            success=True,
            content=refactored,
            language=language,
            explanation=content,
            reasoning=reasoning
        )

    async def generate_tests(
        self,
        code: str,
        framework: str = "pytest",
        language: str = "python"
    ) -> CodeResult:
        """Generate test cases for code."""
        prompt = f"""Generate comprehensive tests for this code using {framework}:

```{language}
{code}
```

Include:
1. Unit tests for each function/method
2. Edge cases and error conditions
3. Happy path tests
4. Any necessary mocks or fixtures"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.3)
        content = response.content

        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        code_match = re.search(r"```(?:\w+)?\s*([\s\S]*?)```", content)
        tests = code_match.group(1).strip() if code_match else ""

        return CodeResult(
            success=True,
            content=tests,
            language=language,
            explanation=content,
            reasoning=reasoning
        )

    async def explain_code(
        self,
        code: str,
        detail_level: str = "medium",
        language: str = None
    ) -> CodeResult:
        """Explain what code does."""
        detail_instructions = {
            "brief": "Give a brief 2-3 sentence summary.",
            "medium": "Explain each major section and its purpose.",
            "detailed": "Provide line-by-line explanation with context."
        }

        prompt = f"""Explain this code:

```{language or ''}
{code}
```

{detail_instructions.get(detail_level, detail_instructions['medium'])}"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.5)
        content = response.content

        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        return CodeResult(
            success=True,
            content=content,
            language=language,
            reasoning=reasoning
        )

    async def design_architecture(
        self,
        requirements: str,
        constraints: str = None,
        tech_stack: str = None
    ) -> CodeResult:
        """Design system architecture."""
        prompt = f"""Design a system architecture for:

{requirements}

{f'Constraints: {constraints}' if constraints else ''}
{f'Tech stack: {tech_stack}' if tech_stack else ''}

Provide:
1. High-level architecture diagram (ASCII art)
2. Component descriptions
3. Data flow explanation
4. Key design decisions and trade-offs
5. Potential scaling considerations"""

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": prompt}
        ]

        response = await self.llm.generate(messages, temperature=0.5)
        content = response.content

        reasoning = None
        think_match = re.search(r"<think>(.*?)</think>", content, re.DOTALL)
        if think_match:
            reasoning = think_match.group(1).strip()
            content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        return CodeResult(
            success=True,
            content=content,
            reasoning=reasoning
        )

    async def chat(self, message: str, history: List[Dict] = None) -> str:
        """Have a conversation about coding topics."""
        messages = [{"role": "system", "content": self.system_prompt}]

        if history:
            messages.extend(history[-20:])

        messages.append({"role": "user", "content": message})

        response = await self.llm.generate(messages, temperature=0.7)
        content = response.content

        # Remove thinking tags for chat
        content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()

        return content


# Singleton instance
_coding_brain: Optional[CodingBrain] = None


def get_coding_brain() -> CodingBrain:
    """Get or create coding brain instance."""
    global _coding_brain
    if _coding_brain is None:
        _coding_brain = CodingBrain()
    return _coding_brain
