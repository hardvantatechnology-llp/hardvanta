"use client";

import { useEffect, useState } from "react";
import { MapPin, Truck, Zap, Banknote, RotateCcw, ShieldCheck, Clock } from "lucide-react";
import { useDeliveryLocation } from "@/context/DeliveryLocationContext";
import LocationPickerModal from "@/components/delivery/LocationPickerModal";
import { formatPrice } from "@/utils/formatPrice";

function useCountdown(deadline) {
  const [label, setLabel] = useState(null);
  useEffect(() => {
    if (!deadline) return;
    function tick() {
      const ms = new Date(deadline).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("00 hrs 00 mins");
        return;
      }
      const hrs = String(Math.floor(ms / 3_600_000)).padStart(2, "0");
      const mins = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, "0");
      setLabel(`${hrs} hrs ${mins} mins`);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [deadline]);
  return label;
}

export default function DeliveryInfoCard() {
  const { location, hydrated } = useDeliveryLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const countdownLabel = useCountdown(estimate?.cutoffDeadline);

  useEffect(() => {
    if (!hydrated || !location?.pincode) {
      setEstimate(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/delivery/check?pincode=${location.pincode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEstimate(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hydrated, location?.pincode]);

  if (!hydrated) {
    return (
      <div className="glass-card mt-5 rounded-3xl p-5 text-sm text-white/40">Checking delivery options…</div>
    );
  }

  if (!location) {
    return (
      <div className="glass-card mt-5 rounded-3xl p-5">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-electric-light hover:text-cyan transition-colors"
        >
          <MapPin size={15} /> Select a delivery location to see availability
        </button>
        <LocationPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
      </div>
    );
  }

  const serviceable = estimate?.serviceable !== false;

  return (
    <div className="glass-card mt-5 rounded-3xl p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-white/90">
        <MapPin size={15} className="text-electric-light" />
        Deliver to: {location.areaLabel}, {location.city} - {location.pincode}
      </p>

      {!serviceable ? (
        <p className="mt-2 text-sm font-semibold text-red-400">❌ Currently unavailable at this location.</p>
      ) : estimate ? (
        <>
          <p className="mt-2 text-sm font-semibold text-cyan">
            {estimate.settings.deliveryCharge > 0
              ? `${formatPrice(estimate.settings.deliveryCharge)} delivery · FREE above ${formatPrice(estimate.settings.freeShippingThreshold)}`
              : "FREE Delivery"}
          </p>
          <p className="mt-1 text-sm text-white/70">
            Delivery by <span className="font-semibold text-white">{estimate.delivery.label}</span>
          </p>
          {countdownLabel && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
              <Clock size={12} /> if ordered within {countdownLabel}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-white/70">
              <Banknote size={14} className={estimate.settings.codEnabled && estimate.pincode.codAvailable ? "text-cyan" : "text-white/20"} />
              Cash on Delivery {estimate.settings.codEnabled && estimate.pincode.codAvailable ? "Available" : "Unavailable"}
            </div>
            <div className="flex items-center gap-1.5 text-white/70">
              <Zap size={14} className={estimate.settings.expressEnabled && estimate.pincode.expressAvailable ? "text-cyan" : "text-white/20"} />
              Express Delivery {estimate.settings.expressEnabled && estimate.pincode.expressAvailable ? "Available" : "Unavailable"}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><RotateCcw size={12} /> 7 Days Easy Returns</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Genuine Product</span>
            <span className="flex items-center gap-1"><Truck size={12} /> Fast Shipping</span>
          </div>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="mt-4 text-xs font-semibold text-electric-light hover:text-cyan transition-colors"
      >
        Change Location
      </button>
      <LocationPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
