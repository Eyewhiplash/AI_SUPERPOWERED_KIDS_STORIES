# Frontend (React + Vite)

React‑frontend för AI Kids Stories.

## Körning

```bash
cd AI_SUPERPOWERED_KIDS_STORIES/frontend
npm run dev -- --port 3000 --host 0.0.0.0
```

Öppna http://localhost:3000

## Struktur

- `src/App.jsx` – rutter och huvudlayout
- `src/contexts/AuthContext.jsx` – inloggning/registrering/inställningar
- `src/pages/*` – sidor (Hem, Skapa saga, Läsare, Login, Register, Inställningar, m.fl.)
- `src/components/*` – återanvändbara komponenter

## API‑integration

Frontend anropar backend på `http://localhost:8000` och skickar JWT i `Authorization: Bearer <token>` för skyddade endpoints.

Exempel på flöden:
- Inloggning: `POST /login`
- Sagor: `POST /stories`, `GET /stories`, `DELETE /stories/{id}`
- Bilder/TTS: `POST /stories/{id}/images`, `GET /stories/{id}/images`, `GET /stories/{id}/tts`
- Universella sagor: `GET /universal-stories`, `GET /universal-stories/{id}`, `GET /universal-stories/{id}/tts`
