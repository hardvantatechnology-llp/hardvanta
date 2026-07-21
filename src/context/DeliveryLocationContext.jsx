"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const DeliveryLocationContext = createContext(null);
const STORAGE_KEY = "hardvanta_location";
const RECENT_CAP = 5;

function readGuestStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { selected: null, recent: [] };
    const parsed = JSON.parse(raw);
    return { selected: parsed.selected ?? null, recent: Array.isArray(parsed.recent) ? parsed.recent : [] };
  } catch {
    return { selected: null, recent: [] };
  }
}

function writeGuestStorage(selected, recent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selected, recent }));
  } catch {}
}

function pushRecent(recent, entry) {
  const deduped = recent.filter((r) => r.pincode !== entry.pincode);
  return [entry, ...deduped].slice(0, RECENT_CAP);
}

// Mirrors CartContext.jsx's hydration-safe pattern: `location`/`recentLocations`
// start identical on server and client (null/[]) and are only ever populated
// inside a post-mount effect, gated by `hydrated`. Consumers that render a
// location- or date-derived string must themselves wait for `hydrated` before
// showing the real value — rendering it any earlier would reproduce the exact
// class of React hydration-mismatch bug already fixed for order timestamps.
export function DeliveryLocationProvider({ children }) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const [location, setLocationState] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const mergedRef = useRef(false);

  // Guest: load from localStorage on mount / on dropping back to guest.
  useEffect(() => {
    if (isAuthed) return;
    const { selected, recent } = readGuestStorage();
    setLocationState(selected);
    setRecentLocations(recent);
    setHydrated(true);
  }, [isAuthed]);

  // Guest: persist on change, gated by hydrated so the initial empty state
  // never clobbers storage before the read effect above runs.
  useEffect(() => {
    if (!isAuthed && hydrated) writeGuestStorage(location, recentLocations);
  }, [location, recentLocations, hydrated, isAuthed]);

  // Authenticated: adopt the account's saved location if it has one,
  // otherwise push the guest's local selection up to the account — runs once
  // per login, same guard shape as CartContext's merge effect.
  useEffect(() => {
    if (status !== "authenticated" || mergedRef.current) return;
    mergedRef.current = true;

    (async () => {
      try {
        const { selected, recent } = readGuestStorage();
        setRecentLocations(recent);

        const res = await fetch("/api/delivery/location");
        const data = await res.json();
        if (data?.location) {
          setLocationState(data.location);
        } else if (selected) {
          const putRes = await fetch("/api/delivery/location", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selected),
          });
          const putData = await putRes.json();
          setLocationState(putData?.location ?? selected);
        }
      } catch {
        // Leave location as-is — the picker remains usable, just unsynced this load.
      } finally {
        setHydrated(true);
      }
    })();
  }, [status]);

  // Re-arm the merge guard so a future login re-syncs.
  useEffect(() => {
    if (status === "unauthenticated") mergedRef.current = false;
  }, [status]);

  const selectLocation = useCallback(
    async (entry) => {
      setLocationState(entry);
      setRecentLocations((prev) => pushRecent(prev, entry));
      if (isAuthed) {
        try {
          await fetch("/api/delivery/location", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          });
        } catch {
          // Local state already updated; the account sync can retry next selection.
        }
      }
    },
    [isAuthed]
  );

  const clearLocation = useCallback(async () => {
    setLocationState(null);
    if (isAuthed) {
      try {
        await fetch("/api/delivery/location", { method: "DELETE" });
      } catch {}
    }
  }, [isAuthed]);

  const value = useMemo(
    () => ({ location, recentLocations, hydrated, selectLocation, clearLocation }),
    [location, recentLocations, hydrated, selectLocation, clearLocation]
  );

  return <DeliveryLocationContext.Provider value={value}>{children}</DeliveryLocationContext.Provider>;
}

export function useDeliveryLocation() {
  const ctx = useContext(DeliveryLocationContext);
  if (!ctx) throw new Error("useDeliveryLocation must be used within DeliveryLocationProvider");
  return ctx;
}
