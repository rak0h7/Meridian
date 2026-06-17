import { CATEGORY_INSIGHT_LABELS, CATEGORY_ORDER, MARKER_MAP, MARKERS_BY_CATEGORY } from "./markers";
import type { CategoryScore, MarkerValue, RangeMode } from "./types";
import { evaluateSeverity } from "./ranges";

function statusFromScore(score: number | null, assessed: number): string {
  if (assessed === 0 || score === null) return "Not assessed";
  if (score >= 90) return "Optimal";
  if (score >= 75) return "Mostly clean";
  if (score >= 60) return "Multiple concerns";
  return "Critical";
}

function severityPenalty(severity: string): number {
  switch (severity) {
    case "stop": return 40;
    case "high": return 25;
    case "yellow": return 12;
    case "low": return 15;
    default: return 0;
  }
}

export function calculateCategoryScores(
  values: Record<string, MarkerValue>,
  mode: RangeMode
): CategoryScore[] {
  return CATEGORY_ORDER.map((category) => {
    const markers = MARKERS_BY_CATEGORY[category] || [];
    const assessed = markers.filter((m) => values[m.id] !== undefined).length;
    const tags: CategoryScore["tags"] = [];
    let penalty = 0;
    let stopCount = 0;
    let yellowCount = 0;

    for (const marker of markers) {
      const val = values[marker.id];
      if (!val) continue;
      const { severity } = evaluateSeverity(marker, val.value, val.unit, mode);
      penalty += severityPenalty(severity);
      if (severity === "stop") {
        stopCount++;
        tags.push({ label: `${stopCount} STOP`, type: "stop" });
      } else if (severity === "yellow" || severity === "high") {
        yellowCount++;
      }
    }

    if (yellowCount > 0) tags.push({ label: `${yellowCount} CAUT`, type: "caut" });
    if (assessed > 0 && penalty < 10) tags.push({ label: "1 EASY", type: "easy" });
    if (assessed > 0 && penalty >= 10 && penalty < 30) tags.push({ label: "1 STEP", type: "step" });

    const score = assessed === 0 ? null : Math.max(0, Math.min(100, 100 - penalty / Math.max(assessed, 1)));

    return {
      category,
      label: CATEGORY_INSIGHT_LABELS[category],
      score: score !== null ? Math.round(score) : null,
      status: statusFromScore(score !== null ? Math.round(score) : null, assessed),
      assessed,
      total: markers.length,
      tags: tags.slice(0, 3),
    };
  });
}

export function calculateOverallScore(categories: CategoryScore[]): { score: number; status: string } {
  const scored = categories.filter((c) => c.score !== null);
  if (scored.length === 0) return { score: 0, status: "Not assessed" };

  const total = scored.reduce((sum, c) => sum + (c.score ?? 0), 0);
  const score = Math.round(total / scored.length);
  return { score, status: statusFromScore(score, scored.length) };
}

export function valuesFromRecord(values: Record<string, MarkerValue>): MarkerValue[] {
  return Object.values(values);
}