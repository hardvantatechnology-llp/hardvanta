"use client";

import { useState } from "react";
import {
  Store, TrendingUp, Truck, Wallet, Headphones, ShieldCheck,
  UserPlus, PackageCheck, IndianRupee, CheckCircle2,
} from "lucide-react";

const BENEFITS = [
  { icon: TrendingUp, title: "Reach more buyers", desc: "Sell to thousands of makers, students and businesses across India." },
  { icon: Wallet, title: "Fast payouts", desc: "Get paid quickly and securely for every order you fulfil." },
  { icon: Truck, title: "Logistics support", desc: "We help with shipping and delivery so you can focus on products." },
  { icon: Headphones, title: "Dedicated support", desc: "A seller support team to help you grow on Hardvanta." },
  { icon: ShieldCheck, title: "Trusted marketplace", desc: "List on a platform buyers already trust for electronics & robotics." },
  { icon: Store, title: "Your own storefront", desc: "Showcase your brand and full catalogue to a targeted audience." },
];

const STEPS = [
  { icon: UserPlus, title: "1. Apply", desc: "Fill in the form below with your business details." },
  { icon: PackageCheck, title: "2. List products", desc: "Our team helps you onboard and list your catalogue." },
  { icon: IndianRupee, title: "3. Start earning", desc: "Receive orders and get paid for every sale." },
];

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function SellPage() {
  const [form, setForm] = useState({ business: "", name: "", email: "", phone: "", products: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function set(k, v) {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!INDIAN_PHONE_REGEX.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organization: form.business,
          email: form.email,
          phone: form.phone,
          enquiryType: "Seller Application",
          products: form.products,
          quantity: "Seller onboarding",
          message: form.message,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not submit application.");
      }
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-navy via-royal-dark to-navy px-6 py-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Become a Partner</p>
        <h1 className="mt-2 text-4xl font-extrabold">Sell on Hardvanta</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
          Grow your electronics, robotics or DIY business by reaching thousands of
          buyers across India. Join Hardvanta as a seller today.
        </p>
        <a href="#apply" className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-sm font-bold text-navy hover:bg-silver-light transition-colors">
          Start Selling
        </a>
      </section>

      {/* Benefits */}
      <section className="container-page py-14">
        <h2 className="text-center text-2xl font-extrabold text-navy">Why sell with us?</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-silver-light bg-cloud p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-royal/10 text-royal">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-bold text-navy">{title}</h3>
              <p className="mt-1 text-sm text-silver-dark">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-cloud py-14">
        <div className="container-page">
          <h2 className="text-center text-2xl font-extrabold text-navy">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-royal text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-bold text-navy">{title}</h3>
                <p className="mt-1 text-sm text-silver-dark">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="container-page max-w-2xl py-14">
        <h2 className="text-2xl font-extrabold text-navy">Seller Application</h2>
        <p className="mt-1 text-sm text-silver-dark">
          Fill in your details and our team will get in touch with the next steps.
        </p>

        {status === "done" ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl bg-green-50 p-10 text-center">
            <CheckCircle2 size={52} className="text-green-500" />
            <h3 className="mt-4 text-xl font-bold text-navy">Application received!</h3>
            <p className="mt-2 text-sm text-silver-dark">
              Thanks for your interest in selling on Hardvanta. Our team will
              reach out to <span className="font-semibold">{form.email}</span> soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-8 shadow-sm border border-silver-light">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business / Brand name" value={form.business} onChange={(v) => set("business", v)} required />
              <Field label="Contact person" value={form.name} onChange={(v) => set("name", v)} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                required
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                error={phoneError}
              />
            </div>
            <Field label="What products do you sell?" value={form.products} onChange={(v) => set("products", v)} placeholder="e.g. Arduino boards, sensors, 3D printer parts" required />
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Message (optional)</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Tell us about your business…"
                className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-royal py-3 text-sm font-bold text-white hover:bg-royal-dark transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder, inputMode, maxLength, error }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? "true" : "false"}
        className={
          "w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 " +
          (error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-silver-dark focus:border-royal focus:ring-royal/20")
        }
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
