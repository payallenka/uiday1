import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.PALM_API_KEY; // Set this in Vercel as PALM_API_KEY

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

export default async function handler(req, res) {
  const { messages } = req.body;
  if (!API_KEY) {
    return res.status(500).json({ error: "PaLM API key not set." });
  }
  try {
    const result = await client.generateMessage({
      model: MODEL_NAME,
      prompt: { messages },
    });
    const reply = result[0]?.candidates?.[0]?.content || "No response from PaLM.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from PaLM", details: err.message });
  }
}
