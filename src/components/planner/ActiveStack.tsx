"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { getCompoundById } from "@/data/compounds";
import { frequencyLabel } from "@/data/frequencies";
import { formatDose } from "@/lib/cycleCalculations";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function ActiveStack() {
  const {
    compounds,
    setCompoundModalOpen,
    setConfiguringCompoundId,
    removeCompound,
    clearCycle,
  } = useCycleStore();

  return (
    <div className={`${ui.cardProtocol} ${ui.cardPad}`}>
      <div className={`${ui.rowBetween} mb-4 flex-wrap`}>
        <div>
          <h3 className={ui.sectionTitle}>Active Stack</h3>
          <p className={ui.sectionSub}>
            {compounds.length === 0
              ? "No compounds added yet"
              : `${compounds.length} compound${compounds.length !== 1 ? "s" : ""} configured`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {compounds.length > 0 && (
            <button
              onClick={clearCycle}
              className={cn(ui.btnGhost, "h-8 text-[10px] font-bold uppercase", ui.statDanger)}
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setCompoundModalOpen(true)}
            className={cn(ui.btnProtocol, "h-8 gap-1.5 rounded-full px-3 text-[10px] font-bold uppercase")}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>

      {compounds.length === 0 ? (
        <div className="flex min-h-[5rem] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)]">
          <p className="text-sm text-[var(--muted)]">Browse compounds or pick a template to build your cycle.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {compounds.map((cc) => {
            const compound = getCompoundById(cc.compoundId);
            if (!compound) return null;
            return (
              <div
                key={cc.compoundId}
                className={cn(ui.cardInner, ui.cardHover, "flex items-center gap-3 p-3 hover:border-[var(--protocol)]/25")}
              >
                <div
                  className="h-9 w-1 shrink-0 self-stretch rounded-full"
                  style={{ background: compound.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{compound.name}</p>
                  <p className="text-[10px] text-[var(--muted)]">
                    {formatDose(cc.doseMg, compound.unit)} • {frequencyLabel(cc.frequency)} • Wk {cc.activeWeeks[0]}–{cc.activeWeeks[1]}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => setConfiguringCompoundId(cc.compoundId)}
                    className={cn(ui.btnGhost, "h-8 w-8 rounded-[var(--radius-sm)] p-0")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeCompound(cc.compoundId)}
                    className={cn(ui.btnGhost, "h-8 w-8 rounded-[var(--radius-sm)] p-0 hover:text-[var(--danger)]")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}