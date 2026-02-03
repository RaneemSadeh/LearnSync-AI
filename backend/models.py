from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, Text, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
import database

class Language(str, enum.Enum):
    AR = "ar"
    EN = "en"

class User(database.Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    preferred_language = Column(String, default="ar")

    # Relationships
    documents = relationship("Document", back_populates="owner")
    courses = relationship("Course", back_populates="owner")

class Course(database.Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    owner = relationship("User", back_populates="courses")
    documents = relationship("Document", back_populates="course")

class Document(database.Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    media_type = Column(String, default="pdf", index=True) # pdf, audio, video, image
    extracted_text = Column(Text, nullable=True)
    language = Column(String, default="en") # Detected language
    summary = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True) # Stored as JSON string potentially
    
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    owner = relationship("User", back_populates="documents")

    course_id = Column(Integer, ForeignKey("courses.id"), index=True, nullable=True)
    course = relationship("Course", back_populates="documents")
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="document")
    flashcard_decks = relationship("FlashcardDeck", back_populates="document")

class Quiz(database.Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String)
    questions = Column(Text) # JSON string of questions
    
    document = relationship("Document", back_populates="quizzes")

class FlashcardDeck(database.Base):
    __tablename__ = "flashcard_decks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String)
    cards = Column(Text) # JSON string of cards
    
    document = relationship("Document", back_populates="flashcard_decks")
