
# Potato Disease Detection Backend

This is a FastAPI backend for the Potato Disease Detection application.

## Setup

1. Make sure you have Python 3.7+ installed

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Start the server:
   ```
   uvicorn app:app --reload --port 8000
   ```

The server will be running at http://localhost:8000

## API Endpoints

- `POST /predict/` - Upload an image for disease detection
- `GET /history/{username}` - Get detection history for a user
- `GET /health` - Health check endpoint
