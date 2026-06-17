"use client";

import { useApp } from "@/context/AppContext";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Flame, Check } from "lucide-react";

export function ExtractionReview() {
  const {
    extractedMarkers,
    extractionFileName,
    toggleExtracted,
    selectAllCurrent,
    selectAbnormalOnly,
    selectConvertedOnly,
    deselectAll,
    applySelected,
    setLogView,
  } = useApp();

  const current = extractedMarkers.filter((m) => !m.isHistorical);
  const previous = extractedMarkers.filter((m) => m.isHistorical);
  const review = extractedMarkers.filter((m) => m.needsReview);

  const statusColor = (status: string) => {
    if (status === "lab-normal") return "border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]";
    if (status === "high") return "border-[var(--danger)]/30 bg-[var(--danger)]/15 text-[var(--danger)]";
    return "border-[var(--intel)]/30 bg-[var(--intel-dim)] text-[var(--intel)]";
  };

  return (
    <div className="space-y-4">
      <Panel variant="labs" className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[var(--labs)]" />
            <div>
              <h2 className="font-display text-sm font-semibold uppercase text-[var(--foreground)]">
                Extracted from {extractionFileName}
              </h2>
              <p className="text-[10px] text-[var(--muted)]">
                {current.length} current | {previous.length} previous | {review.length} review
              </p>
            </div>
          </div>
          <button
            onClick={() => setLogView("entry")}
            className={cn(ui.btnGhost, "text-xs")}
          >
            ← Back to Entry
          </button>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Select All Current", action: selectAllCurrent },
            { label: "Lab-Abnormal Only", action: selectAbnormalOnly },
            { label: "Converted Only", action: selectConvertedOnly },
            { label: "Deselect All", action: deselectAll },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={cn(ui.btnSecondary, "h-8 px-3 text-[10px] font-bold uppercase")}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button
          onClick={applySelected}
          className={cn(ui.btnPrimary, "rounded-full px-5 text-xs font-bold uppercase shadow-[0_0_20px_var(--labs-glow)]")}
        >
          Apply Selected →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {extractedMarkers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => toggleExtracted(marker.id)}
            className={cn(
              "relative rounded-[var(--radius-md)] border p-3 text-left transition",
              marker.selected
                ? "border-[var(--labs)]/50 bg-[var(--labs-dim)]"
                : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
            )}
          >
            {marker.selected && (
              <div className="absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded bg-[var(--labs)]">
                <Check className="h-3 w-3 text-[var(--bg-base)]" />
              </div>
            )}
            <p className="mt-4 text-[11px] font-semibold text-[var(--foreground)]">{marker.name}</p>
            <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
              {marker.value} <span className="text-xs font-normal text-[var(--muted)]">{marker.unit}</span>
            </p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">{marker.date}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase", statusColor(marker.labStatus))}>
                {marker.labStatus === "lab-normal" ? "Lab-Normal" : marker.labStatus}
              </span>
              <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--success)]">
                {marker.converted ? "Converted" : "Same Unit"}
              </span>
            </div>
            {marker.sourceUnit && marker.sourceUnit !== marker.unit && (
              <p className="mt-1 text-[9px] text-[var(--muted-2)]">
                Source: {marker.sourceValue} {marker.sourceUnit}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}