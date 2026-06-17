"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { generateDosesForDay, getCalendarDays } from "@/lib/cycleCalculations";
import { parseISO, format, addMonths } from "date-fns";
import { ui } from "@/lib/ui";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const { startDate, compounds } = useCycleStore();
  const start = parseISO(startDate);
  const [monthOffset, setMonthOffset] = useState(0);
  const viewDate = addMonths(start, monthOffset);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getCalendarDays(year, month);

  let totalDoses = 0;
  let activeDays = 0;
  days.forEach((d) => {
    if (!d) return;
    const doses = generateDosesForDay(d, start, compounds);
    totalDoses += doses.length;
    if (doses.length > 0) activeDays++;
  });

  return (
    <div className={`${ui.card} ${ui.cardPad}`}>
      <div className={`${ui.rowBetween} mb-5 flex-wrap`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--protocol)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="min-w-[10rem] text-center text-lg font-bold text-white sm:text-xl">
            {format(viewDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--protocol)] hover:text-[var(--foreground)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-[var(--muted)]">
          <span><span className="text-white">{activeDays}</span> active days</span>
          <span><span className="text-white">{totalDoses}</span> doses</span>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className={`${ui.label} py-2 text-center`}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const doses = generateDosesForDay(day, start, compounds);
          const inCycle = doses.length > 0;
          return (
            <div
              key={day.toISOString()}
              className={`flex min-h-[5.5rem] flex-col rounded-lg border p-1.5 sm:min-h-[6rem] sm:p-2 ${
                inCycle ? "border-[var(--protocol)]/30 bg-[var(--protocol-dim)]" : "border-[var(--border)] bg-[var(--bg-elevated)]"
              }`}
            >
              <span className="text-[10px] font-bold leading-none text-[var(--muted)]">{day.getDate()}</span>
              <div className="mt-1 flex flex-1 flex-col gap-0.5">
                {doses.slice(0, 4).map((dose, j) => (
                  <div
                    key={j}
                    className="truncate rounded px-1 py-0.5 text-[8px] font-semibold leading-tight text-white"
                    style={{ background: dose.color }}
                  >
                    {dose.name} {dose.dose}
                  </div>
                ))}
                {doses.length > 4 && (
                  <span className="text-[8px] text-[var(--muted-2)]">+{doses.length - 4}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}