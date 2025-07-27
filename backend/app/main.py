"""
Main FastAPI application for AI Kids Stories backend.

This module sets up the FastAPI application with proper middleware,
CORS configuration, and route registration.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from app.core.config import settings
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: Configured FastAPI application instance
    """
    
    # Create FastAPI instance
    app = FastAPI(
        title=settings.app_name,
        description="AI-powered children's story generation API",
        version=settings.version,
        debug=settings.debug,
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
    )
    
    # Add security middleware
    if settings.is_production:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["*"]  # Configure with actual hosts in production
        )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    # Add timing middleware for performance monitoring
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        """Add process time to response headers."""
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response
    
    # Add logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Log all requests for monitoring."""
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url}")
        
        # Process request
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(
            f"Response: {response.status_code} "
            f"(took {process_time:.3f}s)"
        )
        
        return response
    
    # Register API routes
    app.include_router(api_router, prefix="/api/v1")
    
    return app


# Create application instance
app = create_application()


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API status.
    
    Returns:
        dict: API status and information
    """
    return {
        "message": "AI Kids Stories API",
        "version": settings.version,
        "status": "healthy",
        "environment": settings.environment
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for load balancers and monitoring.
    
    Returns:
        dict: Health status
    """
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": settings.version
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unexpected errors.
    
    Args:
        request: The request that caused the exception
        exc: The exception that was raised
        
    Returns:
        JSONResponse: Error response
    """
    logger.error(f"Global exception handler: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_id": str(time.time()),  # Simple error ID for tracking
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        log_level=settings.log_level.lower()
    ) 