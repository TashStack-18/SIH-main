/**
 * 🇮🇳 BHARAT SAFE YATRA — ACCOMMODATION SERVICE ORCHESTRATOR
 * Phase 9B: Blended Commercial (Amadeus) & Official Government Stays
 */

import { AmadeusHotelProvider } from './amadeusHotelProvider';
import { GovtStaysAdapter } from './govtStaysAdapter';
import { HotelProperty } from '../types';
import { providerCache, deduplicateRequest } from '../cache';

const amadeusHotels = new AmadeusHotelProvider();
const govtStays = new GovtStaysAdapter();

export async function searchHotelsWithFallback(
  cityCodeOrTerritory: string,
  checkInDate?: string,
  checkOutDate?: string,
  guests = 2
): Promise<HotelProperty[]> {
  const cacheKey = `hotels:${cityCodeOrTerritory.toLowerCase()}:${checkInDate || 'any'}:${guests}`;

  const cached = providerCache.get<HotelProperty[]>(cacheKey);
  if (cached && !cached.isExpired) {
    return cached.data;
  }

  return deduplicateRequest(cacheKey, async () => {
    // 1. Fetch Official Verified Govt Stays (Always included for heritage & official reliability)
    const officialStays = (await govtStays.searchHotels(cityCodeOrTerritory)) || [];

    // 2. Fetch Commercial Inventory from Amadeus
    let commercialHotels: HotelProperty[] = [];
    try {
      const liveHotels = await amadeusHotels.searchHotels(cityCodeOrTerritory, checkInDate, checkOutDate, guests);
      if (liveHotels && liveHotels.length > 0) {
        commercialHotels = liveHotels;
      }
    } catch (err) {
      console.warn('[Hotel Service] Amadeus commercial hotel search failed:', err);
    }

    // Blend: Official Stays first, followed by Commercial GDS properties
    const combined = [...officialStays, ...commercialHotels];
    providerCache.set(cacheKey, combined, 3600);
    return combined;
  });
}
