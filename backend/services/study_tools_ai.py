import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_quiz(text: str, language: str, num_questions: int = 5) -> dict:
    """Generate quiz questions using GPT-4"""
    try:
        lang_instruction = "in Arabic" if language == "ar" else "in English"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are an educational quiz generator. Create {num_questions} multiple-choice questions {lang_instruction} based on the provided text. Return ONLY valid JSON with this structure: {{\"questions\": [{{\"id\": 1, \"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correct_answer_index\": 0}}]}}"},
                {"role": "user", "content": text[:3000]}
            ],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result.get("questions", [])
    except Exception as e:
        print(f"Quiz generation error: {e}")
        return []

def generate_flashcards(text: str, language: str, num_cards: int = 8) -> list:
    """Generate flashcards using GPT-4"""
    try:
        lang_instruction = "in Arabic" if language == "ar" else "in English"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are an educational flashcard generator. Create {num_cards} flashcards {lang_instruction} with term/definition pairs. Return ONLY valid JSON: {{\"cards\": [{{\"term\": \"...\", \"definition\": \"...\"}}]}}"},
                {"role": "user", "content": text[:3000]}
            ],
            temperature=0.6,
            max_tokens=1200,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result.get("cards", [])
    except Exception as e:
        print(f"Flashcard generation error: {e}")
        return []
