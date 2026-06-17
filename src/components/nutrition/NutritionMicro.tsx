"use client";

import { useMemo, useState } from "react";
import { useNutritionStore } from "@/store/nutritionStore";
import { CATEGORY_LABELS, type NutrientCategory } from "@/lib/nutritionTypes";
import { nutrientsByCategory, pctOfGoal, sumNutrients } from "@/lib/nutritionCalculations";
import { NUTRIENT_DEFINITIONS } from "@/data/nutrients";
import { DateNavigator } from "./DateNavigator";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const CATEGORIES: NutrientCategory[] = ["vitamin", "mineral", "amino", "macro"];

export function NutritionMicro() {
  const { selectedDate, setSelectedDate, goals, getLog } = useNutritionStore();
  const [category, setCategory] = useState<NutrientCategory>("vitamin");

  const entries = getLog(selectedDate);
  const totals = useMemo(() => sumNutrients(entries, true), [entries]);
  const grouped = useMemo(() => nutrientsByCategory(totals), [totals]);

  const allInCategory = NUTRIENT_DEFINITIONS.filter(
    (n) => n.category === category && n.id !== "calories"
  );

  return (
    <div className="space-y-5">
      <DateNavigator date={selectedDate} onChange={setSelectedDate} />

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-semibold transition",
              category === cat ? ui.pillProtocolActive : ui.pillInactive
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className={cn(ui.card, ui.cardPad)}>
        <h3 className={ui.sectionTitle}>{CATEGORY_LABELS[category]}</h3>
        <p className={`${ui.sectionSub} mt-1`}>
          Daily intake vs reference values. Checked foods only.
        </p>

        <div className="mt-4 space-y-3">
          {allInCategory.map((def) => {
            const value = totals[def.id] ?? 0;
            const goal = goals[def.id] ?? def.dv ?? null;
            const pct = goal ? pctOfGoal(value, goal) : null;
            const logged = grouped[def.category].find((n) => n.id === def.id);

            return (
              <div key={def.id}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-[var(--foreground)]">{def.name}</span>
                  <span className="text-[var(--muted)]">
                    {value > 0 ? (
                      <>
                        <span className="font-medium text-[var(--foreground)]">
                          {logged?.value ?? value}
                        </span>
                        {" "}{def.unit}
                        {goal != null && ` · ${pct}% DV`}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                {goal != null && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        (pct ?? 0) >= 100 ? "bg-[var(--success)]" :
                        (pct ?? 0) >= 50 ? "bg-[var(--protocol)]" : "bg-[var(--warning)]"
                      )}
                      style={{ width: `${Math.min(100, pct ?? 0)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}