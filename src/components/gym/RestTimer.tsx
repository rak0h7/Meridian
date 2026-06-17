"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useGymStore } from "@/store/gymStore";
import { cn } from "@/lib/utils";

export function RestTimer() {
  const { restTimer, skipRestTimer, startRestTimer, tickRestTimer, defaultRestSeconds } = useGymStore();

  useEffect(() => {
    if (!restTimer.active) return;
    const id = setInterval(tickRestTimer, 250);
    return () => clearInterval(id);
  }, [restTimer.active, tickRestTimer]);

  const secondsLeft = restTimer.active && restTimer.endsAt
    ? Math.max(0, Math.ceil((restTimer.endsAt - Date.now()) / 1000))
    : 0;

  const progress = restTimer.totalSeconds > 0
    ? ((restTimer.totalSeconds - secondsLeft) / restTimer.totalSeconds) * 100
    : 0;

  return (
    <AnimatePresence>
      {restTimer.active && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-24 left-1/2 z-50 w-[min(100%,20rem)] -translate-x-1/2 lg:bottom-8"
        >
          <div className="glass-panel overflow-hidden rounded-[var(--radius-xl)] p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className={cn("text-xs font-semibold uppercase tracking-wider text-[var(--muted)]")}>Rest</p>
              <button onClick={skipRestTimer} className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--foreground)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="font-display mt-1 text-4xl font-bold tabular-nums text-[var(--foreground)]">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg-hover)]">
              <div
                className="h-full rounded-full transition-all duration-300 [background:var(--gradient-primary)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startRestTimer(defaultRestSeconds + 30)}
                className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border)] py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                +30s
              </button>
              <button
                onClick={skipRestTimer}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] [background:var(--gradient-primary)] py-2 text-xs font-semibold text-white"
              >
                <Play className="h-3 w-3" />
                Skip
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}