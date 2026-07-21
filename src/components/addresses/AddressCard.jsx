"use client";

import { Home, Briefcase, MapPin, Pencil, Trash2, CheckCircle2, Circle, Star } from "lucide-react";
import Button from "@/components/ui/Button";

const LABEL_ICONS = { Home, Work: Briefcase, Other: MapPin };

// Shared address display used by both the checkout address book (selectable,
// with "Deliver Here") and the account "Saved Addresses" manager (management
// actions only, no selection).
export default function AddressCard({
  address,
  selectable = false,
  selected = false,
  busy = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  const LabelIcon = LABEL_ICONS[address.label] || MapPin;

  return (
    <div
      className={`glass-card relative flex flex-col gap-3 rounded-2xl p-4 transition-all ${
        selected ? "ring-1 ring-electric/60 shadow-glow-electric" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectable && (
            selected
              ? <CheckCircle2 size={18} className="shrink-0 text-electric-light" />
              : <Circle size={18} className="shrink-0 text-white/20" />
          )}
          <LabelIcon size={15} className="shrink-0 text-electric-light" />
          <span className="font-semibold text-white">{address.label}</span>
          {address.isDefault && (
            <span className="rounded-full bg-gradient-to-r from-electric to-liquid px-2 py-0.5 text-[10px] font-bold text-white">
              Default
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onSetDefault && !address.isDefault && (
            <button
              type="button"
              onClick={() => onSetDefault(address.id)}
              disabled={busy}
              aria-label="Set as default"
              title="Set as default"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-electric-light transition-colors disabled:opacity-40"
            >
              <Star size={14} />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(address)}
              disabled={busy}
              aria-label="Edit address"
              title="Edit"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-electric-light transition-colors disabled:opacity-40"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(address.id)}
              disabled={busy}
              aria-label="Delete address"
              title="Delete"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="text-sm">
        <p className="font-medium text-white/90">{address.fullName}</p>
        <p className="text-white/50">{address.phone}</p>
        <p className="mt-1 text-white/50">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        <p className="text-white/50">
          {address.city}, {address.state} — {address.postalCode}
        </p>
      </div>

      {selectable && (
        <Button
          type="button"
          variant={selected ? "glass" : "outline"}
          size="sm"
          onClick={() => onSelect(address)}
          disabled={busy}
          className="w-full sm:w-auto"
        >
          {selected ? "Selected" : "Deliver Here"}
        </Button>
      )}
    </div>
  );
}
