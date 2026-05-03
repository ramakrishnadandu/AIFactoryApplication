import os
import logging
from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from pydantic import BaseModel
import vosk
import json
import uvicorn

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Load configuration from environment variables or set defaults
MODEL_PATH = os.getenv('MODEL_PATH', 'models/vosk-model-small-en-us-0.15')
RECOGNIZER_SAMPLE_RATE = float(os.getenv('RECOGNIZER_SAMPLE_RATE', 16000))

# Initialize FastAPI app
app = FastAPI()

# Load Vosk model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Ensure the correct path is set.")
model = vosk.Model(MODEL_PATH)

class TranscriptionRequest(BaseModel):
    audio_file_path: str
    language: str

class TranscriptionResponse(BaseModel):
    transcribed_text: str
    language: str

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...), language: str = 'en'):
    logging.info(f"Received transcription request for language: {language}")

    try:
        with open("/tmp/" + file.filename, "wb") as tmp_file:
            content = await file.read()
            tmp_file.write(content)

            # Prepare recognizer
            rec = vosk.KaldiRecognizer(model, RECOGNIZER_SAMPLE_RATE)
            result_text = ""

            # Simulate audio streaming for real-time transcription
            with open(tmp_file.name, "rb") as audio:
                while True:
                    data = audio.read(4000)
                    if len(data) == 0:
                        break
                    if rec.AcceptWaveform(data):
                        result = json.loads(rec.Result())
                        result_text += result.get('text', '') + ' '

            # Final result for unprocessed audio segment
            final_result = json.loads(rec.FinalResult())
            result_text += final_result.get('text', '')

        logging.info(f"Transcription completed: {result_text.strip()}")

        return TranscriptionResponse(
            transcribed_text=result_text.strip(),
            language=language
        )

    except Exception as e:
        logging.error(f"Error in transcribing audio: {e}")
        raise HTTPException(status_code=500, detail=f"Error in transcribing audio: {e}")

@app.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    rec = vosk.KaldiRecognizer(model, RECOGNIZER_SAMPLE_RATE)
    while True:
        data = await websocket.receive_bytes()
        if websocket.client_state.name != 'CONNECTED':
            break
        try:
            if rec.AcceptWaveform(data):
                response = json.loads(rec.Result())
            else:
                response = json.loads(rec.PartialResult())
            await websocket.send_json(response)
        except Exception as e:
            logging.error(f"WebSocket error: {e}")
            await websocket.close()
            break

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)