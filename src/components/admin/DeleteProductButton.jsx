"use client";

import AdminDeleteButton from "./AdminDeleteButton";

export default function DeleteProductButton({ id, name }) {
  async function handleDelete() {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not delete product.");
    window.location.href = "/admin/products";
  }

  return <AdminDeleteButton onDelete={handleDelete} label={name} />;
}
