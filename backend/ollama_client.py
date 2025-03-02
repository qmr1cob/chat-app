import requests

OLLAMA_API_URL = "http://localhost:11435/api/generate"

def chat_with_ollama(message: str) -> str:
    payload = {
        "model": "mistral:latest",
        "prompt": f"""You are a helpful AI assistant. Respond naturally in conversational format.
Only use special formatting when appropriate:
- Use '##' for actual headings
- Use '*' for actual bullet points
- Use '1.' for actual numbered lists
- Use ```language for actual code blocks
- Use regular text for normal conversation

User message: {message}
Assistant:""",
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error communicating with Ollama API: {e}")