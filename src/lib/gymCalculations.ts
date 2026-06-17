import type {
  CompletedWorkout,
  Exercise,
  MuscleGroup,
  PersonalRecord,
  WorkoutExercise,
  WorkoutSet,
} from "@/lib/gymTypes";
import { getExerciseById } from "@/data/exercises";

export function uid(): string {
  return crypto.randomUUID();
}

/** Epley formula for estimated 1RM */
export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function setVolume(set: WorkoutSet): number {
  if (!set.completed || set.weight <= 0 || set.reps <= 0) return 0;
  return set.weight * set.reps;
}

export function exerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.reduce((sum, s) => sum + setVolume(s), 0);
}

export function workoutVolume(exercises: WorkoutExercise[]): number {
  return exercises.reduce((sum, e) => sum + exerciseVolume(e), 0);
}

export function countCompletedSets(exercises: WorkoutExercise[]): number {
  return exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0);
}

export function getBestSet(sets: WorkoutSet[]): WorkoutSet | null {
  const completed = sets.filter((s) => s.completed && s.weight > 0 && s.reps > 0);
  if (!completed.length) return null;
  return completed.reduce((best, s) => {
    const best1rm = estimate1RM(best.weight, best.reps);
    const s1rm = estimate1RM(s.weight, s.reps);
    return s1rm > best1rm ? s : best;
  });
}

export function computePRsFromWorkout(
  workout: CompletedWorkout,
  existing: PersonalRecord[],
  _customExercises: Exercise[] = []
): PersonalRecord[] {
  const map = new Map(existing.map((pr) => [pr.exerciseId, pr]));
  const next = [...existing];

  for (const entry of workout.exercises) {
    const best = getBestSet(entry.sets);
    if (!best) continue;
    const e1rm = estimate1RM(best.weight, best.reps);
    const current = map.get(entry.exerciseId);
    if (!current || e1rm > current.estimated1RM) {
      const pr: PersonalRecord = {
        exerciseId: entry.exerciseId,
        weight: best.weight,
        reps: best.reps,
        estimated1RM: e1rm,
        achievedAt: workout.completedAt,
        workoutId: workout.id,
      };
      map.set(entry.exerciseId, pr);
      const idx = next.findIndex((p) => p.exerciseId === entry.exerciseId);
      if (idx >= 0) next[idx] = pr;
      else next.push(pr);
    }
  }

  return next;
}

export function getLastPerformance(
  exerciseId: string,
  history: CompletedWorkout[]
): { weight: number; reps: number } | null {
  for (const workout of history) {
    const entry = workout.exercises.find((e) => e.exerciseId === exerciseId);
    if (!entry) continue;
    const best = getBestSet(entry.sets);
    if (best) return { weight: best.weight, reps: best.reps };
  }
  return null;
}

export function muscleVolumeDistribution(
  workouts: CompletedWorkout[],
  customExercises: Exercise[] = []
): Record<MuscleGroup, number> {
  const dist: Partial<Record<MuscleGroup, number>> = {};

  for (const workout of workouts) {
    for (const entry of workout.exercises) {
      const exercise = getExerciseById(entry.exerciseId, customExercises);
      if (!exercise) continue;
      const vol = exerciseVolume(entry);
      dist[exercise.muscleGroup] = (dist[exercise.muscleGroup] ?? 0) + vol;
      for (const sec of exercise.secondaryMuscles ?? []) {
        dist[sec] = (dist[sec] ?? 0) + vol * 0.35;
      }
    }
  }

  return dist as Record<MuscleGroup, number>;
}

export function volumeByWeek(workouts: CompletedWorkout[]): { week: string; volume: number; sessions: number }[] {
  const buckets = new Map<string, { volume: number; sessions: number }>();

  for (const w of workouts) {
    const d = new Date(w.completedAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    const cur = buckets.get(key) ?? { volume: 0, sessions: 0 };
    cur.volume += w.totalVolume;
    cur.sessions += 1;
    buckets.set(key, cur);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, data]) => ({ week, ...data }));
}

export function plateCalc(targetWeight: number, barWeight = 45): { side: number; plates: number[] } {
  const plates = [45, 35, 25, 10, 5, 2.5];
  let perSide = (targetWeight - barWeight) / 2;
  if (perSide < 0) perSide = 0;

  const result: number[] = [];
  let remaining = perSide;

  for (const p of plates) {
    while (remaining >= p - 0.01) {
      result.push(p);
      remaining = Math.round((remaining - p) * 100) / 100;
    }
  }

  return { side: perSide, plates: result };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}