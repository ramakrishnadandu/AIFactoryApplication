import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
from tts_coqui import TTS

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the configuration
class TTSConfig(BaseModel):
    model_name: str
    language: str = "en"
    voice: Optional[str] = None

# Load configuration from environment variables or default
tts_config = TTSConfig(
    model_name=os.getenv("TTS_MODEL_NAME", "tts_models/en/ljspeech/tacotron2-DDC"),
    language=os.getenv("TTS_LANGUAGE", "en"),
    voice=os.getenv("TTS_VOICE", None)
)

# Initialize the Coqui TTS model
try:
    tts = TTS(tts_config.model_name, progress_bar=False)
    logger.info(f"Loaded TTS model: {tts_config.model_name}")
except Exception as e:
    logger.error(f"Failed to load TTS model: {e}")
    raise RuntimeError("Failed to initialize TTS service")

class TTSInput(BaseModel):
    text: str
    voice: Optional[str] = None
    language: Optional[str] = None

@app.post("/synthesize", response_model=str)
async def synthesize(input: TTSInput):
    try:
        language = input.language if input.language else tts_config.language
        voice = input.voice if input.voice else tts_config.voice

        logger.info(f"Synthesizing text: {input.text} with language: {language} and voice: {voice}")

        # Generate the speech waveform
        wav = tts.tts(input.text, speaker=voice, lang=language)

        # Save the audio to a file
        audio_file = f"output_audio.wav"
        tts.save_wav(wav, audio_file)
        
        return audio_file

    except Exception as e:
        logger.error(f"Error during synthesis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during synthesis")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)