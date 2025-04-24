
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import uuid
from datetime import datetime
import json


# Import our new utility modules
from db_utils import get_db_connection
from detection_utils import detect_disease, image_to_base64

router = APIRouter(tags=["prediction"])

# Server URL from environment variable or default to Railway URL for production
SERVER_URL = os.environ.get("SERVER_URL", "http://localhost:8000")
print(f"Using SERVER_URL: {SERVER_URL}")

@router.post("/predict/")
async def predict(file: UploadFile = File(...), username: str = Form(...)):
    print(f"Received prediction request for user: {username}")
    
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    try:
        # Validate file type
        content_type = file.content_type
        if content_type not in ["image/png", "image/jpeg", "image/jpg"]:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {content_type}. Please upload a PNG or JPEG image.")
        
        # Save the uploaded file
        file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else ".jpg"
        file_id = str(uuid.uuid4())
        file_path = f"uploads/{file_id}{file_extension}"
        
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Read file content
        file_content = await file.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Write to file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        print(f"File saved to {file_path}")
        
        # Get detection results
        result = detect_disease(file_path)
        
        # Convert image to base64 for storage
        image_base64 = image_to_base64(file_path)
        if not image_base64:
            raise HTTPException(status_code=500, detail="Failed to process the image")
        
        # Create a full URL for the image that will work from the frontend
        image_url = f"{SERVER_URL}/uploads/{file_id}{file_extension}"
        print(f"Created image URL: {image_url}")
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO detection_history (id, username, image_path, image_base64, timestamp, detections) VALUES (%s, %s, %s, %s, %s, %s)",
            (
                file_id,
                username,
                file_path,
                image_base64,
                datetime.now().isoformat(),
                json.dumps(result['detections'])
            )
        )
        conn.commit()
        conn.close()
        
        # Return results with absolute image URL
        response_data = {
            "id": file_id,
            "image_url": image_url,
            "detections": result['detections']
        }
        
        print(f"Returning response data: {response_data}")
        return response_data
    
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
