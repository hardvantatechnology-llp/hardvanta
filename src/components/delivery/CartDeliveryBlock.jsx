"use client";

import { useEffect, useState } from "react";
import { MapPin, Truck } from "lucide-react";
import { useDeliveryLocation } from "@/context/DeliveryLocationContext";
import LocationPickerModal from "@/components/delivery/LocationPickerModal";

// Cart-page companion to DeliveryInfoCard — same location context, a lighter
// "Delivering to / Expected Delivery" summary instead of the full product-page
// card (no countdown, no COD/express flags).
export default function CartDeliveryBlock() {
  const { location, hydrated } = useDeliveryLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [estimate, setEstimate] = useState(null);

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

  if (!hydrated) return null;

  return (
    <div className="glass-brand-card rounded-3xl p-4">
      {location ? (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-text">
              <MapPin size={14} className="text-brand-blue shrink-0" />
              Delivering to {location.areaLabel}, {location.city}
            </p>
            {estimate?.serviceable === false ? (
              <p className="mt-1 text-xs font-semibold text-red-600">❌ Currently unavailable at this location.</p>
            ) : estimate?.delivery ? (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-muted">
                <Truck size={12} className="text-brand-steel" /> Expected Delivery: {estimate.delivery.label}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="shrink-0 text-xs font-semibold text-brand-blue hover:text-brand-steel transition-colors"
          >
            Change Location
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-steel transition-colors"
        >
          <MapPin size={15} /> Select a delivery location
        </button>
      )}
      <LocationPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
