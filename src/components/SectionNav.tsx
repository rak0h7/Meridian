"use client";

import { cn } from "@/lib/utils";

export type AppSection = "bloodwork" | "cycle";

const SECTIONS: { id: AppSection; label: string }[] = [
  { id: "bloodwork", label: "Bloodwork" },
  { id: "cycle", label: "Cycle Planner" },
];

interface SectionNavProps {
  section: AppSection;
  onSectionChange: (section: AppSection) => void;
}

export function SectionNav({ section, onSectionChange }: SectionNavProps) {
  return (
    <nav className="relative z-10 mx-auto mt-8 flex w-fit gap-1 rounded-full border border-zinc-800 bg-black/80 p-1 backdrop-blur">
      {SECTIONS.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={cn(
            "rounded-full px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
            section === item.id
              ? "bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg shadow-red-600/30"
              : "text-zinc-500 hover:text-zinc-200"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}