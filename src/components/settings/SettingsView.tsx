"use client";

import { motion } from "framer-motion";
import { Download, FileJson, FileSpreadsheet, FileText, RefreshCw, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { useCycleStore } from "@/store/cycleStore";
import { exportJSON, exportBloodworkCSV, exportBloodworkPDF } from "@/lib/export";
import { AccountSettings } from "./AccountSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { InterfaceSettings } from "./InterfaceSettings";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function SettingsView() {
  const { reports, overallScore, resetAll } = useApp();
  const { defaultRangeMode, updateSettings, resetSettings } = useSettings();
  const { weeks, startDate, compounds, getEffectiveWeeks, clearCycle } = useCycleStore();
  const { toast } = useToast();

  const handleExportJSON = () => {
    exportJSON({
      exportedAt: new Date().toISOString(),
      version: "1.0",
      bloodwork: { reports },
      cycle: { weeks: getEffectiveWeeks(), startDate, compounds },
    });
    toast({ type: "success", title: "JSON exported", description: "Full data bundle downloaded." });
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast({ type: "warning", title: "No reports", description: "Save at least one bloodwork report first." });
      return;
    }
    exportBloodworkCSV(reports);
    toast({ type: "success", title: "CSV exported" });
  };

  const handleExportPDF = () => {
    if (reports.length === 0) {
      toast({ type: "warning", title: "No reports", description: "Save at least one bloodwork report first." });
      return;
    }
    exportBloodworkPDF(reports, overallScore?.score);
    toast({ type: "info", title: "PDF print dialog opened" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className={ui.pageTitle}>Settings</h2>
        <p className={ui.pageSub}>Preferences, data management, and exports.</p>
      </motion.div>

      <AccountSettings />

      <AppearanceSettings />

      <InterfaceSettings />

      <div className={`${ui.card} ${ui.cardPad}`}>
        <h3 className={ui.sectionTitle}>Export Data</h3>
        <p className={ui.sectionSub}>Download your bloodwork reports and cycle configuration.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FileJson, label: "JSON", desc: "Full bundle", action: handleExportJSON, accent: ui.statLabs },
            { icon: FileSpreadsheet, label: "CSV", desc: "Bloodwork only", action: handleExportCSV, accent: ui.statLabs },
            { icon: FileText, label: "PDF", desc: "Printable report", action: handleExportPDF, accent: ui.statIntel },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={cn(ui.cardInner, ui.cardHover, "flex flex-col items-center gap-2 p-4")}
            >
              <item.icon className={cn("h-5 w-5", item.accent)} />
              <span className="text-sm font-medium text-[var(--foreground)]">{item.label}</span>
              <span className={ui.overline}>{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`${ui.card} ${ui.cardPad}`}>
        <h3 className={ui.sectionTitle}>Data Management</h3>
        <div className="mt-4 space-y-3">
          <button
            onClick={() => {
              if (confirm("Clear cycle planner data?")) {
                clearCycle();
                toast({ type: "success", title: "Cycle cleared" });
              }
            }}
            className={cn(ui.cardInner, ui.cardHover, "flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)]")}
          >
            <RefreshCw className="h-4 w-4 text-[var(--protocol)]" />
            Clear cycle planner
          </button>
          <button
            onClick={() => {
              if (confirm("Reset ALL bloodwork data? This cannot be undone.")) {
                resetAll();
                toast({ type: "success", title: "Bloodwork data reset" });
              }
            }}
            className={cn(
              ui.cardInner,
              "flex w-full items-center gap-3 border-[var(--danger)]/20 px-4 py-3 text-sm transition hover:bg-[var(--bg-hover)]",
              ui.statDanger
            )}
          >
            <Trash2 className="h-4 w-4" />
            Reset all bloodwork data
          </button>
          <button
            onClick={() => {
              resetSettings();
              toast({ type: "info", title: "Settings reset to defaults" });
            }}
            className={cn(ui.cardInner, ui.cardHover, "flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)]")}
          >
            <Download className="h-4 w-4 text-[var(--muted)]" />
            Reset preferences
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-[var(--muted-2)]">
        {reports.length} reports · {compounds.length} compounds · Range: {defaultRangeMode}
      </p>
    </div>
  );
}

