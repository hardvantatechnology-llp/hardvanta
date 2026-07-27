"use client";
import { useEffect, useRef } from "react";

function Row({ label, value, color }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "11px 0",
      borderBottom: "1px solid #D9DEE5",
    }}>
      <span style={{ fontSize: 14, color: "#6B7280" }}>{label}</span>
      <span style={{
        fontSize: 14,
        fontWeight: 600,
        color: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : "#1F2937",
      }}>
        {value}
      </span>
    </div>
  );
}

function Checklist({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#6B7280" }}>
          <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Note({ children }) {
  return (
    <p style={{ fontSize: 13, color: "#6B7280", margin: "10px 0 0 0", lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

function InfoBadge({ emoji, text, color }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: color === "green" ? "rgba(34,197,94,0.12)" : color === "red" ? "rgba(239,68,68,0.12)" : color === "amber" ? "rgba(245,158,11,0.12)" : "rgba(22,62,110,0.10)",
      border: `1px solid ${color === "green" ? "rgba(34,197,94,0.35)" : color === "red" ? "rgba(239,68,68,0.35)" : color === "amber" ? "rgba(245,158,11,0.35)" : "rgba(22,62,110,0.35)"}`,
      color: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : color === "amber" ? "#b45309" : "#163E6E",
      fontSize: 12,
      fontWeight: 600,
      padding: "4px 12px",
      borderRadius: 999,
      marginBottom: 12,
    }}>
      <span>{emoji}</span>
      <span>{text}</span>
    </div>
  );
}

export default function ShippingRefundPage() {
  const plusRef = useRef(null);

  useEffect(() => {
    const el = plusRef.current;
    if (!el) return;
    const cols = Math.ceil(window.innerWidth / 40) + 3;
    const rows = 10;
    let html = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        html += `<span style="position:absolute;left:${c * 40 - 2}px;top:${r * 40 - 2}px;font-size:13px;color:rgba(63,110,156,0.15);user-select:none;line-height:1">+</span>`;
      }
    }
    el.innerHTML = html;
  }, []);

  const px = "clamp(1.25rem, 5vw, 4rem)";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sr-section {
          padding: 1.5rem 0;
          border-bottom: 1px solid #D9DEE5;
        }
        .sr-section:last-child {
          border-bottom: none;
        }
        .sr-heading {
          font-size: 15px;
          font-weight: 700;
          color: #1F2937;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.01em;
        }
        .sr-body {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.75;
        }
        @media (min-width: 640px) {
          .sr-section {
            display: grid;
            grid-template-columns: 170px 1fr;
            gap: 1.5rem;
            align-items: start;
            padding: 1.75rem 0;
          }
          .sr-heading {
            margin-bottom: 0;
            padding-top: 2px;
          }
        }
      `}} />

      <main style={{ fontFamily: "'Inter', system-ui, sans-serif", margin: 0, padding: 0 }}>

        {/* ── HERO ── */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0F2747 0%, #163E6E 55%, #3F6E9C 100%)",
          padding: `clamp(2rem,5vw,4.5rem) ${px} clamp(2.5rem,5vw,4.5rem)`,
        }}>
          <div ref={plusRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(200,215,235,0.65)", marginBottom: "1.25rem" }}>
              <a href="/" style={{ color: "rgba(200,215,235,0.65)", textDecoration: "none" }}>Home</a>
              <span style={{ opacity: 0.4 }}>›</span>
              <span style={{ color: "rgba(225,232,242,0.92)" }}>Shipping &amp; Refund Policy</span>
            </nav>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(210,230,255,0.95)",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 999, marginBottom: "1.25rem",
            }}>
              🛡️ Buyer Protected
            </div>

            <h1 style={{
              fontSize: "clamp(30px,6vw,62px)",
              fontWeight: 800, lineHeight: 1.08,
              letterSpacing: "-0.025em", color: "#fff",
              margin: "0 0 0.9rem 0",
            }}>
              Shipping &amp;<br />Refund Policy
            </h1>

            <p style={{ fontSize: 15, color: "rgba(170,200,255,0.68)", lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
              Everything you need to know about delivery, returns, and refunds — HV KART LLP.
            </p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ background: "#F7F8FA", padding: `0 ${px} 3rem` }}>

          {/* Shipping charges */}
          <div className="sr-section">
            <p className="sr-heading">📦 Shipping charges</p>
            <div className="sr-body">
              <InfoBadge emoji="🎉" text="Free shipping on orders above ₹999" color="green" />
              <Row label="Orders above ₹999" value="Free" color="green" />
              <Row label="Orders below ₹999" value="₹49 flat fee" />
            </div>
          </div>

          {/* Delivery time */}
          <div className="sr-section">
            <p className="sr-heading">🚚 Delivery time</p>
            <div className="sr-body">
              <InfoBadge emoji="⚡" text="Fast & reliable delivery across India" color="blue" />
              <Row label="🏭 Dispatch" value="1–2 business days" />
              <Row label="🏠 Delivery" value="3–7 business days" />
              <Note>📍 Actual delivery time may vary depending on your location.</Note>
            </div>
          </div>

          {/* Returns */}
          <div className="sr-section">
            <p className="sr-heading">↩️ Returns</p>
            <div className="sr-body">
              <InfoBadge emoji="🔌" text="Electronic items — No returns once delivered" color="red" />
              <p style={{ margin: 0 }}>
                Due to the nature of electronic products, we do{" "}
                <strong style={{ color: "#1F2937" }}>not accept returns</strong>{" "}
                once an order has been delivered. Please review product specifications carefully before placing your order.
              </p>
            </div>
          </div>

          {/* Refunds */}
          <div className="sr-section">
            <p className="sr-heading">💸 Refunds</p>
            <div className="sr-body">
              <InfoBadge emoji="⚠️" text="Refunds only in exceptional cases" color="amber" />
              <p style={{ margin: 0 }}>
                Refunds are{" "}
                <strong style={{ color: "#1F2937" }}>not applicable</strong>{" "}
                for delivered electronic items. Exceptions are considered only where:
              </p>
              <Checklist items={[
                "📦 Product was damaged in transit",
                "🔧 Item was defective upon arrival",
                "❌ An incorrect item was shipped",
              ]} />
              <Note>🔍 All claims are subject to verification by our support team.</Note>
            </div>
          </div>

          {/* Cancellations */}
          <div className="sr-section">
            <p className="sr-heading">🚫 Cancellations</p>
            <div className="sr-body">
              <InfoBadge emoji="✅" text="Cancel anytime before your order ships" color="green" />
              <Row label="✅ Before shipping" value="Allowed" color="green" />
              <Row label="🚫 After shipping" value="Not allowed" color="red" />
              <Note>📋 Once shipped, the standard return policy applies.</Note>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}