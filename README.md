# AI Kids Stories

AI‑driven webbapplikation som skapar och läser upp sagor för barn. Frontend i React, backend i FastAPI, datalagring i PostgreSQL och AI via OpenAI.

## Projektstruktur

```
AI_SUPERPOWERED_KIDS_STORIES/
├── frontend/                 # React + Vite
├── backend/                  # FastAPI API
│   ├── config.py             # Miljö/inställningar
│   ├── db.py                 # DB‑anslutning
│   ├── security.py           # JWT
│   ├── services/
│   │   └── openai_service.py # Story, bilder, TTS
│   ├── routers/
│   │   ├── auth.py           # /login, /register
│   │   ├── stories.py        # egna sagor, bilder, TTS
│   │   └── universal.py      # universella sagor, TTS/bilder
│   └── migrations/           # Alembic (schema + seed)
├── docker-compose.yml        # Dev‑stack (API + Postgres)
└── README.md                 # Denna fil
```

## Kom igång

Förutsättningar: Docker, Docker Compose, Node.js 18+

1) Starta backend (Docker)
```bash
cd AI_SUPERPOWERED_KIDS_STORIES/backend
docker compose up -d --build
```

2) Initiera databas (migreringar + seed)
```bash
docker compose run --rm api alembic upgrade head
```

3) Starta frontend
```bash
cd ../frontend
npm run dev -- --port 3000 --host 0.0.0.0
```

Backend: http://localhost:8000

Frontend: http://localhost:3000

## Miljövariabler (backend)

- DB_HOST, DB_NAME, DB_USER, DB_PASS
- JWT_SECRET, JWT_ALGORITHM (HS256), JWT_EXP_MINUTES
- OPENAI_API_KEY, OPENAI_TTS_MODEL, OPENAI_TTS_VOICE, OPENAI_IMAGE_MODEL, OPENAI_IMAGE_FALLBACK_MODEL
- CORS_ALLOW_ORIGINS

## Autentisering

`POST /login` ger en JWT. Skicka `Authorization: Bearer <token>` till skyddade endpoints (exempelvis `POST /stories`, `GET /stories`, `DELETE /stories/{id}`, `PUT /users/{id}/settings`).

## Vanliga kommandon

```bash
docker compose up -d --build      # starta API + DB
docker compose logs -f api        # följ API‑loggar
docker compose down               # stoppa
docker compose down -v            # stoppa och rensa DB‑volym
```

