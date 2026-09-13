"""Small, dependency-free helpers shared across services."""

from __future__ import annotations

# Keyword heuristics used as a safe fallback when the AI cannot classify a
# grievance (e.g. Gemini is unavailable). Categories match the DB constraint.
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "HEALTH": ["hospital", "sick", "doctor", "medicine", "health", "clinic", "injury", "mental"],
    "SAFETY": ["unsafe", "danger", "crime", "accident", "fire", "threat", "harass", "violence"],
    "EDUCATION": ["school", "student", "college", "teacher", "exam", "education", "learn", "class"],
    "ENVIRONMENT": ["pollution", "garbage", "water", "tree", "waste", "air", "flood", "environment"],
    "COMMUNITY": ["neighbor", "community", "road", "street", "help", "people", "local", "housing"],
}

_HIGH_PRIORITY = ["urgent", "emergency", "immediately", "danger", "critical", "help me"]


def guess_category(text: str) -> str:
    """Best-effort category guess. Returns one of the allowed categories."""
    lowered = (text or "").lower()
    best_category = "OTHER"
    best_score = 0
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in lowered)
        if score > best_score:
            best_score = score
            best_category = category
    return best_category


def guess_priority(text: str) -> str:
    """Best-effort priority guess: HIGH when urgent language is present."""
    lowered = (text or "").lower()
    return "HIGH" if any(kw in lowered for kw in _HIGH_PRIORITY) else "NORMAL"
