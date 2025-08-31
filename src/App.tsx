import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ChatbotHomepage from "@/pages/ChatbotHomepage";
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

  // If it's an auth page, render it without any layout
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    );
  }

  // For all other routes, render with the standard layout (topbar + hidden sidebar)
  return (
    <Layout>
      <Routes>
        {/* Homepage - ChatBot */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChatbotHomepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <ChatbotHomepage />
            </PrivateRoute>
          }
        />

        {/* Feature Pages */}
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
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/ingest"
          element={
            <PrivateRoute>
              <Ingest />
            </PrivateRoute>
          }
        />

        {/* Any other route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
