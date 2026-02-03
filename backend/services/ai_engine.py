import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using 'gemini-flash-latest' as it has active quota on this key
model = genai.GenerativeModel('gemini-flash-latest')

def analyze_document_content(text: str, language: str) -> dict:
    """Perform both summary and concept extraction in ONE call to save API quota (fix 429)"""
    try:
        lang_instruction = "in Arabic" if language == "ar" else "in English"
        prompt = (
            f"You are an educational assistant. Analyze the following text {lang_instruction}.\n"
            f"1. Provide a concise summary.\n"
            f"2. Extract 5-7 key concepts with definitions.\n"
            f"Return ONLY a JSON object with this structure: {{\"summary\": \"...\", \"concepts\": [{{ \"term\": \"...\", \"definition\": \"...\" }}]}}\n\n"
            f"Text: {text[:8000]}"
        )
        
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean potential markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        return {
            "summary": f"Error generating summary: {str(e)}",
            "concepts": [{"term": "Error", "definition": "Failed to extract concepts"}]
        }

def summarize_document(text: str, language: str) -> str:
    """Generate a summary (now uses unified call if called individually)"""
    result = analyze_document_content(text, language)
    return result.get("summary", "Summary generation failed")

def extract_concepts(text: str, language: str) -> str:
    """Extract key concepts (now uses unified call if called individually)"""
    result = analyze_document_content(text, language)
    return json.dumps(result.get("concepts", []))

def generate_quiz(text: str, language: str, num_questions: int = 5) -> str:
    """Generate quiz questions using Gemini"""
    try:
        lang_instruction = "in Arabic" if language == "ar" else "in English"
        prompt = (
            f"You are an educational quiz generator. Create {num_questions} multiple-choice questions {lang_instruction} based on the provided text. "
            f"Return ONLY valid JSON array: [{{\"id\": 1, \"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correct_answer_index\": 0}}]\n\n"
            f"Text: {text[:8000]}"
        )
        
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return content
    except Exception as e:
        print(f"Quiz generation error: {e}")
        return '[]'

def generate_flashcards(text: str, language: str, num_cards: int = 8) -> str:
    """Generate flashcards using Gemini"""
    try:
        lang_instruction = "in Arabic" if language == "ar" else "in English"
        prompt = (
            f"You are an educational flashcard generator. Create {num_cards} flashcards {lang_instruction} with term/definition pairs. "
            f"Return ONLY valid JSON array: [{{\"term\": \"...\", \"definition\": \"...\"}}]\n\n"
            f"Text: {text[:8000]}"
        )
        
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return content
    except Exception as e:
        print(f"Flashcard generation error: {e}")
        return '[]'

def extract_text_from_file(file_path: str, media_type: str) -> str:
    """Use Gemini to extract text, OCR images, or transcribe media"""
    try:
        if media_type == "image":
            # Direct byte upload is MUCH faster for images
            with open(file_path, "rb") as f:
                image_data = f.read()
            
            prompt = "Perform OCR on this image. Extract all text visible, including handwritten notes. If there is an Arabic text, extract it accurately."
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": image_data}
            ])
            return response.text

        # For large files (PDF, Audio, Video), use the Upload API
        mime_map = {
            "pdf": "application/pdf",
            "audio": "audio/mpeg",
            "video": "video/mp4"
        }
        
        mime_type = mime_map.get(media_type, "application/octet-stream")
        uploaded_file = genai.upload_file(path=file_path, mime_type=mime_type)
        
        prompt = ""
        if media_type == "pdf":
            prompt = "Please extract all the text and key information from this PDF precisely."
        elif media_type == "audio" or media_type == "video":
            prompt = "Please provide a detailed and accurate transcription of the speech in this media."
        else:
            prompt = "Analyze this file and extract all text/information."

        response = model.generate_content([prompt, uploaded_file])
        return response.text
    except Exception as e:
        print(f"Gemini Extraction Error: {e}")
        return f"Extraction failed: {str(e)}"
