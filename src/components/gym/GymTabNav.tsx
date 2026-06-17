"use client";

import { useNavigation } from "@/context/NavigationContext";
import { useGymStore } from "@/store/gymStore";
import { TabNav } from "@/components/ui/TabNav";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const TABS = [
  { id: "workout" as const, label: "Train", route: "gym-workout" as const },
  { id: "routines" as const, label: "Programs", route: "gym-routines" as const },
  { id: "history" as const, label: "Log", route: "gym-history" as const },
  { id: "progress" as const, label: "Stats", route: "gym-progress" as const },
  { id: "exercises" as const, label: "Library", route: "gym-exercises" as const },
];

export function GymTabNav() {
  const { gymView } = useGymStore();
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
              gymView === tab.id ? ui.pillProtocolActive : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </TabNav>
  );
}