import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Budget from "@/pages/Budget";
import Accounts from "@/pages/Accounts";
import Chat from "@/pages/Chat";
import Save from "@/pages/Save";
import Loans from "@/pages/Loans";
import Insurance from "@/pages/Insurance";
import Ingest from "@/pages/Ingest";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import { useAppStore } from "@/store/useAppStore";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  // If it's an auth page, render it without the main layout
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    );
  }

  // For all other routes, render with the main layout
  return (
    <div className="h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            {/* Default page after login */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/budget" replace />
                </PrivateRoute>
              }
            />

            {/* Main pages */}
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <Budget />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <PrivateRoute>
                  <Accounts />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/save"
              element={
                <PrivateRoute>
                  <Save />
                </PrivateRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <PrivateRoute>
                  <Loans />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance"
              element={
                <PrivateRoute>
                  <Insurance />
                </PrivateRoute>
              }
            />

            {/* Upload CSV page */}
            <Route
              path="/ingest"
              element={
                <PrivateRoute>
                  <Ingest />
                </PrivateRoute>
              }
            />

            {/* Any other route → redirect */}
            <Route path="*" element={<Navigate to="/budget" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
