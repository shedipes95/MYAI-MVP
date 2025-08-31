import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

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

  const sidebarItems = [
    { name: "Budget", path: "/budget", icon: "📊" },
    { name: "Accounts", path: "/accounts", icon: "🏦" },
    { name: "MyAI Chat", path: "/chat", icon: "💬" },
    { name: "Save", path: "/save", icon: "💰" },
    { name: "Loans", path: "/loans", icon: "💳" },
    { name: "Insurance", path: "/insurance", icon: "🛡️" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
          <h1 className="text-xl font-bold text-gray-800">MyAI</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md w-full">
            {/* MyAI Logo/Title */}
            <div className="mb-12">
              <h1 className="text-6xl font-black text-gray-800 mb-4">MyAI</h1>
              <p className="text-gray-600 text-lg">Your Personal Finance Assistant</p>
            </div>

            {/* Main Action Area */}
            <div className="mb-8 space-y-4">
              {/* Input Field (Visual) */}
              <div className="w-full max-w-xs mx-auto">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                  <div className="text-gray-400 text-sm text-center">
                    Ready to upload your CSV file
                  </div>
                </div>
              </div>

              {/* Go Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleUploadClick}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
                >
                  GO
                </button>
              </div>
            </div>

            {/* Upload Icon */}
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>

            {/* Welcome Message */}
            {user && (
              <div className="text-center">
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold">{user.firstName}</span>!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload your transaction data to get started with AI-powered financial insights
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
