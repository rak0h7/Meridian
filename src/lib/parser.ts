import { MARKERS } from "./markers";
import type { ExtractedMarker } from "./types";
import { getLabStatus } from "./ranges";
import { normalizeToDefaultUnit } from "./units";

function normalizeAlias(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function findMarker(name: string) {
  const normalized = normalizeAlias(name);
  for (const marker of MARKERS) {
    if (normalizeAlias(marker.name) === normalized) return marker;
    for (const alias of marker.aliases) {
      if (normalizeAlias(alias) === normalized) return marker;
      if (normalized.includes(normalizeAlias(alias)) || normalizeAlias(alias).includes(normalized)) {
        return marker;
      }
    }
  }
  return null;
}

const VALUE_PATTERN =
  /([A-Za-z][A-Za-z0-9\s\-\/\(\)\.]+?)[\s:,]+([<>≤≥]?\s*[\d.,]+)\s*([a-zA-Z%µ\/\^0-9²³]+)?/g;

const DATE_PATTERN = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/;

export function parseLabText(text: string, defaultDate?: string): ExtractedMarker[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const results: ExtractedMarker[] = [];
  const seen = new Set<string>();
  let reportDate = defaultDate ?? new Date().toLocaleDateString("en-GB");

  for (const line of lines) {
    const dateMatch = line.match(DATE_PATTERN);
    if (dateMatch) reportDate = dateMatch[1];

    const patterns = [
      /^(.+?)[\s:,]+([<>≤≥]?\s*[\d.,]+)\s+([a-zA-Z%µ\/\^0-9²³\.]+)$/,
      /^(.+?)[\s:,]+([<>≤≥]?\s*[\d.,]+)$/,
      /(.+?)\s+([<>≤≥]?\s*[\d.,]+)\s+([a-zA-Z%µ\/\^0-9²³\.]+)/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (!match) continue;

      const name = match[1].trim().replace(/^[\-›\s]+/, "");
      const rawValue = match[2].replace(/[<>≤≥\s]/g, "").replace(",", ".");
      const value = parseFloat(rawValue);
      if (isNaN(value)) continue;

      const marker = findMarker(name);
      if (!marker || seen.has(marker.id)) continue;

      const unit = match[3]?.trim() || marker.defaultUnit;
      const normalized = normalizeToDefaultUnit(marker.id, value, unit, marker.defaultUnit);
      const labStatus = getLabStatus(marker, value, unit);

      seen.add(marker.id);
      results.push({
        id: `${marker.id}-${Date.now()}-${results.length}`,
        markerId: marker.id,
        name: marker.name,
        value: normalized.value,
        unit: normalized.unit,
        sourceValue: normalized.sourceValue,
        sourceUnit: normalized.sourceUnit,
        converted: normalized.converted,
        date: reportDate,
        labStatus,
        selected: labStatus !== "lab-normal",
        needsReview: labStatus !== "lab-normal",
      });
      break;
    }
  }

  if (results.length === 0) {
    let match: RegExpExecArray | null;
    const globalPattern = new RegExp(VALUE_PATTERN.source, "g");
    while ((match = globalPattern.exec(text)) !== null) {
      const name = match[1].trim();
      const rawValue = match[2].replace(/[<>≤≥\s]/g, "").replace(",", ".");
      const value = parseFloat(rawValue);
      if (isNaN(value)) continue;

      const marker = findMarker(name);
      if (!marker || seen.has(marker.id)) continue;

      const unit = match[3]?.trim() || marker.defaultUnit;
      const normalized = normalizeToDefaultUnit(marker.id, value, unit, marker.defaultUnit);
      const labStatus = getLabStatus(marker, value, unit);

      seen.add(marker.id);
      results.push({
        id: `${marker.id}-${Date.now()}-${results.length}`,
        markerId: marker.id,
        name: marker.name,
        value: normalized.value,
        unit: normalized.unit,
        sourceValue: normalized.sourceValue,
        sourceUnit: normalized.sourceUnit,
        converted: normalized.converted,
        date: reportDate,
        labStatus,
        selected: true,
        needsReview: labStatus !== "lab-normal",
      });
    }
  }

  return results;
}

export function parseCSV(text: string): ExtractedMarker[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const results: ExtractedMarker[] = [];
  const seen = new Set<string>();
  const reportDate = new Date().toLocaleDateString("en-GB");

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ""));
    if (parts.length < 2) continue;
    if (i === 0 && /marker|test|name/i.test(parts[0])) continue;

    const name = parts[0];
    const rawValue = parts[1].replace(",", ".");
    const value = parseFloat(rawValue);
    if (isNaN(value)) continue;

    const marker = findMarker(name);
    if (!marker || seen.has(marker.id)) continue;

    const unit = parts[2] || marker.defaultUnit;
    const normalized = normalizeToDefaultUnit(marker.id, value, unit, marker.defaultUnit);
    const labStatus = getLabStatus(marker, value, unit);

    seen.add(marker.id);
    results.push({
      id: `${marker.id}-${Date.now()}-${results.length}`,
      markerId: marker.id,
      name: marker.name,
      value: normalized.value,
      unit: normalized.unit,
      sourceValue: normalized.sourceValue,
      sourceUnit: normalized.sourceUnit,
      converted: normalized.converted,
      date: parts[3] || reportDate,
      labStatus,
      selected: true,
    });
  }

  return results;
}

export const SAMPLE_LAB_TEXT = `Testosterone, Total: 850 ng/dL
Estradiol: 42 pg/mL
ALT: 35 U/L
Hematocrit: 45.1 %
Hemoglobin: 15.2 g/dL
Platelets: 265 K/µL
WBC Count: 6.80 K/µL
Creatinine: 0.92 mg/dL
LDL Cholesterol: 95 mg/dL
HDL Cholesterol: 55 mg/dL
Triglycerides: 110 mg/dL
Fasting Glucose: 88 mg/dL`;

export const DEMO_LAB_TEXT = `Albumin: 4.00 g/dL
ALP: 98.0 U/L
ALT: 145 U/L
Anion Gap: 12.0 mEq/L
AST: 88.0 U/L
Basophils (abs): 0.10 x10^9/L
Bicarbonate / CO2: 29.0 mmol/L
Bilirubin (Total): 0.58 mg/dL
Chloride: 103 mmol/L
Chol/HDL Ratio: 5.78 ratio
Creatinine: 1.64 mg/dL
eGFR: 55.0 mL/min/1.73m²
Eosinophils (abs): 0.30 x10^9/L
Fasting Glucose: 82.9 mg/dL
GGT: 92.0 U/L
Globulin: 2.90 g/dL
HDL Cholesterol: 38.7 mg/dL
Hematocrit: 57.0 %
Hemoglobin: 17.8 g/dL
LDL Cholesterol: 147 mg/dL
Lymphocytes (abs): 2.80 x10^9/L
MCH: 29.0 pg
MCHC: 35.5 g/dL
MCV: 88.0 fL
Monocytes (abs): 0.70 x10^9/L
Neutrophils (abs): 9.40 x10^9/L
Non-HDL Cholesterol: 182 mg/dL
Platelets: 610 x10^9/L
Potassium: 4.60 mmol/L
RBC Count: 6.10 x10^12/L
RDW: 13.2 %
Sodium: 139 mmol/L
Total Cholesterol: 220 mg/dL
Total Protein: 6.90 g/dL
Triglycerides: 221 mg/dL
Urea: 5.70 mmol/L
WBC Count: 13.2 x10^9/L
Total Testosterone: 1500 ng/dL
Free Testosterone: 433 pg/mL
Estradiol: 49.0 pg/mL`;