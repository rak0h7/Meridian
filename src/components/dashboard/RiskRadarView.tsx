"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { useCycleStore } from "@/store/cycleStore";
import { calculateRiskProfile } from "@/lib/cycleCalculations";
import { ui } from "@/lib/ui";
import { getChartTheme } from "@/lib/charts";
import { useSettings } from "@/context/SettingsContext";

export function RiskRadarView() {
  useSettings();
  const chart = getChartTheme();
  const { compounds } = useCycleStore();
  const risks = calculateRiskProfile(compounds);
  const hasCompounds = compounds.length > 0;
  const maxScore = Math.max(...risks.map((r) => r.score), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <div className={`${ui.card} ${ui.cardPad} flex flex-col`}>
          <h2 className="font-display text-lg font-bold text-[var(--protocol)]">Risk Profile</h2>
          <p className={`${ui.sectionSub} mb-4`}>Six-axis health-system risk from active stack</p>
          <div className="min-h-[18rem] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={hasCompounds ? risks : risks.map((r) => ({ ...r, value: 0 }))}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#7a8494", fontSize: 10 }} />
                <Radar dataKey="value" stroke={chart.accent} fill={chart.accent} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${ui.card} ${ui.cardPad} flex flex-col justify-center`}>
          {hasCompounds ? (
            <>
              <p className={ui.label}>Stack Assessment</p>
              <p className="mt-2 text-4xl font-black leading-none text-[var(--danger)]">{maxScore.toFixed(1)}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Peak risk score across all axes</p>
              <div className="mt-4 space-y-2 text-xs text-[var(--muted)]">
                {compounds.some((c) => c.compoundId.includes("tren")) && (
                  <p className="text-orange-400">• 19-nor compounds elevate cardio and neuro risk</p>
                )}
                {compounds.some((c) => ["anadrol", "dbol", "sdrol", "halo"].includes(c.compoundId)) && (
                  <p className="text-orange-400">• Oral 17α-alkylated compounds increase hepatic load</p>
                )}
                {!compounds.some((c) => c.compoundId === "hcg") && (
                  <p className="text-yellow-400">• No HCG — deeper HPTA suppression likely</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-[var(--muted)]">Add compounds to assess risk profile.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {risks.map((risk) => (
          <div key={risk.axis} className={`${ui.cardInner} p-4`}>
            <div className={`${ui.rowBetween} mb-2`}>
              <span className="text-sm font-bold text-white">{risk.axis}</span>
              <span className="text-sm font-semibold" style={{ color: risk.color }}>
                {hasCompounds ? risk.score : 0}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-hover)]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: hasCompounds ? `${Math.min(100, risk.value)}%` : "0%", background: risk.color }}
              />
            </div>
            <p className="mt-1 text-[10px] text-[var(--muted-2)]">
              Contributors: {hasCompounds ? risk.contributors : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}