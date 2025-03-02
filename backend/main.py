from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging
from ollama_client import chat_with_ollama
from schemas import ChatRequest, ChatResponse

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (update for production)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Endpoint to handle chat messages
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logging.debug(f"Received message: {request.message}")
        
        # Use the ollama_client instead of subprocess
        response = chat_with_ollama(request.message)
        logging.debug(f"Ollama response: {response}")

        # Determine content type and format
        if "```" in response:
            return {"type": "code", "content": response}
        elif response.startswith("##"):
            return {"type": "heading", "content": response.lstrip("#").strip()}
        elif any(line.startswith(("* ", "1. ")) for line in response.split("\n")):
            return {"type": "list", "content": response}
        else:
            return {"type": "text", "content": response}
    except Exception as e:
        logging.error(f"Error in /chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to handle CSV file uploads
@app.post("/upload-csv", response_model=ChatResponse)
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        csv_data = contents.decode("utf-8")
        logging.debug(f"CSV file content: {csv_data}")

        # Create a more detailed analysis prompt
        analysis_prompt = f"""Analyze this CSV data and provide insights:

{csv_data}

Please provide:
1. Basic statistics (number of rows, columns)
2. Data structure analysis
3. Key patterns or insights
4. Any potential data quality issues

Format the response in a clear, readable way."""
        
        # Use the ollama_client with the detailed prompt
        response = chat_with_ollama(analysis_prompt)

        return {
            "type": "text",
            "content": response
        }
    except Exception as e:
        logging.error(f"Error in /upload-csv endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)