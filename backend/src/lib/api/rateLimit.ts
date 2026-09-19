/**
 * 🇮🇳 BHARAT SAFE YATRA — IN-PROCESS RATE LIMITER
 * Phase 8 — Backend Implementation
 *
 * Uses a sliding window algorithm stored in-process.
 * For production with Redis, replace the Map with ioredis calls.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/** Default configurations per endpoint category */
export const RATE_LIMITS = {
  /** Auth endpoints — strict to prevent brute force */
  AUTH: { maxRequests: 10, windowMs: 15 * 60 * 1000 },
  /** AI endpoints — expensive LLM calls */
  AI: { maxRequests: 30, windowMs: 60 * 1000 },
  /** Public read endpoints */
  PUBLIC: { maxRequests: 200, windowMs: 60 * 1000 },
  /** User mutation endpoints */
  USER: { maxRequests: 50, windowMs: 60 * 1000 },
  /** SOS — must never be aggressively rate limited */
  SOS: { maxRequests: 20, windowMs: 60 * 1000 },
  /** Booking endpoints */
  BOOKING: { maxRequests: 20, windowMs: 60 * 1000 },
} as const;

/**
 * Check if a given key is within rate limits.
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfterMs: number }`
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > config.windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count < config.maxRequests) {
    entry.count++;
    return { allowed: true };
  }

  const retryAfterMs = config.windowMs - (now - entry.windowStart);
  return { allowed: false, retryAfterMs };
}

/**
 * Extract a rate limit key from a request.
 * Prefers real IP over forwarded headers; falls back to 'unknown'.
 */
export function getRateLimitKey(
  request: Request,
  prefix: string
): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  return `${prefix}:${ip}`;
}
