# AI Kids Stories - Backend API

En enkel FastAPI backend för att generera AI-sagor för barn med användarhantering och databas.

## 🏗️ Teknik

- **Framework**: FastAPI 
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Authentication**: Simple password hashing
- **Language**: Python 3.11

## 📁 Projekt Struktur

```
backend/
├── main.py                   # HELA backend API:et (alla endpoints)
├── docker-compose.yml       # Docker setup (FastAPI + PostgreSQL)
├── requirements.txt          # Python dependencies
├── Dockerfile               # Application container
├── .env                     # Environment variables
└── README.md               # Den här filen
```

**ENKELT OCH RENT!** Allt ligger i `main.py` - inga komplicerade mappar!

## 🚀 Quick Start

### Krav

- Docker och Docker Compose
- Det är allt!

### Setup

1. **Gå till backend-mappen**:
   ```bash
   cd backend
   ```

2. **Starta Docker**:
   ```bash
   docker-compose up --build
   ```

3. **Klart!** API:et körs på:
   - **API**: http://localhost:8000
   - **Swagger UI**: http://localhost:8000/docs
   - **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Grundläggande
- `GET /` - API status
- `GET /health` - Health check

### Autentisering
- `POST /login` - Logga in användare
- `POST /register` - Registrera användare

### Användarinställningar
- `PUT /users/{user_id}/settings` - Uppdatera inställningar (ålder, komplexitet)

### Sagor
- `POST /stories` - Skapa ny saga
- `GET /stories` - Hämta användarens sagor
- `GET /stories/{story_id}` - Hämta specifik saga
- `DELETE /stories/{story_id}` - Ta bort saga

### Universella Sagor
- `GET /universal-stories` - Lista fördefinierade sagor
- `GET /universal-stories/{story_id}` - Hämta universal saga

## 🗄️ Databas

Automatisk setup av:
- **users** tabell (username, password, story_age, story_complexity)
- **stories** tabell (user_id, title, content, story_type, created_at)

## 🐳 Docker Kommandon

```bash
# Starta allt
docker-compose up

# Starta i bakgrunden
docker-compose up -d

# Bygg om
docker-compose up --build

# Se logs
docker-compose logs -f

# Stoppa
docker-compose down

# Nollställ databas
docker-compose down -v
```

## 🔧 Miljövariabler

`.env` filen innehåller:
- Database connection
- Secret key för säkerhet

## 📝 Funktioner

✅ **Login/Register** - Enkel lösenordsautentisering
✅ **Användarinställningar** - Ålder och komplexitet för sagor
✅ **Saga-bibliotek** - Spara och hämta användarens sagor  
✅ **AI-sagagenerering** - Placeholder för framtida OpenAI integration
✅ **Universella sagor** - Fördefinierade sagor som anpassas efter ålder
✅ **PostgreSQL databas** - Automatisk setup av tabeller
✅ **Docker setup** - Bara kör `docker-compose up`!

## 🎯 Design Filosofi

**ENKELT ÄR BÄST!**
- EN fil (`main.py`) med allt
- Inga komplicerade mappar
- Inga onödiga dependencies
- Bara det som behövs - inget mer!

Perfekt för utveckling och enkel att förstå! 💪 