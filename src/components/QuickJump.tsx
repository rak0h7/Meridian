"use client";

import { MARKER_MAP, QUICK_JUMP_MARKERS } from "@/lib/markers";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function QuickJump() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(`marker-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el.querySelector("input");
      input?.focus();
    }
  };

  return (
    <Panel variant="labs" className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[var(--protocol)]" />
          <h3 className="font-display text-sm font-semibold text-[var(--foreground)]">Quick-Jump to Marker</h3>
        </div>
        <span className={ui.overline}>Tap to scroll + focus input</span>
      </div>

      <div className="mb-2">
        <span className={cn("mb-1.5 block", ui.overline, "text-[var(--intel)]")}>Hormonal</span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_JUMP_MARKERS.hormonal.map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-full border border-[var(--intel)]/30 bg-[var(--intel-dim)] px-2.5 py-1 text-[10px] text-[var(--intel)] transition hover:border-[var(--intel)]/50 hover:bg-[var(--bg-hover)]"
            >
              {MARKER_MAP.get(id)?.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={cn("mb-1.5 block", ui.overline, "text-[var(--labs)]")}>Blood</span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_JUMP_MARKERS.blood.map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-full border border-[var(--labs)]/30 bg-[var(--labs-dim)] px-2.5 py-1 text-[10px] text-[var(--labs)] transition hover:border-[var(--labs)]/50 hover:bg-[var(--bg-hover)]"
            >
              {MARKER_MAP.get(id)?.name}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}