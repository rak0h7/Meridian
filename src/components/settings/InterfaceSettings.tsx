"use client";

import { Sliders } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useGymStore } from "@/store/gymStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function InterfaceSettings() {
  const { defaultRangeMode, updateSettings } = useSettings();
  const { defaultRestSeconds, weightUnit, setDefaultRestSeconds, setWeightUnit } = useGymStore();

  return (
    <div className={cn(ui.card, ui.cardPad, "space-y-6")}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--intel)]/30 bg-[var(--intel-dim)]">
          <Sliders className="h-5 w-5 text-[var(--intel)]" />
        </div>
        <div>
          <h3 className={ui.sectionTitle}>Module defaults</h3>
          <p className={ui.sectionSub}>Per-module preferences that persist across sessions.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className={cn(ui.overline, "mb-3")}>Labs</p>
          <div className={ui.rowBetween}>
            <div>
              <p className="text-sm text-[var(--foreground)]">Default range mode</p>
              <p className={ui.sectionSub}>How markers are evaluated on new panels</p>
            </div>
            <div className="flex gap-2">
              {(["optimized", "lab"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ defaultRangeMode: mode })}
                  className={cn(
                    "rounded-[var(--radius-sm)] border px-3 py-1.5 text-xs font-medium capitalize transition",
                    defaultRangeMode === mode
                      ? "border-[var(--labs)]/40 bg-[var(--labs-dim)] text-[var(--labs)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className={cn(ui.overline, "mb-3")}>Training</p>
          <div className="space-y-4">
            <div className={ui.rowBetween}>
              <div>
                <p className="text-sm text-[var(--foreground)]">Weight unit</p>
                <p className={ui.sectionSub}>Display unit for lifts and volume</p>
              </div>
              <div className="flex gap-2">
                {(["lb", "kg"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setWeightUnit(unit)}
                    className={cn(
                      "rounded-[var(--radius-sm)] border px-3 py-1.5 text-xs font-medium uppercase transition",
                      weightUnit === unit
                        ? "border-[var(--protocol)]/40 bg-[var(--protocol-dim)] text-[var(--protocol)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className={ui.rowBetween}>
                <span className="text-sm text-[var(--foreground)]">Default rest timer</span>
                <span className="font-mono text-xs text-[var(--muted)]">{defaultRestSeconds}s</span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={15}
                value={defaultRestSeconds}
                onChange={(e) => setDefaultRestSeconds(Number(e.target.value))}
                className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--bg-hover)] accent-[var(--protocol)]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-[var(--muted-2)]">
                <span>30s</span>
                <span>5m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}