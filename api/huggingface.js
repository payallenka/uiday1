import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req, res) {
  const { prompt } = req.body;
  if (!process.env.HUGGINGFACE_API_KEY) {
    return res.status(500).json({ error: "Hugging Face API key not set." });
  }
  try {
    const result = await hf.textGeneration({
      model: "facebook/blenderbot-400M-distill",
      inputs: prompt,
      parameters: { max_new_tokens: 50 }
    });
    if (result.generated_text) {
      return res.status(200).json({ reply: result.generated_text });
    } else {
      return res.status(500).json({ error: "No response from model. It may not be available for free inference." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Hugging Face", details: err.message });
  }
}
