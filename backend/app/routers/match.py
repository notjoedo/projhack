from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Any, Dict
import numpy as np
import time

from ..db import get_db
from ..gemini_client import embed_text  # REST client with timeout from gemini_client.py
from ..scorer import jaccard, weighted_score, score_factors, mmr

router = APIRouter()

TOPK = 120  # candidates to fetch from DB before re-scoring
DEFAULT_QUERY = "student housing near Virginia Tech, affordable, quiet, safe"


def _vec_literal(vec) -> str:
    """
    Turn a Python list[float] into pgvector's text literal: '[0.1,0.2,...]'.
    Using a text literal avoids driver-specific adapters and works with:
      ORDER BY vector_col <=> (:uvec)::vector
    """
    return "[" + ",".join(f"{float(v)}" for v in vec) + "]"


def _score_rows(rows, prefs, uvec=None):
    """Compute factor bars + weighted score for each DB row."""
    bmin, bmax = prefs.get("budget_min"), prefs.get("budget_max")
    budget_mid = 0.5 * (float(bmin) + float(bmax)) if bmin is not None and bmax is not None else None
    pref_amen = prefs.get("amenities") or []

    cand = []
    for r in rows:
        # lightweight obj to feed scorer
        class L:
            pass
        l = L()
        l.price = r.price
        l.distance_miles = r.distance_miles
        l.safety_score = r.safety_score
        l.walk_score = r.walk_score

        lvec = None
        if getattr(r, "vector_desc", None) is not None:
            try:
                lvec = np.array(r.vector_desc, dtype=float)
            except Exception:
                lvec = None

        u = np.array(uvec, dtype=float) if uvec is not None else None

        factors = score_factors(l, user_budget_mid=budget_mid, user_vec=u, list_vec=lvec)
        factors["amenities"] = jaccard(pref_amen, r.amenities or [])

        cand.append({
            "listing_id": r.id,
            "vec": (lvec if lvec is not None and getattr(lvec, "size", 0) else None),
            "score": weighted_score(factors),
            "factors": factors,
            "summary_stub": f"Price fit {factors['price']:.2f}, distance {factors['distance']:.2f}."
        })
    return cand


@router.post("/match")
def match(body: Dict[str, Any] = None, db: Session = Depends(get_db)):
    """
    Body:
      {
        "query": "quiet, pet friendly, close to campus gym",
        "prefs": {"budget_min": 800, "budget_max": 1000, "amenities": ["Fitness Center","Dog Park"]},
        "topn": 5,
        "use_vectors": true   # optional (defaults true). Set false to force fast path (no LLM/kNN).
      }
    """
    t0 = time.perf_counter()
    body = body or {}
    prefs = body.get("prefs") or {}
    topn = int(body.get("topn") or 10)
    query_text = (body.get("query") or "").strip() or DEFAULT_QUERY
    use_vectors = bool(body.get("use_vectors", True))

    # --- Vector path (Gemini embed + pgvector kNN) ---
    if use_vectors:
        try:
            # 1) Embed with short timeout (configured in gemini_client.py via GEMINI_TIMEOUT)
            uvec = embed_text(query_text)  # raises on timeout / HTTP error
            uvec_lit = _vec_literal(uvec)

            # 2) Retrieve top-K by cosine distance (pgvector)
            rows = db.execute(
                text("""
                    SELECT id, price, distance_miles, amenities, safety_score, walk_score, vector_desc
                    FROM public.listings
                    WHERE availability_status = 'available' AND vector_desc IS NOT NULL
                    ORDER BY vector_desc <=> (:uvec)::vector
                    LIMIT :k
                """),
                {"uvec": uvec_lit, "k": TOPK},
            ).fetchall()

            # If nothing returned (no vectors yet), fall back
            if not rows:
                raise RuntimeError("kNN returned 0 rows (vector_desc may be NULL).")

            # 3) Score + diversify (MMR)
            cand = _score_rows(rows, prefs, uvec=uvec)
            ranked = mmr(cand, topn=topn)

            return [{
                "listing_id": c["listing_id"],
                "score": round(c["score"], 2),
                "factors": {k: round(v, 3) for k, v in c["factors"].items()},
                "summary_stub": c["summary_stub"],
            } for c in ranked]

        except Exception as e:
            # very important: reset the transaction before running a new SQL
            try:
                db.rollback()
            except Exception:
                pass
            print(f"[match] vector path failed → fallback: {e}")

    # --- Fast path (no vectors, always returns quickly) ---
    rows = db.execute(
        text("""
            SELECT id, price, distance_miles, amenities, safety_score, walk_score, vector_desc
            FROM public.listings
            WHERE availability_status = 'available'
            ORDER BY updated_at DESC
            LIMIT :k
        """),
        {"k": 200},
    ).fetchall()

    cand = _score_rows(rows, prefs, uvec=None)
    cand.sort(key=lambda x: x["score"], reverse=True)

    return [{
        "listing_id": c["listing_id"],
        "score": round(c["score"], 2),
        "factors": {k: round(v, 3) for k, v in c["factors"].items()},
        "summary_stub": c["summary_stub"],
    } for c in cand[:topn]]