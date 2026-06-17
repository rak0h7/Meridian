"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity, AlertTriangle, ArrowRight, Beaker, Blocks, Calendar,
  ChevronRight, ClipboardList, Dumbbell, Droplet, FlaskConical,
  BookOpen, History, Leaf, Play, Spline, TrendingUp, Trophy, UtensilsCrossed, Zap,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { useNavigation, type AppRoute } from "@/context/NavigationContext";
import { useCycleStore } from "@/store/cycleStore";
import { useGymStore } from "@/store/gymStore";
import { useNutritionStore } from "@/store/nutritionStore";
import { macroSummary, pctOfGoal, sumNutrients, todayStr } from "@/lib/nutritionCalculations";
import { getExerciseById } from "@/data/exercises";
import { generateCrossAlerts } from "@/lib/crossIntelligence";
import { calculateStats, calculateRiskProfile } from "@/lib/cycleCalculations";
import { getChartTheme } from "@/lib/charts";
import { formatDuration, volumeByWeek } from "@/lib/gymCalculations";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { CrossAlerts } from "./CrossAlerts";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

type ModuleId = "labs" | "protocol" | "training" | "nutrition";

interface ActivityItem {
  id: string;
  module: ModuleId;
  title: string;
  subtitle: string;
  at: string;
  route: AppRoute;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Stat({
  label, value, sub, onClick,
}: {
  label: string; value: string | number; sub?: string; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        ui.cardInner,
        "flex min-h-[5.5rem] flex-col justify-center p-2.5 text-left transition sm:min-h-0 sm:p-3",
        onClick && "cursor-pointer hover:border-[var(--border-strong)]"
      )}
    >
      <p className={cn(ui.overline, "truncate text-[10px] sm:text-[11px]")}>{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--foreground)] sm:text-xl">{value}</p>
      {sub && <p className="mt-0.5 line-clamp-2 text-[10px] text-[var(--muted)]">{sub}</p>}
    </button>
  );
}

function ModuleHeader({
  title, status, statusColor, route, routeLabel, icon: Icon, accentClass,
}: {
  title: string;
  status: string;
  statusColor: string;
  route: AppRoute;
  routeLabel: string;
  icon: React.ElementType;
  accentClass: string;
}) {
  const { setRoute } = useNavigation();
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]", accentClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className={ui.sectionTitle}>{title}</h3>
          <p className={cn("text-[11px] font-medium", statusColor)}>{status}</p>
        </div>
      </div>
      <button
        onClick={() => setRoute(route)}
        className={cn(ui.btnGhost, "h-auto shrink-0 px-0 py-0 text-xs")}
      >
        {routeLabel} →
      </button>
    </div>
  );
}

export function UnifiedDashboard() {
  const { setRoute } = useNavigation();
  const { reports, overallScore, reviewFlags, currentValues, categoryScores } = useApp();
  const { compounds, getEffectiveWeeks, startDate } = useCycleStore();
  const {
    history: gymHistory, personalRecords, activeWorkout, customExercises,
    routines: gymRoutines, startEmptyWorkout, weightUnit,
  } = useGymStore();
  const { logs, goals, getLog } = useNutritionStore();
  const [loading, setLoading] = useState(true);
  const chartTheme = getChartTheme();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const weeks = getEffectiveWeeks();
  const cycleStats = compounds.length > 0 ? calculateStats(compounds, weeks) : null;
  const riskProfile = compounds.length > 0 ? calculateRiskProfile(compounds) : [];
  const topRisk = riskProfile.reduce((a, b) => (b.score > a.score ? b : a), riskProfile[0]);
  const criticalFlags = reviewFlags.filter((f) => f.severity === "stop" || f.severity === "high").length;
  const markerCount = Object.keys(currentValues).length;

  const gym30d = useMemo(
    () => gymHistory.filter((w) => Date.now() - new Date(w.completedAt).getTime() < 30 * 86400000),
    [gymHistory]
  );

  const today = todayStr();
  const todayLog = getLog(today);
  const todayMacros = macroSummary(sumNutrients(todayLog, true));
  const daysLogged = Object.keys(logs).filter((d) => (logs[d]?.length ?? 0) > 0).length;
  const crossAlerts = generateCrossAlerts(
    currentValues,
    reviewFlags,
    compounds,
    { goals, todayLog, daysLogged },
    gym30d.length
  );
  const vol30d = gym30d.reduce((s, w) => s + w.totalVolume, 0);
  const weeklyVolume = useMemo(() => volumeByWeek(gymHistory).slice(-6), [gymHistory]);

  const activity = useMemo(() => {
    const items: ActivityItem[] = [];
    for (const r of reports.slice(0, 4)) {
      items.push({
        id: `lab-${r.id}`,
        module: "labs",
        title: r.name || "Bloodwork panel",
        subtitle: `${Object.keys(r.values).length} markers`,
        at: r.date,
        route: "bloodwork-history",
      });
    }
    for (const w of gymHistory.slice(0, 4)) {
      items.push({
        id: `gym-${w.id}`,
        module: "training",
        title: w.name,
        subtitle: `${w.totalSets} sets · ${formatDuration(w.durationMinutes)}`,
        at: w.completedAt,
        route: "gym-history",
      });
    }
    if (compounds.length > 0) {
      items.push({
        id: "cycle-active",
        module: "protocol",
        title: `${compounds.length}-compound stack`,
        subtitle: `${weeks} weeks from ${startDate}`,
        at: startDate,
        route: "cycle-dashboard",
      });
    }
    if (todayLog.length > 0) {
      items.push({
        id: "nutrition-today",
        module: "nutrition",
        title: "Today's food log",
        subtitle: `${todayMacros.calories} kcal · ${todayMacros.protein}g protein`,
        at: today,
        route: "nutrition-diary",
      });
    }
    return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 6);
  }, [reports, gymHistory, compounds.length, weeks, startDate, todayLog.length, todayMacros.calories, todayMacros.protein, today]);

  const modulesActive = [
    reports.length > 0 || markerCount > 0,
    compounds.length > 0,
    gymHistory.length > 0 || !!activeWorkout,
    daysLogged > 0,
  ].filter(Boolean).length;

  const siteStatus = useMemo(() => {
    if (criticalFlags > 0 || crossAlerts.some((a) => a.severity === "critical"))
      return { label: "Attention required", color: "text-[var(--danger)]", dot: "bg-[var(--danger)]" };
    if (reviewFlags.length > 0 || crossAlerts.length > 0)
      return { label: "Review recommended", color: "text-[var(--warning)]", dot: "bg-[var(--warning)]" };
    if (modulesActive >= 3)
      return { label: "All systems tracking", color: "text-[var(--success)]", dot: "bg-[var(--success)]" };
    if (modulesActive === 1)
      return { label: "Getting started — add more data", color: "text-[var(--intel)]", dot: "bg-[var(--intel)]" };
    return { label: "Welcome — set up your first module", color: "text-[var(--muted)]", dot: "bg-[var(--muted)]" };
  }, [criticalFlags, crossAlerts, reviewFlags.length, modulesActive]);

  const assessedCategories = categoryScores.filter((c) => c.assessed > 0);
  const topPR = personalRecords.length > 0
    ? [...personalRecords].sort((a, b) => b.estimated1RM - a.estimated1RM)[0]
    : null;
  const topPRExercise = topPR ? getExerciseById(topPR.exerciseId, customExercises) : null;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(ui.glassAccent, "relative overflow-hidden p-4 sm:p-[calc(1.5rem*var(--space-unit))]")}
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl" style={{ background: "var(--labs-glow)" }} />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full blur-3xl opacity-60" style={{ background: "var(--protocol-glow)" }} />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className={ui.overline}>{format(new Date(), "EEEE, MMMM d")}</p>
            <h1 className="font-display mt-1 text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
              {greeting()} — <span className="text-gradient">Meridian</span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/80 px-3 py-1 text-xs">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", siteStatus.dot)} />
                <span className={cn("truncate", siteStatus.color)}>{siteStatus.label}</span>
              </span>
              <span className="text-xs text-[var(--muted)]">
                {modulesActive}/4 modules active
              </span>
            </div>
          </div>

          {activeWorkout ? (
            <button
              onClick={() => setRoute("gym-workout")}
              className={cn(ui.btnProtocol, "w-full shrink-0 sm:w-auto")}
            >
              <Play className="mr-2 h-4 w-4" />
              Resume workout
            </button>
          ) : (
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <button onClick={() => setRoute("bloodwork-log")} className={cn(ui.btnPrimary, "w-full sm:w-auto")}>
                <Droplet className="mr-2 h-4 w-4" />
                Log labs
              </button>
              <button
                onClick={() => { startEmptyWorkout(); setRoute("gym-workout"); }}
                className={cn(ui.btnSecondary, "w-full sm:w-auto")}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Train
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Global metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-10">
        {[
          { label: "Health score", value: overallScore?.score ?? "—", sub: overallScore?.status, route: "bloodwork-insights" as const },
          { label: "Lab flags", value: reviewFlags.length, sub: criticalFlags ? `${criticalFlags} critical` : "Review queue", route: "bloodwork-log" as const },
          { label: "Reports", value: reports.length, sub: "Archived panels", route: "bloodwork-history" as const },
          { label: "Markers", value: markerCount, sub: "Current panel", route: "bloodwork-insights" as const },
          { label: "Compounds", value: compounds.length, sub: cycleStats ? `${cycleStats.totalDoses} doses` : "No stack", route: "cycle-planner" as const },
          { label: "Workouts", value: gymHistory.length, sub: `${gym30d.length} last 30d`, route: "gym-history" as const },
          { label: "Volume 30d", value: vol30d > 0 ? `${(vol30d / 1000).toFixed(0)}k` : "—", sub: weightUnit, route: "gym-progress" as const, hideMobile: true },
          { label: "PRs", value: personalRecords.length, sub: topPRExercise?.name?.split(" ")[0] ?? "Records", route: "gym-progress" as const, hideMobile: true },
          { label: "Calories today", value: todayLog.length > 0 ? todayMacros.calories : "—", sub: goals.calories ? `/${goals.calories} goal` : "Food diary", route: "nutrition-diary" as const, hideMobile: true },
          { label: "Protein today", value: todayLog.length > 0 ? `${todayMacros.protein}g` : "—", sub: goals.protein ? `${pctOfGoal(todayMacros.protein, goals.protein)}% goal` : "Macros", route: "nutrition-diary" as const, hideMobile: true },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            custom={i}
            variants={fade}
            initial="hidden"
            animate="show"
            className={cn("xl:col-span-1", m.hideMobile && "hidden md:block")}
          >
            <Stat label={m.label} value={m.value} sub={m.sub} onClick={() => setRoute(m.route)} />
          </motion.div>
        ))}
      </div>

      {/* Module panels */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {/* Labs */}
        <motion.div custom={0} variants={fade} initial="hidden" animate="show" className={cn(ui.cardLabs, ui.cardPad, "flex flex-col gap-4")}>
          <ModuleHeader
            title="Labs"
            status={reports.length > 0 ? `${reports.length} panel${reports.length > 1 ? "s" : ""} on file` : "No panels logged"}
            statusColor={criticalFlags > 0 ? "text-[var(--danger)]" : reports.length > 0 ? "text-[var(--success)]" : "text-[var(--muted)]"}
            route="bloodwork-insights"
            routeLabel="Analysis"
            icon={FlaskConical}
            accentClass="bg-[var(--labs-dim)] text-[var(--labs)]"
          />
          {assessedCategories.length > 0 ? (
            <div className="space-y-2.5">
              {assessedCategories.slice(0, 4).map((cat) => (
                <div key={cat.category}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-[var(--muted)]">{cat.label}</span>
                    <span className={cn(
                      cat.score != null && cat.score >= 90 ? ui.statSuccess :
                      cat.score != null && cat.score >= 75 ? ui.statWarning : ui.statDanger
                    )}>{cat.score ?? "—"}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--labs)] to-[var(--labs)]/50"
                      style={{ width: `${cat.score ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(ui.cardInner, "flex flex-col items-center py-8 text-center")}>
              <FlaskConical className="mb-2 h-6 w-6 text-[var(--labs)]" />
              <p className="text-sm text-[var(--muted)]">Upload or enter your first panel</p>
              <button onClick={() => setRoute("bloodwork-log")} className={cn(ui.btnPrimary, "mt-4 text-xs")}>
                Log labs
              </button>
            </div>
          )}
          {reviewFlags.length > 0 && (
            <div className="rounded-[var(--radius-md)] border border-[var(--warning)]/25 bg-[var(--warning)]/5 px-3 py-2 text-xs text-[var(--muted)]">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-[var(--warning)]" />
              {reviewFlags.length} marker{reviewFlags.length > 1 ? "s" : ""} flagged for review
            </div>
          )}
        </motion.div>

        {/* Protocol */}
        <motion.div custom={1} variants={fade} initial="hidden" animate="show" className={cn(ui.cardProtocol, ui.cardPad, "flex flex-col gap-4")}>
          <ModuleHeader
            title="Protocol"
            status={compounds.length > 0 ? `${weeks}-week cycle active` : "No stack configured"}
            statusColor={compounds.length > 0 ? "text-[var(--success)]" : "text-[var(--muted)]"}
            route="cycle-dashboard"
            routeLabel="Simulation"
            icon={Beaker}
            accentClass="bg-[var(--protocol-dim)] text-[var(--protocol)]"
          />
          {compounds.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Duration" value={`${weeks}w`} />
                <Stat label="Injections" value={cycleStats?.injections ?? 0} />
                <Stat label="Start" value={format(new Date(startDate), "MMM d")} />
                <Stat label="Top risk" value={topRisk?.axis ?? "—"} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {compounds.slice(0, 5).map((c) => (
                  <span key={c.compoundId} className={cn(ui.pillInactive, "h-6 px-2.5 text-[10px]")}>
                    {c.compoundId}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className={cn(ui.cardInner, "flex flex-col items-center py-8 text-center")}>
              <Blocks className="mb-2 h-6 w-6 text-[var(--protocol)]" />
              <p className="text-sm text-[var(--muted)]">Build your compound stack</p>
              <button onClick={() => setRoute("cycle-planner")} className={cn(ui.btnProtocol, "mt-4 text-xs")}>
                Open builder
              </button>
            </div>
          )}
        </motion.div>

        {/* Training */}
        <motion.div custom={2} variants={fade} initial="hidden" animate="show" className={cn(ui.card, ui.cardPad, "flex flex-col gap-4 border-[var(--protocol)]/20")}>
          <ModuleHeader
            title="Training"
            status={
              activeWorkout
                ? `In progress — ${activeWorkout.name}`
                : gymHistory.length > 0
                  ? `${gym30d.length} session${gym30d.length !== 1 ? "s" : ""} this month`
                  : "No workouts logged"
            }
            statusColor={activeWorkout ? "text-[var(--warning)]" : gymHistory.length > 0 ? "text-[var(--success)]" : "text-[var(--muted)]"}
            route="gym-workout"
            routeLabel="Train"
            icon={Dumbbell}
            accentClass="bg-[var(--protocol-dim)] text-[var(--protocol)]"
          />
          {gymHistory.length > 0 || activeWorkout ? (
            <>
              {weeklyVolume.length > 0 && (
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyVolume}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                      <XAxis
                        dataKey="week"
                        tickFormatter={(v) => format(new Date(v), "M/d")}
                        tick={{ fill: chartTheme.axis, fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip contentStyle={chartTheme.tooltip} />
                      <Bar dataKey="volume" fill="var(--protocol)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Last session" value={gymHistory[0] ? format(new Date(gymHistory[0].completedAt), "MMM d") : "—"} />
                <Stat label="Best PR" value={topPR ? `${topPR.weight}×${topPR.reps}` : "—"} sub={topPRExercise?.name} />
              </div>
              {gymRoutines.length > 0 && (
                <p className="text-[11px] text-[var(--muted)]">
                  <ClipboardList className="mr-1 inline h-3 w-3" />
                  {gymRoutines.length} custom program{gymRoutines.length > 1 ? "s" : ""}
                </p>
              )}
            </>
          ) : (
            <div className={cn(ui.cardInner, "flex flex-col items-center py-8 text-center")}>
              <Dumbbell className="mb-2 h-6 w-6 text-[var(--protocol)]" />
              <p className="text-sm text-[var(--muted)]">Log sets, reps, and track PRs</p>
              <button
                onClick={() => { startEmptyWorkout(); setRoute("gym-workout"); }}
                className={cn(ui.btnProtocol, "mt-4 text-xs")}
              >
                Start workout
              </button>
            </div>
          )}
        </motion.div>

        {/* Nutrition */}
        <motion.div custom={3} variants={fade} initial="hidden" animate="show" className={cn(ui.cardIntel, ui.cardPad, "flex flex-col gap-4")}>
          <ModuleHeader
            title="Nutrition"
            status={
              todayLog.length > 0
                ? `${todayMacros.calories} kcal logged today`
                : daysLogged > 0
                  ? `${daysLogged} day${daysLogged !== 1 ? "s" : ""} tracked`
                  : "No food logged"
            }
            statusColor={todayLog.length > 0 ? "text-[var(--success)]" : daysLogged > 0 ? "text-[var(--intel)]" : "text-[var(--muted)]"}
            route="nutrition-diary"
            routeLabel="Diary"
            icon={UtensilsCrossed}
            accentClass="bg-[var(--intel-dim)] text-[var(--intel)]"
          />
          {todayLog.length > 0 || daysLogged > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Protein" value={todayLog.length > 0 ? `${todayMacros.protein}g` : "—"} sub={goals.protein ? `${pctOfGoal(todayMacros.protein, goals.protein)}% goal` : undefined} />
                <Stat label="Carbs" value={todayLog.length > 0 ? `${todayMacros.carbs}g` : "—"} />
                <Stat label="Fat" value={todayLog.length > 0 ? `${todayMacros.fat}g` : "—"} />
                <Stat label="Days logged" value={daysLogged} />
              </div>
              {todayLog.length > 0 && goals.calories && (
                <div>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-[var(--muted)]">Calories</span>
                    <span className="font-medium">{todayMacros.calories} / {goals.calories}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className="h-full rounded-full bg-[var(--intel)]"
                      style={{ width: `${pctOfGoal(todayMacros.calories, goals.calories)}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={cn(ui.cardInner, "flex flex-col items-center py-8 text-center")}>
              <UtensilsCrossed className="mb-2 h-6 w-6 text-[var(--intel)]" />
              <p className="text-sm text-[var(--muted)]">Track macros and micronutrients</p>
              <button onClick={() => setRoute("nutrition-search")} className={cn(ui.btnSecondary, "mt-4 text-xs")}>
                Log first meal
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cross-domain + activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div custom={3} variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <div className={cn(ui.card, ui.cardPad)}>
            <div className={ui.rowBetween}>
              <h3 className={ui.sectionTitle}>Recent activity</h3>
              <span className="text-[10px] text-[var(--muted)]">Across all modules</span>
            </div>
            {activity.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--muted)]">
                Activity from labs, protocol, training, and nutrition will appear here
              </p>
            ) : (
              <ul className="mt-4 space-y-1">
                {activity.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setRoute(item.route)}
                      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2 py-2.5 text-left transition hover:bg-[var(--bg-hover)]"
                    >
                      <span className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[10px] font-bold uppercase",
                        item.module === "labs" && "bg-[var(--labs-dim)] text-[var(--labs)]",
                        item.module === "protocol" && "bg-[var(--protocol-dim)] text-[var(--protocol)]",
                        item.module === "training" && "bg-[var(--protocol-dim)] text-[var(--protocol)]",
                        item.module === "nutrition" && "bg-[var(--intel-dim)] text-[var(--intel)]"
                      )}>
                        {item.module.slice(0, 3)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="text-[11px] text-[var(--muted)]">{item.subtitle}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-[var(--muted-2)]">
                        {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        <motion.div custom={4} variants={fade} initial="hidden" animate="show" className="lg:col-span-3">
          {crossAlerts.length > 0 ? (
            <CrossAlerts alerts={crossAlerts} />
          ) : (
            <div className={cn(ui.cardIntel, ui.cardPad)}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--intel-dim)] text-[var(--intel)]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={ui.sectionTitle}>Cross-domain intelligence</h3>
                  <p className={`${ui.sectionSub} mt-1 max-w-md`}>
                    Meridian correlates labs, nutrition, training, and your protocol stack. Log data across modules to unlock automated insights.
                  </p>
                  <button
                    onClick={() => setRoute("bloodwork-log")}
                    className={cn(ui.btnGhost, "mt-3 text-xs text-[var(--intel)]")}
                  >
                    Get started with labs <ArrowRight className="ml-1 inline h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick actions — full site map */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Quick navigation</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { icon: Droplet, label: "Log Labs", desc: "Upload or manual entry", route: "bloodwork-log" as const, accent: "labs" as const },
            { icon: History, label: "Lab Archive", desc: "Compare past panels", route: "bloodwork-history" as const, accent: "labs" as const },
            { icon: Activity, label: "Lab Analysis", desc: "Scores & flags", route: "bloodwork-insights" as const, accent: "labs" as const },
            { icon: Blocks, label: "Cycle Builder", desc: "Compose your stack", route: "cycle-planner" as const, accent: "protocol" as const },
            { icon: BookOpen, label: "Compound Guides", desc: "Injectables & orals reference", route: "cycle-guides" as const, accent: "protocol" as const },
            { icon: Spline, label: "PK Simulation", desc: "Curves & risk radar", route: "cycle-dashboard" as const, accent: "protocol" as const },
            { icon: Dumbbell, label: "Train", desc: "Active workout logging", route: "gym-workout" as const, accent: "protocol" as const },
            { icon: ClipboardList, label: "Programs", desc: "Routines & templates", route: "gym-routines" as const, accent: "protocol" as const },
            { icon: TrendingUp, label: "Training Stats", desc: "Volume, PRs & charts", route: "gym-progress" as const, accent: "intel" as const },
            { icon: UtensilsCrossed, label: "Food Diary", desc: "Daily macro tracking", route: "nutrition-diary" as const, accent: "intel" as const },
            { icon: Leaf, label: "Micronutrients", desc: "Vitamins & minerals", route: "nutrition-micro" as const, accent: "intel" as const },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              custom={i + 5}
              variants={fade}
              initial="hidden"
              animate="show"
              onClick={() => setRoute(action.route)}
              className={cn(
                ui.card,
                ui.cardHover,
                "group flex items-center gap-3 p-3.5 text-left",
                action.accent === "labs" && "hover:border-[var(--labs)]/30",
                action.accent === "protocol" && "hover:border-[var(--protocol)]/30",
                action.accent === "intel" && "hover:border-[var(--intel)]/30"
              )}
            >
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                action.accent === "labs" && "bg-[var(--labs-dim)] text-[var(--labs)]",
                action.accent === "protocol" && "bg-[var(--protocol-dim)] text-[var(--protocol)]",
                action.accent === "intel" && "bg-[var(--intel-dim)] text-[var(--intel)]"
              )}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">{action.label}</p>
                <p className={ui.sectionSub}>{action.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted-2)] opacity-0 transition group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Highlights row */}
      {(topPR || reports[0] || topRisk) && (
        <div className="grid gap-3 sm:grid-cols-3">
          {topPR && topPRExercise && (
            <div className={cn(ui.cardInner, "flex items-center gap-3 p-4")}>
              <Trophy className="h-5 w-5 text-[var(--warning)]" />
              <div>
                <p className={ui.overline}>Top PR</p>
                <p className="text-sm font-semibold">{topPRExercise.name}</p>
                <p className="text-xs text-[var(--muted)]">{topPR.weight}×{topPR.reps} · est. {topPR.estimated1RM} {weightUnit}</p>
              </div>
            </div>
          )}
          {reports[0] && (
            <div className={cn(ui.cardInner, "flex items-center gap-3 p-4")}>
              <Calendar className="h-5 w-5 text-[var(--labs)]" />
              <div>
                <p className={ui.overline}>Latest panel</p>
                <p className="text-sm font-semibold">{reports[0].name || "Bloodwork"}</p>
                <p className="text-xs text-[var(--muted)]">{format(new Date(reports[0].date), "MMM d, yyyy")}</p>
              </div>
            </div>
          )}
          {topRisk && compounds.length > 0 && (
            <div className={cn(ui.cardInner, "flex items-center gap-3 p-4")}>
              <AlertTriangle className="h-5 w-5" style={{ color: topRisk.color }} />
              <div>
                <p className={ui.overline}>Cycle risk focus</p>
                <p className="text-sm font-semibold">{topRisk.axis}</p>
                <p className="text-xs text-[var(--muted)]">Score {topRisk.score} — review simulation</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}