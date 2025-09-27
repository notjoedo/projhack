from typing import Dict, List
import math
import numpy as np

def jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(a or []), set(b or [])
    if not sa and not sb:
        return 0.5
    inter = len(sa & sb)
    union = len(sa | sb)
    return inter / union if union else 0.0

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    na = np.linalg.norm(a); nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def exp_closeness(delta: float, alpha: float) -> float:
    """Higher when price is close to user's budget mid; alpha controls tolerance."""
    return math.exp(-abs(delta) / alpha)

def score_factors(listing, user_budget_mid=None, user_vec=None, list_vec=None) -> Dict[str, float]:
    # Price fit (near budget mid is better)
    price = exp_closeness((listing.price - (user_budget_mid or listing.price)), alpha=300.0)

    # Distance decay (closer is better)
    distance = math.exp(- (listing.distance_miles or 0.0) / 1.0) if listing.distance_miles is not None else 0.5

    # Amenities filled by caller; set default here
    amenities_score = 0.5

    # Semantic similarity if vectors provided
    semantic = 0.5
    if user_vec is not None and list_vec is not None:
        semantic = cosine(user_vec, list_vec)

    # Area = mean of normalized safety/walk if available
    area_vals = []
    if getattr(listing, "safety_score", None) is not None:
        area_vals.append((listing.safety_score or 0) / 100.0)
    if getattr(listing, "walk_score", None) is not None:
        area_vals.append((listing.walk_score or 0) / 100.0)
    area = sum(area_vals) / len(area_vals) if area_vals else 0.5

    # Freshness placeholder
    freshness = 0.8

    return {
        "price": price,
        "distance": distance,
        "amenities": amenities_score,
        "semantic": semantic,
        "area": area,
        "freshness": freshness,
    }

def weighted_score(factors: Dict[str, float]) -> float:
    w = {"price": 0.18, "distance": 0.16, "amenities": 0.12, "semantic": 0.30, "freshness": 0.12, "area": 0.12}
    return 100.0 * sum(w[k] * factors[k] for k in w)

def mmr(candidates, lam=0.7, topn=20):
    """
    Maximal Marginal Relevance diversification.
    Each candidate dict should have: 'score' (float), 'vec' (np.ndarray).
    """
    selected = []
    remaining = candidates[:]

    def sim(v, S):
        if not S or v is None:
            return 0.0
        sims = []
        for s in S:
            sv = s.get("vec")
            if sv is None:
                continue
            nv = np.linalg.norm(v); ns = np.linalg.norm(sv)
            if nv == 0 or ns == 0:
                sims.append(0.0)
            else:
                sims.append(float(np.dot(v, sv) / (nv * ns)))
        return max(sims) if sims else 0.0

    while remaining and len(selected) < topn:
        best = max(remaining, key=lambda d: lam * d["score"] - (1 - lam) * sim(d.get("vec"), selected))
        selected.append(best)
        remaining.remove(best)
    return selected