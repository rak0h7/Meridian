"use client";

import { useCycleStore } from "@/store/cycleStore";
import { DashboardNav } from "./DashboardNav";
import { CalendarView } from "./CalendarView";
import { PKCurvesView } from "./PKCurvesView";
import { IntensityHeatmapView } from "./IntensityHeatmapView";
import { StackedLoadView } from "./StackedLoadView";
import { RiskRadarView } from "./RiskRadarView";
import { ERCardView } from "./ERCardView";
import { InjectionSitesView } from "./InjectionSitesView";
import { DefenseCoverageView } from "./DefenseCoverageView";
import { ui } from "@/lib/ui";

const VIEWS: Record<string, React.ComponentType> = {
  calendar: CalendarView,
  "pk-curves": PKCurvesView,
  heatmap: IntensityHeatmapView,
  stacked: StackedLoadView,
  risk: RiskRadarView,
  "er-card": ERCardView,
  injection: InjectionSitesView,
  defense: DefenseCoverageView,
};

export function Dashboard() {
  const { dashboardTab } = useCycleStore();
  const View = VIEWS[dashboardTab] ?? CalendarView;

  return (
    <div className="space-y-4">
      <div className={`${ui.cardProtocol} ${ui.cardPad} pb-0 sm:pb-0`}>
        <p className={ui.overline}>Cycle Analytics</p>
        <p className={`${ui.sectionSub} mb-4`}>Visualize pharmacokinetics, load, and risk across your stack</p>
        <DashboardNav />
      </div>
      <View />
    </div>
  );
}