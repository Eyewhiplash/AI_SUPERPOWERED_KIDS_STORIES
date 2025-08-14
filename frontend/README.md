# Frontend (React + Vite)

Frontend för AI Kids Stories byggd med React och Vite.

## Kom igång

```bash
cd frontend
npm install
npm run dev
```

Servern startar på `http://localhost:3000` eller närliggande port (Vite väljer ledig).

## Struktur (kort)

- `src/App.jsx` – rutter och huvudlayout
- `src/contexts/AuthContext.jsx` – inloggning, register, användarinställningar
- `src/pages/*` – sidor (Hem, Skapa saga, Läsare, Login, Register, Inställningar, m.fl.)
- `src/components/*` – header, footer, felhanterare m.m.

## Miljö och API

Frontend pratar med backend på `http://localhost:8000`:
- `POST /login`, `POST /register`
- `PUT /users/{id}/settings`
- `POST /stories`, `GET /stories`
- `GET /universal-stories`

## Utvecklingstips

- Mobil-/surfplattelayout är optimerad med media queries i `src/index.css`
- Fel fångas globalt via `components/ErrorBoundary.jsx`
- Inloggningstillstånd lagras i `localStorage`
