import { FormEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";

export default function ForgotPassword() {
  const { forgotPassword, authLoading, authError, clearAuthError } = useAppStore();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    return () => clearAuthError();
  }, [clearAuthError]);

  function validateEmail(): boolean {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError("");
    return true;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateEmail()) return;

    await forgotPassword({ email });

    if (!authError) {
      setEmailSent(true);
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-purple-50">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-lg text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-purple-900 mb-2">Check Your Email</h2>
              <p className="text-sm text-purple-700">We've sent password reset instructions to</p>
              <p className="text-sm font-medium text-purple-800 mt-1">{email}</p>
            </div>

            <div className="text-sm text-purple-600 mb-6">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                try a different email address
              </button>
            </div>

            <Link to="/login" className="inline-block w-full">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-purple-50">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-900">Reset Password</h2>
            <p className="text-sm text-purple-700 mt-2">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{authError.message}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-purple-700">
                Email Address
              </label>
              <input
                type="email"
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors text-purple-900 ${
                  emailError
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                }`}
                placeholder="john@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={authLoading}
                autoFocus
              />
              {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={authLoading || !email.trim()}>
              {authLoading ? "Sending Instructions..." : "Send Reset Instructions"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
