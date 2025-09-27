import os, json, requests, logging

log = logging.getLogger("gemini")

# Env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_TIMEOUT = float(os.getenv("GEMINI_TIMEOUT", "4"))  # seconds

def _require_key():
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in .env")

def _post(url: str, payload: dict):
    r = requests.post(url, json=payload, timeout=GEMINI_TIMEOUT)
    r.raise_for_status()
    return r.json()

# -------- Embeddings (text-embedding-004, 768 dims) --------
def embed_text(text: str) -> list:
    """
    Returns a 768-d embedding from Gemini text-embedding-004 via REST.
    """
    _require_key()
    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        "models/text-embedding-004:embedContent"
        f"?key={GEMINI_API_KEY}"
    )
    payload = {
        "model": "models/text-embedding-004",
        "content": {"parts": [{"text": text[:8000]}]},
        # "taskType": "RETRIEVAL_QUERY"  # optional hint
    }
    try:
        data = _post(url, payload)
        emb = (data.get("embedding", {}) or {}).get("values") or []
        if not emb:
            raise RuntimeError("Empty embedding from API")
        return emb
    except requests.Timeout:
        raise RuntimeError(f"Gemini embed timeout after {GEMINI_TIMEOUT}s")
    except Exception as e:
        snippet = ""
        try:
            snippet = e.response.text[:200]  # type: ignore[attr-defined]
        except Exception:
            pass
        log.error("Gemini embed error: %s | %s", e, snippet)
        raise

# -------- Structured explanation (Gemini 1.5 Flash) --------
def generate_structured_explanation(evidence: dict) -> dict:
    """
    Ask for STRICT JSON: { summary:str, reasons:[str], numbers_used:[number] }.
    Returns parsed dict; caller should catch & fallback if needed.
    """
    _require_key()
    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        "models/gemini-1.5-flash:generateContent"
        f"?key={GEMINI_API_KEY}"
    )

    system = (
        "You are a housing match explainer. "
        "Write at most 2 concise sentences in 'summary'. "
        "In 'reasons', list 2–4 short bullets using ONLY facts provided in 'evidence'. "
        "Include only numbers present in evidence under 'numbers_used'. "
        "Do not invent facts. Keep it neutral and helpful."
    )
    prompt = (
        "Return ONLY JSON with keys: summary (string), reasons (array of strings), numbers_used (array of numbers). "
        "Evidence JSON follows:\n" + json.dumps(evidence, ensure_ascii=False)
    )

    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system}]},
            {"role": "user", "parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        data = _post(url, payload)
        cand = (data.get("candidates") or [{}])[0]
        parts = ((cand.get("content") or {}).get("parts") or [{}])
        text = parts[0].get("text", "{}")
        return json.loads(text)
    except requests.Timeout:
        raise RuntimeError(f"Gemini explain timeout after {GEMINI_TIMEOUT}s")
    except Exception as e:
        snippet = ""
        try:
            snippet = e.response.text[:200]  # type: ignore[attr-defined]
        except Exception:
            pass
        log.error("Gemini explain error: %s | %s", e, snippet)
        raise