"use client";

import { useEffect, useState } from "react";

// Re-checks serviceability whenever `pincode` changes — used by the checkout
// page to gate on the actually-selected shipping address's pincode (not the
// global top-bar location, which is a separate, looser browsing concern).
export function useDeliveryServiceability(pincode) {
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!pincode) {
      setResult(null);
      return;
    }
    let cancelled = false;
    setChecking(true);
    fetch(`/api/delivery/check?pincode=${pincode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pincode]);

  return {
    checking,
    result,
    unsupported: result ? result.serviceable === false : false,
  };
}
