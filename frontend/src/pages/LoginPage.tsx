import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

const DASHBOARD_PATH: Record<UserRole, string> = {
  trekker: "/dashboard",
  organizer: "/organizer/dashboard",
  admin: "/admin",
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(DASHBOARD_PATH[user.role]);
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full p-8">
        <h1 className="font-display text-2xl font-semibold text-pine">Welcome back</h1>
        <p className="mt-1 text-sm text-moss">Log in to manage your treks and bookings.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-pine">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-moss">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-blaze hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
