"use client";

import { ArrowLeft, BookOpen, Syringe, Pill } from "lucide-react";
import {
  COMPOUND_PROFILES,
  getProfileById,
  listConceptProfiles,
  listInjectableProfiles,
  listOralProfiles,
} from "@/data/compoundProfiles";
import { useCycleStore } from "@/store/cycleStore";
import { CompoundGuideArticle } from "./CompoundGuideArticle";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

function ProfileCard({
  id, title, tagline, route, onClick,
}: {
  id: string; title: string; tagline?: string; route: string; onClick: () => void;
}) {
  const Icon = route === "injectable" ? Syringe : route === "oral" ? Pill : BookOpen;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(ui.card, ui.cardHover, "group w-full p-4 text-left")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--protocol-dim)] text-[var(--protocol)]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--protocol)]">
            {title}
          </p>
          {tagline && <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{tagline}</p>}
        </div>
      </div>
    </button>
  );
}

function Section({
  title, profiles, onSelect,
}: {
  title: string;
  profiles: typeof COMPOUND_PROFILES;
  onSelect: (id: string) => void;
}) {
  if (!profiles.length) return null;
  return (
    <section>
      <p className={cn(ui.overline, "mb-3")}>{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {profiles.map((p) => (
          <ProfileCard
            key={p.id}
            id={p.id}
            title={p.title}
            tagline={p.tagline}
            route={p.route}
            onClick={() => onSelect(p.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function CompoundGuidesView() {
  const { selectedGuideId, setSelectedGuideId } = useCycleStore();
  const profile = selectedGuideId ? getProfileById(selectedGuideId) : null;

  if (profile) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedGuideId(null)}
          className={cn(ui.btnGhost, "gap-1.5 text-xs")}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All profiles
        </button>
        <CompoundGuideArticle profile={profile} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={cn(ui.cardProtocol, ui.cardPad)}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--protocol)]/15 text-[var(--protocol)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className={ui.pageTitle}>Injectables & Orals Guide</h2>
            <p className={`${ui.pageSub} mt-1 max-w-2xl`}>
              In-depth compound profiles covering receptors, aromatization, blood markers, dosage ranges, safety, and unique effects. Open any profile while building your stack from the compound picker.
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">{COMPOUND_PROFILES.length - 1} compound profiles + core concepts</p>
          </div>
        </div>
      </div>

      <Section title="Core concepts" profiles={listConceptProfiles()} onSelect={setSelectedGuideId} />
      <Section title="Injectables" profiles={listInjectableProfiles()} onSelect={setSelectedGuideId} />
      <Section title="Orals" profiles={listOralProfiles()} onSelect={setSelectedGuideId} />
    </div>
  );
}