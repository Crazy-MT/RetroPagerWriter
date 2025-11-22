import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a real deployment, ensure process.env.API_KEY is set. 
// The user instruction implies we should assume it exists.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const rephraseToPagerSpeak = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning original text.");
    return text.toUpperCase();
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text into a 90s alphanumeric pager style message. 
      Rules:
      1. Use uppercase only.
      2. Keep it brief and punchy.
      3. Use common pager codes if applicable (e.g., 911 for urgent, 143 for I love you, 07734 for Hello).
      4. Do not explain the codes, just output the message.
      5. Maximum 60 characters.
      
      Input: "${text}"`,
    });

    return response.text?.trim() || text.toUpperCase();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text.toUpperCase(); // Fallback
  }
};