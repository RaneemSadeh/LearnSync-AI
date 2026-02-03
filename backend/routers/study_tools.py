from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, database, security, schemas_study
from services import ai_engine
import json

router = APIRouter(
    prefix="/documents",
    tags=["study-tools"]
)

@router.post("/{document_id}/quiz", response_model=schemas_study.Quiz)
def generate_quiz(
    document_id: int,
    current_user: models.User = Depends(security.get_current_user_from_token),
    db: Session = Depends(database.get_db)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id, models.Document.owner_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="Document has no text")

    # Generate
    questions_json = ai_engine.generate_quiz(doc.extracted_text, doc.language)
    
    # Save
    new_quiz = models.Quiz(
        document_id=doc.id,
        title=f"Quiz for {doc.filename}",
        questions=questions_json
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    
    # Deserialize for response matching schema
    return {
        "id": new_quiz.id,
        "title": new_quiz.title,
        "created_at": new_quiz.created_at,
        "questions": json.loads(new_quiz.questions),
        "document_id": new_quiz.document_id
    }

@router.post("/{document_id}/flashcards", response_model=schemas_study.FlashcardDeck)
def generate_flashcards(
    document_id: int,
    current_user: models.User = Depends(security.get_current_user_from_token),
    db: Session = Depends(database.get_db)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id, models.Document.owner_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="Document has no text")

    # Generate
    cards_json = ai_engine.generate_flashcards(doc.extracted_text, doc.language)
    
    # Save
    new_deck = models.FlashcardDeck(
        document_id=doc.id,
        title=f"Flashcards for {doc.filename}",
        cards=cards_json
    )
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    
    return {
        "id": new_deck.id,
        "title": new_deck.title,
        "created_at": new_deck.created_at,
        "cards": json.loads(new_deck.cards),
        "document_id": new_deck.document_id
    }
