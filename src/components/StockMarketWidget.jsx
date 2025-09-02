import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";

const DEFAULT_SYMBOL = "AAPL";

const StockMarketWidget = ({ symbol = DEFAULT_SYMBOL, userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStock() {
      setLoading(true);
      setError("");
      let cacheOk = false;
      // Debug: log userId
      console.log("StockMarketWidget userId:", userId);
      // Try to load from Supabase cache first
      if (userId) {
        const { data: cache, error: cacheError } = await supabase
          .from("stock_cache")
          .select("data, fetched_at")
          .eq("symbol", symbol)
          .eq("user_id", userId)
          .single();
        if (cache && cache.data && cache.fetched_at) {
          // If cache is less than 1 hour old, use it
          const cacheTime = new Date(cache.fetched_at);
          if (Date.now() - cacheTime.getTime() < 60 * 60 * 1000) {
            setData(cache.data);
            setLoading(false);
            cacheOk = true;
            console.log("Loaded stock data from cache", cache);
          }
        }
      }
      if (!cacheOk) {
        try {
          const res = await fetch(
            `/api/marketstack?symbol=${symbol}&limit=5`
          );
          const json = await res.json();
          if (json.data) {
            setData(json.data);
            // Store in Supabase
            if (userId) {
              const upsertResult = await supabase.from("stock_cache").upsert({
                symbol,
                user_id: userId,
                data: json.data,
                fetched_at: new Date().toISOString(),
              });
              console.log("Supabase upsert result:", upsertResult);
            }
          } else {
            setError("No data found");
          }
        } catch (err) {
          setError("Failed to fetch stock data");
        }
        setLoading(false);
      }
    }
    fetchStock();
  }, [symbol, userId]);

  return (
    <div className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span role="img" aria-label="stock"></span> Stock Market ({symbol})
      </h3>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-white/80 text-lg font-semibold">Loading stock data...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="h-8 w-8 text-red-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75" />
          </svg>
          <span className="text-red-400 text-lg font-semibold">{error}</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.date} className="bg-neutral-900/80 border border-neutral-700 rounded-lg px-4 py-2 text-white/90 text-sm flex flex-col min-h-[48px]">
              <span className="text-black font-semibold">{new Date(item.date).toLocaleDateString()}</span>
              <span className="text-xs text-white/50 mt-1">Close: <span className="text-black font-bold">${item.close}</span></span>
              <span className="text-xs text-white/50">Open: <span className="text-black">${item.open}</span> | High: <span className="text-black">${item.high}</span> | Low: <span className="text-black">${item.low}</span></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockMarketWidget;
