"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const QUANTITIES = ["50 – 200 units", "200 – 500 units", "500 – 1000 units", "1000+ units"];

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

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const input =
    "w-full rounded-lg border border-silver-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";

  async function handleSubmit(e) {
    e.preventDefault();
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
      <div className="mt-12 rounded-2xl bg-cloud p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-royal" />
        <h3 className="mt-4 text-xl font-bold text-navy">Enquiry submitted!</h3>
        <p className="mt-2 text-sm text-silver-dark">
          Thanks — our B2B team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-lg bg-royal px-6 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark transition-colors"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 rounded-2xl bg-cloud p-8">
      <h3 className="text-xl font-bold text-navy">Submit Bulk Enquiry</h3>
      <p className="mt-1 text-sm text-silver-dark">
        Fill in your requirements and our B2B team will contact you within 24 hours.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Company / Institute Name</label>
          <input type="text" value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="ABC Technologies Pvt Ltd" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Contact Person *</label>
          <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Rahul Sharma" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Email *</label>
          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="rahul@company.com" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Phone Number *</label>
          <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 9876543210" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">GST Number (Optional)</label>
          <input type="text" value={form.gst} onChange={(e) => set("gst", e.target.value)} placeholder="22AAAAA0000A1Z5" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">Estimated Quantity</label>
          <select value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={input}>
            {QUANTITIES.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy">Product Requirements *</label>
          <textarea rows={4} required value={form.products} onChange={(e) => set("products", e.target.value)} placeholder="List the products and quantities you need..." className={input} />
        </div>
      </div>

      {status === "error" && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-royal px-10 py-3 text-sm font-bold text-white hover:bg-royal-dark transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "loading" ? "Submitting..." : "Submit Bulk Enquiry"}
      </button>
    </form>
  );
}
