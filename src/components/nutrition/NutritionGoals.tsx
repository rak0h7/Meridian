"use client";

import { DEFAULT_GOALS } from "@/lib/nutritionTypes";
import { NUTRIENT_DEFINITIONS } from "@/data/nutrients";
import { useNutritionStore } from "@/store/nutritionStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const GOAL_KEYS = [
  "calories", "protein", "fat", "carbs", "fiber",
  "calcium", "iron", "potassium", "sodium",
  "vitaminD", "vitaminC", "magnesium", "zinc",
] as const;

export function NutritionGoals() {
  const { goals, setGoal, resetGoals } = useNutritionStore();

  return (
    <div className="space-y-5">
      <div className={ui.rowBetween}>
        <div>
          <h2 className={ui.pageTitle}>Daily targets</h2>
          <p className={ui.pageSub}>Set macro and micronutrient goals for progress tracking.</p>
        </div>
        <button type="button" onClick={resetGoals} className={cn(ui.btnSecondary, "text-xs")}>
          Reset defaults
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GOAL_KEYS.map((key) => {
          const def = NUTRIENT_DEFINITIONS.find((n) => n.id === key);
          const label = def?.name ?? key;
          const unit = def?.unit ?? "";
          const value = goals[key] ?? DEFAULT_GOALS[key] ?? 0;

          return (
            <div key={key}>
              <label className={ui.label}>
                {label} {unit && `(${unit})`}
              </label>
              <input
                type="number"
                min={0}
                step={key === "calories" ? 50 : key === "protein" || key === "carbs" || key === "fat" ? 1 : 0.1}
                value={value}
                onChange={(e) => setGoal(key, Math.max(0, parseFloat(e.target.value) || 0))}
                className={cn(ui.input, "mt-1.5")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}