"use client";

import { useCycleStore } from "@/store/cycleStore";
import { useNavigation } from "@/context/NavigationContext";
import { TabNav } from "@/components/ui/TabNav";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const TABS = [
  { id: "planner" as const, label: "Builder", route: "cycle-planner" as const },
  { id: "guides" as const, label: "Guides", route: "cycle-guides" as const },
  { id: "dashboard" as const, label: "Simulation", route: "cycle-dashboard" as const },
];

export function CycleTabNav() {
  const { view, compounds, setSelectedGuideId } = useCycleStore();
  const { setRoute } = useNavigation();

  return (
    <TabNav>
      <nav className="glass inline-flex shrink-0 gap-1 rounded-full p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "guides") setSelectedGuideId(null);
              setRoute(tab.route);
            }}
            disabled={tab.id === "dashboard" && compounds.length === 0}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold transition",
              view === tab.id ? ui.pillProtocolActive : "text-[var(--muted)] hover:text-[var(--foreground)]",
              tab.id === "dashboard" && compounds.length === 0 && "cursor-not-allowed opacity-35"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </TabNav>
  );
}