import { Check, ShoppingCart, MapPinned, PartyPopper } from "lucide-react";

const STEPS = [
  { label: "Cart", Icon: ShoppingCart },
  { label: "Address & Payment", Icon: MapPinned },
  { label: "Confirmation", Icon: PartyPopper },
];

export default function CheckoutStepper({ step = 2 }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={s.label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  done
                    ? "bg-gradient-to-r from-electric to-liquid text-white"
                    : active
                      ? "glass-card text-white shadow-glow-electric ring-1 ring-electric/50"
                      : "glass-card text-white/30"
                }`}
              >
                {done ? <Check size={16} /> : <s.Icon size={15} />}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${active || done ? "text-white/80" : "text-white/30"}`}>
                {s.label}
              </span>
            </div>
            {n < STEPS.length && (
              <div className={`h-0.5 w-8 rounded-full sm:w-16 ${done ? "bg-gradient-to-r from-electric to-liquid" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
