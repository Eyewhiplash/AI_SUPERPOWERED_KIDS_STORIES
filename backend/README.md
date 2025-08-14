# AI Kids Stories - Backend API

Enkel FastAPI-backend för AI-sagor med användare, inställningar och PostgreSQL.

## Teknik

- FastAPI (Python 3.11)
- PostgreSQL 15
- Docker och Docker Compose
- Lösenordshashning (sha256)
- OpenAI GPT-4o mini för sagogenerering

## Strukturoversikt

```
backend/
├── main.py                # Hela API:et (alla endpoints)
├── docker-compose.yml     # Docker (API + PostgreSQL)
├── requirements.txt       # Python-beroenden
├── Dockerfile             # Bygg image för API
├── .env                   # Miljövariabler (inte committa hemligheter)
└── README.md
```

## Kom igång

1. Gå till backend-mappen
   ```bash
   cd backend
   ```
2. Starta med Docker
   ```bash
   docker-compose up --build
   ```
3. API finns på
   - http://localhost:8000
   - Dokumentation: http://localhost:8000/docs
   - Health: http://localhost:8000/health

## API-endpoints (urval)

- `POST /register` – skapa användare
- `POST /login` – logga in, returnerar id, username, settings
- `PUT /users/{user_id}/settings` – uppdatera ålder/komplexitet
- `POST /stories` – skapa saga (sparas i DB)
- `GET /stories` – lista användarens sagor
- `GET /stories/{id}` – hämta saga
- `DELETE /stories/{id}` – ta bort saga
- `GET /universal-stories` – lista universella sagor
- `GET /universal-stories/{id}` – hämta universell saga

## Databas

Tabeller skapas automatiskt vid start:
- `users` (username, password, story_age, story_complexity)
- `stories` (user_id, title, content, story_type, created_at)

## Miljövariabler

Hanternas via `.env` (exempel):
```
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=stories
DB_HOST=db
DB_NAME=stories
DB_USER=user
DB_PASS=pass
OPENAI_API_KEY=...din nyckel...
OPENAI_MODEL=gpt-4o-mini
```

`docker-compose.yml` läser dessa värden. Ändra aldrig hemligheter i koden – uppdatera `.env` istället.

## Vanliga Docker-kommandon

```bash
docker-compose up               # starta
docker-compose up -d            # starta i bakgrunden
docker-compose up --build       # bygg om
docker-compose logs -f api      # följ API-loggar
docker-compose down             # stoppa
docker-compose down -v          # stoppa och rensa DB-volym
```