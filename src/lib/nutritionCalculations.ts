import type { FoodItem, FoodLogEntry, NutrientId, NutrientMap } from "@/lib/nutritionTypes";
import { NUTRIENT_DEFINITIONS } from "@/data/nutrients";

export function uid(): string {
  return crypto.randomUUID();
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function scaleNutrients(base: NutrientMap, factor: number): NutrientMap {
  const out: NutrientMap = {};
  for (const [k, v] of Object.entries(base)) {
    if (v != null) out[k as NutrientId] = Math.round(v * factor * 100) / 100;
  }
  return out;
}

export function nutrientsForFood(food: FoodItem, servings: number): NutrientMap {
  return scaleNutrients(food.nutrients, servings);
}

export function sumNutrients(entries: FoodLogEntry[], onlyChecked = false): NutrientMap {
  const totals: NutrientMap = {};
  for (const entry of entries) {
    if (onlyChecked && !entry.checked) continue;
    for (const [k, v] of Object.entries(entry.nutrients)) {
      if (v == null) continue;
      const key = k as NutrientId;
      totals[key] = (totals[key] ?? 0) + v;
    }
  }
  return totals;
}

export function entryFromFood(
  food: FoodItem,
  meal: FoodLogEntry["meal"],
  servings = 1
): Omit<FoodLogEntry, "id"> {
  return {
    foodId: food.id,
    name: food.name,
    brand: food.brand,
    meal,
    servings,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    servingGrams: food.servingGrams,
    nutrients: nutrientsForFood(food, servings),
    checked: true,
  };
}

export function macroSummary(totals: NutrientMap) {
  return {
    calories: Math.round(totals.calories ?? 0),
    protein: Math.round((totals.protein ?? 0) * 10) / 10,
    fat: Math.round((totals.fat ?? 0) * 10) / 10,
    carbs: Math.round((totals.carbs ?? 0) * 10) / 10,
    fiber: Math.round((totals.fiber ?? 0) * 10) / 10,
  };
}

export function pctOfGoal(value: number, goal: number | null | undefined): number {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export function nutrientsByCategory(totals: NutrientMap) {
  const groups: Record<string, { id: NutrientId; name: string; unit: string; value: number; dv: number | null; pct: number }[]> = {
    macro: [],
    vitamin: [],
    mineral: [],
    amino: [],
  };

  for (const def of NUTRIENT_DEFINITIONS) {
    const value = totals[def.id];
    if (value == null || value === 0) continue;
    groups[def.category].push({
      id: def.id,
      name: def.name,
      unit: def.unit,
      value: Math.round(value * 100) / 100,
      dv: def.dv,
      pct: def.dv ? pctOfGoal(value, def.dv) : 0,
    });
  }

  return groups;
}

export function formatNutrientValue(value: number, unit: string): string {
  if (unit === "kcal") return `${Math.round(value)}`;
  if (value >= 100) return `${Math.round(value)}`;
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}