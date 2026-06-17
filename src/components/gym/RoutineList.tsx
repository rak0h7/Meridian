"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Dumbbell, Play, Plus, Trash2 } from "lucide-react";
import { ROUTINE_TEMPLATES } from "@/data/routineTemplates";
import { getExerciseById } from "@/data/exercises";
import { useGymStore } from "@/store/gymStore";
import { useNavigation } from "@/context/NavigationContext";
import { useToast } from "@/context/ToastContext";
import { RoutineEditor } from "./RoutineEditor";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function RoutineList() {
  const {
    routines, startFromRoutine, deleteRoutine, duplicateRoutine,
    editingRoutineId, setEditingRoutineId, customExercises,
  } = useGymStore();
  const { setRoute } = useNavigation();
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);

  const allRoutines = [...ROUTINE_TEMPLATES, ...routines.filter((r) => !r.isTemplate)];

  const handleStart = (routine: typeof allRoutines[0]) => {
    startFromRoutine(routine);
    setRoute("gym-workout");
    toast({ type: "success", title: `${routine.name} started` });
  };

  if (showEditor || editingRoutineId) {
    return (
      <RoutineEditor
        routineId={editingRoutineId}
        onClose={() => { setShowEditor(false); setEditingRoutineId(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={ui.pageTitle}>Programs</h2>
          <p className={ui.pageSub}>Build routines or start from built-in templates</p>
        </div>
        <button onClick={() => setShowEditor(true)} className={ui.btnProtocol}>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </button>
      </div>

      {allRoutines.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          variant="protocol"
          title="No programs yet"
          description="Create a custom program or use a built-in template to structure your training."
          action={<button onClick={() => setShowEditor(true)} className={ui.btnProtocol}>Create Program</button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allRoutines.map((routine, i) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(ui.card, ui.cardPad)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{routine.name}</p>
                  {routine.description && (
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{routine.description}</p>
                  )}
                  <p className="mt-2 text-[11px] text-[var(--muted-2)]">
                    {routine.exercises.length} exercises · {routine.exercises.reduce((s, e) => s + e.sets.length, 0)} sets
                    {routine.isTemplate && " · Template"}
                  </p>
                </div>
                <button
                  onClick={() => handleStart(routine)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full [background:var(--gradient-primary)] text-white shadow-[0_4px_16px_var(--protocol-glow)]"
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>

              <ul className="mt-3 space-y-1 border-t border-[var(--border)] pt-3">
                {routine.exercises.slice(0, 4).map((re) => {
                  const ex = getExerciseById(re.exerciseId, customExercises);
                  return (
                    <li key={re.exerciseId} className="text-[11px] text-[var(--muted)]">
                      {ex?.name ?? re.exerciseId} — {re.sets.length} sets
                    </li>
                  );
                })}
                {routine.exercises.length > 4 && (
                  <li className="text-[11px] text-[var(--muted-2)]">+{routine.exercises.length - 4} more</li>
                )}
              </ul>

              {!routine.isTemplate && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingRoutineId(routine.id)}
                    className={cn(ui.btnGhost, "text-xs")}
                  >
                    Edit
                  </button>
                  <button onClick={() => duplicateRoutine(routine.id)} className={cn(ui.btnGhost, "text-xs")}>
                    <Copy className="mr-1 h-3 w-3" /> Duplicate
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className={cn(ui.btnGhost, "ml-auto text-xs text-[var(--danger)]")}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}