"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Background } from "@/components/Background";
import { CheatSheet } from "@/components/CheatSheet";
import { ComparisonView } from "@/components/ComparisonView";
import { CyclePlannerView } from "@/components/CyclePlannerView";
import { CycleTabNav } from "@/components/CycleTabNav";
import { DebugPanel } from "@/components/DebugPanel";
import { ExtractionReview } from "@/components/ExtractionReview";
import { HistoryView } from "@/components/HistoryView";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { LogEntryView } from "@/components/LogEntryView";
import { ReviewFlags } from "@/components/ReviewFlags";
import { SecondaryNav } from "@/components/SecondaryNav";
import { UnifiedDashboard } from "@/components/home/UnifiedDashboard";
import { SettingsView } from "@/components/settings/SettingsView";
import { GymView } from "@/components/GymView";
import { NutritionView } from "@/components/NutritionView";
import { useNavigation } from "@/context/NavigationContext";
import { useApp } from "@/context/AppContext";
import { useSettings } from "@/context/SettingsContext";
import { CONTENT_WIDTH_CLASS } from "@/lib/themes";
import { useCycleStore } from "@/store/cycleStore";
import { useGymStore } from "@/store/gymStore";
import { useNutritionStore } from "@/store/nutritionStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { Blocks } from "lucide-react";
import { ui } from "@/lib/ui";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { route, sidebarCollapsed, setRoute, setSidebarCollapsed } = useNavigation();
  const { secondaryTab, setSecondaryTab, showComparison, logView, setMainTab } = useApp();
  const { reducedMotion, theme, compactSidebar } = useSettings();
  const { setView, compounds } = useCycleStore();
  const { setGymView } = useGymStore();
  const { setNutritionView } = useNutritionStore();

  useEffect(() => {
    setSidebarCollapsed(compactSidebar);
  }, [compactSidebar, setSidebarCollapsed]);

  useEffect(() => {
    if (route === "bloodwork-log") setMainTab("log");
    if (route === "bloodwork-history") setMainTab("history");
    if (route === "bloodwork-insights") setMainTab("insights");
    if (route === "cycle-planner") setView("planner");
    if (route === "cycle-guides") setView("guides");
    if (route === "cycle-dashboard") setView("dashboard");
    if (route === "gym-workout") setGymView("workout");
    if (route === "gym-routines") setGymView("routines");
    if (route === "gym-history") setGymView("history");
    if (route === "gym-progress") setGymView("progress");
    if (route === "gym-exercises") setGymView("exercises");
    if (route === "nutrition-diary") setNutritionView("diary");
    if (route === "nutrition-search") setNutritionView("search");
    if (route === "nutrition-micro") setNutritionView("micro");
    if (route === "nutrition-goals") setNutritionView("goals");
    if (route === "nutrition-foods") setNutritionView("foods");
  }, [route, setMainTab, setView, setGymView, setNutritionView]);

  const renderContent = () => {
    switch (route) {
      case "home":
        return <UnifiedDashboard />;
      case "bloodwork-log":
        if (logView === "extraction") return <ExtractionReview />;
        if (logView === "flags") return <ReviewFlags />;
        return <LogEntryView />;
      case "bloodwork-history":
        return showComparison ? <ComparisonView /> : <HistoryView />;
      case "bloodwork-insights":
        return <InsightsDashboard />;
      case "cycle-planner":
      case "cycle-guides":
        return (
          <div>
            <CycleTabNav />
            <div className="mt-6"><CyclePlannerView /></div>
          </div>
        );
      case "cycle-dashboard":
        if (compounds.length === 0) {
          return (
            <EmptyState
              icon={Blocks}
              variant="protocol"
              title="No protocol to simulate"
              description="Add compounds in the builder first to unlock calendar views, PK curves, and risk analytics."
              action={
                <button onClick={() => setRoute("cycle-planner")} className={ui.btnProtocol}>
                  Open Builder
                </button>
              }
            />
          );
        }
        return (
          <div>
            <CycleTabNav />
            <div className="mt-6"><CyclePlannerView /></div>
          </div>
        );
      case "gym-workout":
      case "gym-routines":
      case "gym-history":
      case "gym-progress":
      case "gym-exercises":
        return <GymView />;
      case "nutrition-diary":
      case "nutrition-search":
      case "nutrition-micro":
      case "nutrition-goals":
      case "nutrition-foods":
        return <NutritionView />;
      case "settings":
        return <SettingsView />;
      default:
        return <UnifiedDashboard />;
    }
  };

  const showBloodworkSecondary =
    route.startsWith("bloodwork") && route !== "bloodwork-insights";

  return (
    <div className="relative min-h-screen">
      <Background />
      <Sidebar />
      <div
        className={cn(
          "relative z-10 flex min-h-screen min-w-0 flex-col overflow-x-hidden transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[248px]"
        )}
      >
        <TopBar />
        <main className="app-main-with-mobile-nav flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:pb-8">
          <div className={cn("mx-auto w-full min-w-0 max-w-full px-0", CONTENT_WIDTH_CLASS[theme.contentWidth])}>
            {showBloodworkSecondary && (
              <div className="mb-4">
                <SecondaryNav />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={route + (logView) + (showComparison ? "-cmp" : "")}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <MobileNav />
      <CommandPalette />

      {secondaryTab === "cheat-sheet" && (
        <CheatSheet onClose={() => setSecondaryTab(null)} />
      )}
      {secondaryTab === "debug" && (
        <DebugPanel onClose={() => setSecondaryTab(null)} />
      )}
      {secondaryTab === "reports" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-md">
          <div className="w-full max-w-3xl">
            <HistoryView />
            <button onClick={() => setSecondaryTab(null)} className={`mt-4 w-full ${ui.btnSecondary}`}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}