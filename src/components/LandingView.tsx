"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Droplet, FileEdit } from "lucide-react";
import { useRef } from "react";

export function LandingView() {
  const { setLogView, handleFileUpload, rangeMode, setRangeMode } = useApp();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
      toast({ type: "success", title: "File uploaded", description: `Parsing ${file.name}…` });
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className={cn(ui.pageTitle, "text-xl")}>Log Your Bloodwork</h2>
        <p className={ui.pageSub}>Upload a lab report or enter values manually</p>
      </motion.div>

      <input ref={fileRef} type="file" accept=".pdf,.txt,.csv" className="hidden" onChange={handleFile} />

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Panel
            variant="labs"
            hover
            className="cursor-pointer p-6"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                await handleFileUpload(file);
                toast({ type: "success", title: "File uploaded", description: `Parsing ${file.name}…` });
              }
            }}
          >
            <Droplet className="mb-3 h-8 w-8 text-[var(--labs)]" />
            <h3 className="font-display text-base font-semibold text-[var(--foreground)]">Upload Blood Test</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Drop a PDF, TXT, or CSV file and we&apos;ll extract markers automatically.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["PDF", "TXT", "CSV"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--labs)]/20 bg-[var(--labs-dim)] px-3 py-1 text-[10px] font-bold uppercase text-[var(--labs)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <Panel hover className="cursor-pointer p-6" onClick={() => setLogView("entry")}>
            <FileEdit className="mb-3 h-8 w-8 text-[var(--protocol)]" />
            <h3 className="font-display text-base font-semibold text-[var(--foreground)]">Enter Results Manually</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Type in your markers if you don&apos;t have a report file.
            </p>
            <button className={cn(ui.btnProtocol, "mt-4 h-9 px-5 text-[10px] uppercase")}>
              Go to Entry
            </button>
          </Panel>
        </motion.div>
      </div>

      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[var(--labs)]/20 bg-[var(--labs-dim)] px-3 py-1 text-[10px] font-bold uppercase text-[var(--labs)]">
              {rangeMode === "lab" ? "Lab Range" : "Optimized"}
            </span>
            <p className="text-sm text-[var(--muted)]">
              {rangeMode === "lab"
                ? "Flags results outside official lab reference ranges."
                : "Flags results outside optimized performance ranges with severity tiers."}
            </p>
          </div>
          <button
            onClick={() => setRangeMode(rangeMode === "lab" ? "optimized" : "lab")}
            className={ui.btnSecondary}
          >
            Switch to {rangeMode === "lab" ? "Optimized" : "Lab Range"}
          </button>
        </div>
      </Panel>
    </div>
  );
}