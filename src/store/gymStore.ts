"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type {
  ActiveWorkout,
  CompletedWorkout,
  Exercise,
  PersonalRecord,
  RestTimerState,
  Routine,
  RoutineExercise,
  SetType,
  WorkoutExercise,
  WorkoutSet,
} from "@/lib/gymTypes";
import {
  computePRsFromWorkout,
  countCompletedSets,
  getLastPerformance,
  uid,
  workoutVolume,
} from "@/lib/gymCalculations";

export type GymView = "workout" | "routines" | "history" | "progress" | "exercises";

interface GymState {
  activeWorkout: ActiveWorkout | null;
  history: CompletedWorkout[];
  routines: Routine[];
  customExercises: Exercise[];
  personalRecords: PersonalRecord[];
  restTimer: RestTimerState;
  defaultRestSeconds: number;
  weightUnit: "lb" | "kg";
  gymView: GymView;
  exercisePickerOpen: boolean;
  editingRoutineId: string | null;

  setGymView: (view: GymView) => void;
  setExercisePickerOpen: (open: boolean) => void;
  setEditingRoutineId: (id: string | null) => void;
  setDefaultRestSeconds: (seconds: number) => void;
  setWeightUnit: (unit: "lb" | "kg") => void;

  startEmptyWorkout: (name?: string) => void;
  startFromRoutine: (routine: Routine) => void;
  discardWorkout: () => void;
  finishWorkout: () => CompletedWorkout | null;
  updateWorkoutMeta: (patch: Partial<Pick<ActiveWorkout, "name" | "notes">>) => void;

  addExercise: (exerciseId: string) => void;
  removeExercise: (entryId: string) => void;
  addSet: (entryId: string, type?: SetType) => void;
  removeSet: (entryId: string, setId: string) => void;
  updateSet: (entryId: string, setId: string, patch: Partial<WorkoutSet>) => void;
  toggleSetComplete: (entryId: string, setId: string) => void;
  linkSuperset: (entryIds: string[]) => void;

  saveRoutine: (routine: Omit<Routine, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  deleteRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;

  addCustomExercise: (exercise: Omit<Exercise, "id" | "isCustom">) => void;
  deleteCustomExercise: (id: string) => void;

  startRestTimer: (seconds?: number) => void;
  skipRestTimer: () => void;
  tickRestTimer: () => void;
}

function makeSet(type: SetType = "normal", prev?: { weight: number; reps: number } | null): WorkoutSet {
  return {
    id: uid(),
    type,
    weight: prev?.weight ?? 0,
    reps: prev?.reps ?? 0,
    completed: false,
    previousWeight: prev?.weight,
    previousReps: prev?.reps,
  };
}

function routineToExercises(
  routineExercises: RoutineExercise[],
  history: CompletedWorkout[]
): WorkoutExercise[] {
  return routineExercises
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((re, index) => {
      const prev = getLastPerformance(re.exerciseId, history);
      return {
        id: uid(),
        exerciseId: re.exerciseId,
        notes: re.notes,
        order: index,
        sets: re.sets.map((s) => makeSet(s.type, prev)),
      };
    });
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      history: [],
      routines: [],
      customExercises: [],
      personalRecords: [],
      restTimer: { active: false, endsAt: null, totalSeconds: 90 },
      defaultRestSeconds: 90,
      weightUnit: "lb",
      gymView: "workout",
      exercisePickerOpen: false,
      editingRoutineId: null,

      setGymView: (view) => set({ gymView: view }),
      setExercisePickerOpen: (open) => set({ exercisePickerOpen: open }),
      setEditingRoutineId: (id) => set({ editingRoutineId: id }),
      setDefaultRestSeconds: (seconds) => set({ defaultRestSeconds: seconds }),
      setWeightUnit: (unit) => set({ weightUnit: unit }),

      startEmptyWorkout: (name) => {
        const workout: ActiveWorkout = {
          id: uid(),
          name: name ?? `Workout ${format(new Date(), "MMM d")}`,
          startedAt: new Date().toISOString(),
          exercises: [],
        };
        set({ activeWorkout: workout, exercisePickerOpen: true });
      },

      startFromRoutine: (routine) => {
        const workout: ActiveWorkout = {
          id: uid(),
          name: routine.name,
          startedAt: new Date().toISOString(),
          routineId: routine.id,
          exercises: routineToExercises(routine.exercises, get().history),
        };
        set({ activeWorkout: workout });
      },

      discardWorkout: () => set({ activeWorkout: null, restTimer: { active: false, endsAt: null, totalSeconds: get().defaultRestSeconds } }),

      finishWorkout: () => {
        const active = get().activeWorkout;
        if (!active) return null;
        const completedSets = countCompletedSets(active.exercises);
        if (completedSets === 0) return null;

        const started = new Date(active.startedAt);
        const ended = new Date();
        const durationMinutes = Math.max(1, Math.round((ended.getTime() - started.getTime()) / 60000));

        const completed: CompletedWorkout = {
          id: active.id,
          name: active.name,
          startedAt: active.startedAt,
          completedAt: ended.toISOString(),
          durationMinutes,
          routineId: active.routineId,
          exercises: active.exercises,
          totalVolume: workoutVolume(active.exercises),
          totalSets: completedSets,
          notes: active.notes,
        };

        const prs = computePRsFromWorkout(completed, get().personalRecords, get().customExercises);

        set({
          activeWorkout: null,
          history: [completed, ...get().history],
          personalRecords: prs,
          restTimer: { active: false, endsAt: null, totalSeconds: get().defaultRestSeconds },
        });

        return completed;
      },

      updateWorkoutMeta: (patch) => {
        const active = get().activeWorkout;
        if (!active) return;
        set({ activeWorkout: { ...active, ...patch } });
      },

      addExercise: (exerciseId) => {
        const active = get().activeWorkout;
        if (!active) return;
        if (active.exercises.some((e) => e.exerciseId === exerciseId)) return;

        const prev = getLastPerformance(exerciseId, get().history);
        const entry: WorkoutExercise = {
          id: uid(),
          exerciseId,
          order: active.exercises.length,
          sets: [makeSet("warmup", prev), makeSet("normal", prev), makeSet("normal", prev)],
        };

        set({
          activeWorkout: { ...active, exercises: [...active.exercises, entry] },
          exercisePickerOpen: false,
        });
      },

      removeExercise: (entryId) => {
        const active = get().activeWorkout;
        if (!active) return;
        set({
          activeWorkout: {
            ...active,
            exercises: active.exercises.filter((e) => e.id !== entryId).map((e, i) => ({ ...e, order: i })),
          },
        });
      },

      addSet: (entryId, type = "normal") => {
        const active = get().activeWorkout;
        if (!active) return;
        set({
          activeWorkout: {
            ...active,
            exercises: active.exercises.map((e) => {
              if (e.id !== entryId) return e;
              const prev = getLastPerformance(e.exerciseId, get().history);
              return { ...e, sets: [...e.sets, makeSet(type, prev)] };
            }),
          },
        });
      },

      removeSet: (entryId, setId) => {
        const active = get().activeWorkout;
        if (!active) return;
        set({
          activeWorkout: {
            ...active,
            exercises: active.exercises.map((e) =>
              e.id === entryId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e
            ),
          },
        });
      },

      updateSet: (entryId, setId, patch) => {
        const active = get().activeWorkout;
        if (!active) return;
        set({
          activeWorkout: {
            ...active,
            exercises: active.exercises.map((e) =>
              e.id === entryId
                ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
                : e
            ),
          },
        });
      },

      toggleSetComplete: (entryId, setId) => {
        const active = get().activeWorkout;
        if (!active) return;
        let shouldRest = false;

        const exercises = active.exercises.map((e) => {
          if (e.id !== entryId) return e;
          const sets = e.sets.map((s) => {
            if (s.id !== setId) return s;
            const completed = !s.completed;
            if (completed) shouldRest = true;
            return { ...s, completed };
          });
          return { ...e, sets };
        });

        set({ activeWorkout: { ...active, exercises } });
        if (shouldRest) get().startRestTimer();
      },

      linkSuperset: (entryIds) => {
        const active = get().activeWorkout;
        if (!active || entryIds.length < 2) return;
        const groupId = uid();
        set({
          activeWorkout: {
            ...active,
            exercises: active.exercises.map((e) =>
              entryIds.includes(e.id) ? { ...e, supersetGroupId: groupId } : e
            ),
          },
        });
      },

      saveRoutine: (routine) => {
        const now = new Date().toISOString();
        if (routine.id) {
          set({
            routines: get().routines.map((r) =>
              r.id === routine.id
                ? { ...r, ...routine, id: r.id, createdAt: r.createdAt, updatedAt: now }
                : r
            ),
            editingRoutineId: null,
          });
        } else {
          const created: Routine = {
            ...routine,
            id: uid(),
            createdAt: now,
            updatedAt: now,
          };
          set({ routines: [created, ...get().routines], editingRoutineId: null });
        }
      },

      deleteRoutine: (id) =>
        set({ routines: get().routines.filter((r) => r.id !== id), editingRoutineId: null }),

      duplicateRoutine: (id) => {
        const source = get().routines.find((r) => r.id === id);
        if (!source) return;
        const now = new Date().toISOString();
        const copy: Routine = {
          ...source,
          id: uid(),
          name: `${source.name} (Copy)`,
          isTemplate: false,
          createdAt: now,
          updatedAt: now,
        };
        set({ routines: [copy, ...get().routines] });
      },

      addCustomExercise: (exercise) => {
        const created: Exercise = { ...exercise, id: uid(), isCustom: true };
        set({ customExercises: [created, ...get().customExercises] });
      },

      deleteCustomExercise: (id) =>
        set({ customExercises: get().customExercises.filter((e) => e.id !== id) }),

      startRestTimer: (seconds) => {
        const total = seconds ?? get().defaultRestSeconds;
        set({
          restTimer: { active: true, endsAt: Date.now() + total * 1000, totalSeconds: total },
        });
      },

      skipRestTimer: () =>
        set({ restTimer: { active: false, endsAt: null, totalSeconds: get().defaultRestSeconds } }),

      tickRestTimer: () => {
        const { restTimer, defaultRestSeconds } = get();
        if (!restTimer.active || !restTimer.endsAt) return;
        if (Date.now() >= restTimer.endsAt) {
          set({ restTimer: { active: false, endsAt: null, totalSeconds: defaultRestSeconds } });
        }
      },
    }),
    { name: "meridian-gym-store-v1" }
  )
);