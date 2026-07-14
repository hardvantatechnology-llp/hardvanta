"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    emoji: "📦",
    question: "How do I track my order?",
    answer:
      "Once you're logged in, head over to My Orders from your account dashboard. Each order shows a real-time status tracker — Order Placed → Processing → Shipped → Delivered — so you always know exactly where your package is.",
    highlight: null,
  },
  {
    emoji: "💳",
    question: "What payment methods do you accept?",
    answer:
      "We support all major payment methods including UPI, debit and credit cards, and netbanking — all processed securely via Razorpay. Prefer to pay on arrival? Cash on Delivery (COD) is available on eligible orders.",
    highlight: "Tip: UPI payments are instant and have zero additional charges.",
  },
  {
    emoji: "🚚",
    question: "What are the delivery charges?",
    answer:
      "We offer free shipping on all orders above ₹999. For orders below that threshold, a flat ₹49 shipping fee is applied at checkout — no hidden charges, ever.",
    highlight: null,
  },
  {
    emoji: "🇮🇳",
    question: "Do you ship across Delhi NCR ?",
    answer:
      "Yes. Hardvanta currently delivers exclusively across Delhi NCR. Simply enter your PIN code at checkout to confirm delivery availability in your location.",
    highlight: null,
  },
  
  {
    emoji: "🏫",
    question: "Do you offer bulk / institutional pricing?",
    answer:
      "Absolutely! Schools, colleges, makerspaces, and R&D labs can unlock special pricing and dedicated support through Hardvanta B2B. Reach out to our team with your institution details and requirements.",
    highlight: "Contact us at b2b@hardvanta.com for a custom quote.",
  },
];

function FAQCard({ faq, index, isOpen, onToggle }) {
  return (
    <div
      id={`faq-${index}`}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        marginBottom: "14px",
        overflow: "hidden",
        boxShadow: isOpen
          ? "0 4px 20px rgba(30,42,110,0.10)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.25s ease",
        scrollMarginTop: "20px",
      }}
    >
      {/* Accordion header — tap to open/close */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "20px 24px",
          }}
        >
          {/* Emoji bubble */}
          <div
            style={{
              flexShrink: 0,
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#eff3ff 0%,#e0e7ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            {faq.emoji}
          </div>

          {/* Question text */}
          <span
            style={{
              flex: 1,
              fontSize: "clamp(14px, 3.5vw, 16px)",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.4,
            }}
          >
            {faq.question}
          </span>

          {/* Chevron */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              flexShrink: 0,
              transition: "transform 0.25s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              color: "#6b7280",
            }}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Accordion body */}
      <div
        style={{
          maxHeight: isOpen ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <div
          style={{
            padding: "0 24px 24px 24px",
            borderTop: "1px solid #f3f4f6",
            paddingTop: "18px",
          }}
        >
          <p
            style={{
              margin: faq.highlight ? "0 0 14px" : "0",
              fontSize: "clamp(13.5px, 3vw, 15px)",
              color: "#374151",
              lineHeight: 1.8,
            }}
          >
            {faq.answer}
          </p>

          {faq.highlight && (
            <div
              style={{
                background: "#eff6ff",
                borderLeft: "3px solid #3b5bdb",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "clamp(12.5px, 2.8vw, 13.5px)",
                color: "#1e3a8a",
                lineHeight: 1.65,
              }}
            >
              <strong>💡 Good to know: </strong>
              {faq.highlight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <>
      {/* ── Global responsive styles injected once ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, system-ui, -apple-system, sans-serif; }

        .faq-hero { padding: 44px 20px 56px; }
        @media (min-width: 640px)  { .faq-hero { padding: 56px 32px 68px; } }
        @media (min-width: 1024px) { .faq-hero { padding: 72px 48px 80px; } }

        .faq-body { max-width: 860px; margin: 0 auto; padding: 28px 16px 72px; }
        @media (min-width: 640px)  { .faq-body { padding: 36px 24px 80px; } }
        @media (min-width: 1024px) { .faq-body { padding: 48px 32px 96px; } }

        .nav-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px 20px;
        }
        @media (min-width: 480px) { .nav-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 860px) { .nav-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .cta-card {
          border-radius: 14px;
          padding: 32px 20px;
          text-align: center;
        }
        @media (min-width: 640px) { .cta-card { padding: 44px 32px; } }

        a:focus-visible { outline: 2px solid #3b5bdb; outline-offset: 3px; border-radius: 4px; }
        button:focus-visible { outline: 2px solid #3b5bdb; outline-offset: 3px; border-radius: 10px; }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>

      <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>

        {/* ════ HERO — matches Privacy Policy exactly ════ */}
        <div
          className="faq-hero"
          style={{
            background:
              "linear-gradient(135deg, #1e2a6e 0%, #2d3a8c 55%, #1a237e 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* dot-grid texture */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            {/* pill badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: "999px",
                padding: "5px 15px",
                marginBottom: "18px",
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              ❓ HELP CENTER
            </div>

            <h1
              style={{
                fontSize: "clamp(1.75rem, 6vw, 2.9rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: "12px",
              }}
            >
              Frequently Asked Questions
            </h1>

            <p
              style={{
                fontSize: "clamp(13px, 3.2vw, 15px)",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.65,
                maxWidth: "460px",
              }}
            >
              Answers to the questions we hear most often from Hardvanta
              customers — last updated June 2026.
            </p>
          </div>
        </div>

        {/* ════ BODY ════ */}
        <div className="faq-body">

          {/* ── "On this page" nav card ── */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "22px 24px",
              marginBottom: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: "14px",
              }}
            >
              ON THIS PAGE
            </p>
            <nav className="nav-grid" aria-label="FAQ sections">
              {faqs.map((faq, i) => (
                <a
                  key={i}
                  href={`#faq-${i}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenIndex(i);
                    document
                      .getElementById(`faq-${i}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    fontSize: "clamp(12px, 3vw, 13px)",
                    color: "#3b5bdb",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "5px",
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "11px",
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
                  >
                    ›
                  </span>
                  {faq.emoji} {faq.question}
                </a>
              ))}
            </nav>
          </div>

          {/* ── FAQ accordion cards ── */}
          {faqs.map((faq, i) => (
            <FAQCard
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}

          {/* ── CTA card ── */}
          <div
            className="cta-card"
            style={{
              background:
                "linear-gradient(135deg, #1e2a6e 0%, #2d3a8c 100%)",
              marginTop: "10px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🙋</div>
            <h3
              style={{
                fontSize: "clamp(17px, 4vw, 21px)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              Still have questions?
            </h3>
            <p
              style={{
                fontSize: "clamp(13px, 3vw, 14.5px)",
                color: "rgba(255,255,255,0.72)",
                marginBottom: "22px",
                lineHeight: 1.6,
              }}
            >
              Our support team usually replies within a few hours.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: "#1e2a6e",
                fontWeight: 700,
                fontSize: "clamp(13px, 3vw, 14.5px)",
                padding: "12px 30px",
                borderRadius: "8px",
                textDecoration: "none",
                letterSpacing: "0.01em",
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