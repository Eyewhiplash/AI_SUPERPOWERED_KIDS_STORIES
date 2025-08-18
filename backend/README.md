# Backend (FastAPI)

FastAPI‑backend för AI‑sagor med användare, JWT‑auth, bilder och TTS, PostgreSQL och Alembic‑migrationer.

## Teknik

- FastAPI (Python 3.11)
- PostgreSQL 15
- Docker och Docker Compose
- Lösenordshashning: bcrypt (auto‑uppgradering från legacy sha256 vid inloggning)
- JWT‑autentisering
- OpenAI (GPT/TTS/bilder)
- Alembic för schema/seed

## Struktur

```
backend/
├── main.py                 # App‑bootstrap (CORS, felhantering, routers)
├── config.py               # Miljö/inställningar
├── db.py                   # DB‑anslutning
├── security.py             # JWT
├── routers/
│   ├── auth.py             # /login, /register
│   ├── stories.py          # egna sagor, bilder, TTS
│   └── universal.py        # universella sagor, TTS/bilder
├── services/openai_service.py
├── migrations/             # Alembic (schema + seed)
├── requirements.txt        # Python‑beroenden
├── docker-compose.yml      # API + DB (dev)
└── Dockerfile              # API‑image
```

## Körning (Docker)

```bash
cd AI_SUPERPOWERED_KIDS_STORIES/backend
docker compose up -d --build
docker compose run --rm api alembic upgrade head
```

API finns på:
- http://localhost:8000
- Health: http://localhost:8000/health

## Miljövariabler (exempel .env)

```
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=stories
DB_HOST=db
DB_NAME=stories
DB_USER=user
DB_PASS=pass
OPENAI_API_KEY=...
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=alloy
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_FALLBACK_MODEL=dall-e-3
CORS_ALLOW_ORIGINS=*
JWT_SECRET=change-me-in-prod
JWT_ALGORITHM=HS256
JWT_EXP_MINUTES=60
```

## API‑urval

- `POST /register`, `POST /login`
- `PUT /users/{user_id}/settings`
- `POST /stories`, `GET /stories`, `GET /stories/{id}`, `DELETE /stories/{id}`
- `POST /stories/{id}/images`, `GET /stories/{id}/images`, `GET /stories/{id}/tts`
- `GET /universal-stories`, `GET /universal-stories/{id}`, `GET /universal-stories/{id}/tts`

## Vanliga Docker‑kommandon

```bash
docker compose up -d --build     # starta
docker compose logs -f api       # följ API‑loggar
docker compose down              # stoppa
docker compose down -v           # stoppa och rensa DB‑volym
```