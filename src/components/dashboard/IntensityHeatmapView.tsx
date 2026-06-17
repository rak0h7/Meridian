"use client";

import { useCycleStore } from "@/store/cycleStore";
import { getCalendarDays, getDayIntensity } from "@/lib/cycleCalculations";
import { parseISO, addMonths, format } from "date-fns";
import { ui } from "@/lib/ui";

const LEGEND = [
  { label: "Mild", color: "#22c55e" },
  { label: "Moderate", color: "#84cc16" },
  { label: "Heavy", color: "#eab308" },
  { label: "Blast", color: "#f97316" },
  { label: "Nuclear", color: "#ef4444" },
];

const INTENSITY_COLORS = ["", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

function MonthHeatmap({ year, month, startDate }: { year: number; month: number; startDate: Date }) {
  const { compounds } = useCycleStore();
  const days = getCalendarDays(year, month);

  return (
    <div className={`${ui.cardInner} flex flex-1 flex-col p-4`}>
      <h3 className="mb-3 text-center text-sm font-bold text-white sm:text-left">
        {format(new Date(year, month, 1), "MMMM yyyy")}
      </h3>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className={`${ui.label} text-center`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="aspect-square" />;
          const intensity = getDayIntensity(day, startDate, compounds);
          const color = intensity > 0 ? INTENSITY_COLORS[intensity] : undefined;
          return (
            <div
              key={day.toISOString()}
              className="flex aspect-square items-center justify-center rounded text-[9px] font-medium"
              style={{ background: color ?? "transparent", color: color ? "white" : "#52525b" }}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IntensityHeatmapView() {
  const { startDate } = useCycleStore();
  const start = parseISO(startDate);
  const next = addMonths(start, 1);

  return (
    <div className={`${ui.card} ${ui.cardPad}`}>
      <div className={`${ui.rowBetween} mb-5 flex-wrap items-end`}>
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--protocol)]">Daily Intensity Heatmap</h2>
          <p className={ui.sectionSub}>Color intensity per day based on total dose load</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
              <div className="h-3 w-3 shrink-0 rounded" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MonthHeatmap year={start.getFullYear()} month={start.getMonth()} startDate={start} />
        <MonthHeatmap year={next.getFullYear()} month={next.getMonth()} startDate={start} />
      </div>
    </div>
  );
}