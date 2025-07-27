"""
Application configuration management.

This module handles all configuration settings for the AI Kids Stories backend,
using Pydantic Settings for type-safe configuration with environment variable support.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from functools import lru_cache
import os


class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    
    All settings can be overridden by environment variables.
    For nested settings, use double underscore notation (e.g., DATABASE__URL).
    """
    
    # Application
    app_name: str = Field(default="AI Kids Stories API", description="Application name")
    environment: str = Field(default="development", description="Environment (development/staging/production)")
    debug: bool = Field(default=True, description="Debug mode")
    version: str = Field(default="0.1.0", description="API version")
    
    # Server
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")
    
    # Database
    database_url: str = Field(..., description="PostgreSQL database URL")
    
    # Redis
    redis_url: str = Field(..., description="Redis connection URL")
    
    # Security
    secret_key: str = Field(..., min_length=32, description="Secret key for JWT tokens")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(default=30, description="JWT token expiration time")
    
    # AI Configuration
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    openai_model: str = Field(default="gpt-3.5-turbo", description="OpenAI model to use")
    max_story_length: int = Field(default=2000, description="Maximum story length in characters")
    
    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins"
    )
    
    # File Upload
    max_file_size: int = Field(default=10485760, description="Maximum file size in bytes (10MB)")
    upload_dir: str = Field(default="uploads", description="Upload directory")
    
    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    
    @validator("environment")
    def validate_environment(cls, v):
        """Validate environment value."""
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of: {allowed}")
        return v
    
    @validator("cors_origins", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            # Handle JSON string format from environment variables
            import json
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Handle comma-separated string
                return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings.
    
    Using lru_cache ensures settings are loaded once and cached for the application lifetime.
    """
    return Settings()


# Global settings instance
settings = get_settings() 