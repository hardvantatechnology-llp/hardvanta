// app/terms-of-service/page.js
// Drop-in replacement — no extra dependencies needed beyond Next.js
// NOTE: metadata must be exported from a separate layout.js in this folder
// because this file uses "use client". Example layout.js content:
//   export const metadata = {
//     title: "Terms of Service — Hardvanta",
//     description: "Read Hardvanta's Terms of Service...",
//   };
//   export default function Layout({ children }) { return children; }

"use client";

import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "overview", heading: "Overview" },
  { id: "eligibility", heading: "Eligibility and use" },
  { id: "account", heading: "Account accuracy" },
  { id: "product-info", heading: "Product information" },
  { id: "pricing", heading: "Pricing and availability" },
  { id: "orders", heading: "Orders and payment" },
  { id: "shipping", heading: "Shipping and delivery" },
  { id: "returns", heading: "Refunds" },
  { id: "intended-use", heading: "Intended use" },
  { id: "prohibited", heading: "Prohibited conduct" },
  { id: "third-party", heading: "Third-party links" },
  { id: "submissions", heading: "User submissions" },
  { id: "privacy", heading: "Privacy" },
  { id: "disclaimer", heading: "Disclaimer" },
  { id: "liability", heading: "Liability" },
  { id: "indemnification", heading: "Indemnification" },
  { id: "severability", heading: "Severability" },
  { id: "termination", heading: "Termination" },
  { id: "entire-agreement", heading: "Entire agreement" },
  { id: "changes", heading: "Changes to terms" },
  { id: "governing-law", heading: "Governing law" },
  { id: "contact", heading: "Contact us" },
];

function TOC({ activeId }) {
  return (
    <nav aria-label="Page sections" className="tos-toc">
      <p className="toc-label">On this page</p>
      <ul>
        {sections.map(({ id, heading }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`toc-link ${activeId === id ? "toc-link--active" : ""}`}
            >
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Section({ id, heading, children }) {
  return (
    <section id={id} className="tos-section">
      <h2 className="tos-section-heading">{heading}</h2>
      <div className="tos-section-body">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const els = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Google Font ── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Reset / base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tos-root {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1a1f2e;
          background: #ffffff;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Hero header ── */
        .tos-hero {
          background: linear-gradient(135deg, #0F1B2D 0%, #1a3254 60%, #0F1B2D 100%);
          padding: 64px 24px 56px;
          position: relative;
          overflow: hidden;
        }
        .tos-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,87,255,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .tos-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 10%;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,87,255,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .tos-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .tos-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
          letter-spacing: 0.01em;
        }
        .tos-breadcrumb a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.15s;
        }
        .tos-breadcrumb a:hover { color: rgba(255,255,255,0.85); }
        .tos-breadcrumb-sep { font-size: 11px; }

        .tos-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,87,255,0.18);
          border: 1px solid rgba(0,87,255,0.35);
          color: #6da8ff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .tos-tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3b82f6;
        }

        .tos-hero h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
        }
        .tos-hero h1 span {
          color: #4d9eff;
        }
        .tos-hero-intro {
          font-size: clamp(15px, 2vw, 17px);
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          max-width: 600px;
          margin-bottom: 32px;
        }
        .tos-hero-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .tos-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
        }
        .tos-meta-item svg { opacity: 0.6; flex-shrink: 0; }

        /* ── Layout: sidebar + content ── */
        .tos-layout {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px 80px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 0 56px;
          align-items: start;
        }

        /* ── Sticky TOC ── */
        .tos-toc {
          position: sticky;
          top: 24px;
          padding: 28px 0;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .tos-toc::-webkit-scrollbar { display: none; }
        .toc-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          padding: 0 0 14px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 14px;
        }
        .tos-toc ul { list-style: none; }
        .tos-toc li { margin-bottom: 2px; }
        .toc-link {
          display: block;
          font-size: 13px;
          font-weight: 450;
          color: #6b7280;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 6px;
          border-left: 2px solid transparent;
          transition: all 0.15s ease;
          line-height: 1.4;
        }
        .toc-link:hover {
          color: #111827;
          background: #f3f4f6;
          border-left-color: #d1d5db;
        }
        .toc-link--active {
          color: #0057FF;
          font-weight: 600;
          background: #eff6ff;
          border-left-color: #0057FF;
        }

        /* ── Main content ── */
        .tos-content {
          padding-top: 48px;
          min-width: 0;
        }

        .tos-section {
          padding: 40px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .tos-section:last-child { border-bottom: none; }

        .tos-section-heading {
          font-size: 20px;
          font-weight: 700;
          color: #0F1B2D;
          letter-spacing: -0.015em;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tos-section-heading::before {
          content: '';
          display: block;
          width: 3px;
          height: 20px;
          border-radius: 2px;
          background: #0057FF;
          flex-shrink: 0;
        }

        .tos-section-body p {
          font-size: 15px;
          line-height: 1.75;
          color: #374151;
          margin-bottom: 14px;
        }
        .tos-section-body p:last-child { margin-bottom: 0; }

        .tos-section-body a {
          color: #0057FF;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid rgba(0,87,255,0.25);
          transition: border-color 0.15s;
        }
        .tos-section-body a:hover { border-bottom-color: #0057FF; }

        .tos-section-body ul {
          margin: 12px 0 14px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tos-section-body ul li {
          font-size: 15px;
          line-height: 1.65;
          color: #374151;
          padding: 10px 16px 10px 44px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          position: relative;
        }
        .tos-section-body ul li::before {
          content: '→';
          position: absolute;
          left: 16px;
          color: #0057FF;
          font-weight: 700;
          font-size: 13px;
          top: 50%;
          transform: translateY(-50%);
        }

        .tos-contact-box {
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 100%);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 24px 28px;
          margin-top: 16px;
        }
        .tos-contact-box strong { color: #0F1B2D; display: block; margin-bottom: 4px; font-size: 15px; }
        .tos-contact-box p { margin-bottom: 4px !important; }

        /* ── Mobile TOC toggle ── */
        .tos-mobile-toc-toggle {
          display: none;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          margin: 24px 0 0;
        }
        .tos-mobile-toc-toggle svg { transition: transform 0.2s; }
        .tos-mobile-toc-toggle.open svg { transform: rotate(180deg); }
        .tos-mobile-toc-panel {
          display: none;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 10px 10px;
          padding: 12px 8px 16px;
          margin-bottom: 8px;
        }
        .tos-mobile-toc-panel.open { display: block; }
        .tos-mobile-toc-panel .toc-link {
          font-size: 14px;
          padding: 8px 12px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .tos-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .tos-toc { display: none; }
          .tos-mobile-toc-toggle { display: flex; }
          .tos-content { padding-top: 8px; }
        }

        @media (max-width: 600px) {
          .tos-hero { padding: 44px 20px 40px; }
          .tos-layout { padding: 0 20px 60px; }
          .tos-section { padding: 32px 0; }
          .tos-section-heading { font-size: 18px; }
          .tos-section-body p, .tos-section-body ul li { font-size: 14.5px; }
        }
      `}</style>

      <div className="tos-root">
        {/* ── Hero ── */}
        <header className="tos-hero">
          <div className="tos-hero-inner">
            <nav className="tos-breadcrumb">
              <a href="/">Home</a>
              <span className="tos-breadcrumb-sep">›</span>
              <span>Terms of Service</span>
            </nav>

            <div className="tos-tag">
              <span className="tos-tag-dot" />
              Legal Document
            </div>

            <h1>
              Terms of <span>Service</span>
            </h1>

            <p className="tos-hero-intro">
              These terms govern your use of the Hardvanta website and any
              purchases you make with us. We have written them to be clear and
              fair — if anything is unclear, our support team is happy to help.
            </p>

            <div className="tos-hero-meta">
              <span className="tos-meta-item">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Effective June 2026
              </span>
              <span className="tos-meta-item">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                Greater Noida, UP, India
              </span>
              <span className="tos-meta-item">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                </svg>
                Hardvanta Technologies LLP
              </span>
            </div>
          </div>
        </header>

        {/* ── Layout ── */}
        <div className="tos-layout">
          {/* Sidebar TOC — desktop */}
          <TOC activeId={activeId} />

          {/* Main content */}
          <main className="tos-content">
            {/* Mobile TOC toggle */}
            <button
              className={`tos-mobile-toc-toggle ${tocOpen ? "open" : ""}`}
              onClick={() => setTocOpen((v) => !v)}
              aria-expanded={tocOpen}
            >
              Jump to section
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`tos-mobile-toc-panel ${tocOpen ? "open" : ""}`}>
              {sections.map(({ id, heading }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`toc-link ${activeId === id ? "toc-link--active" : ""}`}
                  onClick={() => setTocOpen(false)}
                >
                  {heading}
                </a>
              ))}
            </div>

            <Section id="overview" heading="Overview">
              <p>
                This website is operated by Hardvanta Technologies LLP.
                Throughout these terms, &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer to
                Hardvanta Technologies LLP. By accessing or using this site —
                whether browsing, creating an account, or placing an order —
                you agree to be bound by these Terms of Service.
              </p>
              <p>
                These terms apply to all users of the site, including
                customers, browsers, and any contributors of content. Please
                read them carefully before using our website or placing an
                order. If you do not agree, you may not access or use our
                services.
              </p>
              <p>
                We may update these terms from time to time. The most current
                version will always be available on this page. Your continued
                use of the site after any changes constitutes acceptance of the
                updated terms.
              </p>
            </Section>

            <Section id="eligibility" heading="Eligibility and use of the website">
              <p>
                You must be at least 18 years of age to make purchases on this
                site. If you are under 18, you may only use this site with the
                involvement and consent of a parent or legal guardian.
              </p>
              <p>
                You agree to use this website only for lawful purposes and in a
                manner that does not infringe the rights of others or restrict
                their use and enjoyment of the site. You must not transmit any
                viruses, malware, or code of a destructive nature.
              </p>
              <p>
                A breach of any of these terms will result in immediate
                termination of your access to our services.
              </p>
            </Section>

            <Section id="account" heading="Account and information accuracy">
              <p>
                When creating an account or placing an order, you agree to
                provide accurate, complete, and current information — including
                your name, email address, and shipping address. You are
                responsible for keeping this information up to date.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials. Hardvanta is not liable for any loss
                arising from unauthorised access to your account due to your
                failure to keep login details secure.
              </p>
              <p>
                Hardvanta is not responsible for failed or delayed deliveries
                caused by inaccurate or incomplete shipping information
                provided at the time of order.
              </p>
            </Section>

            <Section id="product-info" heading="Accuracy of product information">
              <p>
                We make every effort to ensure product descriptions, images,
                pricing, and availability information on this site are
                accurate. However, we do not warrant that all content is free
                of errors or omissions at all times. Product images are for
                illustrative purposes; the actual item may differ slightly in
                appearance.
              </p>
              <p>
                We reserve the right to correct any errors, update pricing, or
                cancel orders where information on the site was inaccurate at
                the time of purchase — including after an order has been
                placed. We will notify you promptly in such cases.
              </p>
            </Section>

            <Section id="pricing" heading="Pricing and product availability">
              <p>
                All prices are listed in Indian Rupees (₹) and are inclusive
                of applicable taxes unless otherwise stated. Prices may change
                at any time without prior notice. The price applicable to your
                order is the price displayed at the time you complete checkout.
              </p>
              <p>
                Products are sold subject to availability. We reserve the
                right to limit quantities per customer, cancel bulk or reseller
                orders, and discontinue any product at any time. If an item you
                ordered becomes unavailable, we will notify you and issue a
                full refund for the affected item.
              </p>
            </Section>

            <Section id="orders" heading="Orders and payment">
              <p>
                Placing an order constitutes an offer to purchase, not a
                confirmed contract. For prepaid orders, your order is confirmed
                once payment is successfully received and verified. For Cash on
                Delivery (COD) orders, confirmation occurs at the time of
                placement, subject to address verification.
              </p>
              <p>
                Hardvanta reserves the right to refuse, modify, or cancel any
                order at our discretion — for example, if a product is
                mispriced, if fraudulent activity is suspected, or if an order
                cannot be fulfilled. We also reserve the right to limit or
                reject orders that appear to be placed by resellers or
                distributors without prior agreement.
              </p>
              <p>
                If we cancel a prepaid order, you will receive a full refund to
                your original payment method within 5–7 business days. We are
                not responsible for processing delays on the part of your bank
                or payment gateway after the refund has been initiated from our
                side.
              </p>
            </Section>

            <Section id="shipping" heading="Shipping and delivery">
              <p>
                Estimated delivery timelines shown at checkout are indicative
                only. Actual delivery may vary due to courier conditions,
                public holidays, remote delivery locations, or other
                circumstances beyond our control.
              </p>
              <p>
                Risk of loss and title for products pass to you upon successful
                delivery to the shipping address you provided. If your order
                appears significantly delayed beyond the estimated window, or
                is marked as delivered but has not been received, please
                contact our support team within 7 days of the expected delivery
                date.
              </p>
              <p>
                Hardvanta is not responsible for delays caused by third-party
                courier partners once the shipment has been dispatched.
              </p>
            </Section>

          <Section id="refunds" heading=" Refunds">
  <p>
    If you make an online payment while placing an order and choose to cancel
    the order <strong>before it has been shipped</strong>, you will be eligible
    for a full refund.
  </p>

  <p>
    The refunded amount will be processed back to your original payment method
    within <strong>1–3 business days</strong>, depending on your bank or
    payment service provider.
  </p>

  <p>Please note:</p>

  <ul>
    <li>
      Refunds are applicable only for orders cancelled{" "}
      <strong>before shipment</strong>.
    </li>
    <li>
      Once an order has been shipped, it may no longer be eligible for
      cancellation or refund, as per our Cancellation &amp; Return Policy.
    </li>
  </ul>

  <p>
    For any refund-related queries, please contact our customer support team at{" "}
    <a href="mailto:support@hardvanta.com">
      support@hardvanta.com
    </a>.
  </p>
</Section>

            <Section id="intended-use" heading="Intended use of products">
              <p>
                All electronic components, modules, microcontrollers, and
                development boards sold by Hardvanta are intended strictly for
                prototyping, educational, hobbyist, and research purposes. They
                are not tested, rated, or certified for use in safety-critical,
                life-sustaining, medical, aviation, automotive, or industrial
                production environments.
              </p>
              <p>
                By purchasing our products, you confirm that you possess the
                necessary technical knowledge to handle electronic components
                safely. You accept full responsibility for any outcomes,
                damages, or injuries arising from their use, including damage
                caused by incorrect wiring, voltage mismatches, electrostatic
                discharge, or operation beyond rated specifications.
              </p>
            </Section>

            <Section id="prohibited" heading="Prohibited conduct">
              <p>
                In addition to other restrictions set out in these terms, you
                agree not to use this website or its content to:
              </p>
              <ul>
                <li>
                  Violate any applicable law or regulation in India or your
                  jurisdiction
                </li>
                <li>
                  Infringe on any intellectual property rights belonging to
                  Hardvanta or any third party
                </li>
                <li>
                  Upload or transmit viruses, malware, or any harmful or
                  destructive code
                </li>
                <li>
                  Collect, harvest, or track personal information of other
                  users
                </li>
                <li>
                  Use automated tools to scrape, spider, or crawl any part of
                  the site
                </li>
                <li>
                  Submit false, misleading, or fraudulent order or account
                  information
                </li>
                <li>
                  Resell products purchased from Hardvanta commercially without
                  prior written agreement
                </li>
                <li>
                  Spam, phish, or attempt to deceive Hardvanta or other users
                </li>
                <li>
                  Harass, defame, discriminate against, or intimidate any
                  person
                </li>
                <li>
                  Interfere with or attempt to circumvent the security features
                  of this website
                </li>
              </ul>
              <p>
                We reserve the right to terminate your account and pursue
                appropriate legal remedies for any violation of these
                prohibitions.
              </p>
            </Section>

            <Section id="third-party" heading="Third-party links and tools">
              <p>
                Our website may contain links to external websites or services
                not operated by Hardvanta. These are provided for convenience
                only. We have no control over and accept no responsibility for
                the content, accuracy, privacy practices, or terms of any
                third-party site.
              </p>
              <p>
                We may also provide access to optional third-party tools on an
                &quot;as is&quot; basis without any warranties or endorsement. Use of
                such tools is entirely at your own discretion and risk. We
                recommend reviewing the terms of any third-party service before
                engaging with it.
              </p>
            </Section>

            <Section id="submissions" heading="User submissions and feedback">
              <p>
                If you send us feedback, suggestions, reviews, or other
                submissions, you grant Hardvanta a non-exclusive right to use,
                publish, and incorporate that content into our services without
                obligation to compensate you or keep it confidential.
              </p>
              <p>
                You agree that any content you submit will not be unlawful,
                harmful, misleading, or in violation of any third party&apos;s
                rights. You are solely responsible for the accuracy of anything
                you submit to us or post on our platform.
              </p>
            </Section>

            <Section id="privacy" heading="Privacy and personal information">
              <p>
                Your submission of personal information through this site is
                governed by our{" "}
                <a href="/privacy-policy">Privacy Policy</a>, which forms part
                of these Terms of Service. By using this site, you consent to
                the collection and use of your information as described
                therein.
              </p>
            </Section>

            <Section id="disclaimer" heading="Disclaimer of warranties">
              <p>
                This website and its content are provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind — express or implied.
                We do not guarantee uninterrupted, timely, or error-free access
                to our website or services.
              </p>
              <p>
                We do not warrant that products purchased will meet every
                individual customer&apos;s specific expectations or technical
                requirements. It is your responsibility to verify product
                specifications before purchasing.
              </p>
            </Section>

            <Section id="liability" heading="Limitation of liability">
              <p>
                To the fullest extent permitted under applicable Indian law,
                Hardvanta Technologies LLP — including its directors,
                employees, agents, and suppliers — shall not be liable for any
                indirect, incidental, special, punitive, or consequential
                damages arising from your use of this website or products
                purchased from us, including loss of data, revenue, or
                business.
              </p>
              <p>
                Our total liability for any claim arising from a specific order
                shall not exceed the amount you paid for the product giving
                rise to that claim.
              </p>
              <p>
                Nothing in these terms excludes or limits our liability for
                fraud, wilful misconduct, gross negligence, or any liability
                that cannot be excluded under the Consumer Protection Act, 2019
                or other applicable Indian law. Your statutory rights as a
                consumer are not affected by these terms.
              </p>
            </Section>

            <Section id="indemnification" heading="Indemnification">
              <p>
                You agree to indemnify and hold harmless Hardvanta Technologies
                LLP and its directors, employees, agents, and partners from any
                claim, demand, loss, liability, or expense — including
                reasonable legal fees — arising from your breach of these Terms
                of Service, your violation of any applicable law, or your
                infringement of any third party&apos;s rights through your use of
                our website or services.
              </p>
            </Section>

            <Section id="severability" heading="Severability">
              <p>
                If any provision of these Terms of Service is found to be
                unlawful, void, or unenforceable, that provision shall be
                enforceable to the maximum extent permitted by law, and the
                unenforceable portion shall be considered severed from these
                terms. This shall not affect the validity or enforceability of
                any remaining provisions.
              </p>
            </Section>

            <Section id="termination" heading="Termination">
              <p>
                These Terms of Service remain in effect for as long as you use
                our website. We may suspend or terminate your access at any
                time, with or without notice, if we determine you have violated
                these terms or engaged in conduct that is harmful to Hardvanta,
                our customers, or any third party.
              </p>
              <p>
                You may stop using our services at any time. Any obligations
                and liabilities incurred before termination shall survive,
                including provisions relating to intellectual property,
                limitation of liability, and indemnification.
              </p>
            </Section>

            <Section id="entire-agreement" heading="Entire agreement">
              <p>
                These Terms of Service, together with our Privacy Policy and
                any other policies published on this site, constitute the
                entire agreement between you and Hardvanta Technologies LLP
                regarding your use of our website and services. They supersede
                all prior communications, proposals, or agreements between us —
                whether oral or written.
              </p>
              <p>
                Our failure to enforce any right or provision of these terms
                shall not constitute a waiver of that right or provision.
              </p>
            </Section>

            <Section id="changes" heading="Changes to these terms">
              <p>
                We may update these Terms of Service from time to time to
                reflect changes in our practices, services, or applicable law.
                When we do, the effective date at the top of this page will be
                updated. For significant changes, we may also notify registered
                customers by email.
              </p>
              <p>
                Your continued use of this website after any update constitutes
                your acceptance of the revised terms. We encourage you to
                review this page periodically.
              </p>
            </Section>

            <Section id="governing-law" heading="Governing law and disputes">
              <p>
                These Terms of Service are governed by and construed in
                accordance with the laws of India. Any disputes arising under
                or in connection with these terms shall be subject to the
                exclusive jurisdiction of the courts in Greater Noida, Uttar
                Pradesh, India.
              </p>
              <p>
                In the event of a dispute, we strongly encourage you to contact
                our support team first. We are committed to resolving issues
                quickly and fairly. Under the Consumer Protection Act, 2019,
                you also retain the right to approach the appropriate consumer
                forum — nothing in these terms is intended to limit those
                statutory rights.
              </p>
            </Section>

            <Section id="contact" heading="Contact us">
              <p>
                Questions or concerns about these Terms of Service can be sent
                to us at{" "}
                <a href="mailto:support@hardvanta.com">
                  support@hardvanta.com
                </a>
                . Our support team typically responds within 1–2 business days.
              </p>
              <div className="tos-contact-box">
                <strong>Hardvanta Technologies LLP</strong>
                <p>Plot 046, Knowledge Park 3, Alpha, Greater Noida, Uttar Pradesh - 201310, India</p>
                <p>
                  <a href="mailto:support@hardvanta.com">
                    support@hardvanta.com
                  </a>
                </p>
                <p style={{ marginTop: "10px", fontSize: "13px", color: "#6b7280" }}>
                  Effective date: June 2026
                </p>
              </div>
            </Section>
          </main>
        </div>
      </div>
    </>
  );
}