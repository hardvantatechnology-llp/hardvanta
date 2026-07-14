import Link from "next/link";
import { Cpu, ShieldCheck, Truck, Headphones } from "lucide-react";
import Logo from "@/components/layout/Logo";

const points = [
  { Icon: Truck, text: "elhi-NCR" },
  { Icon: ShieldCheck, text: "100% genuine components" },
  { Icon: Headphones, text: "Real technical support" },
];

// Two-column authentication layout: brand panel + form card.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-page py-10">
      <div className="grid overflow-hidden rounded-3xl border border-silver-light shadow-card lg:grid-cols-2">
        {/* Brand panel (hidden on small screens) */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy via-navy-light to-royal-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative">
            <Logo size={48} />
            <h2 className="mt-10 text-3xl font-extrabold leading-tight">
              Build anything.
              <br />
              <span className="text-royal-light">We&apos;ve got the parts.</span>
            </h2>
            <p className="mt-4 max-w-sm text-silver-light">
              Join 50,000+ makers shopping robotics, electronics and DIY
              engineering products on hardvanta.
            </p>
          </div>
          <ul className="relative mt-10 space-y-3">
            {points.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon size={18} className="text-royal-light" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="relative mt-10 flex items-center gap-2 text-xs text-silver">
            <Cpu size={14} /> A unit of Hardvanta Technologies LLP
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-white p-8 sm:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="lg:hidden">
              <Logo size={40} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-navy lg:mt-0">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-silver-dark">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
