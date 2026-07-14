"use client";

import { useState } from "react";

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function ContactPage() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function handlePhoneChange(e) {
    // Strip anything that isn't a digit, cap at 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);

    if (digitsOnly.length === 0) {
      setPhoneError("");
    } else if (digitsOnly.length < 10) {
      setPhoneError("Phone number must be 10 digits");
    } else if (!INDIAN_PHONE_REGEX.test(digitsOnly)) {
      setPhoneError("Enter a valid Indian mobile number (must start with 6-9)");
    } else {
      setPhoneError("");
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-r from-navy via-royal-dark to-navy px-6 py-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">
          We&apos;re Here to Help
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
          Have a question, bulk enquiry, or need technical support? Reach out
          to us — our team is available Mon–Sat, 9:15 AM to 6:15 PM.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="container-page py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: "📞",
              title: "Call Us",
              info: "+91 91705 46395",
              sub: "Mon–Sat, 9:15 AM – 6:15 PM",
              href: "tel:+919170546395",
              label: "Call Now",
            },
            {
              icon: "✉️",
              title: "Email Us",
              info: "support@hardvantatechnology@gmail.com",
              sub: "We reply within 24 hours",
              href: "mailto:support@hardvantatechnology@gmail.com",
              label: "Send Email",
            },
            {
              icon: "📍",
              title: "Our Office",
              info: "Hardvanta Technologies LLP",
              sub: "Plot 046, Knowledge Park III,Alpha, Greater Noida, UP 201310",
              href: "#",
              label: "Get Directions",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-silver-light bg-cloud p-6 text-center shadow-sm"
            >
              <span className="text-4xl">{c.icon}</span>
              <h3 className="mt-3 font-bold text-navy">{c.title}</h3>
              <p className="mt-1 text-sm font-semibold text-royal">{c.info}</p>
              <p className="mt-1 text-xs text-silver-dark">{c.sub}</p>
              <a
                href={c.href}
                className="mt-4 inline-block rounded-lg bg-navy px-6 py-2 text-xs font-semibold text-white hover:bg-royal transition-colors"
              >
                {c.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-cloud py-14">
        <div className="container-page max-w-2xl">
          <h2 className="text-2xl font-extrabold text-navy">
            Send Us a Message
          </h2>
          <p className="mt-1 text-sm text-silver-dark">
            Fill in the form below and we&apos;ll get back to you shortly.
          </p>

          <div className="mt-8 space-y-4 rounded-2xl bg-white p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Rahul"
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Sharma"
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Email
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Phone Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile number"
                aria-invalid={phoneError ? "true" : "false"}
                className={
                  "w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 " +
                  (phoneError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-silver-dark focus:border-royal focus:ring-royal/20")
                }
              />
              {phoneError && (
                <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Subject
              </label>
              <select className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20">
                <option>General Enquiry</option>
                <option>Technical Support</option>
                <option>Bulk / B2B Order</option>
                <option>Shipping Issue</option>
                <option>Return / Refund</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us how we can help you..."
                className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-royal py-3 text-sm font-bold text-white hover:bg-royal-dark transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}