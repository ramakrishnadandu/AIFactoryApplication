from fastapi import FastAPI, Request, WebSocket, HTTPException
from fastapi.responses import JSONResponse
import requests
import logging
import asyncio
import os

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(message)s')

app = FastAPI()

# Environment variables for service URLs
STT_SERVICE_URL = os.getenv('STT_SERVICE_URL', 'http://localhost:8001/transcribe')
INTENT_SERVICE_URL = os.getenv('INTENT_SERVICE_URL', 'http://localhost:8002/intent')
TTS_SERVICE_URL = os.getenv('TTS_SERVICE_URL', 'http://localhost:8003/synthesize')

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"message": "Internal Server Error"})


@app.post("/audio-input")
async def process_audio_file(request: Request):
    form = await request.form()
    audio_file = form.get('audio_file')
    if not audio_file:
        raise HTTPException(status_code=400, detail="Audio file is missing")

    try:
        # Send audio file to STT service for transcription
        files = {'audio_file': audio_file.file}
        response = requests.post(STT_SERVICE_URL, files=files)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="STT service failed")

        stt_data = response.json()
        transcribed_text = stt_data['transcribed_text']
        
        # Process transcribed text with Intent processing
        response = requests.post(INTENT_SERVICE_URL, json={"text": transcribed_text})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Intent service failed")
        
        intent_data = response.json()
        response_text = intent_data['response']

        # Convert text-to-speech
        response = requests.post(TTS_SERVICE_URL, json={"text": response_text})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="TTS service failed")
        
        tts_data = response.content

        return JSONResponse(content={"audio": tts_data})

    except Exception as e:
        logging.error(f"Error processing audio: {e}")
        raise HTTPException(status_code=500, detail="Error processing audio")


@app.websocket("/ws/audio-stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_bytes()
            # Here you could stream the data to STT service if it supports real-time

            # This is an example of control logic, real implementation will depend on used models/APIs
            transcribed_text = "text processed"  # Assume processing is done
            response = await process_intent(transcribed_text)
            audio_response = await synthesize_speech(response)
            await websocket.send_bytes(audio_response)
        except Exception as e:
            logging.error(f"WebSocket error: {e}")
            await websocket.close()


async def process_intent(text: str) -> str:
    try:
        response = requests.post(INTENT_SERVICE_URL, json={"text": text})
        if response.status_code != 200:
            raise Exception("Intent service failed")

        intent_response = response.json()
        return intent_response.get('response', '')
    
    except Exception as e:
        logging.error(f"Error processing intent: {e}")
        return ''


async def synthesize_speech(text: str) -> bytes:
    try:
        response = requests.post(TTS_SERVICE_URL, json={"text": text})
        if response.status_code != 200:
            raise Exception("TTS service failed")

        return response.content

    except Exception as e:
        logging.error(f"Error synthesizing speech: {e}")
        return b''


# Utility function to handle wake word detection, context retention, and other features
async def advanced_feature_handler():
    pass  # Placeholder for wake word detection, context management, etc.


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_gateway:app", host="0.0.0.0", port=8000, reload=True)