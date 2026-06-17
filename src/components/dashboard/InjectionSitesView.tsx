"use client";

import { useCycleStore } from "@/store/cycleStore";
import { ui } from "@/lib/ui";

const SITES = [
  { id: "deltoid-l", label: "L Deltoid", x: 35, y: 22 },
  { id: "deltoid-r", label: "R Deltoid", x: 65, y: 22 },
  { id: "glute-l", label: "L Glute", x: 38, y: 55 },
  { id: "glute-r", label: "R Glute", x: 62, y: 55 },
  { id: "quad-l", label: "L Quad", x: 40, y: 72 },
  { id: "quad-r", label: "R Quad", x: 60, y: 72 },
  { id: "vg-l", label: "L VG", x: 42, y: 48 },
  { id: "vg-r", label: "R VG", x: 58, y: 48 },
];

export function InjectionSitesView() {
  const { compounds } = useCycleStore();
  const injectables = compounds.filter((c) => c.route === "injectable");
  const perSite = injectables.length > 0 ? Math.ceil((injectables.length * 8) / SITES.length) : 0;

  return (
    <div className={`${ui.card} ${ui.cardPad}`}>
      <h2 className="font-display text-lg font-bold text-[var(--protocol)]">Injection Site Rotation</h2>
      <p className={`${ui.sectionSub} mb-5`}>
        Rotate sites to minimise scar tissue. {injectables.length} injectable{injectables.length !== 1 ? "s" : ""} in stack.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className={`${ui.cardInner} flex min-h-[20rem] items-center justify-center p-6`}>
          <div className="relative h-80 w-48">
            <svg viewBox="0 0 100 100" className="h-full w-full text-[var(--muted-2)]">
              <ellipse cx="50" cy="15" rx="12" ry="14" fill="currentColor" opacity="0.3" />
              <rect x="35" y="28" width="30" height="35" rx="8" fill="currentColor" opacity="0.3" />
              <rect x="20" y="30" width="12" height="30" rx="4" fill="currentColor" opacity="0.3" />
              <rect x="68" y="30" width="12" height="30" rx="4" fill="currentColor" opacity="0.3" />
              <rect x="38" y="62" width="10" height="35" rx="4" fill="currentColor" opacity="0.3" />
              <rect x="52" y="62" width="10" height="35" rx="4" fill="currentColor" opacity="0.3" />
            </svg>
            {SITES.map((site) => {
              const color = perSite > 4 ? "#ef4444" : perSite > 2 ? "#f97316" : "#22c55e";
              return (
                <div
                  key={site.id}
                  className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ left: `${site.x}%`, top: `${site.y}%`, background: injectables.length > 0 ? color : "#3f3f46" }}
                  title={site.label}
                >
                  {injectables.length > 0 ? perSite : 0}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {SITES.map((site) => {
            const pct = injectables.length > 0 ? (perSite / 6) * 100 : 0;
            const color = perSite > 4 ? "#ef4444" : perSite > 2 ? "#f97316" : "#22c55e";
            return (
              <div key={site.id} className={`${ui.cardInner} ${ui.rowBetween} p-3`}>
                <span className="text-sm font-medium text-white">{site.label}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--bg-hover)]">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="w-6 text-right text-sm font-bold text-white">
                    {injectables.length > 0 ? perSite : 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}