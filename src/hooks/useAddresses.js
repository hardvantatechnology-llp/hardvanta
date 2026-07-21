"use client";

import { useCallback, useEffect, useState } from "react";

// Shared address-book data + CRUD, used by both the checkout AddressBook and
// the account/addresses management page so they never drift out of sync.
export function useAddresses(enabled = true) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load addresses.");
      setAddresses(data.addresses || []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load addresses.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createAddress(payload) {
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not save address.");
    setAddresses(data.addresses || []);
    return data.addresses;
  }

  async function updateAddress(id, payload) {
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not update address.");
    setAddresses(data.addresses || []);
    return data.addresses;
  }

  async function deleteAddress(id) {
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not delete address.");
    setAddresses(data.addresses || []);
    return data.addresses;
  }

  async function setDefaultAddress(id) {
    const res = await fetch("/api/addresses/default", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not set default address.");
    setAddresses(data.addresses || []);
    return data.addresses;
  }

  return {
    addresses,
    loading,
    error,
    refresh,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
