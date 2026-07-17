"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

let rippleId = 0;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  onMouseMove,
  onMouseLeave,
  style,
  href,
  ...props
}) {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric/50 overflow-hidden";

  const variants = {
    primary:
      "bg-royal text-white shadow-sm hover:bg-royal-dark hover:shadow-md",
    secondary:
      "bg-navy text-white hover:bg-navy-light shadow-sm hover:shadow-md",
    outline:
      "border border-silver-dark bg-white text-navy hover:border-royal hover:text-royal",
    ghost: "text-navy hover:bg-silver-light",
    glass:
      "glass text-white hover:border-white/25 hover:shadow-glow-electric",
    gradient:
      "gradient-mesh bg-gradient-to-r from-electric via-liquid to-cyan bg-[length:200%_100%] text-white shadow-glow-electric hover:shadow-glow-purple",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const handleClick = useCallback(
    (e) => {
      const el = ref.current;
      if (el && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const id = ++rippleId;
        setRipples((r) => [
          ...r,
          {
            id,
            size,
            x: e.clientX - rect.left - size / 2,
            y: e.clientY - rect.top - size / 2,
          },
        ]);
        setTimeout(() => {
          setRipples((r) => r.filter((rp) => rp.id !== id));
        }, 650);
      }
      onClick?.(e);
    },
    [onClick]
  );

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (el && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setTilt({ x: relX * 6, y: relY * 6 });
      }
      onMouseMove?.(e);
    },
    [onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      setTilt({ x: 0, y: 0 });
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  const Tag = href ? Link : "button";
  const tagProps = href ? { href } : {};

  return (
    <Tag
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${tilt.x}px, ${tilt.y}px)`,
        ...style,
      }}
      {...tagProps}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40 animate-ripple"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </Tag>
  );
}
