/**
 * 🇮🇳 BHARAT SAFE YATRA — FLIGHT SERVICE ORCHESTRATOR
 * Phase 9B: Multi-Tier Resilient Flight Search & Schedules
 */

import { AmadeusFlightProvider } from './amadeusFlightProvider';
import { VerifiedFlightScheduleProvider } from './verifiedFlightScheduleProvider';
import { FlightOffer } from '../types';
import { providerCache, deduplicateRequest } from '../cache';

const amadeus = new AmadeusFlightProvider();
const fallbackSchedules = new VerifiedFlightScheduleProvider();

export async function searchFlightsWithFallback(
  origin: string,
  destination: string,
  departureDate: string,
  adults = 1
): Promise<FlightOffer[]> {
  const cacheKey = `flights:${origin.toUpperCase()}:${destination.toUpperCase()}:${departureDate}:${adults}`;

  const cached = providerCache.get<FlightOffer[]>(cacheKey);
  if (cached && !cached.isExpired) {
    return cached.data;
  }

  return deduplicateRequest(cacheKey, async () => {
    try {
      // 1. Try Amadeus Live GDS
      const liveOffers = await amadeus.searchFlights(origin, destination, departureDate, adults);
      if (liveOffers && liveOffers.length > 0) {
        providerCache.set(cacheKey, liveOffers, 1800); // 30 min cache
        return liveOffers;
      }
    } catch (err) {
      console.warn('[Flight Service] Live Amadeus flight search failed, invoking verified schedule engine:', err);
    }

    // 2. Fallback to Verified DGCA Schedules
    const scheduledOffers = (await fallbackSchedules.searchFlights(origin, destination, departureDate, adults)) || [];
    providerCache.set(cacheKey, scheduledOffers, 7200);
    return scheduledOffers;
  });
}
