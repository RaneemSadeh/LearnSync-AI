from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from sqlalchemy.orm import Session
import models, schemas, database, security
from services import extraction, transcription, ocr
import shutil
import os
from datetime import datetime
from typing import List, Optional

router = APIRouter(
    prefix="/documents",
    tags=["documents"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_current_user(user: models.User = Depends(security.get_current_user_from_token)):
    return user

@router.post("/upload", response_model=schemas.Document)
async def upload_file(
    file: UploadFile = File(...), 
    course_id: Optional[int] = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    valid_types = {
        'application/pdf': 'pdf', 
        'audio/mpeg': 'audio', 
        'audio/wav': 'audio',
        'video/mp4': 'video',
        'image/jpeg': 'image',
        'image/png': 'image'
    }
    
    # Basic MIME type check
    media_type = 'pdf' # default
    if file.content_type in valid_types:
        media_type = valid_types[file.content_type]
    elif file.filename.lower().endswith('.pdf'):
        media_type = 'pdf'
    elif file.filename.lower().endswith(('.mp3', '.wav')):
        media_type = 'audio'
    elif file.filename.lower().endswith('.mp4'):
        media_type = 'video'
    elif file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        media_type = 'image'
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Allowed: PDF, Media (MP3/MP4), Images (JPG/PNG)")

    # Safe filename
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Extract/Transcribe/OCR
    extracted_text = ""
    detected_lang = "en"
    
    if media_type == 'pdf':
        extracted_text = extraction.extract_text_from_pdf(file_location)
    elif media_type == 'image':
        extracted_text = ocr.extract_text_from_image(file_location)
    else:
        # Audio/Video
        extracted_text = transcription.transcribe_media(file_location)

    # Check language
    is_arabic = any('\u0600' <= char <= '\u06FF' for char in extracted_text) if extracted_text else False
    detected_lang = "ar" if is_arabic else "en"

    # Save to DB
    new_doc = models.Document(
        filename=file.filename,
        file_path=file_location,
        media_type=media_type,
        extracted_text=extracted_text,
        language=detected_lang,
        owner_id=current_user.id,
        course_id=course_id
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return new_doc

@router.get("/", response_model=List[schemas.Document])
def get_my_documents(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    documents = db.query(models.Document).filter(models.Document.owner_id == current_user.id).offset(skip).limit(limit).all()
    return documents
