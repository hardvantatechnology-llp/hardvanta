"use client";

export default function EWastePage() {
  const sections = [
    { id: "accepted-items", label: "Accepted Items" },
    { id: "why-recycle",    label: "Why Recycle Electronics?" },
    { id: "how-to-dispose", label: "How to Dispose" },
    { id: "our-commitment", label: "Our Commitment" },
  ];

  const acceptedItems = [
    { icon: "🔩", label: "Sensors, Modules & Electronic Components" },
    { icon: "💻", label: "Desktop Computers & Laptops" },
    { icon: "🖥️", label: "Motherboards, Processors & RAM" },
    { icon: "💾", label: "Hard Drives (HDDs) & SSDs" },
    { icon: "📱", label: "Mobile Phones & Tablets" },
    { icon: "📡", label: "Routers, Modems & Networking Equipment" },
    { icon: "🔌", label: "Power Supplies, Adapters & Chargers" },
    { icon: "🔋", label: "Batteries & Power Banks" },
    { icon: "🖥️", label: "Monitors & Display Devices" },
    { icon: "🖨️", label: "Printers & Scanners" },
    { icon: "📷", label: "Cameras & Electronic Accessories" },
    { icon: "📶", label: "Smart Devices & IoT Equipment" },
  ];

  const whyPoints = [
    "Prevent harmful electronic waste from reaching landfills.",
    "Recover valuable materials — copper, aluminium, and precious metals — for reuse.",
    "Conserve natural resources and energy.",
    "Support a cleaner and more sustainable environment.",
    "Promote responsible e-waste management practices.",
  ];

  const howSteps = [
    { num: "1", text: "Collect your unwanted or non-functional electronic items." },
    { num: "2", text: "Ensure any personal data is removed from devices before disposal." },
    { num: "3", text: "Contact Hardvanta's support team for e-waste collection guidance." },
    { num: "4", text: "Hand over the items through the designated collection or take-back process." },
    { num: "5", text: "The collected e-waste will be sent to authorised recyclers for environmentally responsible processing." },
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: "#0d0f16",
      minHeight: "100vh",
    }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(160deg, #05060a 0%, #0a1128 55%, #05060a 100%)",
        padding: "56px 48px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* radial glow overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 80% 30%, rgba(99,130,255,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 75%, rgba(30,58,138,0.30) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 14px",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}>
            E-Waste Collection
          </h1>
          <p style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
            margin: 0,
            fontWeight: 400,
          }}>
            How Hardvanta Technologies LLP encourages responsible disposal and
            recycling of electronic products to reduce environmental impact and
            recover valuable resources.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "36px 24px 64px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>

        {/* ── TOC ── */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
          borderRadius: 12,
          padding: "24px 28px",
        }}>
          <div style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 16,
          }}>
            On this page
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: "8px 16px",
          }}>
            {sections.map((s) => (
              <a key={s.id} href={"#" + s.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13.5,
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: 500,
              }}>
                <span style={{ fontSize: 7, color: "#93c5fd" }}>◆</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Card helper ── */}
        {[
          {
            id: "accepted-items",
            section: "Section 1",
            heading: "Electronic Items Accepted for Recycling",
            content: (
              <>
                <p style={pStyle}>
                  We accept a wide range of end-of-life electronic products and
                  components. Electronic devices contain materials such as copper,
                  aluminium, precious metals, and reusable components that can be
                  safely recovered through proper recycling processes.
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 10,
                  marginTop: 18,
                }}>
                  {acceptedItems.map(({ icon, label }) => (
                    <div key={label} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#ffffff",
                      lineHeight: 1.4,
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            id: "why-recycle",
            section: "Section 2",
            heading: "Why Recycle Electronics?",
            content: (
              <>
                <p style={pStyle}>
                  Improper disposal of electronic waste poses serious risks to the
                  environment and public health. Proper recycling delivers real
                  benefits across the entire materials cycle.
                </p>
                <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {whyPoints.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#3b82f6",
                        background: "rgba(59,130,246,0.15)",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        minWidth: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            id: "how-to-dispose",
            section: "Section 3",
            heading: "How to Dispose of Your E-Waste",
            content: (
              <>
                <p style={pStyle}>
                  Follow these simple steps to responsibly hand over your
                  end-of-life electronics through our collection programme.
                </p>
                <div style={{ display: "flex", flexDirection: "column", marginTop: 18 }}>
                  {howSteps.map(({ num, text }, i) => (
                    <div key={num} style={{ display: "flex", gap: 16, position: "relative" }}>
                      {i < howSteps.length - 1 && (
                        <div style={{
                          position: "absolute",
                          left: 17,
                          top: 38,
                          bottom: 0,
                          width: 2,
                          background: "rgba(255,255,255,0.15)",
                        }} />
                      )}
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#3b82f6",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 1,
                      }}>
                        {num}
                      </div>
                      <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, padding: "6px 0 24px" }}>
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            id: "our-commitment",
            section: "Section 4",
            heading: "Our Commitment",
            content: (
              <>
                <p style={pStyle}>
                  Hardvanta is committed to promoting responsible e-waste management
                  in accordance with applicable environmental regulations and industry
                  best practices. By recycling your old electronics with us, you
                  directly contribute to resource conservation and a greener future.
                </p>
                <div style={{
                  background: "rgba(59,130,246,0.1)",
                  borderLeft: "4px solid #3b82f6",
                  borderRadius: "0 8px 8px 0",
                  padding: "16px 20px",
                  marginTop: 16,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.7,
                }}>
                  <strong style={{ fontWeight: 700, color: "#ffffff" }}>
                    Together, let&apos;s reduce electronic waste.
                  </strong>{" "}
                  Every device responsibly recycled through our programme helps
                  conserve natural resources, reduces pollution, and supports a
                  more sustainable tomorrow for everyone.
                </div>
              </>
            ),
          },
        ].map(({ id, section, heading, content }) => (
          <div key={id} id={id} style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
            borderRadius: 12,
            padding: "32px 36px",
          }}>
            {/* eyebrow */}
            <div style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              {section}
              <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", display: "block" }} />
            </div>
            <h2 style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}>
              {heading}
            </h2>
            {content}
          </div>
        ))}

      </div>
    </div>
  );
}

const pStyle = {
  fontSize: 14.5,
  color: "rgba(255,255,255,0.7)",
  lineHeight: 1.78,
  margin: "0 0 12px",
};