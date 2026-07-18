"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import AddressCard from "@/components/addresses/AddressCard";
import AddressForm from "@/components/addresses/AddressForm";
import Button from "@/components/ui/Button";

// Amazon/Flipkart-style address book for checkout: loads saved addresses,
// pre-selects the default one, and lets the shopper add/edit/delete/set
// default without leaving the page. Reports the selected address up via
// `onChange` — checkout builds the order's address payload from that.
export default function AddressBook({ enabled = true, onChange }) {
  const {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses(enabled);

  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const autoSelectedRef = useRef(false);

  const selected = addresses.find((a) => a.id === selectedId) || null;

  useEffect(() => {
    onChange?.(selected);
    // Only the selected address's identity/content matters here, not the
    // callback reference itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Pre-select the default (or first) address the first time the list
  // loads. If there's nothing saved yet, jump straight to the form instead
  // of showing an empty "Saved Addresses" section.
  useEffect(() => {
    if (loading || autoSelectedRef.current) return;
    if (addresses.length === 0) {
      setMode("form");
      return;
    }
    autoSelectedRef.current = true;
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    setSelectedId(def.id);
  }, [loading, addresses]);

  async function handleCreateOrUpdate(form) {
    setActionError("");
    if (editingAddress) {
      await updateAddress(editingAddress.id, form);
    } else {
      const beforeIds = new Set(addresses.map((a) => a.id));
      const updated = await createAddress(form);
      const created = updated.find((a) => !beforeIds.has(a.id));
      if (created) setSelectedId(created.id);
    }
    setEditingAddress(null);
    setMode("list");
  }

  async function handleSelect(address) {
    setSelectedId(address.id);
  }

  async function handleEdit(address) {
    setEditingAddress(address);
    setMode("form");
  }

  async function handleDelete(id) {
    setActionError("");
    setBusyId(id);
    try {
      const updated = await deleteAddress(id);
      if (selectedId === id) {
        const def = updated.find((a) => a.isDefault) || updated[0] || null;
        setSelectedId(def?.id || null);
        if (!def) setMode("form");
      }
    } catch (e) {
      setActionError(e.message || "Could not delete address.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetDefault(id) {
    setActionError("");
    setBusyId(id);
    try {
      await setDefaultAddress(id);
    } catch (e) {
      setActionError(e.message || "Could not set default address.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
        {error}
      </p>
    );
  }

  if (mode === "form") {
    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/80">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h3>
        <AddressForm
          initialValue={editingAddress}
          submitLabel={editingAddress ? "Save Changes" : "Save & Deliver Here"}
          onSubmit={handleCreateOrUpdate}
          onCancel={addresses.length > 0 ? () => { setEditingAddress(null); setMode("list"); } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white/80">Saved Addresses</h3>

      {actionError && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          {actionError}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selectable
            selected={address.id === selectedId}
            busy={busyId === address.id}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => { setEditingAddress(null); setMode("form"); }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-3 text-sm font-semibold text-white/60 hover:border-electric/40 hover:text-electric-light transition-colors"
      >
        <Plus size={16} /> Add New Address
      </button>
    </div>
  );
}
