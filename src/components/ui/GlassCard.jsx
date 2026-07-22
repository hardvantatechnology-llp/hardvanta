"use client";

import { useRef, useState, useCallback } from "react";

export default function GlassCard({
  children,
  className = "",
  strong = false,
  opaque = false,
  glow = "electric",
  tilt = true,
  as: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const glowShadow = {
    electric: "hover:shadow-brand-glow",
    cyan: "hover:shadow-brand-glow",
    purple: "hover:shadow-brand-glow",
    none: "",
  }[glow];

  const [hovered, setHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!tilt) return;
      const el = ref.current;
      if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setRot({ x: relY * -9, y: relX * 9 });
      setGlare({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [tilt]
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setRot({ x: 0, y: 0 });
  }, []);

  return (
    <Tag
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${opaque ? "glass-brand-card" : strong ? "glass-brand-strong" : "glass-brand"} rounded-3xl transition-[transform,box-shadow] duration-300 ease-out will-change-transform ${glowShadow} ${
        hovered && tilt ? "-translate-y-1.5 scale-[1.015]" : ""
      } ${className}`}
      style={{
        transform: `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
      {tilt && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 55%)`,
            transformStyle: "preserve-3d",
            transform: "translateZ(1px)",
          }}
        />
      )}
    </Tag>
  );
}
