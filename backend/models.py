
from pydantic import BaseModel
from typing import Optional, List

# User authentication models
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Feedback models
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
