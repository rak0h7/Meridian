"use client";

import { useApp } from "@/context/AppContext";
import { CATEGORY_LABELS, CATEGORY_ORDER, MARKERS_BY_CATEGORY } from "@/lib/markers";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { MarkerCategory } from "@/lib/types";
import {
  Activity,
  Beaker,
  Droplets,
  Flame,
  Heart,
  Pill,
  Shield,
  TestTube,
  Zap,
} from "lucide-react";

const CATEGORY_ICONS: Record<MarkerCategory, React.ReactNode> = {
  hormonal: <Zap className="h-4 w-4 text-[var(--intel)]" />,
  cbc: <Droplets className="h-4 w-4 text-[var(--labs)]" />,
  cardiovascular: <Heart className="h-4 w-4 text-[var(--danger)]" />,
  liver: <Flame className="h-4 w-4 text-[var(--warning)]" />,
  kidney: <Beaker className="h-4 w-4 text-[var(--intel)]" />,
  electrolytes: <Activity className="h-4 w-4 text-[var(--labs)]" />,
  metabolic: <Pill className="h-4 w-4 text-[var(--success)]" />,
  thyroid: <TestTube className="h-4 w-4 text-[var(--labs)]" />,
  muscle: <Activity className="h-4 w-4 text-[var(--labs)]" />,
  nutrients: <Pill className="h-4 w-4 text-[var(--success)]" />,
  immune: <Shield className="h-4 w-4 text-[var(--intel)]" />,
};

export function MarkerGrid() {
  const { currentValues, setMarkerValue } = useApp();

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((category) => {
        const markers = MARKERS_BY_CATEGORY[category];
        if (!markers?.length) return null;

        return (
          <section key={category} id={`section-${category}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {CATEGORY_ICONS[category]}
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  {CATEGORY_LABELS[category]}
                </h3>
              </div>
              <span className={ui.overline}>
                {markers.length} markers
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {markers.map((marker) => {
                const current = currentValues[marker.id];
                return (
                  <div
                    key={marker.id}
                    id={`marker-${marker.id}`}
                    className={cn(
                      ui.cardInner,
                      "p-2.5 transition hover:border-[var(--labs)]/30 hover:bg-[var(--bg-hover)]"
                    )}
                  >
                    <p className="mb-1.5 truncate text-[11px] font-semibold text-[var(--foreground)]">{marker.name}</p>
                    <select
                      value={current?.unit ?? marker.defaultUnit}
                      onChange={(e) =>
                        setMarkerValue(marker.id, current?.value ?? null, e.target.value)
                      }
                      className="mb-1 h-7 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-surface)] px-1 text-[10px] text-[var(--muted)] focus:border-[var(--labs)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--labs)]/15"
                    >
                      {marker.units.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="any"
                      value={current?.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? null : parseFloat(e.target.value);
                        setMarkerValue(marker.id, val, current?.unit ?? marker.defaultUnit);
                      }}
                      placeholder="—"
                      className={cn(ui.input, "h-9 px-2 py-1.5 text-sm font-semibold")}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}