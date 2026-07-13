"use client";

import { useState } from "react";
import Image from "next/image";
import { imageSrc } from "@/utils/imageSrc";

export default function ProductGallery({ images = [], alt = "", discountPct = 0 }) {
  const gallery = images.length ? images : [""];
  const [active, setActive] = useState(0);
  const main = imageSrc(gallery[active]);

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-silver-light bg-white">
        <Image
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6"
          priority
        />
        {discountPct > 0 && (
          <span className="absolute left-4 top-4 rounded-lg bg-royal px-3 py-1 text-sm font-bold text-white shadow-sm">
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
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                i === active ? "border-royal" : "border-silver-light hover:border-royal/50"
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
