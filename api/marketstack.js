export default async function handler(req, res) {
  const { symbol = "AAPL", limit = 5 } = req.query;
  const API_KEY = "38efae7d7d00332d9a1d391f4a9b72a7";
  const url = `http://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${symbol}&limit=${limit}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from marketstack" });
  }
}
