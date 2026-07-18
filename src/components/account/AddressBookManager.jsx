"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import AddressCard from "@/components/addresses/AddressCard";
import AddressForm from "@/components/addresses/AddressForm";

// Full address-book management for the account page — add/edit/delete/set
// default. No selection here (that's only relevant during checkout).
export default function AddressBookManager() {
  const {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editingAddress, setEditingAddress] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function handleCreateOrUpdate(form) {
    setActionError("");
    if (editingAddress) {
      await updateAddress(editingAddress.id, form);
    } else {
      await createAddress(form);
    }
    setEditingAddress(null);
    setMode("list");
  }

  async function handleDelete(id) {
    setActionError("");
    setBusyId(id);
    try {
      await deleteAddress(id);
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
      <div className="glass-card rounded-3xl p-5">
        <h2 className="mb-4 text-lg font-bold text-white">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>
        <AddressForm
          initialValue={editingAddress}
          submitLabel={editingAddress ? "Save Changes" : "Save Address"}
          onSubmit={handleCreateOrUpdate}
          onCancel={addresses.length > 0 ? () => { setEditingAddress(null); setMode("list"); } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          {actionError}
        </p>
      )}

      {addresses.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-liquid/20 shadow-glow-electric">
            <MapPin size={30} className="text-electric-light" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">No saved addresses</h2>
          <p className="mt-1 text-sm text-white/50">
            Add a delivery address to make checkout faster
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={busyId === address.id}
              onEdit={(a) => { setEditingAddress(a); setMode("form"); }}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

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
