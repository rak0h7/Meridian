"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check, ChevronDown, ChevronUp, Clock, Dumbbell, Plus, Trash2, Trophy,
} from "lucide-react";
import { format } from "date-fns";
import { getExerciseById } from "@/data/exercises";
import {
  MUSCLE_GROUP_LABELS,
  SET_TYPE_LABELS,
  type SetType,
} from "@/lib/gymTypes";
import { estimate1RM, exerciseVolume, plateCalc } from "@/lib/gymCalculations";
import { useGymStore } from "@/store/gymStore";
import { useToast } from "@/context/ToastContext";
import { ExercisePicker } from "./ExercisePicker";
import { RestTimer } from "./RestTimer";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function ActiveWorkoutView() {
  const {
    activeWorkout, startEmptyWorkout, finishWorkout, discardWorkout,
    addExercise, removeExercise, addSet, removeSet, updateSet, toggleSetComplete,
    updateWorkoutMeta, exercisePickerOpen, setExercisePickerOpen,
    customExercises, weightUnit, personalRecords,
  } = useGymStore();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [plateTarget, setPlateTarget] = useState("");

  const elapsed = useMemo(() => {
    if (!activeWorkout) return "";
    const mins = Math.floor((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 60000);
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <EmptyState
        icon={Dumbbell}
        variant="protocol"
        title="Ready to train?"
        description="Start an empty session or pick a program from the Programs tab. Log sets, reps, weight, RPE, and track personal records."
        action={
          <button
            onClick={() => startEmptyWorkout()}
            className={ui.btnProtocol}
          >
            <Plus className="mr-2 h-4 w-4" />
            Start Workout
          </button>
        }
      />
    );
  }

  const handleFinish = () => {
    const result = finishWorkout();
    if (!result) {
      toast({ type: "warning", title: "Complete at least one set before finishing" });
      return;
    }
    toast({
      type: "success",
      title: "Workout saved",
      description: `${result.totalSets} sets · ${result.totalVolume.toLocaleString()} ${weightUnit} volume`,
    });
  };

  const plates = plateTarget ? plateCalc(parseFloat(plateTarget) || 0) : null;

  return (
    <div className="space-y-4">
      <RestTimer />

      {/* Session header */}
      <div className={cn(ui.card, ui.cardPad)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <input
              value={activeWorkout.name}
              onChange={(e) => updateWorkoutMeta({ name: e.target.value })}
              className="font-display w-full bg-transparent text-xl font-semibold text-[var(--foreground)] outline-none"
            />
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {elapsed} · Started {format(new Date(activeWorkout.startedAt), "h:mm a")}
              </span>
              <span>{activeWorkout.exercises.length} exercises</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={discardWorkout} className={cn(ui.btnGhost, "border border-[var(--border)]")}>
              Discard
            </button>
            <button onClick={handleFinish} className={ui.btnProtocol}>
              <Check className="mr-1.5 h-4 w-4" />
              Finish
            </button>
          </div>
        </div>
      </div>

      {/* Plate calculator */}
      <div className={cn(ui.cardInner, "flex flex-wrap items-center gap-3 p-3")}>
        <span className="text-xs font-medium text-[var(--muted)]">Plate calc</span>
        <input
          type="number"
          value={plateTarget}
          onChange={(e) => setPlateTarget(e.target.value)}
          placeholder={`Target (${weightUnit})`}
          className={cn(ui.input, "h-9 w-32 text-xs")}
        />
        {plates && plateTarget && (
          <span className="text-xs text-[var(--muted)]">
            {plates.side > 0
              ? `Per side: ${plates.plates.join(" + ") || "bar only"}`
              : "Enter weight above bar (45)"}
          </span>
        )}
      </div>

      {/* Exercises */}
      {activeWorkout.exercises.map((entry) => {
        const exercise = getExerciseById(entry.exerciseId, customExercises);
        if (!exercise) return null;
        const isOpen = expanded[entry.id] !== false;
        const pr = personalRecords.find((p) => p.exerciseId === entry.exerciseId);
        const vol = exerciseVolume(entry);

        return (
          <motion.div
            key={entry.id}
            layout
            className={cn(ui.card, "overflow-hidden")}
          >
            <button
              onClick={() => setExpanded((e) => ({ ...e, [entry.id]: !isOpen }))}
              className="flex w-full items-center justify-between px-4 py-3 text-left sm:px-5"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{exercise.name}</p>
                <p className="text-[11px] text-[var(--muted)]">
                  {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                  {pr && (
                    <span className="ml-2 text-[var(--warning)]">
                      <Trophy className="mr-0.5 inline h-3 w-3" />
                      PR {pr.weight}×{pr.reps}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--muted)]">{vol > 0 ? `${vol.toLocaleString()} ${weightUnit}` : ""}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-[var(--muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted)]" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-[var(--border)] px-3 pb-4 sm:px-5">
                {exercise.cues && (
                  <p className="py-2 text-[11px] italic text-[var(--muted-2)]">{exercise.cues}</p>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-xs">
                    <thead>
                      <tr className="text-[var(--muted-2)]">
                        <th className="py-2 text-left font-medium">Set</th>
                        <th className="py-2 text-left font-medium">Type</th>
                        <th className="py-2 text-left font-medium">Previous</th>
                        <th className="py-2 text-left font-medium">{weightUnit}</th>
                        <th className="py-2 text-left font-medium">Reps</th>
                        <th className="py-2 text-left font-medium">RPE</th>
                        <th className="py-2 text-center font-medium">✓</th>
                        <th className="py-2 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {entry.sets.map((set, idx) => (
                        <tr key={set.id} className={cn(set.completed && "opacity-60")}>
                          <td className="py-1.5 font-mono text-[var(--muted)]">{idx + 1}</td>
                          <td className="py-1.5">
                            <select
                              value={set.type}
                              onChange={(e) => updateSet(entry.id, set.id, { type: e.target.value as SetType })}
                              className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-1 text-[10px]"
                            >
                              {Object.entries(SET_TYPE_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-1.5 text-[var(--muted-2)]">
                            {set.previousWeight ? `${set.previousWeight}×${set.previousReps}` : "—"}
                          </td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              value={set.weight || ""}
                              onChange={(e) => updateSet(entry.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                              className="w-16 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-center"
                            />
                          </td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              value={set.reps || ""}
                              onChange={(e) => updateSet(entry.id, set.id, { reps: parseInt(e.target.value, 10) || 0 })}
                              className="w-14 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-center"
                            />
                          </td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              min={1}
                              max={10}
                              step={0.5}
                              value={set.rpe ?? ""}
                              onChange={(e) => updateSet(entry.id, set.id, { rpe: parseFloat(e.target.value) || undefined })}
                              className="w-12 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-center"
                              placeholder="—"
                            />
                          </td>
                          <td className="py-1.5 text-center">
                            <button
                              onClick={() => toggleSetComplete(entry.id, set.id)}
                              className={cn(
                                "mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border transition",
                                set.completed
                                  ? "border-[var(--success)]/40 bg-[var(--success)]/15 text-[var(--success)]"
                                  : "border-[var(--border)] hover:border-[var(--protocol)]/40"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="py-1.5">
                            <button
                              onClick={() => removeSet(entry.id, set.id)}
                              className="p-1 text-[var(--muted-2)] hover:text-[var(--danger)]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => addSet(entry.id)} className={cn(ui.btnGhost, "text-xs")}>
                    <Plus className="mr-1 h-3 w-3" /> Add set
                  </button>
                  <button onClick={() => addSet(entry.id, "warmup")} className={cn(ui.btnGhost, "text-xs")}>
                    + Warm-up
                  </button>
                  <button onClick={() => addSet(entry.id, "drop")} className={cn(ui.btnGhost, "text-xs")}>
                    + Drop set
                  </button>
                  <button
                    onClick={() => removeExercise(entry.id)}
                    className={cn(ui.btnGhost, "ml-auto text-xs text-[var(--danger)]")}
                  >
                    Remove exercise
                  </button>
                </div>

                {entry.sets.some((s) => s.completed && s.weight > 0) && (
                  <p className="mt-2 text-[10px] text-[var(--muted-2)]">
                    Est. 1RM: {estimate1RM(
                      Math.max(...entry.sets.filter((s) => s.completed).map((s) => s.weight)),
                      Math.max(...entry.sets.filter((s) => s.completed).map((s) => s.reps))
                    )} {weightUnit}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        );
      })}

      <button
        onClick={() => setExercisePickerOpen(true)}
        className={cn(ui.btnSecondary, "w-full justify-center py-3")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Exercise
      </button>

      <ExercisePicker
        open={exercisePickerOpen}
        onClose={() => setExercisePickerOpen(false)}
        onSelect={addExercise}
        excludeIds={activeWorkout.exercises.map((e) => e.exerciseId)}
      />
    </div>
  );
}