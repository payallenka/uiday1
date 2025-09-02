export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is missing");
    return res.status(500).json({ error: "OpenAI API key not set in environment variables." });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 100,
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("OpenAI fetch error", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
}
