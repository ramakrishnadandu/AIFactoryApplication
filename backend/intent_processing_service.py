import logging
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from llama import LlamaModel  # Hypothetical library for LLaMA model
from typing import Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("intent_processing_service")

# Define the request and response models
class IntentRequest(BaseModel):
    input_text: str
    language: str = "en"  # default language

class IntentResponse(BaseModel):
    intent: str
    confidence: float
    processed_text: str

# Initialize LLaMA model (hypothetical API)
try:
    llama_model = LlamaModel(model_path="/path/to/llama/model")
    logger.info("Successfully loaded LLaMA model.")
except Exception as e:
    logger.exception("Failed to load LLaMA model: %s", e)
    raise

# Create FastAPI app instance
app = FastAPI()

@app.post("/process-intent/", response_model=IntentResponse)
async def process_intent(request: IntentRequest):
    """
    Process input text to detect user intent using LLaMA.
    
    Args:
        request: IntentRequest object containing input_text and language

    Returns:
        IntentResponse containing intent, confidence, and processed text
    """
    logger.info("Received intent processing request with text: %s", request.input_text)
    
    # Input validation
    if not request.input_text.strip():
        logger.error("Input text is empty.")
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    # Process text using LLaMA model
    try:
        result = llama_model.process_text(text=request.input_text, language=request.language)
    except Exception as e:
        logger.exception("Error processing text with LLaMA: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error while processing intent.")

    # Simulating processing with hypothetical result structure
    intent_result = {
        "intent": result.get("intent", "unknown"),
        "confidence": result.get("confidence", 0.0),
        "processed_text": result.get("processed_text", request.input_text)
    }
    
    logger.info("Processed intent: %s with confidence: %f", intent_result["intent"], intent_result["confidence"])
    return IntentResponse(**intent_result)

# Error handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error("HTTP Exception: %s", exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail)},
    )

# Error handler for generic exceptions
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled Exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred."},
    )

# Running the service on port 8002
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)