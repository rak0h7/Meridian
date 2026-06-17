"use client";

import { X } from "lucide-react";
import { getProfileById } from "@/data/compoundProfiles";
import { useNavigation } from "@/context/NavigationContext";
import { useCycleStore } from "@/store/cycleStore";
import { CompoundGuideArticle } from "./CompoundGuideArticle";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function CompoundProfileModal() {
  const { setRoute } = useNavigation();
  const { profileModalId, setProfileModalId, openGuidesAt } = useCycleStore();
  const profile = profileModalId ? getProfileById(profileModalId) : null;

  if (!profileModalId || !profile) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className={cn(ui.card, "flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden sm:max-h-[85vh]")}>
        <div className={`${ui.rowBetween} shrink-0 border-b border-[var(--border)] px-5 py-4`}>
          <p className={ui.overline}>Compound profile</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setProfileModalId(null);
                openGuidesAt(profile.id);
                setRoute("cycle-guides");
              }}
              className={cn(ui.btnGhost, "h-8 px-2 text-xs text-[var(--protocol)]")}
            >
              Open in Guides
            </button>
            <button
              type="button"
              onClick={() => setProfileModalId(null)}
              className={cn(ui.btnGhost, "h-9 w-9 p-0")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <CompoundGuideArticle profile={profile} />
        </div>
      </div>
    </div>
  );
}