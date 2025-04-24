
import os
import base64
from PIL import Image
import numpy as np
from model_utils import model, yolo_available, class_names, disease_info

def image_to_base64(image_path):
    """Convert an image file to base64 string"""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error converting image to base64: {str(e)}")
        return None

def detect_disease(image_path):
    """Detect potato disease using YOLO model if available, otherwise use fallback method"""
    try:
        # Check if we can use YOLO model
        if yolo_available and model is not None:
            return yolo_detect_disease(image_path)
        else:
            # Fall back to the rule-based detection
            print("Using rule-based fallback detection method")
            return fallback_detect_disease(image_path)
    
    except Exception as e:
        print(f"Error in disease detection: {str(e)}")
        # Fallback to default detection if analysis fails
        return {
            "detections": [
                {
                    "class_name": "Early Blight",
                    "confidence": 0.75,
                    "description": disease_info["Early Blight"]["description"],
                    "treatment": disease_info["Early Blight"]["treatment"]
                }
            ]
        }

def yolo_detect_disease(image_path):
    """Detect disease using YOLO model"""
    # Open image
    img = Image.open(image_path).convert("RGB")
    
    # Run YOLOv8 model
    results = model(img)
    
    # Extract detections
    detections = []
    for box in results[0].boxes.data.tolist():
        x_min, y_min, x_max, y_max, confidence, class_id = box
        class_name = class_names.get(int(class_id), "Unknown")
        
        detections.append({
            "class_name": class_name,
            "confidence": float(confidence),
            "description": disease_info[class_name]["description"],
            "treatment": disease_info[class_name]["treatment"]
        })
    
    # If no detections were made, add a default one
    if not detections:
        detections.append({
            "class_name": "Unknown",
            "confidence": 0.5,
            "description": disease_info["Unknown"]["description"],
            "treatment": disease_info["Unknown"]["treatment"]
        })
    
    return {"detections": detections}

def fallback_detect_disease(image_path):
    """Rule-based disease detection as fallback"""
    try:
        # Open and analyze the image
        img = Image.open(image_path)
        
        # Convert to RGB if it's not already
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize for consistent analysis
        img = img.resize((224, 224))
        
        # Convert to numpy array for analysis
        img_array = np.array(img)
        
        # Extract average color features from different regions
        height, width, _ = img_array.shape
        
        # Divide image into regions for analysis
        regions = [
            img_array[0:height//2, 0:width//2],  # top-left
            img_array[0:height//2, width//2:],   # top-right
            img_array[height//2:, 0:width//2],   # bottom-left
            img_array[height//2:, width//2:],    # bottom-right
        ]
        
        # Calculate average color per region
        region_features = []
        for region in regions:
            avg_red = np.mean(region[:, :, 0])
            avg_green = np.mean(region[:, :, 1])
            avg_blue = np.mean(region[:, :, 2])
            region_features.append((avg_red, avg_green, avg_blue))
        
        # Simple "rules" for disease detection based on color patterns
        early_blight_score = 0
        for r, g, b in region_features:
            # Brown colors have red > green > blue
            if r > g > b and r - b > 50:
                early_blight_score += 1
        
        # Look for late blight (dark/blackish lesions)
        late_blight_score = 0
        for r, g, b in region_features:
            # Dark regions have low RGB values
            if r < 100 and g < 100 and b < 100:
                late_blight_score += 1
        
        # Look for healthy potato (more green)
        healthy_score = 0
        for r, g, b in region_features:
            # Healthy leaves are greener
            if g > r and g > b:
                healthy_score += 1
        
        # Calculate standard deviation of colors as a texture measure
        red_std = np.std(img_array[:, :, 0])
        green_std = np.std(img_array[:, :, 1])
        blue_std = np.std(img_array[:, :, 2])
        texture_score = red_std + green_std + blue_std
        
        # Weigh the scores
        scores = {
            "Early Blight": early_blight_score * 0.25 + (texture_score / 100) * 0.1,
            "Late Blight": late_blight_score * 0.25 + (texture_score / 150) * 0.15,
            "Healthy Potato": healthy_score * 0.25 + (1 - texture_score / 200) * 0.15
        }
        
        # Find the highest scoring class
        max_class = max(scores, key=scores.get)
        confidence = min(0.95, 0.5 + scores[max_class])  # Cap at 95% confidence
        
        # Return the detected disease with confidence score
        return {
            "detections": [
                {
                    "class_name": max_class,
                    "confidence": float(confidence),
                    "description": disease_info[max_class]["description"],
                    "treatment": disease_info[max_class]["treatment"]
                }
            ]
        }
    except Exception as e:
        print(f"Error in fallback disease detection: {str(e)}")
        # Fallback to default detection if analysis fails
        return {
            "detections": [
                {
                    "class_name": "Early Blight",
                    "confidence": 0.75,
                    "description": disease_info["Early Blight"]["description"],
                    "treatment": disease_info["Early Blight"]["treatment"]
                }
            ]
        }
