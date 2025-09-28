# import numpy as np

# def _norm_price(price, max_p):
#     if price is None or not max_p or max_p <= 0: return 0.5
#     return max(0.0, min(1.0, (max_p - price)/max_p))

# def _norm_dist_km(d):
#     if d is None: return 0.5
#     return max(0.0, min(1.0, 1 - d/10.0))

# def compat(row: dict, w: dict, hard: dict):
#     s = (
#         w["price"]    * _norm_price(row.get("price"), hard.get("max_price")) +
#         w["distance"] * _norm_dist_km(row.get("dist_km")) +
#         w["safety"]   * (float(row.get("safety_score") or 0)/100.0) +
#         w["walk"]     * (float(row.get("walk_score") or 0)/100.0) +
#         w["features"] * float(row.get("feature_match_rate") or 0.0) +
#         w["text"]     * float(row.get("cos_sim") or 0.0)
#     )
#     pct = int(round(100*(1/(1+np.exp(-4*(s-0.5))))))
#     contrib = {
#         "price": _norm_price(row.get("price"), hard.get("max_price"))*w["price"],
#         "distance": _norm_dist_km(row.get("dist_km"))*w["distance"],
#         "safety": (float(row.get("safety_score") or 0)/100.0)*w["safety"],
#         "walk": (float(row.get("walk_score") or 0)/100.0)*w["walk"],
#         "features": float(row.get("feature_match_rate") or 0.0)*w["features"],
#         "text": float(row.get("cos_sim") or 0.0)*w["text"],
#     }
#     return pct, contrib