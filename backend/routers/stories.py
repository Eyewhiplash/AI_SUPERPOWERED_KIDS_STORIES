from fastapi import APIRouter, HTTPException, Depends, Query, Response
from schemas import UpdateSettingsRequest, CreateStoryRequest
from security import get_current_user_id
from db import db_cursor
from services.openai_service import generate_story, image_prompts_from_story, images_from_prompts, synthesize_tts_bytes
from datetime import datetime
import psycopg2


router = APIRouter()
@router.get("/stories/{story_id}/tts")
def tts_story(story_id: int, voice: str = Query(default="alloy")):
    # Fetch story text
    with db_cursor() as (conn, cur):
        cur.execute("SELECT content FROM stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Story not found")
    text = row[0] or ""
    if not text.strip():
        raise HTTPException(400, "Story has no content")
    # Try return cached audio first
    try:
        with db_cursor() as (conn, cur):
            cur.execute(
                "SELECT audio_bytes FROM story_audio WHERE story_id = %s AND voice = %s ORDER BY created_at DESC LIMIT 1",
                (story_id, voice),
            )
            row_audio = cur.fetchone()
        if row_audio and row_audio[0]:
            blob = row_audio[0]
            return Response(content=(blob.tobytes() if hasattr(blob, 'tobytes') else blob), media_type="audio/mpeg")
    except Exception:
        pass
    # Generate fresh, then save
    try:
        audio_bytes = synthesize_tts_bytes(text, voice)
        try:
            with db_cursor() as (conn, cur):
                cur.execute(
                    "INSERT INTO story_audio (story_id, voice, audio_bytes, created_at) VALUES (%s, %s, %s, %s)",
                    (story_id, voice, psycopg2.Binary(audio_bytes), datetime.now()),
                )
        except Exception:
            pass
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception:
        raise HTTPException(500, "TTS generation failed")



@router.put("/users/{user_id}/settings")
def update_user_settings(user_id: int, settings: UpdateSettingsRequest, current_user_id: int = Depends(get_current_user_id)):
    if current_user_id != user_id:
        raise HTTPException(403, "Forbidden")
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
        with db_cursor() as (conn, cur):
            cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = %s", params)
    return {"message": "Settings updated"}


@router.post("/stories")
def create_story(story: CreateStoryRequest, current_user_id: int = Depends(get_current_user_id)):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT story_age, story_complexity FROM users WHERE id = %s", (current_user_id,))
        user = cur.fetchone()
        if not user:
            raise HTTPException(404, "User not found")
        age, complexity = user[0] or 5, user[1] or "medium"

        if story.storyType == "character" and story.character:
            prompt = f"en historia med {story.character}"
            title = f"Äventyr med {story.character}"
        elif story.storyType == "custom" and story.prompt:
            prompt = story.prompt
            title = story.title or "Ditt Äventyr"
        else:
            prompt = f"{story.character or 'en hjälte'} i {story.setting or 'ett magiskt land'} som {story.adventure or 'går på äventyr'}"
            title = story.title or "Ett Magiskt Äventyr"

        content = generate_story(prompt, age, complexity)

        cur.execute(
            """
            INSERT INTO stories (user_id, title, content, story_type, created_at)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
            """,
            (current_user_id, title, content, story.storyType, datetime.now()),
        )
        story_id = cur.fetchone()[0]

    return {"id": story_id, "title": title, "content": content, "storyType": story.storyType, "createdAt": datetime.now().isoformat()}


@router.get("/stories")
def get_user_stories(current_user_id: int = Depends(get_current_user_id)):
    with db_cursor() as (conn, cur):
        cur.execute(
            """
            SELECT id, title, content, story_type, created_at
            FROM stories
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (current_user_id,),
        )
        rows = cur.fetchall()
    stories = [
        {
            "id": r[0],
            "title": r[1],
            "content": r[2],
            "storyType": r[3],
            "createdAt": r[4].isoformat() if r[4] else None,
        }
        for r in rows
    ]
    return {"stories": stories}


@router.get("/stories/{story_id}")
def get_story(story_id: int, current_user_id: int = Depends(get_current_user_id)):
    with db_cursor() as (conn, cur):
        cur.execute(
            """
            SELECT id, title, content, story_type, created_at, user_id
            FROM stories
            WHERE id = %s
            """,
            (story_id,),
        )
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Story not found")
    if row[5] != current_user_id:
        raise HTTPException(403, "Forbidden")
    return {"id": row[0], "title": row[1], "content": row[2], "storyType": row[3], "createdAt": row[4].isoformat() if row[4] else None}


@router.delete("/stories/{story_id}")
def delete_story(story_id: int, current_user_id: int = Depends(get_current_user_id)):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT user_id FROM stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(404, "Story not found")
        if row[0] != current_user_id:
            raise HTTPException(403, "Forbidden")
        cur.execute("DELETE FROM stories WHERE id = %s", (story_id,))
    return {"message": "Story deleted"}


@router.post("/stories/{story_id}/images")
def generate_story_images(story_id: int, num_images: int = Query(default=3, ge=1, le=6), size: str = Query(default="1024x1024")):
    with db_cursor() as (conn, cur):
        cur.execute("SELECT title, content FROM stories WHERE id = %s", (story_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Story not found")
    title, content = row[0] or "Saga", row[1] or ""
    if not content.strip():
        raise HTTPException(400, "Story has no content")
    prompts = image_prompts_from_story(content, num_images=num_images)
    images = images_from_prompts(prompts, size=size)
    if not images:
        raise HTTPException(500, "Image generation failed")
    try:
        with db_cursor() as (conn, cur):
            cur.execute("DELETE FROM story_images WHERE story_id = %s", (story_id,))
            for idx, (img, pr) in enumerate(zip(images, prompts)):
                cur.execute(
                    "INSERT INTO story_images (story_id, image_index, data_url, prompt, created_at) VALUES (%s, %s, %s, %s, %s)",
                    (story_id, idx, img, pr, datetime.now()),
                )
    except Exception:
        pass
    return {"title": title, "images": images, "prompts": prompts}


@router.get("/stories/{story_id}/images")
def get_story_images(story_id: int):
    with db_cursor() as (conn, cur):
        cur.execute(
            "SELECT image_index, data_url, prompt FROM story_images WHERE story_id = %s ORDER BY image_index ASC",
            (story_id,),
        )
        rows = cur.fetchall()
    return {"images": [r[1] for r in rows], "prompts": [r[2] for r in rows]}


