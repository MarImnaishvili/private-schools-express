// src/lib/sanitize.ts

/**
 * Sanitizes user input by trimming whitespace and removing potentially dangerous characters
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .slice(0, 1000); // Limit length to prevent DOS attacks
}

/**
 * Sanitizes URL input and validates format
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Only allow http:// and https:// protocols
  if (trimmed && !trimmed.match(/^https?:\/\//i)) {
    return "";
  }

  return trimmed.slice(0, 500); // Limit URL length
}

/**
 * Sanitizes phone number input
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone) return "";

  // Remove all non-digit, non-plus, non-space, non-dash characters
  return phone
    .trim()
    .replace(/[^\d+\s-]/g, "")
    .slice(0, 20); // Limit phone number length
}

/**
 * Sanitizes numeric input
 */
export function sanitizeNumber(input: string | number | undefined | null): number | undefined {
  if (input === undefined || input === null || input === "") return undefined;

  const num = typeof input === "string" ? parseFloat(input) : input;

  if (isNaN(num)) return undefined;

  return num;
}

/**
 * Sanitizes email input
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email) return "";

  return email
    .trim()
    .toLowerCase()
    .slice(0, 254); // RFC 5321 max email length
}
