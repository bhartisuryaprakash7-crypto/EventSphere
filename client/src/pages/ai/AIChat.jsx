import { useState, useRef, useEffect } from "react";
import { sendChatMessage, clearChatSession } from "../../services/aiService";

// Quick suggestion chips shown at start
const SUGGESTIONS = [
  "How do I register for an event?",
  "Where can I find my certificates?",
  "Show me upcoming tech events",
  "How does attendance work?",
  "What is EventSphere?",
];

// Format AI reply: bold **text** and line breaks
const formatReply = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
};

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "👋 Hi! I'm your **EventSphere Assistant**.\n\nI can help you discover events, understand registrations, find your certificates, and navigate the platform. What would you like to know?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    // Add user message immediately
    const userMsg = { id: Date.now(), role: "user", text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(userText, sessionId);
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: data.reply,
        time: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    await clearChatSession(sessionId);
    setMessages([
      {
        id: Date.now(),
        role: "ai",
        text: "👋 Chat cleared! How can I help you today?",
        time: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-screen bg-[#080E1A]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#112240] bg-[#0D1B33]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-xl">
              🤖
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0D1B33]" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-none">EventSphere AI</h1>
            <p className="text-green-400 text-xs mt-0.5">Online</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all"
        >
          🗑 Clear Chat
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold
                ${msg.role === "ai"
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                }`}
            >
              {msg.role === "ai" ? "AI" : "You"}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "ai"
                    ? msg.isError
                      ? "bg-red-900/30 border border-red-500/30 text-red-300"
                      : "bg-[#112240] border border-[#162C52] text-slate-200"
                    : "bg-cyan-600 text-white"
                  }`}
                dangerouslySetInnerHTML={{ __html: formatReply(msg.text) }}
              />
              <span className="text-xs text-slate-600 px-1">{formatTime(msg.time)}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-sm font-bold text-cyan-300">
              AI
            </div>
            <div className="bg-[#112240] border border-[#162C52] px-4 py-3 rounded-2xl flex items-center gap-1.5">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Suggestion chips (only at start) */}
        {messages.length === 1 && !loading && (
          <div className="pt-2">
            <p className="text-slate-500 text-xs mb-3 text-center">✨ Try asking...</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-[#112240] hover:bg-[#162C52] border border-[#162C52] hover:border-cyan-500/50 text-slate-300 hover:text-white px-3 py-2 rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 py-4 border-t border-[#112240] bg-[#0D1B33]">
        <div className="flex items-end gap-3 bg-[#112240] border border-[#162C52] rounded-2xl px-4 py-3 focus-within:border-cyan-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about events..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none outline-none max-h-32 scrollbar-thin"
            style={{ lineHeight: "1.5" }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all flex-shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2">
          Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">Enter</kbd> to send · <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}