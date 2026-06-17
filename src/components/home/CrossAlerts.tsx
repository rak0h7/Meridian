"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Info, ShieldAlert } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import type { CrossAlert } from "@/lib/crossIntelligence";
import { cn } from "@/lib/utils";

const SEV = {
  critical: { icon: ShieldAlert, border: "border-[var(--danger)]/30", dot: "bg-[var(--danger)]" },
  warning: { icon: AlertTriangle, border: "border-[var(--warning)]/30", dot: "bg-[var(--warning)]" },
  info: { icon: Info, border: "border-[var(--intel)]/30", dot: "bg-[var(--intel)]" },
};

export function CrossAlerts({ alerts }: { alerts: CrossAlert[] }) {
  const { setRoute } = useNavigation();
  if (!alerts.length) return null;

  return (
    <div className="space-y-3">
      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]")}>
        Cross-domain signals
      </p>
      <div className="grid gap-2">
        {alerts.slice(0, 5).map((alert, i) => {
          const cfg = SEV[alert.severity];
          const Icon = cfg.icon;
          return (
            <motion.button
              key={alert.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setRoute(alert.route)}
              className={cn(
                "group flex w-full items-start gap-4 rounded-[var(--radius-md)] border bg-[var(--bg-surface)] p-4 text-left transition hover:bg-[var(--bg-hover)]",
                cfg.border
              )}
            >
              <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", cfg.dot)} />
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{alert.message}</p>
                <p className="mt-2 text-xs text-[var(--foreground)]/80">{alert.recommendation}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted-2)] group-hover:text-[var(--labs)]" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}