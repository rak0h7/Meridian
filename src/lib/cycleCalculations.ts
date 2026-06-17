import { differenceInDays, addWeeks, addDays } from "date-fns";
import type { CycleCompound } from "@/lib/cycleTypes";
import { getCompoundById } from "@/data/compounds";
import type { FrequencyPattern } from "@/data/frequencies";

export interface CycleStats {
  weeks: number;
  days: number;
  monthsApprox: string;
  compoundCount: number;
  anabolicCount: number;
  peptideCount: number;
  ancillaryCount: number;
  totalDoses: number;
  injections: number;
  oralDoses: number;
  topicalApps: number;
  avgMgPerWeek: number;
}

function dosesPerWeek(freq: FrequencyPattern): number {
  switch (freq) {
    case "daily": return 7;
    case "eod": return 3.5;
    case "2x-weekly": return 2;
    case "weekly": return 1;
    case "bid": return 14;
    case "pre-workout": return 5;
    default: return 1;
  }
}

function shouldDoseOnDay(freq: FrequencyPattern, dayIndex: number, dayOfWeek: number): boolean {
  switch (freq) {
    case "daily":
    case "bid":
      return true;
    case "eod":
      return dayIndex % 2 === 0;
    case "2x-weekly":
      return dayOfWeek === 1 || dayOfWeek === 4;
    case "weekly":
      return dayOfWeek === 1;
    case "pre-workout":
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    default:
      return dayIndex % 3 === 0;
  }
}

export function formatDose(doseMg: number, unit: string): string {
  if (unit === "mcg") return doseMg < 1 ? `${doseMg * 1000}mcg` : `${doseMg}mcg`;
  if (unit === "iu") return `${doseMg}iu`;
  return doseMg < 1 ? `${doseMg * 1000}mcg` : `${doseMg}mg`;
}

export function hasAnabolicCompounds(compounds: CycleCompound[]): boolean {
  return compounds.some((cc) => getCompoundById(cc.compoundId)?.category === "anabolics");
}

export function hasHepatotoxicOrals(compounds: CycleCompound[]): boolean {
  return compounds.some((cc) => getCompoundById(cc.compoundId)?.hepatotoxic === true);
}

export function calculateStats(compounds: CycleCompound[], weeks: number): CycleStats {
  const days = weeks * 7;
  let injections = 0;
  let oralDoses = 0;
  let topicalApps = 0;
  let totalMg = 0;
  let anabolicCount = 0;
  let peptideCount = 0;
  let ancillaryCount = 0;

  compounds.forEach((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound) return;

    const activeWeeks = cc.activeWeeks[1] - cc.activeWeeks[0] + 1;
    const dosesWeek = dosesPerWeek(cc.frequency);

    if (compound.category === "anabolics") anabolicCount++;
    else if (compound.category === "peptides") peptideCount++;
    else ancillaryCount++;

    totalMg += cc.doseMg * dosesWeek * activeWeeks;

    const total = Math.round(dosesWeek * activeWeeks);
    if (cc.route === "injectable") injections += total;
    else if (cc.route === "oral") oralDoses += cc.frequency === "bid" ? total * 2 : total;
    else topicalApps += total;
  });

  return {
    weeks,
    days,
    monthsApprox: (weeks / 4.33).toFixed(1),
    compoundCount: compounds.length,
    anabolicCount,
    peptideCount,
    ancillaryCount,
    totalDoses: injections + oralDoses + topicalApps,
    injections,
    oralDoses,
    topicalApps,
    avgMgPerWeek: weeks > 0 ? Math.round(totalMg / weeks) : 0,
  };
}

export function getIntensityScore(compounds: CycleCompound[]): number {
  if (compounds.length === 0) return 0;
  let score = 0;
  compounds.forEach((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound) return;
    score += (compound.pkMultiplier ?? 0.5) * (cc.doseMg / 100) * dosesPerWeek(cc.frequency);
  });
  if (score < 3) return 1;
  if (score < 8) return 2;
  if (score < 15) return 3;
  if (score < 30) return 4;
  return 5;
}

export function getIntensityLabel(score: number): string {
  const labels = ["", "mild", "moderate", "heavy", "blast", "nuclear"];
  return labels[score] ?? "";
}

export function calculatePctBegin(endDate: Date, compounds: CycleCompound[]): Date | null {
  if (!hasAnabolicCompounds(compounds)) return null;
  let maxClearanceDays = 14;
  compounds.forEach((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound || compound.category !== "anabolics") return;
    const hl = compound.halfLife ?? 1;
    const clearanceDays = Math.ceil(hl * 7 * 5);
    maxClearanceDays = Math.max(maxClearanceDays, clearanceDays);
  });
  return addDays(endDate, maxClearanceDays);
}

export function generateDosesForDay(
  date: Date,
  startDate: Date,
  compounds: CycleCompound[]
): { name: string; dose: string; color: string }[] {
  const dayIndex = differenceInDays(date, startDate);
  if (dayIndex < 0) return [];

  const weekNum = Math.floor(dayIndex / 7) + 1;
  const dayOfWeek = date.getDay();
  const doses: { name: string; dose: string; color: string }[] = [];

  compounds.forEach((cc) => {
    if (weekNum < cc.activeWeeks[0] || weekNum > cc.activeWeeks[1]) return;
    const compound = getCompoundById(cc.compoundId);
    if (!compound) return;

    if (shouldDoseOnDay(cc.frequency, dayIndex, dayOfWeek)) {
      doses.push({
        name: compound.shortName,
        dose: formatDose(cc.doseMg, compound.unit),
        color: compound.color,
      });
      if (cc.frequency === "bid") {
        doses.push({
          name: compound.shortName,
          dose: `${formatDose(cc.doseMg, compound.unit)} PM`,
          color: compound.color,
        });
      }
    }
  });

  return doses;
}

export function getDayIntensity(date: Date, startDate: Date, compounds: CycleCompound[]): number {
  const doses = generateDosesForDay(date, startDate, compounds);
  if (doses.length === 0) return 0;
  let load = 0;
  compounds.forEach((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound) return;
    const weekNum = Math.floor(differenceInDays(date, startDate) / 7) + 1;
    if (weekNum < cc.activeWeeks[0] || weekNum > cc.activeWeeks[1]) return;
    if (shouldDoseOnDay(cc.frequency, differenceInDays(date, startDate), date.getDay())) {
      load += cc.doseMg * (compound.pkMultiplier ?? 0.5);
    }
  });
  if (load < 50) return 1;
  if (load < 150) return 2;
  if (load < 300) return 3;
  if (load < 500) return 4;
  return 5;
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startPad = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function generatePKData(weeks: number, compounds: CycleCompound[]) {
  const data: { week: string; [key: string]: string | number }[] = [];
  for (let w = 0; w <= weeks; w++) {
    const point: { week: string; [key: string]: string | number } = { week: `W${w}` };
    compounds.forEach((cc) => {
      const compound = getCompoundById(cc.compoundId);
      if (!compound) return;
      const hl = compound.halfLife ?? 1;
      const inActive = w >= cc.activeWeeks[0] && w <= cc.activeWeeks[1];
      const weeksSinceStart = Math.max(0, w - cc.activeWeeks[0] + 1);
      const accumulation = inActive
        ? cc.doseMg * (compound.pkMultiplier ?? 1) * (1 - Math.exp(-weeksSinceStart / hl))
        : cc.doseMg * (compound.pkMultiplier ?? 1) * Math.exp(-(w - cc.activeWeeks[1]) / hl) * 0.5;
      point[compound.id] = Math.max(0, Math.round(accumulation * 10) / 10);
    });
    data.push(point);
  }
  return data;
}

export interface PKCardData {
  id: string;
  short: string;
  peak: number;
  steady: number;
  peakW: string;
  steadyW: string;
  color: string;
}

export function generatePKCards(weeks: number, compounds: CycleCompound[]): PKCardData[] {
  const data = generatePKData(weeks, compounds);
  return compounds.map((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound) return null;
    const values = data.map((d) => (d[compound.id] as number) ?? 0);
    const peak = Math.max(...values);
    const peakIdx = values.indexOf(peak);
    const tail = values.slice(cc.activeWeeks[1]);
    const steady = tail.length > 0 ? tail[Math.floor(tail.length / 2)] : 0;
    return {
      id: compound.id,
      short: compound.shortName,
      peak: Math.round(peak * 10) / 10,
      steady: Math.round(steady * 10) / 10,
      peakW: `W${peakIdx}`,
      steadyW: `W${cc.activeWeeks[1]}`,
      color: compound.color,
    };
  }).filter((c): c is PKCardData => c !== null);
}

export function generateStackedLoadData(weeks: number, compounds: CycleCompound[]) {
  const data: { week: string; anabolics: number; estrogen: number; health: number; supplements: number; total: number }[] = [];
  for (let w = 0; w <= weeks; w++) {
    let anabolics = 0;
    let estrogen = 0;
    let health = 0;
    let supplements = 0;
    compounds.forEach((cc) => {
      if (w < cc.activeWeeks[0] || w > cc.activeWeeks[1]) return;
      const compound = getCompoundById(cc.compoundId);
      if (!compound) return;
      const load = cc.doseMg * (compound.pkMultiplier ?? 0.5) * dosesPerWeek(cc.frequency) / 10;
      if (compound.category === "anabolics") anabolics += load;
      else if (compound.category === "estrogen") estrogen += load;
      else if (compound.category === "peptides") supplements += load;
      else health += load;
    });
    const spike = w > 0 ? 1 + Math.sin(w * 2.5) * 0.5 : 1;
    const a = Math.round(anabolics * spike * 10) / 10;
    data.push({
      week: `W${w}`,
      anabolics: a,
      estrogen: Math.round(estrogen * 10) / 10,
      health: Math.round(health * 10) / 10,
      supplements: Math.round(supplements * 10) / 10,
      total: Math.round((a + estrogen + health + supplements) * 10) / 10,
    });
  }
  return data;
}

export interface RiskAxis {
  axis: string;
  value: number;
  score: number;
  contributors: string;
  color: string;
}

export function calculateRiskProfile(compounds: CycleCompound[]): RiskAxis[] {
  const risks: Record<string, { score: number; contributors: string[] }> = {
    HEPATIC: { score: 0, contributors: [] },
    CARDIO: { score: 0, contributors: [] },
    NEURO: { score: 0, contributors: [] },
    ENDOCRINE: { score: 0, contributors: [] },
    DERM: { score: 0, contributors: [] },
    METABOLIC: { score: 0, contributors: [] },
  };

  compounds.forEach((cc) => {
    const compound = getCompoundById(cc.compoundId);
    if (!compound || compound.category !== "anabolics") return;
    const load = cc.doseMg * (compound.pkMultiplier ?? 1) * dosesPerWeek(cc.frequency) / 100;

    if (compound.hepatotoxic) {
      risks.HEPATIC.score += load * 3;
      risks.HEPATIC.contributors.push(compound.shortName);
    }
    if (compound.tags.includes("19-nor") || compound.id.includes("tren")) {
      risks.CARDIO.score += load * 2;
      risks.NEURO.score += load * 2.5;
      risks.ENDOCRINE.score += load * 2;
      risks.CARDIO.contributors.push(compound.shortName);
      risks.NEURO.contributors.push(compound.shortName);
    }
    if (compound.tags.includes("DHT") || compound.id === "halo") {
      risks.DERM.score += load * 1.5;
      risks.DERM.contributors.push(compound.shortName);
    }
    if (compound.route === "oral" && compound.category === "anabolics") {
      risks.HEPATIC.score += load * 2;
      risks.METABOLIC.score += load * 1.5;
      risks.METABOLIC.contributors.push(compound.shortName);
    }
    risks.ENDOCRINE.score += load;
    risks.ENDOCRINE.contributors.push(compound.shortName);
  });

  const colors: Record<string, string> = {
    HEPATIC: "#eab308", CARDIO: "#ef4444", NEURO: "#a855f7",
    ENDOCRINE: "#ec4899", DERM: "#00d4e8", METABOLIC: "#f97316",
  };

  return Object.entries(risks).map(([axis, data]) => {
    const score = Math.min(20, Math.round(data.score * 10) / 10);
    return {
      axis,
      value: Math.min(100, score * 5),
      score,
      contributors: data.contributors.slice(0, 3).join(", ") || "—",
      color: colors[axis],
    };
  });
}

export function getCycleEndDate(startDate: Date, weeks: number) {
  return addWeeks(startDate, weeks);
}