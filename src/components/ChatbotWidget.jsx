import { useState, useRef } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      // Send prompt as expected by Gemini API
      const res = await fetch("/api/palm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      const reply = data.reply?.trim() || "Sorry, I couldn't get a response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't get a response from the server." }]);
    }
    setLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-neutral-800 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg border border-neutral-700"
          onClick={() => setOpen(true)}
          aria-label="Open Chatbot"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}
      {/* Chatbot Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-neutral-900 text-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-neutral-700">
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="font-semibold text-white">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white text-xl hover:text-red-400">&times;</button>
          </div>
          <div className="flex-1 px-4 py-2 overflow-y-auto max-h-96" style={{ minHeight: 200 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-neutral-800 text-white border border-neutral-700"}`}>
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex border-t border-neutral-700 bg-neutral-800">
            <input
              className="flex-1 px-3 py-2 bg-neutral-900 text-white outline-none placeholder-white/60"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-r-xl"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
