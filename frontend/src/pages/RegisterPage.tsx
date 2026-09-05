import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function RegisterPage() {
  const [role, setRole] = useState<"trekker" | "organizer">("trekker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        phone_number: phoneNumber || undefined,
        password,
        role,
      });
      await login(email, password);
      navigate(role === "organizer" ? "/organizer/onboarding" : "/dashboard");
    } catch {
      setError("Could not create your account. The email may already be registered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full p-8">
        <h1 className="font-display text-2xl font-semibold text-pine">Create your account</h1>
        <p className="mt-1 text-sm text-moss">Join as a trekker or list your treks as an organizer.</p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-moss/10 p-1">
          <button
            type="button"
            onClick={() => setRole("trekker")}
            className={cn(
              "rounded-full py-2 text-sm font-medium transition-colors",
              role === "trekker" ? "bg-white text-pine shadow-sm" : "text-moss",
            )}
          >
            I&apos;m a trekker
          </button>
          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={cn(
              "rounded-full py-2 text-sm font-medium transition-colors",
              role === "organizer" ? "bg-white text-pine shadow-sm" : "text-moss",
            )}
          >
            I&apos;m an organizer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-pine">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
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
            Phone number
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-moss">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blaze hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
