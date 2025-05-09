import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Google Gemini
const apiKey = "AIzaSyAXNYWlFkn04qx2p3rNgUuVY7opsz1Xq3U";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Create a default model instance (Gemini 2.0 Flash)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("Google Gemini 2.0 Flash model initialized with API key");

export default { model }; 