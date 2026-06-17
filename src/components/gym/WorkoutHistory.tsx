"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { getExerciseById } from "@/data/exercises";
import { formatDuration } from "@/lib/gymCalculations";
import type { CompletedWorkout } from "@/lib/gymTypes";
import { MUSCLE_GROUP_LABELS, SET_TYPE_LABELS } from "@/lib/gymTypes";
import { useGymStore } from "@/store/gymStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function WorkoutHistory() {
  const { history, customExercises, weightUnit } = useGymStore();
  const [selected, setSelected] = useState<CompletedWorkout | null>(null);

  if (history.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        variant="protocol"
        title="No workouts logged yet"
        description="Finished sessions appear here with full set details, volume, and duration."
      />
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className={cn(ui.btnGhost, "text-sm")}>
          ← Back to log
        </button>
        <div className={cn(ui.card, ui.cardPad)}>
          <h2 className={ui.pageTitle}>{selected.name}</h2>
          <p className={ui.pageSub}>
            {format(new Date(selected.completedAt), "EEEE, MMM d, yyyy · h:mm a")}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="text-[var(--muted)]">
              <Clock className="mr-1 inline h-4 w-4" />
              {formatDuration(selected.durationMinutes)}
            </span>
            <span className="text-[var(--muted)]">{selected.totalSets} sets</span>
            <span className="text-[var(--protocol)]">{selected.totalVolume.toLocaleString()} {weightUnit} volume</span>
          </div>
        </div>

        {selected.exercises.map((entry) => {
          const ex = getExerciseById(entry.exerciseId, customExercises);
          const completed = entry.sets.filter((s) => s.completed);
          if (!completed.length) return null;
          return (
            <div key={entry.id} className={cn(ui.card, ui.cardPad)}>
              <p className="text-sm font-semibold">{ex?.name ?? entry.exerciseId}</p>
              <p className="text-[11px] text-[var(--muted)]">{ex && MUSCLE_GROUP_LABELS[ex.muscleGroup]}</p>
              <div className="mt-3 space-y-1">
                {completed.map((set, i) => (
                  <div key={set.id} className="flex gap-3 text-xs text-[var(--muted)]">
                    <span className="w-6 font-mono">{i + 1}</span>
                    <span className="w-16">{SET_TYPE_LABELS[set.type]}</span>
                    <span className="font-medium text-[var(--foreground)]">{set.weight} {weightUnit} × {set.reps}</span>
                    {set.rpe && <span>RPE {set.rpe}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className={ui.pageTitle}>Workout Log</h2>
        <p className={ui.pageSub}>{history.length} sessions recorded</p>
      </div>

      <div className="space-y-2">
        {history.map((workout) => (
          <button
            key={workout.id}
            onClick={() => setSelected(workout)}
            className={cn(ui.card, ui.cardPad, ui.cardHover, "flex w-full items-center justify-between text-left")}
          >
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{workout.name}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {format(new Date(workout.completedAt), "MMM d, yyyy")} · {formatDuration(workout.durationMinutes)} · {workout.totalSets} sets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--protocol)]">
                {workout.totalVolume.toLocaleString()} {weightUnit}
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}