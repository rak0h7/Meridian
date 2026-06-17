"use client";

import { X } from "lucide-react";
import { MARKERS_BY_CATEGORY, CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/markers";
import { ui } from "@/lib/ui";

export function CheatSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-md">
      <div className={`w-full max-w-3xl ${ui.card} ${ui.cardPad}`}>
        <div className={`${ui.rowBetween} mb-6`}>
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">Marker Reference</h2>
          <button onClick={onClose} className={ui.btnGhost}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] space-y-6 overflow-y-auto">
          {CATEGORY_ORDER.map((cat) => {
            const markers = MARKERS_BY_CATEGORY[cat];
            if (!markers?.length) return null;
            return (
              <section key={cat}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--labs)]">
                  {CATEGORY_LABELS[cat]}
                </h3>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {markers.map((m) => (
                    <div key={m.id} className={`${ui.cardInner} flex justify-between px-3 py-2 text-xs`}>
                      <span className="text-[var(--foreground)]">{m.name}</span>
                      <span className="text-[var(--muted)]">{m.defaultUnit}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}