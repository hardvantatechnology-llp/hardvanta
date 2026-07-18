// Small calendar-range helpers for admin reporting (today / this week / this month).

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Calendar week starting Monday.
export function startOfWeek() {
  const d = startOfToday();
  const day = d.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

export function startOfMonth() {
  const d = startOfToday();
  d.setDate(1);
  return d;
}
