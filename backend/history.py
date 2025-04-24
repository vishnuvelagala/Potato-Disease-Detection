
from fastapi import APIRouter, HTTPException
import json
import os
from db_utils import get_db_connection

router = APIRouter(tags=["history"])

@router.get("/history/{username}")
async def get_history(username: str):
    """Get detection history for a user"""
    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch history for the user
        cursor.execute(
            "SELECT id, image_path, image_base64, timestamp, detections FROM detection_history WHERE username = %s ORDER BY timestamp DESC",
            (username,)
        )
        
        rows = cursor.fetchall()
        conn.close()
        
        # Format the results
        history = []
        for row in rows:
            # Extract just the filename from the image_path
            filename = row['image_path'].split('/')[-1] if row['image_path'] else ""
            
            # Get the server URL from environment or use Railway URL for production
            server_url = os.environ.get("SERVER_URL", "http://localhost:8000")
            
            history.append({
                "id": row['id'],
                "image_url": f"{server_url}/uploads/{filename}",
                "image_base64": row['image_base64'],
                "timestamp": row['timestamp'],
                "detections": json.loads(row['detections']) if row['detections'] else []
            })
        
        return {"history": history}
    
    except Exception as e:
        # Log the exception in a production environment
        print(f"Error retrieving history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
