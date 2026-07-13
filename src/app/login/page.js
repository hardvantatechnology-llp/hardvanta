"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/auth/AuthShell";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const justRegistered = params.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("password");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(justRegistered ? "Account created! Please sign in to continue." : "");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password states
  const [forgotStep, setForgotStep] = useState(false);
  const [forgotStage, setForgotStage] = useState("email"); // email | reset | done
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotInfo, setForgotInfo] = useState("");
  const [forgotDevCode, setForgotDevCode] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Invalid email or password."); return; }
    setStep("otp");
    if (data.demo && data.devCode) {
      setOtp(data.devCode);
      setInfo(`Demo mode: your code is ${data.devCode}`);
    } else {
      setInfo(`We have emailed a 6-digit code to ${email}.`);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, otp, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid or expired code. Please try again."); }
    else { router.push(callbackUrl); router.refresh(); }
  }

  async function resendOtp() {
    setError(""); setInfo(""); setLoading(true);
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setError("Could not resend the code."); return; }
    if (data.demo && data.devCode) { setOtp(data.devCode); setInfo(`Demo mode: your code is ${data.devCode}`); }
    else { setInfo(`A new code was sent to ${email}.`); }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotError("");
    setForgotInfo("");
    setForgotLoading(true);
    const res = await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json().catch(() => ({}));
    setForgotLoading(false);
    if (!res.ok) {
      setForgotError(data.error || "Something went wrong. Please try again.");
      return;
    }
    setForgotStage("reset");
    if (data.demo && data.devCode) {
      setForgotCode(data.devCode);
      setForgotDevCode(data.devCode);
      setForgotInfo("");
    } else {
      setForgotDevCode("");
      setForgotInfo(`If an account exists for ${forgotEmail}, a 6-digit code is on its way.`);
    }
  }

  async function handleResendCode() {
    setForgotError("");
    setForgotLoading(true);
    const res = await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json().catch(() => ({}));
    setForgotLoading(false);
    if (!res.ok) {
      setForgotError(data.error || "Could not resend the code.");
      return;
    }
    if (data.demo && data.devCode) {
      setForgotCode(data.devCode);
      setForgotDevCode(data.devCode);
      setForgotInfo("");
    } else {
      setForgotInfo(`A new code was sent to ${forgotEmail}.`);
    }
  }

  async function handleResetConfirm(e) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotEmail,
        code: forgotCode,
        password: forgotNewPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setForgotLoading(false);
    if (!res.ok) {
      setForgotError(data.error || "Could not reset password.");
      return;
    }
    setForgotStage("done");
  }

  // Forgot Password Screen
  if (forgotStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {forgotStage !== "done" && (
              <button
                onClick={() => { setForgotStep(false); setForgotStage("email"); setForgotError(""); setForgotInfo(""); }}
                className="flex items-center gap-1.5 text-sm text-silver-dark hover:text-royal mb-6 transition-colors"
              >
                <ArrowLeft size={15} /> Back to login
              </button>
            )}

            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-royal/10 flex items-center justify-center">
                <Lock size={26} className="text-royal" />
              </div>
            </div>

            {forgotInfo && (
              <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{forgotInfo}</p>
            )}
            {forgotError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{forgotError}</p>
            )}

            {forgotStage === "email" && (
              <>
                <h2 className="text-xl font-bold text-navy text-center mb-1">Forgot password?</h2>
                <p className="text-sm text-silver-dark text-center mb-6">Enter your email and we&apos;ll send you a reset code.</p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                    <input
                      type="email" required value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-silver pl-9 pr-4 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading}
                    className="w-full rounded-xl bg-royal py-2.5 text-sm font-semibold text-white hover:bg-navy transition-colors disabled:opacity-70">
                    {forgotLoading ? "Sending..." : "Send Reset Code"}
                  </button>
                </form>
              </>
            )}

            {forgotStage === "reset" && (
              <>
                <h2 className="text-xl font-bold text-navy text-center mb-1">Reset password</h2>
                <p className="text-sm text-silver-dark text-center mb-5">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-navy">{forgotEmail}</span> and choose a new password.
                </p>

                {forgotDevCode && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
                    Email isn&apos;t set up yet, so here&apos;s your code:{" "}
                    <span className="font-bold tracking-widest">{forgotDevCode}</span>
                  </div>
                )}

                <form onSubmit={handleResetConfirm} className="space-y-4">
                  <input
                    type="text" inputMode="numeric" maxLength={6} required autoFocus
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="------"
                    className="w-full rounded-xl border border-silver px-4 py-2.5 text-center text-lg font-semibold tracking-[0.5em] outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
                  />
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                    <input
                      type={showNewPassword ? "text" : "password"} required minLength={6}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="New password (min 6 characters)"
                      className="w-full rounded-xl border border-silver pl-9 pr-10 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
                    />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark hover:text-royal">
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button type="submit" disabled={forgotLoading || forgotCode.length < 6}
                    className="w-full rounded-xl bg-royal py-2.5 text-sm font-semibold text-white hover:bg-navy transition-colors disabled:opacity-70">
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-silver-dark">
                  Didn&apos;t get the code?{" "}
                  <button type="button" onClick={handleResendCode} disabled={forgotLoading}
                    className="font-semibold text-royal hover:underline disabled:opacity-50">
                    Resend
                  </button>
                </p>
              </>
            )}

            {forgotStage === "done" && (
              <div className="text-center py-2">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 size={52} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-navy mb-2">Password updated!</h2>
                <p className="text-sm text-silver-dark mb-6">You can now sign in with your new password.</p>
                <button
                  onClick={() => { setForgotStep(false); setForgotStage("email"); setForgotEmail(""); setForgotCode(""); setForgotNewPassword(""); setForgotInfo(""); setForgotError(""); }}
                  className="rounded-xl bg-royal px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy transition-colors"
                >
                  Back to login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Login Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl font-extrabold text-navy">Hardvanta</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy">
            {step === "password" ? "Welcome back" : "Check your email"}
          </h1>
          <p className="text-sm text-silver-dark mt-1">
            {step === "password" ? "Sign in to your Hardvanta account" : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {step === "password" ? (
            <>
              {/* Google */}
              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-navy hover:border-royal hover:bg-gray-50 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-silver-dark">
                <span className="h-px flex-1 bg-gray-200" /> OR <span className="h-px flex-1 bg-gray-200" />
              </div>

              {info && <p className="mb-4 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-700">{info}</p>}
              {error && <p className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-navy">Password</label>
                    <button type="button" onClick={() => setForgotStep(true)} className="text-xs text-royal hover:underline font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-dark" />
                    <input
                      type={showPassword ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-200 pl-9 pr-10 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark hover:text-royal transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-royal" />
                  <span className="text-sm text-silver-dark">Remember me for 30 days</span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full rounded-xl bg-royal py-3 text-sm font-semibold text-white hover:bg-navy transition-colors disabled:opacity-70">
                  {loading ? "Sending code..." : "Continue"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-silver-dark">
                Do not have an account?{" "}
                <Link href="/register" className="font-semibold text-royal hover:underline">Create one</Link>
              </p>
            </>
          ) : (
            <>
              {info && <p className="mb-4 rounded-xl bg-blue-50 px-3 py-2.5 text-sm text-blue-700">{info}</p>}
              {error && <p className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy text-center">Enter 6-digit code</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6} required autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-center text-2xl font-bold tracking-[0.6em] outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all"
                  />
                </div>

                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full rounded-xl bg-royal py-3 text-sm font-semibold text-white hover:bg-navy transition-colors disabled:opacity-70">
                  {loading ? "Verifying..." : "Verify & Sign in"}
                </button>

                <div className="flex items-center justify-between text-sm pt-1">
                  <button type="button" onClick={() => { setStep("password"); setOtp(""); setError(""); setInfo(""); }}
                    className="flex items-center gap-1 text-silver-dark hover:text-royal transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="button" onClick={resendOtp} disabled={loading}
                    className="font-semibold text-royal hover:underline disabled:opacity-50">
                    Resend code
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-silver-dark mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-royal hover:underline">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="text-royal hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
