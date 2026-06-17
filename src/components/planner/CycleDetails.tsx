"use client";

import { useCycleStore } from "@/store/cycleStore";
import {
  calculateStats,
  getIntensityScore,
  getIntensityLabel,
  calculatePctBegin,
  hasAnabolicCompounds,
} from "@/lib/cycleCalculations";
import { formatDate, getEndDate, getDayName } from "@/lib/utils";
import { parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const INTENSITY_LEVELS = [
  { id: "mild", label: "Mild", num: 1 },
  { id: "moderate", label: "Mod", num: 2 },
  { id: "heavy", label: "Heavy", num: 3 },
  { id: "blast", label: "Blast", num: 4 },
  { id: "nuclear", label: "Nuke", num: 5 },
] as const;

const INTENSITY_COLORS: Record<number, string> = {
  1: "bg-[var(--success)] text-[var(--bg-base)]",
  2: "bg-[var(--labs)] text-[var(--bg-base)]",
  3: "bg-[var(--protocol)] text-[var(--bg-base)]",
  4: "bg-[var(--warning)] text-[var(--bg-base)]",
  5: "bg-[var(--intel)] text-[var(--bg-base)]",
};

export function CycleDetails() {
  const { compounds, startDate, getEffectiveWeeks } = useCycleStore();
  const weeks = getEffectiveWeeks();
  const stats = calculateStats(compounds, weeks);
  const start = parseISO(startDate);
  const end = getEndDate(start, weeks);
  const score = getIntensityScore(compounds);
  const pctDate = calculatePctBegin(end, compounds);
  const hasAAS = hasAnabolicCompounds(compounds);

  const detailItems = [
    { label: "Avg / Week", value: stats.avgMgPerWeek || "—", sub: "total mg load", accent: ui.statProtocol },
    { label: "Start", value: formatDate(start), sub: getDayName(start), accent: "text-[var(--foreground)]" },
    { label: "End", value: formatDate(end), sub: getDayName(end), accent: "text-[var(--foreground)]" },
    { label: "PCT Begin", value: pctDate ? formatDate(pctDate) : "—", sub: hasAAS ? "after clearance" : "no AAS", accent: "text-[var(--foreground)]" },
  ];

  return (
    <div className={`${ui.cardProtocol} ${ui.cardPad}`}>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {detailItems.map((item) => (
            <div key={item.label} className="flex min-h-[4rem] flex-col justify-center">
              <p className={ui.label}>{item.label}</p>
              <p className={cn("mt-1 text-sm font-semibold sm:text-base", item.accent)}>{item.value}</p>
              <p className="mt-0.5 text-[10px] text-[var(--muted-2)]">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center">
          <p className={ui.label}>Intensity</p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {INTENSITY_LEVELS.map((level) => (
              <div
                key={level.id}
                className={cn(
                  "flex min-h-[3rem] flex-col items-center justify-center rounded-[var(--radius-sm)] py-1.5 text-center text-[9px] font-bold uppercase leading-tight sm:text-[10px]",
                  score === level.num
                    ? `${INTENSITY_COLORS[level.num]} shadow-lg`
                    : "border border-[var(--border)] text-[var(--muted-2)]"
                )}
              >
                <span className="opacity-60">{level.num}</span>
                <span>{level.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-[var(--muted-2)]">
            {compounds.length === 0
              ? "Add compounds to see estimated level"
              : `Estimated: ${getIntensityLabel(score)} (${score}/5)`}
          </p>
        </div>
      </div>
    </div>
  );
}