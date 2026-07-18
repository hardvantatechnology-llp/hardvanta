// Formats a date + time together, e.g. "18 Jul 2026, 10:15 AM" — used for the
// per-status order timeline where the date alone isn't enough to tell entries apart.
export function formatDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  const datePart = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timePart = d
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${datePart}, ${timePart}`;
}
