import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";
import type { LoginData } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const { user, login, authLoading, authError, clearAuthError } = useAppStore();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<LoginData>>({});

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => clearAuthError();
  }, [clearAuthError]);

  function validateForm(): boolean {
    const errors: Partial<LoginData> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    await login(formData);
  }

  function updateField(field: keyof LoginData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-2">Sign in to your MyAI account</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{authError.message}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors ${
                  fieldErrors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                disabled={authLoading}
                autoFocus
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors ${
                  fieldErrors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                disabled={authLoading}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={authLoading}>
              {authLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
