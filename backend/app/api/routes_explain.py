# from fastapi import APIRouter
# from app.schemas.dto import ExplainRequest, ExplainResponse
# from app.services.explainer import explain_one

# router = APIRouter(prefix="/explain")

# @router.post("", response_model=ExplainResponse)
# def post_explain(req: ExplainRequest):
#     js = explain_one(req.evidence)
#     return ExplainResponse(**js)