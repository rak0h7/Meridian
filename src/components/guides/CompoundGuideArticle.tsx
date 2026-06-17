"use client";

import type { CompoundProfile, ProfileBlock } from "@/lib/compoundProfileTypes";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const ROUTE_LABEL: Record<CompoundProfile["route"], string> = {
  injectable: "Injectable",
  oral: "Oral",
  concept: "Core Concept",
};

function Block({ block, depth = 0 }: { block: ProfileBlock; depth?: number }) {
  return (
    <div className={cn(depth > 0 && "ml-0 border-l-2 border-[var(--protocol)]/20 pl-4")}>
      {block.heading && (
        <h4
          className={cn(
            "font-semibold text-[var(--foreground)]",
            depth === 0 ? "text-sm" : "text-xs uppercase tracking-wide text-[var(--muted)]"
          )}
        >
          {block.heading}
        </h4>
      )}
      {block.body && (
        <p className={cn("leading-relaxed text-[var(--muted)]", block.heading ? "mt-1.5 text-sm" : "text-sm")}>
          {block.body}
        </p>
      )}
      {block.list && (
        <ul className={cn("space-y-1.5 text-sm text-[var(--muted)]", block.heading ? "mt-2" : "mt-0")}>
          {block.list.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--protocol)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {block.blocks && (
        <div className="mt-3 space-y-3">
          {block.blocks.map((sub) => (
            <Block key={sub.heading ?? sub.body} block={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CompoundGuideArticle({ profile }: { profile: CompoundProfile }) {
  return (
    <article className="space-y-6">
      <header className={cn(ui.cardProtocol, ui.cardPad)}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--protocol)]/30 bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--protocol)]">
            {ROUTE_LABEL[profile.route]}
          </span>
          {profile.aliases?.map((alias) => (
            <span key={alias} className="text-[10px] text-[var(--muted)]">{alias}</span>
          ))}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {profile.title}
        </h2>
        {profile.tagline && <p className={`${ui.pageSub} mt-2 max-w-2xl`}>{profile.tagline}</p>}
      </header>

      <div className={cn(ui.card, ui.cardPad, "space-y-6")}>
        {profile.sections.map((section) => (
          <Block key={section.heading ?? section.body} block={section} />
        ))}
      </div>
    </article>
  );
}