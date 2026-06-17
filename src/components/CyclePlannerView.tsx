"use client";

import { CycleInputPanel } from "./planner/CycleInputPanel";
import { StatsDashboard } from "./planner/StatsDashboard";
import { CycleDetails } from "./planner/CycleDetails";
import { ActiveStack } from "./planner/ActiveStack";
import { QuickStartTemplates } from "./planner/QuickStartTemplates";
import { CompoundBrowser } from "./compounds/CompoundBrowser";
import { CompoundConfigureModal } from "./compounds/CompoundConfigureModal";
import { Dashboard } from "./dashboard/Dashboard";
import { CompoundGuidesView } from "./guides/CompoundGuidesView";
import { CompoundProfileModal } from "./guides/CompoundProfileModal";
import { useCycleStore } from "@/store/cycleStore";

export function CyclePlannerView() {
  const { view } = useCycleStore();

  return (
    <>
      <CompoundBrowser />
      <CompoundConfigureModal />
      <CompoundProfileModal />

      <div className="space-y-4">
        {view === "planner" && (
          <>
            <CycleInputPanel />
            <StatsDashboard />
            <CycleDetails />
            <ActiveStack />
            <QuickStartTemplates />
          </>
        )}
        {view === "guides" && <CompoundGuidesView />}
        {view === "dashboard" && <Dashboard />}
      </div>
    </>
  );
}