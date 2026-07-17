"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Building2,
  GraduationCap,
  Truck,
  ShieldCheck,
  Headphones,
  Percent,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const tiers = [
  {
    name: "Starter",
    range: "₹10,000 – ₹49,999",
    discount: "5% off",
    features: [
      "Standard bulk pricing",
      "Single delivery address",
      "Email support",
    ],
  },
  {
    name: "Growth",
    range: "₹50,000 – ₹1,99,999",
    discount: "10% off",
    highlight: true,
    features: [
      "Priority bulk pricing",
      "Multi-address delivery",
      "Dedicated account manager",
      "Net 15 payment terms (verified buyers)",
    ],
  },
  {
    name: "Enterprise",
    range: "₹2,00,000+",
    discount: "Custom pricing",
    features: [
      "Negotiated volume pricing",
      "Custom packaging & labeling",
      "Dedicated technical support",
      "Flexible payment terms",
    ],
  },
];

const benefits = [
  {
    Icon: Percent,
    title: "Volume Discounts",
    desc: "Tiered pricing that scales with your order size — the more you buy, the more you save.",
  },
  {
    Icon: Truck,
    title: "Reliable Bulk Shipping",
    desc: "Pan-Delhi NCR logistics for large orders, with multi-address delivery for institutions.",
  },
  {
    Icon: ShieldCheck,
    title: "Genuine Parts, Guaranteed",
    desc: "Every component is sourced and tested for authenticity — no greymarket parts.",
  },
  {
    Icon: Headphones,
    title: "Dedicated Support",
    desc: "A real person to help with BOM planning, substitutions, and order tracking.",
  },
];

const enquiryTypes = ["School / College", "Reseller / Distributor", "Corporate / Startup", "Other"];

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function BulkEnquiryPage() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    enquiryType: enquiryTypes[0],
    products: "",
    quantity: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function update(field, value) {
    if (field === "phone") {
      // Strip anything that isn't a digit, cap at 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
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

    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!INDIAN_PHONE_REGEX.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setStatus("success");
      setForm({
        name: "",
        organization: "",
        email: "",
        phone: "",
        enquiryType: enquiryTypes[0],
        products: "",
        quantity: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Could not submit your enquiry. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian text-white">
        <div className="container-page py-10">
          <nav className="mb-6 flex items-center gap-1 text-sm text-white/50">
            <Link href="/" className="hover:text-electric-light">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Bulk Enquiry</span>
          </nav>

          <div className="flex items-center gap-2 text-electric-light">
            <Building2 size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Hardvanta B2B</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Bulk & Educational Orders
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Special pricing for schools, colleges, makerspaces, resellers and
            corporates. Tell us what you need and our team will get back to
            you with a custom quote within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-page relative py-12">

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-xl glass-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/10 text-electric-light">
                <Icon size={20} />
              </div>
              <h3 className="mt-3 font-bold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-white">Volume Pricing</h2>
          <p className="mt-1 text-sm text-white/60">
            Indicative discount tiers based on order value. Final pricing is
            confirmed in your custom quote.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl glass-card p-6 ${
                  tier.highlight
                    ? "border-electric/40 shadow-glow-electric"
                    : ""
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-electric to-liquid px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/60">{tier.range}</p>
                <p className="mt-3 text-2xl font-extrabold text-electric-light">{tier.discount}</p>
                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-electric-light" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry form */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-5">

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white">Get a Custom Quote</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Fill in the form and our B2B team will reach out with pricing,
              lead times, and availability for your requirement.
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-xl glass-card p-4">
              <GraduationCap size={22} className="shrink-0 text-electric-light" />
              <p className="text-sm text-white/70">
                Schools and colleges get additional education pricing — mention
                your institution name in the form below.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="rounded-2xl glass-card p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-electric-light" />
                <h3 className="mt-4 text-lg font-bold text-white">
                  Enquiry submitted!
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Thank you — our team will get back to you within 24 hours
                  with a custom quote.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-5 rounded-lg bg-gradient-to-r from-electric to-liquid px-5 py-2.5 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl glass-card p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-name" className="mb-1.5 block text-sm font-medium text-white/80">
                      Full Name *
                    </label>
                    <input
                      id="bulk-name"
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-organization" className="mb-1.5 block text-sm font-medium text-white/80">
                      Organization
                    </label>
                    <input
                      id="bulk-organization"
                      type="text"
                      value={form.organization}
                      onChange={(e) => update("organization", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="School, company, etc."
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-email" className="mb-1.5 block text-sm font-medium text-white/80">
                      Email *
                    </label>
                    <input
                      id="bulk-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-phone" className="mb-1.5 block text-sm font-medium text-white/80">
                      Phone *
                    </label>
                    <input
                      id="bulk-phone"
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      aria-invalid={phoneError ? "true" : "false"}
                      className={
                        "w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/30 " +
                        (phoneError
                          ? "shadow-[0_0_0_1px_rgba(248,113,113,0.6)]"
                          : "focus:shadow-glow-electric")
                      }
                      placeholder="10-digit mobile number"
                    />
                    {phoneError && (
                      <p className="mt-1 text-xs font-medium text-red-400">{phoneError}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bulk-enquiry-type" className="mb-1.5 block text-sm font-medium text-white/80">
                      Enquiry Type
                    </label>
                    <select
                      id="bulk-enquiry-type"
                      value={form.enquiryType}
                      onChange={(e) => update("enquiryType", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric"
                    >
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t} className="bg-graphite text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bulk-products" className="mb-1.5 block text-sm font-medium text-white/80">
                      Products Needed *
                    </label>
                    <input
                      id="bulk-products"
                      required
                      type="text"
                      value={form.products}
                      onChange={(e) => update("products", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="e.g. Arduino Uno, ESP32, sensors..."
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-quantity" className="mb-1.5 block text-sm font-medium text-white/80">
                      Estimated Quantity *
                    </label>
                    <input
                      id="bulk-quantity"
                      required
                      type="text"
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                      className="w-full rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="e.g. 50 units"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bulk-message" className="mb-1.5 block text-sm font-medium text-white/80">
                      Additional Details
                    </label>
                    <textarea
                      id="bulk-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="w-full resize-none rounded-lg glass-card px-3.5 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                      placeholder="Timeline, budget, delivery location, etc."
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm font-medium text-red-400">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric to-liquid px-5 py-3 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                  {status === "loading" ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}