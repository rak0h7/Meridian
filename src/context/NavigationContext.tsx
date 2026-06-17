"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type AppRoute =
  | "home"
  | "bloodwork-log"
  | "bloodwork-history"
  | "bloodwork-insights"
  | "cycle-planner"
  | "cycle-guides"
  | "cycle-dashboard"
  | "gym-workout"
  | "gym-routines"
  | "gym-history"
  | "gym-progress"
  | "gym-exercises"
  | "nutrition-diary"
  | "nutrition-search"
  | "nutrition-micro"
  | "nutrition-goals"
  | "nutrition-foods"
  | "settings";

export type NavGroup = "overview" | "labs" | "protocol" | "training" | "nutrition" | "system";

export interface NavItem {
  id: AppRoute;
  label: string;
  group: NavGroup;
  icon: string;
  description?: string;
  accent: "labs" | "protocol" | "intel" | "neutral";
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Dashboard", group: "overview", icon: "compass", description: "Site-wide command center", accent: "intel" },
  { id: "bloodwork-log", label: "Log Labs", group: "labs", icon: "flask", description: "Upload or enter results", accent: "labs" },
  { id: "bloodwork-history", label: "Archive", group: "labs", icon: "archive", description: "Past panels & compare", accent: "labs" },
  { id: "bloodwork-insights", label: "Analysis", group: "labs", icon: "chart", description: "Scores & flags", accent: "labs" },
  { id: "cycle-planner", label: "Builder", group: "protocol", icon: "blocks", description: "Compose your stack", accent: "protocol" },
  { id: "cycle-guides", label: "Guides", group: "protocol", icon: "book", description: "Compound profiles & reference", accent: "protocol" },
  { id: "cycle-dashboard", label: "Simulation", group: "protocol", icon: "waveform", description: "PK curves & risk", accent: "protocol" },
  { id: "gym-workout", label: "Train", group: "training", icon: "dumbbell", description: "Log sets & track sessions", accent: "protocol" },
  { id: "gym-routines", label: "Programs", group: "training", icon: "clipboard", description: "Routines & templates", accent: "protocol" },
  { id: "gym-history", label: "Workout Log", group: "training", icon: "history", description: "Past training sessions", accent: "protocol" },
  { id: "gym-progress", label: "Training Stats", group: "training", icon: "trending", description: "Volume, PRs & charts", accent: "intel" },
  { id: "gym-exercises", label: "Exercises", group: "training", icon: "library", description: "Browse & create exercises", accent: "neutral" },
  { id: "nutrition-diary", label: "Diary", group: "nutrition", icon: "utensils", description: "Daily food log & macros", accent: "intel" },
  { id: "nutrition-search", label: "Add Food", group: "nutrition", icon: "search-food", description: "Search & log foods", accent: "intel" },
  { id: "nutrition-micro", label: "Micronutrients", group: "nutrition", icon: "leaf", description: "Vitamins, minerals & aminos", accent: "intel" },
  { id: "nutrition-goals", label: "Nutrition Goals", group: "nutrition", icon: "target", description: "Macro & micro targets", accent: "intel" },
  { id: "nutrition-foods", label: "Food Library", group: "nutrition", icon: "apple", description: "Custom foods & favorites", accent: "neutral" },
  { id: "settings", label: "Settings", group: "system", icon: "sliders", description: "Export & preferences", accent: "neutral" },
];

interface NavigationContextValue {
  route: AppRoute;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  setRoute: (route: AppRoute) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [route, setRouteState] = useState<AppRoute>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const setRoute = useCallback((r: AppRoute) => setRouteState(r), []);
  const setSidebarCollapsedState = useCallback((collapsed: boolean) => setSidebarCollapsed(collapsed), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

  return (
    <NavigationContext.Provider
      value={{
        route,
        sidebarCollapsed,
        commandOpen,
        setRoute,
        setSidebarCollapsed: setSidebarCollapsedState,
        toggleSidebar,
        setCommandOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}