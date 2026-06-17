"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_GOALS, type DayJournal, type FoodItem, type FoodLogEntry, type MealSlot } from "@/lib/nutritionTypes";
import { entryFromFood, todayStr, uid } from "@/lib/nutritionCalculations";

export type NutritionView = "diary" | "search" | "micro" | "goals" | "foods";

interface NutritionState {
  logs: Record<string, FoodLogEntry[]>;
  goals: Record<string, number>;
  customFoods: FoodItem[];
  favorites: string[];
  recentFoodIds: string[];
  journal: Record<string, DayJournal>;
  selectedDate: string;
  nutritionView: NutritionView;
  addMealSlot: MealSlot | null;

  setNutritionView: (view: NutritionView) => void;
  setSelectedDate: (date: string) => void;
  setAddMealSlot: (meal: MealSlot | null) => void;
  setGoal: (key: string, value: number) => void;
  resetGoals: () => void;

  addEntry: (date: string, entry: Omit<FoodLogEntry, "id">) => void;
  updateEntry: (date: string, id: string, patch: Partial<FoodLogEntry>) => void;
  removeEntry: (date: string, id: string) => void;
  toggleEntry: (date: string, id: string) => void;
  getLog: (date: string) => FoodLogEntry[];

  addCustomFood: (food: Omit<FoodItem, "id" | "isCustom">) => FoodItem;
  deleteCustomFood: (id: string) => void;
  toggleFavorite: (foodId: string) => void;
  pushRecent: (foodId: string) => void;

  setJournal: (date: string, patch: Partial<DayJournal>) => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: {},
      goals: { ...DEFAULT_GOALS },
      customFoods: [],
      favorites: [],
      recentFoodIds: [],
      journal: {},
      selectedDate: todayStr(),
      nutritionView: "diary",
      addMealSlot: null,

      setNutritionView: (view) => set({ nutritionView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setAddMealSlot: (meal) => set({ addMealSlot: meal }),
      setGoal: (key, value) => set({ goals: { ...get().goals, [key]: value } }),
      resetGoals: () => set({ goals: { ...DEFAULT_GOALS } }),

      addEntry: (date, entry) => {
        const logs = { ...get().logs };
        logs[date] = [...(logs[date] ?? []), { ...entry, id: uid() }];
        set({ logs });
      },

      updateEntry: (date, id, patch) => {
        const logs = { ...get().logs };
        logs[date] = (logs[date] ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e));
        set({ logs });
      },

      removeEntry: (date, id) => {
        const logs = { ...get().logs };
        logs[date] = (logs[date] ?? []).filter((e) => e.id !== id);
        set({ logs });
      },

      toggleEntry: (date, id) => {
        const logs = { ...get().logs };
        logs[date] = (logs[date] ?? []).map((e) =>
          e.id === id ? { ...e, checked: !e.checked } : e
        );
        set({ logs });
      },

      getLog: (date) => get().logs[date] ?? [],

      addCustomFood: (food) => {
        const created: FoodItem = { ...food, id: uid(), isCustom: true };
        set({ customFoods: [created, ...get().customFoods] });
        return created;
      },

      deleteCustomFood: (id) =>
        set({ customFoods: get().customFoods.filter((f) => f.id !== id) }),

      toggleFavorite: (foodId) => {
        const favs = get().favorites;
        set({
          favorites: favs.includes(foodId)
            ? favs.filter((f) => f !== foodId)
            : [foodId, ...favs],
        });
      },

      pushRecent: (foodId) => {
        const recent = [foodId, ...get().recentFoodIds.filter((id) => id !== foodId)].slice(0, 12);
        set({ recentFoodIds: recent });
      },

      setJournal: (date, patch) => {
        const journal = { ...get().journal };
        journal[date] = { ...journal[date], ...patch };
        set({ journal });
      },
    }),
    { name: "meridian-nutrition-store-v1" }
  )
);

export function quickAddFood(date: string, food: FoodItem, meal: MealSlot, servings = 1) {
  const store = useNutritionStore.getState();
  store.addEntry(date, entryFromFood(food, meal, servings));
  store.pushRecent(food.id);
}