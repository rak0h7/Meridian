"use client";

import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "pre-cycle" as const, label: "Baseline" },
  { id: "during-cycle" as const, label: "On-cycle" },
  { id: "cheat-sheet" as const, label: "Reference" },
  { id: "reports" as const, label: "Panels" },
  { id: "debug" as const, label: "Debug" },
];

export function SecondaryNav() {
  const { secondaryTab, setSecondaryTab, cycleMode, setCycleMode, resetAll } = useApp();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5">
      {ITEMS.map((item) => {
        const active = secondaryTab === item.id || cycleMode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "pre-cycle" || item.id === "during-cycle") {
                setCycleMode(cycleMode === item.id ? null : item.id);
              }
              setSecondaryTab(secondaryTab === item.id ? null : item.id);
            }}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition",
              active
                ? "bg-[var(--labs-dim)] text-[var(--labs)]"
                : "text-[var(--muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--foreground)]"
            )}
          >
            {item.label}
          </button>
        );
      })}
      <button
        onClick={() => confirm("Reset all lab data?") && resetAll()}
        className="rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
      >
        Reset
      </button>
    </div>
  );
}