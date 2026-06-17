/** Chart colors — reads live accent from CSS variables when available */
export function getChartColors(): string[] {
  if (typeof document === "undefined") {
    return ["#ff2e4a", "#ff6b8a", "#c084fc", "#34d399", "#38bdf8", "#fbbf24"];
  }
  const style = getComputedStyle(document.documentElement);
  const primary = style.getPropertyValue("--accent").trim() || "#ff2e4a";
  const secondary = style.getPropertyValue("--accent-soft").trim() || "#ff6b8a";
  const tertiary = style.getPropertyValue("--accent-tertiary").trim() || "#c084fc";
  return [primary, secondary, tertiary, "#34d399", "#38bdf8", "#fbbf24"];
}

export function getChartTheme() {
  if (typeof document === "undefined") {
    return { grid: "#1c2230", axis: "#7a8494", accent: "#ff2e4a", tooltip: { background: "#151a24", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 11, color: "#eef1f6" } };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    grid: "#1c2230",
    axis: "#7a8494",
    accent: style.getPropertyValue("--accent").trim() || "#ff2e4a",
    labs: style.getPropertyValue("--labs").trim() || "#ff2e4a",
    tooltip: {
      background: "#151a24",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      fontSize: 11,
      color: "#eef1f6",
    },
  };
}