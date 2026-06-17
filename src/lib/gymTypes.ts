export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "forearms"
  | "traps"
  | "lats"
  | "full_body";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "smith"
  | "ez_bar"
  | "band"
  | "other";

export type SetType = "normal" | "warmup" | "drop" | "failure";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  isCustom?: boolean;
  cues?: string;
}

export interface WorkoutSet {
  id: string;
  type: SetType;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
  /** Snapshot of last session for inline comparison */
  previousWeight?: number;
  previousReps?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  notes?: string;
  sets: WorkoutSet[];
  supersetGroupId?: string;
  order: number;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  startedAt: string;
  routineId?: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface CompletedWorkout {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
  routineId?: string;
  exercises: WorkoutExercise[];
  totalVolume: number;
  totalSets: number;
  notes?: string;
}

export interface RoutineSetTemplate {
  type: SetType;
  targetReps: number;
  targetWeight?: number;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: RoutineSetTemplate[];
  notes?: string;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  achievedAt: string;
  workoutId: string;
}

export interface RestTimerState {
  active: boolean;
  endsAt: number | null;
  totalSeconds: number;
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core",
  forearms: "Forearms",
  traps: "Traps",
  lats: "Lats",
  full_body: "Full Body",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  cable: "Cable",
  machine: "Machine",
  bodyweight: "Bodyweight",
  kettlebell: "Kettlebell",
  smith: "Smith Machine",
  ez_bar: "EZ Bar",
  band: "Resistance Band",
  other: "Other",
};

export const SET_TYPE_LABELS: Record<SetType, string> = {
  normal: "Working",
  warmup: "Warm-up",
  drop: "Drop",
  failure: "Failure",
};