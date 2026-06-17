"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { getExerciseById } from "@/data/exercises";
import { SET_TYPE_LABELS, type RoutineExercise, type SetType } from "@/lib/gymTypes";
import { useGymStore } from "@/store/gymStore";
import { ExercisePicker } from "./ExercisePicker";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

interface RoutineEditorProps {
  routineId: string | null;
  onClose: () => void;
}

export function RoutineEditor({ routineId, onClose }: RoutineEditorProps) {
  const { routines, saveRoutine, customExercises } = useGymStore();
  const existing = routineId ? routines.find((r) => r.id === routineId) : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [exercises, setExercises] = useState<RoutineExercise[]>(
    existing?.exercises ?? []
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  const addExercise = (exerciseId: string) => {
    if (exercises.some((e) => e.exerciseId === exerciseId)) return;
    setExercises([
      ...exercises,
      {
        exerciseId,
        order: exercises.length,
        sets: [
          { type: "normal", targetReps: 10 },
          { type: "normal", targetReps: 10 },
          { type: "normal", targetReps: 8 },
        ],
      },
    ]);
    setPickerOpen(false);
  };

  const save = () => {
    if (!name.trim()) return;
    saveRoutine({
      id: existing?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      exercises,
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <button onClick={onClose} className={cn(ui.btnGhost, "text-sm")}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
      </button>

      <div className={cn(ui.card, ui.cardPad, "space-y-4")}>
        <h2 className={ui.pageTitle}>{existing ? "Edit Program" : "New Program"}</h2>

        <div>
          <label className={ui.label}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={cn(ui.input, "mt-1.5")} placeholder="e.g. Push Day" />
        </div>
        <div>
          <label className={ui.label}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className={cn(ui.input, "mt-1.5")} placeholder="Optional" />
        </div>
      </div>

      {exercises.map((entry, ei) => {
        const ex = getExerciseById(entry.exerciseId, customExercises);
        return (
          <div key={entry.exerciseId} className={cn(ui.card, ui.cardPad)}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{ex?.name ?? entry.exerciseId}</p>
              <button
                onClick={() => setExercises(exercises.filter((_, i) => i !== ei))}
                className="text-[var(--danger)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {entry.sets.map((set, si) => (
                <div key={si} className="flex items-center gap-2">
                  <span className="w-6 font-mono text-xs text-[var(--muted)]">{si + 1}</span>
                  <select
                    value={set.type}
                    onChange={(e) => {
                      const next = [...exercises];
                      next[ei].sets[si].type = e.target.value as SetType;
                      setExercises(next);
                    }}
                    className={cn(ui.input, "h-9 w-28 text-xs")}
                  >
                    {Object.entries(SET_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={set.targetReps}
                    onChange={(e) => {
                      const next = [...exercises];
                      next[ei].sets[si].targetReps = parseInt(e.target.value, 10) || 0;
                      setExercises(next);
                    }}
                    className={cn(ui.input, "h-9 w-20 text-xs")}
                    placeholder="Reps"
                  />
                  <span className="text-xs text-[var(--muted)]">reps</span>
                  <button
                    onClick={() => {
                      const next = [...exercises];
                      next[ei].sets = next[ei].sets.filter((_, i) => i !== si);
                      setExercises(next);
                    }}
                    className="ml-auto text-[var(--muted-2)] hover:text-[var(--danger)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const next = [...exercises];
                  next[ei].sets.push({ type: "normal", targetReps: 10 });
                  setExercises(next);
                }}
                className={cn(ui.btnGhost, "text-xs")}
              >
                <Plus className="mr-1 h-3 w-3" /> Add set
              </button>
            </div>
          </div>
        );
      })}

      <button onClick={() => setPickerOpen(true)} className={cn(ui.btnSecondary, "w-full justify-center")}>
        <Plus className="mr-2 h-4 w-4" /> Add Exercise
      </button>

      <button onClick={save} disabled={!name.trim() || exercises.length === 0} className={cn(ui.btnProtocol, "w-full justify-center py-3 disabled:opacity-40")}>
        Save Program
      </button>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addExercise}
        excludeIds={exercises.map((e) => e.exerciseId)}
      />
    </div>
  );
}