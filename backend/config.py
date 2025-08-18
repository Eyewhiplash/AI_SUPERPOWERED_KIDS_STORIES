import os


class Settings:
    def __init__(self) -> None:
        # App
        self.cors_allow_origins: str = os.getenv("CORS_ALLOW_ORIGINS", "*")
        # DB
        self.db_host: str = os.getenv("DB_HOST", "db")
        self.db_name: str = os.getenv("DB_NAME", "stories")
        self.db_user: str = os.getenv("DB_USER", "user")
        self.db_pass: str = os.getenv("DB_PASS", "pass")
        # Auth
        self.jwt_secret: str = os.getenv("JWT_SECRET", "change-me-in-prod")
        self.jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.jwt_exp_minutes: int = int(os.getenv("JWT_EXP_MINUTES", "60"))
        # OpenAI
        self.openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
        self.openai_timeout: float = float(os.getenv("OPENAI_TIMEOUT", "30"))
        self.openai_tts_model: str = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
        self.openai_tts_voice: str = os.getenv("OPENAI_TTS_VOICE", "alloy")
        self.openai_image_model: str = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1")
        self.openai_image_fallback_model: str = os.getenv("OPENAI_IMAGE_FALLBACK_MODEL", "dall-e-3")


settings = Settings()


