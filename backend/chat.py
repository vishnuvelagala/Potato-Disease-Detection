from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
import os
import requests
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    tags=["chat"]
)

class ChatMessage(BaseModel):
    message: str
    model: Optional[str] = "deepseek-chat"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024  # Increased default for DeepSeek

class ChatResponse(BaseModel):
    response: str
    model: str
    tokens_used: Optional[int]

SYSTEM_PROMPT = """You are a potato expert assistant. You can help with questions about:
- Potato diseases and their treatments
- Potato cultivation and farming practices
- Potato varieties and their characteristics
- Potato storage and preservation
- Potato nutrition and health benefits

Only answer questions related to potatoes. If a question is not about potatoes, politely explain that you can only help with potato-related topics.
Be concise but informative in your responses."""

def get_deepseek_client():
    """Dependency for DeepSeek API key check."""
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DeepSeek API key not configured. Please contact the administrator."
        )
    return api_key

@router.post("/chat/", response_model=ChatResponse)
async def chat(
        message: ChatMessage,
        api_key: str = Depends(get_deepseek_client)
):
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": message.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message.message}
            ],
            "temperature": message.temperature,
            "max_tokens": message.max_tokens
        }

        print(f"Sending request to DeepSeek: {payload}")  # Debug log

        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10  # Add timeout to avoid hanging
        )

        response.raise_for_status()  # Raises HTTPError for bad responses (4xx, 5xx)
        response_data = response.json()

        print(f"DeepSeek API response: {response_data}")  # Debug log

        return {
            "response": response_data["choices"][0]["message"]["content"],
            "model": message.model,
            "tokens_used": response_data.get("usage", {}).get("total_tokens")
        }

    except requests.exceptions.RequestException as e:
        error_detail = str(e)
        if hasattr(e, 'response') and e.response:
            error_detail = f"HTTP {e.response.status_code}: {e.response.text}"
            print(f"DeepSeek API Error: {error_detail}")  # Log full error

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"DeepSeek API Error: {error_detail}"
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while processing request."
        )