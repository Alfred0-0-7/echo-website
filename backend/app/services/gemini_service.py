"""Gemini service for ECHO chatbot."""

import json
import logging

from google import genai

from app.config import settings


logger = logging.getLogger("echo.gemini")


SYSTEM_PROMPT = """
You are ECHO — The Signal Guardian.

Your tagline is:
"I hear what others ignore."

You are a calm, empathetic and futuristic superhero assistant.

Understand the visitor's problem and ask useful
follow-up questions.

Return ONLY valid JSON in this format:

{
  "reply": "Your response to the visitor",
  "category": "OTHER",
  "priority": "NORMAL",
  "summary": "",
  "ready_to_submit": false
}

Allowed categories:
EDUCATION, CAREER, FINANCIAL, PERSONAL,
TECHNICAL, SAFETY, OTHER

Allowed priorities:
LOW, NORMAL, HIGH, URGENT

Set ready_to_submit to true only when the grievance
has been sufficiently understood.
"""


def generate_echo_reply(
    message: str,
    history: list[dict] | None = None,
) -> dict:
    """Generate an AI response using Gemini."""

    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is missing.")

        return {
            "reply": (
                "My signal connection is currently unavailable. "
                "Please try again later."
            ),
            "category": "OTHER",
            "priority": "NORMAL",
            "summary": "",
            "ready_to_submit": False,
        }

    try:
        logger.info("Gemini API called for ECHO chatbot.")

        client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        prompt = f"""
{SYSTEM_PROMPT}

Conversation history:
{json.dumps(history or [], ensure_ascii=False)}

New visitor message:
{message}
"""

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )

        raw_text = (response.text or "").strip()

        # Remove Markdown JSON fences if Gemini adds them.
        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "")
            raw_text = raw_text.replace("```", "")
            raw_text = raw_text.strip()

        result = json.loads(raw_text)

        return {
            "reply": str(
                result.get(
                    "reply",
                    "I hear you. Could you tell me more?",
                )
            ),
            "category": str(
                result.get("category", "OTHER")
            ),
            "priority": str(
                result.get("priority", "NORMAL")
            ),
            "summary": str(
                result.get("summary", "")
            ),
            "ready_to_submit": bool(
                result.get("ready_to_submit", False)
            ),
        }

    except Exception:
        logger.exception("Gemini request failed.")

        return {
            "reply": (
                "I am having trouble tracing that signal. "
                "Could you explain your concern again?"
            ),
            "category": "OTHER",
            "priority": "NORMAL",
            "summary": "",
            "ready_to_submit": False,
        }