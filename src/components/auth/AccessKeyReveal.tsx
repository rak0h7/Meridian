"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function AccessKeyReveal({
  accessKey,
  onConfirm,
}: {
  accessKey: string;
  onConfirm: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(ui.card, ui.cardPad, "space-y-4 border-[var(--warning)]/30")}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[var(--warning)]/10">
          <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
        </div>
        <div>
          <h2 className={ui.sectionTitle}>Save your access key</h2>
          <p className={`${ui.sectionSub} mt-1`}>
            This is shown once. Meridian does not store your key in plain text — if you lose it,
            your account cannot be recovered.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-4">
        <p className="font-mono text-center text-sm tracking-wide text-[var(--foreground)] sm:text-base">
          {accessKey}
        </p>
      </div>

      <button type="button" onClick={handleCopy} className={cn(ui.btnSecondary, "w-full text-xs")}>
        {copied ? (
          <>
            <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--success)]" />
            Copied
          </>
        ) : (
          <>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy access key
          </>
        )}
      </button>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--muted)]">
        <input
          type="checkbox"
          checked={saved}
          onChange={(e) => setSaved(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[var(--border)]"
        />
        <span>I have saved my access key in a secure place</span>
      </label>

      <button
        type="button"
        disabled={!saved}
        onClick={onConfirm}
        className={cn(ui.btnPrimary, "w-full disabled:opacity-50")}
      >
        Continue to Meridian
      </button>
    </div>
  );
}