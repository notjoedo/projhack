from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
import numpy as np
from ..db import get_db
from ..gemini_client import embed_text
from ..scorer import jaccard, weighted_score, score_factors, mmr
#python -m uvicorn app.main:app --reload --port 8006
router = APIRouter()
'''curl -X POST http://localhost:8006/match \
  -H "Content-Type: application/json" \
  -d '{"query":"quiet, pet friendly, close to campus gym","prefs":{"budget_min":650,"budget_max":950,"amenities":["Fitness Center","Dog Park"]},"topn":5}''''
@router.post("/match")
def match(body: Dict[str, Any] = None, db: Session = Depends(get_db)):
    body = body or {}
    prefs = body.get("prefs") or {}
    topn = int(body.get("topn") or 10)
    query_text = (body.get("query") or "").strip()

    if not query_text:
        # If no query, still return decent defaults (no vector bias)
        query_text = "student housing near Virginia Tech, affordable, quiet, safe"

    # 1) Embed the user's query (768 dims)
    try:
        user_vec = embed_text(query_text)
    except Exception as e:
        raise HTTPException(500, f"Embedding failed: {e}")

    # 2) Retrieve top-K by vector similarity (cosine)
    TOPK = 120
    rows = db.execute(text(f"""
        SELECT id, property_name, price, distance_miles, amenities, safety_score, walk_score, vector_desc
        FROM public.listings
        WHERE availability_status = 'available' AND vector_desc IS NOT NULL
        ORDER BY vector_desc <=> :uvec
        LIMIT :k
    """), {"uvec": user_vec, "k": TOPK}).fetchall()

    # 3) Score & diversify
    candidates = []
    bmin, bmax = prefs.get("budget_min"), prefs.get("budget_max")
    budget_mid = 0.5*(float(bmin)+float(bmax)) if bmin is not None and bmax is not None else None
    pref_amen = prefs.get("amenities") or []

    for r in rows:
        class Obj: pass
        o = Obj()
        o.price = r.price
        o.distance_miles = r.distance_miles
        o.safety_score = r.safety_score
        o.walk_score = r.walk_score

        factors = score_factors(o, user_budget_mid=budget_mid,
                                user_vec=np.array(user_vec, dtype=float),
                                list_vec=np.array(r.vector_desc or np.zeros(len(user_vec))))
        factors["amenities"] = jaccard(pref_amen, r.amenities or [])
        score = weighted_score(factors)

        candidates.append({
            "listing_id": r.id,
            "vec": np.array(r.vector_desc or np.zeros(len(user_vec))),
            "score": score,
            "factors": factors,
            "summary_stub": f"Price fit {factors['price']:.2f}, distance {factors['distance']:.2f}."
        })

    ranked = mmr(candidates, topn=topn)

    # 4) Serialize
    out = []
    for c in ranked:
        out.append({
            "listing_id": c["listing_id"],
            "score": round(c["score"], 2),
            "factors": {k: round(v, 3) for k, v in c["factors"].items()},
            "summary_stub": c["summary_stub"]
        })
    return out