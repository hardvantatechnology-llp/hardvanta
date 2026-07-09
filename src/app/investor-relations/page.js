export default function InvestorRelationsPage() {
  const s = {
    wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 1rem 3rem", background: "#f3f4f8" },
    hero: { background: "linear-gradient(135deg, #0f1b3d 0%, #1a2f6b 60%, #0f1b3d 100%)", color: "#fff", padding: "3rem 2.5rem 2.5rem", borderRadius: "0 0 16px 16px", marginBottom: "2rem" },
    badge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#a5b4fc", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 999, marginBottom: "1.25rem" },
    badgeDot: { width: 7, height: 7, background: "#a5b4fc", borderRadius: "50%", display: "inline-block", marginRight: 4 },
    heroH1: { fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.75rem", lineHeight: 1.1, color: "#fff" },
    heroSub: { fontSize: "0.95rem", color: "#c7d2fe", maxWidth: 520, margin: 0, lineHeight: 1.7 },
    heroSpan: { color: "#f87171" },
    toc: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem 2rem", marginBottom: "2rem" },
    tocLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "1rem" },
    tocGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem 1rem" },
    tocLink: { fontSize: "0.82rem", color: "#4f46e5", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 },
    card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "2rem 2.5rem", marginBottom: "1.5rem" },
    sectionLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" },
    sectionLine: { flex: 1, height: 1, background: "#e5e7eb", display: "inline-block" },
    cardH2: { fontSize: "1.35rem", fontWeight: 800, color: "#0f1b3d", margin: "0 0 1rem", letterSpacing: "-0.01em" },
    cardP: { fontSize: "0.9rem", color: "#374151", lineHeight: 1.8, margin: "0 0 0.85rem" },
    cardPLast: { fontSize: "0.9rem", color: "#374151", lineHeight: 1.8, margin: 0 },
    highlight: { background: "#eef2ff", borderLeft: "3px solid #4f46e5", borderRadius: "0 8px 8px 0", padding: "1rem 1.25rem", marginTop: "1.25rem" },
    highlightStrong: { color: "#1e1b4b", fontWeight: 700, fontSize: "0.875rem", display: "block", marginBottom: 4 },
    highlightP: { fontSize: "0.875rem", color: "#3730a3", margin: 0, lineHeight: 1.7 },
    stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", margin: "1.25rem 0" },
    stat: { background: "#f8faff", border: "1px solid #dde4f8", borderRadius: 10, padding: "1rem 1.25rem", textAlign: "center" },
    statValue: { fontSize: "1.6rem", fontWeight: 800, color: "#0f1b3d", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.25rem" },
    statAccent: { color: "#4f46e5" },
    statLabel: { fontSize: "0.72rem", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
    pillars: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem", marginTop: "1.25rem" },
    pillar: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.9rem 1.1rem", display: "flex", alignItems: "flex-start", gap: 10 },
    pillarIcon: { width: 36, height: 36, minWidth: 36, background: "#0f1b3d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1 },
    pillarTitle: { fontSize: "0.82rem", fontWeight: 700, color: "#0f1b3d", display: "block", marginBottom: 2 },
    pillarDesc: { fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.5 },
    cta: { background: "#0f1b3d", borderRadius: 12, padding: "2rem 2.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" },
    ctaH3: { fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 0.35rem" },
    ctaP: { fontSize: "0.85rem", color: "#a5b4fc", margin: 0, lineHeight: 1.6 },
    ctaBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#0f1b3d", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.65rem 1.4rem", borderRadius: 8, textDecoration: "none", flexShrink: 0 },
    footer: { textAlign: "center", fontSize: "0.78rem", color: "#9ca3af", paddingTop: "0.5rem", paddingBottom: "1rem" },
  };

  return (
    <div style={s.wrap}>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.badge}>
          <span style={s.badgeDot}></span>
          Investor Relations
        </div>
        <h1 style={s.heroH1}>Investor Relations</h1>
        <p style={s.heroSub}>
          How Hardvanta Technologies LLP is creating long-term value through
          technology-driven commerce &mdash;{" "}
          <span style={s.heroSpan}>last updated June 2026.</span>
        </p>
      </div>

      {/* TABLE OF CONTENTS */}
      <div style={s.toc}>
        <div style={s.tocLabel}>On this page</div>
        <div style={s.tocGrid}>
          <a href="#ir-about" style={s.tocLink}>&#9670; About the company</a>
          <a href="#ir-vision" style={s.tocLink}>&#9670; Our vision</a>
          <a href="#ir-market" style={s.tocLink}>&#9670; Market opportunity</a>
          <a href="#ir-pillars" style={s.tocLink}>&#9670; Growth pillars</a>
          <a href="#ir-partnerships" style={s.tocLink}>&#9670; Partnerships</a>
          <a href="#ir-contact" style={s.tocLink}>&#9670; Contact us</a>
        </div>
      </div>

      {/* SECTION 1 */}
      <div style={s.card} id="ir-about">
        <div style={s.sectionLabel}>Section 1 <span style={s.sectionLine}></span></div>
        <h2 style={s.cardH2}>About the Company</h2>
        <p style={s.cardP}>
          Hardvanta Technologies LLP is a technology-focused e-commerce platform
          specialising in electronics, robotics, IoT, embedded systems, and maker
          products. We serve students, educators, startups, developers, and industry
          professionals across India with a growing portfolio of quality electronic
          components and development solutions.
        </p>
        <p style={s.cardPLast}>
          Founded with the mission to make technology accessible and reliable, we
          operate the hardvanta.com storefront and continue to expand our product
          catalogue to meet the evolving demands of India&apos;s rapidly growing STEM
          and engineering ecosystem.
        </p>
        <div style={s.stats}>
          <div style={s.stat}>
            <div style={s.statValue}>10<span style={s.statAccent}>K+</span></div>
            <div style={s.statLabel}>Products Listed</div>
          </div>
          <div style={s.stat}>
            <div style={s.statValue}>2026<span style={s.statAccent}>+</span></div>
            <div style={s.statLabel}>Est. April 2026</div>
          </div>
          <div style={s.stat}>
            <div style={s.statValue}>Pan<span style={s.statAccent}>-DelhiNCR</span></div>
            <div style={s.statLabel}>Delivery Reach</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div style={s.card} id="ir-vision">
        <div style={s.sectionLabel}>Section 2 <span style={s.sectionLine}></span></div>
        <h2 style={s.cardH2}>Our Vision</h2>
        <p style={s.cardPLast}>
          To become India&apos;s most trusted destination for electronics innovation &mdash;
          making technology accessible, reliable, and affordable for every maker,
          student, developer, and enterprise across the country.
        </p>
        <div style={s.highlight}>
          <strong style={s.highlightStrong}>Strategic Focus</strong>
          <p style={s.highlightP}>
            We are committed to empowering the next generation of Indian engineers and
            innovators by building a platform that bridges the gap between global
            electronics supply chains and local demand for STEM-grade components.
          </p>
        </div>
      </div>

      {/* SECTION 3 */}
      <div style={s.card} id="ir-market">
        <div style={s.sectionLabel}>Section 3 <span style={s.sectionLine}></span></div>
        <h2 style={s.cardH2}>Market Opportunity</h2>
        <p style={s.cardP}>
          India&apos;s electronics and semiconductor market is one of the fastest-growing
          in the world, driven by government initiatives such as Make in India,
          expanding STEM education, and increasing adoption of IoT and automation
          across industries.
        </p>
        <p style={s.cardPLast}>
          Hardvanta is strategically positioned within this ecosystem &mdash; serving the
          maker and professional segments that are driving grassroots innovation and
          contributing to India&apos;s emergence as a global technology hub.
        </p>
      </div>

      {/* SECTION 4 */}
      <div style={s.card} id="ir-pillars">
        <div style={s.sectionLabel}>Section 4 <span style={s.sectionLine}></span></div>
        <h2 style={s.cardH2}>Growth &amp; Value Creation</h2>
        <p style={s.cardPLast}>
          Our business strategy is anchored on four core pillars that drive sustainable
          growth and long-term investor value within the rapidly expanding electronics
          and STEM ecosystem.
        </p>
        <div style={s.pillars}>
          <div style={s.pillar}>
            <div style={s.pillarIcon}>&#127942;</div>
            <div>
              <span style={s.pillarTitle}>Product Quality</span>
              <span style={s.pillarDesc}>Curated, tested components from verified manufacturers and suppliers.</span>
            </div>
          </div>
          <div style={s.pillar}>
            <div style={s.pillarIcon}>&#129309;</div>
            <div>
              <span style={s.pillarTitle}>Customer Trust</span>
              <span style={s.pillarDesc}>Transparent policies, fast support, and consistent delivery standards.</span>
            </div>
          </div>
          <div style={s.pillar}>
            <div style={s.pillarIcon}>&#9881;</div>
            <div>
              <span style={s.pillarTitle}>Operational Efficiency</span>
              <span style={s.pillarDesc}>Lean operations and smart logistics to maximise margin and reliability.</span>
            </div>
          </div>
          <div style={s.pillar}>
            <div style={s.pillarIcon}>&#128200;</div>
            <div>
              <span style={s.pillarTitle}>Long-term Scalability</span>
              <span style={s.pillarDesc}>Expanding catalogue, B2B channels, and institutional supply agreements.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 */}
      <div style={s.card} id="ir-partnerships">
        <div style={s.sectionLabel}>Section 5 <span style={s.sectionLine}></span></div>
        <h2 style={s.cardH2}>Investor &amp; Strategic Partnerships</h2>
        <p style={s.cardP}>
          We welcome opportunities to engage with investors, strategic partners, and
          institutions that share our vision of advancing technology education,
          innovation, and sustainable growth across India.
        </p>
        <p style={s.cardPLast}>
          Whether you are an individual investor, a corporate entity, or an academic
          institution, we are open to exploring collaboration models that create shared,
          long-term value aligned with the growth of India&apos;s electronics sector.
        </p>
        <div style={s.highlight}>
          <strong style={s.highlightStrong}>Enabling Innovation. Delivering Value. Growing Responsibly.</strong>
          <p style={s.highlightP}>
            For investment enquiries, partnership proposals, or corporate discussions,
            please reach out through the Contact Us page and our leadership team will
            respond promptly.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={s.cta} id="ir-contact">
        <div>
          <h3 style={s.ctaH3}>Ready to explore a partnership?</h3>
          <p style={s.ctaP}>Connect with our leadership team for investment and strategic enquiries.</p>
        </div>
        <a href="/contact" style={s.ctaBtn}>Contact Us &#8594;</a>
      </div>

      <div style={s.footer}>
        Hardvanta Technologies LLP &middot; Investor Relations &middot; Last updated June 2026
      </div>

    </div>
  );
}