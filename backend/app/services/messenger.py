import hashlib, random, time
from typing import Dict, Any, Optional
from ..services.prompt_templates import (
    CONTACT_BASE_PROMPT, CONTACT_STYLE_PROMPT,
    STYLE_INSTR_CASUAL, STYLE_INSTR_SHORTER
)
from ..services.embeddings import have_gemini_key  # reuse your key check if present
from ..services import explainer  # if you have generic LLM client here, otherwise stub

def _fallback_compose(user_prompt: str, title: str, price: Any, compat: int, rationale: str) -> str:
    """Heuristic (no-LLM) message that feels human enough for demos."""
    price_txt = f"${int(price)}/mo" if isinstance(price, (int, float)) else f"${price}/mo"
    bits = [
        "I’m looking at places near Virginia Tech and your listing caught my eye.",
        "I’m prioritizing something quiet and pet-friendly with decent access to the gym or campus amenities.",
        "From what I can tell, this looks like a strong fit."
    ]
    qs = [
        "Is it still available and what’s the earliest move-in?",
        "Could you share a quick overview of lease length and any pet fees?",
        "Would a short tour be possible this week?"
    ]
    rng = random.Random(hashlib.sha256((title+str(price)+str(compat)).encode()).hexdigest())
    s1 = bits[rng.randrange(len(bits))]
    s2 = bits[rng.randrange(len(bits))]
    q1 = qs[rng.randrange(len(qs))]
    q2 = qs[rng.randrange(len(qs))]
    why = rationale.replace("This listing: ", "").replace("—", "-")
    return (
        f"Hi there — I’m interested in {title or 'your place'} at around {price_txt}. "
        f"{s1} {s2} Based on my notes (“{user_prompt}”), and the match summary, {why} "
        f"{q1} {q2} Thanks so much!"
    )

def compose_contact_message(payload: Dict[str, Any]) -> str:
    """
    payload: {
      user_prompt, title, price, compatibility, rationale,
      tone? ('default'|'casual'), length? ('normal'|'short')
    }
    """
    user_prompt = payload.get("user_prompt") or ""
    title = payload.get("title") or "this listing"
    price = payload.get("price")
    compatibility = int(payload.get("compatibility") or 0)
    rationale = payload.get("rationale") or ""

    # If you have a real LLM client, call it here
    if have_gemini_key():
        prompt = CONTACT_BASE_PROMPT.format(
            user_prompt=user_prompt.strip(),
            listing_title=title,
            price=price,
            compatibility=compatibility,
            rationale=rationale.strip()
        )
        # Replace this with your actual Gemini client call:
        # return llm_complete(prompt, max_tokens=220)
        time.sleep(0.2)
        # Fall through demo-ish response:
    return _fallback_compose(user_prompt, title, price, compatibility, rationale)

def rewrite_message(message: str, mode: str) -> str:
    if have_gemini_key():
        style_instruction = STYLE_INSTR_CASUAL if mode == "casual" else STYLE_INSTR_SHORTER
        prompt = CONTACT_STYLE_PROMPT.format(style_instruction=style_instruction, message=message)
        # Replace with your actual Gemini client call:
        # return llm_complete(prompt, max_tokens=160)
        time.sleep(0.15)
    # Fallback heuristic rewrites
    text = message.strip()
    if mode == "casual":
        text = text.replace("I am", "I’m").replace("I would", "I’d").replace("Hello", "Hi")
    elif mode == "shorter":
        words = text.split()
        if len(words) > 70:
            text = " ".join(words[:70]) + "…"
    return text