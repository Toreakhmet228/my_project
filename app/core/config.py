import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://user:password@localhost:5432/shop"
    )
    
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS",
        "https://404tears.kz,https://www.404tears.kz"
    ).split(",")
    
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

settings = Settings()
