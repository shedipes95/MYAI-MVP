import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import {
  Upload,
  TrendingUp,
  PieChart,
  CreditCard,
  Target,
  MessageCircle,
  ArrowRight,
  DollarSign,
  BarChart3,
  Wallet,
  Bot,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import SwitchingDemo from "@/components/SwitchingDemo";

export default function ChatbotHomepage() {
  const navigate = useNavigate();
  const { user, transactions, transactionKPIs, budget } = useAppStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const hasData = transactions.length > 0;

  const promptSuggestions = [
    "How much can I save by switching providers?",
    "What's the best way to pay off my €14K debt?",
    "How should I budget for my children's college?",
    "Show me my family's financial optimization plan",
    "What insurance policies should I compare?",
    "How can I reduce my monthly bills?",
    "What's the best savings strategy for my family?",
    "Help me plan for retirement with my current income",
  ];

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    navigate("/chat", { state: { initialMessage: suggestion } });
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      navigate("/chat", { state: { initialMessage: inputValue.trim() } });
    } else {
      navigate("/chat");
    }
  };

  const quickStats = [
    {
      id: "spending",
      title: "Total Spending",
      value: hasData ? `€${transactionKPIs?.totalSpent?.toFixed(2) || "0.00"}` : "€0.00",
      icon: DollarSign,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: "transactions",
      title: "Transactions",
      value: hasData ? `${transactionKPIs?.transactionCount || 0}` : "0",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "budget",
      title: "Budget Used",
      value: hasData
        ? `${(((transactionKPIs?.totalSpent || 0) / (budget?.totalLimit || 1)) * 100).toFixed(0)}%`
        : "0%",
      icon: Wallet,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  const actionCards = [
    {
      id: "upload",
      title: "Upload Transactions",
      description: "Import your bank data to get started",
      icon: Upload,
      path: "/ingest",
      gradient: "from-blue-600 to-blue-700",
      featured: true,
    },
    {
      id: "chat",
      title: "AI Financial Assistant",
      description: "Get personalized financial advice",
      icon: Bot,
      path: "/chat",
      gradient: "from-purple-600 to-purple-700",
    },
    {
      id: "budget",
      title: "Budget Overview",
      description: "Track your spending categories",
      icon: PieChart,
      path: "/budget",
      gradient: "from-green-600 to-green-700",
    },
    {
      id: "accounts",
      title: "Account Management",
      description: "View your account balances",
      icon: CreditCard,
      path: "/accounts",
      gradient: "from-indigo-600 to-indigo-700",
    },
    {
      id: "savings",
      title: "Savings Goals",
      description: "Plan and track your savings",
      icon: Target,
      path: "/save",
      gradient: "from-orange-600 to-orange-700",
    },
    {
      id: "insights",
      title: "Financial Insights",
      description: "Discover spending patterns",
      icon: TrendingUp,
      path: "/loans",
      gradient: "from-pink-600 to-pink-700",
    },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Smart financial switching for busy families. Save thousands by optimizing your
            insurance, loans, and utilities.
          </p>

          {/* MyAI + Input + GO - Mobile Stacked, Desktop Horizontal */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 max-w-4xl mx-auto mb-6">
            {/* MyAI Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyAI
              </h1>
            </div>

            {/* Input + GO Container for Mobile */}
            <div className="flex items-center gap-3 w-full sm:flex-1 max-w-2xl relative">
              {/* Input Field */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Ask me anything about your finances..."
                  className="w-full text-sm sm:text-lg px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputSubmit();
                    }
                  }}
                />

                {/* Dropdown Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-700">
                        💡 Suggested Questions:
                      </h4>
                    </div>
                    <div className="py-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-slate-700 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* GO Button */}
              <button
                onClick={handleInputSubmit}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white rounded-full text-sm sm:text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl flex-shrink-0"
              >
                GO
              </button>
            </div>
          </div>

          {/* Prominent Onboarding Call-to-Action */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto border border-purple-200">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">
                🎯 Get Personalized Financial Recommendations
              </h3>
              <p className="text-sm sm:text-base text-purple-700 mb-4">
                Answer a few quick questions about your situation to unlock tailored switching
                opportunities and savings strategies.
              </p>
              <button
                onClick={() => navigate("/onboarding")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Financial Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {hasData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                        {stat.title}
                      </p>
                      <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Section for Presentation */}
        {!hasData && (
          <div className="mb-8">
            {/* Upload Section */}
            <div
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl mb-8"
              onClick={() => navigate("/ingest")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur-xl"></div>
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">See MyAI in Action</h2>
                <p className="text-blue-100 mb-6 max-w-md mx-auto">
                  Upload your 18-month transaction history and discover thousands in savings through
                  smart switching
                </p>
                <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Upload Your Data
                </button>
              </div>
            </div>

            {/* Switching Demo */}
            <SwitchingDemo />
          </div>
        )}

        {/* Action Cards Grid - Only show when user has data */}
        {hasData && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
              Explore Your Data
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {actionCards.slice(1).map((card) => {
                const IconComponent = card.icon;
                const isHovered = hoveredCard === card.id;

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(card.path)}
                    className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${card.gradient} rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300 ${
                          isHovered ? "scale-110 rotate-6" : ""
                        }`}
                      >
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-all duration-300 ${
                          isHovered ? "text-blue-500 translate-x-1" : ""
                        }`}
                      />
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4">
                      {card.description}
                    </p>

                    <div
                      className={`flex items-center text-blue-600 text-xs sm:text-sm font-medium transition-colors ${
                        isHovered ? "text-blue-700" : ""
                      }`}
                    >
                      <span>Explore</span>
                      <ArrowRight
                        className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Chat Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Ask MyAI Anything</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              "How much can I save by switching providers?",
              "What's the best way to pay off my €14K debt?",
              "How should I budget for my children's college?",
              "Show me my family's financial optimization plan",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => navigate("/chat", { state: { initialMessage: question } })}
                className="text-left p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm text-slate-700 hover:text-blue-700 border border-transparent hover:border-blue-200"
              >
                💡 {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
