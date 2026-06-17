"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: { type?: ToastType; title: string; description?: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const CONFIG = {
  success: { icon: CheckCircle2, border: "border-[var(--success)]/25", bg: "bg-[var(--bg-surface)]", iconColor: "text-[var(--success)]" },
  error: { icon: XCircle, border: "border-[var(--danger)]/25", bg: "bg-[var(--bg-surface)]", iconColor: "text-[var(--danger)]" },
  warning: { icon: AlertTriangle, border: "border-[var(--warning)]/25", bg: "bg-[var(--bg-surface)]", iconColor: "text-[var(--warning)]" },
  info: { icon: Info, border: "border-[var(--labs)]/25", bg: "bg-[var(--bg-surface)]", iconColor: "text-[var(--labs)]" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ type = "info", title, description }: { type?: ToastType; title: string; description?: string }) => {
      const id = `toast-${Date.now()}`;
      setToasts((t) => [...t, { id, type, title, description }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    },
    []
  );

  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-2 sm:bottom-6 sm:right-6 lg:bottom-6">
        <AnimatePresence>
          {toasts.map((t) => {
            const cfg = CONFIG[t.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border p-4 shadow-xl",
                  cfg.border, cfg.bg
                )}
              >
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", cfg.iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-xs text-[var(--muted)]">{t.description}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="shrink-0 text-[var(--muted)] hover:text-[var(--foreground)]">
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}