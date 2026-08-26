/**
 * 🇮🇳 BHARAT SAFE YATRA — VERIFIED PHASE 5 FIXTURES
 * Strict Isolation for Production Frontend Grounding
 *
 * All data is sourced from Phase 5 verified government sources.
 * These fixtures feed the API route handlers until a live database is connected.
 */

import type {
  UnionTerritory,
  Destination,
  Festival,
  EmergencyFacility,
  EmergencyNationalContact,
  ActiveTravelAdvisory,
  BookableExperience,
  BookingProvider,
} from '../../types';

// Dynamic imports to avoid SSR issues with .js data files
// In Next.js App Router, these are consumed server-side in API routes only.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawTerritories = require('../../js/data/territories.js').TERRITORIES as unknown[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawDestinations = require('../../js/data/destinations.js').DESTINATIONS as unknown[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawFestivals = require('../../js/data/festivals.js').FESTIVALS as unknown[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const safetyData = require('../../js/data/safety.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bookingData = require('../../js/data/bookings.js');

export const VERIFIED_TERRITORIES: UnionTerritory[] = rawTerritories as UnionTerritory[];
export const VERIFIED_DESTINATIONS: Destination[] = rawDestinations as Destination[];
export const VERIFIED_FESTIVALS: Festival[] = rawFestivals as Festival[];
export const VERIFIED_EMERGENCY_FACILITIES: EmergencyFacility[] = (safetyData.EMERGENCY_FACILITIES ?? []) as EmergencyFacility[];
export const VERIFIED_NATIONAL_CONTACTS: EmergencyNationalContact[] = (safetyData.EMERGENCY_NATIONAL_CONTACTS ?? []) as EmergencyNationalContact[];
export const VERIFIED_ADVISORIES: ActiveTravelAdvisory[] = (safetyData.ACTIVE_TRAVEL_ADVISORIES ?? []) as ActiveTravelAdvisory[];
export const VERIFIED_BOOKABLE_EXPERIENCES: BookableExperience[] = (bookingData.BOOKABLE_EXPERIENCES ?? []) as BookableExperience[];
export const VERIFIED_BOOKING_PROVIDERS: BookingProvider[] = (bookingData.BOOKING_PROVIDERS ?? []) as BookingProvider[];
