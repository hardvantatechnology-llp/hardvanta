"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
let idCounter = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const GLOWS = {
  success: "shadow-glow-cyan",
  error: "shadow-[0_0_40px_-8px_rgba(248,113,113,0.45)]",
  info: "shadow-glow-electric",
};

const ICON_COLORS = {
  success: "text-cyan",
  error: "text-red-400",
  info: "text-electric-light",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, opts = {}) => {
      const id = ++idCounter;
      const type = opts.type || "info";
      const duration = opts.duration ?? 3500;
      setToasts((t) => [...t, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  toast.success = (message, opts) => toast(message, { ...opts, type: "success" });
  toast.error = (message, opts) => toast(message, { ...opts, type: "error" });
  toast.info = (message, opts) => toast(message, { ...opts, type: "info" });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {mounted &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-4 z-[300] flex flex-col items-center gap-2 px-4 sm:top-6"
          >
            <AnimatePresence initial={false}>
              {toasts.map((t) => {
                const Icon = ICONS[t.type];
                return (
                  <motion.div
                    key={t.id}
                    layout={reduce ? false : "position"}
                    initial={reduce ? false : { opacity: 0, y: -24, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -16, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className={`glass-strong pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 ${GLOWS[t.type]}`}
                  >
                    <Icon size={20} className={`mt-0.5 shrink-0 ${ICON_COLORS[t.type]}`} />
                    <p className="flex-1 text-sm text-white/90">{t.message}</p>
                    <button
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss"
                      className="shrink-0 text-white/40 hover:text-white transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
