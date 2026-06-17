"use client";

import { useState } from "react";
import { X, Trash2, BookOpen } from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { getCompoundById } from "@/data/compounds";
import { getProfileForCompound } from "@/data/compoundProfiles";
import { FREQUENCY_OPTIONS } from "@/data/frequencies";
import type { CycleCompound } from "@/lib/cycleTypes";
import type { Compound } from "@/data/compounds";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { FrequencyPattern } from "@/data/frequencies";

function ConfigureForm({
  entry,
  compound,
  totalWeeks,
  onSave,
  onRemove,
}: {
  entry: CycleCompound;
  compound: Compound;
  totalWeeks: number;
  onSave: (updates: Partial<CycleCompound>) => void;
  onRemove: () => void;
}) {
  const [dose, setDose] = useState(String(entry.doseMg));
  const [frequency, setFrequency] = useState<FrequencyPattern>(entry.frequency);
  const [weekStart, setWeekStart] = useState(String(entry.activeWeeks[0]));
  const [weekEnd, setWeekEnd] = useState(String(entry.activeWeeks[1]));

  const handleSave = () => {
    const doseMg = parseFloat(dose);
    if (isNaN(doseMg) || doseMg <= 0) return;
    const start = Math.max(1, parseInt(weekStart, 10) || 1);
    const end = Math.min(totalWeeks, Math.max(start, parseInt(weekEnd, 10) || totalWeeks));
    onSave({ doseMg, frequency, activeWeeks: [start, end] });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className={ui.label}>Dose ({compound.unit})</label>
          <input type="number" step="any" value={dose} onChange={(e) => setDose(e.target.value)} className={ui.input} />
          <p className="text-[10px] text-[var(--muted)]">{compound.dosageInfo}</p>
        </div>
        <div className="space-y-2">
          <label className={ui.label}>Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as FrequencyPattern)} className={ui.input}>
            {FREQUENCY_OPTIONS.map((f) => (
              <option key={f.id} value={f.pattern}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className={ui.label}>Active From</label>
            <input type="number" min={1} max={totalWeeks} value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className={ui.input} />
          </div>
          <div className="space-y-2">
            <label className={ui.label}>Active Until</label>
            <input type="number" min={1} max={totalWeeks} value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} className={ui.input} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <button onClick={handleSave} className={`flex-1 ${ui.btnProtocol}`}>Save</button>
        <button
          onClick={onRemove}
          className={cn(ui.btnSecondary, "gap-1.5 text-xs font-bold uppercase", ui.statDanger)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </>
  );
}

export function CompoundConfigureModal() {
  const {
    configuringCompoundId,
    setConfiguringCompoundId,
    compounds,
    updateCompound,
    removeCompound,
    getEffectiveWeeks,
    openProfile,
  } = useCycleStore();

  const entry = compounds.find((c) => c.compoundId === configuringCompoundId);
  const compound = configuringCompoundId ? getCompoundById(configuringCompoundId) : null;
  const profile = configuringCompoundId ? getProfileForCompound(configuringCompoundId) : null;

  if (!configuringCompoundId || !compound || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/80 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md ${ui.cardProtocol} ${ui.cardPad} shadow-2xl`}>
        <div className={`${ui.rowBetween} mb-5`}>
          <div>
            <p className={ui.label}>Configure</p>
            <h2 className="text-lg font-bold text-[var(--foreground)]">{compound.name}</h2>
          </div>
          <button
            onClick={() => setConfiguringCompoundId(null)}
            className={cn(ui.btnGhost, "h-9 w-9 rounded-[var(--radius-sm)] p-0")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {profile && (
          <button
            type="button"
            onClick={() => openProfile(profile.id)}
            className={cn(ui.btnGhost, "mb-4 w-full gap-2 text-xs text-[var(--protocol)]")}
          >
            <BookOpen className="h-3.5 w-3.5" />
            View full compound profile
          </button>
        )}
        <ConfigureForm
          key={configuringCompoundId}
          entry={entry}
          compound={compound}
          totalWeeks={getEffectiveWeeks()}
          onSave={(updates) => {
            updateCompound(configuringCompoundId, updates);
            setConfiguringCompoundId(null);
          }}
          onRemove={() => removeCompound(configuringCompoundId)}
        />
      </div>
    </div>
  );
}