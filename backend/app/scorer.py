# from typing import Dict, List
# import math
# import numpy as np
from typing import Dict, List
import numpy as np

def jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(map(str.lower, a or [])), set(map(str.lower, b or []))
    denom = len(sa | sb) or 1
    return len(sa & sb) / denom

def _normalize(val, lo, hi):
    if lo is None or hi is None or hi <= lo or val is None: return 0.0
    return max(0.0, min(1.0, (val - lo) / (hi - lo)))

def score_factors(l, user_budget_mid=None, user_vec=None, list_vec=None) -> Dict[str, float]:
    if user_budget_mid is not None and l.price is not None:
        dev = abs(l.price - user_budget_mid)
        price = max(0.0, 1.0 - (dev / max(1.0, user_budget_mid)))
    else:
        price = 0.5
    distance = 1.0 - _normalize(l.distance_miles or 5.0, 0.0, 5.0)
    safety = (l.safety_score or 0.0) / 100.0
    walk = (l.walk_score or 0.0) / 100.0
    vec_sim = 0.0
    if user_vec is not None and list_vec is not None and getattr(list_vec, "size", 0):
        u = user_vec / (np.linalg.norm(user_vec) + 1e-9)
        v = list_vec / (np.linalg.norm(list_vec) + 1e-9)
        vec_sim = float((np.dot(u, v) + 1.0) / 2.0)
    return {"price": float(price), "distance": float(distance), "safety": float(safety), "walk": float(walk), "vector": float(vec_sim)}

def weighted_score(factors: Dict[str, float]) -> float:
    w = {"price": 0.25, "distance": 0.25, "safety": 0.15, "walk": 0.10, "vector": 0.15, "amenities": 0.10}
    return sum(w[k] * factors.get(k, 0.0) for k in w)

def mmr(candidates: List[Dict], topn: int, lambda_=0.75):
    selected, rest = [], candidates.copy()
    def sim(a, b):
        va, vb = a.get("vec"), b.get("vec")
        if va is None or vb is None: return 0.0
        va = va / (np.linalg.norm(va) + 1e-9)
        vb = vb / (np.linalg.norm(vb) + 1e-9)
        return float((np.dot(va, vb) + 1.0) / 2.0)
    while rest and len(selected) < topn:
        best, best_val = None, -1e9
        for r in rest:
            redundancy = max((sim(r, s) for s in selected), default=0.0)
            score = lambda_ * r["score"] - (1 - lambda_) * redundancy
            if score > best_val:
                best, best_val = r, score
        selected.append(best)
        rest.remove(best)
    return selected
# def jaccard(a: List[str], b: List[str]) -> float:
#     sa, sb = set(a or []), set(b or [])
#     if not sa and not sb:
#         return 0.5
#     inter = len(sa & sb)
#     union = len(sa | sb)
#     return inter / union if union else 0.0

# def cosine(a: np.ndarray, b: np.ndarray) -> float:
#     na = np.linalg.norm(a); nb = np.linalg.norm(b)
#     if na == 0 or nb == 0:
#         return 0.0
#     return float(np.dot(a, b) / (na * nb))

# def exp_closeness(delta: float, alpha: float) -> float:
#     """Higher when price is close to user's budget mid; alpha controls tolerance."""
#     return math.exp(-abs(delta) / alpha)

# def score_factors(listing, user_budget_mid=None, user_vec=None, list_vec=None) -> Dict[str, float]:
#     # Price fit (near budget mid is better)
#     price = exp_closeness((listing.price - (user_budget_mid or listing.price)), alpha=300.0)

#     # Distance decay (closer is better)
#     distance = math.exp(- (listing.distance_miles or 0.0) / 1.0) if listing.distance_miles is not None else 0.5

#     # Amenities filled by caller; set default here
#     amenities_score = 0.5

#     # Semantic similarity if vectors provided
#     semantic = 0.5
#     if user_vec is not None and list_vec is not None:
#         semantic = cosine(user_vec, list_vec)

#     # Area = mean of normalized safety/walk if available
#     area_vals = []
#     if getattr(listing, "safety_score", None) is not None:
#         area_vals.append((listing.safety_score or 0) / 100.0)
#     if getattr(listing, "walk_score", None) is not None:
#         area_vals.append((listing.walk_score or 0) / 100.0)
#     area = sum(area_vals) / len(area_vals) if area_vals else 0.5

#     # Freshness placeholder
#     freshness = 0.8

#     return {
#         "price": price,
#         "distance": distance,
#         "amenities": amenities_score,
#         "semantic": semantic,
#         "area": area,
#         "freshness": freshness,
#     }

# def weighted_score(factors: Dict[str, float]) -> float:
#     w = {"price": 0.18, "distance": 0.16, "amenities": 0.12, "semantic": 0.30, "freshness": 0.12, "area": 0.12}
#     return 100.0 * sum(w[k] * factors[k] for k in w)

# def mmr(candidates, lam=0.7, topn=20):
#     """
#     Maximal Marginal Relevance diversification.
#     Each candidate dict should have: 'score' (float), 'vec' (np.ndarray).
#     """
#     selected = []
#     remaining = candidates[:]

#     def sim(v, S):
#         if not S or v is None:
#             return 0.0
#         sims = []
#         for s in S:
#             sv = s.get("vec")
#             if sv is None:
#                 continue
#             nv = np.linalg.norm(v); ns = np.linalg.norm(sv)
#             if nv == 0 or ns == 0:
#                 sims.append(0.0)
#             else:
#                 sims.append(float(np.dot(v, sv) / (nv * ns)))
#         return max(sims) if sims else 0.0

#     while remaining and len(selected) < topn:
#         best = max(remaining, key=lambda d: lam * d["score"] - (1 - lam) * sim(d.get("vec"), selected))
#         selected.append(best)
#         remaining.remove(best)
#     return selected