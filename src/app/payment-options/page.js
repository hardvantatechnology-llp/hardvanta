"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────── */

const sections = [
  {
    id: "online-payment",
    label: "Online Payment",
    emoji: "💳",
    title: "Online Payment (Razorpay)",
    body: "Pay instantly and securely using our trusted payment partner, Razorpay. Online payments are the fastest way to confirm your order and get it shipped quickly.",
    extra:
      "Razorpay is a PCI-DSS Level 1 compliant payment gateway, which means your payment data is handled to the highest security standards in the industry. Hardvanta never sees or stores your card details — all sensitive data is encrypted and managed entirely by Razorpay.",
    highlight: null,
    list: null,
    sub: {
      title: "🗂️ Supported Payment Methods",
      items: [
        { icon: "📲", text: "UPI — Google Pay, PhonePe, Paytm, BHIM, and all UPI-enabled apps" },
        { icon: "💳", text: "Debit Cards — Visa, Mastercard, RuPay, and Maestro" },
        { icon: "🏦", text: "Credit Cards — Visa, Mastercard, and American Express" },
        { icon: "🌐", text: "Net Banking — All major Indian banks supported" },
        { icon: "📱", text: "Mobile Wallets — Paytm Wallet, Amazon Pay, and more" },
        { icon: "💵", text: "Cash on Delivery (COD) — Available in select locations" },
      ],
    },
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    emoji: "💵",
    title: "Cash on Delivery (COD)",
    body: "Prefer to pay when your order arrives? Select Cash on Delivery at checkout and pay the delivery agent in cash upon receipt of your package. No advance payment required.",
    extra: null,
    highlight: "Please keep the exact change ready to help our delivery partners serve you faster. 🙏",
    list: null,
    sub: {
      title: "📍 COD Availability",
      paragraph:
        "Cash on Delivery is available in selected pin codes and locations across India. Availability may vary based on your delivery address and the items in your order. If COD is available for your location, it will appear as a payment option during checkout. If you don't see it, we recommend using one of our secure online payment methods.",
    },
  },
  {
    id: "security",
    label: "Payment Security",
    emoji: "🔒",
    title: "Payment Security",
    body: "Your security is our top priority. Here is how we keep every transaction safe:",
    extra: null,
    highlight: null,
    list: [
      { icon: "🔐", label: "SSL Encryption", desc: "All data is protected using 256-bit SSL (Secure Socket Layer) encryption." },
      { icon: "✅", label: "PCI-DSS Compliance", desc: "Payments processed by Razorpay — a certified PCI-DSS Level 1 provider." },
      { icon: "🚫", label: "No Card Storage", desc: "Hardvanta never stores your card number, CVV, or any sensitive payment details." },
      { icon: "🛡️", label: "3D Secure Authentication", desc: "Card transactions are protected by an additional OTP-based authentication layer." },
    ],
    sub: {
      title: "❓ Is Online Payment Safe?",
      paragraph:
        "Absolutely. All payments on hardvanta are encrypted end-to-end and processed through Razorpay's secure infrastructure. You are protected by Razorpay's fraud detection, your bank's security protocols, and our SSL-secured checkout — all working together.",
    },
  },
  {
    id: "refunds",
    label: "Refunds",
    emoji: "↩️",
    title: "Refunds & Processing Time",
    body: "If you are eligible for a refund, here is what to expect:",
    extra: null,
    highlight: "Processing times may vary by bank. If your refund hasn't arrived after 7 business days, contact our support team with your order details.",
    list: [
      { icon: "⚡", label: "Online Payments (UPI, Cards, Net Banking, Wallets)", desc: "Credited back to the original payment method within 5–7 business days of approval." },
      { icon: "🏧", label: "Cash on Delivery", desc: "Processed as a bank transfer or UPI credit. Please provide your bank details when raising a refund request." },
    ],
    sub: null,
  },
  {
    id: "troubleshoot",
    label: "Payment Failure",
    emoji: "⚠️",
    title: "Payment Failure & Troubleshooting",
    body: "If your payment did not go through, here are a few things to check:",
    extra:
      "If an amount was debited but your order was not confirmed, please wait 24 hours — most such amounts are automatically refunded by your bank. If not, contact us with your transaction reference number.",
    highlight: "Failed payment attempts are not charged. If you were charged for an unsuccessful order, contact our support team and we will resolve it promptly. ✅",
    list: [
      { icon: "✏️", label: "Double-check card / UPI details", desc: "Ensure all payment details are entered correctly." },
      { icon: "💰", label: "Check balance & limits", desc: "Confirm your card has sufficient balance and is enabled for online transactions." },
      { icon: "📶", label: "Stable internet", desc: "Make sure your connection is stable throughout the checkout process." },
      { icon: "🔑", label: "UPI PIN & bank account", desc: "Verify your UPI PIN is correct and your linked bank account is active." },
    ],
    sub: null,
  },
];

const navLinks = sections.map((s) => ({ id: s.id, label: s.label, emoji: s.emoji }));

/* ─── Section Card ─────────────────────────────────────────── */

function SectionCard({ section, index }) {
  return (
    <div
      id={section.id}
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "clamp(20px, 4vw, 32px)",
        marginBottom: "18px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.45)",
        scrollMarginTop: "24px",
      }}
    >
      {/* Section label */}
      <p
        style={{
          margin: "0 0 6px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        SECTION {String(index + 1).padStart(2, "0")}
      </p>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div
          style={{
            flexShrink: 0,
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(168,85,247,0.2) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {section.emoji}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Body */}
      <p style={{ margin: "0 0 12px", fontSize: "clamp(13.5px, 3vw, 15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
        {section.body}
      </p>

      {/* Bullet list */}
      {section.list && (
        <div style={{ margin: "16px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
          {section.list.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "10px",
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "clamp(13px, 3vw, 14px)", color: "#ffffff" }}>
                  {item.label}
                </p>
                <p style={{ margin: 0, fontSize: "clamp(12.5px, 2.8vw, 13.5px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra paragraph */}
      {section.extra && (
        <p style={{ margin: "12px 0", fontSize: "clamp(13.5px, 3vw, 15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
          {section.extra}
        </p>
      )}

      {/* Blue highlight callout */}
      {section.highlight && (
        <div
          style={{
            background: "rgba(59,130,246,0.1)",
            borderLeft: "3px solid #3b82f6",
            borderRadius: "6px",
            padding: "12px 16px",
            marginTop: "14px",
            fontSize: "clamp(12.5px, 2.8vw, 13.5px)",
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.65,
          }}
        >
          <strong>💡 Good to know: </strong>{section.highlight}
        </div>
      )}

      {/* Sub-section */}
      {section.sub && (
        <div
          style={{
            marginTop: "22px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "clamp(14px, 3.5vw, 16px)",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {section.sub.title}
          </h3>

          {/* Sub list items */}
          {section.sub.items && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {section.sub.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ margin: 0, fontSize: "clamp(13px, 3vw, 14px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Sub paragraph */}
          {section.sub.paragraph && (
            <p style={{ margin: 0, fontSize: "clamp(13.5px, 3vw, 15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              {section.sub.paragraph}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function PaymentOptionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: Inter, system-ui, -apple-system, sans-serif; }

        .pay-hero { padding: 44px 20px 56px; }
        @media (min-width: 640px)  { .pay-hero { padding: 56px 32px 68px; } }
        @media (min-width: 1024px) { .pay-hero { padding: 72px 48px 80px; } }

        .pay-body { max-width: 860px; margin: 0 auto; padding: 28px 16px 72px; }
        @media (min-width: 640px)  { .pay-body { padding: 36px 24px 80px; } }
        @media (min-width: 1024px) { .pay-body { padding: 48px 32px 96px; } }

        .nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 20px;
        }
        @media (min-width: 700px) { .nav-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .method-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin: 20px 0 0;
        }
        @media (min-width: 560px) { .method-grid { grid-template-columns: 1fr 1fr; } }

        .cta-card { padding: 32px 20px; }
        @media (min-width: 640px) { .cta-card { padding: 44px 36px; } }

        a:focus-visible, button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 3px;
          border-radius: 6px;
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; scroll-behavior: auto !important; } }
      `}} />

      <div style={{ background: "#0d0f16", minHeight: "100vh" }}>

        {/* ══════ HERO ══════ */}
        <div
          className="pay-hero"
          style={{
            background: "linear-gradient(135deg,#1e2a6e 0%,#2d3a8c 55%,#1a237e 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* dot-grid texture */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
            {/* pill badge */}
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: "999px", padding: "5px 15px", marginBottom: "18px",
                fontSize: "11px", fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.09em", textTransform: "uppercase",
              }}
            >
              💳 PAYMENTS & SECURITY
            </div>

            <h1
              style={{
                fontSize: "clamp(1.75rem,6vw,2.9rem)",
                fontWeight: 800, color: "#ffffff",
                lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "12px",
              }}
            >
              Payment Options
            </h1>

            <p
              style={{
                fontSize: "clamp(13px,3.2vw,15px)",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.65, maxWidth: "500px",
              }}
            >
              Choose the payment method that works best for you. All transactions on hardvanta
              are processed securely — your financial information is always protected. 🔐
            </p>

            {/* Trust badges row */}
            <div
              style={{
                display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px",
              }}
            >
              {["🔒 256-bit SSL", "✅ PCI-DSS Level 1", "🚫 No Card Storage", "🛡️ 3D Secure"].map((badge) => (
                <div
                  key={badge}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "clamp(11px,2.5vw,12.5px)",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════ BODY ══════ */}
        <div className="pay-body">

          {/* "On this page" nav card */}
          <div
            style={{
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px", padding: "22px 24px", marginBottom: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.45)",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
              ON THIS PAGE
            </p>
            <nav className="nav-grid" aria-label="Payment sections">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
                  style={{
                    fontSize: "clamp(12px,3vw,13px)", color: "#3b82f6",
                    textDecoration: "none",
                    display: "flex", alignItems: "flex-start", gap: "5px", lineHeight: 1.45,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>›</span>
                  {link.emoji} {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Section cards */}
          {sections.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}

          {/* ── Contact / CTA card ── */}
          <div
            className="cta-card"
            style={{
              background: "linear-gradient(135deg,#1e2a6e 0%,#2d3a8c 100%)",
              borderRadius: "14px", textAlign: "center", marginTop: "8px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🤝</div>
            <h3 style={{ fontSize: "clamp(17px,4vw,21px)", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
              Need Help?
            </h3>
            <p style={{ fontSize: "clamp(13px,3vw,14.5px)", color: "rgba(255,255,255,0.72)", marginBottom: "24px", lineHeight: 1.65 }}>
              Have a question about a payment, refund, or transaction? Our support team is here to help.
            </p>

            {/* Contact details */}
            <div
              style={{
                display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "10px", padding: "12px 20px",
                  fontSize: "clamp(12.5px,3vw,14px)", color: "#ffffff", lineHeight: 1.5,
                }}
              >
                📧 <strong>Email</strong><br />
                <span style={{ color: "rgba(255,255,255,0.8)" }}>support@hardvantatechnology.com</span>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "10px", padding: "12px 20px",
                  fontSize: "clamp(12.5px,3vw,14px)", color: "#ffffff", lineHeight: 1.5,
                }}
              >
                📞 <strong>Phone</strong><br />
                <span style={{ color: "rgba(255,255,255,0.8)" }}>+91-9170546395 (Mon–Sat, 10 AM – 6 PM IST)</span>
              </div>
            </div>

            <p style={{ fontSize: "clamp(11.5px,2.5vw,13px)", color: "rgba(255,255,255,0.55)", marginBottom: "20px" }}>
              When contacting us, please have your <strong style={{ color: "rgba(255,255,255,0.8)" }}>Order ID</strong> and <strong style={{ color: "rgba(255,255,255,0.8)" }}>transaction reference number</strong> ready.
            </p>

            <Link
              href="/contact"
              style={{
                display: "inline-block", background: "#ffffff",
                color: "#1e2a6e", fontWeight: 700,
                fontSize: "clamp(13px,3vw,14.5px)",
                padding: "12px 32px", borderRadius: "8px",
                textDecoration: "none", letterSpacing: "0.01em",
              }}
            >
              📧 Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}