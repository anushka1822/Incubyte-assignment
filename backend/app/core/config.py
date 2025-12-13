import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        # This tells Pydantic to look for .env in the same directory as this file's parent
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        env_ignore_empty=True,
        extra="ignore"
    )

settings = Settings()