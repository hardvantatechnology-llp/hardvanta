"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Phone, MapPin, ChevronDown, MoreHorizontal } from "lucide-react";
import { useDeliveryLocation } from "@/context/DeliveryLocationContext";
import { socials } from "@/lib/socialLinks";
import { getUserView, setUserView } from "@/lib/viewMode";
import LocationPickerModal from "@/components/delivery/LocationPickerModal";

// Plain (non-sticky) bar rendered above the existing Navbar — it scrolls
// away normally on scroll, same as Amazon's real top bar; the Navbar keeps
// its own sticky behavior untouched.
//
// This bar replaces Navbar.jsx's old "Row 1" (phone + Customer Support +
// socials), which duplicated this content and rendered a visible second top
// bar. The admin "view as customer" toggle that used to live in that same
// row is carried over here too, unchanged, so removing the duplicate strip
// doesn't silently drop that feature.
export default function TopDeliveryBar() {
  const { location, hydrated } = useDeliveryLocation();
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";
  const [mounted, setMounted] = useState(false);
  const [userViewMode, setUserViewMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const sync = () => setUserViewMode(getUserView());
    sync();
    window.addEventListener("viewmodechange", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("viewmodechange", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Identical on server and client-before-hydration — the real location only
  // ever swaps in after `hydrated` flips, avoiding a hydration mismatch.
  const locationLabel = !hydrated
    ? "Select delivery location"
    : location
      ? `${location.areaLabel}, ${location.city}`
      : "Select delivery location";

  return (
    <>
      <div className="w-full border-b border-white/10 bg-obsidian/95 text-white/70">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-xs">
          {/* Left: phone + support */}
          <a
            href="tel:+919170546395"
            className="hidden items-center gap-1.5 whitespace-nowrap hover:text-electric-light transition-colors sm:flex"
          >
            <Phone size={12} />
            <span className="font-semibold">+91 91705 46395</span>
            <span className="hidden text-white/40 md:inline">· Customer Support</span>
          </a>
          <a
            href="tel:+919170546395"
            className="flex items-center gap-1 hover:text-electric-light transition-colors sm:hidden"
            aria-label="Call Customer Support"
          >
            <Phone size={12} />
          </a>

          {/* Center: deliver-to */}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex min-w-0 items-center gap-1.5 truncate font-semibold text-white hover:text-electric-light transition-colors"
          >
            <MapPin size={12} className="shrink-0 text-electric-light" />
            <span className="truncate">
              Deliver to {locationLabel}
            </span>
            <ChevronDown size={11} className="shrink-0" />
          </button>

          {/* Right: admin view toggle (desktop-only, matches the old row's behavior) + socials */}
          <div className="hidden items-center gap-3 sm:flex">
            {mounted && isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (userViewMode) { setUserView(false); router.push("/admin"); }
                  else { setUserView(true); router.push("/"); }
                }}
                className="rounded-full bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-light hover:bg-electric/20 transition-colors"
                title={userViewMode ? "Switch back to admin" : "Browse the store as a normal customer"}
              >
                {userViewMode ? "🔧 Back to Admin" : "👁 View as customer"}
              </button>
            )}
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/50 hover:text-electric-light transition-colors"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="More links"
              className="flex items-center text-white/50 hover:text-electric-light transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 flex gap-3 rounded-xl glass-strong px-3 py-2">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-white/60 hover:text-electric-light transition-colors"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LocationPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
}
