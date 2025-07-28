from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import hashlib
import os
from typing import Optional, List
import json
from datetime import datetime

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "stories"),
        user=os.getenv("DB_USER", "user"),
        password=os.getenv("DB_PASS", "pass")
    )

# Pydantic models
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str

class UserSettings(BaseModel):
    storyAge: Optional[int] = 5
    storyComplexity: Optional[str] = "medium"

class UpdateSettingsRequest(BaseModel):
    storyAge: Optional[int] = None
    storyComplexity: Optional[str] = None

class CreateStoryRequest(BaseModel):
    title: Optional[str] = None
    character: Optional[str] = None
    setting: Optional[str] = None
    adventure: Optional[str] = None
    prompt: Optional[str] = None
    storyType: str = "custom"  # "custom", "character", "universal"

# Hash password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Generate AI story (placeholder)
def generate_ai_story(prompt: str, age: int, complexity: str) -> str:
    # TODO: Replace with real OpenAI integration
    if complexity == "simple":
        return f"Es war einmal ein {age}-jähriges Kind, das {prompt} entdeckte. Es hatte viele Abenteuer und lebte glücklich bis ans Ende."
    elif complexity == "advanced":
        return f"In einem fernen Land lebte ein mutiges {age}-jähriges Kind. Eines Tages entdeckte es {prompt} und begab sich auf eine aufregende Reise voller Herausforderungen, Freundschaften und magischer Momente. Nach vielen Abenteuern kehrte es als Held nach Hause zurück."
    else:
        return f"Det var en gång ett {age}-årigt barn som upptäckte {prompt}. Barnet gick på ett spännande äventyr, träffade nya vänner och lärde sig viktiga lärdomar. Till slut kom barnet hem som en sann hjälte."

@app.get("/")
def root():
    return {"message": "AI Kids Stories API"}

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