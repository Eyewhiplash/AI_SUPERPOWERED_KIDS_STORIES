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
OPENAI_IMAGE_MODEL = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1")
OPENAI_IMAGE_FALLBACK_MODEL = os.getenv("OPENAI_IMAGE_FALLBACK_MODEL", "dall-e-3")

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

def _generate_image_prompts_from_story(story_text: str, num_images: int = 3) -> List[str]:
    """Skapa korta scenbeskrivningar för bilder baserat på sagans innehåll (svenska)."""
    num_images = max(1, min(6, num_images))
    try:
        system = (
            "Du är en kreativ bildprompt-skrivare. Du får en svensk barn-saga och ska skapa mycket korta, konkreta bildprompter för barnvänliga tecknade illustrationer."
        )
        user = (
            f"Sagan:\n{story_text}\n\nGe exakt {num_images} rader. Varje rad ska vara en kort svensk bildprompt som beskriver en tydlig scen (början, mitten, slut).\n"
            "Lägg alltid till stilen: 'barnvänlig tecknad stil, mjuka former, klara färger, mild belysning'."
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.7,
            max_tokens=400,
        )
        text = resp.choices[0].message.content.strip()
        # Dela upp i rader, rensa punkter/nummer
        prompts: List[str] = []
        for line in text.splitlines():
            clean = line.strip().lstrip("-•0123456789. ").strip()
            if clean:
                prompts.append(clean)
        if len(prompts) < num_images:
            # Fyll ut med generiska steg om modellen gav färre
            prompts += ["En glad scen i mitten, barnvänlig tecknad stil, mjuka former, klara färger"] * (num_images - len(prompts))
        return prompts[:num_images]
    except Exception:
        # Fallback: generiska steg
        base = "barnvänlig tecknad stil, mjuka former, klara färger"
        return [
            f"Huvudkaraktären presenteras, {base}",
            f"Hjälten övervinner ett hinder, {base}",
            f"Lyckligt slut, {base}",
        ][:num_images]

def _generate_images_from_prompts(prompts: List[str], size: str = "1024x1024") -> List[str]:
    """Generera bilder med OpenAI och returnera data-URL:er (PNG base64)."""
    images_data_urls: List[str] = []
    for prompt in prompts:
        # Försök primär modell först
        try:
            img = client.images.generate(
                model=OPENAI_IMAGE_MODEL,
                prompt=prompt,
                size=size,
                response_format="b64_json",
            )
            b64 = img.data[0].b64_json
            images_data_urls.append(f"data:image/png;base64,{b64}")
            continue
        except Exception as exc_primary:
            print(f"OpenAI image error (primary {OPENAI_IMAGE_MODEL}): {exc_primary}")
            # Fallback till DALL·E 3 om primär är spärrad/otillgänglig
            try:
                img = client.images.generate(
                    model=OPENAI_IMAGE_FALLBACK_MODEL,
                    prompt=prompt,
                    size=size,
                    response_format="b64_json",
                )
                b64 = img.data[0].b64_json
                images_data_urls.append(f"data:image/png;base64,{b64}")
                continue
            except Exception as exc_fallback:
                print(f"OpenAI image error (fallback {OPENAI_IMAGE_FALLBACK_MODEL}): {exc_fallback}")
    return images_data_urls

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

    # Try return cached audio first
    try:
        conn_cached = get_db()
        cur_cached = conn_cached.cursor()
        cur_cached.execute(
            "SELECT audio_bytes FROM story_audio WHERE story_id = %s AND voice = %s ORDER BY created_at DESC LIMIT 1",
            (story_id, voice),
        )
        row_audio = cur_cached.fetchone()
        conn_cached.close()
        if row_audio and row_audio[0]:
            blob = row_audio[0]
            return Response(content=(blob.tobytes() if hasattr(blob, 'tobytes') else blob), media_type="audio/mpeg")
    except Exception:
        pass

    # Generate fresh, then save
    try:
        audio_bytes = _synthesize_tts_bytes(text, voice)
        try:
            conn_save = get_db()
            cur_save = conn_save.cursor()
            cur_save.execute(
                "INSERT INTO story_audio (story_id, voice, audio_bytes, created_at) VALUES (%s, %s, %s, %s)",
                (story_id, voice, psycopg2.Binary(audio_bytes), datetime.now()),
            )
            conn_save.commit()
            conn_save.close()
        except Exception as save_err:
            print(f"Save TTS error: {save_err}")
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        print(f"OpenAI TTS error: {e}")
        raise HTTPException(500, "TTS generation failed")

@app.post("/stories/{story_id}/images")
def generate_story_images(story_id: int, num_images: int = Query(default=3, ge=1, le=6), size: str = Query(default="1024x1024")):
    """Generera 1-6 bilder för en specifik sparad saga."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT title, content FROM stories WHERE id = %s", (story_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Story not found")
    title, content = row[0] or "Saga", row[1] or ""
    if not content.strip():
        raise HTTPException(400, "Story has no content")
    prompts = _generate_image_prompts_from_story(content, num_images=num_images)
    images = _generate_images_from_prompts(prompts, size=size)
    if not images:
        raise HTTPException(500, "Image generation failed")
    # Persist generated images with indices
    try:
        conn_imgs = get_db()
        cur_imgs = conn_imgs.cursor()
        cur_imgs.execute("DELETE FROM story_images WHERE story_id = %s", (story_id,))
        for idx, (img, pr) in enumerate(zip(images, prompts)):
            cur_imgs.execute(
                "INSERT INTO story_images (story_id, image_index, data_url, prompt, created_at) VALUES (%s, %s, %s, %s, %s)",
                (story_id, idx, img, pr, datetime.now()),
            )
        conn_imgs.commit()
        conn_imgs.close()
    except Exception as save_exc:
        print(f"Save images error: {save_exc}")
    return {"title": title, "images": images, "prompts": prompts}

@app.get("/stories/{story_id}/images")
def get_story_images(story_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT image_index, data_url, prompt FROM story_images WHERE story_id = %s ORDER BY image_index ASC",
        (story_id,),
    )
    rows = cur.fetchall()
    conn.close()
    return {"images": [r[1] for r in rows], "prompts": [r[2] for r in rows]}

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
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, title, description, COALESCE(icon, ''), COALESCE(category, '')
        FROM universal_stories
        ORDER BY title ASC
        """
    )
    rows = cur.fetchall()
    conn.close()
    stories = []
    for r in rows:
        stories.append({
            "id": r[0],
            "title": r[1],
            "description": r[2],
            "icon": r[3] or "",
            "category": r[4] or ""
        })
    return {"stories": stories}

@app.get("/universal-stories/{story_id}")
def get_universal_story(story_id: str, user_id: int = 1):  # TODO: Get user_id from token
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, title, content
        FROM universal_stories
        WHERE id = %s
        """,
        (story_id,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Universal story not found")
    return {
        "id": row[0],
        "title": row[1],
        "content": row[2],
        "storyType": "universal"
    }

# TTS for universal stories (Swedish)
@app.get("/universal-stories/{story_id}/tts")
def tts_universal_story(story_id: str, user_id: int = 1, voice: str = Query(default=OPENAI_TTS_VOICE)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT content FROM universal_stories WHERE id = %s", (story_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Universal story not found")
    text = row[0]
    try:
        audio_bytes = _synthesize_tts_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        print(f"OpenAI TTS error (universal): {e}")
        raise HTTPException(500, "TTS generation failed")

@app.post("/universal-stories/{story_id}/images")
def generate_universal_story_images(story_id: str, user_id: int = 1, num_images: int = Query(default=3, ge=1, le=6), size: str = Query(default="1024x1024")):
    """Generera 1-6 bilder för en universell saga."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT title, content FROM universal_stories WHERE id = %s", (story_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Universal story not found")
    title, content = row[0], row[1]
    prompts = _generate_image_prompts_from_story(content, num_images=num_images)
    images = _generate_images_from_prompts(prompts, size=size)
    if not images:
        raise HTTPException(500, "Image generation failed")
    return {"title": title, "images": images, "prompts": prompts}

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
    # Story images table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS story_images (
            id SERIAL PRIMARY KEY,
            story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
            image_index INTEGER DEFAULT 0,
            data_url TEXT NOT NULL,
            prompt TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Story audio table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS story_audio (
            id SERIAL PRIMARY KEY,
            story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
            voice VARCHAR(50) DEFAULT 'alloy',
            audio_bytes BYTEA NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Universal stories table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS universal_stories (
            id VARCHAR(50) PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description VARCHAR(300) NOT NULL,
            icon VARCHAR(10),
            category VARCHAR(100),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Remove non-classic/unwanted entries
    try:
        cur.execute("DELETE FROM universal_stories WHERE id IN (%s,%s,%s)", (
            'underwater_quest', 'space_adventure', 'goldilocks'
        ))
    except Exception:
        pass

    # Seed/refresh universal stories (upsert canonical content)
    seeds = [
            (
                "cinderella",
                "Askungen",
                "En klassisk berättelse om vänlighet, tålamod och att våga hoppas.",
                "",
                "Klassiska sagor",
                "Det var en gång en snäll flicka som kallades Askungen. Hon hjälpte till från morgon till kväll, och fast dagarna var långa behöll hon sin värme och sin dröm om något mer. Varje kväll tittade hon på stjärnorna och tänkte att världen måste vara större än gården där hon sopade och tvättade.\n\nEn dag kom ett bud att slottet skulle hålla en stor fest. Alla i trakten talade om musik, ljus och glitter. Askungen log försiktigt och önskade i sitt hjärta att få vara där, bara en liten stund, för att höra orkestern och se hur ljuskronorna glimmade. När hon trodde att hoppet var borta dök en vänlig fe upp och viskade: \"Din vänlighet har kraft. Låt oss öppna en dörr.\" Med ett mjukt svep förvandlades hennes slitna klänning till något enkelt men vackert, och ett par skor glittrade som nyfallen frost.\n\nPå slottet kände Askungen musiken som ett varmt andetag. She dansade varsamt, skrattade och talade med människor som lyssnade på henne precis som hon var. När klockan började ringa sitt sena slag mindes hon feens ord: det magiska var till låns. Hon sprang genom gården, och ena skon föll av i trappan. Hon vände sig om, log, och fortsatte hem i gryningens stilla ljus.\n\nDagarna som följde sökte slottsfolket efter den vars hjärta matchade skons glans. När de kom till Askungen var alla tysta. Skon passade inte bara hennes fot; den passade hennes mod. Hon valde ett liv där hon fick vara trygg, sedd och fri att drömma vidare. Och i den nya vardagen glömde hon aldrig stunderna av vänlighet som bar henne hit.\n\nSå lärde sig alla runt henne att tålamod, omtanke och hopp kan tända ljus i de mörkaste hörn. Och när kvällarna blev stilla, lyssnade Askungen fortfarande till musiken inom sig och delade sin värme med alla som behövde den.",
            ),
            (
                "little_red",
                "Rödluvan",
                "En berättelse om mod, klokskap och att lyssna på goda råd.",
                "",
                "Klassiska sagor",
                "Rödluvan fick i uppdrag att hälsa på sin mormor och ta med en korg med bröd och soppa. Skogen framför henne var grön och mjuk, men stigarna delade sig då och då. Hon stannade vid första korsningen och andades lugnt. Hon mindes rådet: \"Välj vägen som känns trygg. Titta, lyssna och ta din tid.\"\n\nLängs vägen hörde hon fåglarna, såg solljuset dansa mellan bladen och märkte hur vinden viskade mellan träden. En skugga rörde sig längre in bland granarna. Rödluvan blev stilla och kände efter. Hon valde den öppna stigen, där hon såg långt, och fortsatte i jämn takt. När en räv dök upp och nyfiket tittade på korgen log hon och höll avstånd, lät räven gå före och gav den en vänlig nick.\n\nNär hon kom fram var mormor trött och behövde vila. Rödluvan värmde soppa, la en filt över axlarna och berättade om skogens ljus. De talade om mod som inte alltid är att springa fort, utan att våga stanna, tänka och välja lugnet. Mormors ögon glittrade när hon hörde hur Rödluvan lyssnat till både naturen och sin egen röst.\n\nPå eftermiddagen gick de en liten bit tillsammans ut på gården. Mormor pekade ut bärbuskar och berättade vilka som mognar först. Rödluvan skrev ner små tips på en lapp och stoppade den i fickan. När kvällen kom och himlen blev rosa, kramade de varandra länge.\n\nRödluvan gick hem den kvällen med ett hjärta som var både starkt och mjukt. Hon visste att klokskap växer med varje vänlig handling, och att mod ibland är att lyssna, välja rätt stig och dela sin omsorg med andra.",
            ),
            (
                "three_pigs",
                "De tre små grisarna",
                "En saga om att planera, hjälpas åt och bygga något som håller.",
                "",
                "Klassiska sagor",
                "Tre små grisar bestämde sig för att bygga varsitt hem. Den första ville bli klar fort och satte upp väggar av halm. Det såg fint ut i solskenet, men när grisen tryckte på väggarna gungade de. Den andra tog pinnar och band ihop dem. Det blev stadigare, men när hon knackade på dörrkarmen svajade den lite. Den tredje grisen satte sig ner med papper och penna och ritade. \"Om vi tar det lugnt, blir det starkt,\" sa hon och log.\n\nGrisarna hjälptes åt att bära tegel, blanda lera och mäta noga. De vilade när de blev trötta, åt tillsammans och pratade om hur ett hem ska kännas: varmt, tryggt och välkomnande för vänner. När väggarna reste sig kände de en blandning av trötthet och stolthet. Den tredje grisen knackade på hörnen och lyssnade på det fasta klingandet.\n\nEn kväll kom en hård vind över fälten. Halmhuset prasslade och porthaken hoppade till. Grisen sprang skrattande till pinhuset, och tillsammans stöttade de dörren. När vinden tog i igen sprang de vidare till tegelhuset. De öppnade dörren, tände en liten lampa och kokade soppa. Utanför brusade vinden, men inne var det lugnt.\n\nDe tre grisarna satt tätt och delade bröd och historier. De skrattade åt det vingliga bordet i halmhuset och lovade att göra det stadigare nästa gång. De ritade små förbättringar: en starkare dörr, ett fönster som slöt tätt, en hylla för böcker och te. När vinden mojnade gick de ut tillsammans för att se över allt och hjälpa varandra.\n\nFrån den dagen byggde de inte längre var för sig. De byggde tillsammans, långsamt och omsorgsfullt, så att ingen behövde vara ensam när det blåste. Och när nya vänner kom förbi, visade de gärna hur man planerar, provar, rättar till och skapar något som håller, steg för steg.",
            ),
            (
                "hansel_gretel",
                "Hans och Greta",
                "En klassisk saga om syskonmod, list och att hitta hem tillsammans.",
                "",
                "Klassiska sagor",
                "Två syskon vandrade i skogen där stigen ibland försvann under barr och skugga. De delade sista brödbiten mellan sig och gjorde upp små märken på trädens bark för att minnas vägen. Skogen var stor, men deras händer höll fast i varandra.\n\nNär hungern blev som störst såg de ett märkligt hus. Väggarna doftade sött och taket glimmade som socker i sol. De tog ett steg närmare, sedan ett till, och knackade försiktigt. Dörren öppnades, och en röst som lät vänlig men trött bad dem stiga in. Syskonen såg på varandra och gick in, med nyfikenhet i bröstet och försiktighet i stegen.\n\nHuset dolde hemligheter. Syskonen märkte snart att vänligheten var tunn som glas, och under ytan fanns något hårt. De talade lågt om hur de skulle hjälpas åt att komma därifrån. Greta iakttog hur låsen fungerade och var veden låg; Hans lyssnade efter när stegen lät tyngre i korridoren.\n\nEn natt dånade en storm över skogen. Medan vinden slet i grenarna tog syskonen sin chans. De ställde ut stenarna de sparat, låste upp en dörr, och lät eldens knastrande dölja deras steg. De sprang mot mörkret, men mörkret var inte längre skrämmande: de sprang tillsammans.\n\nVid gryningen fann de en glänta där ljuset landade som varma händer. De följde en bäck som pratade vänligt med stenarna, och snart kände de igen ett gammalt träd med en gren som pekade som en kompass. Hemma väntade armar som trodde att allt var förlorat men som nu fick börja om, långsamt och sant.\n\nSyskonen berättade inte sin saga för att väcka rädsla, utan för att påminna om att list kan vara mjuk, att mod kan vara tyst, och att man alltid hittar hem lättare när man håller ihop. Skogen stod kvar, men den kändes inte längre oändlig.",
            ),
            (
                "snow_white",
                "Snövit",
                "En klassisk saga om vänskap, mod och godhetens kraft.",
                "",
                "Klassiska sagor",
                "I ett litet rike växte Snövit upp med ett hjärta som alltid sökte det goda. När skogen blev hennes tillflykt mötte hon sju vänliga vänner som gav plats åt värme och skratt. De delade arbete och mat, lyssnade på varandra och lät dagarna få sin lugna rytm.\n\nEn dag prövades deras vänskap av ett svek, men Snövits mod växte ur omtanke. Hon litade på sina vänner, och de stod vid hennes sida när mörkret kändes nära. Tillsammans fann de en väg tillbaka till ljuset.\n\nSnövit lärde alla omkring sig att vänlighet inte är svaghet, utan styrkan som håller oss upprätta. Och när våren kom tillbaka, kändes världen mjukare och tryggare än förut.",
            ),
            (
                "sleeping_beauty",
                "Törnrosa",
                "En klassisk berättelse om tid, hopp och att vakna till ett nytt kapitel.",
                "",
                "Klassiska sagor",
                "I ett stilla slott somnade en prinsessa, och hela riket sänkte rösten. Åren gled förbi som mjuka moln, men hoppet somnade aldrig. Rosor växte runt murarna och påminde alla som gick förbi att vila också är en del av livet.\n\nNär tiden var mogen bröts tystnaden. Prinsessan vaknade inte till buller, utan till hjärtans stilla glädje. Fönstren öppnades, ljuset föll på golven och musiken fann sin väg genom rummen.\n\nAlla lärde sig att väntan kan bära något gott, och att kärlek är det som väcker oss varsamt när det nya kapitlet börjar.",
            ),
        ]
    cur.executemany(
        """
        INSERT INTO universal_stories (id, title, description, icon, category, content)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          category = EXCLUDED.category,
          content = EXCLUDED.content
        """,
        seeds,
    )
    
    conn.commit()
    conn.close() 