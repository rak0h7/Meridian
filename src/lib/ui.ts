/** Central design tokens — driven by CSS variables from theme engine */
export const ui = {
  glass: "glass-panel rounded-[var(--radius-lg)]",
  glassAccent: "glass-panel rounded-[var(--radius-lg)] glow-accent",

  card: "glass-panel rounded-[var(--radius-lg)]",
  cardHover: "transition duration-300 hover:border-[var(--border-strong)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
  cardLabs: "glass-panel rounded-[var(--radius-lg)] border-[var(--labs)]/25 bg-[var(--labs-dim)]",
  cardProtocol: "glass-panel rounded-[var(--radius-lg)] border-[var(--protocol)]/25 bg-[var(--protocol-dim)]",
  cardIntel: "glass-panel rounded-[var(--radius-lg)] border-[var(--intel)]/25 bg-[var(--intel-dim)]",
  cardInner: "rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)]/80",
  cardPad: "p-[calc(1.25rem*var(--space-unit))] sm:p-[calc(1.5rem*var(--space-unit))]",

  pageTitle: "font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]",
  pageSub: "mt-1.5 text-sm leading-relaxed text-[var(--muted)]",
  sectionTitle: "text-sm font-semibold text-[var(--foreground)]",
  sectionSub: "text-xs leading-relaxed text-[var(--muted)]",
  label: "block text-xs font-medium text-[var(--muted)]",
  overline: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]",

  input:
    "h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)]/90 px-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] backdrop-blur-sm focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition",

  btnPrimary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-semibold text-white shadow-[0_4px_20px_var(--labs-glow)] transition hover:brightness-110 active:scale-[0.98] [background:var(--gradient-primary)]",
  btnProtocol:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--protocol)] px-5 text-sm font-semibold text-[var(--bg-base)] shadow-[0_4px_16px_var(--protocol-glow)] transition hover:brightness-110 active:scale-[0.98]",
  btnSecondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-strong)] glass px-4 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--bg-hover)]",
  btnGhost:
    "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--foreground)]",

  pillActive:
    "inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold text-white shadow-[0_2px_12px_var(--labs-glow)] [background:var(--gradient-primary)]",
  pillInactive:
    "inline-flex h-9 items-center justify-center rounded-full border border-[var(--border)] glass px-4 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]",
  pillProtocolActive:
    "inline-flex h-9 items-center justify-center rounded-full bg-[var(--protocol)] px-4 text-xs font-semibold text-[var(--bg-base)] shadow-[0_2px_12px_var(--protocol-glow)]",

  rowBetween: "flex items-center justify-between gap-3",

  statAccent: "text-[var(--accent)]",
  statLabs: "text-[var(--labs)]",
  statProtocol: "text-[var(--protocol)]",
  statIntel: "text-[var(--intel)]",
  statSuccess: "text-[var(--success)]",
  statWarning: "text-[var(--warning)]",
  statDanger: "text-[var(--danger)]",
};