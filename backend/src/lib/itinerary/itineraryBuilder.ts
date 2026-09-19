/**
 * 🇮🇳 BHARAT SAFE YATRA — DETERMINISTIC ITINERARY BUILDER
 * Phase 11.1: Complete Destination Control & Multi-UT Itinerary Generator
 *
 * Enforces:
 * 1. The traveller's selected destination is the source of truth.
 * 2. Works identically for every verified destination across all 8 Union Territories.
 * 3. Never defaults to Khardung La or Ladakh.
 * 4. Multi-day journeys explore distinct verified destinations across the Union Territory.
 * 5. Generates structured days with distinct geographical coordinates for each stop.
 * 6. Tags user selections with isMustVisit = true.
 */

import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES } from '@/src/lib/fixtures';
import type { Destination, TerritoryCode } from '@/src/types';
import type { Itinerary, ItineraryDay, ItineraryItem, TravelStyle, ItineraryPlanRequest } from '@/src/types/itinerary';

export interface BuildItineraryResult {
  success: boolean;
  itinerary?: Itinerary;
  error?: string;
}

export class ItineraryBuilder {
  /**
   * Builds a verified multi-day itinerary strictly around user-selected destination(s)
   */
  public static buildFromDestination(req: ItineraryPlanRequest): BuildItineraryResult {
    const { destinationId, additionalDestinationIds = [], durationDays = 3, travelStyle = 'BALANCED', travellers = 2 } = req;

    if (!destinationId || typeof destinationId !== 'string') {
      return { success: false, error: 'INVALID_DESTINATION' };
    }

    const primaryDest = VERIFIED_DESTINATIONS.find(
      (d) => d.id === destinationId || d.slug === destinationId || d.id.toLowerCase() === destinationId.toLowerCase()
    );

    if (!primaryDest) {
      return { success: false, error: 'INVALID_DESTINATION' };
    }

    const territory = VERIFIED_TERRITORIES.find((t) => t.id === primaryDest.territoryId || t.name === primaryDest.territoryName);
    const territoryId = primaryDest.territoryId;
    const territoryName = primaryDest.territoryName || territory?.name || 'Union Territory';

    // Find all explicitly selected destinations
    const secondaryDests: Destination[] = [];
    for (const sid of additionalDestinationIds) {
      const match = VERIFIED_DESTINATIONS.find((d) => d.id === sid || d.slug === sid);
      if (match && match.id !== primaryDest.id) {
        secondaryDests.push(match);
      }
    }

    const explicitlySelectedDests = [primaryDest, ...secondaryDests];
    const selectedIds = explicitlySelectedDests.map((d) => d.id);

    // Find companion destinations from the same Union Territory for remaining days
    const otherUtDests = VERIFIED_DESTINATIONS.filter(
      (d) => d.territoryId === territoryId && !selectedIds.includes(d.id)
    );

    // Build the ordered destination list for all days of the journey
    const totalDays = Math.max(1, Math.min(30, durationDays));
    const allJourneyDests: Destination[] = [...explicitlySelectedDests];

    for (const otherDest of otherUtDests) {
      if (allJourneyDests.length < totalDays) {
        allJourneyDests.push(otherDest);
      }
    }

    // If totalDays exceeds available UT destinations, cycle through them
    while (allJourneyDests.length < totalDays) {
      const fallback = VERIFIED_DESTINATIONS.find((d) => d.territoryId === territoryId) || primaryDest;
      allJourneyDests.push(fallback);
    }

    const days: ItineraryDay[] = [];
    const isHighAltitude = territoryId === 'LADAKH' || (primaryDest.coordinates.altitude && parseInt(primaryDest.coordinates.altitude) > 3000);

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const currentDest = allJourneyDests[dayNum - 1] || primaryDest;
      const isExplicitlyChosen = selectedIds.includes(currentDest.id);

      const dayItems: ItineraryItem[] = [];

      // Base coordinates for this day's destination
      const baseLat = currentDest.coordinates.lat;
      const baseLng = currentDest.coordinates.lng;

      if (dayNum === 1 && isHighAltitude && currentDest.id === primaryDest.id) {
        // Day 1 High Altitude Acclimatization
        dayItems.push({
          id: `stop-${dayNum}-1`,
          time: '09:30 AM',
          title: `${currentDest.name} — Acclimatization & Heritage Walk`,
          type: 'DESTINATION',
          destinationId: currentDest.id,
          notes: 'Mandatory gentle rest protocol for high altitude. Hydrate frequently.',
          durationMinutes: 120,
          location: { lat: baseLat, lng: baseLng },
          status: 'PLANNED',
          isMustVisit: true,
          isLocked: true,
        });

        // Add evening activity with slight local spatial offset (~600m)
        const eveningActivity = currentDest.thingsToDo?.[0];
        if (eveningActivity) {
          dayItems.push({
            id: `stop-${dayNum}-2`,
            time: '04:30 PM',
            title: eveningActivity.title,
            type: 'EXPERIENCE',
            destinationId: currentDest.id,
            notes: eveningActivity.desc,
            durationMinutes: 90,
            location: { lat: +(baseLat + 0.006).toFixed(4), lng: +(baseLng + 0.005).toFixed(4) },
            status: 'PLANNED',
            isMustVisit: false,
          });
        }
      } else {
        // Morning Stop: Primary Site
        dayItems.push({
          id: `stop-${dayNum}-1`,
          time: '09:00 AM',
          title: currentDest.name,
          type: 'DESTINATION',
          destinationId: currentDest.id,
          notes: currentDest.tagline || currentDest.shortDescription,
          durationMinutes: 150,
          location: { lat: baseLat, lng: baseLng },
          status: 'PLANNED',
          isMustVisit: isExplicitlyChosen,
          isLocked: isExplicitlyChosen,
        });

        // Afternoon Activity: Local trail or attraction (~800m offset)
        const activities = currentDest.thingsToDo || [];
        const act1 = activities[((dayNum - 1) * 2) % activities.length];
        const act2 = activities[((dayNum - 1) * 2 + 1) % activities.length];

        if (act1 && act1.title !== currentDest.name) {
          dayItems.push({
            id: `stop-${dayNum}-2`,
            time: '01:30 PM',
            title: act1.title,
            type: 'ACTIVITY',
            destinationId: currentDest.id,
            notes: act1.desc,
            durationMinutes: 90,
            location: { lat: +(baseLat + 0.008).toFixed(4), lng: +(baseLng + 0.007).toFixed(4) },
            status: 'PLANNED',
            isMustVisit: false,
          });
        }

        // Evening Experience: Sunset / viewpoint / culinary (~1.2km offset)
        if (act2 && act2.title !== act1?.title) {
          dayItems.push({
            id: `stop-${dayNum}-3`,
            time: '05:00 PM',
            title: act2.title,
            type: 'EXPERIENCE',
            destinationId: currentDest.id,
            notes: act2.desc,
            durationMinutes: 75,
            location: { lat: +(baseLat - 0.007).toFixed(4), lng: +(baseLng + 0.009).toFixed(4) },
            status: 'PLANNED',
            isMustVisit: false,
          });
        }
      }

      const dayTitle = dayNum === 1 && isHighAltitude
        ? `Arrival & Acclimatization in ${currentDest.name}`
        : `${currentDest.name} & Signature Highlights`;

      days.push({
        dayNumber: dayNum,
        title: dayTitle,
        summary: `Explore ${currentDest.name} with verified cultural sites, local trails, and safety protocol.`,
        items: dayItems,
      });
    }

    const estimatedBudget = totalDays * travellers * (isHighAltitude ? 4500 : 3200);

    const itinerary: Itinerary = {
      id: `itin-${primaryDest.slug}-${Date.now()}`,
      title: `${totalDays}-Day ${primaryDest.name} & ${territoryName} Journey`,
      territoryId: territoryId as TerritoryCode,
      territoryName,
      durationDays: totalDays,
      travellers,
      travelStyle,
      estimatedBudget,
      days,
      primaryDestinationId: primaryDest.id,
      selectedDestinationIds: selectedIds,
      version: 1,
    };

    return {
      success: true,
      itinerary,
    };
  }
}
