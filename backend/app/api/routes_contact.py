from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.messenger import compose_contact_message, rewrite_message

router = APIRouter()

class ComposeBody(BaseModel):
    user_prompt: str
    title: Optional[str] = "This listing"
    price: Optional[float] = None
    compatibility: Optional[int] = 0
    rationale: Optional[str] = ""
    tone: Optional[str] = "default"  # or 'casual'
    length: Optional[str] = "normal" # or 'short'

class RewriteBody(BaseModel):
    message: str
    mode: str  # 'casual' | 'shorter'

@router.post("/contact/compose")
def contact_compose(body: ComposeBody):
    try:
        msg = compose_contact_message(body.dict())
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contact/rewrite")
def contact_rewrite(body: RewriteBody):
    try:
        if body.mode not in ("casual", "shorter"):
            raise ValueError("mode must be 'casual' or 'shorter'")
        msg = rewrite_message(body.message, body.mode)
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))