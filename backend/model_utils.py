
import os


# Model file path
MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")

# Try to import YOLO model
try:
    from ultralytics import YOLO
    yolo_available = True
except ImportError:
    print("Warning: Ultralytics YOLO not available. Using fallback detection method.")
    yolo_available = False

# Initialize YOLO model if available
model = None
if yolo_available:
    try:
        # Try to load the model
        if os.path.exists(MODEL_PATH):
            model = YOLO(MODEL_PATH)
            print(f"Successfully loaded YOLOv8 model from {MODEL_PATH}")
        else:
            print(f"Warning: Model file {MODEL_PATH} not found. Using fallback detection method.")
            print(f"Current working directory: {os.getcwd()}")
            print(f"Absolute path to model: {os.path.abspath(MODEL_PATH)}")
            print(f"Files in current directory: {os.listdir('.')}")
            print(f"Files in backend directory (if exists): {os.listdir('./backend') if os.path.exists('./backend') else 'backend dir not found'}")
    except Exception as e:
        print(f"Error loading YOLO model: {str(e)}. Using fallback detection method.")

# Define class names for YOLO model
class_names = {
    0: "Black spot Bruising Disease",
    1: "Early Blight Disease",
    2: "Healthy",
    3: "Late Blight Disease",
    4: "Potato Brown Rot Disease",
    5: "Potato Dry Rot Disease",
    6: "Potato Soft Rot Disease",
}

# Disease info for both YOLO and fallback methods
disease_info = {
    "Black spot Bruising Disease": {
        "description": "Blackspot bruising appears as dark patches beneath the skin, caused by physical damage during handling.",
        "treatment": "Improve handling procedures, maintain proper storage temperatures, and ensure careful harvesting to minimize bruising."
    },
    "Healthy": {
        "description": "The potato appears healthy with no visible signs of disease.",
        "treatment": "Continue regular maintenance. Monitor for early signs of disease. Maintain good growing conditions with proper watering and fertilization."
    },
    "Potato Brown Rot Disease": {
        "description": "Brown rot is a bacterial disease causing wilting, yellowing of leaves, and rotting of tubers with a characteristic brown discoloration.",
        "treatment": "Remove infected plants, practice crop rotation, use certified disease-free seed potatoes, and improve drainage in fields."
    },
    "Potato Dry Rot Disease": {
        "description": "Dry rot causes sunken, wrinkled areas on tubers with internal cavities lined with white, yellow, or pink fungal growth.",
        "treatment": "Store potatoes in cool, dry conditions, avoid wounding during harvest, and treat seed potatoes with fungicide before planting."
    },
    "Potato Soft Rot Disease": {
        "description": "Soft rot is a bacterial disease causing wet, mushy decay of tubers with a foul odor.",
        "treatment": "Harvest during dry conditions, avoid bruising, ensure proper ventilation during storage, and remove infected tubers promptly."
    },
    "Early Blight Disease": {
        "description": "Early blight is a fungal disease that affects potato plants, characterized by brown spots with concentric rings on leaves.",
        "treatment": "Apply fungicide, ensure proper plant spacing, and practice crop rotation."
    },
    "Late Blight Disease": {
        "description": "Late blight is caused by the water mold Phytophthora infestans. It causes dark, water-soaked lesions on leaves and stems that quickly enlarge and turn brown.",
        "treatment": "Apply fungicides containing copper or chlorothalonil at the first sign of disease. Remove infected plants. Avoid overhead irrigation."
    },
    "Unknown": {
        "description": "The disease could not be identified with confidence.",
        "treatment": "Consult with an agricultural expert for proper diagnosis and treatment recommendations."
    }
}
