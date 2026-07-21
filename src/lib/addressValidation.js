// Shared validation for the address-book API routes (create + update share
// the exact same field rules, so this keeps them from drifting apart).

const LABELS = new Set(["Home", "Work", "Other"]);
const MAX_LEN = 120;

function trimmed(v) {
  return typeof v === "string" ? v.trim() : "";
}

// `partial: true` for PATCH — only fields present in `body` are validated/
// returned, everything else is left untouched by the caller.
export function sanitizeAddressInput(body, { partial = false } = {}) {
  const data = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(body || {}, key);

  if (!partial || has("label")) {
    const label = trimmed(body.label) || "Home";
    if (!LABELS.has(label)) {
      return { error: "Address label must be Home, Work, or Other." };
    }
    data.label = label;
  }

  if (!partial || has("fullName")) {
    const fullName = trimmed(body.fullName).slice(0, MAX_LEN);
    if (!fullName) return { error: "Full name is required." };
    data.fullName = fullName;
  }

  if (!partial || has("phone")) {
    const phone = trimmed(body.phone);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return { error: "Enter a valid 10-digit Indian mobile number." };
    }
    data.phone = phone;
  }

  if (!partial || has("addressLine1")) {
    const addressLine1 = trimmed(body.addressLine1).slice(0, MAX_LEN);
    if (!addressLine1) return { error: "Address (house/flat/building) is required." };
    data.addressLine1 = addressLine1;
  }

  if (has("addressLine2")) {
    const addressLine2 = trimmed(body.addressLine2).slice(0, MAX_LEN);
    data.addressLine2 = addressLine2 || null;
  }

  if (!partial || has("city")) {
    const city = trimmed(body.city).slice(0, MAX_LEN);
    if (!city) return { error: "City is required." };
    data.city = city;
  }

  if (!partial || has("state")) {
    const state = trimmed(body.state).slice(0, MAX_LEN);
    if (!state) return { error: "State is required." };
    data.state = state;
  }

  if (!partial || has("postalCode")) {
    const postalCode = trimmed(body.postalCode);
    if (!/^[1-9][0-9]{5}$/.test(postalCode)) {
      return { error: "Enter a valid 6-digit PIN code." };
    }
    data.postalCode = postalCode;
  }

  if (has("isDefault")) {
    data.isDefault = Boolean(body.isDefault);
  }

  return { data };
}
