"use client";

import { X, Search, BookOpen } from "lucide-react";
import { useCycleStore } from "@/store/cycleStore";
import { COMPOUNDS, COMPOUND_CATEGORIES } from "@/data/compounds";
import { getProfileForCompound } from "@/data/compoundProfiles";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function CompoundBrowser() {
  const {
    compoundModalOpen,
    setCompoundModalOpen,
    compoundCategory,
    setCompoundCategory,
    compoundSearch,
    setCompoundSearch,
    addAndConfigure,
    compounds,
    openProfile,
  } = useCycleStore();

  if (!compoundModalOpen) return null;

  const filtered = COMPOUNDS.filter((c) => {
    const matchesCategory = c.category === compoundCategory;
    const matchesSearch =
      !compoundSearch ||
      c.name.toLowerCase().includes(compoundSearch.toLowerCase()) ||
      c.shortName.toLowerCase().includes(compoundSearch.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(compoundSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addedIds = new Set(compounds.map((c) => c.compoundId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/80 p-4 backdrop-blur-sm">
      <div className={`flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--protocol)]/20 bg-[var(--protocol-dim)] shadow-2xl`}>
        <div className={`${ui.rowBetween} border-b border-[var(--border)] px-5 py-4`}>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Choose a Compound</h2>
          <button
            onClick={() => setCompoundModalOpen(false)}
            className={cn(ui.btnGhost, "h-9 w-9 rounded-[var(--radius-sm)] p-0")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-shrink-0 space-y-4 px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder={`Search ${COMPOUNDS.length} compounds…`}
              value={compoundSearch}
              onChange={(e) => setCompoundSearch(e.target.value)}
              className={`${ui.input} pl-10`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {COMPOUND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCompoundCategory(cat.id)}
                className={cn(
                  "inline-flex h-8 items-center rounded-full px-3 text-[10px] font-bold uppercase tracking-wider transition-all",
                  compoundCategory === cat.id
                    ? ui.pillProtocolActive
                    : ui.pillInactive
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-5 pb-5">
          {filtered.map((compound) => {
            const profile = getProfileForCompound(compound.id);
            return (
              <div
                key={compound.id}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] p-3 transition",
                  addedIds.has(compound.id)
                    ? "border border-[var(--protocol)]/25 bg-[var(--bg-surface)]"
                    : "hover:bg-[var(--bg-hover)]"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{compound.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {compound.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-[var(--muted-2)]">{compound.dosageInfo}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {profile && (
                    <button
                      type="button"
                      onClick={() => openProfile(profile.id)}
                      className={cn(ui.btnGhost, "h-8 gap-1 px-2.5 text-[10px] font-semibold uppercase")}
                      title={`Read ${profile.title} profile`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Guide
                    </button>
                  )}
                  <button
                    onClick={() => addAndConfigure(compound.id)}
                    className={cn(ui.btnProtocol, "h-8 shrink-0 rounded-[var(--radius-sm)] px-4 text-[10px] font-bold uppercase")}
                    style={{ background: compound.color }}
                  >
                    {addedIds.has(compound.id) ? "Edit" : "Configure"}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--muted)]">No compounds match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}