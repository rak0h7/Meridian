"use client";

import { motion } from "framer-motion";
import {
  Archive, Apple, BarChart2, Blocks, BookOpen, ChevronLeft, ClipboardList, Compass,
  Dumbbell, FlaskConical, History, Leaf, Library, Search, Settings2, Spline,
  Target, TrendingUp, UtensilsCrossed,
} from "lucide-react";
import { useNavigation, NAV_ITEMS, type AppRoute, type NavItem } from "@/context/NavigationContext";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  compass: <Compass className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  flask: <FlaskConical className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  archive: <Archive className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  chart: <BarChart2 className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  blocks: <Blocks className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  book: <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  waveform: <Spline className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  dumbbell: <Dumbbell className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  clipboard: <ClipboardList className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  history: <History className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  trending: <TrendingUp className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  library: <Library className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  utensils: <UtensilsCrossed className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  "search-food": <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  leaf: <Leaf className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  target: <Target className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  apple: <Apple className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  sliders: <Settings2 className="h-[18px] w-[18px]" strokeWidth={1.75} />,
};

const GROUPS: { id: NavItem["group"]; label: string }[] = [
  { id: "overview", label: "" },
  { id: "labs", label: "Labs" },
  { id: "protocol", label: "Protocol" },
  { id: "training", label: "Training" },
  { id: "nutrition", label: "Nutrition" },
  { id: "system", label: "" },
];

const ACCENT_BAR: Record<NavItem["accent"], string> = {
  labs: "bg-[var(--accent)]",
  protocol: "bg-[var(--accent-soft)]",
  intel: "bg-[var(--accent-tertiary)]",
  neutral: "bg-[var(--muted)]",
};

const ACCENT_TEXT: Record<NavItem["accent"], string> = {
  labs: "text-[var(--accent)]",
  protocol: "text-[var(--accent-soft)]",
  intel: "text-[var(--accent-tertiary)]",
  neutral: "text-[var(--muted)]",
};

export function Sidebar() {
  const { route, setRoute, sidebarCollapsed, toggleSidebar } = useNavigation();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 68 : 248 }}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
      className="glass fixed left-0 top-0 z-40 hidden h-screen flex-col border-r lg:flex"
    >
      <div className="flex h-[60px] items-center gap-3 px-4">
        <div
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 4px 16px var(--labs-glow)" }}
        >
          <span className="font-display text-sm font-bold text-white">M</span>
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-display text-[15px] font-semibold text-gradient">Meridian</p>
            <p className="text-[11px] text-[var(--muted)]">Labs · Protocol · Training · Nutrition</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {GROUPS.map(({ id, label }) => {
          const items = NAV_ITEMS.filter((n) => n.group === id);
          if (!items.length) return null;
          return (
            <div key={id}>
              {!sidebarCollapsed && label && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">
                  {label}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = route === item.id;
                  return (
                    <li key={item.id}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRoute(item.id as AppRoute)}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-[13px] transition",
                          active
                            ? "glass-panel text-[var(--foreground)]"
                            : "text-[var(--muted)] hover:bg-[var(--bg-hover)]/60 hover:text-[var(--foreground)]"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-accent"
                            className={cn("absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full", ACCENT_BAR[item.accent])}
                          />
                        )}
                        <span className={cn(active ? ACCENT_TEXT[item.accent] : "text-[var(--muted-2)] group-hover:" + ACCENT_TEXT[item.accent])}>
                          {ICONS[item.icon]}
                        </span>
                        {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] py-2 text-xs text-[var(--muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--foreground)]"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          {!sidebarCollapsed && "Collapse"}
        </button>
      </div>
    </motion.aside>
  );
}