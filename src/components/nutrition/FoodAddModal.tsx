"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import type { FoodItem, MealSlot } from "@/lib/nutritionTypes";
import { MEAL_LABELS, MEAL_ORDER } from "@/lib/nutritionTypes";
import { nutrientsForFood } from "@/lib/nutritionCalculations";
import { useNutritionStore } from "@/store/nutritionStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface FoodAddModalProps {
  food: FoodItem | null;
  defaultMeal?: MealSlot;
  onClose: () => void;
}

export function FoodAddModal({ food, defaultMeal = "lunch", onClose }: FoodAddModalProps) {
  const { selectedDate, favorites, addEntry, toggleFavorite, pushRecent } = useNutritionStore();
  const [servings, setServings] = useState(1);
  const [meal, setMeal] = useState<MealSlot>(defaultMeal);

  if (!food) return null;

  const scaled = nutrientsForFood(food, servings);
  const isFav = favorites.includes(food.id);

  const handleAdd = () => {
    addEntry(selectedDate, {
      foodId: food.id,
      name: food.name,
      brand: food.brand,
      meal,
      servings,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      servingGrams: food.servingGrams,
      nutrients: scaled,
      checked: true,
    });
    pushRecent(food.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(ui.card, "w-full max-w-md p-5")}
        >
          <div className={ui.rowBetween}>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{food.name}</h3>
              {food.brand && <p className="text-xs text-[var(--muted)]">{food.brand}</p>}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => toggleFavorite(food.id)}
                className={cn(ui.btnGhost, "h-9 w-9 p-0", isFav && "text-[var(--warning)]")}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={cn("h-4 w-4", isFav && "fill-current")} />
              </button>
              <button type="button" onClick={onClose} className={cn(ui.btnGhost, "h-9 w-9 p-0")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-[var(--muted)]">
            Per serving: {food.servingSize} {food.servingUnit} ({food.servingGrams}g)
          </p>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Cal", value: Math.round(scaled.calories ?? 0) },
              { label: "Protein", value: `${(scaled.protein ?? 0).toFixed(1)}g` },
              { label: "Carbs", value: `${(scaled.carbs ?? 0).toFixed(1)}g` },
              { label: "Fat", value: `${(scaled.fat ?? 0).toFixed(1)}g` },
            ].map((m) => (
              <div key={m.label} className={cn(ui.cardInner, "px-2 py-2")}>
                <p className="text-[10px] text-[var(--muted)]">{m.label}</p>
                <p className="text-sm font-semibold">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className={ui.label}>Servings</label>
              <div className="mt-1.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(0.25, s - 0.25))}
                  className={cn(ui.btnSecondary, "h-10 w-10 shrink-0 p-0")}
                >
                  −
                </button>
                <input
                  type="number"
                  min={0.25}
                  step={0.25}
                  value={servings}
                  onChange={(e) => setServings(Math.max(0.25, parseFloat(e.target.value) || 1))}
                  className={cn(ui.input, "text-center")}
                />
                <button
                  type="button"
                  onClick={() => setServings((s) => s + 0.25)}
                  className={cn(ui.btnSecondary, "h-10 w-10 shrink-0 p-0")}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className={ui.label}>Meal</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {MEAL_ORDER.slice(0, 4).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setMeal(slot)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition",
                      meal === slot ? ui.pillProtocolActive : ui.pillInactive
                    )}
                  >
                    {MEAL_LABELS[slot]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={handleAdd} className={cn(ui.btnProtocol, "mt-5 w-full")}>
            Add to diary
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}