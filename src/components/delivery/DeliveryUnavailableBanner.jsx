"use client";

import { XCircle } from "lucide-react";

export default function DeliveryUnavailableBanner() {
  return (
    <p className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400">
      <XCircle size={15} className="shrink-0" />
      Delivery is currently unavailable for this location.
    </p>
  );
}
