
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.parse
import json
from  dotenv import load_dotenv

load_dotenv()

# PostgreSQL connection parameters
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "potato_detection")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

# For Railway PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    print(f"Using DATABASE_URL from environment: {DATABASE_URL[:10]}...")
    try:
        # Parse the DATABASE_URL (format: postgres://username:password@host:port/database)
        parsed_url = urllib.parse.urlparse(DATABASE_URL)
        
        DB_USER = parsed_url.username
        DB_PASSWORD = parsed_url.password
        DB_HOST = parsed_url.hostname
        DB_PORT = parsed_url.port
        DB_NAME = parsed_url.path[1:]  # Remove leading slash
        
        print(f"Successfully parsed DATABASE_URL. Using host: {DB_HOST}, port: {DB_PORT}, dbname: {DB_NAME}")
    except Exception as e:
        print(f"Error parsing DATABASE_URL: {str(e)}")

# File-based storage fallback for development and testing environments
FALLBACK_DATA_DIR = "data"
os.makedirs(FALLBACK_DATA_DIR, exist_ok=True)

# ML model configuration
MODEL_FILE_PATH = os.getenv("MODEL_PATH", "best.pt")
print(f"Looking for model file at: {os.path.abspath(MODEL_FILE_PATH)}")
if os.path.exists(MODEL_FILE_PATH):
    print(f"Model file found at {MODEL_FILE_PATH}")
else:
    print(f"WARNING: Model file not found at {MODEL_FILE_PATH}! Using fallback detection method.")

def get_db_connection():
    """Create and return a database connection with RealDictCursor"""
    try:
        # Debug connection parameters (don't log password in production)
        print(f"Connecting to PostgreSQL at {DB_HOST}:{DB_PORT}/{DB_NAME} with user {DB_USER}")
        
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            cursor_factory=RealDictCursor
        )
        print("Database connection successful")
        return conn
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        # Instead of raising the error, we'll return None to indicate failure
        return None

# File-based data operations for fallback
def read_json_file(file_name):
    file_path = os.path.join(FALLBACK_DATA_DIR, f"{file_name}.json")
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                return json.load(file)
        return []
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return []

def write_json_file(file_name, data):
    file_path = os.path.join(FALLBACK_DATA_DIR, f"{file_name}.json")
    try:
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=2)
        return True
    except Exception as e:
        print(f"Error writing to {file_path}: {str(e)}")
        return False
