from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import models

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    preferred_language: str = "ar"  # Default to Arabic

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CourseBase(BaseModel):
    title: str

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    course_id: Optional[int] = None

class Document(DocumentBase):
    id: int
    upload_date: datetime
    media_type: str = "pdf"
    extracted_text: Optional[str] = None
    language: str
    owner_id: int
    course_id: Optional[int] = None

    class Config:
        from_attributes = True

