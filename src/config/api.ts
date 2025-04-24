
/**
 * API configuration
 * Centralizes API URLs for easier maintenance
 */

// Backend API URL - automatically detect whether we're running locally or on a deployment
const isProduction = window.location.hostname !== "localhost";
export const API_URL = isProduction 
  ? "https://first-production-33e6.up.railway.app" // Railway production URL
  : "http://localhost:8000"; // Local development

console.log("API URL being used:", API_URL);
