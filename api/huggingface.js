export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Hugging Face API key not set." });
  }
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilgpt2",
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
    } catch (jsonErr) {
      return res.status(500).json({ error: "Failed to fetch from Hugging Face", details: text });
    }
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }
    res.status(200).json({ reply: data[0]?.generated_text || "" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Hugging Face", details: err.message });
  }
}
