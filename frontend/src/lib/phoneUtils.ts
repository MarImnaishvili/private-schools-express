// Phone number formatting utilities for Georgian phone numbers

/**
 * Formats a Georgian phone number to a consistent format: +995 XXX XX XX XX
 * Handles various input formats and cleans up the number
 */
export function formatGeorgianPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Handle different cases
  if (cleaned.startsWith("995")) {
    // Already has country code
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("0")) {
    // Remove leading zero
    cleaned = cleaned.substring(1);
  }

  // Ensure it's a 9-digit number (Georgian mobile numbers)
  if (cleaned.length !== 9) {
    // Return original if not valid length
    return phone;
  }

  // Format as: +995 XXX XX XX XX
  return `+995 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)}`;
}

/**
 * Validates if a string is a valid Georgian phone number
 */
export function isValidGeorgianPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, "");

  // Check if it's 9 digits (local) or 12 digits (with country code)
  if (cleaned.length === 9) {
    // Should start with 5 (mobile) or other valid prefixes
    return /^[5-9]\d{8}$/.test(cleaned);
  } else if (cleaned.length === 12) {
    // Should start with 995
    return /^995[5-9]\d{8}$/.test(cleaned);
  }

  return false;
}

/**
 * Cleans a phone number by removing all formatting
 */
export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}
