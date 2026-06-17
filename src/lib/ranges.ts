import { MARKER_MAP } from "./markers";
import type { MarkerDefinition, MarkerRange, RangeMode, ReviewFlag, Severity } from "./types";
import { normalizeToDefaultUnit } from "./units";

export function formatRange(range: MarkerRange, mode: RangeMode, type: "lab" | "optimal" | "caution"): string {
  const useOptimal = mode === "optimized";
  if (type === "lab") {
    if (range.upperOnly) return `<${range.labMax} `;
    if (range.lowerOnly) return `>${range.labMin} `;
    return `${range.labMin}-${range.labMax} `;
  }
  if (type === "optimal") {
    if (range.upperOnly) return `<${useOptimal ? range.optimalMax : range.labMax} `;
    if (range.lowerOnly) return `>${useOptimal ? range.optimalMin : range.labMin} `;
    const min = useOptimal ? range.optimalMin : range.labMin;
    const max = useOptimal ? range.optimalMax : range.labMax;
    return `${min}-${max} `;
  }
  if (range.cautionMin !== undefined && range.cautionMax !== undefined) {
    return `${range.cautionMin}-${range.cautionMax} `;
  }
  return "";
}

export function getLabStatus(
  marker: MarkerDefinition,
  value: number,
  unit: string
): "lab-normal" | "high" | "low" {
  const normalized = normalizeToDefaultUnit(marker.id, value, unit, marker.defaultUnit);
  const v = normalized.value;
  const r = marker.range;

  if (r.upperOnly && r.labMax !== undefined && v > r.labMax) return "high";
  if (r.lowerOnly && r.labMin !== undefined && v < r.labMin) return "low";
  if (r.labMin !== undefined && v < r.labMin) return "low";
  if (r.labMax !== undefined && v > r.labMax) return "high";
  return "lab-normal";
}

export function evaluateSeverity(
  marker: MarkerDefinition,
  value: number,
  unit: string,
  mode: RangeMode
): { severity: Severity; deviation: string; isHigh: boolean; isLow: boolean } {
  const normalized = normalizeToDefaultUnit(marker.id, value, unit, marker.defaultUnit);
  const v = normalized.value;
  const r = marker.range;
  const useOptimal = mode === "optimized";

  const optMin = useOptimal ? r.optimalMin : r.labMin;
  const optMax = useOptimal ? r.optimalMax : r.labMax;

  let severity: Severity = "normal";
  let deviation = "";
  let isHigh = false;
  let isLow = false;

  if (r.upperOnly && optMax !== undefined && v > optMax) {
    isHigh = true;
    const diff = v - optMax;
    const pct = Math.round((diff / optMax) * 100);
    deviation = `↑ ${diff.toFixed(1)} ${marker.defaultUnit} above optimal max (×${(v / optMax).toFixed(2)})`;

    if (r.strictThreshold && v >= r.strictThreshold) {
      severity = "stop";
      deviation += " above strict app threshold";
    } else if (r.cautionMax && v > r.cautionMax) {
      severity = "high";
      deviation += " above strict app threshold";
    } else if (r.cautionMin && v >= r.cautionMin) {
      severity = "yellow";
      deviation += " in app caution band";
    } else {
      severity = "yellow";
    }
    deviation += ` (+${pct}%)`;
  } else if (r.lowerOnly && optMin !== undefined && v < optMin) {
    isLow = true;
    const diff = optMin - v;
    const pct = Math.round((diff / optMin) * 100);
    deviation = `↓ ${diff.toFixed(1)} ${marker.defaultUnit} below optimal min (×${(v / optMin).toFixed(2)}) (+${pct}%)`;
    severity = r.strictThreshold && v <= r.strictThreshold ? "stop" : "low";
  } else if (optMin !== undefined && v < optMin) {
    isLow = true;
    const diff = optMin - v;
    deviation = `↓ ${diff.toFixed(1)} ${marker.defaultUnit} below optimal min`;
    severity = "low";
  } else if (optMax !== undefined && v > optMax) {
    isHigh = true;
    const diff = v - optMax;
    const pct = Math.round((diff / optMax) * 100);
    deviation = `↑ ${diff.toFixed(1)} ${marker.defaultUnit} above optimal max (×${(v / optMax).toFixed(2)}) (+${pct}%)`;

    if (r.strictThreshold && v >= r.strictThreshold) {
      severity = "stop";
      deviation += " above strict app threshold";
    } else if (r.cautionMin !== undefined && r.cautionMax !== undefined && v >= r.cautionMin && v <= r.cautionMax) {
      severity = "yellow";
      deviation += " in app caution band";
    } else if (r.cautionMax && v > r.cautionMax) {
      severity = "high";
    } else {
      severity = "yellow";
    }
  }

  return { severity, deviation, isHigh, isLow };
}

export function buildReviewFlags(
  values: { markerId: string; value: number; unit: string; sourceValue?: number; sourceUnit?: string }[],
  date: string,
  mode: RangeMode
): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  for (const val of values) {
    const marker = MARKER_MAP.get(val.markerId);
    if (!marker) continue;

    const { severity, deviation } = evaluateSeverity(marker, val.value, val.unit, mode);
    if (severity === "normal") continue;

    const normalized = normalizeToDefaultUnit(marker.id, val.value, val.unit, marker.defaultUnit);
    const labRange = formatRange(marker.range, "lab", "lab") + marker.defaultUnit;
    const optimalRange = formatRange(marker.range, mode, "optimal") + marker.defaultUnit;
    const cautionRange =
      marker.range.cautionMin !== undefined
        ? formatRange(marker.range, mode, "caution") + marker.defaultUnit
        : undefined;

    flags.push({
      markerId: marker.id,
      name: marker.name,
      value: normalized.value,
      unit: marker.defaultUnit,
      sourceValue: normalized.sourceValue,
      sourceUnit: normalized.sourceUnit,
      date,
      severity,
      labRange: labRange.trim(),
      optimalRange: optimalRange.trim(),
      cautionRange: cautionRange?.trim(),
      strictThreshold: marker.range.strictThreshold,
      deviation,
      noDosing: true,
    });
  }

  const order: Severity[] = ["stop", "high", "yellow", "low"];
  return flags.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
}