"""Gemini integration for ECHO."""

import json
import logging
from typing import List, Optional

from app.config import settings
from app.schemas.chat import ChatTurn, ChatVisitor

logger = logging.getLogger("echo.ai")


ECHO_SYSTEM_PROMPT = """
You are ECHO — The Signal Guardian.

Tagline:
"I hear what others ignore."

Your personality:
- Calm
- Empathetic
- Intelligent
- Reassuring
- Friendly
- Slightly mysterious
- Never robotic

Your job is to understand the visitor's grievance.

The application separately collects:
1. Name
2. Age
3. Location
4. Email
5. Grievance

Do not ask again for information that is already available.

When the visitor explains a problem:
1. Understand the problem.
2. Reply naturally and empathetically.
3. Ask one relevant follow-up question if more information is needed.
4. Generate a suitable category.
5. Generate a priority.
6. Generate a short summary.
7. Decide whether the grievance is ready for confirmation.

Allowed categories:
- COMMUNITY
- HEALTH
- EDUCATION
- SAFETY
- ENVIRONMENT
- OTHER

Allowed priorities:
- LOW
- MEDIUM
- HIGH
- CRITICAL

Priority rules:
- CRITICAL: Immediate danger, serious injury, life-threatening emergency.
- HIGH: Serious issue requiring urgent attention.
- MEDIUM: Important issue but not immediately dangerous.
- LOW: General suggestion, minor complaint, or non-urgent issue.

Important:
- Do not claim the issue is already solved.
- Do not claim authorities have been contacted.
- Do not pretend to be a real emergency service.
- If there is immediate danger, advise the visitor to contact local emergency services.
- Keep the natural reply concise.
- Ask only one question at a time.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not include extra text outside the JSON.

Return JSON in exactly this format:

{
  "reply": "Natural response to the visitor",
  "category": "COMMUNITY",
  "priority": "MEDIUM",
  "summary": "Short summary of the grievance",
  "follow_up_question": "One relevant question or empty string",
  "ready_to_submit": false
}
"""


class AIServiceError(Exception):
    """Safe AI service error."""

    def __init__(
        self,
        message: str,
        code: str = "AI_SERVICE_ERROR",
    ) -> None:
        super().__init__(message)
        self.code = code


def _build_visitor_context(
    visitor: Optional[ChatVisitor],
) -> str:
    if not visitor:
        return ""

    known = []

    if visitor.name:
        known.append(f"Name: {visitor.name}")

    if visitor.age:
        known.append(f"Age: {visitor.age}")

    if visitor.location:
        known.append(f"Location: {visitor.location}")

    if visitor.email:
        known.append("Email: already provided")

    if not known:
        return ""

    return (
        "\n\nAlready collected visitor information. "
        "Do not ask for these details again:\n"
        + "\n".join(known)
    )


def _get_client():
    if not settings.GEMINI_API_KEY:
        return None

    try:
        from google import genai

        return genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    except Exception:
        logger.error("Failed to initialize Gemini client.")
        return None


def _clean_json_response(text: str) -> dict:
    """
    Convert Gemini's JSON response into a Python dictionary.
    """

    text = text.strip()

    # Remove Markdown code fences if Gemini adds them.
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        logger.error("Gemini returned invalid JSON.")
        raise AIServiceError(
            "The AI service returned an invalid response."
        ) from exc

    if not isinstance(data, dict):
        raise AIServiceError(
            "The AI service returned an invalid format."
        )

    return data


def generate_reply(
    message: str,
    conversation: List[ChatTurn],
    visitor: Optional[ChatVisitor],
    stage: str,
) -> dict:
    """
    Return Gemini-generated reply, category, priority and summary.
    """

    client = _get_client()

    if client is None:
        raise AIServiceError(
            "The AI service is not configured.",
            "AI_SERVICE_ERROR",
        )

    try:
        from google.genai import types

        contents = []

        for turn in conversation:
            role = (
                "model"
                if turn.role == "assistant"
                else "user"
            )

            contents.append(
                types.Content(
                    role=role,
                    parts=[
                        types.Part(text=turn.content)
                    ],
                )
            )

        contents.append(
            types.Content(
                role="user",
                parts=[
                    types.Part(text=message)
                ],
            )
        )

        system_instruction = (
            ECHO_SYSTEM_PROMPT
            + _build_visitor_context(visitor)
        )

        logger.info(
            "Calling Gemini model: %s",
            settings.GEMINI_MODEL,
        )

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                max_output_tokens=600,
                response_mime_type="application/json",
            ),
        )

        raw_reply = (
            getattr(response, "text", None) or ""
        ).strip()

        if not raw_reply:
            raise AIServiceError(
                "The AI service returned an empty response."
            )

        result = _clean_json_response(raw_reply)

        reply = str(
            result.get(
                "reply",
                "I hear you. Please tell me more.",
            )
        )

        category = str(
            result.get("category", "OTHER")
        ).upper()

        priority = str(
            result.get("priority", "MEDIUM")
        ).upper()

        summary = str(
            result.get("summary", message)
        )

        follow_up_question = str(
            result.get("follow_up_question", "")
        )

        ready_to_submit = bool(
            result.get("ready_to_submit", False)
        )

        allowed_categories = {
            "COMMUNITY",
            "HEALTH",
            "EDUCATION",
            "SAFETY",
            "ENVIRONMENT",
            "OTHER",
        }

        allowed_priorities = {
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
        }

        if category not in allowed_categories:
            category = "OTHER"

        if priority not in allowed_priorities:
            priority = "MEDIUM"

        return {
            "reply": reply,
            "category": category,
            "priority": priority,
            "summary": summary,
            "follow_up_question": follow_up_question,
            "ready_to_submit": ready_to_submit,
        }

    except AIServiceError:
        raise

    except Exception as exc:
        detail = (
            f"{type(exc).__name__} {str(exc)}"
        ).lower()

        if any(
            word in detail
            for word in (
                "rate",
                "quota",
                "429",
                "resource_exhausted",
            )
        ):
            raise AIServiceError(
                "The AI service is busy right now. "
                "Please try again shortly.",
                "AI_RATE_LIMIT_ERROR",
            ) from exc

        if any(
            word in detail
            for word in (
                "timeout",
                "deadline",
            )
        ):
            raise AIServiceError(
                "The AI service timed out. "
                "Please try again.",
                "AI_SERVICE_ERROR",
            ) from exc

        logger.error(
            "Gemini request failed: %s",
            type(exc).__name__,
        )

        raise AIServiceError(
            "The AI service is temporarily unavailable.",
            "AI_SERVICE_ERROR",
        ) from exc