"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: "labs" | "protocol" | "intel";
  className?: string;
}

const ICON_BG = {
  labs: "border-[var(--labs)]/20 bg-[var(--labs-dim)] text-[var(--labs)]",
  protocol: "border-[var(--protocol)]/20 bg-[var(--protocol-dim)] text-[var(--protocol)]",
  intel: "border-[var(--intel)]/20 bg-[var(--intel-dim)] text-[var(--intel)]",
};

export function EmptyState({ icon: Icon, title, description, action, variant = "intel", className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] px-8 py-20 text-center",
        className
      )}
    >
      <div className={cn("mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] border", ICON_BG[variant])}>
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </motion.div>
  );
}