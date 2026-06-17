"use client";

import { GymTabNav } from "@/components/gym/GymTabNav";
import { ActiveWorkoutView } from "@/components/gym/ActiveWorkoutView";
import { RoutineList } from "@/components/gym/RoutineList";
import { WorkoutHistory } from "@/components/gym/WorkoutHistory";
import { GymAnalytics } from "@/components/gym/GymAnalytics";
import { ExerciseLibrary } from "@/components/gym/ExerciseLibrary";
import { useGymStore } from "@/store/gymStore";

export function GymView() {
  const { gymView } = useGymStore();

  const content = () => {
    switch (gymView) {
      case "workout": return <ActiveWorkoutView />;
      case "routines": return <RoutineList />;
      case "history": return <WorkoutHistory />;
      case "progress": return <GymAnalytics />;
      case "exercises": return <ExerciseLibrary />;
      default: return <ActiveWorkoutView />;
    }
  };

  return (
    <div>
      <GymTabNav />
      <div className="mt-6">{content()}</div>
    </div>
  );
}