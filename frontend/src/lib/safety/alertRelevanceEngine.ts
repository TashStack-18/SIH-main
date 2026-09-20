/**
 * 🇮🇳 DISHAARA — DETERMINISTIC ALERT RELEVANCE ENGINE
 *
 * Evaluates whether an active verified emergency or disruption
 * strictly intersects the traveller's context:
 * - Selected destination
 * - Destination being actively viewed
 * - Active itinerary stops
 * - Travel dates overlap
 * - Planned route corridor disruptions
 * - Geolocation proximity
 *
 * NEVER uses AI hallucination or heuristics to invent emergencies.
 */

import { TravelAlert, UserTravelContext, AlertRelevanceEvaluation } from '@/src/types/travelAlert';

const VERIFIED_STATUSES = new Set(['VERIFIED', 'VERIFIED_STATIC', 'LIVE', 'UPDATED']);

// Distance calculation using Haversine formula (km)
function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeId(id?: string | null): string {
  if (!id) return '';
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function evaluateAlertRelevance(
  alert: TravelAlert,
  context: UserTravelContext,
  referenceTime: Date = new Date()
): AlertRelevanceEvaluation {
  // 1. Verification Status Check: Must be authoritative verified data
  if (!VERIFIED_STATUSES.has(alert.verification_status)) {
    return { isRelevant: false, matchType: 'NONE', matchReason: 'Unverified source status' };
  }

  // 2. Active Time Validity Check
  const effectiveUntil = new Date(alert.effective_until);
  if (isNaN(effectiveUntil.getTime()) || effectiveUntil < referenceTime) {
    return { isRelevant: false, matchType: 'NONE', matchReason: 'Alert has expired' };
  }

  // 3. Travel Dates Relevance Check (if user has set planned trip dates)
  const tripStartDate = context.activeItinerary?.startDate ? new Date(context.activeItinerary.startDate) : null;
  const tripEndDate = context.activeItinerary?.endDate ? new Date(context.activeItinerary.endDate) : null;

  if (tripStartDate && tripEndDate && !isNaN(tripStartDate.getTime()) && !isNaN(tripEndDate.getTime())) {
    const alertStart = new Date(alert.effective_from);
    const alertEnd = new Date(alert.effective_until);

    // If trip does not overlap with alert window, alert is irrelevant
    const overlaps = alertStart <= tripEndDate && alertEnd >= tripStartDate;
    if (!overlaps) {
      return {
        isRelevant: false,
        matchType: 'NONE',
        matchReason: `Alert period (${alertStart.toLocaleDateString()} - ${alertEnd.toLocaleDateString()}) does not overlap with travel dates (${tripStartDate.toLocaleDateString()} - ${tripEndDate.toLocaleDateString()})`,
      };
    }
  }

  const affectedDestinations = new Set((alert.affected_destination_ids || []).map(normalizeId));
  const affectedTerritories = new Set((alert.affected_territory_ids || []).map(normalizeId));

  // 4. Actively Viewed Destination Page Match (/destinations/[slug])
  if (context.currentViewedDestinationSlug) {
    const viewedNorm = normalizeId(context.currentViewedDestinationSlug);
    if (affectedDestinations.has(viewedNorm) || Array.from(affectedDestinations).some((d) => viewedNorm.includes(d) || d.includes(viewedNorm))) {
      return {
        isRelevant: true,
        matchType: 'VIEWED_PAGE',
        matchReason: `Active travel advisory affecting this destination.`,
      };
    }
  }

  // 5. Selected Destination Match
  if (context.selectedDestinationId) {
    const selectedNorm = normalizeId(context.selectedDestinationId);
    if (affectedDestinations.has(selectedNorm) || Array.from(affectedDestinations).some((d) => selectedNorm.includes(d) || d.includes(selectedNorm))) {
      return {
        isRelevant: true,
        matchType: 'DESTINATION',
        matchReason: `Your selected travel destination is in the advisory zone.`,
      };
    }
  }

  // 6. Planned Route Disruption Match (e.g. Leh -> Nubra Valley)
  if (alert.affected_routes && alert.affected_routes.length > 0 && context.activeItinerary) {
    const userLegs: Array<{ from: string; to: string }> = [];

    // From explicit routes in itinerary
    if (context.activeItinerary.routes) {
      context.activeItinerary.routes.forEach((r) => {
        userLegs.push({ from: normalizeId(r.from), to: normalizeId(r.to) });
      });
    }

    // From sequential stops in itinerary
    if (context.activeItinerary.stops && context.activeItinerary.stops.length > 1) {
      for (let i = 0; i < context.activeItinerary.stops.length - 1; i++) {
        const fromStop = context.activeItinerary.stops[i].destinationId;
        const toStop = context.activeItinerary.stops[i + 1].destinationId;
        if (fromStop && toStop) {
          userLegs.push({ from: normalizeId(fromStop), to: normalizeId(toStop) });
        }
      }
    }

    // Check if any leg matches the affected route corridors
    for (const affectedRoute of alert.affected_routes) {
      const aFrom = normalizeId(affectedRoute.from);
      const aTo = normalizeId(affectedRoute.to);

      for (const leg of userLegs) {
        const directMatch = (leg.from.includes(aFrom) || aFrom.includes(leg.from)) &&
                            (leg.to.includes(aTo) || aTo.includes(leg.to));
        const reverseMatch = (leg.from.includes(aTo) || aTo.includes(leg.from)) &&
                             (leg.to.includes(aFrom) || aFrom.includes(leg.to));

        if (directMatch || reverseMatch) {
          return {
            isRelevant: true,
            matchType: 'ROUTE',
            matchReason: `Travel disruption on your planned route ${affectedRoute.label ? `via ${affectedRoute.label}` : ''}.`,
          };
        }
      }
    }
  }

  // 7. Active Itinerary Stops Match
  if (context.activeItinerary) {
    const itineraryDestinations = (context.activeItinerary.destinationIds || []).map(normalizeId);
    if (context.activeItinerary.stops) {
      context.activeItinerary.stops.forEach((s) => {
        if (s.destinationId) itineraryDestinations.push(normalizeId(s.destinationId));
      });
    }

    // Check if any stop in itinerary is affected
    for (const destId of itineraryDestinations) {
      if (affectedDestinations.has(destId) || Array.from(affectedDestinations).some((d) => destId.includes(d) || d.includes(destId))) {
        return {
          isRelevant: true,
          matchType: 'ITINERARY',
          matchReason: `Your itinerary includes this destination during the advisory period.`,
        };
      }
    }

    // Check territory matching if itinerary is explicitly within this territory
    if (context.activeItinerary.territoryId) {
      const itinTerritoryNorm = normalizeId(context.activeItinerary.territoryId);
      if (affectedTerritories.has(itinTerritoryNorm)) {
        return {
          isRelevant: true,
          matchType: 'ITINERARY',
          matchReason: `Your planned itinerary traverses an area under active travel advisory.`,
        };
      }
    }
  }

  // 8. User Geolocation Proximity Match (if location permission granted)
  if (context.userLocation && alert.affected_coordinates) {
    const dist = calculateHaversineDistanceKm(
      context.userLocation.lat,
      context.userLocation.lng,
      alert.affected_coordinates.lat,
      alert.affected_coordinates.lng
    );

    // Standard emergency safety radius: 35 km
    if (dist <= 35) {
      return {
        isRelevant: true,
        matchType: 'LOCATION',
        matchReason: `Active travel advisory within ${Math.round(dist)} km of your current location.`,
      };
    }
  }

  // 9. AI Discussion Context Match
  if (context.aiSelectedDestinationId) {
    const aiDestNorm = normalizeId(context.aiSelectedDestinationId);
    if (affectedDestinations.has(aiDestNorm) || Array.from(affectedDestinations).some((d) => aiDestNorm.includes(d) || d.includes(aiDestNorm))) {
      return {
        isRelevant: true,
        matchType: 'DESTINATION',
        matchReason: `Active advisory for the destination discussed with Dishaara AI.`,
      };
    }
  }

  return { isRelevant: false, matchType: 'NONE', matchReason: 'No geographic or itinerary overlap' };
}

/**
 * Filter and sort alerts by relevance and severity
 */
export function filterAndRankRelevantAlerts(
  alerts: TravelAlert[],
  context: UserTravelContext,
  referenceTime: Date = new Date()
): Array<{ alert: TravelAlert; evaluation: AlertRelevanceEvaluation }> {
  const severityScore: Record<string, number> = {
    CRITICAL: 4,
    WARNING: 3,
    ADVISORY: 2,
    INFO: 1,
  };

  const relevantList: Array<{ alert: TravelAlert; evaluation: AlertRelevanceEvaluation }> = [];

  for (const alert of alerts) {
    const evalResult = evaluateAlertRelevance(alert, context, referenceTime);
    if (evalResult.isRelevant) {
      relevantList.push({ alert, evaluation: evalResult });
    }
  }

  // Deterministic priority ordering: CRITICAL > WARNING > ADVISORY > INFO, then newest
  relevantList.sort((a, b) => {
    const scoreA = severityScore[a.alert.severity] || 0;
    const scoreB = severityScore[b.alert.severity] || 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return new Date(b.alert.updated_at).getTime() - new Date(a.alert.updated_at).getTime();
  });

  return relevantList;
}
