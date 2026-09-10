/**
 * 🇮🇳 BHARAT SAFE YATRA — OSRM ROUTING PROVIDER (TIER 2 VERIFIED ROAD NETWORK)
 * Phase 11.2: Free, open road network routing snapped to real streets, avenues, and highways.
 * Prevents hallucinated straight lines through lakes, forests, and buildings.
 */

import { IMapProvider, RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';

export class OsrmRoutingProvider implements IMapProvider {
  name = 'OSRM-OpenStreetMap';

  async calculateRoute(
    waypoints: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteCalculationResult | null> {
    if (waypoints.length < 2) return null;

    const startTime = Date.now();
    const profile = mode === 'walking' ? 'foot' : mode === 'cycling' ? 'bicycle' : 'driving';
    // OSRM coordinates format: {lng},{lat};{lng},{lat}
    const coordsString = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(';');

    try {
      const url = `https://router.project-osrm.org/route/v1/${profile}/${coordsString}?overview=full&geometries=geojson&steps=true`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

      if (!res.ok) {
        console.warn(`[OSRM Routing] API responded with HTTP ${res.status}`);
        return null;
      }

      const json = (await res.json()) as {
        code: string;
        routes?: Array<{
          distance: number; // meters
          duration: number; // seconds
          geometry: {
            type: 'LineString';
            coordinates: Array<[number, number]>;
          };
          legs?: Array<{
            distance: number;
            duration: number;
            steps?: Array<{ maneuver?: { instruction?: string }; distance: number; duration: number }>;
          }>;
        }>;
      };

      if (json.code !== 'Ok' || !json.routes || json.routes.length === 0) {
        return null;
      }

      const primaryRoute = json.routes[0];
      const segments = (primaryRoute.legs || []).map((leg, idx) => ({
        distanceMeters: Math.round(leg.distance),
        durationSeconds: Math.round(leg.duration),
        instruction:
          leg.steps?.[0]?.maneuver?.instruction ||
          `Follow verified road network to ${waypoints[idx + 1]?.name || 'next waypoint'}`,
      }));

      return {
        totalDistanceKm: Math.round((primaryRoute.distance / 1000) * 10) / 10,
        totalDurationMinutes: Math.round(primaryRoute.duration / 60),
        mode,
        geometryGeoJSON: primaryRoute.geometry,
        segments,
        waypoints,
        metadata: {
          provider: 'OSRM / OpenStreetMap Road Telemetry',
          source: 'OpenStreetMap Real Highway & Street Network',
          retrievedAt: new Date().toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err) {
      console.warn('[OsrmRoutingProvider] Route calculation error:', err);
      return null;
    }
  }

  async searchGeocoding(): Promise<GeocodingFeature[] | null> {
    return null;
  }
}
