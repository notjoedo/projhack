import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/housing")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_TIMEOUT = float(os.getenv("GEMINI_TIMEOUT", "6.0"))
EMBED_SIZE = int(os.getenv("EMBED_SIZE", "768"))

TOPK = int(os.getenv("TOPK", "120"))
COMPATIBILITY_CUTOFF = float(os.getenv("COMPATIBILITY_CUTOFF", "0"))
