"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type PanelVariant = "default" | "glass" | "labs" | "protocol" | "intel";

interface PanelProps extends HTMLMotionProps<"div"> {
  variant?: PanelVariant;
  hover?: boolean;
  children: React.ReactNode;
}

const VARIANTS: Record<PanelVariant, string> = {
  default: "glass-panel",
  glass: "glass-panel",
  labs: "glass-panel border-[var(--labs)]/25 bg-[var(--labs-dim)]",
  protocol: "glass-panel border-[var(--protocol)]/25 bg-[var(--protocol-dim)]",
  intel: "glass-panel border-[var(--intel)]/25 bg-[var(--intel-dim)]",
};

export function Panel({ variant = "glass", hover = false, className, children, ...props }: PanelProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.25 } } : undefined}
      whileTap={hover ? { scale: 0.995 } : undefined}
      className={cn(
        "rounded-[var(--radius-lg)]",
        VARIANTS[variant],
        hover && "cursor-pointer transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const GlassCard = Panel;