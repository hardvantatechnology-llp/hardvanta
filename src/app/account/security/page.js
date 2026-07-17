"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SecurityPage() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage({ type: "success", text: "Password changed successfully!" });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-cyan/10" />

      {/* Header */}
      <div className="relative border-b border-white/10">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-white/50 hover:text-electric-light text-sm">
              ← My Account
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">Security</h1>
          <p className="text-sm text-white/50">Manage your password and login settings</p>
        </div>
      </div>

      <div className="container-page relative py-6 max-w-lg">
        <div className="glass-strong rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10">
              <Shield size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="font-bold text-white">Change Password</h2>
              <p className="text-xs text-white/40">Use a strong password to keep your account safe</p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-cyan/10 text-cyan"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {message.type === "success" && <CheckCircle2 size={16} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg glass-card px-3 py-2.5 pr-10 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-electric-light"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg glass-card px-3 py-2.5 pr-10 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-electric-light"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg glass-card px-3 py-2.5 pr-10 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-electric-light"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-4 rounded-xl bg-electric/10 border border-electric/20 p-4 text-sm text-electric-light">
          💡 If you signed in with Google, you may not have a password set. Use Google to log in instead.
        </div>
      </div>
    </div>
  );
}
