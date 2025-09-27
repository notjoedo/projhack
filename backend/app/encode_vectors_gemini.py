from sqlalchemy import text
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Listing
from ..gemini_client import embed_text
import json
from time import sleep
# python -m app.tools.encode_vectors_gemini
def build_text(l: Listing) -> str:
    am = (l.amenities or [])
    parts = [
        l.property_name or "",
        "Amenities: " + ", ".join(am[:12]),
        f"Address: {l.address_line1 or ''}, {l.city or ''}",
        f"Beds: {l.bedrooms} Baths: {l.bathrooms}",
    ]
    return ". ".join([p for p in parts if p]).strip()
'''SELECT id, vector_dims(vector_desc) AS dims
FROM public.listings
WHERE vector_desc IS NOT NULL
LIMIT 1;'''
def main():
    db: Session = SessionLocal()
    rows = db.execute(text("""
        SELECT id, property_name, address_line1, city, bedrooms, bathrooms, amenities
        FROM public.listings
        ORDER BY updated_at DESC
    """)).fetchall()

    print("Encoding", len(rows), "listings...")
    done = 0
    for r in rows:
        # build minimal object-like access
        class L: pass
        l = L()
        l.id, l.property_name, l.address_line1, l.city, l.bedrooms, l.bathrooms, l.amenities = \
            r.id, r.property_name, r.address_line1, r.city, r.bedrooms, r.bathrooms, r.amenities

        text_repr = build_text(l)
        vec = embed_text(text_repr)

        db.execute(text("""
            UPDATE public.listings
            SET vector_desc = :vec
            WHERE id = :id
        """), {"vec": vec, "id": l.id})
        done += 1
        if done % 5 == 0:
            db.commit()
            print(f"Committed {done}/{len(rows)}")
            sleep(0.2)
    db.commit()
    print("Done.")

if __name__ == "__main__":
    main()