"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { Search, MapPin, LocateFixed, Clock, X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDeliveryLocation } from "@/context/DeliveryLocationContext";
import { useAddresses } from "@/hooks/useAddresses";

const PINCODE_RE = /^[1-9][0-9]{5}$/;

function locationLine(entry) {
  return `${entry.areaLabel}, ${entry.city} - ${entry.pincode}`;
}

export default function LocationPickerModal({ open, onClose }) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";
  const { selectLocation, recentLocations } = useDeliveryLocation();
  const { addresses } = useAddresses(open && isAuthed);

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [notServiceable, setNotServiceable] = useState(null); // pincode string, or null
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [addressServiceability, setAddressServiceability] = useState({}); // postalCode -> estimate
  const debounceRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setNotServiceable(null);
      setGeoError("");
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setNotServiceable(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/delivery/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        const found = data.results || [];
        setResults(found);

        if (found.length === 0 && PINCODE_RE.test(query.trim())) {
          const checkRes = await fetch(`/api/delivery/check?pincode=${query.trim()}`);
          const checkData = await checkRes.json();
          setNotServiceable(checkData.serviceable ? null : query.trim());
        } else {
          setNotServiceable(null);
        }
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    if (!open || !isAuthed || addresses.length === 0) return;
    const uniqueCodes = [...new Set(addresses.map((a) => a.postalCode).filter(Boolean))];
    uniqueCodes.forEach(async (code) => {
      if (addressServiceability[code]) return;
      try {
        const res = await fetch(`/api/delivery/check?pincode=${code}`);
        const data = await res.json();
        setAddressServiceability((prev) => ({ ...prev, [code]: data }));
      } catch {}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAuthed, addresses]);

  function handleSelect(entry) {
    selectLocation(entry);
    onClose();
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoError("Location services aren't supported on this device.");
      return;
    }
    setGeoError("");
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/delivery/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (!res.ok || !data.serviceable) {
            setGeoError(
              data.detectedPincode
                ? `Currently unavailable for ${data.detectedPincode}.`
                : data.error || "Could not determine delivery availability for your location."
            );
            return;
          }
          handleSelect({
            pincode: data.pincode.code,
            areaLabel: data.pincode.areaLabel,
            city: data.deliveryArea.name,
            deliveryAreaId: data.deliveryArea.id,
          });
        } catch {
          setGeoError("Could not determine your location. Please search manually.");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoError("Location permission denied. Please search manually.");
        setGeoLoading(false);
      }
    );
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[260] flex items-start justify-center overflow-y-auto bg-obsidian/70 backdrop-blur-md px-4 py-8 sm:items-center">
      <div className="glass-strong w-full max-w-md rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Choose delivery location</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full glass text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, city or pincode"
            className="w-full rounded-xl glass-card pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30"
          />
          {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/40" />}
        </div>

        {/* Search results */}
        {results.length > 0 && (
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.pincode}
                type="button"
                onClick={() => handleSelect(r)}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-electric-light shrink-0" />
                  {locationLine(r)}
                </span>
                <span className="shrink-0 text-xs font-semibold text-cyan">✅ Available</span>
              </button>
            ))}
          </div>
        )}
        {notServiceable && (
          <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400">
            <XCircle size={14} /> ❌ Currently unavailable for {notServiceable}.
          </p>
        )}

        {/* Use current location */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="mt-3 flex w-full items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-2.5 text-sm font-semibold text-electric-light hover:border-electric/40 transition-colors disabled:opacity-50"
        >
          {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
          Use Current Location
        </button>
        {geoError && <p className="mt-1.5 text-xs text-red-400">{geoError}</p>}

        {/* Saved addresses */}
        {isAuthed && addresses.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-white/40">Saved Addresses</p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {addresses.map((a) => {
                const svc = addressServiceability[a.postalCode];
                const serviceable = svc?.serviceable !== false;
                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={!serviceable}
                    onClick={() =>
                      handleSelect({
                        pincode: a.postalCode,
                        areaLabel: a.addressLine1,
                        city: a.city,
                        deliveryAreaId: svc?.deliveryArea?.id ?? null,
                      })
                    }
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <span className="min-w-0 truncate">
                      <span className="font-semibold text-white">{a.label}</span> — {a.addressLine1}, {a.city} - {a.postalCode}
                    </span>
                    <span className={`shrink-0 text-xs font-semibold ${serviceable ? "text-cyan" : "text-red-400"}`}>
                      {serviceable ? "✅" : "❌"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent locations */}
        {recentLocations.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40">
              <Clock size={12} /> Recent Locations
            </p>
            <div className="space-y-1">
              {recentLocations.map((r) => (
                <button
                  key={r.pincode}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  <MapPin size={14} className="text-white/30 shrink-0" />
                  {locationLine(r)}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-white/30">Delivery currently available only across Delhi NCR.</p>
      </div>
    </div>,
    document.body
  );
}
