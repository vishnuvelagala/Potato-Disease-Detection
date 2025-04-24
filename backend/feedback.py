
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
import random
from db_utils import get_db_connection, read_json_file, write_json_file

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"],
)

class FeedbackCreate(BaseModel):
    username: str
    rating: int
    comment: str

class FeedbackResponse(BaseModel):
    id: str
    username: str
    rating: int
    comment: str
    timestamp: str

@router.post("", response_model=FeedbackResponse)
async def create_feedback(feedback: FeedbackCreate):
    # Validate the rating
    if feedback.rating < 1 or feedback.rating > 5:
        raise HTTPException(
            status_code=400, 
            detail="Rating must be between 1 and 5"
        )
    
    try:
        # Create feedback with a unique ID
        feedback_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        # Try database connection first
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS feedback (
                        id TEXT PRIMARY KEY,
                        username TEXT NOT NULL,
                        rating INTEGER NOT NULL,
                        comment TEXT NOT NULL,
                        timestamp TEXT NOT NULL
                    )
                ''')
                
                cursor.execute('''
                    INSERT INTO feedback (id, username, rating, comment, timestamp)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (feedback_id, feedback.username, feedback.rating, feedback.comment, timestamp))
                
                conn.commit()
                conn.close()
            except Exception as e:
                print(f"Database operation error: {str(e)}")
                conn.close()
                raise
        else:
            # Fallback to file storage
            print("Using file storage fallback for feedback")
            feedback_data = read_json_file("feedback")
            
            new_feedback = {
                "id": feedback_id,
                "username": feedback.username,
                "rating": feedback.rating,
                "comment": feedback.comment,
                "timestamp": timestamp
            }
            
            feedback_data.append(new_feedback)
            write_json_file("feedback", feedback_data)
        
        return FeedbackResponse(
            id=feedback_id,
            username=feedback.username,
            rating=feedback.rating,
            comment=feedback.comment,
            timestamp=timestamp
        )
    except Exception as e:
        print(f"Error creating feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit feedback: {str(e)}"
        )

@router.get("", response_model=List[FeedbackResponse])
async def get_all_feedback():
    try:
        # Try database connection first
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS feedback (
                        id TEXT PRIMARY KEY,
                        username TEXT NOT NULL,
                        rating INTEGER NOT NULL,
                        comment TEXT NOT NULL,
                        timestamp TEXT NOT NULL
                    )
                ''')
                
                cursor.execute('SELECT * FROM feedback ORDER BY timestamp DESC')
                feedback_items = cursor.fetchall()
                conn.close()
                
                return [
                    FeedbackResponse(
                        id=item['id'],
                        username=item['username'],
                        rating=item['rating'],
                        comment=item['comment'],
                        timestamp=item['timestamp']
                    ) for item in feedback_items
                ]
            except Exception as e:
                print(f"Database operation error: {str(e)}")
                conn.close()
                raise
        else:
            # Fallback to file storage
            print("Using file storage fallback for feedback")
            feedback_data = read_json_file("feedback")
            
            # Sort by timestamp in descending order
            feedback_data.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            
            return [
                FeedbackResponse(
                    id=item.get("id", str(uuid.uuid4())),
                    username=item.get("username", "Anonymous"),
                    rating=item.get("rating", 5),
                    comment=item.get("comment", ""),
                    timestamp=item.get("timestamp", datetime.now().isoformat())
                ) for item in feedback_data
            ]
    except Exception as e:
        print(f"Error getting all feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve feedback: {str(e)}"
        )

@router.get("/random", response_model=List[FeedbackResponse])
async def get_random_feedback(limit: Optional[int] = 3):
    try:
        # Try database connection first
        conn = get_db_connection()
        feedback_list = []
        
        if conn:
            try:
                cursor = conn.cursor()
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS feedback (
                        id TEXT PRIMARY KEY,
                        username TEXT NOT NULL,
                        rating INTEGER NOT NULL,
                        comment TEXT NOT NULL,
                        timestamp TEXT NOT NULL
                    )
                ''')
                
                # Get total count of feedback
                cursor.execute('SELECT COUNT(*) as count FROM feedback')
                total = cursor.fetchone()['count']
                
                # If no feedback, return empty list
                if total == 0:
                    conn.close()
                    return []
                
                # Get all feedback
                cursor.execute('SELECT * FROM feedback WHERE rating >= 4')
                high_rated = cursor.fetchall()
                
                # If no high-rated feedback, get all feedback
                if not high_rated:
                    cursor.execute('SELECT * FROM feedback')
                    high_rated = cursor.fetchall()
                
                # Convert to list to use random.sample
                feedback_list = list(high_rated)
                conn.close()
            except Exception as e:
                print(f"Database operation error: {str(e)}")
                if conn:
                    conn.close()
        else:
            # Fallback to file storage
            print("Using file storage fallback for random feedback")
            all_feedback = read_json_file("feedback")
            
            # Filter for high ratings
            high_rated = [f for f in all_feedback if f.get("rating", 0) >= 4]
            
            # If no high-rated feedback, use all feedback
            feedback_list = high_rated if high_rated else all_feedback
        
        # Get random samples (up to limit)
        limit = min(limit, len(feedback_list))
        random_feedback = random.sample(feedback_list, limit) if feedback_list else []
        
        return [
            FeedbackResponse(
                id=item.get("id", str(uuid.uuid4())) if isinstance(item, dict) else item['id'],
                username=item.get("username", "Anonymous") if isinstance(item, dict) else item['username'],
                rating=item.get("rating", 5) if isinstance(item, dict) else item['rating'],
                comment=item.get("comment", "") if isinstance(item, dict) else item['comment'],
                timestamp=item.get("timestamp", datetime.now().isoformat()) if isinstance(item, dict) else item['timestamp']
            ) for item in random_feedback
        ]
    except Exception as e:
        print(f"Error getting random feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve random feedback: {str(e)}"
        )
