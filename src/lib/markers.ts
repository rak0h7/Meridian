import type { MarkerCategory, MarkerDefinition } from "./types";

export const CATEGORY_LABELS: Record<MarkerCategory, string> = {
  hormonal: "Hormonal",
  cbc: "CBC / Blood",
  cardiovascular: "Cardiovascular",
  liver: "Liver",
  kidney: "Kidney",
  electrolytes: "Electrolytes",
  metabolic: "Metabolic / Insulin",
  thyroid: "Thyroid",
  muscle: "Muscle",
  nutrients: "Nutrients",
  immune: "Immune",
};

export const CATEGORY_INSIGHT_LABELS: Record<MarkerCategory, string> = {
  hormonal: "Hormonal Status",
  cbc: "CBC / Viscosity",
  cardiovascular: "Cardiovascular",
  liver: "Liver Function",
  kidney: "Kidney Function",
  electrolytes: "Electrolytes",
  metabolic: "Metabolic / Insulin",
  thyroid: "Thyroid",
  muscle: "Muscle",
  nutrients: "Nutrients",
  immune: "Immune",
};

const m = (
  id: string,
  name: string,
  category: MarkerCategory,
  defaultUnit: string,
  units: string[],
  aliases: string[],
  range: MarkerDefinition["range"]
): MarkerDefinition => ({ id, name, category, defaultUnit, units, aliases, range });

export const MARKERS: MarkerDefinition[] = [
  // Hormonal
  m("total-testosterone", "Total Testosterone", "hormonal", "ng/dL", ["ng/dL", "nmol/L"], ["testosterone total", "testosterone, total", "total testosterone"], { labMin: 300, labMax: 1000, optimalMin: 500, optimalMax: 900, cautionMin: 900, cautionMax: 1200, strictThreshold: 1500 }),
  m("free-testosterone", "Free Testosterone", "hormonal", "pg/mL", ["pg/mL", "pmol/L"], ["free testosterone", "testosterone free"], { labMin: 9, labMax: 30, optimalMin: 15, optimalMax: 25 }),
  m("shbg", "SHBG", "hormonal", "nmol/L", ["nmol/L"], ["shbg", "sex hormone binding globulin"], { labMin: 10, labMax: 57, optimalMin: 20, optimalMax: 45 }),
  m("estradiol", "Estradiol (E2)", "hormonal", "pg/mL", ["pg/mL", "pmol/L"], ["estradiol", "e2", "oestradiol"], { labMin: 10, labMax: 40, optimalMin: 20, optimalMax: 35, cautionMin: 35, cautionMax: 50, strictThreshold: 60 }),
  m("lh", "LH", "hormonal", "mIU/mL", ["mIU/mL", "IU/L"], ["lh", "luteinizing hormone"], { labMin: 1.5, labMax: 9.3, optimalMin: 2, optimalMax: 8 }),
  m("fsh", "FSH", "hormonal", "mIU/mL", ["mIU/mL", "IU/L"], ["fsh", "follicle stimulating hormone"], { labMin: 1.5, labMax: 12.4, optimalMin: 2, optimalMax: 10 }),
  m("prolactin", "Prolactin", "hormonal", "ng/mL", ["ng/mL", "mIU/L"], ["prolactin"], { labMin: 2, labMax: 18, optimalMin: 3, optimalMax: 15, strictThreshold: 25 }),
  m("progesterone", "Progesterone", "hormonal", "ng/mL", ["ng/mL", "nmol/L"], ["progesterone"], { labMin: 0.1, labMax: 0.9, optimalMin: 0.1, optimalMax: 0.5 }),
  m("igf1", "IGF-1", "hormonal", "ng/mL", ["ng/mL", "nmol/L"], ["igf-1", "igf1", "insulin-like growth factor"], { labMin: 100, labMax: 300, optimalMin: 150, optimalMax: 280 }),
  m("cortisol-am", "Cortisol (AM)", "hormonal", "µg/dL", ["µg/dL", "nmol/L"], ["cortisol", "cortisol am", "cortisol (am)"], { labMin: 5, labMax: 23, optimalMin: 8, optimalMax: 18 }),
  m("hcg", "HCG (Serum)", "hormonal", "mIU/mL", ["mIU/mL", "IU/L"], ["hcg", "hcg serum", "beta hcg"], { labMin: 0, labMax: 5, optimalMin: 0, optimalMax: 2, upperOnly: true }),
  m("afp", "AFP (Alpha-Fetoprotein)", "hormonal", "ng/mL", ["ng/mL"], ["afp", "alpha-fetoprotein", "alpha fetoprotein"], { labMin: 0, labMax: 10, optimalMin: 0, optimalMax: 7, upperOnly: true }),
  m("dht", "DHT", "hormonal", "ng/dL", ["ng/dL", "nmol/L"], ["dht", "dihydrotestosterone"], { labMin: 30, labMax: 85, optimalMin: 35, optimalMax: 70 }),
  m("dhea-s", "DHEA-S", "hormonal", "µg/dL", ["µg/dL", "µmol/L"], ["dhea-s", "dheas", "dhea sulfate"], { labMin: 80, labMax: 560, optimalMin: 150, optimalMax: 450 }),

  // CBC / Blood
  m("hematocrit", "Hematocrit", "cbc", "%", ["%", "L/L"], ["hematocrit", "hct"], { labMin: 38, labMax: 50, optimalMin: 42, optimalMax: 48, cautionMin: 50, cautionMax: 54, strictThreshold: 52 }),
  m("hemoglobin", "Hemoglobin", "cbc", "g/dL", ["g/dL", "g/L"], ["hemoglobin", "hgb", "hb"], { labMin: 13, labMax: 17, optimalMin: 14, optimalMax: 16.5 }),
  m("rbc", "RBC Count", "cbc", "M/µL", ["M/µL", "x10^12/L", "x10^6/µL"], ["rbc", "rbc count", "red blood cell count"], { labMin: 4.5, labMax: 5.9, optimalMin: 4.6, optimalMax: 5.5 }),
  m("platelets", "Platelets", "cbc", "K/µL", ["K/µL", "x10^9/L", "x10^3/µL"], ["platelets", "platelet count", "plt"], { labMin: 150, labMax: 400, optimalMin: 150, optimalMax: 400 }),
  m("wbc", "WBC Count", "cbc", "K/µL", ["K/µL", "x10^9/L", "x10^3/µL"], ["wbc", "wbc count", "white blood cell count"], { labMin: 4, labMax: 11, optimalMin: 4, optimalMax: 11 }),
  m("neutrophils", "Neutrophils (abs)", "cbc", "K/µL", ["K/µL", "x10^9/L"], ["neutrophils", "neutrophils abs", "neutrophils (abs)", "neutrophil count"], { labMin: 2, labMax: 8, optimalMin: 2, optimalMax: 8 }),
  m("lymphocytes", "Lymphocytes (abs)", "cbc", "K/µL", ["K/µL", "x10^9/L"], ["lymphocytes", "lymphocytes abs", "lymphocytes (abs)"], { labMin: 1, labMax: 4, optimalMin: 1, optimalMax: 3.5 }),
  m("monocytes", "Monocytes (abs)", "cbc", "K/µL", ["K/µL", "x10^9/L"], ["monocytes", "monocytes abs", "monocytes (abs)"], { labMin: 0.2, labMax: 1, optimalMin: 0.2, optimalMax: 0.8 }),
  m("eosinophils", "Eosinophils (abs)", "cbc", "K/µL", ["K/µL", "x10^9/L"], ["eosinophils", "eosinophils abs", "eosinophils (abs)"], { labMin: 0, labMax: 0.5, optimalMin: 0, optimalMax: 0.4 }),
  m("basophils", "Basophils (abs)", "cbc", "K/µL", ["K/µL", "x10^9/L"], ["basophils", "basophils abs", "basophils (abs)"], { labMin: 0, labMax: 0.2, optimalMin: 0, optimalMax: 0.1 }),
  m("mchc", "MCHC", "cbc", "g/dL", ["g/dL", "g/L"], ["mchc"], { labMin: 32, labMax: 36, optimalMin: 33, optimalMax: 35 }),
  m("rdw", "RDW", "cbc", "%", ["%"], ["rdw", "red cell distribution width"], { labMin: 11.5, labMax: 14.5, optimalMin: 11.5, optimalMax: 13.5 }),
  m("ferritin", "Ferritin", "cbc", "ng/mL", ["ng/mL", "µg/L"], ["ferritin"], { labMin: 30, labMax: 400, optimalMin: 50, optimalMax: 200 }),
  m("mpv", "MPV (Mean Platelet Volume)", "cbc", "fL", ["fL"], ["mpv", "mean platelet volume"], { labMin: 7.5, labMax: 11.5, optimalMin: 8, optimalMax: 11 }),
  m("esr", "ESR (Sed Rate)", "cbc", "mm/hr", ["mm/hr", "mm/h"], ["esr", "sed rate", "erythrocyte sedimentation rate"], { labMin: 0, labMax: 15, optimalMin: 0, optimalMax: 10, upperOnly: true }),
  m("igg", "IgG", "immune", "mg/dL", ["mg/dL", "g/L"], ["igg", "immunoglobulin g"], { labMin: 700, labMax: 1600, optimalMin: 800, optimalMax: 1500 }),
  m("iga", "IgA", "immune", "mg/dL", ["mg/dL", "g/L"], ["iga", "immunoglobulin a"], { labMin: 70, labMax: 400, optimalMin: 90, optimalMax: 350 }),
  m("igm", "IgM", "immune", "mg/dL", ["mg/dL", "g/L"], ["igm", "immunoglobulin m"], { labMin: 40, labMax: 230, optimalMin: 50, optimalMax: 200 }),
  m("ige", "IgE (Total)", "immune", "IU/mL", ["IU/mL", "kU/L"], ["ige", "ige total", "total ige"], { labMin: 0, labMax: 100, optimalMin: 0, optimalMax: 50, upperOnly: true }),
  m("c3", "C3 Complement", "immune", "mg/dL", ["mg/dL", "g/L"], ["c3", "c3 complement", "complement c3"], { labMin: 90, labMax: 180, optimalMin: 100, optimalMax: 170 }),
  m("c4", "C4 Complement", "immune", "mg/dL", ["mg/dL", "g/L"], ["c4", "c4 complement", "complement c4"], { labMin: 10, labMax: 40, optimalMin: 15, optimalMax: 35 }),
  m("mcv", "MCV", "cbc", "fL", ["fL"], ["mcv", "mean corpuscular volume"], { labMin: 80, labMax: 100, optimalMin: 82, optimalMax: 98 }),
  m("mch", "MCH", "cbc", "pg", ["pg"], ["mch", "mean corpuscular hemoglobin"], { labMin: 27, labMax: 33, optimalMin: 28, optimalMax: 32 }),

  // Cardiovascular
  m("ldl", "LDL Cholesterol", "cardiovascular", "mg/dL", ["mg/dL", "mmol/L"], ["ldl", "ldl cholesterol", "ldl-c"], { labMin: 0, labMax: 130, optimalMin: 0, optimalMax: 100, cautionMin: 100, cautionMax: 130, strictThreshold: 160, upperOnly: true }),
  m("hdl", "HDL Cholesterol", "cardiovascular", "mg/dL", ["mg/dL", "mmol/L"], ["hdl", "hdl cholesterol", "hdl-c"], { labMin: 40, labMax: 100, optimalMin: 50, optimalMax: 90, lowerOnly: true }),
  m("triglycerides", "Triglycerides", "cardiovascular", "mg/dL", ["mg/dL", "mmol/L"], ["triglycerides", "trig", "tg"], { labMin: 0, labMax: 150, optimalMin: 0, optimalMax: 100, cautionMin: 100, cautionMax: 150, strictThreshold: 200, upperOnly: true }),
  m("non-hdl", "Non-HDL Cholesterol", "cardiovascular", "mg/dL", ["mg/dL", "mmol/L"], ["non-hdl", "non-hdl cholesterol"], { labMin: 0, labMax: 160, optimalMin: 0, optimalMax: 130, strictThreshold: 160, upperOnly: true }),
  m("chol-hdl-ratio", "Cholesterol/HDL Ratio", "cardiovascular", "ratio", ["ratio"], ["chol/hdl ratio", "cholesterol/hdl ratio", "total cholesterol/hdl ratio"], { labMin: 0, labMax: 5, optimalMin: 0, optimalMax: 3.5, upperOnly: true }),
  m("apob", "ApoB", "cardiovascular", "mg/dL", ["mg/dL", "g/L"], ["apob", "apolipoprotein b"], { labMin: 0, labMax: 100, optimalMin: 0, optimalMax: 80, upperOnly: true }),
  m("lpa", "Lp(a)", "cardiovascular", "mg/dL", ["mg/dL", "nmol/L"], ["lp(a)", "lpa", "lipoprotein(a)"], { labMin: 0, labMax: 30, optimalMin: 0, optimalMax: 20, upperOnly: true }),
  m("hscrp", "hs-CRP", "cardiovascular", "mg/L", ["mg/L"], ["hs-crp", "hscrp", "crp", "c-reactive protein"], { labMin: 0, labMax: 3, optimalMin: 0, optimalMax: 1, upperOnly: true }),
  m("total-cholesterol", "Total Cholesterol", "cardiovascular", "mg/dL", ["mg/dL", "mmol/L"], ["total cholesterol", "cholesterol total"], { labMin: 0, labMax: 200, optimalMin: 0, optimalMax: 180, upperOnly: true }),

  // Liver
  m("alt", "ALT (SGPT)", "liver", "U/L", ["U/L", "IU/L"], ["alt", "sgpt", "alanine aminotransferase"], { labMin: 0, labMax: 40, optimalMin: 0, optimalMax: 35, cautionMin: 35, cautionMax: 50, strictThreshold: 160, upperOnly: true }),
  m("ast", "AST (SGOT)", "liver", "U/L", ["U/L", "IU/L"], ["ast", "sgot", "aspartate aminotransferase"], { labMin: 0, labMax: 35, optimalMin: 0, optimalMax: 30, cautionMin: 30, cautionMax: 40, strictThreshold: 120, upperOnly: true }),
  m("ggt", "GGT", "liver", "U/L", ["U/L", "IU/L"], ["ggt", "gamma gt", "gamma-glutamyl transferase"], { labMin: 0, labMax: 50, optimalMin: 0, optimalMax: 40, cautionMin: 40, cautionMax: 60, strictThreshold: 80, upperOnly: true }),
  m("alp", "ALP", "liver", "U/L", ["U/L", "IU/L"], ["alp", "alkaline phosphatase"], { labMin: 30, labMax: 120, optimalMin: 40, optimalMax: 100 }),
  m("bilirubin-total", "Total Bilirubin", "liver", "mg/dL", ["mg/dL", "µmol/L"], ["bilirubin", "bilirubin total", "total bilirubin"], { labMin: 0.1, labMax: 1.2, optimalMin: 0.2, optimalMax: 1.0 }),
  m("albumin", "Albumin", "liver", "g/dL", ["g/dL", "g/L"], ["albumin"], { labMin: 3.5, labMax: 5.5, optimalMin: 4.0, optimalMax: 5.0 }),
  m("total-protein", "Total Protein", "liver", "g/dL", ["g/dL", "g/L"], ["total protein"], { labMin: 6.0, labMax: 8.3, optimalMin: 6.5, optimalMax: 8.0 }),
  m("globulin", "Globulin", "liver", "g/dL", ["g/dL", "g/L"], ["globulin"], { labMin: 2.0, labMax: 3.5, optimalMin: 2.2, optimalMax: 3.2 }),

  // Kidney
  m("creatinine", "Creatinine", "kidney", "mg/dL", ["mg/dL", "µmol/L"], ["creatinine"], { labMin: 0.7, labMax: 1.3, optimalMin: 0.7, optimalMax: 1.1 }),
  m("egfr", "eGFR", "kidney", "mL/min/1.73m²", ["mL/min/1.73m²"], ["egfr", "gfr", "estimated gfr"], { labMin: 60, labMax: 120, optimalMin: 90, optimalMax: 120, lowerOnly: true }),
  m("urea", "Urea (BUN)", "kidney", "mg/dL", ["mg/dL", "mmol/L"], ["urea", "bun", "blood urea nitrogen"], { labMin: 7, labMax: 20, optimalMin: 8, optimalMax: 18 }),
  m("cystatin-c", "Cystatin C", "kidney", "mg/L", ["mg/L"], ["cystatin c", "cystatin-c"], { labMin: 0.5, labMax: 1.0, optimalMin: 0.6, optimalMax: 0.95 }),
  m("uric-acid", "Uric Acid", "kidney", "mg/dL", ["mg/dL", "µmol/L"], ["uric acid"], { labMin: 3.5, labMax: 7.2, optimalMin: 4.0, optimalMax: 6.5 }),

  // Electrolytes
  m("sodium", "Sodium", "electrolytes", "mmol/L", ["mmol/L", "mEq/L"], ["sodium", "na"], { labMin: 136, labMax: 145, optimalMin: 138, optimalMax: 144 }),
  m("potassium", "Potassium", "electrolytes", "mmol/L", ["mmol/L", "mEq/L"], ["potassium", "k"], { labMin: 3.5, labMax: 5.1, optimalMin: 3.8, optimalMax: 4.8 }),
  m("chloride", "Chloride", "electrolytes", "mmol/L", ["mmol/L", "mEq/L"], ["chloride", "cl"], { labMin: 98, labMax: 106, optimalMin: 100, optimalMax: 105 }),
  m("bicarbonate", "Bicarbonate / CO2", "electrolytes", "mmol/L", ["mmol/L", "mEq/L"], ["bicarbonate", "co2", "bicarbonate / co2"], { labMin: 22, labMax: 29, optimalMin: 23, optimalMax: 28 }),
  m("anion-gap", "Anion Gap", "electrolytes", "mEq/L", ["mEq/L", "mmol/L"], ["anion gap"], { labMin: 8, labMax: 16, optimalMin: 10, optimalMax: 14 }),
  m("calcium", "Calcium", "electrolytes", "mg/dL", ["mg/dL", "mmol/L"], ["calcium", "ca"], { labMin: 8.5, labMax: 10.5, optimalMin: 9.0, optimalMax: 10.2 }),
  m("calcium-corrected", "Corrected Calcium", "electrolytes", "mg/dL", ["mg/dL", "mmol/L"], ["corrected calcium"], { labMin: 8.5, labMax: 10.5, optimalMin: 9.0, optimalMax: 10.2 }),

  // Metabolic
  m("fasting-glucose", "Fasting Glucose", "metabolic", "mg/dL", ["mg/dL", "mmol/L"], ["fasting glucose", "glucose", "glucose fasting"], { labMin: 70, labMax: 100, optimalMin: 75, optimalMax: 95 }),
  m("hba1c", "HbA1c", "metabolic", "%", ["%", "mmol/mol"], ["hba1c", "a1c", "hemoglobin a1c"], { labMin: 4.0, labMax: 5.6, optimalMin: 4.5, optimalMax: 5.4 }),
  m("insulin", "Insulin (Fasting)", "metabolic", "µIU/mL", ["µIU/mL", "mIU/L"], ["insulin", "insulin fasting"], { labMin: 2, labMax: 25, optimalMin: 3, optimalMax: 15 }),

  // Thyroid
  m("tsh", "TSH", "thyroid", "mIU/L", ["mIU/L", "µIU/mL"], ["tsh", "thyroid stimulating hormone"], { labMin: 0.4, labMax: 4.0, optimalMin: 0.5, optimalMax: 2.5 }),
  m("free-t4", "Free T4", "thyroid", "ng/dL", ["ng/dL", "pmol/L"], ["free t4", "ft4", "thyroxine free"], { labMin: 0.8, labMax: 1.8, optimalMin: 1.0, optimalMax: 1.6 }),
  m("free-t3", "Free T3", "thyroid", "pg/mL", ["pg/mL", "pmol/L"], ["free t3", "ft3"], { labMin: 2.3, labMax: 4.2, optimalMin: 2.8, optimalMax: 4.0 }),

  // Muscle
  m("ck", "CK (Creatine Kinase)", "muscle", "U/L", ["U/L", "IU/L"], ["ck", "creatine kinase", "cpk"], { labMin: 30, labMax: 200, optimalMin: 40, optimalMax: 180 }),
  m("ldh", "LDH", "muscle", "U/L", ["U/L", "IU/L"], ["ldh", "lactate dehydrogenase"], { labMin: 140, labMax: 280, optimalMin: 150, optimalMax: 250 }),

  // Nutrients
  m("vitamin-d", "Vitamin D (25-OH)", "nutrients", "ng/mL", ["ng/mL", "nmol/L"], ["vitamin d", "25-oh vitamin d", "vitamin d 25-hydroxy"], { labMin: 30, labMax: 100, optimalMin: 40, optimalMax: 80 }),
  m("b12", "Vitamin B12", "nutrients", "pg/mL", ["pg/mL", "pmol/L"], ["b12", "vitamin b12", "cobalamin"], { labMin: 200, labMax: 900, optimalMin: 400, optimalMax: 800 }),
  m("folate", "Folate", "nutrients", "ng/mL", ["ng/mL", "nmol/L"], ["folate", "folic acid"], { labMin: 3, labMax: 17, optimalMin: 5, optimalMax: 15 }),
  m("iron", "Iron", "nutrients", "µg/dL", ["µg/dL", "µmol/L"], ["iron", "serum iron"], { labMin: 60, labMax: 170, optimalMin: 80, optimalMax: 150 }),
  m("transferrin", "Transferrin", "nutrients", "mg/dL", ["mg/dL", "g/L"], ["transferrin"], { labMin: 200, labMax: 360, optimalMin: 220, optimalMax: 340 }),
];

export const MARKER_MAP = new Map(MARKERS.map((m) => [m.id, m]));

export const MARKERS_BY_CATEGORY = MARKERS.reduce(
  (acc, marker) => {
    if (!acc[marker.category]) acc[marker.category] = [];
    acc[marker.category].push(marker);
    return acc;
  },
  {} as Record<MarkerCategory, MarkerDefinition[]>
);

export const CATEGORY_ORDER: MarkerCategory[] = [
  "hormonal",
  "cbc",
  "cardiovascular",
  "liver",
  "kidney",
  "electrolytes",
  "metabolic",
  "thyroid",
  "muscle",
  "nutrients",
  "immune",
];

export const QUICK_JUMP_MARKERS = {
  hormonal: MARKERS.filter((m) => m.category === "hormonal").map((m) => m.id),
  blood: MARKERS.filter((m) => m.category === "cbc" || m.category === "immune").map((m) => m.id),
};