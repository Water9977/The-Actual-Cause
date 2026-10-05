import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SYNAPSE-OS"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # FalkorDB Connection Settings
    FALKORDB_URL: str = os.getenv("FALKORDB_URL", "")
    FALKORDB_HOST: str = os.getenv("FALKORDB_HOST", "localhost")
    FALKORDB_PORT: int = int(os.getenv("FALKORDB_PORT", "6379"))
    FALKORDB_USERNAME: str = os.getenv("FALKORDB_USERNAME", "")
    FALKORDB_PASSWORD: str = os.getenv("FALKORDB_PASSWORD", "")
    FALKORDB_SSL: bool = os.getenv("FALKORDB_SSL", "false").lower() in ("true", "1", "yes")
    FALKORDB_MASTER_GRAPH: str = os.getenv("FALKORDB_MASTER_GRAPH", "enterprise_master")
    
    # LLM Settings (Gemini 3.8 Flash / Gemini 4 Argon)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_LLM_MODEL: str = os.getenv("DEFAULT_LLM_MODEL", "gemini/gemini-3.8-flash")
    FAST_LLM_MODEL: str = os.getenv("FAST_LLM_MODEL", "gemini/gemini-3.8-flash")
    REASONING_LLM_MODEL: str = os.getenv("REASONING_LLM_MODEL", "gemini/gemini-3.8-flash")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

settings = Settings()
