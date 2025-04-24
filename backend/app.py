
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from fastapi.staticfiles import StaticFiles
from db_utils import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# Import routers
from auth import router as auth_router
from prediction import router as prediction_router
from history import router as history_router
from feedback import router as feedback_router
from chat import router as chat_router  # Import the chat router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the uploads directory exists
os.makedirs("uploads", exist_ok=True)

# Initialize PostgresSQL database
def init_db():
    try:
        print(f"Initializing database at {DB_HOST}:{DB_PORT}/{DB_NAME} with user {DB_USER}")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        
        # Create detection_history table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS detection_history (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            image_path TEXT NOT NULL,
            image_base64 TEXT,
            timestamp TEXT NOT NULL,
            detections TEXT NOT NULL
        )
        ''')
        
        # Create users table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        ''')
        
        # Create feedback table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
        ''')
        
        conn.commit()
        conn.close()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        # Don't fail app startup if DB init fails - Railway might provision DB after app starts
        # We'll handle connection errors in the endpoint handlers

# Initialize database on startup
init_db()

# Mount the uploads directory for serving images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(history_router)
app.include_router(feedback_router)
app.include_router(chat_router)  # Include the chat router

@app.get("/health")
async def health_check():
    return {"status": "ok"}
