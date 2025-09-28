# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from .db import Base, engine
# from . import models
# from .routers import match, explain, interest, listings
# from app.api.routes_match import router as match_router
# from app.api.routes_explain import router as explain_router

# app.include_router(match_router)
# app.include_router(explain_router)
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Blacksburg Housing Agent API")
# app.include_router(listings.router, tags=["listings"]) 
# # Allow frontend requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],   # in prod, restrict this
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Mount routers
# app.include_router(match.router, tags=["match"])
# app.include_router(explain.router, tags=["explain"])
# app.include_router(interest.router, tags=["interest"])
# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

from .routers.match import router as match_router

# Create FastAPI app
app = FastAPI(title="Housing Matcher API", version="0.1.0")

# --- Serve frontend (if folder exists) ---
frontend_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
)
if os.path.isdir(frontend_dir):
    app.mount("/ui", StaticFiles(directory=frontend_dir, html=True), name="ui")


@app.get("/")
def root_redirect():
    """
    Redirect root (/) to /ui if frontend exists,
    otherwise send to /docs.
    """
    if any(r.name == "ui" for r in app.routes):
        return RedirectResponse(url="/ui")
    return RedirectResponse(url="/docs")


# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In prod, replace with your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(match_router, prefix="/api")

# --- Health check ---
@app.get("/healthz")
def healthz():
    return {"ok": True}
# @app.get("/health")
# def health():
#     return {"ok": True}