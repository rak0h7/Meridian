"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple, Archive, Blocks, BookOpen, ClipboardList, Compass, Download, Dumbbell, FlaskConical,
  History, Leaf, Library, Search, Settings2, Target, TrendingUp, Upload, UtensilsCrossed,
} from "lucide-react";
import { useNavigation, NAV_ITEMS, type AppRoute } from "@/context/NavigationContext";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { exportJSON, exportBloodworkCSV } from "@/lib/export";
import { useCycleStore } from "@/store/cycleStore";
import { useGymStore } from "@/store/gymStore";

const ICONS: Record<string, React.ReactNode> = {
  compass: <Compass className="h-4 w-4 text-[var(--intel)]" />,
  flask: <FlaskConical className="h-4 w-4 text-[var(--labs)]" />,
  archive: <Archive className="h-4 w-4 text-[var(--labs)]" />,
  chart: <Archive className="h-4 w-4 text-[var(--labs)]" />,
  blocks: <Blocks className="h-4 w-4 text-[var(--protocol)]" />,
  book: <BookOpen className="h-4 w-4 text-[var(--protocol)]" />,
  waveform: <Blocks className="h-4 w-4 text-[var(--protocol)]" />,
  dumbbell: <Dumbbell className="h-4 w-4 text-[var(--protocol)]" />,
  clipboard: <ClipboardList className="h-4 w-4 text-[var(--protocol)]" />,
  history: <History className="h-4 w-4 text-[var(--protocol)]" />,
  trending: <TrendingUp className="h-4 w-4 text-[var(--intel)]" />,
  library: <Library className="h-4 w-4 text-[var(--muted)]" />,
  utensils: <UtensilsCrossed className="h-4 w-4 text-[var(--intel)]" />,
  "search-food": <Search className="h-4 w-4 text-[var(--intel)]" />,
  leaf: <Leaf className="h-4 w-4 text-[var(--intel)]" />,
  target: <Target className="h-4 w-4 text-[var(--intel)]" />,
  apple: <Apple className="h-4 w-4 text-[var(--muted)]" />,
  sliders: <Settings2 className="h-4 w-4 text-[var(--muted)]" />,
};

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setRoute } = useNavigation();
  const { reports } = useApp();
  const { startDate, compounds, getEffectiveWeeks } = useCycleStore();
  const { startEmptyWorkout } = useGymStore();
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  const navigate = (route: AppRoute) => {
    setRoute(route);
    setCommandOpen(false);
  };

  const groups = ["overview", "labs", "protocol", "training", "nutrition", "system"] as const;

  return (
    <AnimatePresence>
      {commandOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            className="fixed left-1/2 top-[12%] z-[91] w-full max-w-lg -translate-x-1/2 px-4"
          >
            <Command className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl" label="Command palette">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <Command.Input
                  placeholder="Jump to a page or action…"
                  className="h-12 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-2)]"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-[var(--muted)]">Nothing found.</Command.Empty>
                {groups.map((group) => {
                  const items = NAV_ITEMS.filter((n) => n.group === group);
                  if (!items.length) return null;
                  return (
                    <Command.Group
                      key={group}
                      heading={group}
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted-2)]"
                    >
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={`${item.label} ${item.description}`}
                          onSelect={() => navigate(item.id)}
                          className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--foreground)] aria-selected:bg-[var(--bg-hover)]"
                        >
                          {ICONS[item.icon]}
                          <div>
                            <p className="font-medium">{item.label}</p>
                            {item.description && <p className="text-xs text-[var(--muted)]">{item.description}</p>}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
                <Command.Group heading="actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted-2)]">
                  <Command.Item value="upload" onSelect={() => navigate("bloodwork-log")} className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm aria-selected:bg-[var(--bg-hover)]">
                    <Upload className="h-4 w-4 text-[var(--labs)]" /> Upload labs
                  </Command.Item>
                  <Command.Item
                    value="start workout"
                    onSelect={() => {
                      startEmptyWorkout();
                      navigate("gym-workout");
                      toast({ type: "success", title: "Workout started" });
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm aria-selected:bg-[var(--bg-hover)]"
                  >
                    <Dumbbell className="h-4 w-4 text-[var(--protocol)]" /> Start workout
                  </Command.Item>
                  <Command.Item
                    value="export json"
                    onSelect={() => {
                      exportJSON({ exportedAt: new Date().toISOString(), version: "1.0", bloodwork: { reports }, cycle: { weeks: getEffectiveWeeks(), startDate, compounds } });
                      toast({ type: "success", title: "JSON exported" });
                      setCommandOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm aria-selected:bg-[var(--bg-hover)]"
                  >
                    <Download className="h-4 w-4 text-[var(--intel)]" /> Export JSON
                  </Command.Item>
                  <Command.Item
                    value="export csv"
                    onSelect={() => {
                      exportBloodworkCSV(reports);
                      toast({ type: "success", title: "CSV exported" });
                      setCommandOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm aria-selected:bg-[var(--bg-hover)]"
                  >
                    <Download className="h-4 w-4 text-[var(--labs)]" /> Export CSV
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}