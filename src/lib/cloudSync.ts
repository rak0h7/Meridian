import type { SupabaseClient } from "@supabase/supabase-js";

export type CloudModule = "labs" | "cycle" | "gym" | "nutrition" | "settings";

export const LOCAL_STORAGE_KEYS: Record<CloudModule, string> = {
  labs: "bloodwork-logger-reports",
  cycle: "cycle-planner-store-v2",
  gym: "meridian-gym-store-v1",
  nutrition: "meridian-nutrition-store-v1",
  settings: "meridian-settings-v2",
};

export function readLocalModule(module: CloudModule): unknown | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS[module]);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeLocalModule(module: CloudModule, data: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEYS[module], JSON.stringify(data));
}

export async function pullUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<{ pulled: CloudModule[]; merged: boolean }> {
  const { data, error } = await supabase
    .from("user_modules")
    .select("module, data, updated_at")
    .eq("user_id", userId);

  if (error) throw error;

  const pulled: CloudModule[] = [];
  let merged = false;

  for (const row of data ?? []) {
    const mod = row.module as CloudModule;
    if (!LOCAL_STORAGE_KEYS[mod]) continue;
    const local = readLocalModule(mod);
    const remote = row.data;

    if (local == null || isEmptyLocal(mod, local)) {
      writeLocalModule(mod, remote);
      pulled.push(mod);
      merged = true;
    } else if (JSON.stringify(local) !== JSON.stringify(remote)) {
      // Prefer newer local data on first login; push happens separately.
      merged = true;
    }
  }

  return { pulled, merged };
}

export async function pushUserData(
  supabase: SupabaseClient,
  userId: string,
  modules: CloudModule[] = Object.keys(LOCAL_STORAGE_KEYS) as CloudModule[]
): Promise<void> {
  const rows: { user_id: string; module: CloudModule; data: unknown; updated_at: string }[] = [];
  for (const module of modules) {
    const data = readLocalModule(module);
    if (data == null) continue;
    rows.push({
      user_id: userId,
      module,
      data,
      updated_at: new Date().toISOString(),
    });
  }

  if (!rows.length) return;

  const { error } = await supabase.from("user_modules").upsert(rows, {
    onConflict: "user_id,module",
  });
  if (error) throw error;
}

function isEmptyLocal(module: CloudModule, data: unknown): boolean {
  if (module === "labs") return Array.isArray(data) && data.length === 0;
  if (typeof data === "object" && data && "state" in data) {
    const state = (data as { state: Record<string, unknown> }).state;
    if (module === "cycle") return (state.compounds as unknown[])?.length === 0;
    if (module === "gym") return (state.history as unknown[])?.length === 0;
    if (module === "nutrition") return Object.keys(state.logs ?? {}).length === 0;
  }
  return false;
}