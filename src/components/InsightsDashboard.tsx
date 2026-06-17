"use client";

import { useApp } from "@/context/AppContext";
import { useCycleStore } from "@/store/cycleStore";
import { generateCrossAlerts } from "@/lib/crossIntelligence";
import { CrossAlerts } from "@/components/home/CrossAlerts";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { MarkerCategory } from "@/lib/types";
import {
  Activity,
  Beaker,
  Droplets,
  Flame,
  Heart,
  Pill,
  Shield,
  TestTube,
  Zap,
} from "lucide-react";

const CATEGORY_ICONS: Record<MarkerCategory, React.ReactNode> = {
  hormonal: <Zap className="h-3 w-3" />,
  cbc: <Droplets className="h-3 w-3" />,
  cardiovascular: <Heart className="h-3 w-3" />,
  liver: <Flame className="h-3 w-3" />,
  kidney: <Beaker className="h-3 w-3" />,
  electrolytes: <Activity className="h-3 w-3" />,
  metabolic: <Pill className="h-3 w-3" />,
  thyroid: <TestTube className="h-3 w-3" />,
  muscle: <Activity className="h-3 w-3" />,
  nutrients: <Pill className="h-3 w-3" />,
  immune: <Shield className="h-3 w-3" />,
};

function scoreColor(score: number | null): string {
  if (score === null) return "text-[var(--muted)]";
  if (score >= 90) return ui.statSuccess;
  if (score >= 75) return ui.statWarning;
  if (score >= 60) return ui.statWarning;
  return ui.statDanger;
}

function barColor(score: number | null): string {
  if (score === null) return "bg-[var(--bg-hover)]";
  if (score >= 90) return "bg-[var(--success)]";
  if (score >= 75) return "bg-[var(--warning)]";
  if (score >= 60) return "bg-[var(--warning)]";
  return "bg-[var(--danger)]";
}

const TAG_STYLES = {
  stop: "border-[var(--danger)]/40 bg-[var(--danger)]/15 text-[var(--danger)]",
  caut: "border-[var(--warning)]/30 bg-[var(--warning)]/15 text-[var(--warning)]",
  easy: "border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]",
  step: "border-[var(--protocol)]/30 bg-[var(--protocol-dim)] text-[var(--protocol)]",
};

export function InsightsDashboard() {
  const { categoryScores, overallScore, extractionFileName, currentValues, activeReport, reviewFlags } = useApp();
  const { compounds } = useCycleStore();
  const markerCount = Object.keys(currentValues).length;
  const crossAlerts = generateCrossAlerts(currentValues, reviewFlags, compounds);

  if (markerCount === 0) {
    return (
      <EmptyState
        icon={Activity}
        variant="labs"
        title="No insights yet"
        description="Enter lab values or upload a report to unlock category scores, health analysis, and cross-module recommendations."
      />
    );
  }

  return (
    <div className="space-y-6">
      <CrossAlerts alerts={crossAlerts.filter((a) => a.markers && a.markers.length > 0)} />
      {(extractionFileName || activeReport) && (
        <Panel variant="labs" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--labs)]" />
              <span className={ui.overline}>Currently Analysing</span>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {activeReport?.name || extractionFileName}
              </span>
            </div>
            <div className="text-right text-[10px] text-[var(--muted)]">
              <p>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}</p>
              <p>{markerCount} MARKERS</p>
            </div>
          </div>
        </Panel>
      )}

      <Panel variant="labs" className="p-8 text-center">
        <p className={ui.overline}>Overall Health Score</p>
        <p
          className={cn("mt-2 font-display text-6xl font-bold", ui.statLabs)}
          style={{ filter: "drop-shadow(0 0 20px var(--labs-glow))" }}
        >
          {overallScore.score}
        </p>
        <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-[var(--bg-hover)]">
          <div
            className={cn("h-full rounded-full transition-all", barColor(overallScore.score))}
            style={{ width: `${overallScore.score}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{overallScore.status}</p>
      </Panel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categoryScores.map((cat) => (
          <Panel
            key={cat.category}
            hover
            className="p-4"
          >
            <div className="mb-2 flex items-center gap-1.5 text-[var(--muted)]">
              {CATEGORY_ICONS[cat.category]}
              <span className={ui.overline}>{cat.label}</span>
            </div>
            <p className={cn("font-display text-2xl font-bold", scoreColor(cat.score))}>
              {cat.score ?? "—"}
            </p>
            <p className="text-[10px] text-[var(--muted)]">{cat.status}</p>
            <p className="mt-1 text-[10px] text-[var(--muted-2)]">
              {cat.assessed}/{cat.total} markers
            </p>
            {cat.score !== null && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-hover)]">
                <div className={cn("h-full", barColor(cat.score))} style={{ width: `${cat.score}%` }} />
              </div>
            )}
            {cat.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {cat.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={cn("rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase", TAG_STYLES[tag.type])}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}