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
# backend/app/main.py
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

# match router (your working one)
from .routers.match import router as match_router  # keep as-is

# try to import contact router; if missing, set to None
try:
    from .routers.contact import router as contact_router
except Exception:
    contact_router = None

app = FastAPI(title="Housing Matcher API", version="0.1.0")

# serve /ui if frontend exists
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.isdir(frontend_dir):
    app.mount("/ui", StaticFiles(directory=frontend_dir, html=True), name="ui")

@app.get("/")
def root_redirect():
    if any(getattr(r, "name", "") == "ui" for r in app.routes):
        return RedirectResponse(url="/ui")
    return RedirectResponse(url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(match_router, prefix="/api")

# include contact router only if import succeeded
if contact_router is not None:
    app.include_router(contact_router, prefix="/api")

@app.get("/healthz")
def healthz():
    return {"ok": True}
# @app.get("/health")
# def health():
#     return {"ok": True}