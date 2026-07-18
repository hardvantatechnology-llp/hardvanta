// Shared validation for the customer enquiry forms (B2B / Bulk Orders, Bulk
// Enquiry, ATL Kits Enquiry). Centralizing this avoids each API route
// re-implementing (and subtly disagreeing on) email/phone rules.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Every client-side form strips non-digits and enforces this exact pattern
// before it will submit, so the server can safely require the same shape.
export const INDIAN_PHONE_RE = /^[6-9]\d{9}$/;

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

export function isValidPhone(value) {
  return typeof value === "string" && INDIAN_PHONE_RE.test(value.trim());
}

/**
 * Checks a set of trimmed string fields against per-field max lengths.
 * @param {Record<string, string|undefined|null>} fields
 * @param {Record<string, number>} maxLen
 * @returns {string|null} the first field name that exceeds its limit, or null
 */
export function firstFieldExceedingMaxLength(fields, maxLen) {
  for (const [key, limit] of Object.entries(maxLen)) {
    const value = fields[key];
    if (value != null && String(value).length > limit) return key;
  }
  return null;
}

export function isValidBoundedInt(value, { min = 1, max = 1_000_000 } = {}) {
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max;
}
