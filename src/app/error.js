"use client";

// Catches runtime errors in any route segment and shows a recoverable UI
// instead of a blank white page.
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle size={48} className="text-brand-blue" />
      <h1 className="mt-4 text-xl font-bold text-brand-text">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        We hit an unexpected error. Please try again — if it keeps happening,
        refresh the page.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white hover:bg-brand-navy"
      >
        Try again
      </button>
    </div>
  );
}
