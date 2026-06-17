"use client";

import { useApp } from "@/context/AppContext";
import { MARKER_MAP } from "@/lib/markers";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { MarkerCategory } from "@/lib/types";
import { ArrowLeft, ArrowUp, Minus } from "lucide-react";
import { Fragment, useMemo } from "react";

const SECTIONS: { label: string; categories: MarkerCategory[] }[] = [
  { label: "CBC", categories: ["cbc"] },
  { label: "Electrolytes", categories: ["electrolytes"] },
  { label: "Hormones", categories: ["hormonal"] },
  { label: "Kidney", categories: ["kidney"] },
  { label: "Cardiovascular", categories: ["cardiovascular"] },
  { label: "Liver", categories: ["liver"] },
];

export function ComparisonView() {
  const { reports, compareReportIds, setShowComparison } = useApp();

  const [reportA, reportB] = useMemo(() => {
    const a = reports.find((r) => r.id === compareReportIds[0]);
    const b = reports.find((r) => r.id === compareReportIds[1]);
    return [a, b];
  }, [reports, compareReportIds]);

  if (!reportA || !reportB) return null;

  const valuesA = new Map(reportA.values.map((v) => [v.markerId, v]));
  const valuesB = new Map(reportB.values.map((v) => [v.markerId, v]));

  const allIds = new Set([...valuesA.keys(), ...valuesB.keys()]);

  let increased = 0;
  let decreased = 0;
  let unchanged = 0;
  let onlyOne = 0;

  for (const id of allIds) {
    const a = valuesA.get(id);
    const b = valuesB.get(id);
    if (!a || !b) { onlyOne++; continue; }
    if (a.value > b.value) increased++;
    else if (a.value < b.value) decreased++;
    else unchanged++;
  }

  const formatName = (name: string) => name.length > 14 ? name.slice(0, 14) : name;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowComparison(false)}
          className={cn(ui.btnGhost, "text-xs")}
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>
        <span className={cn(ui.overline, "text-[var(--intel)]")}>Full Comparison</span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { label: "Increased", count: increased, color: "border-[var(--intel)]/30 bg-[var(--intel-dim)] text-[var(--intel)]" },
          { label: "Decreased", count: decreased, color: "border-[var(--labs)]/30 bg-[var(--labs-dim)] text-[var(--labs)]" },
          { label: "Unchanged", count: unchanged, color: "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--muted)]" },
          { label: "Only in One", count: onlyOne, color: "border-[var(--intel)]/30 bg-[var(--intel-dim)] text-[var(--intel)]" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-[var(--radius-md)] border p-3 text-center", s.color)}>
            <p className="font-display text-2xl font-bold">{s.count}</p>
            <p className={ui.overline}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs font-semibold text-[var(--muted)]">
        <span>{formatName(reportA.name)} {reportA.date}</span>
        <span>{formatName(reportB.name)} {reportB.date}</span>
      </div>

      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
              <th className="p-3 text-left">Marker</th>
              <th className="p-3 text-right">{formatName(reportA.name)}</th>
              <th className="p-3 text-right">{formatName(reportB.name)}</th>
              <th className="p-3 text-right">Δ Change</th>
              <th className="p-3 text-left">Visual</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => {
              const sectionMarkers = [...allIds].filter((id) => {
                const m = MARKER_MAP.get(id);
                return m && section.categories.includes(m.category);
              });
              if (sectionMarkers.length === 0) return null;

              return (
                <Fragment key={section.label}>
                  <tr className="bg-[var(--bg-elevated)]">
                    <td colSpan={5} className={cn("p-2", ui.overline)}>
                      {section.label}
                    </td>
                  </tr>
                  {sectionMarkers.map((id) => {
                    const marker = MARKER_MAP.get(id)!;
                    const a = valuesA.get(id);
                    const b = valuesB.get(id);

                    let change = "";
                    let arrow = <Minus className="inline h-3 w-3 text-[var(--muted-2)]" />;
                    let barWidth = 0;

                    if (a && b) {
                      const diff = a.value - b.value;
                      const pct = b.value !== 0 ? Math.round((diff / b.value) * 100) : 0;
                      change = `${diff > 0 ? "+" : ""}${diff.toFixed(1)} (${pct > 0 ? "+" : ""}${pct}%)`;
                      if (diff > 0) {
                        arrow = <ArrowUp className="inline h-3 w-3 text-[var(--danger)]" />;
                        barWidth = Math.min(100, Math.abs(pct));
                      } else if (diff < 0) {
                        barWidth = Math.min(100, Math.abs(pct));
                      }
                    } else if (a && !b) {
                      change = "only A";
                    } else {
                      change = "new";
                    }

                    return (
                      <tr key={id} className="border-b border-[var(--border)] transition hover:bg-[var(--bg-hover)]">
                        <td className="p-3 font-medium text-[var(--foreground)]">{marker.name}</td>
                        <td className="p-3 text-right text-[var(--muted)]">
                          {a ? `${a.value} ${a.unit}` : "—"} {a && b && arrow}
                        </td>
                        <td className="p-3 text-right text-[var(--foreground)]">
                          {b ? `${b.value} ${b.unit}` : "—"}
                        </td>
                        <td className="p-3 text-right text-[var(--muted)]">{change}</td>
                        <td className="p-3">
                          {barWidth > 0 && (
                            <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-[var(--bg-hover)]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--intel)] to-[var(--labs)]"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}