"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";

/**
 * One editable table row shared by the Categories and Brands admin pages.
 * `onUpdate`, `onToggleActive`, `onDelete` are Server Actions bound to the
 * specific entity (category vs brand) by the parent page.
 */
export default function CatalogEntityRow({ item, productCount, onUpdate, onToggleActive, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function saveEdit() {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name can't be empty.");
      return;
    }
    const fd = new FormData();
    fd.set("id", item.id);
    fd.set("name", trimmed);
    startTransition(async () => {
      try {
        await onUpdate(fd);
        setEditing(false);
      } catch (err) {
        setError(err?.message || "Could not save.");
      }
    });
  }

  function cancelEdit() {
    setName(item.name);
    setError("");
    setEditing(false);
  }

  function handleToggleActive() {
    setError("");
    startTransition(async () => {
      try {
        await onToggleActive(item.id, !item.active);
      } catch (err) {
        setError(err?.message || "Could not update status.");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setError("");
    startTransition(async () => {
      try {
        await onDelete(item.id);
      } catch (err) {
        setError(err?.message || "Could not delete.");
      }
    });
  }

  return (
    <tr className="hover:bg-cloud transition-colors">
      <td className="px-5 py-3 font-semibold text-navy">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="w-full rounded-lg border border-silver-dark px-2 py-1 text-sm outline-none focus:border-royal"
              disabled={pending}
            />
            <button
              type="button"
              onClick={saveEdit}
              disabled={pending}
              className="text-green-600 hover:text-green-700 disabled:opacity-50"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={pending}
              className="text-silver-dark hover:text-red-500 disabled:opacity-50"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          item.name
        )}
        {error && <p className="mt-1 text-xs font-normal text-red-600">{error}</p>}
      </td>
      <td className="px-5 py-3 text-silver-dark">{item.slug}</td>
      <td className="px-5 py-3 text-silver-dark">{productCount}</td>
      <td className="px-5 py-3">
        <button
          type="button"
          onClick={handleToggleActive}
          disabled={pending}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            item.active
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          title="Click to toggle"
        >
          {item.active ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-3">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-silver-dark hover:text-royal"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending || productCount > 0}
            className="text-silver-dark hover:text-red-500 disabled:opacity-30"
            aria-label="Delete"
            title={productCount > 0 ? "Cannot delete — still has products" : "Delete"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
