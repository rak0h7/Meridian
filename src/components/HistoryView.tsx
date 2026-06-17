"use client";

import { useApp } from "@/context/AppContext";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { FileText, Trash2, BarChart3, GitCompare } from "lucide-react";

export function HistoryView() {
  const {
    reports,
    loadReport,
    deleteReport,
    setCompareReports,
    setShowComparison,
    setMainTab,
  } = useApp();

  if (reports.length === 0) {
    return (
      <Panel className="p-12 text-center">
        <FileText className="mx-auto h-10 w-10 text-[var(--muted-2)]" />
        <p className="mt-3 text-[var(--muted)]">No saved reports yet.</p>
        <p className="mt-1 text-xs text-[var(--muted-2)]">Enter lab values and save to build your history.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className={ui.pageTitle}>Uploaded Reports</h2>

      <div className="space-y-2">
        {reports.map((report) => (
          <Panel
            key={report.id}
            hover
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="font-display font-semibold text-[var(--foreground)]">{report.name}</p>
              <p className="text-[10px] text-[var(--muted)]">
                {report.date} • {report.values.length} markers
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadReport(report.id)}
                className={cn(
                  ui.btnSecondary,
                  "h-8 gap-1 px-3 text-[10px] font-bold uppercase hover:border-[var(--labs)]/40 hover:text-[var(--labs)]"
                )}
              >
                <BarChart3 className="h-3 w-3" /> Insights
              </button>
              <button
                onClick={() => {
                  if (reports.length >= 2) {
                    const other = reports.find((r) => r.id !== report.id);
                    if (other) {
                      setCompareReports(report.id, other.id);
                      setShowComparison(true);
                      setMainTab("history");
                    }
                  }
                }}
                className={cn(
                  ui.btnSecondary,
                  "h-8 gap-1 border-[var(--intel)]/30 bg-[var(--intel-dim)] px-3 text-[10px] font-bold uppercase text-[var(--intel)] hover:border-[var(--intel)]/50"
                )}
              >
                <GitCompare className="h-3 w-3" /> Compare
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this report?")) deleteReport(report.id);
                }}
                className={cn(
                  ui.btnSecondary,
                  "h-8 gap-1 border-[var(--danger)]/30 px-3 text-[10px] font-bold uppercase text-[var(--danger)] hover:bg-[var(--danger)]/10"
                )}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}