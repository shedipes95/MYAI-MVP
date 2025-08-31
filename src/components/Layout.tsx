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
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header
        className={`p-4 flex items-center justify-between ${
          isHomepage
            ? "bg-purple-50 text-purple-800 border-none"
            : "bg-purple-600 text-white shadow-lg"
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
                style={{ backgroundColor: isHomepage ? "#7c3aed" : "white" }}
              ></div>
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: isHomepage ? "#7c3aed" : "white" }}
              ></div>
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: isHomepage ? "#7c3aed" : "white" }}
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
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isHomepage
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-700 hover:bg-purple-800"
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
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50">
              <div className="p-4 border-b bg-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-white hover:bg-purple-700 p-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <nav className="p-2 flex flex-col h-full">
                <ul className="space-y-1 flex-1">
                  {menuItems.map((item) => (
                    <li key={item.to}>
                      <button
                        onClick={() => handleMenuItemClick(item.to)}
                        className="group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm w-full text-left hover:bg-purple-50 text-purple-700"
                      >
                        <span>{item.label}</span>
                        <span className="pointer-events-none opacity-0 transition group-hover:opacity-100">
                          <span className="rounded-md bg-purple-600 px-2 py-1 text-xs font-semibold text-white">
                            GO
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Home Button at bottom of sidebar */}
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <button
                    onClick={() => {
                      navigate("/");
                      setIsSidebarOpen(false);
                    }}
                    className="group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm w-full text-left hover:bg-purple-50 text-purple-700"
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
                      <span className="rounded-md bg-purple-600 px-2 py-1 text-xs font-semibold text-white">
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
        <main className="h-full overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
