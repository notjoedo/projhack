# import os, json, requests, logging

# log = logging.getLogger("gemini")

# # Env
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_TIMEOUT = float(os.getenv("GEMINI_TIMEOUT", "4"))  # seconds

# def _require_key():
#     if not GEMINI_API_KEY:
#         raise RuntimeError("GEMINI_API_KEY not set in .env")

# def _post(url: str, payload: dict):
#     r = requests.post(url, json=payload, timeout=GEMINI_TIMEOUT)
#     r.raise_for_status()
#     return r.json()

# # -------- Embeddings (text-embedding-004, 768 dims) --------
# def embed_text(text: str) -> list:
#     """
#     Returns a 768-d embedding from Gemini text-embedding-004 via REST.
#     """
#     _require_key()
#     url = (
#         "https://generativelanguage.googleapis.com/v1beta/"
#         "models/text-embedding-004:embedContent"
#         f"?key={GEMINI_API_KEY}"
#     )
#     payload = {
#         "model": "models/text-embedding-004",
#         "content": {"parts": [{"text": text[:8000]}]},
#         # "taskType": "RETRIEVAL_QUERY"  # optional hint
#     }
#     try:
#         data = _post(url, payload)
#         emb = (data.get("embedding", {}) or {}).get("values") or []
#         if not emb:
#             raise RuntimeError("Empty embedding from API")
#         return emb
#     except requests.Timeout:
#         raise RuntimeError(f"Gemini embed timeout after {GEMINI_TIMEOUT}s")
#     except Exception as e:
#         snippet = ""
#         try:
#             snippet = e.response.text[:200]  # type: ignore[attr-defined]
#         except Exception:
#             pass
#         log.error("Gemini embed error: %s | %s", e, snippet)
#         raise
# def get_model(name: str, system_instruction: str | None = None):
#     if not genai._client:
#         genai.configure(api_key=settings.GEMINI_API_KEY)
#     return genai.GenerativeModel(model_name=name, system_instruction=system_instruction)

# def generate_json(model, parts: list[dict | str]):
#     """Call Gemini and coerce to JSON; raise on parse errors."""
#     resp = model.generate_content(parts)
#     text = resp.text or "{}"
#     # be permissive but safe
#     import json, re
#     try:
#         # extract first JSON block
#         m = re.search(r'\{.*\}', text, re.S)
#         return json.loads(m.group(0)) if m else {}
#     except Exception as e:
#         raise ValueError(f"Gemini response not JSON: {text[:400]}...") from e
# # -------- Structured explanation (Gemini 1.5 Flash) --------
# def generate_structured_explanation(evidence: dict) -> dict:
#     """
#     Ask for STRICT JSON: { summary:str, reasons:[str], numbers_used:[number] }.
#     Returns parsed dict; caller should catch & fallback if needed.
#     """
#     _require_key()
#     url = (
#         "https://generativelanguage.googleapis.com/v1beta/"
#         "models/gemini-1.5-flash:generateContent"
#         f"?key={GEMINI_API_KEY}"
#     )

#     system = (
#         "You are a housing match explainer. "
#         "Write at most 2 concise sentences in 'summary'. "
#         "In 'reasons', list 2–4 short bullets using ONLY facts provided in 'evidence'. "
#         "Include only numbers present in evidence under 'numbers_used'. "
#         "Do not invent facts. Keep it neutral and helpful."
#     )
#     prompt = (
#         "Return ONLY JSON with keys: summary (string), reasons (array of strings), numbers_used (array of numbers). "
#         "Evidence JSON follows:\n" + json.dumps(evidence, ensure_ascii=False)
#     )

#     payload = {
#         "contents": [
#             {"role": "user", "parts": [{"text": system}]},
#             {"role": "user", "parts": [{"text": prompt}]}
#         ],
#         "generationConfig": {
#             "responseMimeType": "application/json"
#         }
#     }
# backend/app/gemini_client.py

import os
import time
import json
import hashlib
import random
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout

from .config import GEMINI_API_KEY, GEMINI_TIMEOUT, EMBED_SIZE

# --- Optional Gemini import (runs even if lib/key missing) ---
try:
    import google.generativeai as genai  # type: ignore
    _HAS_GENAI = True
except Exception:
    genai = None
    _HAS_GENAI = False


# =========================
# Embeddings (vector path)
# =========================
def embed_text(text: str):
    """
    Returns an embedding vector. If no API key/library is present,
    returns a deterministic pseudo-embedding so the rest of the pipeline
    still works during dev.
    """
    if not GEMINI_API_KEY or not _HAS_GENAI:
        h = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)
        rng = random.Random(h)
        return [rng.uniform(-1.0, 1.0) for _ in range(EMBED_SIZE)]

    # TODO: If you want real embeddings, uncomment this block and ensure the
    # vector_desc column matches the dimension you pick.
    #
    # try:
    #     genai.configure(api_key=GEMINI_API_KEY)
    #     model = genai.GenerativeModel("text-embedding-004")
    #     out = model.embed_content(text=text)
    #     vec = out["embedding"]
    #     return vec
    # except Exception:
    #     pass

    # Fallback to deterministic vector even if key exists (keeps tests stable)
    time.sleep(min(GEMINI_TIMEOUT / 10.0, 0.3))
    h = int(hashlib.sha256(("gemini:" + text).encode("utf-8")).hexdigest(), 16)
    rng = random.Random(h)
    return [rng.uniform(-1.0, 1.0) for _ in range(EMBED_SIZE)]


# =========================
# Rationale generation
# =========================

# Your guidance passages (as provided)
PASSAGE_1 = (
    "Buying a home is more than a big financial commitment – it’s also emotional. "
    "If you don’t love or at least like your home, the time and money you put into buying it may not feel worth it. "
    "It’s also not always easy to know if a home is right for you. Sometimes, you’ll know the moment you see it, "
    "but it often takes time and careful consideration to make a good decision. "
    "Tips: Make a wants/needs/must-haves list, know what you can afford before shopping, take your time, "
    "but be ready to act quickly."
)

PASSAGE_2 = (
    "Understand how much house you can afford to avoid becoming house-poor. "
    "Rules of thumb: borrow roughly 2–3× annual income; or follow the 28/36 rule "
    "(housing ≤ 28% of gross monthly income; total debt ≤ 36%)."
)

# Teaching prompt given to the model
SYSTEM_INSTRUCTIONS = """You are a housing-matcher assistant.
Write ONE short, natural sentence (≤ 18 words) explaining *why this listing is a good match*.
VARY the wording between listings—avoid repeating the same template.
Use both passages below as reasoning aids:
- Passage 1 ⇒ lifestyle/emotional fit, quiet/comfort, liking the home.
- Passage 2 ⇒ affordability heuristics (budget fit, not house-poor, 28/36 rule).
Base the sentence on the numeric factors/amenities provided; reference at most 2–3 strengths.
Finish EXACTLY with: " — {pct}% match." (em dash, space, percentage)"""

def _build_reasoning_prompt(user_query: str, title: str, price: int, distance: float, factors: dict, compat_pct: int) -> str:
    # Compact factors to help the model pick salient points
    compact = {
        "price_score": round(float(factors.get("price", 0)), 3),
        "distance_score": round(float(factors.get("distance", 0)), 3),
        "safety_score": round(float(factors.get("safety", 0)), 3),
        "walk_score": round(float(factors.get("walk", 0)), 3),
        "vector_match": round(float(factors.get("vector", 0)), 3),
        "amenities_overlap": round(float(factors.get("amenities", 0)), 3),
    }
    return (
        f"{SYSTEM_INSTRUCTIONS}\n\n"
        f"Passage 1:\n{PASSAGE_1}\n\n"
        f"Passage 2:\n{PASSAGE_2}\n\n"
        f"User query: {json.dumps(user_query)}\n"
        f"Listing: {json.dumps(title)} | price ${price}/mo | distance {distance:.1f} miles\n"
        f"Compatibility: {compat_pct}%\n"
        f"Scoring factors (0–1): {json.dumps(compact)}\n\n"
        "Output: ONE varied sentence, lifestyle + affordability when relevant. "
        "Do NOT include extra quotes or bullets. End with the required suffix."
    )

def _clean_one_line(s: str, compat_pct: int, title_fallback: str) -> str:
    if not s:
        return f"{title_fallback}: good overall fit — {compat_pct}% match."
    # Collapse whitespace and newlines
    s = " ".join(s.strip().split())
    # Ensure it ends with the suffix once
    suffix = f" — {compat_pct}% match."
    if suffix not in s:
        # Strip trailing punctuation to avoid double periods before suffix
        s = s.rstrip(" .;:,-")
        s = f"{s}{suffix}"
    return s

def _call_gemini_with_timeout(prompt: str, timeout_s: float) -> str:
    """
    Run the model call in a worker thread so we can enforce a timeout cleanly.
    """
    if not GEMINI_API_KEY or not _HAS_GENAI:
        raise RuntimeError("Gemini not configured")

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash") 

    def _run():
        resp = model.generate_content(prompt)
        return getattr(resp, "text", "").strip()

    with ThreadPoolExecutor(max_workers=1) as ex:
        fut = ex.submit(_run)
        return fut.result(timeout=max(1.0, float(timeout_s)))

# ------- Fallback generator (no API key) -------
def _fallback_reason(title: str, price: int, dist: float, factors: dict, compat_pct: int, amenities_match: bool):
    """
    Builds varied, human-ish rationales without an API key, using scores/amenities
    to pick different phrasings each time.
    """
    bits = []
    if factors.get("price", 0) >= 0.75: bits.append("fits your budget")
    if factors.get("distance", 0) >= 0.75: bits.append("near your target area")
    if factors.get("vector", 0) >= 0.65: bits.append("matches your stated preferences")
    if factors.get("safety", 0) >= 0.70: bits.append("high safety rating")
    if factors.get("walk", 0) >= 0.70: bits.append("good walkability")
    if amenities_match: bits.append("amenities align well")

    alts = [
        "budget-friendly and convenient",
        "close enough for quick commutes",
        "strong fit for your lifestyle",
        "good overall value",
        "in a quieter area",
        "won’t leave you house-poor",
        "balanced comfort and cost",
    ]

    rng = random.Random(hashlib.sha256(f"{title}-{price}-{compat_pct}".encode()).hexdigest())
    pool = bits or alts
    chosen = rng.sample(pool, k=min(2, len(pool)))
    templates = [
        "{title}: {a} & {b} — {pct}% match.",
        "{title}: {a}, plus {b}. — {pct}% match.",
        "{title}: {a}; also {b}. — {pct}% match.",
        "{title}: {a}. {b}. — {pct}% match.",
        "{title}: {b} while {a}. — {pct}% match.",
    ]
    t = rng.choice(templates)
    a = chosen[0]
    b = chosen[1] if len(chosen) > 1 else "solid overall fit"
    return t.format(title=title or "This listing", a=a, b=b, pct=compat_pct)

def summarize_reason(user_query: str, title: str, price: int, dist: float, factors: dict, compat_pct: int) -> str:
    """
    Returns ONE varied line explaining why this listing is a good match.
    - If Gemini is configured: prompt with your two passages + factors to produce a unique sentence.
    - Else: use a smart fallback that varies wording using scores & amenities.
    """
    title = title or "This listing"

    # If no Gemini, return varied fallback immediately
    if not GEMINI_API_KEY or not _HAS_GENAI:
        amenities_match = factors.get("amenities", 0) >= 0.5
        return _fallback_reason(title, price, dist, factors, compat_pct, amenities_match)

    # Build and call Gemini with timeout
    prompt = _build_reasoning_prompt(user_query, title, price, dist, factors, compat_pct)
    try:
        raw = _call_gemini_with_timeout(prompt, timeout_s=float(GEMINI_TIMEOUT))
        return _clean_one_line(raw, compat_pct, title)
    except (FuturesTimeout, Exception):
        # On any failure, fall back to varied local phrasing
        amenities_match = factors.get("amenities", 0) >= 0.5
        return _fallback_reason(title, price, dist, factors, compat_pct, amenities_match)
#     try:
#         data = _post(url, payload)
#         cand = (data.get("candidates") or [{}])[0]
#         parts = ((cand.get("content") or {}).get("parts") or [{}])
#         text = parts[0].get("text", "{}")
#         return json.loads(text)
#     except requests.Timeout:
#         raise RuntimeError(f"Gemini explain timeout after {GEMINI_TIMEOUT}s")
#     except Exception as e:
#         snippet = ""
#         try:
#             snippet = e.response.text[:200]  # type: ignore[attr-defined]
#         except Exception:
#             pass
#         log.error("Gemini explain error: %s | %s", e, snippet)
#         raise