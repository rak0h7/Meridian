"use client";

import { useApp } from "@/context/AppContext";
import type { MainTab } from "@/lib/types";

const TABS: { id: MainTab; label: string }[] = [
  { id: "log", label: "Log Entry" },
  { id: "history", label: "History" },
  { id: "insights", label: "Insights" },
];

export function TabNav() {
  const { mainTab, setMainTab } = useApp();

  return (
    <nav className="relative z-10 mx-auto mt-6 flex w-fit gap-1 rounded-full border border-red-900/40 bg-black/60 p-1 backdrop-blur">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setMainTab(tab.id)}
          className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            mainTab === tab.id
              ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}