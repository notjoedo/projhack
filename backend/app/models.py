from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.types import JSON
from .db import Base
import datetime

class Listing(Base):
    __tablename__ = "listings"
    id = Column(String, primary_key=True)
    property_name = Column(String, nullable=False)
    address_line1 = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)

    price = Column(Float, nullable=False)
    bedrooms = Column(Float, nullable=False)
    bathrooms = Column(Float, nullable=False)
    square_footage = Column(Integer)
    listing_url = Column(String)

    amenities = Column(JSON)          # flat list
    amenities_json = Column(JSON)     # original categorized dict

    distance_miles = Column(Float)
    safety_score = Column(Float)
    walk_score = Column(Float)

    availability_from = Column(String)
    availability_status = Column(String, default="available")

    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Inquiry(Base):
    __tablename__ = "inquiries"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    listing_id = Column(String, nullable=False)
    status = Column(String, nullable=False, default="interested")  # interested|accepted|declined|expired
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)