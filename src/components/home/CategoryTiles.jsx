import Link from "next/link";
import {
  Cpu,
  CircuitBoard,
  Radio,
  Cog,
  Satellite,
  Box,
  Boxes,
  BatteryCharging,
  Wrench,
  Bike,
  Gauge,
  RotateCcw,
  MonitorSmartphone,
} from "lucide-react";
import { getCategories } from "@/lib/queries";

const iconMap = {
  Cpu,
  CircuitBoard,
  Radio,
  Cog,
  Satellite,
  Box,
  Boxes,
  BatteryCharging,
  Wrench,
  Bike,
  Gauge,
  RotateCcw,
  MonitorSmartphone,
};

// Vivid chip colors cycled across categories; glow matches the chip hue family.
const palette = [
  { chip: "bg-blue-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-amber-500", glow: "hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.45)]" },
  { chip: "bg-emerald-500", glow: "hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.45)]" },
  { chip: "bg-violet-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-rose-500", glow: "hover:shadow-[0_0_40px_-8px_rgba(244,63,94,0.45)]" },
  { chip: "bg-cyan-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-orange-500", glow: "hover:shadow-[0_0_40px_-8px_rgba(249,115,22,0.45)]" },
  { chip: "bg-indigo-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-teal-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-fuchsia-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-sky-500", glow: "hover:shadow-brand-glow" },
  { chip: "bg-lime-500", glow: "hover:shadow-[0_0_40px_-8px_rgba(132,204,22,0.45)]" },
  { chip: "bg-pink-500", glow: "hover:shadow-brand-glow" },
];

export default async function CategoryTiles() {
  const categories = await getCategories();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-bg to-brand-silver py-12">
      <div className="liquid-blob right-[-10%] top-[-40%] h-72 w-72 bg-brand-steel/10" />
      <div className="container-page relative">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="relative inline-block text-2xl font-bold text-brand-text after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-12 after:rounded-full after:bg-gradient-to-r after:from-brand-blue after:to-brand-navy">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-blue hover:text-brand-steel"
          >
            View all
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Box;
            const color = palette[i % palette.length];
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`glass-brand group flex shrink-0 flex-col items-center gap-3 rounded-3xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 ${color.glow}`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${color.chip}`}
                >
                  <Icon size={28} />
                </span>
                <span className="text-xs font-semibold leading-tight text-brand-text">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
