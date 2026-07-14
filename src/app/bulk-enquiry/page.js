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
    <div>
      {/* Hero */}
      <div className="bg-navy text-white">
        <div className="container-page py-10">
          <nav className="mb-6 flex items-center gap-1 text-sm text-silver">
            <Link href="/" className="hover:text-royal-light">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Bulk Enquiry</span>
          </nav>

          <div className="flex items-center gap-2 text-royal-light">
            <Building2 size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Hardvanta B2B</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Bulk & Educational Orders
          </h1>
          <p className="mt-3 max-w-2xl text-silver">
            Special pricing for schools, colleges, makerspaces, resellers and
            corporates. Tell us what you need and our team will get back to
            you with a custom quote within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-page py-12">

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-silver-light bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cloud text-royal">
                <Icon size={20} />
              </div>
              <h3 className="mt-3 font-bold text-navy">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">{desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-navy">Volume Pricing</h2>
          <p className="mt-1 text-sm text-ink/70">
            Indicative discount tiers based on order value. Final pricing is
            confirmed in your custom quote.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 ${
                  tier.highlight
                    ? "border-royal bg-cloud shadow-md"
                    : "border-silver-light bg-white"
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-block rounded-full bg-royal px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-navy">{tier.name}</h3>
                <p className="mt-1 text-sm text-ink/70">{tier.range}</p>
                <p className="mt-3 text-2xl font-extrabold text-royal">{tier.discount}</p>
                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-royal" />
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
            <h2 className="text-2xl font-bold text-navy">Get a Custom Quote</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Fill in the form and our B2B team will reach out with pricing,
              lead times, and availability for your requirement.
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-silver-light bg-cloud p-4">
              <GraduationCap size={22} className="shrink-0 text-royal" />
              <p className="text-sm text-ink/80">
                Schools and colleges get additional education pricing — mention
                your institution name in the form below.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="rounded-2xl border border-silver-light bg-white p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-royal" />
                <h3 className="mt-4 text-lg font-bold text-navy">
                  Enquiry submitted!
                </h3>
                <p className="mt-2 text-sm text-ink/70">
                  Thank you — our team will get back to you within 24 hours
                  with a custom quote.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-5 rounded-lg bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal-dark transition-colors"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-silver-light bg-white p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => update("organization", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="School, company, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      aria-invalid={phoneError ? "true" : "false"}
                      className={
                        "w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy outline-none " +
                        (phoneError
                          ? "border-red-400 focus:border-red-500"
                          : "border-silver focus:border-royal")
                      }
                      placeholder="10-digit mobile number"
                    />
                    {phoneError && (
                      <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Enquiry Type
                    </label>
                    <select
                      value={form.enquiryType}
                      onChange={(e) => update("enquiryType", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                    >
                      {enquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Products Needed *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.products}
                      onChange={(e) => update("products", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="e.g. Arduino Uno, ESP32, sensors..."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Estimated Quantity *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                      className="w-full rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="e.g. 50 units"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-navy">
                      Additional Details
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="w-full resize-none rounded-lg border border-silver px-3.5 py-2.5 text-sm text-navy outline-none focus:border-royal"
                      placeholder="Timeline, budget, delivery location, etc."
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm font-medium text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-royal-dark transition-colors disabled:opacity-60"
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