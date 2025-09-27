from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from ..db import get_db
from ..models import Listing

router = APIRouter()

@router.get("/listings/{listing_id}")
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    row = db.execute(select(Listing).where(Listing.id == listing_id)).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Listing not found")
    return {
        "id": row.id,
        "property_name": row.property_name,
        "address_line1": row.address_line1,
        "city": row.city, "state": row.state, "zip_code": row.zip_code,
        "price": row.price, "bedrooms": row.bedrooms, "bathrooms": row.bathrooms,
        "amenities": row.amenities,
        "distance_miles": row.distance_miles,
        "safety_score": row.safety_score, "walk_score": row.walk_score,
        "listing_url": row.listing_url,
    }

@router.post("/listings/batch")
def get_listings_batch(ids: List[str], db: Session = Depends(get_db)):
    if not ids:
        return []
    rows = db.execute(select(Listing).where(Listing.id.in_(ids))).scalars().all()
    out = []
    for row in rows:
        out.append({
            "id": row.id, "property_name": row.property_name,
            "price": row.price, "bedrooms": row.bedrooms, "bathrooms": row.bathrooms,
            "amenities": row.amenities, "distance_miles": row.distance_miles,
            "safety_score": row.safety_score, "walk_score": row.walk_score,
            "listing_url": row.listing_url,
        })
    return out