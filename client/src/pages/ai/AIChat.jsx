import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! Main aapka Campus AI assistant hoon. Main events, venues aur scheduling query solve kar sakta hoon. Poochhiye!'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        {
          message: currentInput
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.reply
        }
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '❌ Kuch error aaya, dobara try karo.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h2 className="font-bold text-sm">
              Campus Core Intelligence Engine
            </h2>
            <p className="text-[10px] text-cyan-400 font-mono">
              LLM v2.5-Live • Online
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-400 font-mono">
          Token Free
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs font-medium font-mono animate-pulse">
              ⚡ Campus-AI thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything (e.g., Which venues are free today?)..."
          className="flex-1 px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition"
        >
          🚀 Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;