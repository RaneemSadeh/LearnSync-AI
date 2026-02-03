from services import ai_engine
import os

def transcribe_media(file_path: str) -> str:
    """Use Gemini 2.0 Flash for High-Quality Audio/Video Transcription"""
    try:
        ext = os.path.splitext(file_path)[1].lower()
        media_type = "video" if ext == ".mp4" else "audio"
        
        text = ai_engine.extract_text_from_file(file_path, media_type)
        return text.strip()
    except Exception as e:
        print(f"Gemini Transcription error: {e}")
        return "Failed to transcribe media."
