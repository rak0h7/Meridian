export type NutrientCategory = "macro" | "vitamin" | "mineral" | "amino";

export type NutrientId =
  | "calories"
  | "protein"
  | "fat"
  | "carbs"
  | "fiber"
  | "sugars"
  | "saturatedFat"
  | "transFat"
  | "cholesterol"
  | "sodium"
  | "vitaminA"
  | "vitaminC"
  | "vitaminD"
  | "vitaminE"
  | "vitaminK"
  | "thiamin"
  | "riboflavin"
  | "niacin"
  | "vitaminB6"
  | "folate"
  | "vitaminB12"
  | "choline"
  | "pantothenicAcid"
  | "biotin"
  | "calcium"
  | "iron"
  | "magnesium"
  | "phosphorus"
  | "potassium"
  | "zinc"
  | "copper"
  | "manganese"
  | "selenium"
  | "iodine"
  | "tryptophan"
  | "leucine"
  | "lysine"
  | "valine"
  | "isoleucine"
  | "methionine"
  | "phenylalanine"
  | "threonine"
  | "histidine";

export interface NutrientDef {
  id: NutrientId;
  name: string;
  unit: string;
  category: NutrientCategory;
  dv: number | null;
}

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack" | "meal5" | "meal6";

export type NutrientMap = Partial<Record<NutrientId, number>>;

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  servingGrams: number;
  nutrients: NutrientMap;
  isCustom?: boolean;
}

export interface FoodLogEntry {
  id: string;
  foodId: string;
  name: string;
  brand?: string;
  meal: MealSlot;
  servings: number;
  servingSize: number;
  servingUnit: string;
  servingGrams: number;
  nutrients: NutrientMap;
  checked: boolean;
}

export interface CustomMeal {
  id: string;
  name: string;
  foods: { foodId: string; servings: number }[];
}

export interface DayJournal {
  weight?: number;
  notes?: string;
  workoutTitle?: string;
}

export const MEAL_ORDER: MealSlot[] = ["breakfast", "lunch", "dinner", "snack", "meal5", "meal6"];

export const MEAL_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  meal5: "Meal 5",
  meal6: "Meal 6",
};

export const CATEGORY_LABELS: Record<NutrientCategory, string> = {
  macro: "Macronutrients",
  vitamin: "Vitamins",
  mineral: "Minerals",
  amino: "Amino Acids",
};

export const DEFAULT_GOALS: Record<string, number> = {
  calories: 2200,
  protein: 165,
  fat: 73,
  carbs: 220,
  fiber: 30,
  calcium: 1300,
  iron: 18,
  potassium: 4700,
  sodium: 2300,
  vitaminD: 20,
  vitaminC: 90,
  magnesium: 420,
  zinc: 11,
};