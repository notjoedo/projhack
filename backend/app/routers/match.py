from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Dict, Any
import math

from ..db import get_db
from ..models import Listing

router = APIRouter()

def exp_closeness(delta: float, alpha: float) -> float:
    """Higher when price is close to budget mid (alpha≈300 spreads the curve)."""
    return math.exp(-abs(delta)/alpha)

def jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(a or []), set(b or [])
    if not sa and not sb:
        return 0.5
    inter = len(sa & sb)
    union = len(sa | sb)
    return inter/union if union else 0.0

def score_listing(row, prefs: Dict[str, Any]) -> Dict[str, float]:
    # Budget closeness
    budget_min = prefs.get("budget_min")
    budget_max = prefs.get("budget_max")
    budget_mid = None
    if budget_min is not None and budget_max is not None:
        budget_mid = 0.5*(float(budget_min)+float(budget_max))
    price = exp_closeness((row.price - (budget_mid or row.price)), alpha=300.0)

    # Distance (decay by miles); we seeded 0.3–2.5
    distance = math.exp(- (row.distance_miles or 0.0) / 1.0) if row.distance_miles is not None else 0.5

    # Amenities overlap
    pref_amen = prefs.get("amenities") or []
    amenities = row.amenities or []
    amenities_score = jaccard(pref_amen, amenities)

    # Semantic & freshness placeholders for now
    semantic = 0.6
    freshness = 0.8

    # Area = mean of safety & walk if present
    area_vals = []
    if row.safety_score is not None: area_vals.append(row.safety_score/100.0)
    if row.walk_score is not None: area_vals.append(row.walk_score/100.0)
    area = sum(area_vals)/len(area_vals) if area_vals else 0.5

    return {
        "price": price, "distance": distance, "amenities": amenities_score,
        "semantic": semantic, "area": area, "freshness": freshness
    }

def weighted_score(factors: Dict[str, float]) -> float:
    w = {"price":0.18,"distance":0.16,"amenities":0.12,"semantic":0.30,"freshness":0.12,"area":0.12}
    return 100.0 * sum(w[k]*factors[k] for k in w)

@router.post("/match")
def match(body: Dict[str, Any] = None, db: Session = Depends(get_db)):
    body = body or {}
    prefs = body.get("prefs") or {}
    topn = int(body.get("topn") or 10)

    # Pull available listings
    rows = db.execute(
        select(Listing).where(Listing.availability_status == "available")
    ).scalars().all()

    scored = []
    for r in rows:
        f = score_listing(r, prefs)
        s = weighted_score(f)
        scored.append({
            "listing_id": r.id,
            "score": round(s,2),
            "factors": {k: round(v,3) for k,v in f.items()},
            "summary_stub": f"Price fit {f['price']:.2f}, distance {f['distance']:.2f}."
        })

    # simple sort by score (we’ll add MMR later)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:topn]