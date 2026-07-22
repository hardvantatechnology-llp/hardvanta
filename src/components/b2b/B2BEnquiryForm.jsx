"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const QUANTITIES = ["50 – 200 units", "200 – 500 units", "500 – 1000 units", "1000+ units"];

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function B2BEnquiryForm() {
  const [form, setForm] = useState({
    organization: "",
    name: "",
    email: "",
    phone: "",
    gst: "",
    quantity: QUANTITIES[0],
    products: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const set = (k, v) => {
    if (k === "phone") {
      // Strip anything that isn't a digit, cap at 10 digits
      const digitsOnly = v.replace(/\D/g, "").slice(0, 10);
      setForm((f) => ({ ...f, phone: digitsOnly }));

      if (digitsOnly.length === 0) {
        setPhoneError("");
      } else if (digitsOnly.length < 10) {
        setPhoneError("Phone number must be 10 digits");
      } else if (!INDIAN_PHONE_REGEX.test(digitsOnly)) {
        setPhoneError("Enter a valid Indian mobile number (must start with 6-9)");
      } else {
        setPhoneError("");
      }
      return;
    }

    setForm((f) => ({ ...f, [k]: v }));
  };

  const input =
    "w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow placeholder:text-brand-muted";
  const inputError =
    "w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none shadow-[0_0_0_1px_rgba(248,113,113,0.6)] placeholder:text-brand-muted";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!INDIAN_PHONE_REGEX.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organization: form.organization,
          email: form.email,
          phone: form.phone,
          enquiryType: "B2B / Bulk",
          products: form.products,
          quantity: form.quantity,
          message: form.gst ? `GST: ${form.gst}` : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit enquiry.");
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-12 rounded-2xl glass-brand-strong p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-brand-blue" />
        <h3 className="mt-4 text-xl font-bold text-brand-text">Enquiry submitted!</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Thanks — our B2B team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-brand-glow hover:brightness-110 transition-all"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 rounded-2xl glass-brand-strong p-8">
      <h3 className="text-xl font-bold text-brand-text">Submit Bulk Enquiry</h3>
      <p className="mt-1 text-sm text-brand-muted">
        Fill in your requirements and our B2B team will contact you within 24 hours.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-org" className="mb-1 block text-sm font-medium text-brand-text">Company / Institute Name</label>
          <input id="b2b-org" type="text" value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="ABC Technologies Pvt Ltd" className={input} />
        </div>
        <div>
          <label htmlFor="b2b-name" className="mb-1 block text-sm font-medium text-brand-text">Contact Person *</label>
          <input id="b2b-name" type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Rahul Sharma" className={input} />
        </div>
        <div>
          <label htmlFor="b2b-email" className="mb-1 block text-sm font-medium text-brand-text">Email *</label>
          <input id="b2b-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="rahul@company.com" className={input} />
        </div>
        <div>
          <label htmlFor="b2b-phone" className="mb-1 block text-sm font-medium text-brand-text">Phone Number *</label>
          <input
            id="b2b-phone"
            type="tel"
            required
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="10-digit mobile number"
            aria-invalid={phoneError ? "true" : "false"}
            className={phoneError ? inputError : input}
          />
          {phoneError && <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>}
        </div>
        <div>
          <label htmlFor="b2b-gst" className="mb-1 block text-sm font-medium text-brand-text">GST Number (Optional)</label>
          <input id="b2b-gst" type="text" value={form.gst} onChange={(e) => set("gst", e.target.value)} placeholder="22AAAAA0000A1Z5" className={input} />
        </div>
        <div>
          <label htmlFor="b2b-quantity" className="mb-1 block text-sm font-medium text-brand-text">Estimated Quantity</label>
          <select id="b2b-quantity" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={input}>
            {QUANTITIES.map((q) => (
              <option key={q} value={q} className="bg-white text-brand-text">{q}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="b2b-products" className="mb-1 block text-sm font-medium text-brand-text">Product Requirements *</label>
          <textarea id="b2b-products" rows={4} required value={form.products} onChange={(e) => set("products", e.target.value)} placeholder="List the products and quantities you need..." className={input} />
        </div>
      </div>

      {status === "error" && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-10 py-3 text-sm font-bold text-white shadow-brand-glow hover:brightness-110 transition-all disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "loading" ? "Submitting..." : "Submit Bulk Enquiry"}
      </button>
    </form>
  );
}