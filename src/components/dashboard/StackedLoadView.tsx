"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useCycleStore } from "@/store/cycleStore";
import { generateStackedLoadData } from "@/lib/cycleCalculations";
import { ui } from "@/lib/ui";
import { getChartTheme } from "@/lib/charts";
import { useSettings } from "@/context/SettingsContext";

export function StackedLoadView() {
  useSettings();
  const chart = getChartTheme();
  const { compounds, getEffectiveWeeks } = useCycleStore();
  const data = generateStackedLoadData(getEffectiveWeeks(), compounds);

  if (compounds.length === 0) {
    return (
      <div className={`${ui.card} flex min-h-[12rem] items-center justify-center ${ui.cardPad}`}>
        <p className="text-[var(--muted)]">Add compounds to see load over time.</p>
      </div>
    );
  }

  return (
    <div className={`${ui.card} ${ui.cardPad}`}>
      <h2 className="font-display text-lg font-bold text-[var(--protocol)]">Stacked Compound Load</h2>
      <p className={`${ui.sectionSub} mb-4`}>Cumulative daily load over the cycle</p>
      <div className="h-[22rem] w-full sm:h-[24rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chart.labs} stopOpacity={0.5} />
                <stop offset="100%" stopColor={chart.labs} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis dataKey="week" stroke={chart.axis} fontSize={11} tick={{ fill: chart.axis }} />
            <YAxis stroke={chart.axis} fontSize={11} tick={{ fill: chart.axis }} width={40} />
            <Tooltip contentStyle={chart.tooltip} />
            <Area type="monotone" dataKey="total" stroke={chart.labs} strokeWidth={2} fill="url(#loadGrad)" name="Total Load" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}