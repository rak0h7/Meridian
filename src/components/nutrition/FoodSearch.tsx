"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { getFoodById, searchFoods } from "@/data/foods";
import { useNutritionStore } from "@/store/nutritionStore";
import { MEAL_LABELS } from "@/lib/nutritionTypes";
import { FoodAddModal } from "./FoodAddModal";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function FoodSearch() {
  const {
    customFoods, favorites, recentFoodIds, addMealSlot, setAddMealSlot,
  } = useNutritionStore();
  const [query, setQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const results = useMemo(() => searchFoods(query, customFoods), [query, customFoods]);
  const favoriteFoods = useMemo(
    () => favorites.map((id) => getFoodById(id, customFoods)).filter(Boolean),
    [favorites, customFoods]
  );
  const recentFoods = useMemo(
    () => recentFoodIds.map((id) => getFoodById(id, customFoods)).filter(Boolean),
    [recentFoodIds, customFoods]
  );

  const selectedFood = selectedFoodId
    ? getFoodById(selectedFoodId, customFoods) ?? null
    : null;

  const openFood = (id: string) => setSelectedFoodId(id);

  const FoodRow = ({ id, name, brand, calories }: {
    id: string; name: string; brand?: string; calories?: number;
  }) => {
    const isFav = favorites.includes(id);
    return (
      <button
        type="button"
        onClick={() => openFood(id)}
        className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2 py-2.5 text-left transition hover:bg-[var(--bg-hover)]"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-[11px] text-[var(--muted)]">
            {brand ? `${brand} · ` : ""}
            {calories != null ? `${Math.round(calories)} kcal/serving` : "Tap to add"}
          </p>
        </div>
        {isFav && <Star className="h-3.5 w-3.5 shrink-0 fill-[var(--warning)] text-[var(--warning)]" />}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {addMealSlot && (
        <div className={cn(ui.cardIntel, "flex items-center justify-between px-4 py-3 text-sm")}>
          <span>
            Adding to <strong>{MEAL_LABELS[addMealSlot]}</strong>
          </span>
          <button
            type="button"
            onClick={() => setAddMealSlot(null)}
            className={cn(ui.btnGhost, "h-8 px-2 text-xs")}
          >
            Clear
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="search"
          placeholder="Search foods by name or brand…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(ui.input, "pl-10")}
          autoFocus
        />
      </div>

      {!query && recentFoods.length > 0 && (
        <section>
          <p className={cn(ui.overline, "mb-2")}>Recent</p>
          <div className={cn(ui.cardInner, "divide-y divide-[var(--border)] px-1")}>
            {recentFoods.map((f) => f && (
              <FoodRow
                key={f.id}
                id={f.id}
                name={f.name}
                brand={f.brand}
                calories={f.nutrients.calories}
              />
            ))}
          </div>
        </section>
      )}

      {!query && favoriteFoods.length > 0 && (
        <section>
          <p className={cn(ui.overline, "mb-2")}>Favorites</p>
          <div className={cn(ui.cardInner, "divide-y divide-[var(--border)] px-1")}>
            {favoriteFoods.map((f) => f && (
              <FoodRow
                key={f.id}
                id={f.id}
                name={f.name}
                brand={f.brand}
                calories={f.nutrients.calories}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <p className={cn(ui.overline, "mb-2")}>
          {query ? `Results (${results.length})` : "All foods"}
        </p>
        <div className={cn(ui.card, "max-h-[50vh] overflow-y-auto px-1 py-1")}>
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--muted)]">No foods match your search</p>
          ) : (
            results.map((f) => (
              <FoodRow
                key={f.id}
                id={f.id}
                name={f.name}
                brand={f.brand}
                calories={f.nutrients.calories}
              />
            ))
          )}
        </div>
      </section>

      {selectedFood && (
        <FoodAddModal
          food={selectedFood}
          defaultMeal={addMealSlot ?? "lunch"}
          onClose={() => setSelectedFoodId(null)}
        />
      )}
    </div>
  );
}