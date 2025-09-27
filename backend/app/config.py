import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", "8007"))
ENV = os.getenv("ENV", "dev")

DATABASE_URL = os.getenv("DATABASE_URL")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_REWRITE = os.getenv("GEMINI_MODEL_REWRITE", "gemini-2.5-flash")
GEMINI_MODEL_EXPLAIN = os.getenv("GEMINI_MODEL_EXPLAIN", "gemini-2.5-flash")

USE_MMR = os.getenv("USE_MMR", "true").lower() == "true"
MMR_LAMBDA = float(os.getenv("MMR_LAMBDA", "0.7"))
TOPK_RETRIEVAL = int(os.getenv("TOPK_RETRIEVAL", "120"))
TOPN_RETURN = int(os.getenv("TOPN_RETURN", "20"))