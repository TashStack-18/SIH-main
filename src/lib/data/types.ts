/**
 * 🇮🇳 BHARAT SAFE YATRA — DATA CLASSIFICATION & FRESHNESS TYPES
 * Phase 5.2: Verified Tourism Data System
 *
 * Every piece of tourism information must carry provenance metadata
 * distinguishing STATIC_VERIFIED from LIVE from UNAVAILABLE.
 */

// ============================================================
// DATA CLASSIFICATION
// ============================================================

/**
 * How often this data changes and how it was verified.
 *
 * STATIC_VERIFIED   — Rarely changes (history, geography, heritage). Verified from authoritative source.
 * CURRENT_VERIFIED  — Changes periodically (permit rules, opening hours). Verified from government source.
 * LIVE              — Retrieved from a live API/feed. Provider responded successfully within TTL.
 * LAST_VERIFIED     — No live API exists but checked against authoritative source (e.g. festival calendar).
 * UNAVAILABLE       — No trustworthy current source is available.
 */
export type DataClassification =
  | 'STATIC_VERIFIED'
  | 'CURRENT_VERIFIED'
  | 'LIVE'
  | 'LAST_VERIFIED'
  | 'UNAVAILABLE';

/**
 * Freshness state of dynamic data.
 * LIVE      — Data came from live provider and is within TTL.
 * FRESH     — Recently cached, still within primary TTL.
 * RECENT    — Cached, past primary TTL but within extended TTL.
 * STALE     — Past extended TTL. Still shown but clearly labelled.
 * EXPIRED   — Past all TTLs. Should not be shown as current.
 * UNAVAILABLE — Provider failed and no cache exists.
 */
export type FreshnessState =
  | 'LIVE'
  | 'FRESH'
  | 'RECENT'
  | 'STALE'
  | 'EXPIRED'
  | 'UNAVAILABLE';

// ============================================================
// DATA PROVENANCE
// ============================================================

export type SourceType =
  | 'PRIMARY_GOVERNMENT'
  | 'OFFICIAL_TOURISM'
  | 'LICENSED_PROVIDER'
  | 'VERIFIED_COMMERCIAL'
  | 'UNVERIFIED';

export interface DataProvenance {
  classification: DataClassification;
  source: string;
  sourceUrl: string;
  sourceType: SourceType;
  retrievedAt: string;       // ISO 8601
  verifiedAt: string;        // ISO 8601
  expiresAt?: string;        // ISO 8601, only for LIVE/CACHED data
  freshnessState: FreshnessState;
  provider?: string;         // e.g. "OpenWeather", "Amadeus"
}

// ============================================================
// BOOKING PROVIDER
// ============================================================

export type BookingServiceType =
  | 'HOTEL'
  | 'FLIGHT'
  | 'FERRY'
  | 'ACTIVITY'
  | 'PACKAGE'
  | 'TRANSPORT'
  | 'TOUR';

export type BookingLinkStatus = 'ACTIVE' | 'INVALID' | 'PENDING_VERIFICATION';

export type AvailabilityState =
  | 'CHECK_ON_PROVIDER'    // Default — we have no live availability data
  | 'LIVE_AVAILABLE'       // Provider API confirmed availability
  | 'LIVE_UNAVAILABLE'     // Provider API confirmed sold out
  | 'UNAVAILABLE';         // Provider is unreachable

export interface VerifiedBookingProvider {
  id: string;
  name: string;
  officialDomain: string;
  bookingUrl: string;
  serviceTypes: BookingServiceType[];
  territoryCoverage: string[];        // territory IDs
  destinationCoverage?: string[];     // destination slugs
  deepLinkCapable: boolean;
  providerType: SourceType;
  verifiedAt: string;
  linkStatus: BookingLinkStatus;
  domainVerified: boolean;
}

export interface BookingRedirectRecord {
  providerId: string;
  providerName: string;
  bookingUrl: string;
  serviceType: BookingServiceType;
  destinationSlug?: string;
  territoryId: string;
  availabilityState: AvailabilityState;
  lastVerified: string;
  linkStatus: BookingLinkStatus;
}

// ============================================================
// DESTINATION STATUS
// ============================================================

export type DestinationStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'RESTRICTED'
  | 'SEASONALLY_AVAILABLE'
  | 'UNKNOWN';

// ============================================================
// FRESHNESS HELPERS
// ============================================================

/**
 * Calculate freshness state from a timestamp and TTL rules.
 */
export function calculateFreshness(
  retrievedAt: string,
  ttlSeconds: number,
  extendedTtlSeconds?: number
): FreshnessState {
  const now = Date.now();
  const retrieved = new Date(retrievedAt).getTime();
  if (isNaN(retrieved)) return 'UNAVAILABLE';

  const ageSeconds = (now - retrieved) / 1000;

  if (ageSeconds <= 60) return 'LIVE';
  if (ageSeconds <= ttlSeconds) return 'FRESH';
  if (extendedTtlSeconds && ageSeconds <= extendedTtlSeconds) return 'RECENT';
  if (ageSeconds <= (extendedTtlSeconds || ttlSeconds) * 2) return 'STALE';
  return 'EXPIRED';
}

/**
 * Format a relative time string like "Updated 3 min ago".
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const now = Date.now();
  const then = new Date(isoTimestamp).getTime();
  if (isNaN(then)) return 'Unknown';

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

// ============================================================
// TTL CONSTANTS (seconds)
// ============================================================

export const DATA_TTL = {
  WEATHER: 900,           // 15 minutes
  WEATHER_EXTENDED: 3600, // 1 hour (stale but usable)
  ROUTE: 1800,            // 30 minutes
  FLIGHT: 300,            // 5 minutes
  HOTEL: 600,             // 10 minutes
  FESTIVAL: 86400,        // 24 hours
  ADVISORY: 3600,         // 1 hour
  DESTINATION: 604800,    // 7 days (static verified)
  BOOKING_LINK: 86400,    // 24 hours
} as const;
