#  AI Storyteller for Kids

> En magisk AI-driven berättarapplikation som skapar personliga sagor för barn

##  Projektöversikt

AI Storyteller är en säker och rolig webbapplikation där barn kan få personliga berättelser skapade av AI. Med föräldrakontroll och säker inloggning skapar vi en trygg miljö för kreativ storytelling.

##  Tech Stack

### Frontend
-  **React 18** med Vite (snabb utveckling)
-  **Tailwind CSS** (responsiv design)
-  **Säker autentisering** (JWT tokens)

### Backend
-  **FastAPI** (async Python API)
-  **Pydantic** (datavalidering)
-  **PostgreSQL** (databas)
-  **Docker** (containerisering)

### AI Integration
-  **OpenAI API** (story generation)
-  **Åldersanpassat innehåll**

##  Projektstruktur

```
main-project/
├── frontend/          # React + Vite app
├── backend/           # FastAPI server
├── docker-compose.yml # Development environment
└── README.md         # Du är här! 🎉
```

##  Development Setup

### Förutsättningar
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### Quick Start
```bash
# Klona och navigera
cd main-project

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload

# Eller kör allt med Docker
docker-compose up
```

##  Säkerhetsfunktioner

- ✅ Password hashing (bcrypt/argon2)
- ✅ JWT token authentication
- ✅ Rollbaserad access control
- ✅ Input sanitization
- ✅ Rate limiting för API
- ✅ CORS-konfiguration

##  Features (Planerade)

### MVP
- [ ] Användarregistrering och inloggning
- [ ] Grundläggande UI med barn-tema
- [ ] Enkel AI story generation
- [ ] Spara berättelser

### Future Features
- [ ] Föräldrakontrollpanel
- [ ] Anpassade karaktärer
- [ ] Ljuduppläsning av berättelser
- [ ] Delning av berättelser
- [ ] Offline-läge

##  Design Philosophy

**För barn:**
- Färgglad och lekfull UI
- Stora, lättklickade knappar
- Visuella ikoner och animationer
- Enkel navigation

**För föräldrar:**
- Transparent vad barnet gör
- Säkerhetskontroller
- Aktivitetsloggar

##  Development Notes

- Kom ihåg att commita ofta! 
- Använd feature branches för nya funktioner
- Skriv tester för kritisk funktionalitet
- Dokumentera API-endpoints.
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Code Away**: Bygg  genom berättelser* 
