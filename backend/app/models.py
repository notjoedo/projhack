# from sqlalchemy import Column, String, Integer, Float, DateTime, Text
# from sqlalchemy.types import JSON
# from .db import Base
# import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, func
from sqlalchemy.dialects.postgresql import ARRAY
from .db import Base

class Listing(Base):
    __tablename__ = "listings"
    id = Column(String, primary_key=True)          # or Integer if preferred
    title = Column(Text, nullable=False)
    address = Column(Text)
    price = Column(Integer, nullable=False)
    distance_miles = Column(Float)
    safety_score = Column(Float)                   # 0..100
    walk_score = Column(Float)                     # 0..100
    amenities = Column(ARRAY(Text))
    availability_status = Column(String, default="available", nullable=False)
    vector_desc = Column(ARRAY(Float))             # pgvector also works; driver returns list[float]
    lat = Column(Float)                            # approximate location for the map
    lng = Column(Float)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
# class Listing(Base):
#     __tablename__ = "listings"
#     id = Column(String, primary_key=True)
#     property_name = Column(String, nullable=False)
#     address_line1 = Column(String, nullable=False)
#     city = Column(String, nullable=False)
#     state = Column(String, nullable=False)
#     zip_code = Column(String, nullable=False)

#     price = Column(Float, nullable=False)
#     bedrooms = Column(Float, nullable=False)
#     bathrooms = Column(Float, nullable=False)
#     square_footage = Column(Integer)
#     listing_url = Column(String)

#     amenities = Column(JSON)          # flat list
#     amenities_json = Column(JSON)     # original categorized dict

#     distance_miles = Column(Float)
#     safety_score = Column(Float)
#     walk_score = Column(Float)

#     availability_from = Column(String)
#     availability_status = Column(String, default="available")

#     updated_at = Column(DateTime, default=datetime.datetime.utcnow)

# class Inquiry(Base):
#     __tablename__ = "inquiries"
#     id = Column(String, primary_key=True)
#     user_id = Column(String, nullable=False)
#     listing_id = Column(String, nullable=False)
#     status = Column(String, nullable=False, default="interested")  # interested|accepted|declined|expired
#     message = Column(Text)
#     created_at = Column(DateTime, default=datetime.datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)