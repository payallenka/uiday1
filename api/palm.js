import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // Set this in Vercel
});

export default async function handler(req, res) {
  const { prompt } = req.body;
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Google API key not set." });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });
    res.status(200).json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Gemini", details: err.message });
  }
}
