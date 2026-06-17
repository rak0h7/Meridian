export type ProfileRoute = "injectable" | "oral" | "concept";

export interface ProfileBlock {
  heading?: string;
  body?: string;
  list?: string[];
  blocks?: ProfileBlock[];
}

export interface CompoundProfile {
  id: string;
  title: string;
  aliases?: string[];
  route: ProfileRoute;
  tagline?: string;
  compoundIds: string[];
  sections: ProfileBlock[];
}