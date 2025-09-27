from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import insert, update, select
import uuid, datetime
from ..db import get_db
from ..models import Inquiry, Listing

router = APIRouter()

@router.post("/interest")
def interest(body: dict, db: Session = Depends(get_db)):
    """
    Request body:
      { "listing_id": "abc123", "message": "Hi! I'm interested." }
    """
    listing_id = body.get("listing_id")
    if not listing_id:
        raise HTTPException(400, "listing_id is required")

    # Ensure listing exists
    exists = db.execute(select(Listing.id).where(Listing.id == listing_id)).scalar_one_or_none()
    if not exists:
        raise HTTPException(404, "Listing not found")

    inq_id = "inq_" + uuid.uuid4().hex[:8]
    now = datetime.datetime.utcnow()

    # Insert inquiry row
    db.execute(insert(Inquiry).values(
        id=inq_id, user_id="demo_user", listing_id=listing_id,
        status="interested", message=(body.get("message") or ""), created_at=now, updated_at=now
    ))

    # Optional: soft-reserve the listing while demoing
    db.execute(update(Listing).where(Listing.id == listing_id).values(availability_status="pending", updated_at=now))
    db.commit()

    return {"status": "interested", "inquiry_id": inq_id}