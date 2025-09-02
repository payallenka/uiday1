export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Hugging Face API key not set." });
  }
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid response from Hugging Face", details: text });
    }
    if (Array.isArray(data) && data[0]?.generated_text) {
      return res.status(200).json({ reply: data[0].generated_text });
    } else if (data.error) {
      return res.status(500).json({ error: data.error });
    } else {
      return res.status(500).json({ error: "Unexpected response from Hugging Face", details: data });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Hugging Face", details: err.message });
  }
}
