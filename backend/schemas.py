from pydantic import BaseModel
from typing import Optional

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
    storyType: str = "custom" 