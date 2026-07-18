"use client";

import { useState } from "react";
import { Home, Briefcase, MapPin } from "lucide-react";
import { lookupPincode } from "@/utils/pincode";
import Button from "@/components/ui/Button";

const LABELS = [
  { value: "Home", Icon: Home },
  { value: "Work", Icon: Briefcase },
  { value: "Other", Icon: MapPin },
];

function emptyForm(initialValue) {
  return {
    label: initialValue?.label || "Home",
    fullName: initialValue?.fullName || "",
    phone: initialValue?.phone || "",
    addressLine1: initialValue?.addressLine1 || "",
    addressLine2: initialValue?.addressLine2 || "",
    city: initialValue?.city || "",
    state: initialValue?.state || "",
    postalCode: initialValue?.postalCode || "",
    isDefault: initialValue?.isDefault || false,
  };
}

// Shared add/edit form for a saved address — used in the checkout address
// book and the account "Saved Addresses" manager so both stay identical.
export default function AddressForm({
  initialValue = null,
  onSubmit,
  onCancel,
  submitLabel = "Save Address",
}) {
  const [form, setForm] = useState(() => emptyForm(initialValue));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pinStatus, setPinStatus] = useState("idle");
  const [pinMessage, setPinMessage] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePincode(value) {
    const pin = value.replace(/\D/g, "").slice(0, 6);
    update("postalCode", pin);
    if (pin.length < 6) {
      setPinStatus("idle");
      setPinMessage("");
      return;
    }
    setPinStatus("checking");
    setPinMessage("Checking PIN code…");
    const result = await lookupPincode(pin);
    if (result.ok) {
      setForm((f) => ({ ...f, postalCode: pin, city: result.city, state: result.state }));
      setPinStatus("ok");
      setPinMessage(`${result.area}, ${result.city}, ${result.state}`);
    } else {
      setPinStatus("error");
      setPinMessage(result.error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Please enter a valid Indian mobile number (must start with 6, 7, 8 or 9).");
      return;
    }
    if (pinStatus === "error") {
      setError("Please enter a valid Indian PIN code.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "Could not save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Address type pills */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">Address Type</label>
        <div className="flex gap-2">
          {LABELS.map(({ value, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("label", value)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                form.label === value
                  ? "glass-card shadow-glow-electric ring-1 ring-electric/50 text-white"
                  : "glass-card text-white/50 hover:text-white/80"
              }`}
            >
              <Icon size={14} /> {value}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
        <Field
          label="Phone" value={form.phone} type="tel" inputMode="numeric"
          placeholder="10-digit mobile number" maxLength={10}
          onChange={(v) => update("phone", v.replace(/\D/g, "").slice(0, 10))} required
        />
      </div>

      <Field
        label="Flat / House No / Building Name" value={form.addressLine1}
        onChange={(v) => update("addressLine1", v)} required
        placeholder="e.g. Flat 302, Shree Residency"
      />
      <Field
        label="Area / Street / Landmark (optional)" value={form.addressLine2}
        onChange={(v) => update("addressLine2", v)}
        placeholder="e.g. Sector 62, Near City Mall"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="addr-pincode" className="mb-1 block text-sm font-medium text-white/80">
            Pincode<span className="ml-0.5 text-electric-light">*</span>
          </label>
          <input
            id="addr-pincode"
            type="text" inputMode="numeric" required value={form.postalCode}
            onChange={(e) => handlePincode(e.target.value)} placeholder="6-digit PIN"
            className={`w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 ${
              pinStatus === "error" ? "ring-1 ring-red-400"
              : pinStatus === "ok" ? "ring-1 ring-cyan"
              : "focus:shadow-glow-electric"
            }`}
          />
          {pinMessage && (
            <p className={`mt-1 text-xs ${pinStatus === "error" ? "text-red-400" : pinStatus === "ok" ? "text-cyan" : "text-white/40"}`}>
              {pinStatus === "ok" ? "✓ " : pinStatus === "error" ? "✕ " : ""}{pinMessage}
            </p>
          )}
        </div>
        <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
        <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => update("isDefault", e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-transparent accent-electric"
        />
        Make this my default address
      </label>

      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="gradient" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="glass" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, required, type = "text", inputMode, placeholder, maxLength }) {
  const id = `addr-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-white/80">
        {label}{required && <span className="ml-0.5 text-electric-light">*</span>}
      </label>
      <input
        id={id}
        type={type} inputMode={inputMode} required={required}
        maxLength={maxLength} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:shadow-glow-electric"
      />
    </div>
  );
}
