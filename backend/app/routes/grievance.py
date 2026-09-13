"""Grievance endpoint — validates, persists, then emails.

Public submission only. There is intentionally no endpoint to list or read
grievances.
"""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.grievance import (
    GrievanceRequest,
    GrievanceResponse,
)

from app.services.email_service import (
    send_grievance_emails,
)

from app.services.grievance_service import (
    DatabaseError,
    save_grievance,
)


logger = logging.getLogger("echo.routes.grievance")


router = APIRouter(tags=["grievance"])


@router.post("/grievance")
async def create_grievance(
    payload: GrievanceRequest,
):
    # 1. Persist first.
    # If database saving fails, do not report success.
    try:
        row = save_grievance(payload)

    except DatabaseError as exc:
        logger.error(
            "Database error while saving grievance: %s",
            str(exc),
        )

        return JSONResponse(
            status_code=502,
            content={
                "success": False,
                "error": str(exc),
                "code": "DATABASE_ERROR",
            },
        )

    grievance_id = str(
        row.get("id", "")
    )

    created_at = row.get(
        "created_at"
    )

    # 2. Send two emails:
    #    - Admin email to CANDIDATE_EMAIL
    #    - Confirmation email to visitor
    email_result = send_grievance_emails(row)

    admin_email_sent = email_result[
        "admin_email_sent"
    ]

    visitor_email_sent = email_result[
        "visitor_email_sent"
    ]

    all_emails_sent = email_result[
        "email_sent"
    ]

    if all_emails_sent:
        message = (
            "Your signal has been received. "
            "A confirmation email has been sent."
        )

    elif admin_email_sent:
        message = (
            "Your signal was saved and our team "
            "was notified, but the confirmation "
            "email could not be sent."
        )

    elif visitor_email_sent:
        message = (
            "Your signal was saved and a confirmation "
            "email was sent, but the admin notification "
            "could not be sent."
        )

    else:
        message = (
            "Your signal was saved, but the "
            "notification emails could not be sent."
        )

    return GrievanceResponse(
        success=True,
        message=message,
        grievance_id=grievance_id,
        email_sent=all_emails_sent,
        created_at=(
            str(created_at)
            if created_at
            else None
        ),
    )