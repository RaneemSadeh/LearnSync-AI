import pypdf
from typing import Optional
from services import ai_engine

def extract_text_from_pdf(file_path: str) -> Optional[str]:
    # Try standard pypdf first (near instant)
    text = ""
    try:
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        
        # If we got substantial text, return it immediately (fast path)
        if len(text.strip()) > 200:
            return text.strip()
    except Exception as e:
        print(f"Error extracting with pypdf: {e}")

    # If pypdf failed or got very little text (likely a scanned PDF), use Gemini
    try:
        print(f"Low text yield from pypdf for {file_path}, attempting Gemini AI extraction...")
        ai_text = ai_engine.extract_text_from_file(file_path, "pdf")
        if ai_text and not ai_text.startswith("Extraction failed"):
            return ai_text.strip()
    except Exception as e:
        print(f"Gemini PDF extraction failed: {e}")

    # Final fallback to whatever pypdf managed to get
    return text.strip() if text else None
