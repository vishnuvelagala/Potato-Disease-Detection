
from fastapi import APIRouter, HTTPException
import secrets
import hashlib
import os
from datetime import datetime
from models import UserSignup, UserLogin
from fastapi.responses import JSONResponse
from db_utils import get_db_connection

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(password, salt=None):
    """Hash password with salt"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Combine password and salt, then hash
    pwdhash = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        100000
    )
    
    return salt, pwdhash.hex()

@router.post("/signup")
async def signup(user_data: UserSignup):
    """Register a new user"""
    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if username already exists
        cursor.execute("SELECT * FROM users WHERE username = %s", (user_data.username,))
        if cursor.fetchone():
            conn.close()
            return JSONResponse(
                status_code=400,
                content={"message": "Username already exists"}
            )
        
        # Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_data.email,))
        if cursor.fetchone():
            conn.close()
            return JSONResponse(
                status_code=400,
                content={"message": "Email already exists"}
            )
        
        # Hash password with salt
        salt, hashed_password = hash_password(user_data.password)
        
        # Generate unique user ID
        user_id = secrets.token_hex(16)
        
        # Insert user into database
        cursor.execute(
            "INSERT INTO users (id, username, email, password_hash, salt, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
            (
                user_id,
                user_data.username,
                user_data.email,
                hashed_password,
                salt,
                datetime.now().isoformat()
            )
        )
        
        conn.commit()
        conn.close()
        
        return {"message": "User registered successfully", "user_id": user_id}
    
    except Exception as e:
        # Log the exception in a production environment
        print(f"Error in signup: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during registration: {str(e)}")

@router.post("/login")
async def login(user_data: UserLogin):
    """Login a user"""
    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch user by email
        cursor.execute("SELECT id, username, email, password_hash, salt FROM users WHERE email = %s", (user_data.email,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return JSONResponse(
                status_code=401,
                content={"message": "Invalid email or password"}
            )
        
        # Extract user data
        user_id, username, email = user['id'], user['username'], user['email']
        stored_hash, salt = user['password_hash'], user['salt']
        
        # Verify password
        _, calculated_hash = hash_password(user_data.password, salt)
        
        if calculated_hash != stored_hash:
            conn.close()
            return JSONResponse(
                status_code=401,
                content={"message": "Invalid email or password"}
            )
        
        # Successful login
        conn.close()
        
        return {
            "message": "Login successful",
            "user_id": user_id,
            "username": username,
            "email": email
        }
    
    except Exception as e:
        # Log the exception in a production environment
        print(f"Error in login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during login: {str(e)}")
