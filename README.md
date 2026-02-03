# LearnSync AI

A bilingual (Arabic/English) AI-powered educational platform that helps students organize study materials and generate summaries, quizzes, and flashcards using Google's Gemini AI.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## Overview

LearnSync AI is designed to transform how students manage and interact with their study materials. The platform leverages advanced AI capabilities to extract text from various file formats (PDFs, images, audio, video), generate intelligent summaries, identify key concepts, and create interactive study tools.

### Problem Statement
Students often struggle with:
- Organizing study materials across multiple courses
- Extracting meaningful information from diverse file formats
- Creating effective study aids (quizzes, flashcards)
- Supporting both Arabic and English content

### Solution
LearnSync AI provides:
- Course-based organization system
- AI-powered content extraction and analysis
- Automated generation of summaries, quizzes, and flashcards
- Full bilingual support (Arabic/English) with RTL layout

## Key Features

### 1. Multi-Format Document Processing
- **PDF**: Text extraction with OCR fallback for scanned documents
- **Images**: OCR for handwritten and printed text
- **Audio/Video**: Automatic transcription
- Language detection (Arabic/English)

### 2. AI-Powered Analysis
- **Intelligent Summarization**: Concise summaries of document content
- **Concept Extraction**: Automatic identification of key terms and definitions
- **Quiz Generation**: Multiple-choice questions based on content
- **Flashcard Creation**: Key term flashcards for memorization

### 3. Course Management
- Organize materials by course
- Track upload dates and document metadata
- Course-specific document filtering

### 4. Bilingual Support
- Full Arabic and English interface
- RTL (Right-to-Left) layout for Arabic
- Language-aware AI processing

## Technical Architecture

```mermaid
graph TB
    subgraph "Frontend - React + TypeScript"
        A[User Interface]
        B[React Router]
        C[Axios HTTP Client]
        D[i18next Translation]
    end
    
    subgraph "Backend - FastAPI"
        E[API Routes]
        F[Authentication JWT]
        G[Database ORM]
        H[AI Services]
    end
    
    subgraph "Data Layer"
        I[(SQLite Database)]
        J[File Storage]
    end
    
    subgraph "External Services"
        K[Google Gemini AI]
    end
    
    A --> B
    B --> C
    C --> E
    D --> A
    E --> F
    E --> G
    E --> H
    G --> I
    H --> K
    E --> J
```

### System Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database
    participant Gemini AI
    
    User->>Frontend: Upload Document
    Frontend->>Backend: POST /documents/upload
    Backend->>Database: Store Metadata
    Backend->>Gemini AI: Extract Text
    Gemini AI-->>Backend: Extracted Content
    Backend->>Database: Save Extracted Text
    Backend-->>Frontend: Document ID
    
    User->>Frontend: Request Analysis
    Frontend->>Backend: POST /analysis/{doc_id}
    Backend->>Database: Fetch Document
    Backend->>Gemini AI: Analyze Content
    Gemini AI-->>Backend: Summary + Concepts
    Backend->>Database: Store Analysis
    Backend-->>Frontend: Analysis Results
    Frontend->>User: Display Results
```

### Database Schema

```mermaid
erDiagram
    USER ||--o{ COURSE : owns
    USER ||--o{ DOCUMENT : owns
    USER ||--o{ QUIZ : owns
    USER ||--o{ FLASHCARD_DECK : owns
    COURSE ||--o{ DOCUMENT : contains
    DOCUMENT ||--o{ QUIZ : generates
    DOCUMENT ||--o{ FLASHCARD_DECK : generates
    
    USER {
        int id PK
        string email UK
        string hashed_password
        datetime created_at
    }
    
    COURSE {
        int id PK
        string title
        datetime created_at
        int owner_id FK
    }
    
    DOCUMENT {
        int id PK
        string filename
        string file_path
        datetime upload_date
        string media_type
        text extracted_text
        string language
        text summary
        text key_concepts
        int owner_id FK
        int course_id FK
    }
    
    QUIZ {
        int id PK
        int document_id FK
        text questions
        datetime created_at
    }
    
    FLASHCARD_DECK {
        int id PK
        int document_id FK
        text cards
        datetime created_at
    }
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: i18next
- **Styling**: CSS3 (Custom design system)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **AI Integration**: Google Generative AI SDK
- **PDF Processing**: pypdf
- **Environment Management**: python-dotenv

### AI Services
- **Primary Model**: Google Gemini 2.0 Flash
- **Capabilities**: 
  - Text extraction (PDF, OCR)
  - Audio/Video transcription
  - Content summarization
  - Concept extraction
  - Quiz generation

## Prerequisites

Before installation, ensure you have:

- **Python**: Version 3.9 or higher
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Google Gemini API Key**: [Get one here](https://makersuite.google.com/app/apikey)
- **Git**: For cloning the repository

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/learnsync-ai.git
cd learnsync-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Initialize Database

```bash
# Still in backend directory with venv activated
python init_db.py
```

This creates the SQLite database with all required tables.

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Backend Server

```bash
# From backend directory with venv activated
python main.py
```

The backend API will start on `http://localhost:8000`

**API Documentation**: Visit `http://localhost:8000/docs` for interactive Swagger UI

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
learnsync-ai/
├── backend/
│   ├── routers/
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── courses.py        # Course management
│   │   ├── upload.py         # File upload handling
│   │   ├── analysis.py       # Document analysis
│   │   └── study_tools.py    # Quiz & flashcard generation
│   ├── services/
│   │   ├── ai_engine.py      # Gemini AI integration
│   │   ├── extraction.py     # Text extraction
│   │   ├── ocr.py           # Image OCR
│   │   └── transcription.py  # Audio/Video processing
│   ├── models.py             # Database models
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # Database configuration
│   ├── security.py           # JWT & password handling
│   ├── main.py              # FastAPI application
│   ├── .env.example         # Environment template
│   ├── .gitignore           # Git exclusions
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── ui/          # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── DocumentDetail.tsx
│   │   ├── i18n.ts          # Translation configuration
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /auth/token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepassword
```

### Course Endpoints

#### Create Course
```http
POST /courses/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Data Mining Course"
}
```

#### List Courses
```http
GET /courses/
Authorization: Bearer {token}
```

### Document Endpoints

#### Upload Document
```http
POST /documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]
course_id: 1
```

#### Analyze Document
```http
POST /analysis/{document_id}
Authorization: Bearer {token}
```

## Screenshots

> Note: Add your screenshots to a `docs/screenshots/` folder and reference them here

### Main Interface
![Course List](docs/screenshots/courses.png)
*Course organization dashboard*

### Document Upload
![Upload Interface](docs/screenshots/upload.png)
*Multi-format file upload with progress indication*

### Document Analysis
![Analysis Results](docs/screenshots/analysis.png)
*AI-generated summary and key concepts*

### Quiz Generation
![Quiz Interface](docs/screenshots/quiz.png)
*Interactive quiz based on document content*

### Flashcards
![Flashcard View](docs/screenshots/flashcards.png)
*Study flashcards with term/definition pairs*

### Arabic Interface
![Arabic UI](docs/screenshots/arabic.png)
*Full RTL support for Arabic language*

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for all frontend code
- Write descriptive commit messages
- Update documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for powerful language processing
- FastAPI for the modern Python web framework
- React team for the frontend framework

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is an educational project. Ensure compliance with your institution's academic integrity policies when using AI-generated study materials.