"use client";

import { useState } from "react";

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

const SUBJECTS = [
  "General Enquiry",
  "Technical Support",
  "Bulk / B2B Order",
  "Shipping Issue",
  "Return / Refund",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: SUBJECTS[0],
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhoneChange(e) {
    // Strip anything that isn't a digit, cap at 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    update("phone", digitsOnly);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.phone && !INDIAN_PHONE_REGEX.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number, or leave it blank.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setStatus("success");
      setForm(initialForm);
      setPhoneError("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Could not send your message. Please try again.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-blue/10" />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-brand-navy via-brand-blue to-brand-navy px-6 py-16 text-center text-white">
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
              info: "support@hardvantatechnology.com",
              sub: "We reply within 24 hours",
              href: "mailto:support@hardvantatechnology.com",
              label: "Send Email",
            },
            {
              icon: "📍",
              title: "Our Office",
              info: "HV KART LLP",
              sub: "Plot 046, Knowledge Park III,Alpha, Greater Noida, UP 201310",
              href: "#",
              label: "Get Directions",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl glass-brand-card p-6 text-center"
            >
              <span className="text-4xl">{c.icon}</span>
              <h3 className="mt-3 font-bold text-brand-text">{c.title}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-blue">{c.info}</p>
              <p className="mt-1 text-xs text-brand-muted">{c.sub}</p>
              <a
                href={c.href}
                className="mt-4 inline-block rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-6 py-2 text-xs font-semibold text-white shadow-brand-glow hover:brightness-110 transition-all"
              >
                {c.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative bg-white py-14">
        <div className="container-page max-w-2xl">
          <h2 className="text-2xl font-extrabold text-brand-text">
            Send Us a Message
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Fill in the form below and we&apos;ll get back to you shortly.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-2xl glass-brand-strong p-8 text-center">
              <span className="text-4xl">✅</span>
              <h3 className="mt-3 text-lg font-bold text-brand-text">Message sent!</h3>
              <p className="mt-2 text-sm text-brand-muted">
                Thanks for reaching out — our team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-brand-glow hover:brightness-110 transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl glass-brand-strong p-8">
              {status === "error" && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-first-name" className="mb-1 block text-sm font-medium text-brand-text">
                    First Name
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="Rahul"
                    className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow placeholder:text-brand-muted"
                  />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="mb-1 block text-sm font-medium text-brand-text">
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Sharma"
                    className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow placeholder:text-brand-muted"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-brand-text">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow placeholder:text-brand-muted"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-brand-text">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit mobile number"
                  aria-invalid={phoneError ? "true" : "false"}
                  className={
                    "w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none placeholder:text-brand-muted " +
                    (phoneError ? "shadow-[0_0_0_1px_rgba(248,113,113,0.6)]" : "focus:shadow-brand-glow")
                  }
                />
                {phoneError && (
                  <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-brand-text">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-brand-text">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="w-full rounded-lg glass-brand-card px-3 py-2.5 text-sm text-brand-text outline-none focus:shadow-brand-glow placeholder:text-brand-muted"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy py-3 text-sm font-bold text-white shadow-brand-glow hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}