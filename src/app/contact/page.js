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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian px-6 py-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">
          We&apos;re Here to Help
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
          Have a question, bulk enquiry, or need technical support? Reach out
          to us — our team is available Mon–Sat, 9:15 AM to 6:15 PM.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="container-page relative py-14">
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
              className="rounded-2xl glass-card p-6 text-center"
            >
              <span className="text-4xl">{c.icon}</span>
              <h3 className="mt-3 font-bold text-white">{c.title}</h3>
              <p className="mt-1 text-sm font-semibold text-electric-light">{c.info}</p>
              <p className="mt-1 text-xs text-white/40">{c.sub}</p>
              <a
                href={c.href}
                className="mt-4 inline-block rounded-lg bg-gradient-to-r from-electric to-liquid px-6 py-2 text-xs font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all"
              >
                {c.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative bg-graphite py-14">
        <div className="container-page max-w-2xl">
          <h2 className="text-2xl font-extrabold text-white">
            Send Us a Message
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Fill in the form below and we&apos;ll get back to you shortly.
          </p>

          <div className="mt-8 space-y-4 rounded-2xl glass-strong p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-first-name" className="mb-1 block text-sm font-medium text-white/80">
                  First Name
                </label>
                <input
                  id="contact-first-name"
                  type="text"
                  placeholder="Rahul"
                  className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                />
              </div>
              <div>
                <label htmlFor="contact-last-name" className="mb-1 block text-sm font-medium text-white/80">
                  Last Name
                </label>
                <input
                  id="contact-last-name"
                  type="text"
                  placeholder="Sharma"
                  className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="rahul@example.com"
                className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-white/80">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile number"
                aria-invalid={phoneError ? "true" : "false"}
                className={
                  "w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 " +
                  (phoneError ? "shadow-[0_0_0_1px_rgba(248,113,113,0.6)]" : "focus:shadow-glow-electric")
                }
              />
              {phoneError && (
                <p className="mt-1 text-xs font-medium text-red-400">{phoneError}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-white/80">
                Subject
              </label>
              <select id="contact-subject" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric">
                <option className="bg-graphite">General Enquiry</option>
                <option className="bg-graphite">Technical Support</option>
                <option className="bg-graphite">Bulk / B2B Order</option>
                <option className="bg-graphite">Shipping Issue</option>
                <option className="bg-graphite">Return / Refund</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-white/80">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us how we can help you..."
                className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
              />
            </div>

            {/* No submit handler: there's no API route that persists contact messages yet
                (admin/contact only reads existing ones) — wiring this up is backend work,
                out of scope for a UI-only pass. */}
            <button
              type="button"
              className="w-full rounded-lg bg-gradient-to-r from-electric to-liquid py-3 text-sm font-bold text-white shadow-glow-electric hover:brightness-110 transition-all"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}