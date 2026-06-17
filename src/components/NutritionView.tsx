"use client";

import { NutritionTabNav } from "@/components/nutrition/NutritionTabNav";
import { NutritionDiary } from "@/components/nutrition/NutritionDiary";
import { FoodSearch } from "@/components/nutrition/FoodSearch";
import { NutritionMicro } from "@/components/nutrition/NutritionMicro";
import { NutritionGoals } from "@/components/nutrition/NutritionGoals";
import { CustomFoods } from "@/components/nutrition/CustomFoods";
import { useNutritionStore } from "@/store/nutritionStore";

export function NutritionView() {
  const { nutritionView } = useNutritionStore();

  const content = () => {
    switch (nutritionView) {
      case "diary": return <NutritionDiary />;
      case "search": return <FoodSearch />;
      case "micro": return <NutritionMicro />;
      case "goals": return <NutritionGoals />;
      case "foods": return <CustomFoods />;
      default: return <NutritionDiary />;
    }
  };

  return (
    <div>
      <NutritionTabNav />
      <div className="mt-6">{content()}</div>
    </div>
  );
}