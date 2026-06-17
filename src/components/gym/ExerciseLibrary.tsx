"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { BUILTIN_EXERCISES } from "@/data/exercises";
import {
  EQUIPMENT_LABELS,
  MUSCLE_GROUP_LABELS,
  type Equipment,
  type MuscleGroup,
} from "@/lib/gymTypes";
import { useGymStore } from "@/store/gymStore";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function ExerciseLibrary() {
  const { customExercises, addCustomExercise, deleteCustomExercise } = useGymStore();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>("chest");
  const [newEquipment, setNewEquipment] = useState<Equipment>("dumbbell");

  const exercises = useMemo(() => {
    const all = [...customExercises, ...BUILTIN_EXERCISES];
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      if (muscle !== "all" && e.muscleGroup !== muscle) return false;
      if (!q) return true;
      return e.name.toLowerCase().includes(q);
    });
  }, [query, muscle, customExercises]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCustomExercise({
      name: newName.trim(),
      muscleGroup: newMuscle,
      equipment: newEquipment,
    });
    setNewName("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={ui.pageTitle}>Exercise Library</h2>
          <p className={ui.pageSub}>{BUILTIN_EXERCISES.length + customExercises.length} exercises</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className={ui.btnProtocol}>
          <Plus className="mr-2 h-4 w-4" />
          Custom Exercise
        </button>
      </div>

      {showCreate && (
        <div className={cn(ui.card, ui.cardPad, "space-y-3")}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Exercise name" className={ui.input} />
          <div className="flex flex-wrap gap-2">
            <select value={newMuscle} onChange={(e) => setNewMuscle(e.target.value as MuscleGroup)} className={cn(ui.input, "w-auto")}>
              {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select value={newEquipment} onChange={(e) => setNewEquipment(e.target.value as Equipment)} className={cn(ui.input, "w-auto")}>
              {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button onClick={handleCreate} className={ui.btnProtocol}>Save</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className={cn(ui.input, "pl-9")} />
        </div>
        <select value={muscle} onChange={(e) => setMuscle(e.target.value as MuscleGroup | "all")} className={cn(ui.input, "w-auto")}>
          <option value="all">All muscles</option>
          {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((ex) => (
          <div key={ex.id} className={cn(ui.cardInner, "p-3")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{ex.name}</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                  {MUSCLE_GROUP_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipment]}
                </p>
                {ex.cues && <p className="mt-1 text-[10px] italic text-[var(--muted-2)]">{ex.cues}</p>}
              </div>
              {ex.isCustom && (
                <button
                  onClick={() => deleteCustomExercise(ex.id)}
                  className="text-[10px] text-[var(--danger)]"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}