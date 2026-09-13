"""Application configuration.

All secrets are read from environment variables. Nothing is hardcoded and
nothing here is ever exposed to the frontend.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "ECHO — The Signal Guardian")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "")
    CANDIDATE_EMAIL: str = os.getenv("CANDIDATE_EMAIL", "")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def allowed_origins(self) -> list[str]:
        """CORS origins. Always allow local Next.js dev; add the deployed URL."""
        origins = {
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        }
        if self.FRONTEND_URL:
            origins.add(self.FRONTEND_URL.rstrip("/"))
        return list(origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
