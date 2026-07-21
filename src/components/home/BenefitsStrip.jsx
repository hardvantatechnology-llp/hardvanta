import { Truck, ShieldCheck, Lightbulb , Headphones } from "lucide-react";

const benefits = [
  { Icon: Truck, title: "Fast Delivery", sub: "Across Delhi NCR" },
  { Icon: ShieldCheck, title: "100% Genuine", sub: "Authentic parts" },
  { Icon: Lightbulb, title: "Project Assistance", sub: "From Idea To Project" },
  { Icon: Headphones, title: "Expert Support", sub: "Mon–Sat" },
];

export default function BenefitsStrip() {
  return (
    <section className="border-b border-white/10 bg-obsidian">
      <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
        {benefits.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass text-electric-light">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-white/90">{title}</p>
              <p className="text-xs text-white/40">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
