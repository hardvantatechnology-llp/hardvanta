"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import Logo from "./Logo";

// X (Twitter) official SVG — lucide doesn't have the X logo
function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

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
      { label: "Hardvanta B2B", href: "/b2b" },
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

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: XIcon, href: "#", label: "X" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all",
    label: "LinkedIn",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/hardvantatechnologies",
    label: "Instagram",
  },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const reduce = useReducedMotion();
  const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-graphite to-obsidian text-silver-light">
      {/* Ambient top glow */}
      <div className="liquid-blob left-1/4 top-[-160px] h-72 w-72 bg-electric/20" />
      <div className="liquid-blob right-1/4 top-[-120px] h-72 w-72 bg-liquid/15" style={{ animationDelay: "-6s" }} />

      {/* Newsletter strip */}
      <div className="relative border-b border-white/10">
        <div className="container-page grid items-center gap-6 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="mt-1 text-sm text-white/50">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="First Name"
              className="w-full rounded-lg glass px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-shadow focus:shadow-glow-electric sm:w-1/3"
            />
            <input
              type="email"
              placeholder="Email Id"
              className="w-full flex-1 rounded-lg glass px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-shadow focus:shadow-glow-electric"
            />
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric to-liquid px-5 py-2.5 text-sm font-semibold text-white shadow-glow-electric transition-all hover:brightness-110"
            >
              <Mail size={15} /> Subscribe
            </button>
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
          <Logo size={56} dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            India&apos;s store for robotics, electronics and DIY engineering
            products. Your ideas, our parts!
          </p>
          <p className="mt-1 text-xs text-white/30">
            A unit of Hardvanta Technologies
          </p>

          {/* Contact */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Got Questions?
            </p>
            <p className="mt-0.5 text-xs text-white/50">
              Call us 9:15 AM – 6:15 PM, Mon–Sat
            </p>
            <a
              href="tel:+919170546395"
              className="mt-2 flex items-center gap-2 text-white hover:text-electric-light transition-colors"
            >
              <Phone size={15} className="text-electric-light" />
              <span className="font-semibold">+91 91705 46395</span>
            </a>
          </div>

          {/* App store buttons */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs text-white hover:shadow-glow-electric transition-all"
            >
              <span>▶</span> Google Play
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg glass px-3 py-2 text-xs text-white hover:shadow-glow-electric transition-all"
            >
              <span></span> App Store
            </a>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {col.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-electric-light transition-colors"
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
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-white/30">
            © 2026 Hardvanta — All Rights Reserved.
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
                className="flex h-8 w-8 items-center justify-center rounded-full glass text-white hover:shadow-glow-electric hover:-translate-y-0.5 transition-all"
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
