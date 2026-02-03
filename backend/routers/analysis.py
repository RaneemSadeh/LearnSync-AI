from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, database, security
from services import ai_engine, cache
import json

router = APIRouter(
    prefix="/documents",
    tags=["analysis"]
)

@router.post("/{document_id}/analyze")
def analyze_document(
    document_id: int,
    current_user: models.User = Depends(security.get_current_user_from_token),
    db: Session = Depends(database.get_db)
):
    # Check cache first
    cache_key = f"analyze_{document_id}"
    cached_result = cache.get_cached_result(cache_key)
    if cached_result:
        return cached_result
    
    # Fetch doc
    doc = db.query(models.Document).filter(models.Document.id == document_id, models.Document.owner_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="Document has no text to analyze")

    # Perform Analysis in ONE call to save quota
    analysis_result = ai_engine.analyze_document_content(doc.extracted_text, doc.language)
    summary = analysis_result.get("summary", "Summary failed")
    concepts_json = json.dumps(analysis_result.get("concepts", []))

    # Update DB
    doc.summary = summary
    doc.key_concepts = concepts_json
    
    db.commit()
    db.refresh(doc)
    
    result = {
        "id": doc.id,
        "summary": doc.summary,
        "key_concepts": json.loads(doc.key_concepts)
    }
    
    # Cache the result
    cache.set_cached_result(cache_key, result)
    
    return result
