# from pydantic import BaseModel, Field
# from typing import Optional, List, Dict

# class MatchRequest(BaseModel):
#     user_query: str
#     top_k: int = Field(default=20, le=100)

# class WeightPlan(BaseModel):
#     hard: Dict[str, object]
#     weights: Dict[str, float]
#     semantic_query: str

# class Listing(BaseModel):
#     id: str
#     title: Optional[str] = None
#     price: Optional[float] = None
#     lat: float
#     lon: float
#     dist_km: Optional[float] = None
#     safety_score: Optional[float] = None
#     walk_score: Optional[float] = None
#     feature_match_rate: Optional[float] = None
#     cos_sim: Optional[float] = None
#     compat_pct: Optional[int] = None

# class MatchResponse(BaseModel):
#     plan: WeightPlan
#     results: List[Listing]

# class ExplainRequest(BaseModel):
#     listing_id: str
#     evidence: dict  # {facts, weights, contributions}

# class ExplainResponse(BaseModel):
#     reason_1: str
#     reason_2: str
#     tone: str = "neutral"