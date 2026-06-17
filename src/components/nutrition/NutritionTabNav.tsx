"use client";

import { useNavigation } from "@/context/NavigationContext";
import { useNutritionStore } from "@/store/nutritionStore";
import { TabNav } from "@/components/ui/TabNav";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const TABS = [
  { id: "diary" as const, label: "Diary", route: "nutrition-diary" as const },
  { id: "search" as const, label: "Add Food", route: "nutrition-search" as const },
  { id: "micro" as const, label: "Micros", route: "nutrition-micro" as const },
  { id: "goals" as const, label: "Goals", route: "nutrition-goals" as const },
  { id: "foods" as const, label: "Foods", route: "nutrition-foods" as const },
];

export function NutritionTabNav() {
  const { nutritionView } = useNutritionStore();
  const { setRoute } = useNavigation();

  return (
    <TabNav>
      <nav className="glass inline-flex shrink-0 gap-1 rounded-full p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoute(tab.route)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition sm:px-5",
              nutritionView === tab.id ? ui.pillProtocolActive : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </TabNav>
  );
}