"use client";

import { useMemo } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import { useNutritionStore } from "@/store/nutritionStore";
import { MEAL_LABELS, MEAL_ORDER, type MealSlot } from "@/lib/nutritionTypes";
import { macroSummary, pctOfGoal, sumNutrients } from "@/lib/nutritionCalculations";
import { DateNavigator } from "./DateNavigator";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

function CalorieRing({ value, goal }: { value: number; goal: number }) {
  const pct = pctOfGoal(value, goal);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const remaining = Math.max(0, goal - value);

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--protocol)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
        <p className="text-[10px] text-[var(--muted)]">of {goal} kcal</p>
        <p className="mt-0.5 text-[11px] font-medium text-[var(--protocol)]">
          {remaining} left
        </p>
      </div>
    </div>
  );
}

function MacroCard({
  label, value, goal, unit, color,
}: {
  label: string; value: number; goal: number; unit: string; color: string;
}) {
  const pct = pctOfGoal(value, goal);
  return (
    <div className={cn(ui.cardInner, "p-3")}>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-medium text-[var(--foreground)]">
          {value}{unit} / {goal}{unit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="mt-1 text-[10px] text-[var(--muted)]">{pct}% of goal</p>
    </div>
  );
}

export function NutritionDiary() {
  const {
    selectedDate, setSelectedDate, goals, getLog, removeEntry, toggleEntry,
    setAddMealSlot, setJournal, journal,
  } = useNutritionStore();
  const { setRoute } = useNavigation();

  const entries = getLog(selectedDate);
  const totals = useMemo(() => sumNutrients(entries, true), [entries]);
  const macros = macroSummary(totals);
  const dayJournal = journal[selectedDate] ?? {};

  const byMeal = useMemo(() => {
    const map: Record<MealSlot, typeof entries> = {
      breakfast: [], lunch: [], dinner: [], snack: [], meal5: [], meal6: [],
    };
    for (const e of entries) map[e.meal].push(e);
    return map;
  }, [entries]);

  const handleAddToMeal = (meal: MealSlot) => {
    setAddMealSlot(meal);
    setRoute("nutrition-search");
  };

  return (
    <div className="space-y-5">
      <DateNavigator date={selectedDate} onChange={setSelectedDate} />

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className={cn(ui.card, ui.cardPad, "flex flex-col items-center justify-center")}>
          <p className={ui.overline}>Calories</p>
          <CalorieRing value={macros.calories} goal={goals.calories ?? 2200} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <MacroCard label="Protein" value={macros.protein} goal={goals.protein ?? 165} unit="g" color="var(--labs)" />
          <MacroCard label="Carbs" value={macros.carbs} goal={goals.carbs ?? 220} unit="g" color="var(--intel)" />
          <MacroCard label="Fat" value={macros.fat} goal={goals.fat ?? 73} unit="g" color="var(--warning)" />
          <MacroCard label="Fiber" value={macros.fiber} goal={goals.fiber ?? 30} unit="g" color="var(--success)" />
        </div>
      </div>

      <div className={cn(ui.cardInner, "grid gap-3 p-4 sm:grid-cols-2")}>
        <div>
          <label className={ui.label}>Weight (optional)</label>
          <input
            type="number"
            step="0.1"
            placeholder="lbs or kg"
            value={dayJournal.weight ?? ""}
            onChange={(e) =>
              setJournal(selectedDate, {
                weight: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className={cn(ui.input, "mt-1.5")}
          />
        </div>
        <div>
          <label className={ui.label}>Notes</label>
          <input
            type="text"
            placeholder="How did today go?"
            value={dayJournal.notes ?? ""}
            onChange={(e) => setJournal(selectedDate, { notes: e.target.value || undefined })}
            className={cn(ui.input, "mt-1.5")}
          />
        </div>
      </div>

      <div className="space-y-4">
        {MEAL_ORDER.map((meal) => {
          const mealEntries = byMeal[meal];
          const mealCals = mealEntries
            .filter((e) => e.checked)
            .reduce((s, e) => s + (e.nutrients.calories ?? 0), 0);

          return (
            <div key={meal} className={cn(ui.card, ui.cardPad)}>
              <div className={ui.rowBetween}>
                <div>
                  <h3 className={ui.sectionTitle}>{MEAL_LABELS[meal]}</h3>
                  <p className="text-[11px] text-[var(--muted)]">
                    {mealEntries.length > 0 ? `${Math.round(mealCals)} kcal` : "No foods logged"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToMeal(meal)}
                  className={cn(ui.btnGhost, "h-8 gap-1 px-2 text-xs")}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              {mealEntries.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {mealEntries.map((entry) => (
                    <li
                      key={entry.id}
                      className={cn(
                        "flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 transition",
                        entry.checked ? "bg-[var(--bg-elevated)]/60" : "opacity-50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleEntry(selectedDate, entry.id)}
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
                          entry.checked
                            ? "border-[var(--protocol)] bg-[var(--protocol)] text-[var(--bg-base)]"
                            : "border-[var(--border)]"
                        )}
                      >
                        {entry.checked && <Check className="h-3 w-3" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{entry.name}</p>
                        <p className="text-[10px] text-[var(--muted)]">
                          {entry.servings}× {entry.servingSize} {entry.servingUnit}
                          {entry.brand ? ` · ${entry.brand}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                        {Math.round(entry.nutrients.calories ?? 0)} kcal
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(selectedDate, entry.id)}
                        className={cn(ui.btnGhost, "h-7 w-7 shrink-0 p-0 text-[var(--danger)]")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}