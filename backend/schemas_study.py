from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer_index: int

class QuizBase(BaseModel):
    title: str

class Quiz(QuizBase):
    id: int
    created_at: datetime
    questions: List[QuestionBase]
    document_id: int
    
    class Config:
        orm_mode = True

class FlashcardBase(BaseModel):
    term: str
    definition: str

class FlashcardDeckBase(BaseModel):
    title: str

class FlashcardDeck(FlashcardDeckBase):
    id: int
    created_at: datetime
    cards: List[FlashcardBase]
    document_id: int

    class Config:
        orm_mode = True
