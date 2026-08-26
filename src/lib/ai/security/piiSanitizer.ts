/**
 * 🇮🇳 BHARAT SAFE YATRA — PII SANITIZATION & PRIVACY SHIELD
 * Phase 10: Prevents sensitive personal data leakage to LLM providers
 */

// Regex patterns for Indian PII identifiers
const AADHAAR_REGEX = /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/g;
const CREDIT_CARD_REGEX = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g;
const CVV_REGEX = /\b(?:cvv|cvc|security\s*code)[:\s]*([0-9]{3,4})\b/gi;
const API_KEY_REGEX = /\b(sk-[a-zA-Z0-9_-]{20,}|rzp_[a-zA-Z0-9_-]{14,})\b/g;

export function sanitizePII(text: string): { sanitized: string; redactedCount: number } {
  let redactedCount = 0;

  let sanitized = text.replace(AADHAAR_REGEX, () => {
    redactedCount++;
    return '[REDACTED_AADHAAR]';
  });

  sanitized = sanitized.replace(CREDIT_CARD_REGEX, () => {
    redactedCount++;
    return '[REDACTED_CARD_NUMBER]';
  });

  sanitized = sanitized.replace(CVV_REGEX, () => {
    redactedCount++;
    return 'cvv: [REDACTED]';
  });

  sanitized = sanitized.replace(API_KEY_REGEX, () => {
    redactedCount++;
    return '[REDACTED_SECRET_KEY]';
  });

  return { sanitized, redactedCount };
}
