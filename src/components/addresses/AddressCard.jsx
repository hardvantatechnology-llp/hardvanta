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
      className={`glass-brand-card relative flex flex-col gap-3 rounded-2xl p-4 transition-all ${
        selected ? "ring-1 ring-brand-blue/60 shadow-brand-glow" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectable && (
            selected
              ? <CheckCircle2 size={18} className="shrink-0 text-brand-blue" />
              : <Circle size={18} className="shrink-0 text-brand-muted" />
          )}
          <LabelIcon size={15} className="shrink-0 text-brand-blue" />
          <span className="font-semibold text-brand-text">{address.label}</span>
          {address.isDefault && (
            <span className="rounded-full bg-gradient-to-r from-brand-blue to-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-silver hover:text-brand-blue transition-colors disabled:opacity-40"
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
              className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-silver hover:text-brand-blue transition-colors disabled:opacity-40"
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
              className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-muted hover:bg-red-500/10 hover:text-red-600 transition-colors disabled:opacity-40"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="text-sm">
        <p className="font-medium text-brand-text">{address.fullName}</p>
        <p className="text-brand-muted">{address.phone}</p>
        <p className="mt-1 text-brand-muted">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        <p className="text-brand-muted">
          {address.city}, {address.state} — {address.postalCode}
        </p>
      </div>

      {selectable && (
        <Button
          type="button"
          variant={selected ? "brand-glass" : "brand-outline"}
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
