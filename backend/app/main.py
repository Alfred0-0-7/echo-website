"""ECHO — The Signal Guardian: FastAPI application entrypoint."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes import chat, grievance, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("echo")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend for the ECHO superhero help portal.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

# CORS — restricted to the configured frontend origin(s), never wide open.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(grievance.router, prefix="/api")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    message = "Invalid input."
    if errors:
        first = errors[0]
        field = ".".join(str(p) for p in first.get("loc", []) if p != "body")
        raw = first.get("msg", "Invalid input")
        message = f"{field}: {raw}" if field else raw
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": message, "code": "VALIDATION_ERROR"},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Never leak stack traces or exception details to clients.
    logger.error("Unhandled error: %s", type(exc).__name__)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An unexpected error occurred.",
            "code": "INTERNAL_SERVER_ERROR",
        },
    )


@app.get("/")
async def root() -> dict:
    return {"status": "ok", "service": settings.APP_NAME}
