import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Shared layout for simple text/content pages (policies, info, etc.).
export default function InfoPage({ title, intro, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-blue/10" />

      <div className="container-page relative py-10">
        <nav className="mb-6 flex items-center gap-1 text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight size={14} />
          <span className="text-brand-text">{title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-brand-text">{title}</h1>
        {intro && <p className="mt-3 max-w-3xl text-brand-muted">{intro}</p>}

        <div className="prose-info mt-8 max-w-3xl space-y-6 text-sm leading-relaxed text-brand-muted">
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
        <h2 className="mb-2 text-lg font-bold text-brand-text">{heading}</h2>
      )}
      <div className="space-y-2">{children}</div>
    </section>
  );
}
