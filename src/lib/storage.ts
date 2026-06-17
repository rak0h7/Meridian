import type { BloodworkReport } from "./types";

const STORAGE_KEY = "bloodwork-logger-reports";

export function loadReports(): BloodworkReport[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReports(reports: BloodworkReport[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function generateId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}