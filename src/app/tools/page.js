import Link from "next/link";
import { ChevronRight, Wrench } from "lucide-react";
import {
  Gauge,
  Flame,
  Scissors,
  Grid3x3,
  Cable,
  Droplet,
  Pin,
  Wind,
  HandMetal,
  Zap,
} from "lucide-react";

// Hardcoded tool guide content — icon-based so there's no dependency on
// external image URLs. Swap an Icon for an <Image> once you upload your own
// product photos (e.g. to Supabase Storage) if you'd like real photos instead.
const tools = [
  {
    name: "Digital Multimeter",
    Icon: Gauge,
    summary:
      "A multimeter measures voltage, current and resistance in a circuit. It's the first tool every electronics hobbyist reaches for — use it to check if a battery is alive, find a short circuit, or verify a component's resistance before soldering it in.",
  },
  {
    name: "Soldering Iron",
    Icon: Flame,
    summary:
      "Used to melt solder and join electronic components to a PCB or wire. A temperature-controlled iron (around 350°C for lead-free solder) gives cleaner joints and protects sensitive components from heat damage.",
  },
  {
    name: "Wire Stripper / Cutter",
    Icon: Scissors,
    summary:
      "Strips the plastic insulation off wires without nicking the copper strands inside, and cuts wire to length. Essential for clean, reliable connections in any wiring or breadboard project.",
  },
  {
    name: "Screwdriver Set",
    Icon: Wrench,
    summary:
      "A precision set (Phillips, flathead, Torx) for opening enclosures, mounting PCBs, and assembling robot chassis. Magnetic tips help with small screws that are easy to drop.",
  },
  {
    name: "Breadboard",
    Icon: Grid3x3,
    summary:
      "A reusable prototyping board with a grid of connected holes — lets you build and test circuits without soldering. Perfect for trying out a circuit before making it permanent.",
  },
  {
    name: "Jumper Wires",
    Icon: Cable,
    summary:
      "Pre-cut wires with connector pins on each end (male-to-male, male-to-female, female-to-female) used to connect components on a breadboard or to a microcontroller like Arduino.",
  },
  {
    name: "Hot Glue Gun",
    Icon: Droplet,
    summary:
      "Melts solid glue sticks for quick, strong bonding of plastic, wood and most robot-build materials. Great for securing wires, mounting sensors, or fixing a chassis together fast.",
  },
  {
    name: "Wire Crimping Tool",
    Icon: Pin,
    summary:
      "Attaches connectors (like Dupont or JST pins) onto the end of a wire by compressing metal terminals around it — gives a much more reliable connection than soldering for removable connectors.",
  },
  {
    name: "Precision Tweezers",
    Icon: Pin,
    summary:
      "Used to hold and place small SMD components, adjust jumpers, or handle tiny screws and parts that are too small to manage with your fingers.",
  },
  {
    name: "Heat Gun",
    Icon: Wind,
    summary:
      "Shrinks heat-shrink tubing over wire joints for insulation and a clean finish. Also used to gently desolder components or remove adhesive labels without scratching surfaces.",
  },
  {
    name: "PCB Vice / Helping Hands",
    Icon: HandMetal,
    summary:
      "A stand with adjustable arms and alligator clips (often with a magnifying glass) that holds your PCB or wires steady while you solder, freeing up both your hands.",
  },
  {
    name: "Anti-Static Wrist Strap",
    Icon: Zap,
    summary:
      "Grounds your body to prevent static discharge while handling sensitive components like microcontrollers, ICs and memory modules — a single static spark can silently kill a chip.",
  },
];

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian text-white">
        <div className="container-page py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-white/50">
            <Link href="/" className="hover:text-electric-light">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Tools</span>
          </nav>

          <div className="flex items-center gap-2 text-electric-light">
            <Wrench size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Tool Guide</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Essential Electronics &amp; Robotics Tools
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            A quick guide to the must-have tools for any maker — what each one
            does and when you&apos;ll reach for it.
          </p>
        </div>
      </div>

      {/* Tool grid */}
      <div className="container-page relative py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ name, Icon, summary }) => (
            <div
              key={name}
              className="rounded-xl glass-card p-6 transition-all hover:brightness-110"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 text-electric-light">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-bold text-white">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {summary}
              </p>
            </div>
          ))}
        </div>

        {/* CTA to shop tools */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-obsidian via-midnight to-obsidian p-8 text-center text-white sm:p-10">
          <h2 className="text-xl font-bold sm:text-2xl">
            Ready to build your toolkit?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/60">
            Browse genuine, tested tools and components from our store.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-gradient-to-r from-electric to-liquid px-6 py-3 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all"
          >
            Shop Tools &amp; Components
          </Link>
        </div>
      </div>
    </div>
  );
}