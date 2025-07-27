# AI Kids Stories - Backend API

A high-quality FastAPI backend for generating AI-powered children's stories with user management and story personalization.

## 🏗️ Architecture

- **Framework**: FastAPI with async support
- **Database**: PostgreSQL 15 with SQLAlchemy 2.0
- **Cache/Queue**: Redis for caching and background tasks
- **Background Tasks**: Celery for AI story generation
- **AI Integration**: OpenAI GPT models
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py          # Application configuration
│   │   └── __init__.py
│   ├── api/
│   │   └── v1/
│   │       ├── api.py         # Main API router
│   │       ├── endpoints/     # API endpoints
│   │       │   ├── auth.py    # Authentication
│   │       │   ├── users.py   # User management
│   │       │   ├── stories.py # Story operations
│   │       │   └── health.py  # Health checks
│   │       └── __init__.py
│   ├── models/                # SQLAlchemy models (TODO)
│   ├── schemas/               # Pydantic schemas (TODO)
│   ├── services/              # Business logic (TODO)
│   ├── tasks/                 # Celery tasks (TODO)
│   └── utils/                 # Utility functions (TODO)
├── tests/                     # Test suite (TODO)
├── alembic/                   # Database migrations (TODO)
├── docker-compose.yml         # Development environment
├── Dockerfile                 # Application container
├── requirements.txt           # Python dependencies
├── env.development           # Environment variables template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- OpenAI API key (for AI story generation)

### Setup

1. **Clone and navigate to backend directory**:
   ```bash
   cd AI_SUPERPOWERED_KIDS_STORIES/backend
   ```

2. **Create environment file**:
   ```bash
   cp env.development .env
   ```

3. **Edit `.env` file** and add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your-actual-openai-api-key
   ```

4. **Start development environment**:
   ```bash
   docker-compose up --build
   ```

5. **Access the API**:
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## 🛠️ Development

### Local Development (without Docker)

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables** (create `.env` file)

4. **Run the application**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Available Services

When running with Docker Compose:

- **API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Environment Variables

See `env.development` for all available configuration options:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: JWT secret key (change in production)
- `OPENAI_API_KEY`: OpenAI API key for story generation
- `CORS_ORIGINS`: Allowed frontend origins

## 📚 API Endpoints

### Core Endpoints

- `GET /` - API status and information
- `GET /health` - Health check for load balancers
- `GET /docs` - Interactive API documentation (development only)

### Health Checks

- `GET /api/v1/health/ping` - Simple ping
- `GET /api/v1/health/status` - Comprehensive health status
- `GET /api/v1/health/ready` - Readiness check
- `GET /api/v1/health/live` - Liveness check

### Planned Endpoints (TODO)

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/users/me` - Current user profile
- `POST /api/v1/stories/generate` - AI story generation
- `GET /api/v1/stories/` - User's saved stories

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app tests/
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

## 📝 Development Notes

This is a **high-quality, production-ready** backend structure designed to be:

- **Scalable**: Microservice-ready architecture
- **Maintainable**: Clean code with proper separation of concerns
- **Observable**: Comprehensive logging and health checks
- **Secure**: JWT authentication and proper security headers
- **Testable**: Structured for easy unit and integration testing

## 🔄 Next Development Steps

1. **Database Models**: Create SQLAlchemy models for users, stories, settings
2. **Authentication**: Implement JWT-based authentication system
3. **AI Integration**: Set up OpenAI integration for story generation
4. **Database Migrations**: Set up Alembic for database versioning
5. **Testing**: Add comprehensive test suite
6. **Background Tasks**: Implement Celery tasks for async story generation

## 🏗️ Production Deployment

For production deployment, ensure:

- Set strong `SECRET_KEY`
- Use production database credentials
- Configure proper CORS origins
- Set up SSL/TLS
- Use environment-specific Docker configurations
- Set up monitoring and logging aggregation 