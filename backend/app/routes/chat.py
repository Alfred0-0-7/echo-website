"""Chat endpoint — talks to Gemini through the ECHO persona."""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import (
    AIServiceError,
    generate_reply,
)

logger = logging.getLogger("echo.routes.chat")

router = APIRouter(tags=["chat"])


@router.post("/chat")
async def chat(payload: ChatRequest):
    try:
        result = generate_reply(
            message=payload.message,
            conversation=payload.conversation,
            visitor=payload.visitor,
            stage=payload.stage,
        )

    except AIServiceError as exc:
        status = (
            429
            if exc.code == "AI_RATE_LIMIT_ERROR"
            else 503
        )

        return JSONResponse(
            status_code=status,
            content={
                "success": False,
                "error": str(exc),
                "code": exc.code,
            },
        )

    return ChatResponse(
        reply=result["reply"],
        stage=payload.stage,
        suggested_category=result["category"],
        priority=result["priority"],
        summary=result["summary"],
        follow_up_question=result["follow_up_question"],
        ready_to_submit=result["ready_to_submit"],
    )