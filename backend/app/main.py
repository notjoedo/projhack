from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from . import models
from .routers import match, explain, interest

# Create tables if they don’t exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blacksburg Housing Agent API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # in prod, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(match.router, tags=["match"])
app.include_router(explain.router, tags=["explain"])
app.include_router(interest.router, tags=["interest"])

@app.get("/health")
def health():
    return {"ok": True}