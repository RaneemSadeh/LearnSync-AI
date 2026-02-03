from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, database, security
from typing import List

router = APIRouter(
    prefix="/courses",
    tags=["courses"]
)

@router.post("/", response_model=schemas.Course)
def create_course(
    course: schemas.CourseCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user_from_token)
):
    print(f"Creating course '{course.title}' for user {current_user.id}")
    new_course = models.Course(
        title=course.title,
        owner_id=current_user.id
    )
    db.add(new_course)
    try:
        db.commit()
        db.refresh(new_course)
        print(f"Course created successfully: ID {new_course.id}")
        return new_course
    except Exception as e:
        print(f"Error creating course: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[schemas.Course])
def list_courses(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user_from_token)
):
    return db.query(models.Course).filter(models.Course.owner_id == current_user.id).all()

@router.get("/{course_id}", response_model=schemas.Course)
def get_course(
    course_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user_from_token)
):
    course = db.query(models.Course).filter(
        models.Course.id == course_id, 
        models.Course.owner_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/{course_id}/documents", response_model=List[schemas.Document])
def list_course_documents(
    course_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user_from_token)
):
    # Verify course belongs to user
    course = db.query(models.Course).filter(
        models.Course.id == course_id, 
        models.Course.owner_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    return db.query(models.Document).filter(models.Document.course_id == course_id).all()
