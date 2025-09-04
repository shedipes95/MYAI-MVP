import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import {
  Upload,
  TrendingUp,
  PieChart,
  CreditCard,
  Target,
  Shield,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function Homepage() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUploadClick = () => {
    navigate("/ingest");
  };

  const quickActions = [
    {
      name: "Upload Transactions",
      path: "/ingest",
      icon: Upload,
      description: "Upload your CSV to get instant insights",
      color: "bg-blue-600 hover:bg-blue-700",
      featured: true,
    },
    {
      name: "Budget Overview",
      path: "/budget",
      icon: PieChart,
      description: "Track your spending and budget",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: CreditCard,
      description: "View account balances",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      name: "Savings Goals",
      path: "/save",
      icon: Target,
      description: "Manage your savings targets",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      name: "AI Assistant",
      path: "/chat",
      icon: MessageCircle,
      description: "Get personalized financial advice",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      name: "Loans & Credit",
      path: "/loans",
      icon: TrendingUp,
      description: "Manage loans and payments",
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  const sidebarItems = [
    { name: "Budget", path: "/budget", icon: "📊" },
    { name: "Accounts", path: "/accounts", icon: "🏦" },
    { name: "MyAI Chat", path: "/chat", icon: "💬" },
    { name: "Save", path: "/save", icon: "💰" },
    { name: "Loans", path: "/loans", icon: "💳" },
    { name: "Insurance", path: "/insurance", icon: "🛡️" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-r border-slate-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b gradient-primary text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="p-2 flex flex-col h-full">
          <ul className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className="group relative flex items-center justify-between rounded-lg px-3 py-3 text-sm w-full text-left hover:bg-blue-50 text-slate-700 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </span>
                  <span className="pointer-events-none opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                      GO
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Home Button at bottom of sidebar */}
          <div className="border-t border-slate-200 pt-2 mt-2">
            <button
              onClick={() => {
                navigate("/");
                setIsSidebarOpen(false);
              }}
              className="group relative flex items-center justify-between rounded-lg px-3 py-3 text-sm w-full text-left hover:bg-blue-50 text-slate-700 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </span>
              <span className="pointer-events-none opacity-0 transition group-hover:opacity-100">
                <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                  GO
                </span>
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-slate-600"></div>
              <div className="w-full h-0.5 bg-slate-600"></div>
              <div className="w-full h-0.5 bg-slate-600"></div>
            </div>
          </button>
          <h1 className="text-xl font-bold text-slate-800">MyAI</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="mb-6">
                <h1 className="text-5xl font-bold text-slate-900 mb-4">
                  Welcome to <span className="text-blue-600">MyAI</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Your intelligent financial assistant. Upload your transactions, get insights, and
                  take control of your financial future.
                </p>
              </div>

              {/* Featured Action */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Upload className="w-16 h-16 text-blue-100" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
                <p className="text-blue-100 mb-6 max-w-md mx-auto">
                  Upload your bank transaction CSV file to unlock personalized insights and
                  AI-powered financial guidance.
                </p>
                <button
                  onClick={handleUploadClick}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Upload CSV File
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Explore Your Financial Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.slice(1).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1"
                    >
                      <div
                        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.name}</h3>
                      <p className="text-slate-600 text-sm mb-4">{action.description}</p>
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-100 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Why Choose MyAI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Analytics</h3>
                  <p className="text-slate-600">
                    Get intelligent insights into your spending patterns and financial habits.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Private</h3>
                  <p className="text-slate-600">
                    Your financial data is processed locally and kept completely secure.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered Advice</h3>
                  <p className="text-slate-600">
                    Get personalized financial recommendations from our intelligent assistant.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats/Welcome Message */}
            <div className="text-center">
              <p className="text-slate-600">
                Join thousands of users taking control of their finances with MyAI's intelligent
                platform.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
