"use client";
import { useState, useRef, useEffect } from "react";
import { XIcon, SendHorizonalIcon, UserIcon, BotIcon } from "lucide-react";

export default function AIChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "This is a simulated AI response to: " + userMsg.content },
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[370px] max-w-[95vw] bg-black/90 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-black/80">
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <BotIcon className="w-5 h-5 text-cyan-400" />
          AI Chat
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-black/80" style={{ minHeight: 320, maxHeight: 420 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${msg.role === "user" ? "bg-cyan-600 text-white rounded-br-md" : "bg-gray-800 text-gray-100 rounded-bl-md flex items-center gap-2"}`}>
              {msg.role === "assistant" && <BotIcon className="w-4 h-4 text-cyan-400 mr-1" />} {msg.content}
              {msg.role === "user" && <UserIcon className="w-4 h-4 text-white ml-2" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-gray-800 text-gray-100 text-sm animate-pulse flex items-center gap-2">
              <BotIcon className="w-4 h-4 text-cyan-400 mr-1" /> Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Input */}
      <form
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-black/80"
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
      >
        <textarea
          className="flex-1 resize-none bg-gray-900 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{ minHeight: 36, maxHeight: 80 }}
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-60"
          disabled={loading || !input.trim()}
        >
          <SendHorizonalIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
