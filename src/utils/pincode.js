// Looks up an Indian 6-digit PIN code using the free India Post API
// (no API key required). Returns the area/city/state, or an error.
//
// Returns one of:
//   { ok: true,  area, city, state }
//   { ok: false, error }

const TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — PIN code -> area is static reference data.
const CACHE_MAX_SIZE = 500;

// Simple in-memory cache (per server instance). Map preserves insertion
// order, which we use for cheap LRU-ish eviction once it grows too large.
const cache = new Map();

function getCached(code) {
  const entry = cache.get(code);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(code);
    return null;
  }
  // Refresh recency.
  cache.delete(code);
  cache.set(code, entry);
  return entry.result;
}

function setCached(code, result) {
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(code, { result, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function lookupPincode(pin) {
  const code = String(pin).trim();

  // Indian PIN codes are exactly 6 digits and never start with 0.
  if (!/^[1-9][0-9]{5}$/.test(code)) {
    return { ok: false, error: "Enter a valid 6-digit PIN code." };
  }

  const cached = getCached(code);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      signal: controller.signal,
    });
    const data = await res.json();
    const result = Array.isArray(data) ? data[0] : null;

    if (!result || result.Status !== "Success" || !result.PostOffice?.length) {
      // Don't cache "not found" — upstream data can change/be inconsistent.
      return { ok: false, error: "Wrong PIN code — not found in India." };
    }

    const po = result.PostOffice[0];
    const success = {
      ok: true,
      area: po.Name, // locality / post office name
      city: po.District,
      state: po.State,
    };
    setCached(code, success);
    return success;
  } catch {
    return { ok: false, error: "Couldn't verify PIN code. Check your connection." };
  } finally {
    clearTimeout(timeout);
  }
}
