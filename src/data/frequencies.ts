export const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily", pattern: "daily" },
  { id: "eod", label: "Every Other Day (EOD)", pattern: "eod" },
  { id: "2x-weekly", label: "2x weekly (Mon, Thu)", pattern: "2x-weekly" },
  { id: "weekly", label: "Weekly", pattern: "weekly" },
  { id: "bid", label: "2x daily (BID)", pattern: "bid" },
  { id: "pre-workout", label: "Pre-workout only", pattern: "pre-workout" },
] as const;

export type FrequencyPattern = (typeof FREQUENCY_OPTIONS)[number]["pattern"];

export function frequencyLabel(pattern: string): string {
  return FREQUENCY_OPTIONS.find((f) => f.pattern === pattern)?.label ?? pattern;
}

export const DEFAULT_DOSES: Record<string, { doseMg: number; frequency: FrequencyPattern }> = {
  "test-e": { doseMg: 250, frequency: "2x-weekly" },
  "test-c": { doseMg: 150, frequency: "weekly" },
  "test-p": { doseMg: 50, frequency: "eod" },
  "test-sus": { doseMg: 250, frequency: "weekly" },
  "test-trt": { doseMg: 100, frequency: "weekly" },
  "test-tne": { doseMg: 50, frequency: "pre-workout" },
  "tren-a": { doseMg: 50, frequency: "eod" },
  "tren-e": { doseMg: 200, frequency: "weekly" },
  "deca": { doseMg: 200, frequency: "weekly" },
  "npp": { doseMg: 100, frequency: "eod" },
  "eq": { doseMg: 400, frequency: "weekly" },
  "anadrol": { doseMg: 50, frequency: "daily" },
  "dbol": { doseMg: 30, frequency: "daily" },
  "sdrol": { doseMg: 10, frequency: "daily" },
  "halo": { doseMg: 10, frequency: "pre-workout" },
  "aromasin": { doseMg: 12.5, frequency: "eod" },
  "arimidex": { doseMg: 0.5, frequency: "eod" },
  "nolvadex": { doseMg: 20, frequency: "daily" },
  "caber": { doseMg: 0.25, frequency: "2x-weekly" },
  "hcg": { doseMg: 250, frequency: "2x-weekly" },
  "tudca": { doseMg: 500, frequency: "daily" },
  "nac": { doseMg: 600, frequency: "daily" },
  "clen": { doseMg: 40, frequency: "daily" },
  "t3": { doseMg: 25, frequency: "daily" },
  "gh": { doseMg: 2, frequency: "daily" },
  "bpc157": { doseMg: 0.25, frequency: "daily" },
};