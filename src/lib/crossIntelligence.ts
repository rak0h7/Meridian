import { getCompoundById } from "@/data/compounds";
import type { CycleCompound } from "@/lib/cycleTypes";
import { calculateRiskProfile, hasHepatotoxicOrals } from "@/lib/cycleCalculations";
import type { AppRoute } from "@/context/NavigationContext";
import type { MarkerValue, ReviewFlag } from "@/lib/types";
import { macroSummary, pctOfGoal, sumNutrients } from "@/lib/nutritionCalculations";
import type { FoodLogEntry } from "@/lib/nutritionTypes";

export interface NutritionSnapshot {
  goals: Record<string, number>;
  todayLog: FoodLogEntry[];
  daysLogged?: number;
}

export type CrossAlertSeverity = "critical" | "warning" | "info";

export interface CrossAlert {
  id: string;
  severity: CrossAlertSeverity;
  title: string;
  message: string;
  recommendation: string;
  route: AppRoute;
  markers?: string[];
  compounds?: string[];
}

function hasMarker(values: Record<string, MarkerValue>, id: string): MarkerValue | undefined {
  return values[id];
}

function flagForMarker(flags: ReviewFlag[], id: string): ReviewFlag | undefined {
  return flags.find((f) => f.markerId === id);
}

function hasAromatizer(compounds: CycleCompound[]): boolean {
  return compounds.some((c) => {
    const compound = getCompoundById(c.compoundId);
    return compound?.tags.includes("Test") || compound?.id.startsWith("test-");
  });
}

function hasEstrogenControl(compounds: CycleCompound[]): boolean {
  return compounds.some((c) => getCompoundById(c.compoundId)?.category === "estrogen");
}

function has19Nor(compounds: CycleCompound[]): boolean {
  return compounds.some((c) => getCompoundById(c.compoundId)?.tags.includes("19-nor"));
}

function hasLiverSupport(compounds: CycleCompound[]): boolean {
  return compounds.some((c) => ["tudca", "nac", "udca"].includes(c.compoundId));
}

export function generateCrossAlerts(
  values: Record<string, MarkerValue>,
  flags: ReviewFlag[],
  compounds: CycleCompound[],
  nutrition?: NutritionSnapshot,
  trainingSessions30d?: number
): CrossAlert[] {
  const alerts: CrossAlert[] = [];

  if (compounds.length === 0 && Object.keys(values).length === 0 && !nutrition) return alerts;

  const hepatotoxic = hasHepatotoxicOrals(compounds);
  const altFlag = flagForMarker(flags, "alt");
  const astFlag = flagForMarker(flags, "ast");
  const ggtFlag = flagForMarker(flags, "ggt");

  if (hepatotoxic && (altFlag || astFlag || ggtFlag)) {
    const sev = [altFlag, astFlag, ggtFlag].some((f) => f?.severity === "stop" || f?.severity === "high")
      ? "critical" as const
      : "warning" as const;
    alerts.push({
      id: "liver-hepatotoxic",
      severity: sev,
      title: "Liver stress + hepatotoxic orals",
      message: "Elevated liver enzymes detected while running hepatotoxic oral compounds.",
      recommendation: "Add TUDCA/NAC, reduce oral dose, or pause orals until enzymes normalize.",
      route: "cycle-planner",
      markers: ["alt", "ast", "ggt"].filter((m) => values[m]),
      compounds: compounds.filter((c) => getCompoundById(c.compoundId)?.hepatotoxic).map((c) => c.compoundId),
    });
  } else if (hepatotoxic && !hasLiverSupport(compounds)) {
    alerts.push({
      id: "liver-no-support",
      severity: "warning",
      title: "Hepatotoxic stack without liver support",
      message: "Your cycle includes oral hepatotoxic compounds but no liver support ancillary.",
      recommendation: "Consider adding TUDCA (500mg daily) or NAC (600mg daily) to your stack.",
      route: "cycle-planner",
      compounds: compounds.filter((c) => getCompoundById(c.compoundId)?.hepatotoxic).map((c) => c.compoundId),
    });
  }

  const hctFlag = flagForMarker(flags, "hematocrit");
  const hgbFlag = flagForMarker(flags, "hemoglobin");
  if ((hctFlag || hgbFlag) && compounds.length > 0) {
    const sev = hctFlag?.severity === "stop" || hctFlag?.severity === "high" ? "critical" : "warning";
    alerts.push({
      id: "polycythemia",
      severity: sev,
      title: "Elevated hematocrit / hemoglobin",
      message: "Polycythemia risk is elevated — common with testosterone and EQ cycles.",
      recommendation: "Schedule therapeutic phlebotomy, increase cardio, and monitor CBC weekly.",
      route: "bloodwork-insights",
      markers: ["hematocrit", "hemoglobin"].filter((m) => values[m]),
    });
  }

  const e2Flag = flagForMarker(flags, "estradiol");
  if (e2Flag && hasAromatizer(compounds) && !hasEstrogenControl(compounds)) {
    alerts.push({
      id: "e2-no-ai",
      severity: e2Flag.severity === "stop" || e2Flag.severity === "high" ? "critical" : "warning",
      title: "High estradiol without AI on stack",
      message: "Estradiol is flagged while running aromatizing compounds with no estrogen control.",
      recommendation: "Add Aromasin or Arimidex to your cycle planner stack.",
      route: "cycle-planner",
      markers: ["estradiol"],
    });
  }

  const prolactinFlag = flagForMarker(flags, "prolactin");
  if (prolactinFlag && has19Nor(compounds)) {
    alerts.push({
      id: "prolactin-19nor",
      severity: prolactinFlag.severity === "stop" ? "critical" : "warning",
      title: "Prolactin elevation on 19-nor stack",
      message: "19-nor compounds (Deca/NPP/Tren) commonly elevate prolactin.",
      recommendation: "Consider Cabergoline (0.25mg 2x/week) and monitor prolactin every 4–6 weeks.",
      route: "cycle-planner",
      markers: ["prolactin"],
      compounds: compounds.filter((c) => getCompoundById(c.compoundId)?.tags.includes("19-nor")).map((c) => c.compoundId),
    });
  }

  const ldlFlag = flagForMarker(flags, "ldl");
  const hdlFlag = flagForMarker(flags, "hdl");
  const riskProfile = calculateRiskProfile(compounds);
  const cardioRisk = riskProfile.find((r) => r.axis === "CARDIO");

  if ((ldlFlag || hdlFlag) && cardioRisk && cardioRisk.score > 3) {
    alerts.push({
      id: "lipids-cardio",
      severity: ldlFlag?.severity === "stop" || hdlFlag?.severity === "high" ? "critical" : "warning",
      title: "Lipid panel + cardiovascular load",
      message: "Lipid markers are flagged while your cycle carries elevated cardiovascular risk.",
      recommendation: "Add omega-3, citrus bergamot, increase cardio. Consider reducing tren/oral load.",
      route: "cycle-dashboard",
      markers: ["ldl", "hdl", "triglycerides"].filter((m) => values[m]),
    });
  }

  const creatFlag = flagForMarker(flags, "creatinine");
  const egfrVal = hasMarker(values, "egfr");
  if (creatFlag && compounds.length >= 3) {
    alerts.push({
      id: "kidney-load",
      severity: "warning",
      title: "Kidney markers under multi-compound load",
      message: "Creatinine is flagged with a complex multi-compound cycle running.",
      recommendation: "Increase hydration, monitor eGFR, and avoid NSAIDs during cycle.",
      route: "bloodwork-insights",
      markers: ["creatinine", "egfr"].filter((m) => values[m] || egfrVal),
    });
  }

  if (compounds.length > 0 && Object.keys(values).length === 0) {
    alerts.push({
      id: "no-bloodwork",
      severity: "info",
      title: "Cycle active — no bloodwork logged",
      message: "You have compounds configured but no lab values on file.",
      recommendation: "Log a baseline blood panel before starting your cycle.",
      route: "bloodwork-log",
    });
  }

  if (Object.keys(values).length > 0 && compounds.length === 0) {
    alerts.push({
      id: "no-cycle",
      severity: "info",
      title: "Bloodwork logged — no cycle planned",
      message: "Lab values are on file. Plan your cycle to get cross-module risk analysis.",
      recommendation: "Open the cycle planner to build your stack and see PK projections.",
      route: "cycle-planner",
    });
  }

  if (nutrition) {
    const totals = sumNutrients(nutrition.todayLog, true);
    const macros = macroSummary(totals);
    const proteinGoal = nutrition.goals.protein ?? 165;
    const proteinPct = pctOfGoal(macros.protein, proteinGoal);

    if (trainingSessions30d && trainingSessions30d >= 8 && proteinPct < 70) {
      alerts.push({
        id: "protein-training",
        severity: "warning",
        title: "Protein intake below target with active training",
        message: `Today's protein is ${macros.protein}g (${proteinPct}% of ${proteinGoal}g goal) while you're training regularly.`,
        recommendation: "Increase lean protein across meals or adjust your protein goal in Nutrition Goals.",
        route: "nutrition-diary",
      });
    }

    const ferritinFlag = flagForMarker(flags, "ferritin");
    const ironIntake = totals.iron ?? 0;
    const ironGoal = nutrition.goals.iron ?? 18;
    if (ferritinFlag && ironIntake < ironGoal * 0.5) {
      alerts.push({
        id: "iron-ferritin",
        severity: ferritinFlag.severity === "stop" ? "critical" : "warning",
        title: "Low iron intake with flagged ferritin",
        message: `Ferritin is flagged on labs while today's iron intake is only ${ironIntake.toFixed(1)}mg.`,
        recommendation: "Prioritize iron-rich foods (red meat, spinach, legumes) and pair with vitamin C.",
        route: "nutrition-micro",
        markers: ["ferritin"],
      });
    }

    const sodiumIntake = totals.sodium ?? 0;
    const sodiumGoal = nutrition.goals.sodium ?? 2300;
    if (sodiumIntake > sodiumGoal * 1.25) {
      const bpFlag = flagForMarker(flags, "bloodPressureSystolic") ?? flagForMarker(flags, "bloodPressureDiastolic");
      alerts.push({
        id: "sodium-high",
        severity: bpFlag ? "warning" : "info",
        title: "Sodium intake above daily target",
        message: `Today's sodium is ${Math.round(sodiumIntake)}mg vs a ${sodiumGoal}mg reference.`,
        recommendation: "Reduce processed foods and track sodium in the micronutrient view.",
        route: "nutrition-micro",
        markers: bpFlag ? ["bloodPressureSystolic", "bloodPressureDiastolic"].filter((m) => values[m]) : undefined,
      });
    }

    const vitDIntake = totals.vitaminD ?? 0;
    const vitDFlag = flagForMarker(flags, "vitaminD");
    if (vitDFlag && vitDIntake < (nutrition.goals.vitaminD ?? 20) * 0.4) {
      alerts.push({
        id: "vitd-labs",
        severity: "warning",
        title: "Low vitamin D intake with flagged labs",
        message: "Vitamin D is low on your panel and today's food log shows minimal dietary vitamin D.",
        recommendation: "Add fatty fish, fortified dairy, or discuss supplementation with your provider.",
        route: "nutrition-search",
        markers: ["vitaminD"],
      });
    }

    if (hepatotoxic && (totals.protein ?? 0) < proteinGoal * 0.6) {
      alerts.push({
        id: "liver-protein",
        severity: "info",
        title: "Hepatotoxic stack — adequate protein supports recovery",
        message: "Running oral hepatotoxic compounds while protein intake is under target today.",
        recommendation: "Hit your protein goal to support liver repair alongside TUDCA/NAC.",
        route: "nutrition-diary",
      });
    }

    const daysLogged = nutrition.daysLogged ?? 0;
    if (daysLogged === 0 && (trainingSessions30d ?? 0) > 0) {
      alerts.push({
        id: "nutrition-not-started",
        severity: "info",
        title: "Training logged — nutrition not tracked yet",
        message: "You're logging workouts but haven't started a food diary.",
        recommendation: "Open the diary to log today's meals and connect intake with training load.",
        route: "nutrition-diary",
      });
    }
  }

  const severityOrder: Record<CrossAlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}