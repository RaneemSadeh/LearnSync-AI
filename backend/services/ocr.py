from services import ai_engine

def extract_text_from_image(file_path: str) -> str:
    """Use Gemini 2.0 Flash for High-Quality OCR"""
    try:
        text = ai_engine.extract_text_from_file(file_path, "image")
        return text.strip()
    except Exception as e:
        print(f"Gemini OCR error: {e}")
        return "Failed to extract text from image."
