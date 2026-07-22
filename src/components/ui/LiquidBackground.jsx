export default function LiquidBackground({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 gradient-mesh bg-gradient-to-br from-brand-bg via-brand-silver to-brand-grey" />
      <div
        className="liquid-blob left-[-10%] top-[-15%] h-[420px] w-[420px] bg-brand-blue/15"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="liquid-blob right-[-10%] top-[10%] h-[380px] w-[380px] bg-brand-navy/12"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="liquid-blob bottom-[-20%] left-[20%] h-[360px] w-[360px] bg-brand-steel/12"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,39,71,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
