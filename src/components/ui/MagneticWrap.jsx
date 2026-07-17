"use client";

import { useRef, useState, useCallback } from "react";

export function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      setOffset({ x, y });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return {
    ref,
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` },
    onMouseMove,
    onMouseLeave,
  };
}

export default function MagneticWrap({ children, strength = 0.25, className = "" }) {
  const magnetic = useMagnetic(strength);
  return (
    <div
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      style={{ transition: "transform 0.2s ease-out", ...magnetic.style }}
      className={className}
    >
      {children}
    </div>
  );
}
