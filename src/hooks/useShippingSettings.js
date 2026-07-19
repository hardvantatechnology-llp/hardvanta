"use client";

import { useEffect, useState } from "react";

// Falls back to the DeliverySettings model's own defaults (see
// prisma/schema.prisma) until the real values load, so the UI never flashes
// ₹0/blank pricing while the fetch is in flight.
const DEFAULTS = { freeShippingThreshold: 999, deliveryCharge: 49 };

export function useShippingSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/delivery/settings")
      .then((res) => res.json())
      .then((data) => {
        if (
          !cancelled &&
          typeof data.freeShippingThreshold === "number" &&
          typeof data.deliveryCharge === "number"
        ) {
          setSettings(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
