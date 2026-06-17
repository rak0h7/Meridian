"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { NutrientMap } from "@/lib/nutritionTypes";
import { useNutritionStore } from "@/store/nutritionStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const QUICK_NUTRIENTS = ["calories", "protein", "fat", "carbs", "fiber", "sodium"] as const;

export function CustomFoods() {
  const { customFoods, addCustomFood, deleteCustomFood } = useNutritionStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState(1);
  const [servingUnit, setServingUnit] = useState("serving");
  const [servingGrams, setServingGrams] = useState(100);
  const [nutrients, setNutrients] = useState<Record<string, string>>({});

  const handleCreate = () => {
    if (!name.trim()) return;
    const nutrientMap: NutrientMap = {};
    for (const [k, v] of Object.entries(nutrients)) {
      const num = parseFloat(v);
      if (!isNaN(num) && num > 0) nutrientMap[k as keyof NutrientMap] = num;
    }
    addCustomFood({
      name: name.trim(),
      brand: brand.trim() || undefined,
      servingSize,
      servingUnit,
      servingGrams,
      nutrients: nutrientMap,
    });
    setName("");
    setBrand("");
    setServingSize(1);
    setServingUnit("serving");
    setServingGrams(100);
    setNutrients({});
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className={ui.rowBetween}>
        <div>
          <h2 className={ui.pageTitle}>Custom foods</h2>
          <p className={ui.pageSub}>Build your own items for quick logging.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={cn(ui.btnProtocol, "text-xs")}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New food
        </button>
      </div>

      {showForm && (
        <div className={cn(ui.card, ui.cardPad, "space-y-4")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={ui.label}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(ui.input, "mt-1.5")}
                placeholder="e.g. Homemade shake"
              />
            </div>
            <div>
              <label className={ui.label}>Brand (optional)</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={cn(ui.input, "mt-1.5")}
              />
            </div>
            <div>
              <label className={ui.label}>Serving size</label>
              <input
                type="number"
                min={0.1}
                value={servingSize}
                onChange={(e) => setServingSize(parseFloat(e.target.value) || 1)}
                className={cn(ui.input, "mt-1.5")}
              />
            </div>
            <div>
              <label className={ui.label}>Serving unit</label>
              <input
                value={servingUnit}
                onChange={(e) => setServingUnit(e.target.value)}
                className={cn(ui.input, "mt-1.5")}
                placeholder="cup, scoop, slice…"
              />
            </div>
            <div>
              <label className={ui.label}>Grams per serving</label>
              <input
                type="number"
                min={1}
                value={servingGrams}
                onChange={(e) => setServingGrams(parseFloat(e.target.value) || 100)}
                className={cn(ui.input, "mt-1.5")}
              />
            </div>
          </div>

          <div>
            <p className={ui.label}>Nutrients per serving</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {QUICK_NUTRIENTS.map((key) => (
                <div key={key}>
                  <label className="text-[10px] capitalize text-[var(--muted)]">{key}</label>
                  <input
                    type="number"
                    min={0}
                    value={nutrients[key] ?? ""}
                    onChange={(e) =>
                      setNutrients((n) => ({ ...n, [key]: e.target.value }))
                    }
                    className={cn(ui.input, "mt-0.5 h-9")}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleCreate} className={cn(ui.btnProtocol, "w-full sm:w-auto")}>
            Save custom food
          </button>
        </div>
      )}

      {customFoods.length === 0 ? (
        <div className={cn(ui.cardInner, "py-12 text-center")}>
          <p className="text-sm text-[var(--muted)]">No custom foods yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {customFoods.map((food) => (
            <li key={food.id} className={cn(ui.cardInner, "flex items-center gap-3 p-3")}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{food.name}</p>
                <p className="text-[11px] text-[var(--muted)]">
                  {food.servingSize} {food.servingUnit} · {Math.round(food.nutrients.calories ?? 0)} kcal
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteCustomFood(food.id)}
                className={cn(ui.btnGhost, "h-8 w-8 p-0 text-[var(--danger)]")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}