// config/gemini.js
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY chưa được set trong .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // đọc từ .env
});

module.exports = ai;
