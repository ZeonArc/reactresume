import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Google Gemini
const apiKey = "AIzaSyAXNYWlFkn04qx2p3rNgUuVY7opsz1Xq3U";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Create a default model instance (Gemini Pro)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

console.log("Google Gemini client initialized with API key");

export default { model }; 