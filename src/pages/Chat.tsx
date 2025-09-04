import { FormEvent, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { PREDEFINED_QUESTIONS } from "@/services/chatbotService";

export default function Chat() {
  const { chat, chatSending, sendChat } = useAppStore();
  const [msg, setMsg] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle initial message from ChatBot homepage
  useEffect(() => {
    if (location.state?.initialMessage) {
      sendChat(location.state.initialMessage);
      // Clear the state to prevent re-sending on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state, sendChat]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!msg.trim() || isProcessing || chatSending) return;

    setIsProcessing(true);
    try {
      await sendChat(msg.trim());
      setMsg("");
    } finally {
      setIsProcessing(false);
      // scroll to bottom
      setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 10);
    }
  }

  const handlePredefinedQuestion = async (question: string) => {
    if (isProcessing || chatSending) return;

    setIsProcessing(true);
    try {
      await sendChat(question);
    } finally {
      setIsProcessing(false);
      setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 10);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">MyAI Assistant</h2>
            <p className="text-sm text-blue-600">Your personal finance chatbot</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={listRef} className="flex-1 overflow-auto bg-slate-50 p-4 space-y-4">
        {chat.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              AI
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Welcome to MyAI!</h3>
            <p className="text-blue-600 text-sm max-w-md mx-auto">
              I'm here to help you with your finances. Ask me about budgeting, expenses, savings, or
              any financial questions you have!
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 max-w-lg mx-auto">
              {PREDEFINED_QUESTIONS.slice(0, 6).map((question, index) => {
                const icons = ["💰", "📊", "🏪", "🏦", "💳", "💡"];
                return (
                  <button
                    key={index}
                    onClick={() => handlePredefinedQuestion(question)}
                    disabled={isProcessing || chatSending}
                    className="bg-white hover:bg-blue-50 border border-slate-200 rounded-lg p-3 text-left text-sm text-slate-700 transition-colors hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {icons[index]} {question}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {chat.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                m.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-sm">
                {m.from === "ai" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      AI
                    </div>
                    <span className="text-xs text-blue-600 font-medium">MyAI Assistant</span>
                  </div>
                )}
                <p className={m.from === "user" ? "text-white" : "text-slate-800"}>{m.text}</p>
              </div>
            </div>
          </div>
        ))}

        {chatSending && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4">
        <form onSubmit={onSubmit} className="flex gap-3">
          <input
            type="text"
            className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors text-slate-900"
            placeholder="Ask me anything about your finances..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            disabled={chatSending || isProcessing}
          />
          <button
            type="submit"
            disabled={chatSending || isProcessing || !msg.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
          >
            {chatSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
