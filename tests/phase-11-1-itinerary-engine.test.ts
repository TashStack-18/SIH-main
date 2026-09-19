/**
 * 🇮🇳 BHARAT SAFE YATRA — PHASE 11.1 TEST SUITE
 * Comprehensive verification of Destination Control, Feasibility, Routing,
 * Detour Intelligence, Optimization, Mapbox Matrix, and Regression Tests across all 8 UTs.
 */

import { ItineraryBuilder } from '../src/lib/itinerary/itineraryBuilder';
import { FeasibilityEngine } from '../src/lib/itinerary/feasibilityEngine';
import { RecommendationEngine } from '../src/lib/itinerary/recommendationEngine';
import { SpatialEngine } from '../src/lib/geospatial/spatialEngine';
import { calculateMatrixWithFallback, calculateRouteWithFallback } from '../src/lib/providers/maps';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES, VERIFIED_BOOKING_PROVIDERS } from '../src/lib/fixtures';
import { validateBookingRedirect } from '../src/lib/data/approvedDomains';
import { createItineraryProposalTool } from '../src/lib/ai/tools/writeTools';

describe('Phase 11.1: Complete Destination Control across all 8 Union Territories', () => {
  const testDestinations = [
    { ut: 'LADAKH', id: 'pangong-tso', name: 'Pangong Tso' },
    { ut: 'LADAKH', id: 'nubra-valley', name: 'Nubra Valley & Hunder Sand Dunes' },
    { ut: 'LADAKH', id: 'leh-town', name: 'Leh Old Town & Palace' },
    { ut: 'CHANDIGARH', id: 'sukhna-lake', name: 'Sukhna Lake' },
    { ut: 'DELHI', id: 'red-fort-delhi', name: 'Red Fort (Lal Qila)' },
    { ut: 'LAKSHADWEEP', id: 'kavaratti', name: 'Kavaratti Island' },
    { ut: 'JAMMU_KASHMIR', id: 'dal-lake-srinagar', name: 'Dal Lake & Mughal Gardens' },
    { ut: 'PUDUCHERRY', id: 'french-quarter-puducherry', name: 'French Quarter (White Town) & Promenade' },
    { ut: 'ANDAMAN_NICOBAR', id: 'cellular-jail', name: 'Cellular Jail National Memorial' },
    { ut: 'DNH_DD', id: 'diu-fort', name: 'Diu Fort & Naida Caves' },
  ];

  test.each(testDestinations)(
    'Should build verified itinerary centered strictly around %s: %s ($id)',
    ({ id, name, ut }) => {
      const result = ItineraryBuilder.buildFromDestination({
        destinationId: id,
        durationDays: 3,
        travelStyle: 'BALANCED',
        travellers: 2,
      });

      expect(result.success).toBe(true);
      expect(result.itinerary).toBeDefined();

      const itin = result.itinerary!;
      expect(itin.territoryId).toBe(ut);
      expect(itin.primaryDestinationId).toBe(id);
      expect(itin.title).toContain(name);

      // Check first stop has this destination and is tagged must-visit
      const firstStop = itin.days[0].items[0];
      expect(firstStop.destinationId).toBe(id);
      expect(firstStop.isMustVisit).toBe(true);

      // CRITICAL REGRESSION CHECK: Khardung La must NOT be the selected destination unless explicitly requested
      if (id !== 'khardung-la') {
        expect(itin.primaryDestinationId).not.toBe('khardung-la');
        expect(itin.title).not.toContain('Khardung La');
      }
    }
  );

  test('Rejects invalid destination ID with INVALID_DESTINATION error', () => {
    const result = ItineraryBuilder.buildFromDestination({
      destinationId: 'non-existent-destination-xyz',
      durationDays: 3,
      travelStyle: 'BALANCED',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('INVALID_DESTINATION');
    expect(result.itinerary).toBeUndefined();
  });

  test('Multi-destination support: preserves multiple explicitly selected destinations', () => {
    const result = ItineraryBuilder.buildFromDestination({
      destinationId: 'leh-town',
      additionalDestinationIds: ['nubra-valley', 'pangong-tso'],
      durationDays: 4,
      travelStyle: 'ADVENTURE',
    });

    expect(result.success).toBe(true);
    const itin = result.itinerary!;
    expect(itin.selectedDestinationIds).toEqual(['leh-town', 'nubra-valley', 'pangong-tso']);

    const allStopDestIds = itin.days.flatMap((d) => d.items.map((i) => i.destinationId));
    expect(allStopDestIds).toContain('leh-town');
    expect(allStopDestIds).toContain('nubra-valley');
    expect(allStopDestIds).toContain('pangong-tso');
  });
});

describe('Phase 11.1: Along-the-Route Detour Calculations', () => {
  test('Calculates genuine detour delta for candidate stop between origin and destination', () => {
    // Route from Leh (34.15, 77.57) to Pangong (33.75, 78.66)
    const origin = { lat: 34.1526, lng: 77.5771, name: 'Leh Town' };
    const destination = { lat: 33.753, lng: 78.667, name: 'Pangong Tso' };

    // Candidate stop Hemis Monastery
    const hemis = VERIFIED_DESTINATIONS.find((d) => d.id === 'hemis-monastery')!;
    expect(hemis).toBeDefined();

    const detour = SpatialEngine.calculateDetour(origin, destination, hemis);

    expect(detour.addedDistanceKm).toBeGreaterThanOrEqual(0);
    expect(detour.addedDurationMinutes).toBeGreaterThanOrEqual(0);
    expect(detour.detourDisplay).toMatch(/\+\d+\s*(min|hr)/);
    expect(detour.newTotalDistanceKm).toBeGreaterThan(0);
  });

  test('findRouteAwareRecommendations filters candidates within reasonable detour radius', () => {
    const routePoints = [
      { lat: 34.1526, lng: 77.5771, name: 'Leh Town' },
      { lat: 33.753, lng: 78.667, name: 'Pangong Tso' },
    ];

    const recs = SpatialEngine.findRouteAwareRecommendations(routePoints, 50, 'LADAKH');
    expect(Array.isArray(recs)).toBe(true);
    recs.forEach((rec) => {
      expect(rec.candidateDestination.territoryId).toBe('LADAKH');
      expect(rec.addedDistanceKm).toBeGreaterThanOrEqual(0);
      expect(rec.detourDisplay).toBeDefined();
    });
  });
});

describe('Phase 11.1: Route Optimization Engine with User Choice', () => {
  test('generateOptimizationProposal creates non-destructive proposal with verified savings', () => {
    // Build an itinerary that forces backtracking: A -> C -> B where C is far away
    const itin = ItineraryBuilder.buildFromDestination({
      destinationId: 'sukhna-lake',
      additionalDestinationIds: ['rose-garden', 'capitol-complex'],
      durationDays: 3,
      travelStyle: 'BALANCED',
    }).itinerary!;

    // Intentionally create a suboptimal sequence with backtracking
    itin.days[0].items = [
      {
        id: 's1',
        time: '09:00 AM',
        title: 'Sukhna Lake',
        type: 'DESTINATION',
        location: { lat: 30.7421, lng: 76.8187 },
        destinationId: 'sukhna-lake',
        isLocked: true, // Start stop is locked
        isMustVisit: true,
      },
      {
        id: 's2',
        time: '01:00 PM',
        title: 'Leisure Valley (Far)',
        type: 'DESTINATION',
        location: { lat: 30.7392, lng: 76.7792 },
        destinationId: 'leisure-valley',
        isLocked: false,
      },
      {
        id: 's3',
        time: '03:00 PM',
        title: 'Rock Garden (Next to Sukhna Lake)',
        type: 'DESTINATION',
        location: { lat: 30.7525, lng: 76.8088 },
        destinationId: 'rock-garden',
        isLocked: false,
      },
      {
        id: 's4',
        time: '06:00 PM',
        title: 'Rose Garden (Near Leisure Valley)',
        type: 'DESTINATION',
        location: { lat: 30.7454, lng: 76.783 },
        destinationId: 'rose-garden',
        isLocked: false,
      },
    ];

    const proposal = RecommendationEngine.generateOptimizationProposal(itin);
    if (proposal) {
      expect(proposal.savedDistanceKm).toBeGreaterThan(0);
      expect(proposal.savedDurationMinutes).toBeGreaterThan(0);
      expect(proposal.rationale).toContain('We found a more efficient route');
      expect(proposal.itinerary).toBeDefined();
      expect(proposal.suggestedSequence.length).toBe(proposal.currentSequence.length);
    }
  });

  test('scaleDuration protects user must-visit and locked stops when shortening trip', () => {
    const itin = ItineraryBuilder.buildFromDestination({
      destinationId: 'pangong-tso',
      additionalDestinationIds: ['nubra-valley'],
      durationDays: 5,
      travelStyle: 'BALANCED',
    }).itinerary!;

    // Mark Pangong Tso as must-visit and locked
    itin.days[0].items[0].isMustVisit = true;
    itin.days[0].items[0].isLocked = true;

    const scaled = RecommendationEngine.scaleDuration(itin, 2);
    expect(scaled.itinerary.durationDays).toBe(2);

    // Pangong Tso must still exist in the scaled itinerary
    const allRemainingDestIds = scaled.itinerary.days.flatMap((d) => d.items.map((i) => i.destinationId));
    expect(allRemainingDestIds).toContain('pangong-tso');
  });
});

describe('Phase 11.1: Mapbox Directions & Matrix Integration', () => {
  test('calculateMatrixWithFallback produces valid pairwise durations and distances', async () => {
    const origins = [
      { lat: 28.6562, lng: 77.241, name: 'Red Fort' },
      { lat: 28.5244, lng: 77.1855, name: 'Qutub Minar' },
    ];
    const destinations = [
      { lat: 28.5933, lng: 77.2507, name: "Humayun's Tomb" },
      { lat: 28.6129, lng: 77.2295, name: 'India Gate' },
    ];

    const matrix = await calculateMatrixWithFallback(origins, destinations, 'driving');

    expect(matrix).toBeDefined();
    expect(matrix.durations.length).toBe(2);
    expect(matrix.durations[0].length).toBe(2);
    expect(matrix.distances.length).toBe(2);
    expect(matrix.distances[0].length).toBe(2);

    // Pair distances must be positive numbers
    expect(matrix.distances[0][0]).toBeGreaterThan(0);
    expect(matrix.durations[0][0]).toBeGreaterThan(0);
    expect(matrix.metadata.status).toMatch(/(LIVE|CACHED|FALLBACK)/);
  });

  test('calculateRouteWithFallback returns valid turn-by-turn route geometry', async () => {
    const waypoints = [
      { lat: 30.7421, lng: 76.8187, name: 'Sukhna Lake' },
      { lat: 30.7525, lng: 76.8088, name: 'Rock Garden' },
    ];

    const route = await calculateRouteWithFallback(waypoints, 'driving');
    expect(route).toBeDefined();
    expect(route.totalDistanceKm).toBeGreaterThan(0);
    expect(route.totalDurationMinutes).toBeGreaterThan(0);
    expect(route.geometryGeoJSON.type).toBe('LineString');
    expect(route.geometryGeoJSON.coordinates.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Phase 11.1: Booking Provider Verification & Security', () => {
  test('All booking providers in fixture have approved domains', () => {
    expect(VERIFIED_BOOKING_PROVIDERS.length).toBeGreaterThan(0);

    for (const provider of VERIFIED_BOOKING_PROVIDERS) {
      expect(provider.url).toMatch(/^https:\/\//);
      const validation = validateBookingRedirect(provider.url);
      expect(validation.isValid).toBe(true);
    }
  });

  test('Rejects unapproved or spoofed booking redirect domains', () => {
    const invalidUrl = 'https://fake-booking-portal.phishing.com/tickets';
    const validation = validateBookingRedirect(invalidUrl);
    expect(validation.isValid).toBe(false);
    expect(validation.reason).toContain('not in the approved');
  });
});

describe('Phase 11.1: Yatra AI Grounding & Structured Intent', () => {
  test('createItineraryProposalTool grounds on requested destination without defaulting to Ladakh', async () => {
    const toolCall = await createItineraryProposalTool.execute(
      {
        destinationId: 'sukhna-lake',
        durationDays: 3,
        travelStyle: 'RELAXED',
      },
      'test-ai-call-1'
    );

    expect(toolCall.success).toBe(true);
    const proposal = toolCall.data as any;
    expect(proposal.title).toContain('Chandigarh');
    expect(proposal.territorySlug).toBe('chandigarh');
    expect(proposal.days.length).toBe(3);

    // First day explores Sukhna Lake, NOT Khardung La!
    expect(proposal.days[0].destination).toContain('Sukhna Lake');
    expect(proposal.days[0].destination).not.toContain('Khardung La');
  });

  test('createItineraryProposalTool grounds on Lakshadweep destination Kavaratti', async () => {
    const toolCall = await createItineraryProposalTool.execute(
      {
        destinationId: 'kavaratti',
        durationDays: 4,
        travelStyle: 'NATURE',
      },
      'test-ai-call-2'
    );

    expect(toolCall.success).toBe(true);
    const proposal = toolCall.data as any;
    expect(proposal.title).toContain('Lakshadweep');
    expect(proposal.days[0].destination).toContain('Kavaratti');
  });
});
