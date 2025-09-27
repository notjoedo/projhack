import json, sys, random
from sqlalchemy.orm import Session
from sqlalchemy import insert
from ..db import SessionLocal, engine, Base
from ..models import Listing
from datetime import datetime

def flatten_amenities(categorized):
    if not categorized:
        return []
    out = []
    for v in categorized.values():
        if v:
            out.extend(v)
    # de-dup while preserving order
    seen, flat = set(), []
    for a in out:
        if a not in seen:
            seen.add(a); flat.append(a)
    return flat

def main(path):
    Base.metadata.create_all(bind=engine)

    with open(path, "r") as f:
        data = json.load(f)

    db: Session = SessionLocal()

    for row in data:
        lid = row["id"]
        addr = row["address"]
        am_json = row.get("categorizedAmenities") or {}
        am_flat = flatten_amenities(am_json)

        rec = {
            "id": lid,
            "property_name": row.get("propertyName"),
            "address_line1": addr.get("line1"),
            "city": addr.get("city"),
            "state": addr.get("state"),
            "zip_code": addr.get("zipCode"),

            "price": float(row.get("price")),
            "bedrooms": float(row.get("bedrooms")),
            "bathrooms": float(row.get("bathrooms")),
            "square_footage": int(row.get("squareFootage") or 0),

            "listing_url": row.get("listingUrl"),
            "amenities": am_flat,
            "amenities_json": am_json,

            # synthetic features for MVP scoring
            "distance_miles": round(random.uniform(0.3, 2.5), 2),
            "safety_score": random.randint(60, 90),
            "walk_score": random.randint(55, 85),

            "availability_status": "available",
            "updated_at": datetime.utcnow()
        }

        # upsert-ish for SQLite: try insert, ignore if exists
        try:
            db.execute(insert(Listing).values(**rec))
        except Exception:
            pass

    db.commit()
    print(f"Seeded {len(data)} listings into 'listings'.")

if __name__ == "__main__":
    p = sys.argv[1] if len(sys.argv) > 1 else "../data/blacksburg.json"
    main(p)