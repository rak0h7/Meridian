const CONVERSIONS: Record<string, Record<string, number>> = {
  "total-testosterone": { "nmol/L": 0.0347 },
  "free-testosterone": { "pmol/L": 0.288 },
  "estradiol": { "pmol/L": 0.272 },
  "hematocrit": { "L/L": 100 },
  "rbc": { "x10^12/L": 1, "x10^6/µL": 1 },
  "platelets": { "x10^9/L": 1, "x10^3/µL": 1 },
  "wbc": { "x10^9/L": 1, "x10^3/µL": 1 },
  "neutrophils": { "x10^9/L": 1 },
  "lymphocytes": { "x10^9/L": 1 },
  "monocytes": { "x10^9/L": 1 },
  "eosinophils": { "x10^9/L": 1 },
  "basophils": { "x10^9/L": 1 },
  "ldl": { "mmol/L": 38.67 },
  "hdl": { "mmol/L": 38.67 },
  "triglycerides": { "mmol/L": 88.57 },
  "non-hdl": { "mmol/L": 38.67 },
  "total-cholesterol": { "mmol/L": 38.67 },
  "creatinine": { "µmol/L": 0.0113 },
  "urea": { "mmol/L": 2.8 },
  "fasting-glucose": { "mmol/L": 18.018 },
  "albumin": { "g/L": 0.1 },
  "total-protein": { "g/L": 0.1 },
  "globulin": { "g/L": 0.1 },
  "bilirubin-total": { "µmol/L": 0.0585 },
  "vitamin-d": { "nmol/L": 0.4 },
  "calcium": { "mmol/L": 4.0 },
  "calcium-corrected": { "mmol/L": 4.0 },
  "uric-acid": { "µmol/L": 0.0168 },
  "dhea-s": { "µmol/L": 0.0271 },
  "dht": { "nmol/L": 0.0347 },
  "progesterone": { "nmol/L": 3.18 },
  "cortisol-am": { "nmol/L": 0.0362 },
  "iron": { "µmol/L": 0.179 },
  "b12": { "pmol/L": 1.355 },
  "folate": { "nmol/L": 2.266 },
  "shbg": { "nmol/L": 1 },
  "hcg": { "IU/L": 1 },
  "lh": { "IU/L": 1 },
  "fsh": { "IU/L": 1 },
  "alt": { "IU/L": 1 },
  "ast": { "IU/L": 1 },
  "ggt": { "IU/L": 1 },
  "alp": { "IU/L": 1 },
  "ck": { "IU/L": 1 },
  "ldh": { "IU/L": 1 },
  "igg": { "g/L": 100 },
  "iga": { "g/L": 100 },
  "igm": { "g/L": 100 },
  "apob": { "g/L": 100 },
  "lpa": { "nmol/L": 0.04 },
  "hba1c": { "mmol/mol": 0.0915 },
  "ige": { "kU/L": 1 },
  "c3": { "g/L": 100 },
  "c4": { "g/L": 100 },
  "transferrin": { "g/L": 100 },
  "cystatin-c": { "mg/L": 1 },
  "sodium": { "mEq/L": 1 },
  "potassium": { "mEq/L": 1 },
  "chloride": { "mEq/L": 1 },
  "bicarbonate": { "mEq/L": 1 },
  "anion-gap": { "mmol/L": 1 },
  "prolactin": { "mIU/L": 1 },
  "insulin": { "mIU/L": 1 },
  "free-t4": { "pmol/L": 0.0777 },
  "free-t3": { "pmol/L": 0.651 },
  "igf1": { "nmol/L": 0.131 },
};

export function convertValue(
  markerId: string,
  value: number,
  fromUnit: string,
  toUnit: string
): { value: number; converted: boolean } {
  if (fromUnit === toUnit) return { value, converted: false };

  const markerConversions = CONVERSIONS[markerId];
  if (!markerConversions) return { value, converted: false };

  // from alternate unit → default unit
  if (markerConversions[fromUnit]) {
    return { value: value * markerConversions[fromUnit], converted: true };
  }

  // from default unit → alternate unit
  if (markerConversions[toUnit]) {
    return { value: value / markerConversions[toUnit], converted: true };
  }

  return { value, converted: false };
}

export function normalizeToDefaultUnit(
  markerId: string,
  value: number,
  unit: string,
  defaultUnit: string
): { value: number; unit: string; sourceValue: number; sourceUnit: string; converted: boolean } {
  const result = convertValue(markerId, value, unit, defaultUnit);
  if (result.converted) {
    return {
      value: Math.round(result.value * 100) / 100,
      unit: defaultUnit,
      sourceValue: value,
      sourceUnit: unit,
      converted: true,
    };
  }
  return { value, unit, sourceValue: value, sourceUnit: unit, converted: false };
}