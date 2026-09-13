"""Persistence layer for grievances (Supabase)."""

import logging

from app.database.supabase import get_supabase
from app.schemas.grievance import GrievanceRequest

logger = logging.getLogger("echo.grievance")


class DatabaseError(Exception):
    """Raised when a grievance cannot be persisted."""


def save_grievance(data: GrievanceRequest) -> dict:
    """Insert a grievance and return the stored row. Raises DatabaseError."""
    client = get_supabase()
    if client is None:
        raise DatabaseError("The database is not configured.")

    payload = {
        "name": data.name,
        "age": data.age,
        "location": data.location,
        "email": str(data.email),
        "grievance": data.grievance,
        "category": data.category,
        "priority": data.priority,
        "status": "RECEIVED",
    }

    try:
        result = client.table("grievances").insert(payload).execute()
    except Exception as exc:  # noqa: BLE001 - never leak DB internals
        logger.error("Supabase insert failed: %s", type(exc).__name__)
        raise DatabaseError("Could not save the grievance.") from exc

    rows = getattr(result, "data", None) or []
    if not rows:
        raise DatabaseError("The grievance was not saved.")
    return rows[0]
