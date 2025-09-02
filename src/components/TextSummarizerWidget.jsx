import { useState } from "react";

export default function TextSummarizerWidget() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async (e) => {
    e.preventDefault();
    setSummary("");
    setError("");
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/palm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Summarize the following text in a concise way:\n\n${input}` }),
      });
      const data = await res.json();
      if (data.reply) {
        setSummary(data.reply.trim());
      } else {
        setError("No summary returned.");
      }
    } catch (err) {
      setError("Failed to summarize text.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-lg mb-8 max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span role="img" aria-label="summarize">📝</span> Text Summarizer
      </h3>
      <form onSubmit={handleSummarize} className="flex flex-col gap-4">
        <textarea
          className="w-full min-h-[100px] bg-neutral-900 text-white rounded-lg p-3 outline-none border border-neutral-700 placeholder-white/60"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          disabled={loading}
        />
        <button
          type="submit"
          className="self-end px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>
      {summary && (
        <div className="mt-6 bg-neutral-900 border border-blue-700 rounded-lg p-4 text-white">
          <div className="font-semibold mb-2 text-blue-400">Summary:</div>
          <div>{summary}</div>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-400">{error}</div>
      )}
    </div>
  );
}
