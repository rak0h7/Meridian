"use client";

import type { AppSection } from "./SectionNav";

const SECTION_CONTENT: Record<
  AppSection,
  { eyebrow: string; title: string; description: string }
> = {
  bloodwork: {
    eyebrow: "Reference • Ancillaries • Personal Log",
    title: "Bloodwork Logger",
    description:
      "Enter your lab values to track changes over time. When markers drift outside optimal range, get severity-tiered ancillary recommendations with calibrated doses.",
  },
  cycle: {
    eyebrow: "Cycle • Compound Planner",
    title: "Plan Your Cycle",
    description:
      "Pick duration, start date, and compounds. Plot every dose onto a calendar and simulate pharmacokinetics — exact daily levels in your system.",
  },
};

interface HeaderProps {
  section: AppSection;
}

export function Header({ section }: HeaderProps) {
  const { eyebrow, title, description } = SECTION_CONTENT[section];

  return (
    <header className="relative z-10 text-center">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
        {eyebrow}
      </p>
      <h1
        className="text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-6xl"
        style={{
          background: "linear-gradient(135deg, #ff2e4a 0%, #ff6b8a 50%, #ff2e4a 100%)",
          WebkitBackgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(255,46,74,0.4))",
        }}
      >
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">{description}</p>
    </header>
  );
}