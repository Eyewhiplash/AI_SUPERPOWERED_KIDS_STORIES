from typing import List
from openai import OpenAI
from config import settings
from tempfile import NamedTemporaryFile
import os


client = OpenAI(api_key=settings.openai_api_key, timeout=settings.openai_timeout)


def generate_story(prompt: str, age: int, complexity: str) -> str:
    if complexity == "simple":
        system_prompt = (
            f"Du är en barnboksförfattare som skriver enkla, roliga sagor för {age}-åringar. "
            "Använd enkla ord, korta meningar och mycket repetition. Gör sagan kort (3-4 stycken) och glad."
        )
    elif complexity == "advanced":
        system_prompt = (
            f"Du är en barnboksförfattare som skriver mer avancerade sagor för {age}-åringar. "
            "Använd rikare språk, längre meningar och mer komplexa berättelser. Gör sagan längre (5-7 stycken) med spännande äventyr."
        )
    else:
        system_prompt = (
            f"Du är en barnboksförfattare som skriver sagor för {age}-åringar. "
            "Använd lämpligt språk för åldern, blanda enkla och lite mer komplexa ord. Gör sagan medellång (4-5 stycken)."
        )

    user_prompt = f"Skriv en saga på svenska om: {prompt}. Gör den lämplig för ett {age}-årigt barn med komplexitet: {complexity}."
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=1000,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()
    except Exception:
        if complexity == "simple":
            return f"Det var en gång ett {age}-årigt barn som upptäckte {prompt}. Ett kort och glatt äventyr följde."
        elif complexity == "advanced":
            return f"I ett fjärran land upptäckte ett {age}-årigt barn {prompt} och gav sig ut på ett rikt, långt äventyr."
        else:
            return f"Det var en gång ett {age}-årigt barn som upptäckte {prompt} och gav sig ut på ett lagom långt äventyr."


def image_prompts_from_story(story_text: str, num_images: int = 3) -> List[str]:
    num_images = max(1, min(6, num_images))
    try:
        system = "Du är en kreativ bildprompt-skrivare."
        user = (
            f"Sagan:\n{story_text}\n\nGe exakt {num_images} rader. Varje rad ska vara en kort svensk bildprompt som beskriver en tydlig scen. "
            "Lägg alltid till stilen: 'barnvänlig tecknad stil, mjuka former, klara färger, mild belysning'."
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            temperature=0.7,
            max_tokens=400,
        )
        text = resp.choices[0].message.content.strip()
        prompts: List[str] = []
        for line in text.splitlines():
            clean = line.strip().lstrip("-•0123456789. ").strip()
            if clean:
                prompts.append(clean)
        if len(prompts) < num_images:
            prompts += [
                "En glad scen i mitten, barnvänlig tecknad stil, mjuka former, klara färger",
            ] * (num_images - len(prompts))
        return prompts[:num_images]
    except Exception:
        base = "barnvänlig tecknad stil, mjuka former, klara färger"
        return [
            f"Huvudkaraktären presenteras, {base}",
            f"Hjälten övervinner ett hinder, {base}",
            f"Lyckligt slut, {base}",
        ][:num_images]


def images_from_prompts(prompts: List[str], size: str = "1024x1024") -> List[str]:
    images_data_urls: List[str] = []
    for prompt in prompts:
        try:
            img = client.images.generate(
                model=settings.openai_image_model,
                prompt=prompt,
                size=size,
                response_format="b64_json",
            )
            b64 = img.data[0].b64_json
            images_data_urls.append(f"data:image/png;base64,{b64}")
            continue
        except Exception:
            try:
                img = client.images.generate(
                    model=settings.openai_image_fallback_model,
                    prompt=prompt,
                    size=size,
                    response_format="b64_json",
                )
                b64 = img.data[0].b64_json
                images_data_urls.append(f"data:image/png;base64,{b64}")
                continue
            except Exception:
                pass
    return images_data_urls



def synthesize_tts_bytes(text: str, voice: str) -> bytes:
    """Generate TTS audio bytes using OpenAI and return MP3 bytes."""
    with NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        with client.audio.speech.with_streaming_response.create(
            model=settings.openai_tts_model,
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
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        raise exc

