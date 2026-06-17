import type { Routine } from "@/lib/gymTypes";

const now = new Date().toISOString();

export const ROUTINE_TEMPLATES: Routine[] = [
  {
    id: "tpl-push",
    name: "Push Day",
    description: "Chest, shoulders, and triceps",
    isTemplate: true,
    createdAt: now,
    updatedAt: now,
    exercises: [
      { exerciseId: "bench-press", order: 0, sets: [{ type: "warmup", targetReps: 10 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "incline-db-press", order: 1, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }, { type: "normal", targetReps: 8 }] },
      { exerciseId: "ohp", order: 2, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "lateral-raise", order: 3, sets: [{ type: "normal", targetReps: 15 }, { type: "normal", targetReps: 15 }, { type: "normal", targetReps: 12 }] },
      { exerciseId: "tricep-pushdown", order: 4, sets: [{ type: "normal", targetReps: 12 }, { type: "normal", targetReps: 12 }, { type: "normal", targetReps: 10 }] },
    ],
  },
  {
    id: "tpl-pull",
    name: "Pull Day",
    description: "Back, lats, and biceps",
    isTemplate: true,
    createdAt: now,
    updatedAt: now,
    exercises: [
      { exerciseId: "deadlift", order: 0, sets: [{ type: "warmup", targetReps: 5 }, { type: "normal", targetReps: 5 }, { type: "normal", targetReps: 5 }, { type: "normal", targetReps: 3 }] },
      { exerciseId: "pull-up", order: 1, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "barbell-row", order: 2, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "face-pull", order: 3, sets: [{ type: "normal", targetReps: 15 }, { type: "normal", targetReps: 15 }, { type: "normal", targetReps: 12 }] },
      { exerciseId: "barbell-curl", order: 4, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }, { type: "normal", targetReps: 8 }] },
    ],
  },
  {
    id: "tpl-legs",
    name: "Leg Day",
    description: "Quads, hamstrings, and glutes",
    isTemplate: true,
    createdAt: now,
    updatedAt: now,
    exercises: [
      { exerciseId: "squat", order: 0, sets: [{ type: "warmup", targetReps: 8 }, { type: "normal", targetReps: 6 }, { type: "normal", targetReps: 6 }, { type: "normal", targetReps: 4 }] },
      { exerciseId: "rdl", order: 1, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "leg-press", order: 2, sets: [{ type: "normal", targetReps: 12 }, { type: "normal", targetReps: 12 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "leg-curl", order: 3, sets: [{ type: "normal", targetReps: 12 }, { type: "normal", targetReps: 12 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "calf-raise-standing", order: 4, sets: [{ type: "normal", targetReps: 15 }, { type: "normal", targetReps: 15 }, { type: "normal", targetReps: 12 }] },
    ],
  },
  {
    id: "tpl-upper",
    name: "Upper Body",
    description: "Full upper split for 3-day programs",
    isTemplate: true,
    createdAt: now,
    updatedAt: now,
    exercises: [
      { exerciseId: "bench-press", order: 0, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "barbell-row", order: 1, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 6 }] },
      { exerciseId: "db-shoulder-press", order: 2, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "lat-pulldown", order: 3, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "db-curl", order: 4, sets: [{ type: "normal", targetReps: 12 }, { type: "normal", targetReps: 12 }] },
      { exerciseId: "skull-crusher", order: 5, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }] },
    ],
  },
  {
    id: "tpl-full-beginner",
    name: "Beginner Full Body",
    description: "3× per week compound-focused program",
    isTemplate: true,
    createdAt: now,
    updatedAt: now,
    exercises: [
      { exerciseId: "squat", order: 0, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }] },
      { exerciseId: "bench-press", order: 1, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }] },
      { exerciseId: "barbell-row", order: 2, sets: [{ type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }, { type: "normal", targetReps: 8 }] },
      { exerciseId: "ohp", order: 3, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "rdl", order: 4, sets: [{ type: "normal", targetReps: 10 }, { type: "normal", targetReps: 10 }] },
      { exerciseId: "plank", order: 5, sets: [{ type: "normal", targetReps: 45 }, { type: "normal", targetReps: 45 }] },
    ],
  },
];