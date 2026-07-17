export const metadata = {
  title: "About Us | Hardvanta Technologies LLP",
  description:
    "Hardvanta Technologies LLP is a research-driven engineering company specializing in Embedded Systems, IoT Development, PCB Design, Firmware Engineering, Artificial Intelligence, Industrial Automation, and Smart Technology Solutions.",
};

const services = [
  {
    icon: "🔌",
    title: "Embedded Systems",
    desc: "Microcontroller & PCB design for industrial and consumer applications.",
  },
  {
    icon: "🤖",
    title: "AI Solutions",
    desc: "Deep learning & edge computing systems for real-world automation.",
  },
  {
    icon: "🏭",
    title: "Industrial Automation",
    desc: "Smart factories & robotics for next-generation manufacturing.",
  },
  {
    icon: "🌐",
    title: "IoT Development",
    desc: "Industrial IoT platforms connecting devices for smarter operations.",
  },
  {
    icon: "🖥️",
    title: "Firmware Engineering",
    desc: "Low-level firmware development for embedded hardware systems.",
  },
  {
    icon: "🔬",
    title: "R&D Services",
    desc: "Research-driven engineering solutions for future-ready enterprises.",
  },
];

const stats = [
  { value: "99.9%", label: "Reliability & Security" },
  { value: "99.82%", label: "AI Accuracy" },
  { value: "12+", label: "Active Nodes" },
  { value: "42°C", label: "Optimized Core Temp" },
];

const highlights = [
  {
    title: "Enterprise Grade",
    desc: "We build systems with 99.9% uptime, military-grade security, and enterprise-ready scalability.",
  },
  {
    title: "Research-Driven",
    desc: "Every solution is backed by deep engineering research, iterative prototyping, and real-world testing.",
  },
  {
    title: "Future-Ready",
    desc: "Our platforms are designed to evolve — supporting emerging tech like Edge AI, 5G IoT, and beyond.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian px-6 py-20 text-center text-white">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
          HARDVANTA TECHNOLOGIES LLP
        </p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Engineering <br />
          <span className="text-electric-light">Intelligent Systems</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75">
          Hardvanta Technologies LLP develops scalable intelligent systems,
          embedded technologies, industrial automation platforms, and AI-powered
          engineering infrastructure for future-ready enterprises.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60">
          We combine advanced engineering research, Industrial IoT, embedded
          intelligence, and automation systems to build reliable
          high-performance industrial solutions.
        </p>
        <a
          href="https://hardvantatechnologies.in"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-gradient-to-r from-electric to-liquid px-8 py-3 text-sm font-bold text-white shadow-glow-electric hover:brightness-110 transition-all"
        >
          Work With Us
        </a>
      </section>

      {/* ── System Status Bar ── */}
      <section className="relative border-y border-white/10 bg-graphite">
        <div className="container-page flex flex-wrap items-center justify-center gap-6 py-4 text-center sm:justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            EDGE_NODE // HARDVANTA_SYS_A
          </span>
          <div className="flex flex-wrap gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-extrabold text-electric-light">{s.value}</p>
                <p className="text-[11px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
          <span className="flex items-center gap-2 text-xs font-semibold text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            SYSTEM STATUS: ACTIVE
          </span>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="container-page relative py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-electric-light">
              Who We Are
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Innovation Through Engineering
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Hardvanta Technologies LLP is a research-driven engineering
              company specializing in Embedded Systems, IoT Development, PCB
              Design, Firmware Engineering, Artificial Intelligence, Industrial
              Automation, and Smart Technology Solutions.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60">
              We believe in making advanced technology accessible — from
              students building their first embedded system to enterprises
              deploying industrial-grade AI automation.
            </p>
          </div>

          {/* Highlight Cards */}
          <div className="flex flex-col gap-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-xl glass-card p-5"
              >
                <h3 className="font-bold text-white">{h.title}</h3>
                <p className="mt-1 text-sm text-white/60">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="relative bg-graphite py-16">
        <div className="container-page">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-electric-light">
            What We Do
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Our Core Services
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl glass-card p-6 hover:brightness-110 transition-all"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="container-page relative py-16">
        <div className="rounded-2xl bg-gradient-to-r from-obsidian via-midnight to-obsidian px-8 py-12 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">
            Our Mission
          </p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Building the Future of Engineering
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75">
            To become India&apos;s most trusted destination for embedded
            systems, AI, and industrial automation — delivering research-backed
            engineering solutions that power next-generation enterprises with
            reliability, intelligence, and innovation.
          </p>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="relative border-t border-white/10 bg-graphite py-14 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-electric-light">
          Get In Touch
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">
          Let&apos;s Build Something Great
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
          Have a project in mind? Our engineering team is ready to help you
          design, build, and deploy intelligent systems.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="tel:+919170546395"
            className="rounded-lg bg-gradient-to-r from-electric to-liquid px-8 py-3 text-sm font-bold text-white shadow-glow-electric hover:brightness-110 transition-all"
          >
            📞 +91 91705 46395
          </a>
          <a
            href="https://hardvantatechnologies.in"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            Visit Website →
          </a>
        </div>
      </section>

    </main>
  );
}