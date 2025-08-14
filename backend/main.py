from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import StreamingResponse, Response
from fastapi import Query
from tempfile import NamedTemporaryFile
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import hashlib
import os
from typing import Optional, List
import json
from datetime import datetime
from openai import OpenAI

from schemas import LoginRequest, RegisterRequest, UpdateSettingsRequest, CreateStoryRequest

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
OPENAI_TTS_MODEL = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
OPENAI_TTS_VOICE = os.getenv("OPENAI_TTS_VOICE", "alloy")

# Database connection
def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "stories"),
        user=os.getenv("DB_USER", "user"),
        password=os.getenv("DB_PASS", "pass")
    )

# Hash password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Generate AI story using OpenAI GPT-4o mini
def generate_ai_story(prompt: str, age: int, complexity: str) -> str:
    try:
        # Create age-appropriate system prompt
        if complexity == "simple":
            system_prompt = f"Du är en barnboksförfattare som skriver enkla, roliga sagor för {age}-åringar. Använd enkla ord, korta meningar och mycket repetition. Gör sagan kort (3-4 stycken) och glad."
        elif complexity == "advanced":
            system_prompt = f"Du är en barnboksförfattare som skriver mer avancerade sagor för {age}-åringar. Använd rikare språk, längre meningar och mer komplexa berättelser. Gör sagan längre (5-7 stycken) med spännande äventyr."
        else:  # medium
            system_prompt = f"Du är en barnboksförfattare som skriver sagor för {age}-åringar. Använd lämpligt språk för åldern, blanda enkla och lite mer komplexa ord. Gör sagan medellång (4-5 stycken) med en bra balans av äventyr och lärdom."
        
        user_prompt = f"Skriv en saga på svenska om: {prompt}. Gör den lämplig för ett {age}-årigt barn med komplexitet: {complexity}."
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.8
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Fallback if OpenAI fails
        print(f"OpenAI error: {e}")
    if complexity == "simple":
        return f"Es war einmal ein {age}-jähriges Kind, das {prompt} entdeckte. Es hatte viele Abenteuer und lebte glücklich bis ans Ende."
    elif complexity == "advanced":
            return f"In einem fernen Land lebte ein mutiges {age}-jähriges Kind. Eines Tages entdeckte es {prompt} och begab sich auf eine aufregende Reise voller Herausforderungen, Freundschaften och magischer Momente. Nach vielen Abenteuern kehrte es als Held nach Hause zurück."
    else:
        return f"Det var en gång ett {age}-årigt barn som upptäckte {prompt}. Barnet gick på ett spännande äventyr, träffade nya vänner och lärde sig viktiga lärdomar. Till slut kom barnet hem som en sann hjälte."

@app.get("/")
def root():
    return {"message": "AI Kids Stories API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def _synthesize_tts_bytes(text: str, voice: str) -> bytes:
    """Generate TTS audio bytes using OpenAI and return MP3 bytes."""
    # Use streaming-to-file API for reliability, then return bytes
    with NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        with client.audio.speech.with_streaming_response.create(
            model=OPENAI_TTS_MODEL,
            voice=voice,
            input=text,
        ) as response:
            response.stream_to_file(tmp_path)
        with open(tmp_path, "rb") as f:
            audio_bytes = f.read()
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        return audio_bytes
    except Exception as exc:
        # Clean up file if OpenAI failed
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        raise exc


# Text-to-Speech for a specific story (Swedish input)
@app.get("/stories/{story_id}/tts")
def tts_story(story_id: int, voice: str = Query(default=OPENAI_TTS_VOICE)):
    # Fetch story text
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT content FROM stories WHERE id = %s", (story_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(404, "Story not found")

    text = row[0] or ""
    if not text.strip():
        raise HTTPException(400, "Story has no content")

    try:
        audio_bytes = _synthesize_tts_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        print(f"OpenAI TTS error: {e}")
        raise HTTPException(500, "TTS generation failed")

@app.post("/login")
def login(request: LoginRequest):
    conn = get_db()
    cur = conn.cursor()
    
    # Check user and get settings
    cur.execute("""
        SELECT u.id, u.username, u.story_age, u.story_complexity 
        FROM users u 
        WHERE u.username = %s AND u.password = %s
    """, (request.username, hash_password(request.password)))
    user = cur.fetchone()
    
    conn.close()
    
    if user:
        return {
            "id": user[0],
            "username": user[1],
            "settings": {
                "storyAge": user[2] or 5,
                "storyComplexity": user[3] or "medium"
            }
        }
    else:
        raise HTTPException(401, "Invalid login")

@app.post("/register")
def register(request: RegisterRequest):
    conn = get_db()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            INSERT INTO users (username, password, story_age, story_complexity) 
            VALUES (%s, %s, %s, %s)
        """, (request.username, hash_password(request.password), 5, "medium"))
        conn.commit()
        conn.close()
        return {"message": "User created", "username": request.username}
    except:
        conn.close()
        raise HTTPException(400, "User already exists")

@app.put("/users/{user_id}/settings")
def update_user_settings(user_id: int, settings: UpdateSettingsRequest):
    conn = get_db()
    cur = conn.cursor()
    
    # Update user settings
    updates = []
    params = []
    
    if settings.storyAge is not None:
        updates.append("story_age = %s")
        params.append(settings.storyAge)
    
    if settings.storyComplexity is not None:
        updates.append("story_complexity = %s")
        params.append(settings.storyComplexity)
    
    if updates:
        params.append(user_id)
        cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = %s", params)
        conn.commit()
    
    conn.close()
    return {"message": "Settings updated"}

@app.post("/stories")
def create_story(story: CreateStoryRequest, user_id: int = 1):  # TODO: Get user_id from token
    conn = get_db()
    cur = conn.cursor()
    
    # Get user settings
    cur.execute("SELECT story_age, story_complexity FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(404, "User not found")
    
    age, complexity = user[0] or 5, user[1] or "medium"
    
    # Generate story based on type
    if story.storyType == "character" and story.character:
        prompt = f"en historia med {story.character}"
        title = f"Äventyr med {story.character}"
    elif story.storyType == "custom" and story.prompt:
        prompt = story.prompt
        title = story.title or "Ditt Äventyr"
    else:
        prompt = f"{story.character or 'en hjälte'} i {story.setting or 'ett magiskt land'} som {story.adventure or 'går på äventyr'}"
        title = story.title or "Ett Magiskt Äventyr"
    
    # Generate story content
    content = generate_ai_story(prompt, age, complexity)
    
    # Save story to database
    cur.execute("""
        INSERT INTO stories (user_id, title, content, story_type, created_at) 
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """, (user_id, title, content, story.storyType, datetime.now()))
    
    story_id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    
    return {
        "id": story_id,
        "title": title,
        "content": content,
        "storyType": story.storyType,
        "createdAt": datetime.now().isoformat()
    }

@app.get("/stories")
def get_user_stories(user_id: int = 1):  # TODO: Get user_id from token
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, title, content, story_type, created_at 
        FROM stories 
        WHERE user_id = %s 
        ORDER BY created_at DESC
    """, (user_id,))
    
    stories = []
    for row in cur.fetchall():
        stories.append({
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "storyType": row[3],
            "createdAt": row[4].isoformat() if row[4] else None
        })
    
    conn.close()
    return {"stories": stories}

@app.get("/stories/{story_id}")
def get_story(story_id: int):
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, title, content, story_type, created_at 
        FROM stories 
        WHERE id = %s
    """, (story_id,))
    
    story = cur.fetchone()
    conn.close()
    
    if not story:
        raise HTTPException(404, "Story not found")
    
    return {
        "id": story[0],
        "title": story[1],
        "content": story[2],
        "storyType": story[3],
        "createdAt": story[4].isoformat() if story[4] else None
    }

@app.delete("/stories/{story_id}")
def delete_story(story_id: int):
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("DELETE FROM stories WHERE id = %s", (story_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Story deleted"}

@app.get("/universal-stories")
def get_universal_stories():
    # Predefined universal stories
    universal_stories = [
        {
            "id": "cinderella",
            "title": "Askungen",
            "description": "En klassisk saga om en snäll tjej och en glassko",
            "icon": "👗",
            "category": "Klassiska sagor"
        },
        {
            "id": "little_red",
            "title": "Rödluvan",
            "description": "En ung flicka möter en stor stygga varg",
            "icon": "🐺",
            "category": "Klassiska sagor"
        },
        {
            "id": "three_pigs",
            "title": "De tre små grisarna",
            "description": "Tre grisar bygger hus för att skydda sig",
            "icon": "🐷",
            "category": "Klassiska sagor"
        },
        {
            "id": "goldilocks",
            "title": "Guldlock",
            "description": "En nyfiken flicka besöker björnarnas hus",
            "icon": "🐻",
            "category": "Klassiska sagor"
        },
        {
            "id": "space_adventure",
            "title": "Rymdäventyret",
            "description": "Utforska galaxer och träffa rymdvarelser",
            "icon": "🚀",
            "category": "Moderna äventyr"
        },
        {
            "id": "underwater_quest",
            "title": "Undervattensresan",
            "description": "Dyk ner i oceanens djup",
            "icon": "🐠",
            "category": "Moderna äventyr"
        }
    ]
    
    return {"stories": universal_stories}

@app.get("/universal-stories/{story_id}")
def get_universal_story(story_id: str, user_id: int = 1):  # TODO: Get user_id from token
    # Get user settings for personalization
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("SELECT story_age, story_complexity FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    age, complexity = (user[0] or 5, user[1] or "medium") if user else (5, "medium")
    
    conn.close()
    
    # Universal story templates
    stories = {
        "cinderella": f"En gång i tiden fanns en snäll {age}-årig flicka som hette Askungen...",
        "little_red": f"Det var en gång en modig {age}-årig flicka som kallades Rödluvan...",
        "three_pigs": f"Tre små grisar, alla {age} år gamla, bestämde sig för att bygga egna hus...",
        "goldilocks": f"En nyfiken {age}-årig flicka som hette Guldlock gick vilse i skogen...",
        "space_adventure": f"Astronaut {age}-åring Max startade sitt rymdskepp...",
        "underwater_quest": f"Den {age}-åriga dykaren Emma dök ner i det blå havet..."
    }
    
    if story_id not in stories:
        raise HTTPException(404, "Universal story not found")
    
    return {
        "id": story_id,
        "title": story_id.replace("_", " ").title(),
        "content": stories[story_id],
        "storyType": "universal"
    }

# TTS for universal stories (Swedish), personalized by user_id
@app.get("/universal-stories/{story_id}/tts")
def tts_universal_story(story_id: str, user_id: int = 1, voice: str = Query(default=OPENAI_TTS_VOICE)):
    # Personalize content the same way as in get_universal_story
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT story_age, story_complexity FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    age, _ = (user[0] or 5, user[1] or "medium") if user else (5, "medium")
    conn.close()

    stories = {
        "cinderella": f"En gång i tiden fanns en snäll {age}-årig flicka som hette Askungen...",
        "little_red": f"Det var en gång en modig {age}-årig flicka som kallades Rödluvan...",
        "three_pigs": f"Tre små grisar, alla {age} år gamla, bestämde sig för att bygga egna hus...",
        "goldilocks": f"En nyfiken {age}-årig flicka som hette Guldlock gick vilse i skogen...",
        "space_adventure": f"Astronaut {age}-åring Max startade sitt rymdskepp...",
        "underwater_quest": f"Den {age}-åriga dykaren Emma dök ner i det blå havet...",
    }

    if story_id not in stories:
        raise HTTPException(404, "Universal story not found")

    text = stories[story_id]

    try:
        audio_bytes = _synthesize_tts_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        print(f"OpenAI TTS error (universal): {e}")
        raise HTTPException(500, "TTS generation failed")

@app.on_event("startup")
def create_tables():
    conn = get_db()
    cur = conn.cursor()
    
    # Users table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(64) NOT NULL,
            story_age INTEGER DEFAULT 5,
            story_complexity VARCHAR(20) DEFAULT 'medium'
        )
    """)
    
    # Stories table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS stories (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            story_type VARCHAR(50) DEFAULT 'custom',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close() 