"use client";

import { motion } from "framer-motion";
import { Check, Palette, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { THEME_PRESETS, type ContentWidth, type SurfaceStyle, type ThemePresetId } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AppearanceSettings() {
  const { theme, updateTheme, applyPreset, reducedMotion, compactSidebar, updateSettings } = useSettings();
  const { toast } = useToast();

  const setColor = (key: "accentPrimary" | "accentSecondary" | "accentTertiary", value: string) => {
    updateTheme({ [key]: value, preset: "custom" });
  };

  return (
    <div className={`${ui.card} ${ui.cardPad} space-y-8`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--accent)]/30 bg-[var(--labs-dim)]">
          <Palette className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div>
          <h3 className={ui.sectionTitle}>Appearance & Accent Designer</h3>
          <p className={ui.sectionSub}>Customize gradients, glass effects, and accent colors across the entire app.</p>
        </div>
      </div>

      {/* Surface style */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Surface style</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: "glass" as const, label: "Standard Glass", desc: "Flat frosted panels with subtle depth" },
              { id: "liquid" as const, label: "Liquid Glass", desc: "Glossy skeuomorphic highlights and pillowy depth" },
            ] satisfies { id: SurfaceStyle; label: string; desc: string }[]
          ).map(({ id, label, desc }) => {
            const active = theme.surfaceStyle === id;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateTheme({ surfaceStyle: id })}
                className={cn(
                  "glass-panel rounded-[var(--radius-md)] p-4 text-left transition",
                  active ? "glow-accent border-[var(--accent)]/40" : "hover:border-[var(--border-strong)]"
                )}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted)]">{desc}</p>
                {active && <Check className="mt-2 h-4 w-4 text-[var(--accent)]" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Live preview */}
      <div className="glass-panel relative overflow-hidden rounded-[var(--radius-xl)] p-6">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-60" style={{ background: "radial-gradient(circle, var(--labs-glow), transparent)" }} />
        <p className={ui.overline}>Live preview</p>
        <p className="font-display mt-2 text-2xl font-bold text-gradient">Meridian</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Your accent gradient flows through navigation, charts, and CTAs.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className={ui.btnPrimary}>Primary action</button>
          <button className={ui.btnSecondary}>Secondary</button>
          <span className={cn(ui.pillActive, "pointer-events-none")}>Active pill</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Theme presets</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEME_PRESETS.map((preset) => {
            const active = theme.preset === preset.id;
            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  applyPreset(preset.id as ThemePresetId);
                  toast({ type: "success", title: `${preset.name} applied` });
                }}
                className={cn(
                  "relative overflow-hidden rounded-[var(--radius-md)] border p-3 text-left transition",
                  active ? "border-[var(--accent)]/50 glow-accent" : "border-[var(--border)] hover:border-[var(--border-strong)]"
                )}
              >
                <div
                  className="mb-3 h-8 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary}, ${preset.tertiary})` }}
                />
                <p className="text-sm font-medium text-[var(--foreground)]">{preset.name}</p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)]">{preset.description}</p>
                {active && (
                  <Check className="absolute right-2 top-2 h-4 w-4 text-[var(--accent)]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Custom accent colors</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              { key: "accentPrimary" as const, label: "Primary", desc: "Main accent & labs" },
              { key: "accentSecondary" as const, label: "Secondary", desc: "Gradient end & protocol" },
              { key: "accentTertiary" as const, label: "Tertiary", desc: "Intel & highlights" },
            ] as const
          ).map(({ key, label, desc }) => (
            <div key={key} className={cn(ui.cardInner, "p-4")}>
              <label className={ui.label}>{label}</label>
              <p className="mb-3 text-[10px] text-[var(--muted-2)]">{desc}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent"
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className={cn(ui.input, "h-9 font-mono text-xs")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background colors */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Background & surfaces</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              { key: "baseColor" as const, label: "Base", desc: "Page background" },
              { key: "elevatedColor" as const, label: "Elevated", desc: "Inputs & dropdowns" },
              { key: "surfaceColor" as const, label: "Surface", desc: "Cards & panels" },
            ] as const
          ).map(({ key, label, desc }) => (
            <div key={key} className={cn(ui.cardInner, "p-4")}>
              <label className={ui.label}>{label}</label>
              <p className="mb-3 text-[10px] text-[var(--muted-2)]">{desc}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => updateTheme({ [key]: e.target.value, preset: "custom" })}
                  className="h-10 w-14 cursor-pointer rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent"
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => updateTheme({ [key]: e.target.value, preset: "custom" })}
                  className={cn(ui.input, "h-9 font-mono text-xs")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <p className={cn(ui.overline, "mb-3")}>Layout & typography</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              { id: "narrow" as const, label: "Narrow" },
              { id: "default" as const, label: "Default" },
              { id: "wide" as const, label: "Wide" },
              { id: "full" as const, label: "Full" },
            ] satisfies { id: ContentWidth; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => updateTheme({ contentWidth: id })}
              className={cn(
                "rounded-[var(--radius-md)] border px-3 py-2.5 text-xs font-semibold transition",
                theme.contentWidth === id
                  ? "border-[var(--accent)]/50 bg-[var(--labs-dim)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-5">
          <Slider
            label="Font scale"
            value={theme.fontScale}
            onChange={(v) => updateTheme({ fontScale: v })}
            min={85}
            max={115}
            unit="%"
          />
          <Slider
            label="Panel shadow depth"
            value={theme.shadowDepth}
            onChange={(v) => updateTheme({ shadowDepth: v })}
            min={0}
            max={100}
          />
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <p className={ui.overline}>Glass & gradient</p>
        <Slider
          label="Gradient intensity"
          value={theme.gradientIntensity}
          onChange={(v) => updateTheme({ gradientIntensity: v })}
          min={0}
          max={100}
        />
        <Slider
          label="Glass blur"
          value={theme.glassBlur}
          onChange={(v) => updateTheme({ glassBlur: v })}
          min={4}
          max={32}
          unit="px"
        />
        <Slider
          label="Glass opacity"
          value={theme.glassOpacity}
          onChange={(v) => updateTheme({ glassOpacity: v })}
          min={2}
          max={16}
          unit="%"
        />
        <Slider
          label="Corner radius"
          value={Math.round(theme.radiusScale * 100)}
          onChange={(v) => updateTheme({ radiusScale: v / 100 })}
          min={80}
          max={140}
          unit="%"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <p className={ui.overline}>Display & behavior</p>
        <ToggleRow
          label="Ambient background"
          desc="Show the accent gradient wash behind content"
          checked={theme.showAmbientBackground}
          onChange={(v) => updateTheme({ showAmbientBackground: v })}
        />
        <ToggleRow
          label="Animated background"
          desc="Slow drift on the ambient gradient"
          checked={theme.animatedBackground}
          onChange={(v) => updateTheme({ animatedBackground: v })}
        />
        <ToggleRow
          label="Top bar subtitles"
          desc="Show page descriptions under the title"
          checked={theme.showTopBarSubtitle}
          onChange={(v) => updateTheme({ showTopBarSubtitle: v })}
        />
        <ToggleRow
          label="Accent border glow"
          desc="Subtle colored borders on glass panels"
          checked={theme.borderGlow}
          onChange={(v) => updateTheme({ borderGlow: v })}
        />
        <ToggleRow
          label="Collapsed sidebar"
          desc="Start with the navigation rail minimized"
          checked={compactSidebar}
          onChange={(v) => updateSettings({ compactSidebar: v })}
        />
        <ToggleRow
          label="Compact density"
          desc="Tighter spacing across panels"
          checked={theme.density === "compact"}
          onChange={(v) => updateTheme({ density: v ? "compact" : "comfortable" })}
        />
        <ToggleRow
          label="Reduce motion"
          desc="Minimize animations for accessibility"
          checked={reducedMotion}
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
      </div>

      <button
        onClick={() => {
          applyPreset("crimson");
          updateTheme({
            surfaceStyle: "glass",
            baseColor: "#07080c",
            elevatedColor: "#0c0e14",
            surfaceColor: "#11141c",
            gradientIntensity: 65,
            glassBlur: 16,
            glassOpacity: 6,
            shadowDepth: 50,
            fontScale: 100,
            borderGlow: true,
            animatedBackground: true,
            showAmbientBackground: true,
            showTopBarSubtitle: true,
            density: "comfortable",
            radiusScale: 1,
            contentWidth: "default",
          });
          toast({ type: "info", title: "Appearance reset to Crimson default" });
        }}
        className={cn(ui.btnGhost, "w-full justify-center border border-[var(--border)] py-3")}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Reset appearance to defaults
      </button>
    </div>
  );
}

function Slider({
  label, value, onChange, min, max, unit = "",
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; unit?: string;
}) {
  return (
    <div>
      <div className={ui.rowBetween}>
        <span className="text-sm text-[var(--foreground)]">{label}</span>
        <span className="font-mono text-xs text-[var(--muted)]">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--bg-hover)] accent-[var(--accent)]"
      />
    </div>
  );
}

function ToggleRow({
  label, desc, checked, onChange,
}: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className={ui.rowBetween}>
      <div>
        <p className="text-sm text-[var(--foreground)]">{label}</p>
        <p className={ui.sectionSub}>{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "[background:var(--gradient-primary)]" : "bg-[var(--bg-hover)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}