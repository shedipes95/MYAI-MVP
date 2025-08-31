import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyAILogo from "@/components/MyAILogo";

export default function ChatbotHomepage() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    console.log("Submitting message:", msg.trim());
    // Navigate to chat page with the message
    navigate("/chat", { state: { initialMessage: msg.trim() } });
  };

  const handleUploadClick = () => {
    navigate("/ingest");
  };

  const suggestions = [
    "What's my current budget status?",
    "How can I save more money?",
    "Analyze my spending patterns",
    "Show me my recent transactions",
    "Help me plan my monthly budget",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMsg(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <style>
        {`
          input:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        `}
      </style>
      <div className="h-full bg-purple-50 flex flex-col items-center justify-start pt-40 relative overflow-hidden">
        <div className="w-full max-w-6xl px-8">
          {/* Main Content - MyAI + Input + GO in one line */}
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-4 p-6"
              style={{ border: "none", borderRadius: "0", background: "transparent" }}
            >
              {/* MyAI Logo */}
              <div className="flex-shrink-0">
                <MyAILogo />
              </div>

              {/* Input Field */}
              <div className="flex-1 relative min-w-0" style={{ minWidth: "500px" }}>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Ask me anything about your finances..."
                  className="w-full text-lg transition-colors"
                  style={{
                    padding: "16px 24px",
                    fontSize: "18px",
                    backgroundColor: "white",
                    color: "#581c87",
                    borderRadius: "12px",
                    border: "none !important",
                    boxShadow: "none !important",
                    outline: "none !important",
                    borderWidth: "0 !important",
                    borderStyle: "none !important",
                    borderColor: "transparent !important",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                />
              </div>

              {/* GO Button */}
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  disabled={!msg.trim()}
                  className="w-16 h-16 bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 disabled:bg-gray-300 disabled:bg-none text-white rounded-full text-lg font-bold transition-all disabled:cursor-not-allowed flex items-center justify-center shadow-xl"
                >
                  GO
                </button>
              </div>
            </form>
          </div>

          {/* Suggestions (shown when input is focused) */}
          {showSuggestions && (
            <div className="mt-4 p-4">
              <h3 className="text-sm font-semibold text-purple-800 mb-3">Suggested Questions:</h3>
              <div className="grid grid-cols-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`text-left p-2 hover:bg-purple-100 text-purple-700 transition-colors text-sm ${
                      index < suggestions.length - 1 ? "border-b border-purple-200" : ""
                    }`}
                  >
                    💡 {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Button - Bottom Right */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleUploadClick}
            className="w-20 h-20 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
