"use client";

import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useNavigation } from "@/context/NavigationContext";
import { LandingView } from "./LandingView";
import { MarkerGrid } from "./MarkerGrid";
import { QuickJump } from "./QuickJump";
import { UploadZone } from "./UploadZone";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ArrowLeft, Save, Flag } from "lucide-react";

export function LogEntryView() {
  const { logView, setLogView, saveReport, setMainTab } = useApp();
  const { toast } = useToast();
  const { setRoute } = useNavigation();

  if (logView === "landing") return <LandingView />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setLogView("landing")}
          className={cn(ui.btnGhost, "text-xs")}
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              saveReport();
              toast({ type: "success", title: "Report saved" });
              setLogView("flags");
            }}
            className={cn(
              ui.btnSecondary,
              "h-8 gap-1.5 border-[var(--warning)]/30 bg-[var(--protocol-dim)] px-3 text-[10px] font-bold uppercase text-[var(--warning)] hover:bg-[var(--bg-hover)]"
            )}
          >
            <Flag className="h-3 w-3" /> Review Flags
          </button>
          <button
            onClick={() => {
              saveReport();
              toast({ type: "success", title: "Report saved", description: "Opening insights…" });
              setMainTab("insights");
              setRoute("bloodwork-insights");
            }}
            className={cn(ui.btnPrimary, "h-8 gap-1.5 px-3 text-[10px] font-bold uppercase")}
          >
            <Save className="h-3 w-3" /> Save & Insights
          </button>
        </div>
      </div>

      <QuickJump />
      <UploadZone />
      <MarkerGrid />
    </div>
  );
}