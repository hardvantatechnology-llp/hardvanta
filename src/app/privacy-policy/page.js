import React from "react";

export const metadata = { title: "Privacy Policy — Hardvanta" };

const css = `
  .pp-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0d0f16;
    min-height: 100vh;
    color: rgba(255,255,255,0.7);
  }
  .pp-hero {
    background: linear-gradient(120deg, #0f1b3d 0%, #1a2e6b 60%, #2a3f8f 100%);
    padding: 3rem 1.5rem 2.5rem;
    position: relative;
    overflow: hidden;
  }
  .pp-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .pp-hero-inner {
    max-width: 860px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .pp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }
  .pp-breadcrumb a {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
  }
  .pp-breadcrumb a:hover { color: #fff; }
  .pp-breadcrumb-active { color: #a5b4fc; }
  .pp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(165,180,252,0.15);
    border: 1px solid rgba(165,180,252,0.3);
    color: #a5b4fc;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 100px;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .pp-hero h1 {
    font-size: clamp(26px, 5vw, 40px);
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.75rem;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }
  .pp-hero-intro {
    font-size: 15px;
    color: rgba(255,255,255,0.68);
    margin: 0;
    max-width: 520px;
    line-height: 1.6;
  }
  .pp-body {
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }
  .pp-toc {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 2.5rem;
  }
  .pp-toc-title {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 0.875rem;
  }
  .pp-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 4px 1.5rem;
  }
  .pp-toc-list li a {
    font-size: 13.5px;
    color: #3b82f6;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
  }
  .pp-toc-list li a:hover { color: #60a5fa; }
  .pp-toc-list li a::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(59,130,246,0.5);
    flex-shrink: 0;
  }
  .pp-section {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 2rem 2rem 1.75rem;
    margin-bottom: 1.25rem;
    transition: box-shadow 0.2s;
  }
  .pp-section:hover { box-shadow: 0 4px 20px rgba(59,130,246,0.25); }
  .pp-section-label {
    font-size: 11px;
    font-weight: 700;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 0.6rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pp-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(59,130,246,0.25);
    max-width: 40px;
  }
  .pp-section h2 {
    font-size: clamp(17px, 2.5vw, 20px);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 1rem;
    letter-spacing: -0.2px;
    line-height: 1.3;
  }
  .pp-section h3 {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    margin: 1.25rem 0 0.4rem;
  }
  .pp-section p {
    font-size: 15px;
    color: rgba(255,255,255,0.7);
    line-height: 1.8;
    margin: 0 0 0.9rem;
  }
  .pp-section p:last-child { margin-bottom: 0; }
  .pp-callout {
    background: rgba(59,130,246,0.12);
    border-left: 3px solid #3b82f6;
    border-radius: 0 8px 8px 0;
    padding: 1rem 1.25rem;
    margin: 1rem 0;
    font-size: 14px;
    color: rgba(255,255,255,0.85);
    line-height: 1.7;
  }
  .pp-callout strong { font-weight: 700; color: #ffffff; }
  .pp-cookie-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
    margin: 0.75rem 0;
  }
  .pp-cookie-table th {
    background: rgba(255,255,255,0.08);
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 9px 14px;
    border-bottom: 2px solid rgba(255,255,255,0.15);
  }
  .pp-cookie-table td {
    padding: 9px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    font-family: monospace;
    font-size: 13px;
  }
  .pp-cookie-table tr:last-child td { border-bottom: none; }
  .pp-contact-card {
    background: linear-gradient(135deg, #0f1b3d, #1a2e6b);
    border-radius: 14px;
    padding: 2rem;
    margin-top: 2rem;
    color: #fff;
  }
  .pp-contact-card h2 {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
  }
  .pp-contact-card p {
    font-size: 14.5px;
    color: rgba(255,255,255,0.72);
    line-height: 1.7;
    margin: 0 0 0.6rem;
  }
  .pp-contact-card a { color: #a5b4fc; text-decoration: none; font-weight: 600; }
  .pp-contact-card a:hover { text-decoration: underline; }
  .pp-contact-address {
    margin-top: 1rem;
    font-size: 13.5px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
  }
  .pp-footer-note {
    margin-top: 2.5rem;
    text-align: center;
    font-size: 12.5px;
    color: rgba(255,255,255,0.4);
  }
  @media (max-width: 640px) {
    .pp-hero { padding: 2rem 1.25rem; }
    .pp-body { padding: 1.5rem 1rem 4rem; }
    .pp-section { padding: 1.5rem 1.25rem; }
    .pp-toc { padding: 1.25rem; }
    .pp-toc-list { grid-template-columns: 1fr; }
    .pp-contact-card { padding: 1.5rem 1.25rem; }
    .pp-cookie-table { font-size: 12px; }
    .pp-cookie-table th, .pp-cookie-table td { padding: 7px 10px; }
  }
`;

const tocItems = [
  ["#collect",     "Information we collect"],
  ["#consent",     "Consent"],
  ["#disclosure",  "Disclosure"],
  ["#payment",     "Payment security"],
  ["#third-party", "Third-party services"],
  ["#security",    "Security"],
  ["#cookies",     "Cookies"],
  ["#age",         "Age of consent"],
  ["#changes",     "Policy changes"],
  ["#contact",     "Contact us"],
];

function Section({ id, label, heading, children }) {
  return (
    <div className="pp-section" id={id}>
      <p className="pp-section-label">{label}</p>
      <h2>{heading}</h2>
      {children}
    </div>
  );
}

function Callout({ children }) {
  return <div className="pp-callout">{children}</div>;
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="pp-root">

        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-inner">
            <nav className="pp-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="pp-breadcrumb-active">Privacy Policy</span>
            </nav>
            <div className="pp-hero-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Privacy First
            </div>
            <h1>Privacy Policy</h1>
            <p className="pp-hero-intro">
              How Hardvanta Technologies LLP collects, uses, and protects your personal information — last updated june 2026.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="pp-body">

          {/* TOC */}
          <div className="pp-toc">
            <p className="pp-toc-title">On this page</p>
            <ul className="pp-toc-list">
              {tocItems.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <Section id="collect" label="Section 1" heading="Information we collect">
            <p>
              When you purchase something from our store, as part of the buying and selling process, we collect the personal information you provide — including your name, address, email address, and phone number.
            </p>
            <p>
              When you browse our store, we also automatically receive your device&#39;s internet protocol (IP) address, which helps us understand your browser and operating system.
            </p>
            <Callout>
              <strong>Explicit consent:</strong> When you provide personal information to complete a transaction, verify payment, place an order, or sign up — you are giving us your consent to reach out through communication channels including RCS, WhatsApp, Email, and SMS.
            </Callout>
          </Section>

          {/* Section 2 */}
          <Section id="consent" label="Section 2" heading="Consent">
            <h3>How do we get your consent?</h3>
            <p>
              When you provide personal information to complete a transaction, arrange delivery, or return a purchase, we imply that you consent to our collecting and using it for that specific reason only.
            </p>
            <p>
              If we ask for your personal information for a secondary reason, such as marketing, we will ask for your expressed consent or give you an opportunity to opt out.
            </p>
            <h3>How do you withdraw your consent?</h3>
            <p>
              If after opting in you change your mind, you may withdraw your consent at any time by contacting us at{" "}
              <a href="mailto:info@hardvantatechnology.com" style={{ color: "#3b82f6", fontWeight: 600 }}>info@hardvantatechnology.com</a>.
            </p>
          </Section>

          {/* Section 3 */}
          <Section id="disclosure" label="Section 3" heading="Disclosure">
            <p>
              We may disclose your personal information if we are required by law to do so, or if you violate our Terms of Service.
            </p>
          </Section>

          {/* Section 4 */}
          <Section id="payment" label="Section 4" heading="Payment security">
            <p>
              Payments on our platform are processed by <strong>Razorpay</strong>. We do not store your card or UPI details on our servers.
            </p>
            <p>
              All payment gateways adhere to the standards set by PCI-DSS, managed by the PCI Security Standards Council — a joint effort of Visa, MasterCard, American Express, and Discover.
            </p>
            <Callout>
              Purchase transaction data is stored only as long as necessary to complete your transaction and is deleted immediately thereafter.
            </Callout>
          </Section>

          {/* Section 5 */}
          <Section id="third-party" label="Section 5" heading="Third-party services">
            <p>
              Third-party providers we use will only collect, use, and disclose your information to the extent necessary to perform the services they provide to us.
            </p>
            <p>
              Certain providers — such as payment gateways — have their own privacy policies. We recommend reading them so you understand how your information is handled.
            </p>
            <p>
              Once you leave our website or are redirected to a third-party application, this Privacy Policy no longer applies. We encourage you to read the privacy statements of every site you visit.
            </p>
          </Section>

          {/* Section 6 */}
          <Section id="security" label="Section 6" heading="Security">
            <p>
              To protect your personal information, we take reasonable precautions and follow industry best practices to ensure it is not lost, misused, accessed without authorisation, disclosed, altered, or destroyed.
            </p>
            <p>
              Credit card information is encrypted using SSL and stored with AES-256 encryption. Although no method of transmission over the internet is 100% secure, we follow all PCI-DSS requirements and additional accepted industry standards.
            </p>
          </Section>

          {/* Cookies */}
          <Section id="cookies" label="Cookies" heading="Cookies we use">
            <p>
              We use cookies to provide a seamless shopping experience. Here is a list of cookies so you can choose whether to opt out.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="pp-cookie-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: "180px" }}>Cookie name</th>
                    <th style={{ minWidth: "200px" }}>Purpose</th>
                    <th style={{ minWidth: "100px" }}>Type</th>
                    <th style={{ minWidth: "140px" }}>Duration</th>
                    <th style={{ minWidth: "160px" }}>Personal data collected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code style={{ background: "rgba(59,130,246,0.12)", padding: "2px 7px", borderRadius: "5px", fontSize: "12px", color: "#93c5fd" }}>woocommerce_cart_hash</code></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>Maintains the shopping cart state between pages</td>
                    <td><span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: "12px", fontWeight: 600, padding: "2px 9px", borderRadius: "100px" }}>Essential</span></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>Session</td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>No</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: "rgba(59,130,246,0.12)", padding: "2px 7px", borderRadius: "5px", fontSize: "12px", color: "#93c5fd" }}>woocommerce_items_in_cart</code></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>Tracks the number of items in the cart</td>
                    <td><span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: "12px", fontWeight: 600, padding: "2px 9px", borderRadius: "100px" }}>Essential</span></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>Session</td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>No</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: "rgba(59,130,246,0.12)", padding: "2px 7px", borderRadius: "5px", fontSize: "12px", color: "#93c5fd" }}>wp_woocommerce_session_</code></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>Stores a unique session identifier for the customer</td>
                    <td><span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: "12px", fontWeight: 600, padding: "2px 9px", borderRadius: "100px" }}>Essential</span></td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>2 Days (or session duration)</td>
                    <td style={{ fontFamily: "inherit", fontSize: "13.5px" }}>No direct personal data</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.4)", marginTop: "0.75rem" }}>
              No personal information is stored within these cookies.
            </p>
          </Section>

          {/* Section 7 */}
          <Section id="age" label="Section 7" heading="Age of consent">
            <p>
              By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you have given consent for any minor dependents to use this site.
            </p>
          </Section>

          {/* Section 8 */}
          <Section id="changes" label="Section 8" heading="Changes to this policy">
            <p>
              We reserve the right to modify this Privacy Policy at any time. Changes take effect immediately upon being posted on the website. We encourage you to review this page frequently.
            </p>
            <p>
              If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to serve you.
            </p>
          </Section>

          {/* Contact */}
          <div className="pp-contact-card" id="contact">
            <h2>Questions or concerns?</h2>
            <p>
              If you would like to access, correct, amend, or delete any personal information we hold, or wish to register a complaint, please reach out to our Privacy Compliance Officer.
            </p>
            <p>
              <a href="mailto:info@hardvantatechnology.com">info@hardvantatechnology.com</a>
            </p>
            <div className="pp-contact-address">
              Hardvanta Technologies LLP<br />
              [Plot 046, Knowledge Park 3, Alpha, Greater Noida, Uttar Pradesh - 201310, India]<br />
              
            </div>
          </div>

          <p className="pp-footer-note">
            This policy is effective as of June 2026 · Hardvanta Technologies LLP
          </p>

        </div>
      </div>
    </>
  );
}