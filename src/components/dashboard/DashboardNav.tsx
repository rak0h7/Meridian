"use client";

import {
  Calendar,
  LineChart,
  Flame,
  BarChart3,
  Radar,
  HeartPulse,
  Syringe,
  Shield,
} from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const TABS = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "pk-curves", label: "PK Curves", icon: LineChart },
  { id: "heatmap", label: "Heatmap", icon: Flame },
  { id: "stacked", label: "Stacked Load", icon: BarChart3 },
  { id: "risk", label: "Risk Radar", icon: Radar },
  { id: "er-card", label: "ER Card", icon: HeartPulse },
  { id: "injection", label: "Injection Sites", icon: Syringe },
  { id: "defense", label: "Defense", icon: Shield },
];

export function DashboardNav() {
  const { dashboardTab, setDashboardTab } = useCycleStore();

  return (
    <div className="no-print mb-6 flex justify-center">
      <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = dashboardTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDashboardTab(tab.id)}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-[10px] font-bold uppercase tracking-wider transition-all",
                active
                  ? ui.pillProtocolActive
                  : cn(ui.btnGhost, "h-9 text-[var(--muted)]")
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}