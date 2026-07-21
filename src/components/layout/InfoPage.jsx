import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Shared layout for simple text/content pages (policies, info, etc.).
export default function InfoPage({ title, intro, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      <div className="container-page relative py-10">
        <nav className="mb-6 flex items-center gap-1 text-sm text-white/50">
          <Link href="/" className="hover:text-electric-light">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">{title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {intro && <p className="mt-3 max-w-3xl text-white/60">{intro}</p>}

        <div className="prose-info mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-white/70">
          {children}
        </div>
      </div>
    </div>
  );
}

// Small helpers for consistent section styling inside InfoPage.
export function Section({ heading, children }) {
  return (
    <section>
      {heading && (
        <h2 className="mb-2 text-lg font-bold text-white">{heading}</h2>
      )}
      <div className="space-y-2">{children}</div>
    </section>
  );
}
