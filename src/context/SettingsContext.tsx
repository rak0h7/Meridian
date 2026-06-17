"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { RangeMode } from "@/lib/types";
import {
  DEFAULT_THEME,
  applyThemeToDocument,
  type ThemeConfig,
  type ThemePresetId,
  presetToTheme,
  THEME_PRESETS,
} from "@/lib/themes";

export interface AppSettings {
  defaultRangeMode: RangeMode;
  reducedMotion: boolean;
  compactSidebar: boolean;
  theme: ThemeConfig;
}

const STORAGE_KEY = "meridian-settings-v2";

const DEFAULTS: AppSettings = {
  defaultRangeMode: "optimized",
  reducedMotion: false,
  compactSidebar: false,
  theme: DEFAULT_THEME,
};

interface SettingsContextValue extends AppSettings {
  updateSettings: (patch: Partial<AppSettings>) => void;
  updateTheme: (patch: Partial<ThemeConfig>) => void;
  applyPreset: (presetId: ThemePresetId) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function mergeSettings(raw: Partial<AppSettings>): AppSettings {
  return {
    ...DEFAULTS,
    ...raw,
    theme: { ...DEFAULT_THEME, ...raw.theme },
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(mergeSettings(JSON.parse(raw)));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) applyThemeToDocument(settings.theme);
  }, [settings.theme, hydrated]);

  const persist = useCallback((next: AppSettings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => persist(mergeSettings({ ...settings, ...patch })),
    [settings, persist]
  );

  const updateTheme = useCallback(
    (patch: Partial<ThemeConfig>) => {
      const isColorEdit = "accentPrimary" in patch || "accentSecondary" in patch || "accentTertiary" in patch;
      persist({
        ...settings,
        theme: {
          ...settings.theme,
          ...patch,
          preset: patch.preset ?? (isColorEdit ? "custom" : settings.theme.preset),
        },
      });
    },
    [settings, persist]
  );

  const applyPreset = useCallback(
    (presetId: ThemePresetId) => {
      const preset = THEME_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      persist({
        ...settings,
        theme: { ...settings.theme, ...presetToTheme(preset), preset: presetId },
      });
    },
    [settings, persist]
  );

  const resetSettings = useCallback(() => {
    persist(DEFAULTS);
    applyThemeToDocument(DEFAULT_THEME);
  }, [persist]);

  return (
    <SettingsContext.Provider
      value={{ ...settings, updateSettings, updateTheme, applyPreset, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}