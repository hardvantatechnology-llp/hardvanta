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
import { categories } from "@/lib/data";

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

// Per-box background + contrasting icon colors (cycled across categories).
// Full literal class strings so Tailwind keeps them during build.
const palette = [
  { box: "bg-blue-50 border-blue-100", chip: "bg-blue-600 text-white" },
  { box: "bg-amber-50 border-amber-100", chip: "bg-amber-500 text-white" },
  { box: "bg-emerald-50 border-emerald-100", chip: "bg-emerald-600 text-white" },
  { box: "bg-violet-50 border-violet-100", chip: "bg-violet-600 text-white" },
  { box: "bg-rose-50 border-rose-100", chip: "bg-rose-500 text-white" },
  { box: "bg-cyan-50 border-cyan-100", chip: "bg-cyan-600 text-white" },
  { box: "bg-orange-50 border-orange-100", chip: "bg-orange-500 text-white" },
  { box: "bg-indigo-50 border-indigo-100", chip: "bg-indigo-600 text-white" },
  { box: "bg-teal-50 border-teal-100", chip: "bg-teal-600 text-white" },
  { box: "bg-fuchsia-50 border-fuchsia-100", chip: "bg-fuchsia-600 text-white" },
  { box: "bg-sky-50 border-sky-100", chip: "bg-sky-600 text-white" },
  { box: "bg-lime-50 border-lime-100", chip: "bg-lime-600 text-white" },
  { box: "bg-pink-50 border-pink-100", chip: "bg-pink-500 text-white" },
];

export default function CategoryTiles() {
  return (
    <section className="container-page py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="heading-accent">Shop by Category</h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-royal hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {categories.map((c, i) => {
          const Icon = iconMap[c.icon] ?? Box;
          const color = palette[i % palette.length];
          return (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover ${color.box}`}
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${color.chip}`}
              >
                <Icon size={28} />
              </span>
              <span className="text-xs font-semibold leading-tight text-navy">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}