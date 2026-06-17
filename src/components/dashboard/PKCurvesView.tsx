"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useCycleStore } from "@/store/cycleStore";
import { getCompoundById } from "@/data/compounds";
import { generatePKData, generatePKCards } from "@/lib/cycleCalculations";
import { ui } from "@/lib/ui";
import { getChartColors, getChartTheme } from "@/lib/charts";
import { useSettings } from "@/context/SettingsContext";

export function PKCurvesView() {
  useSettings(); // re-render on theme change
  const chart = getChartTheme();
  const colors = getChartColors();
  const { compounds, getEffectiveWeeks } = useCycleStore();
  const weeks = getEffectiveWeeks();
  const data = generatePKData(weeks, compounds);
  const cards = generatePKCards(weeks, compounds);

  if (compounds.length === 0) {
    return (
      <div className={`${ui.card} flex min-h-[12rem] items-center justify-center ${ui.cardPad}`}>
        <p className="text-[var(--muted)]">Add compounds to see pharmacokinetic curves.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`${ui.card} ${ui.cardPad}`}>
        <div className="h-[22rem] w-full sm:h-[24rem]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
              <XAxis dataKey="week" stroke={chart.axis} fontSize={11} tick={{ fill: chart.axis }} />
              <YAxis stroke={chart.axis} fontSize={11} tick={{ fill: chart.axis }} width={40} />
              <Tooltip contentStyle={chart.tooltip} />
              <ReferenceLine x={`W${weeks}`} stroke={chart.accent} strokeDasharray="5 5" label={{ value: "Cycle End", fill: chart.accent, fontSize: 10 }} />
              {compounds.slice(0, 6).map((cc, i) => (
                <Line
                  key={cc.compoundId}
                  type="monotone"
                  dataKey={cc.compoundId}
                  stroke={colors[i % colors.length]}
                  strokeWidth={i === 0 ? 2.5 : 1.5}
                  dot={false}
                  name={getCompoundById(cc.compoundId)?.shortName ?? cc.compoundId}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.id} className={`${ui.cardInner} flex flex-col p-3`}>
            <p className="text-sm font-bold" style={{ color: card.color }}>{card.short}</p>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-2 text-center">
              <div>
                <p className="text-lg font-black leading-none text-white">{card.peak}</p>
                <p className="mt-1 text-[9px] uppercase text-[var(--muted-2)]">Peak</p>
                <p className="text-[9px] text-[var(--muted-2)]">{card.peakW}</p>
              </div>
              <div>
                <p className="text-lg font-black leading-none text-white">{card.steady}</p>
                <p className="mt-1 text-[9px] uppercase text-[var(--muted-2)]">Steady</p>
                <p className="text-[9px] text-[var(--muted-2)]">{card.steadyW}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}