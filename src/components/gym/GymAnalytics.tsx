"use client";

import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { format } from "date-fns";
import { Activity, Calendar, Trophy, TrendingUp } from "lucide-react";
import { getExerciseById } from "@/data/exercises";
import { getChartColors, getChartTheme } from "@/lib/charts";
import { muscleVolumeDistribution, volumeByWeek } from "@/lib/gymCalculations";
import { MUSCLE_GROUP_LABELS } from "@/lib/gymTypes";
import { useGymStore } from "@/store/gymStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function GymAnalytics() {
  const { history, personalRecords, customExercises, weightUnit } = useGymStore();
  const chartTheme = getChartTheme();
  const colors = getChartColors();

  const stats = useMemo(() => {
    const totalVolume = history.reduce((s, w) => s + w.totalVolume, 0);
    const totalSessions = history.length;
    const avgDuration = totalSessions
      ? Math.round(history.reduce((s, w) => s + w.durationMinutes, 0) / totalSessions)
      : 0;
    const last30 = history.filter(
      (w) => Date.now() - new Date(w.completedAt).getTime() < 30 * 86400000
    ).length;
    return { totalVolume, totalSessions, avgDuration, last30 };
  }, [history]);

  const weeklyData = useMemo(() => volumeByWeek(history), [history]);
  const muscleData = useMemo(() => {
    const dist = muscleVolumeDistribution(history, customExercises);
    return Object.entries(dist)
      .map(([muscle, volume]) => ({
        name: MUSCLE_GROUP_LABELS[muscle as keyof typeof MUSCLE_GROUP_LABELS] ?? muscle,
        value: Math.round(volume),
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [history, customExercises]);

  const topPRs = useMemo(
    () =>
      [...personalRecords]
        .sort((a, b) => b.estimated1RM - a.estimated1RM)
        .slice(0, 8),
    [personalRecords]
  );

  if (history.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        variant="intel"
        title="No stats yet"
        description="Complete a few workouts to unlock volume trends, muscle distribution, and personal records."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={ui.pageTitle}>Training Stats</h2>
        <p className={ui.pageSub}>Volume, frequency, and personal records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total sessions", value: stats.totalSessions, icon: Calendar, color: ui.statProtocol },
          { label: "Last 30 days", value: stats.last30, icon: Activity, color: ui.statIntel },
          { label: "Avg duration", value: `${stats.avgDuration}m`, icon: TrendingUp, color: ui.statAccent },
          { label: "Lifetime volume", value: `${(stats.totalVolume / 1000).toFixed(0)}k`, sub: weightUnit, icon: Trophy, color: ui.statWarning },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className={cn(ui.card, ui.cardPad)}>
            <p className={ui.overline}>{label}</p>
            <p className={cn("mt-2 text-2xl font-bold", color)}>{value}</p>
            {sub && <p className="text-xs text-[var(--muted)]">{sub}</p>}
            <Icon className="mt-2 h-4 w-4 text-[var(--muted-2)]" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn(ui.card, ui.cardPad)}>
          <p className={ui.sectionTitle}>Weekly volume</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="week"
                  tickFormatter={(v) => format(new Date(v), "MMM d")}
                  tick={{ fill: chartTheme.axis, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: chartTheme.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="volume" fill={chartTheme.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(ui.card, ui.cardPad)}>
          <p className={ui.sectionTitle}>Muscle group volume</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {muscleData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {muscleData.slice(0, 6).map((d, i) => (
              <span key={d.name} className="text-[10px] text-[var(--muted)]">
                <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {topPRs.length > 0 && (
        <div className={cn(ui.card, ui.cardPad)}>
          <p className={ui.sectionTitle}>Personal records</p>
          <div className="mt-4 space-y-2">
            {topPRs.map((pr) => {
              const ex = getExerciseById(pr.exerciseId, customExercises);
              return (
                <div key={pr.exerciseId} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{ex?.name ?? pr.exerciseId}</p>
                    <p className="text-[11px] text-[var(--muted)]">
                      {format(new Date(pr.achievedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--warning)]">
                      {pr.weight} {weightUnit} × {pr.reps}
                    </p>
                    <p className="text-[10px] text-[var(--muted)]">Est. 1RM {pr.estimated1RM} {weightUnit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}