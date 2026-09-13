"""Supabase client factory.

The client is created lazily and cached. If credentials are missing the
factory returns None so callers can fail cleanly instead of crashing.
"""

import logging
from functools import lru_cache
from typing import Optional

from app.config import settings

logger = logging.getLogger("echo.db")


@lru_cache
def get_supabase() -> Optional["object"]:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.warning("Supabase credentials are missing; database is disabled.")
        return None
    try:
        from supabase import create_client

        return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception:  # noqa: BLE001 - never leak client init details
        logger.error("Failed to initialize the Supabase client.")
        return None
