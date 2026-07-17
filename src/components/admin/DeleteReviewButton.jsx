"use client";

import AdminDeleteButton from "./AdminDeleteButton";

export default function DeleteReviewButton({ id, onDelete }) {
  async function handleDelete() {
    await onDelete(id);
  }

  return <AdminDeleteButton onDelete={handleDelete} label="this review" iconOnly={false} />;
}
