import * as crypto from "crypto";

/**
 * Hashes a plaintext password using crypto.scryptSync with a random salt.
 * Format: "<salt_hex>:<derived_key_hex>"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Verifies a plaintext password against a stored hash using constant-time comparison.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  if (!password || !combinedHash) return false;
  const parts = combinedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, expectedKeyHex] = parts;
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const expectedKey = Buffer.from(expectedKeyHex, "hex");
    if (derivedKey.length !== expectedKey.length) return false;
    return crypto.timingSafeEqual(derivedKey, expectedKey);
  } catch {
    return false;
  }
}
