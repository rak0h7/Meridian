import type { Equipment, Exercise, MuscleGroup } from "@/lib/gymTypes";

function ex(
  id: string,
  name: string,
  muscleGroup: MuscleGroup,
  equipment: Equipment,
  secondaryMuscles?: MuscleGroup[],
  cues?: string
): Exercise {
  return { id, name, muscleGroup, equipment, secondaryMuscles, cues };
}

export const BUILTIN_EXERCISES: Exercise[] = [
  // Chest
  ex("bench-press", "Barbell Bench Press", "chest", "barbell", ["triceps", "shoulders"], "Retract scapula, feet flat, controlled descent"),
  ex("incline-bench", "Incline Barbell Press", "chest", "barbell", ["shoulders", "triceps"]),
  ex("db-bench", "Dumbbell Bench Press", "chest", "dumbbell", ["triceps", "shoulders"]),
  ex("incline-db-press", "Incline Dumbbell Press", "chest", "dumbbell", ["shoulders"]),
  ex("cable-fly", "Cable Fly", "chest", "cable"),
  ex("db-fly", "Dumbbell Fly", "chest", "dumbbell"),
  ex("push-up", "Push-Up", "chest", "bodyweight", ["triceps", "core"]),
  ex("dip-chest", "Chest Dip", "chest", "bodyweight", ["triceps"]),
  ex("machine-press", "Machine Chest Press", "chest", "machine", ["triceps"]),
  ex("pec-deck", "Pec Deck", "chest", "machine"),

  // Back
  ex("deadlift", "Conventional Deadlift", "back", "barbell", ["hamstrings", "glutes", "traps"], "Hinge at hips, neutral spine, bar close to shins"),
  ex("pull-up", "Pull-Up", "lats", "bodyweight", ["biceps", "back"]),
  ex("chin-up", "Chin-Up", "lats", "bodyweight", ["biceps"]),
  ex("barbell-row", "Barbell Row", "back", "barbell", ["biceps", "lats"]),
  ex("pendlay-row", "Pendlay Row", "back", "barbell", ["lats"]),
  ex("db-row", "Dumbbell Row", "lats", "dumbbell", ["biceps"]),
  ex("cable-row", "Seated Cable Row", "back", "cable", ["biceps", "lats"]),
  ex("lat-pulldown", "Lat Pulldown", "lats", "cable", ["biceps"]),
  ex("t-bar-row", "T-Bar Row", "back", "barbell", ["lats"]),
  ex("face-pull", "Face Pull", "shoulders", "cable", ["traps", "back"]),
  ex("rack-pull", "Rack Pull", "back", "barbell", ["glutes", "traps"]),

  // Shoulders
  ex("ohp", "Overhead Press", "shoulders", "barbell", ["triceps", "core"]),
  ex("db-shoulder-press", "Dumbbell Shoulder Press", "shoulders", "dumbbell", ["triceps"]),
  ex("arnold-press", "Arnold Press", "shoulders", "dumbbell"),
  ex("lateral-raise", "Lateral Raise", "shoulders", "dumbbell"),
  ex("cable-lateral", "Cable Lateral Raise", "shoulders", "cable"),
  ex("front-raise", "Front Raise", "shoulders", "dumbbell"),
  ex("reverse-fly", "Reverse Fly", "shoulders", "dumbbell", ["back"]),
  ex("upright-row", "Upright Row", "shoulders", "barbell", ["traps"]),
  ex("shrugs", "Barbell Shrug", "traps", "barbell"),

  // Biceps
  ex("barbell-curl", "Barbell Curl", "biceps", "barbell"),
  ex("ez-curl", "EZ Bar Curl", "biceps", "ez_bar"),
  ex("db-curl", "Dumbbell Curl", "biceps", "dumbbell"),
  ex("hammer-curl", "Hammer Curl", "biceps", "dumbbell", ["forearms"]),
  ex("preacher-curl", "Preacher Curl", "biceps", "ez_bar"),
  ex("cable-curl", "Cable Curl", "biceps", "cable"),
  ex("incline-curl", "Incline Dumbbell Curl", "biceps", "dumbbell"),

  // Triceps
  ex("tricep-pushdown", "Tricep Pushdown", "triceps", "cable"),
  ex("skull-crusher", "Skull Crusher", "triceps", "ez_bar"),
  ex("oh-tricep-ext", "Overhead Tricep Extension", "triceps", "dumbbell"),
  ex("close-grip-bench", "Close-Grip Bench Press", "triceps", "barbell", ["chest"]),
  ex("dip-tricep", "Tricep Dip", "triceps", "bodyweight"),
  ex("kickback", "Tricep Kickback", "triceps", "dumbbell"),

  // Quads
  ex("squat", "Barbell Back Squat", "quads", "barbell", ["glutes", "core"], "Brace core, knees track over toes"),
  ex("front-squat", "Front Squat", "quads", "barbell", ["core"]),
  ex("leg-press", "Leg Press", "quads", "machine", ["glutes"]),
  ex("hack-squat", "Hack Squat", "quads", "machine"),
  ex("leg-ext", "Leg Extension", "quads", "machine"),
  ex("goblet-squat", "Goblet Squat", "quads", "kettlebell", ["core"]),
  ex("split-squat", "Bulgarian Split Squat", "quads", "dumbbell", ["glutes"]),
  ex("lunges", "Walking Lunge", "quads", "dumbbell", ["glutes"]),

  // Hamstrings / Glutes
  ex("rdl", "Romanian Deadlift", "hamstrings", "barbell", ["glutes", "back"]),
  ex("stiff-leg-dl", "Stiff-Leg Deadlift", "hamstrings", "barbell", ["glutes"]),
  ex("leg-curl", "Lying Leg Curl", "hamstrings", "machine"),
  ex("seated-leg-curl", "Seated Leg Curl", "hamstrings", "machine"),
  ex("hip-thrust", "Barbell Hip Thrust", "glutes", "barbell", ["hamstrings"]),
  ex("glute-bridge", "Glute Bridge", "glutes", "bodyweight"),
  ex("cable-kickback", "Cable Kickback", "glutes", "cable"),
  ex("good-morning", "Good Morning", "hamstrings", "barbell", ["back"]),

  // Calves
  ex("calf-raise-standing", "Standing Calf Raise", "calves", "machine"),
  ex("calf-raise-seated", "Seated Calf Raise", "calves", "machine"),
  ex("calf-press", "Leg Press Calf Raise", "calves", "machine"),

  // Core
  ex("plank", "Plank", "core", "bodyweight"),
  ex("hanging-leg-raise", "Hanging Leg Raise", "core", "bodyweight"),
  ex("cable-crunch", "Cable Crunch", "core", "cable"),
  ex("ab-wheel", "Ab Wheel Rollout", "core", "other"),
  ex("russian-twist", "Russian Twist", "core", "dumbbell"),
  ex("pallof-press", "Pallof Press", "core", "cable"),

  // Full body / compounds
  ex("clean-press", "Clean and Press", "full_body", "barbell", ["shoulders", "quads"]),
  ex("kb-swing", "Kettlebell Swing", "full_body", "kettlebell", ["glutes", "hamstrings"]),
  ex("farmers-walk", "Farmer's Walk", "full_body", "dumbbell", ["forearms", "traps"]),
];

export function getExerciseById(id: string, custom: Exercise[] = []): Exercise | undefined {
  return [...BUILTIN_EXERCISES, ...custom].find((e) => e.id === id);
}

export function searchExercises(query: string, custom: Exercise[] = []): Exercise[] {
  const q = query.trim().toLowerCase();
  const all = [...BUILTIN_EXERCISES, ...custom];
  if (!q) return all;
  return all.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroup.includes(q) ||
      e.equipment.includes(q)
  );
}