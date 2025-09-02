// Simple in-memory rate limiter (per-IP, 1 request per 10 seconds)
const rateLimitMap = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < 10000) { // 10 seconds
    return res.status(429).json({ error: "Too many requests. Please wait a few seconds before trying again." });
  }
  rateLimitMap.set(ip, now);

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
    console.log("OpenAI API response:", JSON.stringify(data));
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "OpenAI API error", full: data });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("OpenAI fetch error", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI", details: err.message });
  }
}
