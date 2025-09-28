# from fastapi import APIRouter, HTTPException
# from app.schemas.dto import MatchRequest, MatchResponse, WeightPlan, Listing
# from app.services.gemini_client import get_model, generate_json
# from app.services.prompt_templates import MATCH_SYSTEM
# from app.services.scoring import compat
# from app.repositories.listings_repo import topk_by_filters_and_knn

# router = APIRouter(prefix="/match")

# @router.post("", response_model=MatchResponse)
# def post_match(req: MatchRequest):
#     # 1) Turn user query → plan (hard filters + weights + semantic query)
#     model = get_model(name="gemini-1.5-pro", system_instruction=MATCH_SYSTEM)
#     plan_json = generate_json(model, [{"role":"user","parts":[req.user_query]}])
#     plan = WeightPlan(**plan_json)

#     # TODO: embed plan.semantic_query with your embedding service/vectorizer
#     qvec = [0.0]*384  # placeholder; replace with real vector from sentence-transformers

#     # 2) Hybrid search
#     rows = topk_by_filters_and_knn(plan.hard, qvec, min(req.top_k, 50))

#     # 3) Score deterministically
#     out = []
#     for r in rows:
#         pct, contrib = compat(r, plan.weights, plan.hard)
#         r["compat_pct"] = pct
#         r["_contrib"] = contrib       # keep for /explain call
#         out.append(Listing(**{k:v for k,v in r.items() if k[0] != "_"}))

#     return MatchResponse(plan=plan, results=out)