"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { imageSrc } from "@/utils/imageSrc";

export default function ProductGallery({ images = [], alt = "", discountPct = 0 }) {
  const gallery = images.length ? images : [""];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const frameRef = useRef(null);
  const main = imageSrc(gallery[active]);

  const handleMouseMove = useCallback((e) => {
    const el = frameRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        className="glass-card relative aspect-square overflow-hidden rounded-3xl cursor-zoom-in"
      >
        <Image
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6 transition-transform duration-300 ease-out"
          style={
            zoom
              ? { transform: "scale(1.8)", transformOrigin: `${pos.x}% ${pos.y}%` }
              : undefined
          }
          priority
        />
        {discountPct > 0 && (
          <span className="absolute left-4 top-4 rounded-lg bg-gradient-to-r from-electric to-liquid px-3 py-1 text-sm font-bold text-white shadow-glow-electric">
            -{discountPct}% OFF
          </span>
        )}
      </div>

      {/* Thumbnail strip — only when there is more than one image */}
      {gallery.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {gallery.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`glass-card relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                i === active ? "border-electric shadow-glow-electric" : "border-transparent hover:border-electric/40"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={imageSrc(url)} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
