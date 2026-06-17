import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addWeeks, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = "MMM d, yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function getEndDate(startDate: Date, weeks: number) {
  return addWeeks(startDate, weeks);
}

export function getDayName(date: Date) {
  return format(date, "EEEE");
}