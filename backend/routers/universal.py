from fastapi import APIRouter, HTTPException, Query, Response
from db import db_cursor
from services.openai_service import images_from_prompts, image_prompts_from_story, synthesize_tts_bytes
from config import settings


router = APIRouter()


@router.get("/universal-stories")
def get_universal_stories():
    with db_cursor() as (conn, cur):
        cur.execute(
            """
            SELECT id, title, description, COALESCE(icon, ''), COALESCE(category, '')
            FROM universal_stories
            ORDER BY title ASC
            """
        )
        rows = cur.fetchall()
    stories = [
        {"id": r[0], "title": r[1], "description": r[2], "icon": r[3] or "", "category": r[4] or ""}
        for r in rows
    ]
    return {"stories": stories}


@router.get("/universal-stories/{story_id}")
def get_universal_story(story_id: str):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT id, title, content FROM universal_stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Universal story not found")
    return {"id": row[0], "title": row[1], "content": row[2], "storyType": "universal"}


@router.get("/universal-stories/{story_id}/tts")
def tts_universal_story(story_id: str, voice: str = Query(default=settings.openai_tts_voice)):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT content FROM universal_stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Universal story not found")
    text = row[0]
    try:
        audio_bytes = synthesize_tts_bytes(text, voice)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception:
        raise HTTPException(500, "TTS generation failed")


@router.post("/universal-stories/{story_id}/images")
def generate_universal_story_images(story_id: str, num_images: int = Query(default=3, ge=1, le=6), size: str = Query(default="1024x1024")):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT title, content FROM universal_stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Universal story not found")
    title, content = row[0], row[1]
    prompts = image_prompts_from_story(content, num_images=num_images)
    images = images_from_prompts(prompts, size=size)
    if not images:
        raise HTTPException(500, "Image generation failed")
    return {"title": title, "images": images, "prompts": prompts}


