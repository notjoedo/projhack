# backend/app/routers/contact.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os, hashlib, random, time, re

router = APIRouter()

# ---- Gemini hooks ----
def have_gemini_key() -> bool:
    return bool(os.getenv("GEMINI_API_KEY"))

CONTACT_BASE_PROMPT = """You are an expert leasing assistant crafting a first message to a housing/lease owner.
Write a short, natural-sounding note that:
- Mentions what the renter likes (from the user's prompt).
- References 1–2 concrete reasons this listing fits (from factors/rationale/price).
- Asks 2–3 brief, useful questions (availability, lease terms, pet policy, tour time).
- Sounds human, friendly, and confident.
- 70–120 words. No emojis. No bullet points.

Inputs:
- UserPrompt: {user_prompt}
- ListingSummary: "{listing_title}" | price ${price}/mo | {compatibility}% match
- WhyMatch: {rationale}

Output:
A single-paragraph message addressed neutrally (no “Dear Sir/Madam”), first-person singular (“I”), ending with an inviting close.
"""

CONTACT_STYLE_PROMPT = """Rewrite the message below according to the instruction.
Keep the intent, listing details, and questions. Preserve names/numbers. Output one paragraph.

Instruction: {style_instruction}

Message to rewrite:
\"\"\"{message}\"\"\"
"""

STYLE_INSTR_CASUAL = "Make it more casual and conversational, slightly shorter, friendlier tone. Keep it professional."
STYLE_INSTR_SHORTER = "Make it meaningfully shorter (about 40–70 words) while keeping the core details and one or two questions."


# ---- Helpers ----
def _extract_prefs(user_prompt: str):
    """Very light parsing of user prompt for personalization."""
    p = (user_prompt or "").lower()
    wants = []
    if "quiet" in p or "calm" in p or "peaceful" in p:
        wants.append("a quiet place")
    if "pet" in p or "dog" in p or "cat" in p:
        wants.append("pet-friendly policies")
    if "gym" in p or "rec" in p or "fitness" in p:
        wants.append("access to a gym or rec center")
    # detect budget number
    m = re.search(r"\$?\s?(\d{3,4})", p.replace(",", ""))
    budget = int(m.group(1)) if m else None
    return wants, budget


def _fallback_compose(user_prompt: str, title: str, price, compat: int, rationale: str) -> str:
    title = title or "your place"
    price_txt = f"${int(price)}/mo" if isinstance(price, (int, float)) else (f"${price}/mo" if price else "your listed price")
    rationale = (rationale or "").strip().rstrip(".")
    wants, parsed_budget = _extract_prefs(user_prompt)

    # Candidate lines
    openers = [
        f"Hi there — I’m interested in {title} around {price_txt}.",
        f"Hello! I’m reaching out about {title} ({price_txt}).",
        f"Hi — I wanted to ask about {title} listed at {price_txt}.",
    ]
    mids = [
        "I’m looking near Virginia Tech and this place stood out.",
        "The location and overall fit look promising for me.",
        "From the details I’ve seen, it seems like a strong match.",
    ]
    if wants:
        mids.append("I’m prioritizing " + ", ".join(wants[:-1]) + ("" if len(wants) == 1 else f", and {wants[-1]}") + ".")
    if rationale:
        mids.append("Based on your info and my notes, " + rationale + ".")
    if parsed_budget and isinstance(price, (int, float)):
        if price <= parsed_budget:
            mids.append("The pricing looks workable for my budget.")
        else:
            mids.append("I’m flexible but keeping an eye on budget, too.")

    questions = [
        "Is it still available and what’s the earliest move-in?",
        "Could you share the lease length and any pet fees?",
        "Are utilities included or billed separately?",
        "Would a quick tour be possible sometime this week?",
    ]

    # Deterministic variation
    seed = f"{title}-{price}-{compat}-{user_prompt}"
    rng = random.Random(hashlib.sha256(seed.encode()).hexdigest())

    opener = rng.choice(openers)
    mid = rng.sample(mids, k=min(2, len(mids)))
    ask = rng.sample(questions, k=2)

    body = " ".join([opener] + mid + ask + ["Thanks so much!"])
    words = body.split()
    if len(words) > 120:
        body = " ".join(words[:120]) + "…"
    return body


def compose_contact_message(user_prompt: str, title: str, price, compatibility: int, rationale: str) -> str:
    if have_gemini_key():
        # TODO: call your real LLM with CONTACT_BASE_PROMPT
        time.sleep(0.2)
    return _fallback_compose(user_prompt, title, price, compatibility, rationale)


def rewrite_message(message: str, mode: str) -> str:
    text = (message or "").strip()
    if not text:
        return text

    if have_gemini_key():
        # TODO: call your real LLM with CONTACT_STYLE_PROMPT
        time.sleep(0.15)

    if mode == "casual":
        repl = {
            r"\bI am\b": "I’m",
            r"\bI would\b": "I’d",
            r"\bI have\b": "I’ve",
            r"\bI will\b": "I’ll",
            r"\bHello\b": "Hi",
        }
        for pat, rep in repl.items():
            text = re.sub(pat, rep, text)
        text = text.replace("Thanks so much!", "Thanks!").replace("Thank you.", "Thanks!")

    elif mode == "shorter":
        sentences = re.split(r"(?<=[\.\?!])\s+", text)
        keep, total = [], 0
        for s in sentences:
            total += len(s.split())
            if total > 70: break
            keep.append(s)
        text = " ".join(keep)
        words = text.split()
        if len(words) > 80:
            text = " ".join(words[:80]) + "…"

    return text


# ---- Schemas ----
class ComposeBody(BaseModel):
    user_prompt: str
    title: Optional[str] = "This listing"
    price: Optional[float] = None
    compatibility: Optional[int] = 0
    rationale: Optional[str] = ""


class RewriteBody(BaseModel):
    message: str
    mode: str  # 'casual' | 'shorter'


# ---- Routes ----
@router.post("/contact/compose")
def contact_compose(body: ComposeBody):
    try:
        msg = compose_contact_message(
            body.user_prompt,
            body.title,
            body.price,
            int(body.compatibility or 0),
            body.rationale or "",
        )
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/contact/rewrite")
def contact_rewrite(body: RewriteBody):
    try:
        if body.mode not in ("casual", "shorter"):
            raise ValueError("mode must be 'casual' or 'shorter'")
        msg = rewrite_message(body.message, body.mode)
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))