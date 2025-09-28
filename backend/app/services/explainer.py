# from app.services.gemini_client import get_model, generate_json
# from app.services.prompt_templates import EXPLAIN_SYSTEM

# def explain_one(evidence: dict) -> dict:
#     """
#     evidence = {
#       "listing": {title, price, dist_km, safety_score, walk_score, features: [...]},
#       "weights": {...},
#       "contrib": {...},   # from scoring.compat
#       "compat_pct": 84
#     }
#     """
#     model = get_model(name="gemini-1.5-pro", system_instruction=EXPLAIN_SYSTEM)
#     parts = [
#         {"role":"user", "parts":[
#             "Provide JSON only. Here is evidence:\n",
#             {"text": str(evidence)}
#         ]}
#     ]
#     return generate_json(model, parts)