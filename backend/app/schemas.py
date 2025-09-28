from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class Prefs(BaseModel):
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    amenities: Optional[List[str]] = []

class HexCell(BaseModel):
    h3: str
    lat: float
    lng: float
    count: int
    weight: float
    price_avg: Optional[float] = None
    safety_avg: Optional[float] = None
    compat_max: Optional[int] = None

class MatchItem(BaseModel):
    listing_id: Any
    title: Optional[str]
    address: Optional[str]
    price: float
    rank: int
    score: float
    compatibility: int
    rationale: str

class MatchRequest(BaseModel):
    query: str
    prefs: Prefs = Prefs()
    topn: int = 10
    use_vectors: bool = True
    # NEW: heatmap topic + resolution
    heatmap: Optional[str] = "price"   # "price" | "safety" | "compat" | "count"
    h3_res: Optional[int] = 8

class MatchResponse(BaseModel):
    took_ms: int
    used_vectors: bool
    results: List[MatchItem]
    hexes: List[HexCell] = []