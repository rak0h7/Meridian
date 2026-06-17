"use client";

import { Printer, AlertTriangle } from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { getCompoundById } from "@/data/compounds";
import { formatDate } from "@/lib/utils";
import { formatDose, hasAnabolicCompounds, hasHepatotoxicOrals } from "@/lib/cycleCalculations";
import { frequencyLabel } from "@/data/frequencies";
import { parseISO } from "date-fns";
import { ui } from "@/lib/ui";

export function ERCardView() {
  const { compounds, startDate } = useCycleStore();
  const hasAAS = hasAnabolicCompounds(compounds);
  const hasOrals = hasHepatotoxicOrals(compounds);

  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center gap-3">
        <button onClick={() => window.print()} className={`${ui.btnPrimary} gap-2`}>
          <Printer className="h-4 w-4" />
          Print Emergency Card
        </button>
        <p className={ui.sectionSub}>For paramedics, ER staff, or trusted contacts</p>
      </div>

      <div className={`${ui.card} mx-auto max-w-3xl border-2 border-[var(--danger)]/50 ${ui.cardPad}`}>
        <div className={`${ui.rowBetween} mb-6 flex-wrap border-b border-[var(--border)] pb-4`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-[var(--danger)]" />
            <h2 className="text-lg font-bold text-white">Emergency Medical Card</h2>
          </div>
          <span className={ui.sectionSub}>
            Generated: {formatDate(parseISO(startDate), "dd/MM/yyyy")}
          </span>
        </div>

        {(hasAAS || hasOrals) && (
          <div className="mb-6">
            <h3 className={`${ui.label} mb-3 text-[var(--danger)]`}>Critical Alerts</h3>
            <div className="space-y-2">
              {hasAAS && (
                <div className="rounded-lg border border-orange-900/40 bg-orange-950/20 p-3">
                  <p className="text-sm font-bold text-orange-400">AAS User</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted)]">
                    Exogenous androgens. Endogenous testosterone suppressed. HCT often elevated.
                    Cardiac hypertrophy possible. Lipid panel typically poor.
                  </p>
                </div>
              )}
              {hasOrals && (
                <div className="rounded-lg border border-orange-900/40 bg-orange-950/20 p-3">
                  <p className="text-sm font-bold text-orange-400">Hepatotoxic Orals</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted)]">
                    17α-alkylated oral steroids. Elevated ALT/AST baseline. Cholestasis risk.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className={`${ui.label} mb-3`}>Active Compounds</h3>
          {compounds.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No compounds in cycle.</p>
          ) : (
            <div className="space-y-3">
              {compounds.map((cc) => {
                const compound = getCompoundById(cc.compoundId);
                if (!compound) return null;
                return (
                  <div key={cc.compoundId} className="border-b border-[var(--border)] pb-2 last:border-0">
                    <p className="text-sm font-semibold text-white">{compound.name}</p>
                    <p className="text-[10px] text-[var(--muted)]">
                      {formatDose(cc.doseMg, compound.unit)} • {frequencyLabel(cc.frequency)}
                    </p>
                    <p className="text-[10px] text-[var(--muted-2)]">Weeks {cc.activeWeeks[0]}–{cc.activeWeeks[1]}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}