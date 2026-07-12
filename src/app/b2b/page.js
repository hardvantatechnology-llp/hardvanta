import B2BEnquiryForm from "@/components/b2b/B2BEnquiryForm";

export const metadata = {
  title: "Hardvanta B2B | Bulk Orders & Prototyping Services",
  description:
    "Hardvanta B2B — Bulk orders, prototyping services, and enterprise solutions for businesses, schools, and institutions across India.",
};

const benefits = [
  { icon: "💰", title: "Best Bulk Pricing", desc: "Special discounted rates for large quantity orders. The more you buy, the more you save." },
  { icon: "🚚", title: "Priority Shipping", desc: "Dedicated logistics support with faster delivery timelines for B2B partners." },
  { icon: "🧾", title: "GST Invoice", desc: "Proper GST-compliant invoices for all business purchases and tax filing." },
  { icon: "🤝", title: "Dedicated Support", desc: "A dedicated account manager to assist with every step of your order." },
  { icon: "🔁", title: "Repeat Orders", desc: "Easy reordering system for your recurring component requirements." },
  { icon: "📦", title: "Custom Packaging", desc: "Custom-labeled packaging available for resellers and institutes." },
];

const prototypingServices = [
  { icon: "🖥️", title: "PCB Design & Fabrication", desc: "Custom PCB design, Gerber file review, and fabrication for your hardware projects." },
  { icon: "🤖", title: "Embedded Systems", desc: "End-to-end embedded product development with microcontrollers and firmware." },
  { icon: "🌐", title: "IoT Prototyping", desc: "Rapid IoT device prototyping with cloud integration and mobile app support." },
  { icon: "🏭", title: "Industrial Automation", desc: "Custom automation solutions for manufacturing and production lines." },
];

const whoWeServe = [
  { label: "Schools & Colleges", icon: "🎓" },
  { label: "Startups", icon: "🚀" },
  { label: "Manufacturers", icon: "🏭" },
  { label: "Research Labs", icon: "🔬" },
  { label: "Resellers", icon: "🏪" },
  { label: "Government Bodies", icon: "🏛️" },
];

export default function B2BPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-royal-dark to-navy px-6 py-20 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">
          Business Solutions
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          Hardvanta B2B
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75">
          Bulk pricing, priority fulfillment, and dedicated support for
          businesses, institutions, and resellers across India.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#bulk"
            className="rounded-lg bg-white px-8 py-3 text-sm font-bold text-navy hover:bg-silver-light transition-colors"
          >
            Bulk Orders
          </a>
          <a
            href="#prototyping"
            className="rounded-lg border border-white px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            Prototyping Services
          </a>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-b border-silver-light bg-cloud py-10">
        <div className="container-page">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-silver-dark">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {whoWeServe.map((w) => (
              <div
                key={w.label}
                className="flex items-center gap-2 rounded-full border border-silver-light bg-white px-5 py-2 text-sm font-medium text-navy shadow-sm"
              >
                <span>{w.icon}</span> {w.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders */}
      <section id="bulk" className="container-page py-16 scroll-mt-24">
        <p className="text-xs font-bold uppercase tracking-widest text-royal">
          Bulk Orders
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy">
          Order in Bulk, Save More
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-silver-dark">
          Whether you need 50 Arduino boards or 10,000 resistors — we supply
          in bulk with best-in-market pricing, GST invoicing, and fast delivery
          across India.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-silver-light bg-cloud p-6 hover:shadow-card transition-shadow"
            >
              <span className="text-3xl">{b.icon}</span>
              <h3 className="mt-3 font-bold text-navy">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-silver-dark">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Bulk Enquiry Form */}
        <B2BEnquiryForm />
      </section>

      {/* Prototyping Services */}
      <section id="prototyping" className="bg-cloud py-16 scroll-mt-24">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-widest text-royal">
            Prototyping Services
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">
            Turn Your Idea into Reality
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-silver-dark">
            From concept to working prototype — our engineering team handles
            PCB design, embedded firmware, IoT integration, and industrial
            automation for your product.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {prototypingServices.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-silver-light bg-white p-6 shadow-sm hover:shadow-card transition-shadow"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-silver-dark">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-navy to-royal-dark px-8 py-10 text-center text-white">
            <h3 className="text-2xl font-extrabold">
              Ready to Start Your Project?
            </h3>
            <p className="mt-2 text-sm text-white/75">
              Talk to our engineering team for a free consultation.
            </p>
            <a
              href="tel:+919170546395"
              className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-sm font-bold text-navy hover:bg-silver-light transition-colors"
            >
              📞 Call +91 91705 46395
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}