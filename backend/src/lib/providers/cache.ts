/**
 * 🇮🇳 BHARAT SAFE YATRA — PROVIDER RESILIENCE & CACHING ENGINE
 * Phase 9B: Redis / In-Memory Cache, Circuit Breaker, Exponential Backoff
 */

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

class MemoryCacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): { data: T; isExpired: boolean } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() > entry.expiresAt;
    return {
      data: entry.data as T,
      isExpired,
    };
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const providerCache = new MemoryCacheManager();

/**
 * Promise Coalescer (Single-Flight Request Deduplication)
 * Prevents multiple simultaneous incoming requests from hammering external APIs.
 */
const flightRequests = new Map<string, Promise<unknown>>();

export async function deduplicateRequest<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const existing = flightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fetchFn().finally(() => {
    flightRequests.delete(key);
  });

  flightRequests.set(key, promise);
  return promise;
}

/**
 * Exponential Backoff Retry Utility
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; initialDelayMs?: number; backoffFactor?: number } = {}
): Promise<T> {
  const { maxRetries = 2, initialDelayMs = 300, backoffFactor = 2 } = options;
  let lastError: unknown;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      // Do not retry 4xx Client Errors or Auth failures
      const status = (err as { status?: number; statusCode?: number })?.status;
      if (status && status >= 400 && status < 500) {
        throw err;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= backoffFactor;
      }
    }
  }

  throw lastError;
}

/**
 * Circuit Breaker Pattern
 * Protects failing downstream external providers from cascade overload.
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(failureThreshold = 4, resetTimeoutMs = 30000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  getState(): CircuitState {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>, fallbackFn?: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      if (fallbackFn) return fallbackFn();
      throw new Error('Circuit breaker is OPEN. Downstream provider is temporarily suspended.');
    }

    try {
      const result = await fn();
      if (currentState === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
      }

      if (fallbackFn) return fallbackFn();
      throw err;
    }
  }
}
