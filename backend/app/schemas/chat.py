"""Pydantic schemas for the chat endpoint."""

from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class ChatVisitor(BaseModel):
    """Visitor information already collected by the frontend (all optional)."""

    name: Optional[str] = Field(default=None, max_length=100)
    age: Optional[int] = Field(default=None, ge=1, le=120)
    location: Optional[str] = Field(default=None, max_length=200)
    email: Optional[EmailStr] = None


class ChatTurn(BaseModel):
    role: Literal["assistant", "user"]
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation: List[ChatTurn] = Field(default_factory=list)
    visitor: Optional[ChatVisitor] = None
    stage: str = Field(default="grievance", max_length=40)

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty")
        return v


class ChatResponse(BaseModel):
    reply: str
    stage: str
    suggested_category: Optional[str] = None
