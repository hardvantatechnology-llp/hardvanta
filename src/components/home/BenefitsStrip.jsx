import { Truck, ShieldCheck, Lightbulb , Headphones } from "lucide-react";

const benefits = [
  { Icon: Truck, title: "Fast Delivery", sub: "Across India" },
  { Icon: ShieldCheck, title: "100% Genuine", sub: "Authentic parts" },
  { Icon: Lightbulb, title: "Project Assistance", sub: "From Idea To Project" },
  { Icon: Headphones, title: "Expert Support", sub: "Mon–Sat" },
];

export default function BenefitsStrip() {
  return (
    <section className="border-b border-silver-light bg-white">
      <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
        {benefits.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cloud text-royal">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-navy">{title}</p>
              <p className="text-xs text-silver-dark">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
