"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompoundCategory } from "@/data/compounds";
import { getCompoundById } from "@/data/compounds";
import { DEFAULT_DOSES } from "@/data/frequencies";
import type { CycleCompound } from "@/lib/cycleTypes";
import { format } from "date-fns";

export type { CycleCompound };

interface CycleState {
  weeks: number;
  customWeeks: string;
  startDate: string;
  compounds: CycleCompound[];
  compoundModalOpen: boolean;
  configuringCompoundId: string | null;
  compoundCategory: CompoundCategory;
  compoundSearch: string;
  dashboardTab: string;
  view: "planner" | "dashboard" | "guides";
  selectedGuideId: string | null;
  profileModalId: string | null;

  setWeeks: (weeks: number) => void;
  setCustomWeeks: (val: string) => void;
  setStartDate: (date: string) => void;
  addAndConfigure: (compoundId: string) => void;
  updateCompound: (compoundId: string, updates: Partial<CycleCompound>) => void;
  removeCompound: (compoundId: string) => void;
  setCompoundModalOpen: (open: boolean) => void;
  setConfiguringCompoundId: (id: string | null) => void;
  setCompoundCategory: (cat: CompoundCategory) => void;
  setCompoundSearch: (search: string) => void;
  setDashboardTab: (tab: string) => void;
  setView: (view: "planner" | "dashboard" | "guides") => void;
  setSelectedGuideId: (id: string | null) => void;
  setProfileModalId: (id: string | null) => void;
  openProfile: (profileId: string) => void;
  openGuidesAt: (profileId: string) => void;
  loadTemplate: (compounds: CycleCompound[], weeks?: number) => void;
  clearCycle: () => void;
  getEffectiveWeeks: () => number;
}

function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

function makeDefaultCompound(compoundId: string, totalWeeks: number): CycleCompound | null {
  const compound = getCompoundById(compoundId);
  if (!compound) return null;
  const defaults = DEFAULT_DOSES[compoundId];
  return {
    compoundId,
    doseMg: defaults?.doseMg ?? 100,
    frequency: defaults?.frequency ?? "weekly",
    activeWeeks: [1, totalWeeks],
    route: compound.route,
  };
}

export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      weeks: 12,
      customWeeks: "",
      startDate: todayISO(),
      compounds: [],
      compoundModalOpen: false,
      configuringCompoundId: null,
      compoundCategory: "anabolics",
      compoundSearch: "",
      dashboardTab: "calendar",
      view: "planner",
      selectedGuideId: null,
      profileModalId: null,

      setWeeks: (weeks) => set({ weeks, customWeeks: "" }),
      setCustomWeeks: (val) => set({ customWeeks: val }),
      setStartDate: (date) => set({ startDate: date }),
      addAndConfigure: (compoundId) => {
        const existing = get().compounds.find((c) => c.compoundId === compoundId);
        if (existing) {
          set({ configuringCompoundId: compoundId, compoundModalOpen: false });
          return;
        }
        const entry = makeDefaultCompound(compoundId, get().getEffectiveWeeks());
        if (!entry) return;
        set({
          compounds: [...get().compounds, entry],
          configuringCompoundId: compoundId,
          compoundModalOpen: false,
        });
      },
      updateCompound: (compoundId, updates) =>
        set({
          compounds: get().compounds.map((c) =>
            c.compoundId === compoundId ? { ...c, ...updates } : c
          ),
        }),
      removeCompound: (compoundId) =>
        set({
          compounds: get().compounds.filter((c) => c.compoundId !== compoundId),
          configuringCompoundId:
            get().configuringCompoundId === compoundId ? null : get().configuringCompoundId,
        }),
      setCompoundModalOpen: (open) =>
        set({ compoundModalOpen: open, compoundSearch: open ? get().compoundSearch : "" }),
      setConfiguringCompoundId: (id) => set({ configuringCompoundId: id }),
      setCompoundCategory: (cat) => set({ compoundCategory: cat }),
      setCompoundSearch: (search) => set({ compoundSearch: search }),
      setDashboardTab: (tab) => set({ dashboardTab: tab }),
      setView: (view) => set({ view }),
      setSelectedGuideId: (id) => set({ selectedGuideId: id }),
      setProfileModalId: (id) => set({ profileModalId: id }),
      openProfile: (profileId) => set({ profileModalId: profileId }),
      openGuidesAt: (profileId) =>
        set({ view: "guides", selectedGuideId: profileId, profileModalId: null }),
      loadTemplate: (compounds, weeks) =>
        set({ compounds, weeks: weeks ?? get().weeks, customWeeks: "" }),
      clearCycle: () => set({ compounds: [], configuringCompoundId: null }),
      getEffectiveWeeks: () => {
        const { weeks, customWeeks } = get();
        const custom = parseInt(customWeeks, 10);
        return custom > 0 ? custom : weeks;
      },
    }),
    { name: "cycle-planner-store-v2" }
  )
);