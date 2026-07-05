"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cloud">
      {/* Header */}
      <div className="bg-navy">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-silver hover:text-white text-sm">
              ← My Account
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">Security</h1>
          <p className="text-sm text-silver/70">Manage your password and login settings</p>
        </div>
      </div>

      <div className="container-page py-6 max-w-lg">
        <div className="rounded-2xl border border-silver-light bg-white p-6 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <Shield size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-navy">Change Password</h2>
              <p className="text-xs text-silver-dark">Use a strong password to keep your account safe</p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.type === "success" && <CheckCircle2 size={16} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 pr-10 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 pr-10 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 pr-10 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-royal px-4 py-2.5 font-semibold text-white transition-colors hover:bg-royal-dark disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          💡 If you signed in with Google, you may not have a password set. Use Google to log in instead.
        </div>
      </div>
    </div>
  );
}