"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      // Account created — send them to login (which runs the OTP flow).
      router.push("/login?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join hardvanta to track orders and save your cart."
    >
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl glass-brand-card py-2.5 text-sm font-semibold text-brand-text hover:shadow-brand-glow transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-brand-muted">
          <span className="h-px flex-1 bg-brand-border" /> OR{" "}
          <span className="h-px flex-1 bg-brand-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="register-name" className="mb-1 block text-sm font-medium text-brand-text">
              Name
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-brand-text">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow"
            />
          </div>
          <div>
            <label htmlFor="register-phone" className="mb-1 block text-sm font-medium text-brand-text">
              Mobile number
            </label>
            <div className="flex items-center rounded-lg glass-brand-card focus-within:shadow-brand-glow">
              <span className="pl-3 pr-2 text-sm text-brand-muted">+91</span>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full rounded-r-lg bg-transparent px-1 py-2.5 text-sm text-brand-text outline-none placeholder:text-brand-muted"
              />
            </div>
          </div>
          <div>
            <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-brand-text">
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="new-password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg glass-brand-card px-3 py-2.5 pr-10 text-sm text-brand-text outline-none focus:shadow-brand-glow"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-blue"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="brand-gradient" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-blue hover:text-brand-steel">
            Sign in
          </Link>
        </p>
    </AuthShell>
  );
}
