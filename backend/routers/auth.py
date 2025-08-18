from fastapi import APIRouter, HTTPException
from schemas import LoginRequest, RegisterRequest
from db import db_cursor
from security import create_access_token
from passlib.hash import bcrypt
import hashlib


router = APIRouter()


def _sha256_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def _verify_and_upgrade_password(provided_password: str, stored_hash: str, user_id: int) -> bool:
    try:
        if stored_hash.startswith("$2a$") or stored_hash.startswith("$2b$"):
            return bcrypt.verify(provided_password, stored_hash)
    except Exception:
        pass
    # legacy sha256
    if _sha256_hash(provided_password) == stored_hash:
        try:
            with db_cursor() as (conn, cur):
                cur.execute("UPDATE users SET password = %s WHERE id = %s", (bcrypt.hash(provided_password), user_id))
        except Exception:
            pass
        return True
    return False


@router.post("/login")
def login(request: LoginRequest):
    with db_cursor() as (conn, cur):
        cur.execute(
            """
            SELECT u.id, u.username, u.password, u.story_age, u.story_complexity
            FROM users u
            WHERE u.username = %s
            """,
            (request.username,),
        )
        row = cur.fetchone()
    if not row:
        raise HTTPException(401, "Invalid login")
    user_id, username, stored_hash, story_age, story_complexity = row
    if not _verify_and_upgrade_password(request.password, stored_hash, user_id):
        raise HTTPException(401, "Invalid login")
    token = create_access_token(user_id)
    return {
        "id": user_id,
        "username": username,
        "settings": {
            "storyAge": story_age or 5,
            "storyComplexity": story_complexity or "medium",
        },
        "token": token,
    }


@router.post("/register")
def register(request: RegisterRequest):
    try:
        with db_cursor() as (conn, cur):
            cur.execute(
                """
                INSERT INTO users (username, password, story_age, story_complexity)
                VALUES (%s, %s, %s, %s)
                """,
                (request.username, bcrypt.hash(request.password), 5, "medium"),
            )
        return {"message": "User created", "username": request.username}
    except Exception:
        raise HTTPException(400, "User already exists")


