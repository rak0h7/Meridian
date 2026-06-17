"use client";

import { useCycleStore } from "@/store/cycleStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const DURATION_OPTIONS = [4, 8, 10, 12, 16, 20];

export function CycleInputPanel() {
  const {
    customWeeks,
    startDate,
    setWeeks,
    setCustomWeeks,
    setStartDate,
    setCompoundModalOpen,
    getEffectiveWeeks,
  } = useCycleStore();

  const effective = getEffectiveWeeks();

  return (
    <div className={`${ui.cardProtocol} ${ui.cardPad}`}>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <label className={ui.label}>Cycle Duration</label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((w) => (
              <button
                key={w}
                onClick={() => setWeeks(w)}
                className={cn(
                  effective === w && !customWeeks ? ui.pillProtocolActive : ui.pillInactive
                )}
              >
                {w}w
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <label className={ui.label}>Custom Weeks</label>
            <input
              type="number"
              placeholder="e.g. 14"
              value={customWeeks}
              onChange={(e) => setCustomWeeks(e.target.value)}
              className={ui.input}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={ui.label}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={ui.input}
          />
        </div>

        <div className="space-y-2">
          <label className={ui.label}>Add Compound</label>
          <button
            onClick={() => setCompoundModalOpen(true)}
            className={`${ui.btnProtocol} w-full`}
          >
            + Browse Compounds
          </button>
        </div>
      </div>
    </div>
  );
}