import { z } from 'zod';

/**
 * Georgian phone number regex - with spaces
 * Format: +995 XXX XX XX XX
 */
const GEORGIAN_PHONE_REGEX_WITH_SPACES = /^\+995\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/;

/**
 * Georgian phone number regex - without spaces
 * Format: +995XXXXXXXXX
 */
const GEORGIAN_PHONE_REGEX_NO_SPACES = /^\+995\d{9}$/;

/**
 * Georgian phone number regex - 9 digits only (will auto-add +995)
 * Format: XXXXXXXXX
 */
const GEORGIAN_PHONE_REGEX_9_DIGITS = /^\d{9}$/;

/**
 * Validates Georgian phone number format (accepts all formats)
 */
export function isValidGeorgianPhone(phone: string | undefined | null): boolean {
  if (!phone) return true; // Allow empty values
  const cleaned = phone.trim();
  return (
    GEORGIAN_PHONE_REGEX_WITH_SPACES.test(cleaned) ||
    GEORGIAN_PHONE_REGEX_NO_SPACES.test(cleaned) ||
    GEORGIAN_PHONE_REGEX_9_DIGITS.test(cleaned)
  );
}

/**
 * Zod schema for Georgian phone number
 * Optional field that validates format when provided
 * Accepts: +995 577 18 91 27 OR +995577189127 OR 577189127
 */
export const georgianPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const cleaned = val.trim();
      return (
        GEORGIAN_PHONE_REGEX_WITH_SPACES.test(cleaned) ||
        GEORGIAN_PHONE_REGEX_NO_SPACES.test(cleaned) ||
        GEORGIAN_PHONE_REGEX_9_DIGITS.test(cleaned)
      );
    },
    {
      message: 'Phone number must be 9 digits or in format: +995 XXX XX XX XX (e.g., 577189127 or +995 577 18 91 27)',
    }
  )
  .transform((val) => {
    // Auto-format to standard format with spaces
    if (!val) return val;
    return formatGeorgianPhone(val) || val;
  });

/**
 * Formats a phone number string to Georgian format
 * Accepts: 9 digits (599323215) OR +995XXXXXXXXX OR +995 XXX XX XX XX
 * Returns: +995 XXX XX XX XX
 */
export function formatGeorgianPhone(phone: string | undefined | null): string {
  if (!phone) return '';

  // Remove all spaces and non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  let digits: string;

  // Check if it's just 9 digits (without +995)
  if (/^\d{9}$/.test(cleaned)) {
    digits = cleaned;
  } else if (cleaned.startsWith('+995')) {
    // Extract the digits after +995
    digits = cleaned.substring(4);
  } else {
    // Invalid format
    return '';
  }

  // Must have exactly 9 digits
  if (digits.length !== 9) return '';

  // Format: +995 XXX XX XX XX
  return `+995 ${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
}
