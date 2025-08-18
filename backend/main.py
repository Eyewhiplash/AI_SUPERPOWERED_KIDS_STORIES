from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
import logging
from config import settings
from typing import List  # for remnants in docstrings/type hints
from routers import auth, stories, universal

app = FastAPI()

# CORS
_cors_origins_env = settings.cors_allow_origins
if _cors_origins_env.strip() == "*":
    _allow_origins = ["*"]
    _allow_credentials = False
else:
    _allow_origins = [o.strip() for o in _cors_origins_env.split(',') if o.strip()]
    _allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allow_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging and global error handler
logger = logging.getLogger("uvicorn.error")

@app.exception_handler(Exception)
def global_error_handler(request: Request, exc: Exception):
    try:
        logger.exception("Unhandled error on %s %s", request.method, request.url)
    except Exception:
        pass
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

"""
Refactor note: Generation functions moved into services; legacy helpers removed from main.
"""

@app.get("/")
def root():
    return {"message": "AI Kids Stories API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Routers
app.include_router(auth.router)
app.include_router(stories.router)
app.include_router(universal.router)

@app.on_event("startup")
def app_started():
    logger.info("API startup complete")