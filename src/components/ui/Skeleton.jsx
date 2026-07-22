export default function Skeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded bg-brand-silver ${className}`}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
