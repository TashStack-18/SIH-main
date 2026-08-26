/**
 * 🇮🇳 BHARAT SAFE YATRA — AI READ TOOLS
 * Phase 10: High-fidelity read-only tools calling Phase 9 real provider adapters
 */

import { ToolExecutor } from './types';
import { ToolResult } from '../types';
import { getWeatherData } from '@/src/lib/providers/weather';
import { calculateRouteWithFallback, searchGeocodingWithFallback } from '@/src/lib/providers/maps';
import { searchFlightsWithFallback } from '@/src/lib/providers/flights';
import { searchHotelsWithFallback } from '@/src/lib/providers/hotels';
import { getNearbyEmergencyFacilities } from '@/src/lib/providers/emergency';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES, VERIFIED_FESTIVALS, VERIFIED_NATIONAL_CONTACTS } from '@/src/lib/fixtures';

// 1. TOOL: get_weather
export const getWeatherTool: ToolExecutor = {
  definition: {
    name: 'get_weather',
    description: 'Fetch real-time weather conditions, 5-day forecast, air quality (AQI), and marine swell for coordinates or destination.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude coordinate (e.g. 34.1526 for Leh)' },
        lng: { type: 'number', description: 'Longitude coordinate (e.g. 77.5771 for Leh)' },
        destinationSlug: { type: 'string', description: 'Optional destination slug (e.g. pangong-tso, cellular-jail)' },
      },
      required: ['lat', 'lng'],
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    try {
      let lat = typeof args.lat === 'number' ? args.lat : 34.1526;
      let lng = typeof args.lng === 'number' ? args.lng : 77.5771;

      if (typeof args.destinationSlug === 'string') {
        const dest = VERIFIED_DESTINATIONS.find((d) => d.id === args.destinationSlug || d.slug === args.destinationSlug);
        if (dest && dest.coordinates) {
          lat = dest.coordinates.lat;
          lng = dest.coordinates.lng;
        }
      }

      const weather = await getWeatherData(lat, lng);
      return {
        toolCallId,
        toolName: 'get_weather',
        success: true,
        data: {
          current: weather.current,
          forecast: weather.forecast,
          marine: weather.marine,
          metadata: weather.metadata,
        },
        isLive: weather.metadata.isLive,
        citations: [
          {
            sourceName: weather.metadata.provider,
            sourceUrl: 'https://mausam.imd.gov.in',
            sourceType: 'PRIMARY_GOVERNMENT',
            verifiedAt: weather.metadata.retrievedAt,
            confidenceState: weather.metadata.status === 'LIVE' ? 'LIVE_DATA' : 'VERIFIED',
          },
        ],
      };
    } catch (err: unknown) {
      return {
        toolCallId,
        toolName: 'get_weather',
        success: false,
        data: null,
        error: `Weather provider unavailable: ${err instanceof Error ? err.message : String(err)}`,
        isLive: false,
      };
    }
  },
};

// 2. TOOL: calculate_route
export const calculateRouteTool: ToolExecutor = {
  definition: {
    name: 'calculate_route',
    description: 'Calculate real turn-by-turn road route, total distance in km, travel duration in minutes, and geometry between waypoints.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        originLat: { type: 'number', description: 'Origin latitude' },
        originLng: { type: 'number', description: 'Origin longitude' },
        originName: { type: 'string', description: 'Origin name (e.g. Leh)' },
        destLat: { type: 'number', description: 'Destination latitude' },
        destLng: { type: 'number', description: 'Destination longitude' },
        destName: { type: 'string', description: 'Destination name (e.g. Pangong Tso)' },
        mode: { type: 'string', enum: ['driving', 'walking', 'cycling'], description: 'Travel mode' },
      },
      required: ['originLat', 'originLng', 'destLat', 'destLng'],
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    try {
      const waypoints = [
        {
          lat: typeof args.originLat === 'number' ? args.originLat : 34.1526,
          lng: typeof args.originLng === 'number' ? args.originLng : 77.5771,
          name: typeof args.originName === 'string' ? args.originName : 'Origin',
        },
        {
          lat: typeof args.destLat === 'number' ? args.destLat : 33.753,
          lng: typeof args.destLng === 'number' ? args.destLng : 78.667,
          name: typeof args.destName === 'string' ? args.destName : 'Destination',
        },
      ];

      const mode = args.mode === 'walking' || args.mode === 'cycling' ? args.mode : 'driving';
      const route = await calculateRouteWithFallback(waypoints, mode);

      return {
        toolCallId,
        toolName: 'calculate_route',
        success: true,
        data: {
          totalDistanceKm: route.totalDistanceKm,
          totalDurationMinutes: route.totalDurationMinutes,
          mode: route.mode,
          segments: route.segments,
          metadata: route.metadata,
        },
        isLive: route.metadata.isLive,
        citations: [
          {
            sourceName: route.metadata.provider,
            sourceUrl: 'https://morth.nic.in',
            sourceType: 'PRIMARY_GOVERNMENT',
            verifiedAt: route.metadata.retrievedAt,
            confidenceState: route.metadata.isLive ? 'LIVE_DATA' : 'VERIFIED',
          },
        ],
      };
    } catch (err: unknown) {
      return {
        toolCallId,
        toolName: 'calculate_route',
        success: false,
        data: null,
        error: `Routing provider error: ${err instanceof Error ? err.message : String(err)}`,
        isLive: false,
      };
    }
  },
};

// 3. TOOL: search_destinations
export const searchDestinationsTool: ToolExecutor = {
  definition: {
    name: 'search_destinations',
    description: 'Search verified tourist attractions, monuments, lakes, and heritage spots across the 8 Union Territories.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g. lake, museum, photography, scuba)' },
        territorySlug: { type: 'string', description: 'Optional territory filter (e.g. ladakh, andaman-nicobar, delhi)' },
        category: { type: 'string', description: 'Optional category filter (e.g. Nature, Heritage, Adventure)' },
      },
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    const q = typeof args.query === 'string' ? args.query.toLowerCase().trim() : '';
    const territory = typeof args.territorySlug === 'string' ? args.territorySlug.toLowerCase() : '';

    const matched = VERIFIED_DESTINATIONS.filter((d) => {
      if (territory && !d.territoryId.toLowerCase().includes(territory.replace(/-/g, '_'))) {
        return false;
      }
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        (d.categories || []).some((c) => c.toLowerCase().includes(q))
      );
    });

    return {
      toolCallId,
      toolName: 'search_destinations',
      success: true,
      data: {
        total: matched.length,
        destinations: matched.slice(0, 6).map((m) => ({
          id: m.id,
          name: m.name,
          territoryName: m.territoryName,
          type: m.type,
          tagline: m.tagline,
          shortDescription: m.shortDescription,
          coordinates: m.coordinates,
          bestTime: m.weather?.bestTime,
          permitsRequired: m.permits?.required || false,
        })),
      },
      isLive: false,
      citations: [
        {
          sourceName: 'Ministry of Tourism — Incredible India Verified Dataset',
          sourceUrl: 'https://www.incredibleindia.gov.in',
          sourceType: 'OFFICIAL_TOURISM',
          verifiedAt: '2026-08-26',
          confidenceState: 'VERIFIED',
        },
      ],
    };
  },
};

// 4. TOOL: search_festivals
export const searchFestivalsTool: ToolExecutor = {
  definition: {
    name: 'search_festivals',
    description: 'Retrieve verified cultural festivals and celebrations across the 8 Union Territories with official 2026 dates and date precision.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        territorySlug: { type: 'string', description: 'Optional territory slug (e.g. ladakh, jammu-kashmir)' },
        month: { type: 'string', description: 'Optional month filter (e.g. June, January)' },
      },
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    const territory = typeof args.territorySlug === 'string' ? args.territorySlug.toLowerCase() : '';
    const month = typeof args.month === 'string' ? args.month.toLowerCase() : '';

    const matched = VERIFIED_FESTIVALS.filter((f) => {
      if (territory && !f.territoryId?.toLowerCase().includes(territory.replace(/-/g, '_'))) return false;
      if (month && f.startDate && !f.startDate.includes(month)) return false;
      return true;
    });

    return {
      toolCallId,
      toolName: 'search_festivals',
      success: true,
      data: {
        total: matched.length,
        festivals: matched.map((f) => ({
          id: f.id,
          name: f.name,
          territoryName: f.territoryName,
          displayDate: f.displayDate,
          datePrecision: f.datePrecision,
          description: f.description,
          sourceName: f.officialSource?.name || 'Official UT Tourism Directorate',
        })),
      },
      isLive: false,
      citations: [
        {
          sourceName: 'Ministry of Tourism Utsav Festival Portal',
          sourceUrl: 'https://utsav.gov.in',
          sourceType: 'OFFICIAL_TOURISM',
          verifiedAt: '2026-08-26',
          confidenceState: 'VERIFIED',
        },
      ],
    };
  },
};

// 5. TOOL: find_emergency_services
export const findEmergencyServicesTool: ToolExecutor = {
  definition: {
    name: 'find_emergency_services',
    description: 'Find verified ABDM registered emergency trauma centers, hospitals with hyperbaric oxygen chambers, and statutory dispatch helplines near given coordinates.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Tourist current latitude' },
        lng: { type: 'number', description: 'Tourist current longitude' },
        radiusKm: { type: 'number', description: 'Search radius in km (default 100)' },
      },
      required: ['lat', 'lng'],
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    const lat = typeof args.lat === 'number' ? args.lat : 34.1526;
    const lng = typeof args.lng === 'number' ? args.lng : 77.5771;

    const facilities = await getNearbyEmergencyFacilities(lat, lng, 3);

    return {
      toolCallId,
      toolName: 'find_emergency_services',
      success: true,
      data: {
        nearestFacilities: facilities,
        statutoryHelpline: '112 (Emergency Response Support System - MHA)',
        touristHelpline: '1363 (Ministry of Tourism 24x7 Multi-lingual Desk)',
        maritimeSAR: '1554 (Indian Coast Guard Distress Toll-Free)',
      },
      isLive: true,
      citations: [
        {
          sourceName: 'Ayushman Bharat Digital Mission (ABDM) Health Facility Registry',
          sourceUrl: 'https://hfr.abdm.gov.in',
          sourceType: 'PRIMARY_GOVERNMENT',
          verifiedAt: '2026-08-26',
          confidenceState: 'LIVE_DATA',
        },
        {
          sourceName: 'Emergency Response Support System (ERSS 112)',
          sourceUrl: 'https://112.gov.in',
          sourceType: 'PRIMARY_GOVERNMENT',
          verifiedAt: '2026-08-26',
          confidenceState: 'LIVE_DATA',
        },
      ],
    };
  },
};

// 6. TOOL: search_flights
export const searchFlightsTool: ToolExecutor = {
  definition: {
    name: 'search_flights',
    description: 'Search real-time flight offers and DGCA verified timetables between major airports serving the 8 Union Territories.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        originIata: { type: 'string', description: 'Origin 3-letter IATA code (e.g. DEL, BOM, IXZ, IXL)' },
        destinationIata: { type: 'string', description: 'Destination 3-letter IATA code (e.g. IXL for Leh, IXZ for Port Blair)' },
        date: { type: 'string', description: 'Travel date YYYY-MM-DD' },
      },
      required: ['originIata', 'destinationIata', 'date'],
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    const origin = typeof args.originIata === 'string' ? args.originIata.toUpperCase() : 'DEL';
    const dest = typeof args.destinationIata === 'string' ? args.destinationIata.toUpperCase() : 'IXL';
    const date = typeof args.date === 'string' ? args.date : new Date().toISOString().split('T')[0];

    const flights = await searchFlightsWithFallback(origin, dest, date, 1);

    return {
      toolCallId,
      toolName: 'search_flights',
      success: true,
      data: {
        origin,
        destination: dest,
        date,
        total: flights.length,
        offers: flights,
      },
      isLive: flights[0]?.metadata?.isLive || false,
      citations: [
        {
          sourceName: 'Directorate General of Civil Aviation (DGCA) Timetable Ingestion',
          sourceUrl: 'https://www.dgca.gov.in',
          sourceType: 'PRIMARY_GOVERNMENT',
          verifiedAt: '2026-08-26',
          confidenceState: flights[0]?.metadata?.isLive ? 'LIVE_DATA' : 'VERIFIED',
        },
      ],
    };
  },
};

// 7. TOOL: search_hotels
export const searchHotelsTool: ToolExecutor = {
  definition: {
    name: 'search_hotels',
    description: 'Search verified accommodations including official government tourism guest houses (JKTDC, SPORTS, Megapode) and GDS hotels.',
    isWriteAction: false,
    parameters: {
      type: 'object',
      properties: {
        territorySlug: { type: 'string', description: 'Territory slug (e.g. ladakh, andaman-nicobar, lakshadweep)' },
      },
      required: ['territorySlug'],
    },
  },
  async execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult> {
    const territory = typeof args.territorySlug === 'string' ? args.territorySlug : 'ladakh';
    const hotels = await searchHotelsWithFallback(territory);

    return {
      toolCallId,
      toolName: 'search_hotels',
      success: true,
      data: {
        territory,
        total: hotels.length,
        hotels,
      },
      isLive: false,
      citations: [
        {
          sourceName: 'State Tourism Development Corporations (JKTDC / SPORTS / ANIIDCO)',
          sourceUrl: 'https://tourism.gov.in',
          sourceType: 'OFFICIAL_TOURISM',
          verifiedAt: '2026-08-26',
          confidenceState: 'VERIFIED',
        },
      ],
    };
  },
};
