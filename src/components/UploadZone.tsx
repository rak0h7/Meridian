"use client";

import { useApp } from "@/context/AppContext";
import { SAMPLE_LAB_TEXT } from "@/lib/parser";
import { Panel } from "@/components/ui/Panel";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Droplet, FileText } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function UploadZone() {
  const { parseAndExtract, handleFileUpload } = useApp();
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) await handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const onFileSelect = async (accept: string) => {
    if (!fileRef.current) return;
    fileRef.current.accept = accept;
    fileRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFileUpload(file);
    e.target.value = "";
  };

  return (
    <Panel
      variant="labs"
      className="p-6"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      <div className="mb-4 text-center">
        <Droplet
          className="mx-auto h-10 w-10 text-[var(--labs)]"
          style={{ filter: "drop-shadow(0 0 10px var(--labs-glow))" }}
        />
        <h3 className="mt-2 font-display text-lg font-semibold text-[var(--foreground)]">Drop Your Blood Test</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Upload your lab report PDF and we&apos;ll extract every marker value automatically — or paste your results below
        </p>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {[
          { label: "PDF", accept: ".pdf" },
          { label: "TXT", accept: ".txt" },
          { label: "CSV", accept: ".csv" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => onFileSelect(btn.accept)}
            className={cn(
              ui.btnSecondary,
              "h-9 border-[var(--labs)]/30 bg-[var(--labs-dim)] text-[10px] font-bold uppercase tracking-wider text-[var(--labs)] hover:border-[var(--labs)]/50"
            )}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={() => setShowPaste(!showPaste)}
          className={cn(ui.btnSecondary, "h-9 text-[10px] font-bold uppercase tracking-wider")}
        >
          Paste Text
        </button>
      </div>

      {(showPaste || pasteText) && (
        <div className="space-y-2">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`Paste your lab results here. Example:\n› Testosterone, Total: 850 ng/dL\n› Estradiol: 42 pg/mL\n› ALT: 35 U/L`}
            className={cn(
              ui.input,
              "h-32 resize-none p-3 font-mono text-xs"
            )}
          />
          <div className="flex gap-2">
            <button
              onClick={() => parseAndExtract(pasteText || SAMPLE_LAB_TEXT)}
              className={cn(ui.btnPrimary, "gap-2 text-xs font-bold uppercase")}
            >
              <FileText className="h-3 w-3" />
              Parse Results
            </button>
            <button
              onClick={() => setPasteText(SAMPLE_LAB_TEXT)}
              className={cn(ui.btnGhost, "text-xs")}
            >
              Load Sample
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}