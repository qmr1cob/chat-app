from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    type: Literal["text", "code", "list", "heading"]  # Added more types
    content: str