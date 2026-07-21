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
    electric: "hover:shadow-glow-electric",
    cyan: "hover:shadow-glow-cyan",
    purple: "hover:shadow-glow-purple",
    none: "",
  }[glow];

  const handleMouseMove = useCallback(
    (e) => {
      if (!tilt) return;
      const el = ref.current;
      if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setRot({ x: relY * -6, y: relX * 6 });
    },
    [tilt]
  );

  const handleMouseLeave = useCallback(() => setRot({ x: 0, y: 0 }), []);

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${opaque ? "glass-card" : strong ? "glass-strong" : "glass"} rounded-3xl transition-all duration-300 ${glowShadow} ${className}`}
      style={{
        transform: `perspective(800px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
