from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Dict, Any, Optional
from ..db import get_db
from ..models import Listing

router = APIRouter()

def _fmt_money(x: Optional[float]) -> Optional[str]:
    if x is None: return None
    return f"${int(round(x))}"

@router.post("/explain")
def explain(body: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Request body:
      { "listing_id": "abc123", "prefs": { "budget_min": 600, "budget_max": 900, "amenities": ["Fitness Center","Dog Park"] } }
    """
    listing_id = body.get("listing_id")
    if not listing_id:
        raise HTTPException(400, "listing_id is required")

    prefs: Dict[str, Any] = body.get("prefs") or {}
    l: Listing | None = db.execute(select(Listing).where(Listing.id == listing_id)).scalar_one_or_none()
    if not l:
        raise HTTPException(404, "Listing not found")

    # Facts pulled from DB
    facts = {
        "price_total": l.price,
        "distance_miles": l.distance_miles,
        "top_amenities": (l.amenities or [])[:3],
        "area_scores": {"safety": l.safety_score, "walk": l.walk_score},
    }

    # Build deterministic explanation (2 short sentences)
    bmin, bmax = prefs.get("budget_min"), prefs.get("budget_max")
    budget_clause = ""
    if bmin is not None and bmax is not None:
        budget_clause = f"within your {_fmt_money(bmin)}–{_fmt_money(bmax)} budget" if (bmin <= l.price <= bmax) else f"near your {_fmt_money(bmin)}–{_fmt_money(bmax)} budget"

    dist_clause = f"{l.distance_miles} miles from campus" if l.distance_miles is not None else "near campus"
    amen = ", ".join(facts["top_amenities"]) if facts["top_amenities"] else "core amenities"
    safety = f"safety {int(l.safety_score)}" if l.safety_score is not None else None
    walk = f"walk {int(l.walk_score)}" if l.walk_score is not None else None
    area_bits = " & ".join([x for x in [safety, walk] if x])

    summary = f"Good fit {budget_clause} and approximately {dist_clause}." if budget_clause else f"Good fit at {_fmt_money(l.price)} and approximately {dist_clause}."
    summary += f" Amenities include {amen}." if facts["top_amenities"] else ""

    reasons = []
    if budget_clause:
        reasons.append(budget_clause.capitalize())
    reasons.append(f"Distance: {dist_clause}")
    if area_bits:
        reasons.append(f"Area scores: {area_bits}")

    numbers_used = []
    if bmin is not None and bmax is not None:
        numbers_used += [int(bmin), int(bmax)]
    if l.price is not None:
        numbers_used.append(int(round(l.price)))
    if l.distance_miles is not None:
        numbers_used.append(float(l.distance_miles))
    if l.safety_score is not None:
        numbers_used.append(int(l.safety_score))
    if l.walk_score is not None:
        numbers_used.append(int(l.walk_score))

    return {
        "summary": summary.strip(),
        "reasons": reasons,
        "numbers_used": numbers_used
    }