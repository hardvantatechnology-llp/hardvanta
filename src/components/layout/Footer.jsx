"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, Check } from "lucide-react";
import Logo from "./Logo";
import { socials } from "@/lib/socialLinks";

const columns = [
  {
    title: "Information",
    links: [
      { label: "Track Your Order", href: "/orders" },
      { label: "Videos", href: "/videos" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Payment Options", href: "/payment-options" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "HV KART B2B", href: "/b2b" },
      { label: "Bulk Orders", href: "/b2b#bulk" },
      { label: "Prototyping Services", href: "/b2b#prototyping" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Investor Relations", href: "/investor-relations" },
      { label: "CSR", href: "/csr" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping & Refund", href: "/shipping-refund" },
      { label: "E-Waste Collection", href: "/ewaste" },
    ],
  },
];

export default function Footer() {
  const reduce = useReducedMotion();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // idle | loading | success | error
  const [newsletterError, setNewsletterError] = useState("");

  async function handleNewsletterSubmit() {
    if (!newsletterEmail.trim() || newsletterStatus === "loading") return;
    setNewsletterStatus("loading");
    setNewsletterError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe. Please try again.");
      setNewsletterStatus("success");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterError(err.message || "Could not subscribe. Please try again.");
    }
  }
  const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg text-brand-text">
      {/* Ambient top glow */}
      <div className="liquid-blob left-1/4 top-[-160px] h-72 w-72 bg-brand-blue/10" />
      <div className="liquid-blob right-1/4 top-[-120px] h-72 w-72 bg-brand-navy/10" style={{ animationDelay: "-6s" }} />

      {/* Newsletter strip */}
      <div className="relative border-b border-brand-border">
        <div className="container-page grid items-center gap-6 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-brand-text">
              Subscribe to our Newsletter
            </h3>
            <p className="mt-1 text-sm text-brand-muted">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                placeholder="Email Id"
                aria-label="Email address"
                className="w-full flex-1 rounded-lg glass-brand px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none transition-shadow focus:shadow-brand-glow"
              />
              <button
                type="button"
                onClick={handleNewsletterSubmit}
                disabled={newsletterStatus === "loading" || !newsletterEmail.trim()}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-brand-glow transition-all hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100"
              >
                {newsletterStatus === "success" ? <Check size={15} /> : <Mail size={15} />}
                {newsletterStatus === "loading" ? "Subscribing…" : newsletterStatus === "success" ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
            {newsletterStatus === "error" && (
              <p className="mt-2 text-xs text-red-600">{newsletterError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <motion.div
        {...(reduce ? {} : reveal)}
        className="relative container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-2 md:grid-cols-6"
      >

        {/* Brand col */}
        <div className="col-span-2">
          <Logo size={56} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-muted">
            India&apos;s store for robotics, electronics and DIY engineering
            products. Your ideas, our parts!
          </p>
          <p className="mt-1 text-xs text-brand-muted/70">
            A unit of HV KART
          </p>

          {/* Contact */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Got Questions?
            </p>
            <p className="mt-0.5 text-xs text-brand-muted">
              Call us 9:15 AM – 6:15 PM, Mon–Sat
            </p>
            <a
              href="tel:+919170546395"
              className="mt-2 flex items-center gap-2 text-brand-text hover:text-brand-blue transition-colors"
            >
              <Phone size={15} className="text-brand-blue" />
              <span className="font-semibold">+91 91705 46395</span>
            </a>
          </div>

          {/* App store buttons */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg glass-brand px-3 py-2 text-xs text-brand-text hover:shadow-brand-glow transition-all"
            >
              <span>▶</span> Google Play
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg glass-brand px-3 py-2 text-xs text-brand-text hover:shadow-brand-glow transition-all"
            >
              <span></span> App Store
            </a>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-text">
              {col.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-brand-muted hover:text-brand-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      {/* Bottom bar */}
      <div className="relative border-t border-brand-border">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-brand-muted/70">
            © 2026 HV KART — All Rights Reserved.
          </p>

          {/* Social icons */}
          <div className="flex gap-2">
            {socials.map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full glass-brand text-brand-text hover:shadow-brand-glow hover:-translate-y-0.5 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
