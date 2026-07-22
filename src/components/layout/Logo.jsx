import Image from "next/image";
import Link from "next/link";

/**
 * Brand logo. Expects the HV monogram saved at /public/images/hardvanta.png
 *
 * The source image has extra white padding baked around the mark, which
 * made the badge look "boxed" instead of the logo filling the frame.
 * Fix: keep `overflow-hidden` on the badge, but render the image with
 * `object-cover` + a slight `scale()` zoom so the padding gets cropped
 * outside the visible frame and only the mark itself shows.
 *
 * Tweak LOGO_ZOOM below (1.15 - 1.6 range) until the white edge fully
 * disappears for your exact source asset — it depends on how much
 * padding is baked into hardvanta.png.
 */
const LOGO_ZOOM = 1.05;

export default function Logo({ onBadge = true, showWordmark = true, size = 52, dark = false }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
      <span
        className={
          onBadge
            ? "relative flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm"
            : "relative flex items-center justify-center overflow-hidden"
        }
        style={{ height: size, width: size }}
      >
        <Image
          src="/images/hardvanta.png"
          alt="Hardvanta Technologies"
          fill
          sizes={`${size}px`}
          className="object-cover"
          style={{ transform: `scale(${LOGO_ZOOM})` }}
          priority
        />
      </span>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-xl font-extrabold tracking-tight ${
              dark ? "text-white" : ""
            }`}
          >
            Hard<span className="text-royal">vanta</span>
          </span>
          <span
            className={`text-[9px] font-semibold tracking-[0.18em] uppercase mt-0.6 ${
              dark ? "text-silver-light" : "text-navy"
            }`}
          >
            Technologies
          </span>
        </span>
      )}
    </Link>
  );
}