"""Brevo transactional email service.

Sends:
1. Full grievance notification to CANDIDATE_EMAIL.
2. Confirmation email to the visitor's submitted email.

Uses the Brevo REST API directly through httpx.
"""

import html
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import settings


logger = logging.getLogger("echo.email")

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"

EMAIL_SUBJECT = (
    "🦸 Someone Needs Your Help! — ECHO Signal Received"
)

VISITOR_EMAIL_SUBJECT = (
    "ECHO received your request"
)


def _mask_email(email: str | None) -> str:
    """Mask an email address for safe logging."""

    if not email or "@" not in email:
        return "****"

    try:
        local, domain = email.split("@", 1)

        if not local:
            return f"****@{domain}"

        return f"{local[0]}****@{domain}"

    except Exception:  # noqa: BLE001
        return "****"


def _send_email(
    *,
    recipient_email: str,
    recipient_name: str,
    subject: str,
    html_content: str,
    text_content: str,
) -> bool:
    """Send one email through Brevo."""

    if not settings.BREVO_API_KEY:
        logger.warning("BREVO_API_KEY is not configured.")
        return False

    if not settings.EMAIL_FROM:
        logger.warning("EMAIL_FROM is not configured.")
        return False

    if not recipient_email:
        logger.warning("Recipient email is missing.")
        return False

    payload = {
        "sender": {
            "name": "ECHO Signal Guardian",
            "email": settings.EMAIL_FROM,
        },
        "to": [
            {
                "email": recipient_email,
                "name": recipient_name or "User",
            }
        ],
        "subject": subject,
        "htmlContent": html_content,
        "textContent": text_content,
    }

    headers = {
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json",
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                BREVO_ENDPOINT,
                headers=headers,
                json=payload,
            )

        if response.status_code in (200, 201, 202):
            logger.info(
                "Email sent to %s",
                _mask_email(recipient_email),
            )
            return True

        logger.error(
            "Brevo responded with status %s",
            response.status_code,
        )
        return False

    except httpx.RequestError as exc:
        logger.error(
            "Brevo request failed: %s",
            type(exc).__name__,
        )
        return False

    except Exception as exc:  # noqa: BLE001
        logger.error(
            "Unexpected email error: %s",
            type(exc).__name__,
        )
        return False


def _build_admin_html(
    grievance: dict[str, Any],
    date_str: str,
    time_str: str,
) -> str:
    """Build the admin notification HTML."""

    name = html.escape(str(grievance.get("name", "")))
    age = html.escape(str(grievance.get("age", "")))
    location = html.escape(str(grievance.get("location", "")))
    email = html.escape(str(grievance.get("email", "")))
    message = html.escape(str(grievance.get("grievance", "")))
    category = html.escape(
        str(grievance.get("category", "General"))
    )
    priority = html.escape(
        str(grievance.get("priority", "MEDIUM"))
    )
    grievance_id = html.escape(
        str(grievance.get("id", ""))
    )

    return f"""
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0e14;
  font-family:Arial,Helvetica,sans-serif;">

    <div style="max-width:600px;margin:0 auto;padding:24px;">

      <div style="border:1px solid rgba(34,211,238,0.25);
      border-radius:16px;overflow:hidden;background:#0d1220;">

        <div style="padding:24px;
        border-bottom:1px solid rgba(34,211,238,0.15);">

          <div style="font-size:12px;letter-spacing:4px;
          color:#22d3ee;">
            ECHO // SIGNAL CHANNEL
          </div>

          <h1 style="margin:8px 0 0;font-size:20px;color:#e6f6ff;">
            NEW SIGNAL RECEIVED
          </h1>
        </div>

        <div style="padding:24px;color:#cbd5e1;
        font-size:14px;line-height:1.6;">

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#7dd3fc;width:150px;">
                Visitor Name
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {name}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Visitor Age
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {age}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Location
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {location}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Visitor Email
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {email}
              </td>
            </tr>
          </table>

          <div style="margin-top:16px;padding:16px;
          border-radius:12px;background:#0a0e14;
          border:1px solid rgba(34,211,238,0.15);">

            <div style="font-size:11px;letter-spacing:2px;
            color:#22d3ee;margin-bottom:8px;">
              GRIEVANCE / REQUEST
            </div>

            <div style="color:#e6f6ff;white-space:pre-wrap;">
              {message}
            </div>
          </div>

          <table style="width:100%;border-collapse:collapse;
          margin-top:16px;">

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;width:150px;">
                Category
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {category}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Priority
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {priority}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Submission Date
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {date_str}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Submission Time
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {time_str}
              </td>
            </tr>

            <tr>
              <td style="padding:6px 0;color:#7dd3fc;">
                Grievance ID
              </td>
              <td style="padding:6px 0;color:#e6f6ff;">
                {grievance_id}
              </td>
            </tr>
          </table>
        </div>

        <div style="padding:16px 24px;
        border-top:1px solid rgba(34,211,238,0.15);
        color:#64748b;font-size:11px;letter-spacing:2px;">

          ECHO — I HEAR WHAT OTHERS IGNORE

        </div>
      </div>
    </div>
  </body>
</html>
"""


def _build_admin_text(
    grievance: dict[str, Any],
    date_str: str,
    time_str: str,
) -> str:
    """Build the admin notification plain text."""

    return f"""
ECHO — NEW SIGNAL RECEIVED

Visitor Name: {grievance.get("name", "")}
Visitor Age: {grievance.get("age", "")}
Location: {grievance.get("location", "")}
Visitor Email: {grievance.get("email", "")}

Grievance / Request:
{grievance.get("grievance", "")}

Category: {grievance.get("category", "General")}
Priority: {grievance.get("priority", "MEDIUM")}

Submission Date: {date_str}
Submission Time: {time_str}
Grievance ID: {grievance.get("id", "")}
""".strip()


def _build_visitor_html(
    grievance: dict[str, Any],
    date_str: str,
    time_str: str,
) -> str:
    """Build the visitor confirmation HTML."""

    name = html.escape(
        str(grievance.get("name", "there"))
    )

    message = html.escape(
        str(grievance.get("grievance", ""))
    )

    return f"""
<!doctype html>
<html>
  <body style="margin:0;padding:24px;
  background:#0a0e14;font-family:Arial,Helvetica,sans-serif;">

    <div style="max-width:600px;margin:0 auto;padding:24px;
    background:#0d1220;border:1px solid rgba(34,211,238,0.25);
    border-radius:16px;color:#e6f6ff;">

      <div style="font-size:12px;letter-spacing:4px;
      color:#22d3ee;">
        ECHO // CONFIRMATION
      </div>

      <h2>Hello {name},</h2>

      <p>
        Thank you for contacting
        <strong>ECHO - The Signal Guardian</strong>.
      </p>

      <p>
        Your grievance has been successfully received.
      </p>

      <h3>Your Submitted Request</h3>

      <div style="padding:16px;border-radius:12px;
      background:#0a0e14;color:#cbd5e1;
      white-space:pre-wrap;">
        {message}
      </div>

      <p>
        <strong>Submitted Date:</strong> {date_str}
      </p>

      <p>
        <strong>Submitted Time:</strong> {time_str}
      </p>

      <p>
        Our team will review your request.
      </p>

      <p>Thank you for speaking up.</p>

      <p>
        <strong>- ECHO</strong>
      </p>
    </div>
  </body>
</html>
"""


def _build_visitor_text(
    grievance: dict[str, Any],
    date_str: str,
    time_str: str,
) -> str:
    """Build the visitor confirmation plain text."""

    return f"""
Hello {grievance.get("name", "there")},

Thank you for contacting ECHO - The Signal Guardian.

Your grievance has been successfully received.

Your submitted request:

{grievance.get("grievance", "")}

Submitted Date: {date_str}
Submitted Time: {time_str}

Our team will review your request.

Thank you for speaking up.

- ECHO
""".strip()


def send_grievance_emails(
    grievance: dict[str, Any],
) -> dict[str, bool]:
    """
    Send the admin notification and visitor confirmation.
    """

    if not (
        settings.BREVO_API_KEY
        and settings.EMAIL_FROM
        and settings.CANDIDATE_EMAIL
    ):
        logger.warning(
            "Brevo is not fully configured; "
            "skipping email notification."
        )

        return {
            "admin_email_sent": False,
            "visitor_email_sent": False,
            "email_sent": False,
        }

    visitor_email = str(
        grievance.get("email", "")
    ).strip()

    visitor_name = str(
        grievance.get("name", "Visitor")
    ).strip()

    if not visitor_email:
        logger.warning(
            "Visitor email is missing; "
            "visitor confirmation will not be sent."
        )

    now = datetime.now(timezone.utc)

    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S UTC")

    # Email 1: Full notification to you
    admin_sent = _send_email(
        recipient_email=settings.CANDIDATE_EMAIL,
        recipient_name="ECHO Admin",
        subject=EMAIL_SUBJECT,
        html_content=_build_admin_html(
            grievance,
            date_str,
            time_str,
        ),
        text_content=_build_admin_text(
            grievance,
            date_str,
            time_str,
        ),
    )

    # Email 2: Confirmation to visitor
    visitor_sent = False

    if visitor_email:
        visitor_sent = _send_email(
            recipient_email=visitor_email,
            recipient_name=visitor_name,
            subject=VISITOR_EMAIL_SUBJECT,
            html_content=_build_visitor_html(
                grievance,
                date_str,
                time_str,
            ),
            text_content=_build_visitor_text(
                grievance,
                date_str,
                time_str,
            ),
        )

    return {
        "admin_email_sent": admin_sent,
        "visitor_email_sent": visitor_sent,
        "email_sent": admin_sent and visitor_sent,
    }


def send_grievance_email(
    grievance: dict[str, Any],
) -> bool:
    """
    Backward-compatible function.

    Existing code using send_grievance_email()
    will continue to work.
    """

    result = send_grievance_emails(grievance)

    return result["email_sent"]