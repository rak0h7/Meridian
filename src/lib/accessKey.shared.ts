export function normalizeAccessKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

export function internalEmail(userId: string): string {
  return `${userId}@users.meridian.internal`;
}

export function accountLabel(fingerprint: string): string {
  return `Account ···${fingerprint.slice(-4)}`;
}