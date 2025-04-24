
import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment variable for production deployment
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
