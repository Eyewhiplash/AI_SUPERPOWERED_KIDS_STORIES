"""
Main API router for version 1.

This module aggregates all API routes and provides a single router
for the FastAPI application to include.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, stories, health

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

api_router.include_router(
    stories.router,
    prefix="/stories",
    tags=["Stories"]
) 