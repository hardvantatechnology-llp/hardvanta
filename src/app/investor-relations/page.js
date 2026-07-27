export default function InvestorRelationsPage() {
  const s = {
    wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 1rem 3rem", background: "#F7F8FA" },
    hero: { background: "linear-gradient(135deg, #0F2747 0%, #163E6E 60%, #0F2747 100%)", color: "#fff", padding: "3rem 2.5rem 2.5rem", borderRadius: "0 0 16px 16px", marginBottom: "2rem" },
    badge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#BFD3E8", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 999, marginBottom: "1.25rem" },
    badgeDot: { width: 7, height: 7, background: "#BFD3E8", borderRadius: "50%", display: "inline-block", marginRight: 4 },
    heroH1: { fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.75rem", lineHeight: 1.1, color: "#fff" },
    heroSub: { fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: 0, lineHeight: 1.7 },
    heroSpan: { color: "#f87171" },
    toc: { background: "#FFFFFF", backdropFilter: "blur(20px)", border: "1px solid #D9DEE5", borderRadius: 12, padding: "1.5rem 2rem", marginBottom: "2rem" },
    tocLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: "1rem" },
    tocGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem 1rem" },
    tocLink: { fontSize: "0.82rem", color: "#163E6E", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 },
    card: { background: "#FFFFFF", backdropFilter: "blur(20px)", border: "1px solid #D9DEE5", borderRadius: 12, padding: "2rem 2.5rem", marginBottom: "1.5rem" },
    sectionLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" },
    sectionLine: { flex: 1, height: 1, background: "#D9DEE5", display: "inline-block" },
    cardH2: { fontSize: "1.35rem", fontWeight: 800, color: "#1F2937", margin: "0 0 1rem", letterSpacing: "-0.01em" },
    cardP: { fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.8, margin: "0 0 0.85rem" },
    cardPLast: { fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.8, margin: 0 },
    highlight: { background: "rgba(22,62,110,0.08)", borderLeft: "3px solid #163E6E", borderRadius: "0 8px 8px 0", padding: "1rem 1.25rem", marginTop: "1.25rem" },
    highlightStrong: { color: "#1F2937", fontWeight: 700, fontSize: "0.875rem", display: "block", marginBottom: 4 },
    highlightP: { fontSize: "0.875rem", color: "#6B7280", margin: 0, lineHeight: 1.7 },
    stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", margin: "1.25rem 0" },
    stat: { background: "#E8ECEF", border: "1px solid #D9DEE5", borderRadius: 10, padding: "1rem 1.25rem", textAlign: "center" },
    statValue: { fontSize: "1.6rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.25rem" },
    statAccent: { color: "#163E6E" },
    statLabel: { fontSize: "0.72rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
    pillars: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem", marginTop: "1.25rem" },
    pillar: { background: "#E8ECEF", border: "1px solid #D9DEE5", borderRadius: 8, padding: "0.9rem 1.1rem", display: "flex", alignItems: "flex-start", gap: 10 },
    pillarIcon: { width: 36, height: 36, minWidth: 36, background: "rgba(22,62,110,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1 },
    pillarTitle: { fontSize: "0.82rem", fontWeight: 700, color: "#1F2937", display: "block", marginBottom: 2 },
    pillarDesc: { fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.5 },
    cta: { background: "#0F2747", borderRadius: 12, padding: "2rem 2.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" },
    ctaH3: { fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 0.35rem" },
    ctaP: { fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 },
    ctaBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#0F2747", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.65rem 1.4rem", borderRadius: 8, textDecoration: "none", flexShrink: 0 },
    footer: { textAlign: "center", fontSize: "0.78rem", color: "#6B7280", paddingTop: "0.5rem", paddingBottom: "1rem" },
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
          How HV KART LLP is creating long-term value through
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
          HV KART LLP is a technology-focused e-commerce platform
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
            <div style={s.statValue}>100<span style={s.statAccent}>%</span></div>
            <div style={s.statLabel}>Quality Commitment</div>
          </div>
          <div style={s.stat}>
            <div style={s.statValue}>2026<span style={s.statAccent}>+</span></div>
            <div style={s.statLabel}>Est. April 2026</div>
          </div>
          <div style={s.stat}>
            <div style={s.statValue}>Delhi<span style={s.statAccent}>-NCR</span></div>
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
          HV KART is strategically positioned within this ecosystem &mdash; serving the
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
        HV KART LLP &middot; Investor Relations &middot; Last updated June 2026
      </div>

    </div>
  );
}