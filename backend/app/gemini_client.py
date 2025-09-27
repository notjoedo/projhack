import google.generativeai as genai
from .config import GEMINI_API_KEY

def _ensure_gemini():
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    else:
        raise RuntimeError("GEMINI_API_KEY not set")

def embed_text(text: str) -> list:
    """
    Returns a 768-d embedding using text-embedding-004
    """
    _ensure_gemini()
    # "models/" prefix is required in newer SDKs
    resp = genai.embed_content(model="models/text-embedding-004", content=text)
    # SDK returns dict with 'embedding'
    return resp["embedding"]