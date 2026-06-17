"use client";

import { useCycleStore } from "@/store/cycleStore";
import { CYCLE_TEMPLATES } from "@/data/compounds";
import { ui } from "@/lib/ui";

export function QuickStartTemplates() {
  const { loadTemplate } = useCycleStore();

  return (
    <div className={`${ui.cardProtocol} ${ui.cardPad}`}>
      <h3 className={ui.sectionTitle}>Quick-Start Templates</h3>
      <p className={`${ui.sectionSub} mb-4`}>Pre-configured cycles with typical doses and ancillaries</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CYCLE_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => loadTemplate(t.compounds, t.compounds[0]?.activeWeeks[1])}
            className={`${ui.cardInner} ${ui.cardHover} flex h-full flex-col p-4 text-left hover:border-[var(--protocol)]/30`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.color }} />
              <span className="text-sm font-bold text-[var(--foreground)]">{t.name}</span>
            </div>
            <p className="flex-1 text-[10px] leading-relaxed text-[var(--muted)]">{t.description}</p>
            <p className={`${ui.overline} mt-3`}>
              {t.compounds.length} compounds
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}