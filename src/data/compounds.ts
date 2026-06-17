import type { CycleCompound } from "@/lib/cycleTypes";

export type CompoundCategory =
  | "anabolics"
  | "fat-loss"
  | "estrogen"
  | "peptides";

export type RouteType = "injectable" | "oral" | "topical";

export interface Compound {
  id: string;
  name: string;
  shortName: string;
  category: CompoundCategory;
  route: RouteType;
  tags: string[];
  dosageInfo: string;
  color: string;
  halfLife?: number;
  pkMultiplier?: number;
  unit: "mg" | "mcg" | "iu";
  hepatotoxic?: boolean;
}

export const COMPOUND_CATEGORIES: {
  id: CompoundCategory;
  label: string;
  icon: string;
}[] = [
  { id: "anabolics", label: "Anabolics", icon: "💪" },
  { id: "fat-loss", label: "Fat Loss & Metabolics", icon: "🔥" },
  { id: "estrogen", label: "Estrogen Control", icon: "⭐" },
  { id: "peptides", label: "Peptides & Hormones", icon: "🧪" },
];

export const COMPOUNDS: Compound[] = [
  { id: "test-e", name: "Testosterone Enanthate", shortName: "Test E", category: "anabolics", route: "injectable", tags: ["TR", "IM", "Test"], dosageInfo: "100–500 mg/wk typical", color: "#ec4899", halfLife: 4.5, pkMultiplier: 1.0, unit: "mg" },
  { id: "test-c", name: "Testosterone Cypionate", shortName: "Test C", category: "anabolics", route: "injectable", tags: ["TR", "IM", "Test"], dosageInfo: "100–500 mg/wk typical", color: "#ec4899", halfLife: 8, pkMultiplier: 1.0, unit: "mg" },
  { id: "test-p", name: "Testosterone Propionate", shortName: "Test P", category: "anabolics", route: "injectable", tags: ["TR", "IM", "Test"], dosageInfo: "50–100 mg EOD typical", color: "#ec4899", halfLife: 0.8, pkMultiplier: 1.0, unit: "mg" },
  { id: "test-sus", name: "Testosterone Sustanon", shortName: "Test Sus", category: "anabolics", route: "injectable", tags: ["TR", "IM", "Test"], dosageInfo: "250–750 mg/wk typical", color: "#ec4899", halfLife: 5, pkMultiplier: 1.0, unit: "mg" },
  { id: "test-trt", name: "Testosterone TRT (No Ester)", shortName: "Test TRT", category: "anabolics", route: "injectable", tags: ["TR", "IM"], dosageInfo: "100–200 mg/wk TRT", color: "#ec4899", halfLife: 0.03, pkMultiplier: 1.0, unit: "mg" },
  { id: "test-tne", name: "Testosterone TNE (No Ester)", shortName: "Test TNE", category: "anabolics", route: "injectable", tags: ["IM", "Pre-workout"], dosageInfo: "50–100 mg pre-workout", color: "#ec4899", halfLife: 0.03, pkMultiplier: 1.2, unit: "mg" },
  { id: "mast-e", name: "Masteron Enanthate", shortName: "Mast E", category: "anabolics", route: "injectable", tags: ["IM", "DHT"], dosageInfo: "200–400 mg/wk typical", color: "#14b8a6", halfLife: 4.5, pkMultiplier: 0.6, unit: "mg" },
  { id: "mast-p", name: "Masteron Propionate", shortName: "Mast P", category: "anabolics", route: "injectable", tags: ["IM", "DHT"], dosageInfo: "100 mg EOD typical", color: "#14b8a6", halfLife: 0.8, pkMultiplier: 0.6, unit: "mg" },
  { id: "tren-a", name: "Trenbolone Acetate", shortName: "Tren A", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "50–100 mg EOD typical", color: "#eab308", halfLife: 1, pkMultiplier: 1.5, unit: "mg" },
  { id: "tren-e", name: "Trenbolone Enanthate", shortName: "Tren E", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "200–400 mg/wk typical", color: "#eab308", halfLife: 4.5, pkMultiplier: 1.5, unit: "mg" },
  { id: "primo-e", name: "Primobolan Enanthate", shortName: "Primo E", category: "anabolics", route: "injectable", tags: ["IM"], dosageInfo: "400–600 mg/wk typical", color: "#22c55e", halfLife: 7, pkMultiplier: 0.4, unit: "mg" },
  { id: "eq", name: "Boldenone Undecylenate (EQ)", shortName: "EQ", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "400–600 mg/wk typical", color: "#22c55e", halfLife: 14, pkMultiplier: 0.5, unit: "mg" },
  { id: "eq-c", name: "Boldenone Cypionate", shortName: "EQ C", category: "anabolics", route: "injectable", tags: ["IM"], dosageInfo: "400–600 mg/wk typical", color: "#f97316", halfLife: 8, pkMultiplier: 0.5, unit: "mg" },
  { id: "eq-a", name: "Boldenone Acetate", shortName: "EQ A", category: "anabolics", route: "injectable", tags: ["IM"], dosageInfo: "100 mg EOD typical", color: "#f97316", halfLife: 0.8, pkMultiplier: 0.5, unit: "mg" },
  { id: "deca", name: "Nandrolone Decanoate (Deca)", shortName: "Deca", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "200–400 mg/wk typical", color: "#a855f7", halfLife: 7, pkMultiplier: 0.7, unit: "mg" },
  { id: "deca-d", name: "Deca-Durabolin", shortName: "Deca-D", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "200–400 mg/wk typical", color: "#a855f7", halfLife: 7, pkMultiplier: 0.7, unit: "mg" },
  { id: "npp", name: "Nandrolone Phenylpropionate (NPP)", shortName: "NPP", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "100 mg EOD typical", color: "#3b82f6", halfLife: 1.5, pkMultiplier: 0.7, unit: "mg" },
  { id: "dhb", name: "DHB (1-Testosterone)", shortName: "DHB", category: "anabolics", route: "injectable", tags: ["IM"], dosageInfo: "200–400 mg/wk typical", color: "#14b8a6", halfLife: 4, pkMultiplier: 0.8, unit: "mg" },
  { id: "ment", name: "MENT (Trestolone Acetate)", shortName: "MENT", category: "anabolics", route: "injectable", tags: ["IM", "19-nor"], dosageInfo: "50–100 mg/wk typical", color: "#ec4899", halfLife: 0.5, pkMultiplier: 2.0, unit: "mg" },
  { id: "dht", name: "Injectable DHT (Stanolone)", shortName: "DHT", category: "anabolics", route: "injectable", tags: ["IM", "DHT"], dosageInfo: "50–100 mg/wk typical", color: "#ec4899", halfLife: 0.5, pkMultiplier: 0.9, unit: "mg" },
  { id: "anadrol", name: "Anadrol (Oxymetholone)", shortName: "Anadrol", category: "anabolics", route: "oral", tags: ["17aa", "Oral"], dosageInfo: "50–100 mg/day typical", color: "#ef4444", halfLife: 0.33, pkMultiplier: 1.3, unit: "mg", hepatotoxic: true },
  { id: "dbol", name: "Dianabol (Methandrostenolone)", shortName: "Dbol", category: "anabolics", route: "oral", tags: ["17aa", "Oral"], dosageInfo: "20–50 mg/day typical", color: "#ef4444", halfLife: 0.2, pkMultiplier: 1.1, unit: "mg", hepatotoxic: true },
  { id: "sdrol", name: "Superdrol (Methyldrostanolone)", shortName: "Sdrol", category: "anabolics", route: "oral", tags: ["17aa", "Oral"], dosageInfo: "10–20 mg/day typical", color: "#ef4444", halfLife: 0.33, pkMultiplier: 1.4, unit: "mg", hepatotoxic: true },
  { id: "halo", name: "Halotestin (Fluoxymesterone)", shortName: "Halo", category: "anabolics", route: "oral", tags: ["17aa", "Oral"], dosageInfo: "10–40 mg/day typical", color: "#ef4444", halfLife: 0.4, pkMultiplier: 1.6, unit: "mg", hepatotoxic: true },
  { id: "clen", name: "Clenbuterol", shortName: "Clen", category: "fat-loss", route: "oral", tags: ["Beta-2"], dosageInfo: "20–120 mcg/day", color: "#f97316", halfLife: 1.5, pkMultiplier: 0.3, unit: "mcg" },
  { id: "t3", name: "Liothyronine (T3)", shortName: "T3", category: "fat-loss", route: "oral", tags: ["Thyroid"], dosageInfo: "25–75 mcg/day", color: "#f97316", halfLife: 0.75, pkMultiplier: 0.2, unit: "mcg" },
  { id: "aromasin", name: "Aromasin (Exemestane)", shortName: "Aromasin", category: "estrogen", route: "oral", tags: ["AI", "Suicidal"], dosageInfo: "12.5–25 mg EOD", color: "#14b8a6", halfLife: 1, pkMultiplier: 0.1, unit: "mg" },
  { id: "arimidex", name: "Arimidex (Anastrozole)", shortName: "Arimidex", category: "estrogen", route: "oral", tags: ["AI"], dosageInfo: "0.5–1 mg EOD", color: "#14b8a6", halfLife: 2, pkMultiplier: 0.1, unit: "mg" },
  { id: "nolvadex", name: "Nolvadex (Tamoxifen)", shortName: "Nolvadex", category: "estrogen", route: "oral", tags: ["SERM"], dosageInfo: "20–40 mg/day", color: "#ec4899", halfLife: 5, pkMultiplier: 0.1, unit: "mg" },
  { id: "caber", name: "Cabergoline", shortName: "Caber", category: "estrogen", route: "oral", tags: ["DA"], dosageInfo: "0.25–0.5 mg 2x/wk", color: "#a855f7", halfLife: 63, pkMultiplier: 0.1, unit: "mg" },
  { id: "hcg", name: "HCG", shortName: "HCG", category: "peptides", route: "injectable", tags: ["SC", "IM"], dosageInfo: "250–500 iu 2x/wk", color: "#22c55e", halfLife: 1.5, pkMultiplier: 0.1, unit: "iu" },
  { id: "bpc157", name: "BPC-157", shortName: "BPC-157", category: "peptides", route: "injectable", tags: ["SC", "Peptide"], dosageInfo: "250–500 mcg/day", color: "#3b82f6", halfLife: 0.2, pkMultiplier: 0.05, unit: "mcg" },
  { id: "gh", name: "Growth Hormone", shortName: "GH", category: "peptides", route: "injectable", tags: ["SC"], dosageInfo: "2–4 iu/day", color: "#22c55e", halfLife: 0.2, pkMultiplier: 0.2, unit: "iu" },
  { id: "tudca", name: "TUDCA", shortName: "TUDCA", category: "peptides", route: "oral", tags: ["Liver Support"], dosageInfo: "500–1000 mg/day", color: "#22c55e", halfLife: 0.5, pkMultiplier: 0.05, unit: "mg" },
  { id: "nac", name: "NACET", shortName: "NACET", category: "peptides", route: "oral", tags: ["Liver Support"], dosageInfo: "600–1200 mg/day", color: "#22c55e", halfLife: 0.3, pkMultiplier: 0.05, unit: "mg" },
];

export interface CycleTemplate {
  id: string;
  name: string;
  color: string;
  description: string;
  compounds: CycleCompound[];
}

export const CYCLE_TEMPLATES: CycleTemplate[] = [
  {
    id: "starter",
    name: "First Cycle",
    color: "#22c55e",
    description: "Test-only beginner cycle",
    compounds: [
      { compoundId: "test-e", doseMg: 300, frequency: "2x-weekly", activeWeeks: [1, 12], route: "injectable" },
      { compoundId: "aromasin", doseMg: 12.5, frequency: "eod", activeWeeks: [1, 12], route: "oral" },
    ],
  },
  {
    id: "trt",
    name: "TRT Base",
    color: "#3b82f6",
    description: "Test + HCG maintenance",
    compounds: [
      { compoundId: "test-c", doseMg: 150, frequency: "weekly", activeWeeks: [1, 52], route: "injectable" },
      { compoundId: "hcg", doseMg: 500, frequency: "2x-weekly", activeWeeks: [1, 52], route: "injectable" },
    ],
  },
  {
    id: "bulk",
    name: "Lean Bulk",
    color: "#f97316",
    description: "Test + oral kickstart",
    compounds: [
      { compoundId: "test-e", doseMg: 500, frequency: "2x-weekly", activeWeeks: [1, 16], route: "injectable" },
      { compoundId: "dbol", doseMg: 30, frequency: "daily", activeWeeks: [1, 4], route: "oral" },
      { compoundId: "aromasin", doseMg: 12.5, frequency: "eod", activeWeeks: [1, 16], route: "oral" },
      { compoundId: "tudca", doseMg: 500, frequency: "daily", activeWeeks: [1, 4], route: "oral" },
    ],
  },
  {
    id: "cut",
    name: "Cutting Stack",
    color: "#eab308",
    description: "Test + Tren + Mast",
    compounds: [
      { compoundId: "test-p", doseMg: 50, frequency: "eod", activeWeeks: [1, 10], route: "injectable" },
      { compoundId: "tren-a", doseMg: 50, frequency: "eod", activeWeeks: [1, 8], route: "injectable" },
      { compoundId: "mast-p", doseMg: 50, frequency: "eod", activeWeeks: [1, 10], route: "injectable" },
      { compoundId: "aromasin", doseMg: 12.5, frequency: "eod", activeWeeks: [1, 10], route: "oral" },
      { compoundId: "caber", doseMg: 0.25, frequency: "2x-weekly", activeWeeks: [1, 8], route: "oral" },
    ],
  },
];

export function getCompoundById(id: string): Compound | undefined {
  return COMPOUNDS.find((c) => c.id === id);
}