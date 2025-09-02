export default async function handler(req, res) {
  console.log("[marketstack] Function called", req.query);
  const { symbol = "AAPL", limit = 5 } = req.query;
  const API_KEY = process.env.MARKETSTACK_API_KEY;
  if (!API_KEY) {
    console.error("[marketstack] API key missing");
    return res.status(500).json({ error: "Marketstack API key not set in environment variables." });
  }
  const url = `http://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${symbol}&limit=${limit}`;
  try {
    console.log("[marketstack] Fetching:", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("[marketstack] Response data:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("[marketstack] Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch from marketstack" });
  }
}
