"use client";

import { addDays, format, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface DateNavigatorProps {
  date: string;
  onChange: (date: string) => void;
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const d = parseISO(date);
  const shift = (delta: number) => onChange(format(addDays(d, delta), "yyyy-MM-dd"));

  return (
    <div className={cn(ui.cardInner, "flex items-center justify-between gap-2 p-2")}>
      <button
        type="button"
        onClick={() => shift(-1)}
        className={cn(ui.btnGhost, "h-9 w-9 shrink-0 rounded-[var(--radius-md)] p-0")}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {isToday(d) ? "Today" : format(d, "EEEE")}
        </p>
        <p className="text-[11px] text-[var(--muted)]">{format(d, "MMMM d, yyyy")}</p>
      </div>
      <button
        type="button"
        onClick={() => shift(1)}
        className={cn(ui.btnGhost, "h-9 w-9 shrink-0 rounded-[var(--radius-md)] p-0")}
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {!isToday(d) && (
        <button
          type="button"
          onClick={() => onChange(format(new Date(), "yyyy-MM-dd"))}
          className={cn(ui.btnSecondary, "h-9 shrink-0 px-3 text-xs")}
        >
          Today
        </button>
      )}
    </div>
  );
}