import type { FoodItem, NutrientMap } from "@/lib/nutritionTypes";

/** Nutrients per serving (servingGrams defines the base amount) */
function food(
  id: string,
  name: string,
  servingSize: number,
  servingUnit: string,
  servingGrams: number,
  nutrients: NutrientMap,
  brand?: string
): FoodItem {
  return { id, name, brand, servingSize, servingUnit, servingGrams, nutrients };
}

export const BUILTIN_FOODS: FoodItem[] = [
  food("chicken-breast", "Chicken Breast, cooked", 4, "oz", 113, {
    calories: 187, protein: 35, fat: 4, carbs: 0, fiber: 0, sodium: 74, potassium: 256, phosphorus: 220, selenium: 27, niacin: 13, vitaminB6: 0.9, vitaminB12: 0.3,
  }),
  food("eggs-whole", "Eggs, whole large", 2, "egg", 100, {
    calories: 143, protein: 12.6, fat: 9.5, carbs: 0.7, cholesterol: 372, sodium: 142, vitaminD: 2, vitaminB12: 0.9, selenium: 15, choline: 294,
  }),
  food("egg-whites", "Egg Whites", 4, "oz", 113, {
    calories: 52, protein: 11, fat: 0.2, carbs: 0.7, sodium: 166, potassium: 163,
  }),
  food("salmon", "Atlantic Salmon, cooked", 6, "oz", 170, {
    calories: 350, protein: 39, fat: 21, carbs: 0, sodium: 98, potassium: 534, vitaminD: 14, vitaminB12: 4.8, selenium: 41,
  }),
  food("ground-beef-90", "Ground Beef 90% lean", 4, "oz", 113, {
    calories: 199, protein: 23, fat: 11, carbs: 0, iron: 2.5, zinc: 5.5, vitaminB12: 2.4, selenium: 18,
  }),
  food("greek-yogurt", "Greek Yogurt, plain nonfat", 1, "cup", 245, {
    calories: 134, protein: 23, fat: 0.4, carbs: 9, sugars: 9, calcium: 250, potassium: 320, vitaminB12: 1.2, phosphorus: 230,
  }),
  food("whey-isolate", "Whey Protein Isolate", 1, "scoop", 30, {
    calories: 110, protein: 25, fat: 0.5, carbs: 1, calcium: 120, sodium: 50,
  }, "Generic"),
  food("white-rice", "White Rice, cooked", 1, "cup", 158, {
    calories: 206, protein: 4.3, fat: 0.4, carbs: 45, fiber: 0.6, folate: 91, manganese: 0.7,
  }),
  food("brown-rice", "Brown Rice, cooked", 1, "cup", 195, {
    calories: 216, protein: 5, fat: 1.8, carbs: 45, fiber: 3.5, magnesium: 84, phosphorus: 162, manganese: 1.8,
  }),
  food("oats", "Rolled Oats, dry", 0.5, "cup", 40, {
    calories: 150, protein: 5, fat: 3, carbs: 27, fiber: 4, iron: 1.7, magnesium: 56, phosphorus: 164, zinc: 1.3, manganese: 1.4,
  }),
  food("sweet-potato", "Sweet Potato, baked", 1, "medium", 150, {
    calories: 130, protein: 2, fat: 0.1, carbs: 30, fiber: 3.8, vitaminA: 961, vitaminC: 22, potassium: 438, manganese: 0.6,
  }),
  food("broccoli", "Broccoli, cooked", 1, "cup", 156, {
    calories: 55, protein: 3.7, fat: 0.6, carbs: 11, fiber: 5, vitaminC: 101, vitaminK: 141, folate: 84, potassium: 457, calcium: 62,
  }),
  food("spinach", "Spinach, raw", 2, "cup", 60, {
    calories: 14, protein: 1.7, fat: 0.2, carbs: 2.2, fiber: 1.3, vitaminA: 281, vitaminK: 145, iron: 0.8, folate: 58, magnesium: 24, potassium: 167,
  }),
  food("banana", "Banana, medium", 1, "medium", 118, {
    calories: 105, protein: 1.3, fat: 0.4, carbs: 27, fiber: 3.1, sugars: 14, potassium: 422, vitaminB6: 0.4, vitaminC: 10, manganese: 0.3,
  }),
  food("blueberries", "Blueberries", 1, "cup", 148, {
    calories: 84, protein: 1.1, fat: 0.5, carbs: 21, fiber: 3.6, sugars: 15, vitaminC: 14, vitaminK: 29, manganese: 0.5,
  }),
  food("avocado", "Avocado", 0.5, "medium", 100, {
    calories: 160, protein: 2, fat: 15, carbs: 9, fiber: 7, potassium: 485, vitaminK: 21, folate: 81, vitaminC: 10,
  }),
  food("olive-oil", "Olive Oil", 1, "tbsp", 14, {
    calories: 119, protein: 0, fat: 13.5, carbs: 0, vitaminE: 1.9, vitaminK: 8,
  }),
  food("almonds", "Almonds", 1, "oz", 28, {
    calories: 164, protein: 6, fat: 14, carbs: 6, fiber: 3.5, calcium: 76, magnesium: 76, vitaminE: 7.3, manganese: 0.6,
  }),
  food("peanut-butter", "Peanut Butter", 2, "tbsp", 32, {
    calories: 188, protein: 8, fat: 16, carbs: 6, fiber: 2, sodium: 136, magnesium: 49, niacin: 4.2,
  }),
  food("whole-milk", "Whole Milk", 1, "cup", 244, {
    calories: 149, protein: 8, fat: 8, carbs: 12, sugars: 12, calcium: 276, vitaminD: 2.9, vitaminB12: 1.1, phosphorus: 205, potassium: 322,
  }),
  food("cheddar", "Cheddar Cheese", 1, "oz", 28, {
    calories: 113, protein: 7, fat: 9, carbs: 0.4, calcium: 200, sodium: 174, vitaminA: 75, vitaminB12: 0.2, phosphorus: 145,
  }),
  food("cottage-cheese", "Cottage Cheese, low fat", 1, "cup", 226, {
    calories: 183, protein: 24, fat: 5, carbs: 10, calcium: 187, sodium: 746, phosphorus: 303, selenium: 20,
  }),
  food("pasta-cooked", "Pasta, cooked", 1, "cup", 140, {
    calories: 220, protein: 8, fat: 1.3, carbs: 43, fiber: 2.5, folate: 42, iron: 1.8, selenium: 26,
  }),
  food("bread-whole", "Whole Wheat Bread", 2, "slice", 56, {
    calories: 138, protein: 6, fat: 2, carbs: 24, fiber: 4, iron: 1.5, magnesium: 46, folate: 40,
  }),
  food("tuna-canned", "Tuna, canned in water", 1, "can", 165, {
    calories: 191, protein: 42, fat: 1.4, carbs: 0, sodium: 396, selenium: 112, vitaminB12: 2.5, niacin: 18, phosphorus: 323,
  }),
  food("shrimp", "Shrimp, cooked", 4, "oz", 113, {
    calories: 112, protein: 24, fat: 1.2, carbs: 0.9, cholesterol: 189, sodium: 224, selenium: 48, vitaminB12: 1.4, phosphorus: 205,
  }),
  food("tofu-firm", "Tofu, firm", 0.5, "cup", 126, {
    calories: 181, protein: 22, fat: 11, carbs: 4, fiber: 3, calcium: 421, iron: 3.4, magnesium: 65, phosphorus: 287, manganese: 1.2,
  }),
  food("black-beans", "Black Beans, cooked", 1, "cup", 172, {
    calories: 227, protein: 15, fat: 0.9, carbs: 41, fiber: 15, iron: 3.6, magnesium: 120, folate: 256, potassium: 611, zinc: 1.9,
  }),
  food("lentils", "Lentils, cooked", 1, "cup", 198, {
    calories: 230, protein: 18, fat: 0.8, carbs: 40, fiber: 16, iron: 6.6, folate: 358, phosphorus: 356, potassium: 731, zinc: 2.5,
  }),
  food("quinoa", "Quinoa, cooked", 1, "cup", 185, {
    calories: 222, protein: 8, fat: 3.6, carbs: 39, fiber: 5, iron: 2.8, magnesium: 118, phosphorus: 281, folate: 78, manganese: 1.2,
  }),
  food("potato-baked", "Potato, baked with skin", 1, "medium", 173, {
    calories: 161, protein: 4.3, fat: 0.2, carbs: 37, fiber: 3.8, potassium: 926, vitaminC: 17, vitaminB6: 0.5, iron: 1.9,
  }),
  food("apple", "Apple, medium", 1, "medium", 182, {
    calories: 95, protein: 0.5, fat: 0.3, carbs: 25, fiber: 4.4, sugars: 19, vitaminC: 8, potassium: 195,
  }),
  food("orange", "Orange, medium", 1, "medium", 131, {
    calories: 62, protein: 1.2, fat: 0.2, carbs: 15, fiber: 3.1, sugars: 12, vitaminC: 70, folate: 40, potassium: 237,
  }),
  food("protein-bar", "Protein Bar", 1, "bar", 60, {
    calories: 200, protein: 20, fat: 7, carbs: 22, fiber: 3, sugars: 2, calcium: 150, sodium: 200,
  }, "Generic"),
  food("creatine", "Creatine Monohydrate", 1, "tsp", 5, {
    calories: 0, protein: 0, fat: 0, carbs: 0,
  }, "Supplement"),
  food("casein-shake", "Casein Protein", 1, "scoop", 33, {
    calories: 120, protein: 24, fat: 1, carbs: 3, calcium: 500, sodium: 130,
  }),
  food("bagel", "Bagel, plain", 1, "bagel", 105, {
    calories: 289, protein: 11, fat: 2, carbs: 56, fiber: 2.3, iron: 3.6, folate: 72, sodium: 430,
  }),
  food("honey", "Honey", 1, "tbsp", 21, {
    calories: 64, protein: 0.1, fat: 0, carbs: 17, sugars: 17,
  }),
  food("coffee-black", "Coffee, black", 1, "cup", 240, {
    calories: 2, protein: 0.3, fat: 0, carbs: 0, potassium: 116, magnesium: 7, riboflavin: 0.2,
  }),
];

export function getFoodById(id: string, custom: FoodItem[] = []): FoodItem | undefined {
  return [...BUILTIN_FOODS, ...custom].find((f) => f.id === id);
}

export function searchFoods(query: string, custom: FoodItem[] = []): FoodItem[] {
  const q = query.trim().toLowerCase();
  const all = [...custom, ...BUILTIN_FOODS];
  if (!q) return all.slice(0, 30);
  return all.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.brand?.toLowerCase().includes(q) ?? false)
  );
}