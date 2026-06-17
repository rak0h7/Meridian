export type ThemePresetId =
  | "crimson"
  | "ember"
  | "violet"
  | "ocean"
  | "rose-gold"
  | "matrix"
  | "custom";

export type SurfaceStyle = "glass" | "liquid";
export type ContentWidth = "narrow" | "default" | "wide" | "full";

export interface ThemeConfig {
  preset: ThemePresetId;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  surfaceStyle: SurfaceStyle;
  baseColor: string;
  elevatedColor: string;
  surfaceColor: string;
  gradientIntensity: number;
  glassBlur: number;
  glassOpacity: number;
  shadowDepth: number;
  fontScale: number;
  borderGlow: boolean;
  animatedBackground: boolean;
  showAmbientBackground: boolean;
  showTopBarSubtitle: boolean;
  density: "comfortable" | "compact";
  radiusScale: number;
  contentWidth: ContentWidth;
}

export const DEFAULT_THEME: ThemeConfig = {
  preset: "crimson",
  accentPrimary: "#ff2e4a",
  accentSecondary: "#ff6b8a",
  accentTertiary: "#c084fc",
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
};

export const CONTENT_WIDTH_CLASS: Record<ContentWidth, string> = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
  full: "max-w-none",
};

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "crimson", name: "Crimson", description: "Bold red with soft rose gradients", primary: "#ff2e4a", secondary: "#ff6b8a", tertiary: "#c084fc" },
  { id: "ember", name: "Ember", description: "Warm orange and amber fire", primary: "#f97316", secondary: "#fb923c", tertiary: "#fbbf24" },
  { id: "violet", name: "Violet Night", description: "Deep purple neon accents", primary: "#a855f7", secondary: "#c084fc", tertiary: "#818cf8" },
  { id: "ocean", name: "Ocean", description: "Cool cyan and teal currents", primary: "#06b6d4", secondary: "#22d3ee", tertiary: "#34d399" },
  { id: "rose-gold", name: "Rose Gold", description: "Luxury rose with gold highlights", primary: "#e11d48", secondary: "#fda4af", tertiary: "#fbbf24" },
  { id: "matrix", name: "Matrix", description: "Electric green cyber tones", primary: "#22c55e", secondary: "#4ade80", tertiary: "#06b6d4" },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex: string, amount = 0.12): string {
  const [r, g, b] = hexToRgb(hex);
  const lift = (c: number) => Math.min(255, Math.round(c + (255 - c) * amount));
  return `rgb(${lift(r)}, ${lift(g)}, ${lift(b)})`;
}

/** Single cohesive mesh — every stop fades into --bg-base so layers never band or crease. */
function buildAmbientGradient(p: string, s: string, t: string, intensity: number): string {
  const base = "var(--bg-base)";
  return [
    `radial-gradient(ellipse 160% 130% at 5% -8%, ${rgba(p, 0.16 + intensity * 0.12)} 0%, ${rgba(p, 0.05 + intensity * 0.04)} 38%, ${base} 72%)`,
    `radial-gradient(ellipse 150% 125% at 98% 108%, ${rgba(s, 0.13 + intensity * 0.1)} 0%, ${rgba(s, 0.04 + intensity * 0.03)} 40%, ${base} 74%)`,
    `radial-gradient(ellipse 120% 100% at 50% 58%, ${rgba(t, 0.07 + intensity * 0.07)} 0%, ${rgba(t, 0.025 + intensity * 0.02)} 48%, ${base} 78%)`,
    base,
  ].join(", ");
}

export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const intensity = theme.gradientIntensity / 100;
  const scale = theme.radiusScale;

  const { accentPrimary: p, accentSecondary: s, accentTertiary: t } = theme;

  root.style.setProperty("--bg-base", theme.baseColor);
  root.style.setProperty("--bg-elevated", theme.elevatedColor);
  root.style.setProperty("--bg-surface", theme.surfaceColor);
  root.style.setProperty("--bg-hover", lighten(theme.elevatedColor, 0.18));

  root.style.setProperty("--accent", p);
  root.style.setProperty("--accent-soft", s);
  root.style.setProperty("--accent-tertiary", t);

  root.style.setProperty("--labs", p);
  root.style.setProperty("--labs-dim", rgba(p, 0.1 + intensity * 0.06));
  root.style.setProperty("--labs-glow", rgba(p, 0.15 + intensity * 0.25));

  root.style.setProperty("--protocol", s);
  root.style.setProperty("--protocol-dim", rgba(s, 0.1 + intensity * 0.05));
  root.style.setProperty("--protocol-glow", rgba(s, 0.12 + intensity * 0.2));

  root.style.setProperty("--intel", t);
  root.style.setProperty("--intel-dim", rgba(t, 0.1 + intensity * 0.05));
  root.style.setProperty("--intel-glow", rgba(t, 0.12 + intensity * 0.18));

  root.style.setProperty("--gradient-primary", `linear-gradient(135deg, ${p} 0%, ${s} 50%, ${p} 100%)`);
  root.style.setProperty("--gradient-ambient", buildAmbientGradient(p, s, t, intensity));
  root.style.setProperty("--gradient-glass", `linear-gradient(145deg, ${rgba(p, 0.08)} 0%, ${rgba(s, 0.04)} 40%, transparent 100%)`);

  root.style.setProperty("--glass-blur", `${theme.glassBlur}px`);
  root.style.setProperty("--glass-bg", rgba("#ffffff", theme.glassOpacity / 100));
  root.style.setProperty("--glass-border", theme.borderGlow ? rgba(p, 0.18) : "rgba(255,255,255,0.07)");

  root.style.setProperty("--radius-sm", `${Math.round(8 * scale)}px`);
  root.style.setProperty("--radius-md", `${Math.round(14 * scale)}px`);
  root.style.setProperty("--radius-lg", `${Math.round(20 * scale)}px`);
  root.style.setProperty("--radius-xl", `${Math.round(28 * scale)}px`);

  root.style.setProperty("--space-unit", theme.density === "compact" ? "0.85" : "1");
  root.style.setProperty("--font-scale", String(theme.fontScale / 100));
  root.style.setProperty("--shadow-depth", String(theme.shadowDepth / 100));
  root.dataset.animatedBg = theme.animatedBackground ? "true" : "false";
  root.dataset.borderGlow = theme.borderGlow ? "true" : "false";
  root.dataset.surface = theme.surfaceStyle;
  root.dataset.showAmbientBg = theme.showAmbientBackground ? "true" : "false";
  root.dataset.contentWidth = theme.contentWidth;
}

export function presetToTheme(preset: ThemePreset): Partial<ThemeConfig> {
  return {
    preset: preset.id,
    accentPrimary: preset.primary,
    accentSecondary: preset.secondary,
    accentTertiary: preset.tertiary,
  };
}