import type { FrequencyPattern } from "@/data/frequencies";

export interface CycleCompound {
  compoundId: string;
  doseMg: number;
  frequency: FrequencyPattern;
  activeWeeks: [number, number];
  route: "injectable" | "oral" | "topical";
}