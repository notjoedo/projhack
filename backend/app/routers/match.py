from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Any, Dict, List
import numpy as np
import time
import hashlib
from collections import defaultdict
import h3

from ..db import get_db
from ..schemas import MatchRequest, MatchResponse, MatchItem, HexCell
from ..scorer import jaccard, weighted_score, score_factors, mmr
from ..gemini_client import embed_text, summarize_reason
from app import config  # config.TOPK, config.COMPATIBILITY_CUTOFF

router = APIRouter()

# Blacksburg / Virginia Tech anchor
VT_LAT, VT_LNG = 37.2296, -80.4139

def _vec_literal(vec) -> str:
    return "[" + ",".join(f"{float(v)}" for v in vec) + "]"

def _score_rows(rows, prefs: Dict[str, Any], uvec=None):
    bmin, bmax = prefs.get("budget_min"), prefs.get("budget_max")
    budget_mid = 0.5 * (float(bmin) + float(bmax)) if bmin is not None and bmax is not None else None
    pref_amen = prefs.get("amenities") or []

    cand = []
    for r in rows:
        class L: pass
        l = L()
        l.price = r.get("price")
        l.distance_miles = r.get("distance_miles")
        l.safety_score = r.get("safety_score")
        l.walk_score = r.get("walk_score")

        lvec = None
        vdesc = r.get("vector_desc")
        if vdesc is not None:
            try:
                lvec = np.array(vdesc, dtype=float)
            except Exception:
                lvec = None

        u = np.array(uvec, dtype=float) if uvec is not None else None
        factors = score_factors(l, user_budget_mid=budget_mid, user_vec=u, list_vec=lvec)
        factors["amenities"] = jaccard(pref_amen, r.get("amenities") or [])

        score = weighted_score(factors)
        cand.append({
            "listing_id": r["id"],
            "price": r["price"],
            "distance_miles": r.get("distance_miles") or 0.0,
            "factors": factors,
            "score": score,
            "vec": (lvec if lvec is not None and getattr(lvec, "size", 0) else None),
        })
    return cand

def _compatibility_percentages(ranked, low: int = 55, high: int = 96):
    if not ranked:
        return {}
    scores = [c["score"] for c in ranked]
    smin, smax = min(scores), max(scores)
    compat = {}
    for c in ranked:
        s = c["score"]
        x = (s - smin) / (smax - smin) if smax > smin else 0.5
        x = pow(x, 0.85)
        pct = low + x * (high - low)
        lid = str(c["listing_id"]).encode("utf-8")
        h = int(hashlib.sha256(lid).hexdigest(), 16)
        jitter = (h % 5) - 2  # -2..+2
        pct = int(round(pct + jitter))
        pct = max(1, min(99, pct))
        compat[c["listing_id"]] = pct
    return compat

def _coord_near_campus(listing_id: Any):
    """Deterministic jittered coords around VT for demos without true lat/lng."""
    s = str(listing_id)
    h = 2166136261
    for ch in s:
        h ^= ord(ch)
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    dlat = ((h % 121) - 60) / 1000.0  # ~±0.060°
    dlng = (((h >> 5) % 121) - 60) / 1000.0
    return VT_LAT + dlat, VT_LNG + dlng

def _prompt_to_heatmap_topic(text: str, default: str = "price") -> str:
    """Very light NLP; swap to Gemini later if you like."""
    t = (text or "").lower()
    if any(k in t for k in ["safe", "safety", "crime", "secure"]):
        return "safety"
    if any(k in t for k in ["budget", "cheap", "afford", "$", "price", "cost"]):
        return "price"
    if any(k in t for k in ["fit", "match", "compat", "best"]):
        return "compat"
    if any(k in t for k in ["busy", "populated", "dense", "crowd"]):
        return "count"
    return default

def _h3_aggregate(results: List[Dict[str, Any]], topic: str, res: int = 8) -> List[HexCell]:
    """
    Aggregate filtered results into H3 hex cells near VT.
    topic: "price" | "safety" | "compat" | "count"
    Returns HexCell list with:
      - weight: normalized weight for the chosen topic (0.25..1.0)
      - price_avg, safety_avg, compat_max, count, plus centroid lat/lng
    """
    if not results:
        return []

    buckets = defaultdict(lambda: {"sum_price": 0.0, "sum_safety": 0.0, "max_compat": 0, "count": 0})
    centroids = {}

    # First pass: drop points in hex buckets
    for it in results:
        lat, lng = _coord_near_campus(it["listing_id"])
        h = h3.geo_to_h3(lat, lng, res)
        buckets[h]["sum_price"] += float(it["price"] or 0.0)
        buckets[h]["sum_safety"] += float(it["factors"].get("safety", 0.0) or 0.0)
        buckets[h]["max_compat"] = max(buckets[h]["max_compat"], int(it.get("compatibility", 0)))
        buckets[h]["count"] += 1
        if h not in centroids:
            clat, clng = h3.h3_to_geo(h)
            centroids[h] = (clat, clng)

    # Compute topic-specific weight baseline
    vals = []
    for h, agg in buckets.items():
        if topic == "price":
            vals.append(agg["sum_price"] / max(1, agg["count"]))
        elif topic == "safety":
            vals.append(agg["sum_safety"] / max(1, agg["count"]))
        elif topic == "compat":
            vals.append(agg["max_compat"])
        else:  # count
            vals.append(agg["count"])

    vmin, vmax = (min(vals), max(vals)) if vals else (0.0, 1.0)
    span = (vmax - vmin) if (vmax > vmin) else 1.0

    # Build HexCell list with normalized weights (kept visible 0.25..1.0)
    hexes: List[HexCell] = []
    for h, agg in buckets.items():
        if topic == "price":
            raw = agg["sum_price"] / max(1, agg["count"])
        elif topic == "safety":
            raw = agg["sum_safety"] / max(1, agg["count"])
        elif topic == "compat":
            raw = agg["max_compat"]
        else:
            raw = agg["count"]

        w = (raw - vmin) / span  # 0..1
        w = max(0.25, min(1.0, w if w > 0 else 0.5))  # ensure visible

        lat, lng = centroids[h]
        hexes.append(HexCell(
            h3=h,
            lat=lat, lng=lng,
            count=agg["count"],
            weight=float(w),
            price_avg=(agg["sum_price"] / max(1, agg["count"])),
            safety_avg=(agg["sum_safety"] / max(1, agg["count"])),
            compat_max=int(agg["max_compat"]),
        ))
    return hexes

@router.post("/match", response_model=MatchResponse)
def match(req: MatchRequest, db: Session = Depends(get_db)):
    t0 = time.perf_counter()
    used_vectors = False
    ranked = []

    # Pick heatmap topic from prompt if not explicitly set
    topic = req.heatmap or _prompt_to_heatmap_topic(req.query, default="price")
    h3_res = int(req.h3_res or 8)

    # Vector path
    if req.use_vectors:
        try:
            uvec = embed_text(req.query)
            rows = db.execute(
                text("""
                    SELECT id, price, distance_miles, amenities,
                           safety_score, walk_score, vector_desc, updated_at
                    FROM public.listings
                    WHERE availability_status = 'available' AND vector_desc IS NOT NULL
                    ORDER BY vector_desc <=> (:uvec)::vector
                    LIMIT :k
                """),
                {"uvec": _vec_literal(uvec), "k": config.TOPK},
            ).mappings().all()
            if rows:
                used_vectors = True
                cand = _score_rows(rows, req.prefs.dict(), uvec=uvec)
                ranked = mmr(cand, topn=req.topn * 2 if req.topn else 10)
        except Exception:
            try: db.rollback()
            except Exception: pass

    # Fast path
    if not ranked:
        rows = db.execute(
            text("""
                SELECT id, price, distance_miles, amenities,
                       safety_score, walk_score, vector_desc, updated_at
                FROM public.listings
                WHERE availability_status = 'available'
                ORDER BY updated_at DESC
                LIMIT :k
            """),
            {"k": 200},
        ).mappings().all()
        cand = _score_rows(rows, req.prefs.dict(), uvec=None)
        cand.sort(key=lambda x: x["score"], reverse=True)
        ranked = cand

    # Diverse displayed % mapping
    compat_map = _compatibility_percentages(ranked, low=55, high=96)

    # Filter by cutoff; add rationale and compat %
    filtered = []
    for c in ranked:
        if c["score"] < config.COMPATIBILITY_CUTOFF:
            continue
        compat_pct = compat_map.get(c["listing_id"], int(round(c["score"] * 100)))
        rationale = summarize_reason(
            req.query, "This listing", c["price"], c.get("distance_miles", 0.0), c["factors"], compat_pct
        )
        c2 = {**c, "compatibility": compat_pct, "rationale": rationale}
        filtered.append(c2)
        if len(filtered) >= req.topn:
            break

    # H3 aggregation over filtered set (only what user will see)
    hexes = _h3_aggregate(filtered, topic=topic, res=h3_res)

    took_ms = int((time.perf_counter() - t0) * 1000)
    return MatchResponse(
        took_ms=took_ms,
        used_vectors=used_vectors,
        results=[
            MatchItem(
                listing_id=c["listing_id"],
                title="This listing",
                address=None,
                price=c["price"],
                rank=i + 1,
                score=round(c["score"], 4),
                compatibility=c["compatibility"],
                rationale=c["rationale"],
            )
            for i, c in enumerate(filtered)
        ],
        hexes=hexes,
    )