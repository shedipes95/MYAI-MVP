import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import MyAILogo from "@/components/MyAILogo";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppStore();

  const isHomepage = location.pathname === "/" || location.pathname === "/home";

  const menuItems = [
    { label: "Chat MyAI", to: "/", icon: "💬" },
    { label: "Budget", to: "/budget" },
    { label: "Accounts", to: "/accounts" },
    { label: "Save", to: "/save" },
    { label: "Loans", to: "/loans" },
    { label: "Insurance", to: "/insurance" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header
        className={`p-4 flex items-center justify-between ${
          isHomepage
            ? "bg-slate-50 text-slate-800 border-none"
            : "gradient-primary text-white shadow-xl border-b border-blue-600"
        }`}
        style={isHomepage ? { boxShadow: "none", borderBottom: "none" } : {}}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: isHomepage ? "#1e40af" : "white" }}
              ></div>
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: isHomepage ? "#1e40af" : "white" }}
              ></div>
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: isHomepage ? "#1e40af" : "white" }}
              ></div>
            </div>
          </button>

          {!isHomepage && (
            <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
              <MyAILogo />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm">
              Welcome, {user.firstName} {user.lastName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
              isHomepage
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 border-r border-slate-200">
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
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.to || 
                      (item.to === "/" && (location.pathname === "/" || location.pathname === "/home"));
                    
                    return (
                      <li key={item.to}>
                        <button
                          onClick={() => handleMenuItemClick(item.to)}
                          className={`group relative flex items-center justify-between rounded-lg px-3 py-3 text-sm w-full text-left transition-all duration-200 ${
                            isActive 
                              ? "bg-blue-100 text-blue-700 font-medium" 
                              : "hover:bg-blue-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <span>{item.label}</span>
                          </div>
                          <span className={`pointer-events-none transition ${
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}>
                            <span className="rounded-md bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                              GO
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
          </>
        )}

        {/* Main Content */}
        <main className="h-full overflow-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
