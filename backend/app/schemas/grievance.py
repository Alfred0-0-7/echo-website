"""Pydantic schemas for the grievance endpoint."""

from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

ALLOWED_CATEGORIES = {
    "COMMUNITY",
    "HEALTH",
    "EDUCATION",
    "SAFETY",
    "ENVIRONMENT",
    "OTHER",
}
ALLOWED_PRIORITIES = {"LOW", "NORMAL", "HIGH"}


class GrievanceRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=1, le=120)
    location: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    grievance: str = Field(..., min_length=1, max_length=5000)
    category: str = Field(default="OTHER", max_length=50)
    priority: str = Field(default="NORMAL", max_length=30)

    @field_validator("name", "location", "grievance")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("This field cannot be empty")
        return v

    @field_validator("category")
    @classmethod
    def normalize_category(cls, v: str) -> str:
        v = (v or "OTHER").strip().upper()
        return v if v in ALLOWED_CATEGORIES else "OTHER"

    @field_validator("priority")
    @classmethod
    def normalize_priority(cls, v: str) -> str:
        v = (v or "NORMAL").strip().upper()
        return v if v in ALLOWED_PRIORITIES else "NORMAL"


class GrievanceResponse(BaseModel):
    success: bool
    message: str
    grievance_id: Optional[str] = None
    email_sent: bool = False
    created_at: Optional[str] = None
