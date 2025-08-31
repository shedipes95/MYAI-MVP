import { FormEvent, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAppStore();
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Demo only – no backend
    login(email.trim());
    navigate("/budget", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Log in</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              Log in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
