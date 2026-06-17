import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function generateAccessKey(): string {
  const bytes = randomBytes(16);
  const groups: string[] = [];

  for (let g = 0; g < 4; g++) {
    let group = "";
    for (let i = 0; i < 4; i++) {
      group += ALPHABET[bytes[g * 4 + i] % ALPHABET.length];
    }
    groups.push(group);
  }

  return `meridian_${groups.join("_")}`;
}

export function normalizeAccessKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

export function fingerprintAccessKey(key: string): string {
  return createHash("sha256").update(normalizeAccessKey(key)).digest("hex").slice(0, 16);
}

export async function hashAccessKey(key: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(normalizeAccessKey(key), salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyAccessKey(key: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scryptAsync(normalizeAccessKey(key), salt, 64)) as Buffer;

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function internalEmail(userId: string): string {
  return `${userId}@users.meridian.internal`;
}

export function accountLabel(fingerprint: string): string {
  return `Account ···${fingerprint.slice(-4)}`;
}