"use client";

import { useSettings } from "@/context/SettingsContext";

export function Background() {
  const { theme } = useSettings();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[var(--bg-base)]">
      <div
        className="ambient-bg absolute inset-[-12%]"
        style={{ background: "var(--gradient-ambient)" }}
      />
    </div>
  );
}