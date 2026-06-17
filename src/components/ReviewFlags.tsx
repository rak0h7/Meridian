"use client";

import { useApp } from "@/context/AppContext";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Severity } from "@/lib/types";

const SEVERITY_STYLES: Record<Severity, string> = {
  normal: "border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]",
  yellow: "border-[var(--warning)]/30 bg-[var(--warning)]/15 text-[var(--warning)]",
  high: "border-[var(--danger)]/30 bg-[var(--danger)]/15 text-[var(--danger)]",
  low: "border-[var(--intel)]/30 bg-[var(--intel-dim)] text-[var(--intel)]",
  stop: "border-[var(--danger)]/50 bg-[var(--danger)]/20 text-[var(--danger)]",
};

export function ReviewFlags() {
  const { reviewFlags, rangeMode, setRangeMode, extractionFileName, currentValues, saveReport, setMainTab } = useApp();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markerCount = Object.keys(currentValues).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={cn(ui.pageTitle, "text-[var(--labs)]")}>Review Flags</h2>
          <p className="text-[10px] text-[var(--muted)]">
            {extractionFileName || "manual entry"} • {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRangeMode(rangeMode === "lab" ? "optimized" : "lab")}
            className={cn(ui.btnSecondary, "h-8 text-[10px] font-bold uppercase")}
          >
            {rangeMode === "lab" ? "Lab Reference Mode" : "Optimized Match"} • Switch
          </button>
          <button
            onClick={() => setRangeMode("optimized")}
            className={cn(
              ui.btnSecondary,
              "h-8 border-[var(--protocol)]/30 bg-[var(--protocol-dim)] text-[10px] font-bold uppercase text-[var(--protocol)]"
            )}
          >
            1–3 Optimize Lab Range
          </button>
        </div>
      </div>

      <Panel className="p-3 text-xs text-[var(--muted)]">
        <span className="font-bold uppercase text-[var(--foreground)]">Extraction Summary</span>{" "}
        {markerCount} current markers • {reviewFlags.length} need review • 0 historical readings noted • 0 duplicates resolved
        <br />
        Active report date: {new Date().toLocaleDateString("en-GB")}
      </Panel>

      <Panel
        variant="protocol"
        className="p-4 text-xs text-[var(--foreground)]/80"
      >
        <AlertTriangle className="mb-1 inline h-4 w-4 text-[var(--warning)]" />{" "}
        <strong>Interpretation only.</strong> This is not medical advice. Do not stop, or change any medication,
        treatment, or cycle based on this automated read. Discuss any concerns — especially repeat-tested
        abnormalities — with a qualified clinician.
      </Panel>

      {reviewFlags.length === 0 ? (
        <Panel className="border-[var(--success)]/30 bg-[var(--success)]/5 p-8 text-center">
          <p className="text-[var(--success)]">No flags — all assessed markers within range.</p>
          <button
            onClick={() => setMainTab("insights")}
            className={cn(ui.btnPrimary, "mt-4 text-xs font-bold uppercase")}
          >
            View Insights
          </button>
        </Panel>
      ) : (
        <div className="space-y-2">
          {reviewFlags.map((flag) => (
            <Panel
              key={flag.markerId}
              className="border-l-4 border-l-[var(--warning)] p-0"
            >
              <button
                onClick={() => toggle(flag.markerId)}
                className="flex w-full items-start justify-between p-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-[var(--foreground)]">{flag.name}</span>
                    <span className="text-[10px] text-[var(--muted)]">{flag.date}</span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", SEVERITY_STYLES[flag.severity])}>
                      {flag.severity === "stop" ? "STOP" : flag.severity.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-[var(--muted-2)]">Interpretation only - No dosing</span>
                  </div>
                  <p className={cn("mt-1 text-sm font-bold", ui.statDanger)}>
                    {flag.value} {flag.unit}
                    {flag.sourceUnit && flag.sourceUnit !== flag.unit && (
                      <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                        (source {flag.sourceValue} {flag.sourceUnit})
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    Lab: {flag.labRange} | Optimal: {flag.optimalRange}
                    {flag.cautionRange && ` | Caution: ${flag.cautionRange}`}
                    {flag.strictThreshold && ` | Strict threshold: #${flag.strictThreshold}`}
                  </p>
                  {expanded.has(flag.markerId) && (
                    <p className="mt-2 text-xs text-[var(--warning)]">{flag.deviation}</p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--muted)] transition",
                    expanded.has(flag.markerId) && "rotate-180"
                  )}
                />
              </button>
            </Panel>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => {
            saveReport();
            setMainTab("insights");
          }}
          className={cn(ui.btnPrimary, "text-xs font-bold uppercase")}
        >
          Save & View Insights
        </button>
      </div>
    </div>
  );
}