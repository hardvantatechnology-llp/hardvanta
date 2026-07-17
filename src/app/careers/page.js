"use client";

const whyUs = [
  {
    emoji: "🛠️",
    title: "Makers First",
    desc: "Everything we do is for people who build — students tinkering at midnight, hobbyists debugging circuits, and engineers shipping real products. We live in that world too.",
  },
  {
    emoji: "🇮🇳",
    title: "India-First Mission",
    desc: "Quality components shouldn't be a privilege. We're making robotics and electronics accessible to every corner of India — from metro cities to tier-3 towns.",
  },
  {
    emoji: "🔋",
    title: "High Ownership",
    desc: "Small team, massive impact. There's no bureaucracy between your idea and shipping it. You own your work end-to-end and see it live within days, not quarters.",
  },
  {
    emoji: "📈",
    title: "Real Growth",
    desc: "We are growing fast and so will you. Take on challenges beyond your job title, learn from a passionate team, and grow alongside a brand that's defining maker culture in India.",
  },
  {
    emoji: "🤝",
    title: "Culture of Curiosity",
    desc: "Credentials take a back seat to curiosity here. If you've built something — a bot, a circuit, a side project — that's your real resume. We love people who just can't stop making.",
  },
  {
    emoji: "🌐",
    title: "Meaningful Work",
    desc: "Every order we ship helps someone bring an idea to life. That's not a tagline — it's why we show up. Join a team where the work genuinely matters.",
  },
];

const values = [
  { emoji: "⚡", label: "Move fast" },
  { emoji: "🔍", label: "Stay curious" },
  { emoji: "🧩", label: "Solve creatively" },
  { emoji: "📦", label: "Ship often" },
  { emoji: "🙌", label: "Help makers" },
  { emoji: "🇮🇳", label: "Build for India" },
];

const perks = [
  { emoji: "🏠", title: "Flexible Work", desc: "Hybrid-friendly setup. We care about output, not clocking in." },
  { emoji: "🛒", title: "Component Allowance", desc: "Build personal projects with a monthly hardware budget on us." },
  { emoji: "📚", title: "Learning Budget", desc: "Courses, books, workshops — we invest in your growth." },
  { emoji: "🎉", title: "Maker Events", desc: "Attend hackathons, expos, and maker faires — on company time." },
];

export default function CareersPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: Inter, system-ui, -apple-system, sans-serif; }

        .car-hero { padding: 44px 20px 56px; }
        @media (min-width: 640px)  { .car-hero { padding: 56px 32px 68px; } }
        @media (min-width: 1024px) { .car-hero { padding: 72px 48px 80px; } }

        .car-body { max-width: 860px; margin: 0 auto; padding: 28px 16px 72px; }
        @media (min-width: 640px)  { .car-body { padding: 36px 24px 80px; } }
        @media (min-width: 1024px) { .car-body { padding: 48px 32px 96px; } }

        .why-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 6px;
        }
        @media (min-width: 560px) { .why-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 860px) { .why-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .perks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 6px;
        }
        @media (min-width: 700px) { .perks-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }

        .values-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .hero-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        a:focus-visible, button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 3px;
          border-radius: 6px;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 20px;
        }
        @media (min-width: 700px) { .nav-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}} />

      <div style={{ background: "#0d0f16", minHeight: "100vh" }}>

        {/* ══════ HERO ══════ */}
        <div
          className="car-hero"
          style={{
            background: "linear-gradient(135deg,#05060a 0%,#0a1128 55%,#05060a 100%)",
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
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.13)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "999px", padding: "5px 15px", marginBottom: "18px",
              fontSize: "11px", fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.09em", textTransform: "uppercase",
            }}>
              🚀 CAREERS AT HARDVANTA
            </div>

            <h1 style={{
              fontSize: "clamp(1.75rem,6vw,2.9rem)",
              fontWeight: 800, color: "#ffffff",
              lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "16px",
            }}>
              Build the Future of<br />Making in India
            </h1>

            <p style={{
              fontSize: "clamp(13.5px,3.2vw,15.5px)",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75, maxWidth: "520px", marginBottom: "6px",
            }}>
              India&apos;s go-to store for robotics, electronics, and DIY engineering.
              If you want to help people bring their ideas to life — you belong here. 🤝
            </p>

            {/* stat badges */}
            <div className="hero-stats">
              {[
                { emoji: "🏭", label: "10,000+ Products" },
                { emoji: "📦", label: "Pan-Delhi NCR Delivery" },
                { emoji: "👥", label: "Growing Team" },
                { emoji: "🔩", label: "Makers Community" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "8px", padding: "6px 14px",
                  fontSize: "clamp(11px,2.5vw,12.5px)", fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                }}>
                  {s.emoji} {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════ BODY ══════ */}
        <div className="car-body">

          {/* "On this page" nav */}
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "14px", padding: "22px 24px", marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
              ON THIS PAGE
            </p>
            <nav className="nav-grid" aria-label="Page sections">
              {[
                { href: "#why-us", label: "🛠️ Why work with us" },
                { href: "#values",  label: "⚡ Our values" },
                { href: "#perks",   label: "🎁 Perks & benefits" },
                { href: "#roles",   label: "📭 Open positions" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    fontSize: "clamp(12px,3vw,13px)", color: "#3b82f6",
                    textDecoration: "none",
                    display: "flex", alignItems: "flex-start", gap: "5px", lineHeight: 1.45,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px", flexShrink: 0 }}>›</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── SECTION 01 · Why work with us ── */}
          <div
            id="why-us"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "14px", padding: "clamp(20px,4vw,32px)",
              marginBottom: "18px", boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              scrollMarginTop: "24px",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
              SECTION 01
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{
                flexShrink: 0, width: "42px", height: "42px", borderRadius: "10px",
                background: "linear-gradient(135deg,rgba(59,130,246,0.25) 0%,rgba(168,85,247,0.25) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>🛠️</div>
              <h2 style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 800, color: "#ffffff" }}>
                Why Work With Us
              </h2>
            </div>

            <p style={{ fontSize: "clamp(13.5px,3vw,15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "20px" }}>
              We are a growing team passionate about makers and builders. Curiosity matters more than
              credentials here — if you have built something, that is your real resume. ✨
            </p>

            <div className="why-grid">
              {whyUs.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px", padding: "18px",
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(168,85,247,0.25))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", marginBottom: "12px",
                  }}>
                    {item.emoji}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: "clamp(13.5px,3vw,15px)", color: "#ffffff", marginBottom: "6px" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "clamp(12.5px,2.8vw,13.5px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 02 · Values ── */}
          <div
            id="values"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "14px", padding: "clamp(20px,4vw,32px)",
              marginBottom: "18px", boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              scrollMarginTop: "24px",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
              SECTION 02
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{
                flexShrink: 0, width: "42px", height: "42px", borderRadius: "10px",
                background: "linear-gradient(135deg,rgba(59,130,246,0.25) 0%,rgba(168,85,247,0.25) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>⚡</div>
              <h2 style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 800, color: "#ffffff" }}>
                What We Stand For
              </h2>
            </div>

            <p style={{ fontSize: "clamp(13.5px,3vw,15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "4px" }}>
              These aren&apos;t posters on a wall — they&apos;re how we actually work every day.
            </p>

            <div className="values-grid">
              {values.map((v) => (
                <div
                  key={v.label}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: "999px", padding: "8px 16px",
                    fontSize: "clamp(12.5px,2.8vw,14px)", fontWeight: 600, color: "#bfdbfe",
                  }}
                >
                  <span>{v.emoji}</span> {v.label}
                </div>
              ))}
            </div>

            {/* Highlight */}
            <div style={{
              background: "rgba(59,130,246,0.1)", borderLeft: "3px solid #3b82f6",
              borderRadius: "6px", padding: "12px 16px", marginTop: "20px",
              fontSize: "clamp(12.5px,2.8vw,13.5px)", color: "#bfdbfe", lineHeight: 1.65,
            }}>
              <strong>💡 Our belief: </strong>
              The best engineers aren&apos;t always the ones with the fanciest degrees — they&apos;re the ones who can&apos;t stop building. If that&apos;s you, we&apos;d love to talk.
            </div>
          </div>

          {/* ── SECTION 03 · Perks ── */}
          <div
            id="perks"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "14px", padding: "clamp(20px,4vw,32px)",
              marginBottom: "18px", boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              scrollMarginTop: "24px",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
              SECTION 03
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{
                flexShrink: 0, width: "42px", height: "42px", borderRadius: "10px",
                background: "linear-gradient(135deg,rgba(59,130,246,0.25) 0%,rgba(168,85,247,0.25) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>🎁</div>
              <h2 style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 800, color: "#ffffff" }}>
                Perks &amp; Benefits
              </h2>
            </div>

            <p style={{ fontSize: "clamp(13.5px,3vw,15px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "18px" }}>
              We take care of the people who take care of our makers. 💚
            </p>

            <div className="perks-grid">
              {perks.map((p) => (
                <div
                  key={p.title}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px", padding: "18px",
                    display: "flex", flexDirection: "column", gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "26px" }}>{p.emoji}</span>
                  <p style={{ fontWeight: 700, fontSize: "clamp(13px,3vw,14.5px)", color: "#ffffff" }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: "clamp(12px,2.8vw,13px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 04 · Open Roles ── */}
          <div
            id="roles"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "14px", padding: "clamp(20px,4vw,32px)",
              marginBottom: "18px", boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              scrollMarginTop: "24px",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
              SECTION 04
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{
                flexShrink: 0, width: "42px", height: "42px", borderRadius: "10px",
                background: "linear-gradient(135deg,rgba(59,130,246,0.25) 0%,rgba(168,85,247,0.25) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>📋</div>
              <h2 style={{ fontSize: "clamp(16px,4vw,20px)", fontWeight: 800, color: "#ffffff" }}>
                Open Positions
              </h2>
            </div>

            {/* Empty state */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1.5px dashed rgba(255,255,255,0.15)",
              borderRadius: "12px", padding: "36px 24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontWeight: 700, fontSize: "clamp(15px,3.5vw,17px)", color: "#ffffff", marginBottom: "8px" }}>
                No open roles right now
              </p>
              <p style={{ fontSize: "clamp(13px,3vw,14px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 0" }}>
                We&apos;re not actively hiring at the moment — but great people don&apos;t wait for job postings.
                Send us your resume and tell us what you&apos;d love to build with us.
              </p>
            </div>

            <div style={{
              background: "rgba(59,130,246,0.1)", borderLeft: "3px solid #3b82f6",
              borderRadius: "6px", padding: "12px 16px", marginTop: "18px",
              fontSize: "clamp(12.5px,2.8vw,13.5px)", color: "#bfdbfe", lineHeight: 1.65,
            }}>
              <strong>💡 Heads up: </strong>
              We review every application carefully. If your skills and passion are a match, we&apos;ll reach out — even if there&apos;s no active role.
            </div>
          </div>

          {/* ── CTA card ── */}
          <div style={{
            background: "linear-gradient(135deg,#05060a 0%,#0a1128 100%)",
            borderRadius: "14px", textAlign: "center",
            padding: "clamp(32px,5vw,52px) clamp(20px,5vw,40px)",
            marginTop: "8px", position: "relative", overflow: "hidden",
          }}>
            {/* subtle dot texture */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.045) 1px,transparent 1px)",
              backgroundSize: "24px 24px", pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>✉️</div>
              <h3 style={{
                fontSize: "clamp(17px,4vw,22px)", fontWeight: 800,
                color: "#ffffff", marginBottom: "10px",
              }}>
                Don&apos;t see your role? Send your resume anyway.
              </h3>
              <p style={{
                fontSize: "clamp(13px,3vw,14.5px)", color: "rgba(255,255,255,0.72)",
                marginBottom: "28px", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 24px",
              }}>
                We love meeting passionate builders even when we&apos;re not actively hiring.
                Share what you&apos;ve made and what you&apos;d love to work on — that&apos;s how most of our best hires found us. 🚀
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
                <a
                  href="/contact"
                  style={{
                    display: "inline-block", background: "#3b82f6",
                    color: "#ffffff", fontWeight: 700,
                    fontSize: "clamp(13px,3vw,14.5px)",
                    padding: "13px 32px", borderRadius: "8px",
                    textDecoration: "none", letterSpacing: "0.01em",
                  }}
                >
                  📩 Send Your Resume
                </a>
                <a
                  href="mailto:careers@hardvantatechnology@gmail.com"
                  style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#ffffff", fontWeight: 600,
                    fontSize: "clamp(13px,3vw,14.5px)",
                    padding: "13px 32px", borderRadius: "8px",
                    textDecoration: "none", letterSpacing: "0.01em",
                  }}
                >
                  📧 careers@hardvantatechnology@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
