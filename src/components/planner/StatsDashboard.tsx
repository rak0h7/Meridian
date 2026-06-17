"use client";

import { useCycleStore } from "@/store/cycleStore";
import { calculateStats } from "@/lib/cycleCalculations";
import { ui } from "@/lib/ui";

const STAT_ITEMS = [
  { key: "weeks", label: "Weeks", sub: (s: ReturnType<typeof calculateStats>) => `~${s.monthsApprox} mo`, color: ui.statProtocol },
  { key: "days", label: "Days", sub: () => "incl. weekends", color: ui.statLabs },
  { key: "compoundCount", label: "Compounds", sub: (s: ReturnType<typeof calculateStats>) => `${s.anabolicCount} aas • ${s.ancillaryCount} anc`, color: ui.statIntel },
  { key: "totalDoses", label: "Total Doses", sub: () => "across cycle", color: ui.statSuccess },
  { key: "injections", label: "Injections", sub: () => "IM + SC", color: "text-[var(--labs)]" },
  { key: "oralDoses", label: "Oral Doses", sub: () => "tabs / caps", color: ui.statProtocol },
  { key: "topicalApps", label: "Topical", sub: () => "creams / gels", color: ui.statIntel },
] as const;

export function StatsDashboard() {
  const { compounds, getEffectiveWeeks } = useCycleStore();
  const stats = calculateStats(compounds, getEffectiveWeeks());

  return (
    <div className={`${ui.cardProtocol} ${ui.cardPad}`}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-7">
        {STAT_ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex min-h-[4.5rem] flex-col items-center justify-center text-center"
          >
            <div className={`text-2xl font-black leading-none sm:text-3xl ${item.color}`}>
              {stats[item.key as keyof typeof stats]}
            </div>
            <div className={`${ui.label} mt-2`}>{item.label}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-[var(--muted-2)]">{item.sub(stats)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}