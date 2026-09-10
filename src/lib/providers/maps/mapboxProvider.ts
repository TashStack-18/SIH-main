/**
 * 🇮🇳 BHARAT SAFE YATRA — MAPBOX PROVIDER (PRIMARY)
 * Phase 9B: Real Mapbox Directions API v5 & Geocoding API v6 Integration
 */

import { IMapProvider, RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';

export class MapboxProvider implements IMapProvider {
  name = 'Mapbox';

  private getAccessToken(): string | null {
    const token = process.env.MAPBOX_SECRET_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token.includes('demo') || token.includes('your_') || token.length < 20) {
      return null;
    }
    return token;
  }

  async calculateRoute(
    waypoints: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteCalculationResult | null> {
    const token = this.getAccessToken();
    if (!token || waypoints.length < 2) return null;

    const startTime = Date.now();
    const profile = mode === 'walking' ? 'walking' : mode === 'cycling' ? 'cycling' : 'driving-traffic';
    const coordsString = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(';');

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}?geometries=geojson&overview=full&steps=true&access_token=${token}`;
      const fetchOptions: RequestInit =
        typeof window === 'undefined' ? ({ next: { revalidate: 3600 } } as any) : {};
      const res = await fetch(url, fetchOptions);

      if (!res.ok) {
        console.warn(`[Mapbox Directions] API responded with HTTP ${res.status}`);
        return null;
      }

      const json = (await res.json()) as {
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

      if (!json.routes || json.routes.length === 0) return null;

      const primaryRoute = json.routes[0];
      const segments = (primaryRoute.legs || []).map((leg) => ({
        distanceMeters: leg.distance,
        durationSeconds: leg.duration,
        instruction: leg.steps?.[0]?.maneuver?.instruction || 'Proceed along the verified route',
      }));

      return {
        totalDistanceKm: Math.round((primaryRoute.distance / 1000) * 10) / 10,
        totalDurationMinutes: Math.round(primaryRoute.duration / 60),
        mode,
        geometryGeoJSON: primaryRoute.geometry,
        segments,
        waypoints,
        metadata: {
          provider: 'Mapbox Directions API v5',
          source: 'Mapbox Global Vector Telemetry',
          retrievedAt: new Date().toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err) {
      console.error('[MapboxProvider] Route calculation error:', err);
      return null;
    }
  }

  async searchGeocoding(query: string, proximity?: [number, number]): Promise<GeocodingFeature[] | null> {
    const token = this.getAccessToken();
    if (!token || !query.trim()) return null;

    try {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=IN&access_token=${token}`;
      if (proximity) {
        url += `&proximity=${proximity[0]},${proximity[1]}`;
      }

      const res = await fetch(url);
      if (!res.ok) return null;

      const json = (await res.json()) as {
        features?: Array<{
          id: string;
          place_name: string;
          center: [number, number];
          relevance: number;
          place_type?: string[];
        }>;
      };

      if (!json.features) return null;

      return json.features.map((f) => ({
        id: f.id,
        placeName: f.place_name,
        center: f.center,
        relevance: f.relevance,
        category: f.place_type?.[0] || 'place',
      }));
    } catch (err) {
      console.warn('[MapboxProvider] Geocoding search error:', err);
      return null;
    }
  }

  async calculateMatrix(
    origins: RouteWaypoint[],
    destinations: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<import('../types').MatrixCalculationResult | null> {
    const token = this.getAccessToken();
    if (!token || origins.length === 0 || destinations.length === 0) return null;

    const startTime = Date.now();
    const profile = mode === 'walking' ? 'walking' : mode === 'cycling' ? 'cycling' : 'driving';
    
    // Combine unique coordinates and build source/destination indices
    const allPoints: RouteWaypoint[] = [...origins, ...destinations];
    const coordsString = allPoints.map((p) => `${p.lng},${p.lat}`).join(';');
    const sources = origins.map((_, i) => i).join(';');
    const destinationsIndices = destinations.map((_, i) => origins.length + i).join(';');

    try {
      const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${coordsString}?sources=${sources}&destinations=${destinationsIndices}&annotations=distance,duration&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (!res.ok) {
        console.warn(`[Mapbox Matrix] API returned HTTP ${res.status}`);
        return null;
      }

      const json = (await res.json()) as {
        durations?: number[][]; // seconds
        distances?: number[][]; // meters
      };

      if (!json.durations) return null;

      const durationsInMinutes = json.durations.map((row) =>
        row.map((d) => (d != null ? Math.round(d / 60) : 0))
      );
      const distancesInKm = (json.distances || []).map((row) =>
        row.map((d) => (d != null ? Math.round((d / 1000) * 10) / 10 : 0))
      );

      return {
        durations: durationsInMinutes,
        distances: distancesInKm,
        origins,
        destinations,
        metadata: {
          provider: 'Mapbox Matrix API v1',
          source: 'Mapbox Directions Matrix',
          retrievedAt: new Date().toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err) {
      console.error('[MapboxProvider] Matrix calculation error:', err);
      return null;
    }
  }
}
