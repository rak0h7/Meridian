"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { BUILTIN_EXERCISES } from "@/data/exercises";
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS, type Equipment, type MuscleGroup } from "@/lib/gymTypes";
import { useGymStore } from "@/store/gymStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
  excludeIds?: string[];
}

export function ExercisePicker({ open, onClose, onSelect, excludeIds = [] }: ExercisePickerProps) {
  const { customExercises } = useGymStore();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [equipment, setEquipment] = useState<Equipment | "all">("all");

  const exercises = useMemo(() => {
    const all = [...BUILTIN_EXERCISES, ...customExercises].filter((e) => !excludeIds.includes(e.id));
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      if (muscle !== "all" && e.muscleGroup !== muscle) return false;
      if (equipment !== "all" && e.equipment !== equipment) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        MUSCLE_GROUP_LABELS[e.muscleGroup].toLowerCase().includes(q) ||
        EQUIPMENT_LABELS[e.equipment].toLowerCase().includes(q)
      );
    });
  }, [query, muscle, equipment, customExercises, excludeIds]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 top-[10%] z-[81] mx-auto max-h-[75vh] max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl sm:inset-x-auto"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <h3 className="font-display text-base font-semibold">Add Exercise</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--bg-hover)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 border-b border-[var(--border)] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exercises…"
                  className={cn(ui.input, "pl-9")}
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={muscle} onChange={(e) => setMuscle(e.target.value as MuscleGroup | "all")} className={cn(ui.input, "h-9 w-auto text-xs")}>
                  <option value="all">All muscles</option>
                  {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <select value={equipment} onChange={(e) => setEquipment(e.target.value as Equipment | "all")} className={cn(ui.input, "h-9 w-auto text-xs")}>
                  <option value="all">All equipment</option>
                  {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="max-h-[45vh] overflow-y-auto p-2">
              {exercises.length === 0 && (
                <li className="py-12 text-center text-sm text-[var(--muted)]">No exercises found</li>
              )}
              {exercises.map((ex) => (
                <li key={ex.id}>
                  <button
                    onClick={() => { onSelect(ex.id); setQuery(""); }}
                    className="flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-3 text-left transition hover:bg-[var(--bg-hover)]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{ex.name}</p>
                      <p className="text-[11px] text-[var(--muted)]">
                        {MUSCLE_GROUP_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipment]}
                        {ex.isCustom && " · Custom"}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-[var(--protocol)]" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}