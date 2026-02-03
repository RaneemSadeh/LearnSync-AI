import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
from models import User, Document, Quiz, FlashcardDeck

# Create all tables
Base.metadata.create_all(bind=engine)

print("✅ Database initialized successfully!")
print("📊 Tables created: users, documents, quizzes, flashcard_decks")
