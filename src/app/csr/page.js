export const metadata = { title: "CSR — hardvanta" };

const s = {
  /* ── Hero ── */
  hero: {
    background: "linear-gradient(135deg, #0F2747 0%, #163E6E 55%, #0F2747 100%)",
    position: "relative",
    overflow: "hidden",
    padding: "3.5rem 1.5rem 3rem",
  },
  heroDots: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    maxWidth: "800px",
    margin: "0 auto",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "#e0e6ff",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    padding: "0.35rem 0.9rem",
    borderRadius: "999px",
    marginBottom: "1.25rem",
  },
  heroTitle: {
    fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.1,
    margin: "0 0 1rem",
    letterSpacing: "-0.02em",
  },
  heroIntro: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.78)",
    maxWidth: "520px",
    lineHeight: 1.65,
    margin: 0,
  },

  /* ── Page body ── */
  page: {
    background: "#F7F8FA",
    padding: "2.5rem 1.5rem 4rem",
    minHeight: "60vh",
  },

  /* ── TOC card ── */
  toc: {
    background: "#FFFFFF",
    border: "1px solid #D9DEE5",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px rgba(15,39,71,0.08)",
    borderRadius: "14px",
    padding: "1.5rem 1.75rem",
    marginBottom: "1.75rem",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  tocLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#6B7280",
    margin: "0 0 1rem",
  },
  tocList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.55rem 1.5rem",
  },
  tocItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  tocDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#163E6E",
    flexShrink: 0,
    display: "inline-block",
  },
  tocLink: {
    fontSize: "0.88rem",
    color: "#163E6E",
    textDecoration: "none",
    fontWeight: 500,
  },

  /* ── Section cards ── */
  section: {
    background: "#FFFFFF",
    border: "1px solid #D9DEE5",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px rgba(15,39,71,0.08)",
    borderRadius: "14px",
    padding: "2rem 2rem 1.75rem",
    marginBottom: "1.5rem",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  sectionNumber: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#6B7280",
    margin: "0 0 0.6rem",
  },
  sectionHeading: {
    fontSize: "clamp(1.25rem, 3vw, 1.55rem)",
    fontWeight: 800,
    color: "#1F2937",
    margin: "0 0 1rem",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
  },
  sectionBody: {
    fontSize: "0.96rem",
    color: "#6B7280",
    lineHeight: 1.72,
    margin: "0 0 1.1rem",
  },

  /* ── List ── */
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.55rem",
  },
  listItem: {
    fontSize: "0.93rem",
    color: "#6B7280",
    lineHeight: 1.6,
    paddingLeft: "1.4rem",
    position: "relative",
  },
  listDot: {
    position: "absolute",
    left: 0,
    top: "0.55em",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#163E6E",
  },

  /* ── Inline link ── */
  inlineLink: {
    color: "#163E6E",
    fontWeight: 600,
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },

  /* ── Callout ── */
  callout: {
    background: "rgba(22,62,110,0.08)",
    borderLeft: "4px solid #163E6E",
    borderRadius: "0 10px 10px 0",
    padding: "1rem 1.25rem",
    marginTop: "0.5rem",
  },
  calloutText: {
    margin: 0,
    fontSize: "0.97rem",
    color: "#1F2937",
    lineHeight: 1.55,
  },
};

const tocItems = [
  { label: "Education & Innovation",       id: "education-innovation" },
  { label: "Environmental Responsibility", id: "environmental-responsibility" },
  { label: "Community Commitment",         id: "community-commitment" },
  { label: "E-Waste Initiative",           id: "e-waste-initiative" },
  { label: "Our Promise",                  id: "our-promise" },
];

function BulletList({ items }) {
  return (
    <ul style={s.list}>
      {items.map((item, i) => (
        <li key={i} style={s.listItem}>
          <span style={s.listDot} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function CSRPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroDots} />
        <div style={s.heroInner}>
          <span style={s.eyebrow}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            SUSTAINABILITY FIRST
          </span>
          <h1 style={s.heroTitle}>
            Corporate Social<br />Responsibility
          </h1>
          <p style={s.heroIntro}>
            How Hardvanta Technologies LLP empowers education, promotes sustainable
            practices, and gives back to the maker community — last updated June 2026.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={s.page}>

        {/* TOC */}
        <div style={s.toc}>
          <p style={s.tocLabel}>ON THIS PAGE</p>
          <ul style={s.tocList}>
            {tocItems.map(({ label, id }) => (
              <li key={id} style={s.tocItem}>
                <span style={s.tocDot} aria-hidden="true" />
                <a href={`#${id}`} style={s.tocLink}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 1 */}
        <div style={s.section} id="education-innovation">
          <p style={s.sectionNumber}>SECTION 1</p>
          <h2 style={s.sectionHeading}>Education &amp; Innovation</h2>
          <p style={s.sectionBody}>
            We support students, educators, makers, and innovators by providing access to quality
            electronic components, development boards, sensors, and learning resources that promote
            practical STEM, robotics, IoT, and embedded systems education.
          </p>
          <BulletList items={[
            "Special educational pricing for schools, colleges, and makerspaces",
            "Curated starter kits and learning bundles for beginners",
            "Partnerships with educators and open-source hardware communities",
            "Documentation, tutorials, and project guides freely available",
          ]} />
        </div>

        {/* Section 2 */}
        <div style={s.section} id="environmental-responsibility">
          <p style={s.sectionNumber}>SECTION 2</p>
          <h2 style={s.sectionHeading}>Environmental Responsibility</h2>
          <p style={s.sectionBody}>
            We encourage the responsible recycling and disposal of end-of-life electronic products.
            Through our e-waste management initiatives, we help reduce environmental impact and
            promote the recovery of valuable materials from obsolete electronics.
          </p>
          <BulletList items={[
            "Minimal and recyclable packaging across all shipments",
            "E-waste drop-off partnerships with certified recycling centres",
            "Refurbishment and second-life programmes for returned goods",
            "Carbon-conscious logistics and local sourcing where possible",
          ]} />
        </div>

        {/* Section 3 */}
        <div style={s.section} id="community-commitment">
          <p style={s.sectionNumber}>SECTION 3</p>
          <h2 style={s.sectionHeading}>Community Commitment</h2>
          <p style={s.sectionBody}>
            By fostering learning, innovation, and sustainable practices, Hardvanta is committed
            to creating long-term value for customers, communities, and the environment. We believe
            technology built responsibly is technology that lasts.
          </p>
          <BulletList items={[
            "Sponsoring hackathons, robotics competitions, and STEM fairs",
            "Supporting grassroots maker and DIY electronics communities",
            "Donating components to underfunded schools and rural colleges",
            "Transparent supply-chain practices and ethical sourcing",
          ]} />
        </div>

        {/* Section 4 */}
        <div style={s.section} id="e-waste-initiative">
          <p style={s.sectionNumber}>SECTION 4</p>
          <h2 style={s.sectionHeading}>E-Waste Initiative</h2>
          <p style={s.sectionBody}>
            Electronics contain materials — rare earths, precious metals, hazardous compounds —
            that must never reach landfill. Our e-waste collection programme makes responsible
            disposal easy for every customer.
          </p>
          <ul style={s.list}>
            {[
              "Free collection of obsolete boards, components, and devices",
              "Certified dismantling in partnership with accredited recyclers",
              "Annual impact report on tonnes diverted from landfill",
            ].map((item, i) => (
              <li key={i} style={s.listItem}>
                <span style={s.listDot} aria-hidden="true" />
                {item}
              </li>
            ))}
            <li style={s.listItem}>
              <span style={s.listDot} aria-hidden="true" />
              Visit our{" "}
              <a href="\ewaste" style={s.inlineLink}>E-Waste Collection page</a>
              {" "}for drop-off locations and guidelines
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div style={s.section} id="our-promise">
          <p style={s.sectionNumber}>SECTION 5</p>
          <h2 style={s.sectionHeading}>Our Promise</h2>
          <p style={s.sectionBody}>
            Hardvanta Technologies LLP pledges to review and strengthen these commitments annually.
            We publish progress updates on this page so our community can hold us accountable.
          </p>
          <div style={s.callout}>
            <p style={s.calloutText}>
              <strong>Building Technology Responsibly. Inspiring Innovation Sustainably.</strong>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}