from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import routers
from routers import auth, upload, analysis, study_tools, courses
# Import models to register them with SQLAlchemy
import models
import database

# Create tables (checkfirst=True prevents errors if tables exist)
database.Base.metadata.create_all(bind=database.engine, checkfirst=True)

app = FastAPI(title="LearnSync AI", version="1.0.0")

# Configure CORS FIRST (before routes)
# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Include routers AFTER CORS
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(upload.router)
app.include_router(analysis.router)
app.include_router(study_tools.router)

@app.get("/")
async def root():
    return {"message": "LearnSync AI Backend is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
