"use client";

import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ui } from "@/lib/ui";

export function DebugPanel({ onClose }: { onClose: () => void }) {
  const { currentValues, extractedMarkers, reports, reviewFlags } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-md">
      <div className={`w-full max-w-2xl ${ui.card} ${ui.cardPad}`}>
        <div className={`${ui.rowBetween} mb-6`}>
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">Debug</h2>
          <button onClick={onClose} className={ui.btnGhost}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className={`${ui.cardInner} p-4 text-sm`}>
            <p className="font-medium text-[var(--foreground)]">State</p>
            <p className="text-[var(--muted)]">Values: {Object.keys(currentValues).length}</p>
            <p className="text-[var(--muted)]">Extracted: {extractedMarkers.length}</p>
            <p className="text-[var(--muted)]">Reports: {reports.length}</p>
            <p className="text-[var(--muted)]">Flags: {reviewFlags.length}</p>
          </div>
          <pre className="max-h-60 overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-base)] p-3 font-mono text-[10px] text-[var(--labs)]">
            {JSON.stringify({ values: Object.keys(currentValues).length, flags: reviewFlags.length }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}