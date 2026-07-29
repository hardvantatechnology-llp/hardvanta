"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import LiquidBackground from "@/components/ui/LiquidBackground";

const quickLinks = [
  { label: "Arduino & Boards", slug: "dev-boards" },
  { label: "Sensors", slug: "sensors" },
  { label: "Motors", slug: "motors" },
  { label: "Drone Parts", slug: "drones" },
  { label: "3D Printing", slug: "3d-printers" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (reduce) return;
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setTilt({ x: relY * -5, y: relX * 5 });
    },
    [reduce]
  );
  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <LiquidBackground />

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        className="container-page relative grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24"
      >
        {/* Left: copy + search + quick links */}
        <div className="text-brand-text">
          <motion.span
            variants={reduce ? undefined : item}
            className="inline-flex items-center gap-2 rounded-full glass-brand px-3 py-1 text-xs font-semibold text-brand-text"
          >
            <Star size={13} className="fill-brand-steel text-brand-steel" />
            Trusted by 50,000+ makers across India
          </motion.span>

          <motion.h1
            variants={reduce ? undefined : item}
            className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Build anything.
            <br />
            <span className="bg-gradient-to-r from-brand-blue via-brand-steel to-brand-navy bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
              We&apos;ve got the parts.
            </span>
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mt-5 max-w-lg text-base leading-relaxed text-brand-muted"
          >
            India&apos;s store for robotics, electronics &amp; DIY engineering —
            boards, sensors, motors, drones, 3D printing and more, shipped fast
            with real technical support.
          </motion.p>

          <motion.div variants={reduce ? undefined : item} className="mt-7 flex flex-wrap gap-3">
            <Button href="/products" variant="brand-gradient" size="lg">
              Shop All Products <ArrowRight size={18} />
            </Button>
            <Button href="/b2b" variant="brand-glass" size="lg">
              Bulk &amp; B2B
            </Button>
          </motion.div>

          {/* Quick category links */}
          <motion.div variants={reduce ? undefined : item} className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Popular:
            </span>
            {quickLinks.map((q) => (
              <Link
                key={q.slug}
                href={`/products?category=${q.slug}`}
                className="rounded-full glass-brand px-3 py-1.5 text-xs font-medium text-brand-text/90 transition-all hover:shadow-brand-glow hover:text-brand-blue"
              >
                {q.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/*
          Right: stat / deals panel.
          FIX: previously this was `hidden md:block`, which removed the
          panel entirely on mobile and tablet. It's now visible on every
          breakpoint — full-width and stacked below the copy on small
          screens, side-by-side with the copy from `md` upward — and the
          mouse-tilt effect is skipped on touch devices since it only
          triggers from onMouseMove/onMouseLeave.
        */}
        <motion.div
          variants={reduce ? undefined : item}
          className="mt-2 w-full md:mt-0"
          ref={panelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 800 }}
        >
          <div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.2s ease-out",
            }}
          >
            <GlassCard strong tilt={false} className="col-span-2 p-5 sm:p-6" glow="electric">
              <p className="text-sm font-semibold text-brand-muted">
                This week&apos;s deals
              </p>
              <p className="mt-1 text-xl font-extrabold text-brand-text sm:text-2xl">
                Up to 40% off
              </p>
              <p className="mt-1 text-sm text-brand-muted">
                on starter kits, sensors &amp; modules
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-blue hover:gap-2 hover:text-brand-steel transition-all"
              >
                Grab the deals <ArrowRight size={15} />
              </Link>
            </GlassCard>
            {[
              ["10,000+", "Products in stock"],
              ["4.7★", "Average rating"],
            ].map(([v, l]) => (
              <GlassCard key={l} tilt={false} glow="purple" className="p-4 sm:p-5">
                <p className="text-xl font-extrabold text-brand-text sm:text-2xl">{v}</p>
                <p className="mt-1 text-xs text-brand-muted">{l}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}