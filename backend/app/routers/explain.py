# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import select
# from typing import Dict, Any, Optional

# from ..db import get_db
# from ..models import Listing
# from ..gemini_client import generate_structured_explanation

# router = APIRouter()

# def _money(x: Optional[float]) -> Optional[str]:
#     return None if x is None else f"${int(round(x))}"

# def _deterministic_explain(l: Listing, prefs: Dict[str, Any]) -> Dict[str, Any]:
#     bmin, bmax = prefs.get("budget_min"), prefs.get("budget_max")
#     budget_text = ""
#     if bmin is not None and bmax is not None:
#         budget_text = f"within your {_money(bmin)}–{_money(bmax)} budget" \
#                       if (bmin <= (l.price or 0) <= bmax) else \
#                       f"near your {_money(bmin)}–{_money(bmax)} budget"

#     dist_text = f"{l.distance_miles} miles from campus" if l.distance_miles is not None else "near campus"
#     amen = ", ".join((l.amenities or [])[:3]) if l.amenities else None
#     safety = f"safety {int(l.safety_score)}" if l.safety_score is not None else None
#     walk = f"walk {int(l.walk_score)}" if l.walk_score is not None else None
#     area_bits = " & ".join([x for x in [safety, walk] if x])

#     summary = (f"Good fit {budget_text} and approximately {dist_text}.").strip()
#     if not budget_text:
#         summary = f"Good fit at {_money(l.price)} and approximately {dist_text}."
#     if amen:
#         summary += f" Amenities include {amen}."

#     reasons = []
#     if budget_text:
#         reasons.append(budget_text.capitalize())
#     reasons.append(f"Distance: {dist_text}")
#     if area_bits:
#         reasons.append(f"Area scores: {area_bits}")

#     numbers_used = []
#     if bmin is not None and bmax is not None:
#         numbers_used += [int(bmin), int(bmax)]
#     if l.price is not None:
#         numbers_used.append(int(round(l.price)))
#     if l.distance_miles is not None:
#         numbers_used.append(float(l.distance_miles))
#     if l.safety_score is not None:
#         numbers_used.append(int(l.safety_score))
#     if l.walk_score is not None:
#         numbers_used.append(int(l.walk_score))

#     return {"summary": summary, "reasons": reasons, "numbers_used": numbers_used}

# @router.post("/explain")
# def explain(body: Dict[str, Any], db: Session = Depends(get_db)):
#     """
#     { "listing_id": "edge_1", "prefs": { "budget_min": 800, "budget_max": 1000, "amenities": ["Fitness Center"] } }
#     """
#     listing_id = body.get("listing_id")
#     if not listing_id:
#         raise HTTPException(400, "listing_id is required")

#     prefs: Dict[str, Any] = body.get("prefs") or {}
#     l: Listing | None = db.execute(select(Listing).where(Listing.id == listing_id)).scalar_one_or_none()
#     if not l:
#         raise HTTPException(404, "Listing not found")

#     evidence = {
#         "property_name": l.property_name, "city": l.city,
#         "price": l.price, "distance_miles": l.distance_miles,
#         "amenities": (l.amenities or [])[:8],
#         "safety_score": l.safety_score, "walk_score": l.walk_score,
#         "user_budget_min": prefs.get("budget_min"), "user_budget_max": prefs.get("budget_max"),
#     }

#     try:
#         gen = generate_structured_explanation(evidence)
#         if not isinstance(gen, dict) or "summary" not in gen:
#             raise RuntimeError("Malformed JSON from LLM")
#         return {
#             "summary": str(gen.get("summary", "")).strip(),
#             "reasons": [str(x) for x in (gen.get("reasons") or [])][:4],
#             "numbers_used": gen.get("numbers_used") or []
#         }
#     except Exception:
#         return _deterministic_explain(l, prefs)