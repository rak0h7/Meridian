"use client";

import { Blocks, Compass, Dumbbell, Settings2, UtensilsCrossed } from "lucide-react";
import { useNavigation, type AppRoute } from "@/context/NavigationContext";
import { cn } from "@/lib/utils";

const ITEMS: { id: AppRoute; match: (route: AppRoute) => boolean; icon: React.ReactNode; label: string; accent: string }[] = [
  { id: "home", match: (r) => r === "home", icon: <Compass className="h-[22px] w-[22px]" strokeWidth={1.75} />, label: "Dashboard", accent: "text-[var(--intel)]" },
  { id: "cycle-planner", match: (r) => r.startsWith("cycle"), icon: <Blocks className="h-[22px] w-[22px]" strokeWidth={1.75} />, label: "Build", accent: "text-[var(--protocol)]" },
  { id: "gym-workout", match: (r) => r.startsWith("gym"), icon: <Dumbbell className="h-[22px] w-[22px]" strokeWidth={1.75} />, label: "Train", accent: "text-[var(--protocol)]" },
  { id: "nutrition-diary", match: (r) => r.startsWith("nutrition"), icon: <UtensilsCrossed className="h-[22px] w-[22px]" strokeWidth={1.75} />, label: "Food", accent: "text-[var(--intel)]" },
  { id: "settings", match: (r) => r === "settings" || r.startsWith("bloodwork"), icon: <Settings2 className="h-[22px] w-[22px]" strokeWidth={1.75} />, label: "More", accent: "text-[var(--muted)]" },
];

export function MobileNav() {
  const { route, setRoute } = useNavigation();

  return (
    <nav
      className="mobile-nav-dock fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main navigation"
    >
      <div className="mobile-nav-dock__fill" aria-hidden />
      <div
        className="relative z-10 flex min-h-[var(--mobile-nav-inner)] items-stretch justify-around px-0.5"
      >
        {ITEMS.map((item) => {
          const active = item.match(route);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setRoute(item.id)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition",
                active ? item.accent : "text-[var(--muted-2)]"
              )}
            >
              {item.icon}
              <span className="max-w-full truncate text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}