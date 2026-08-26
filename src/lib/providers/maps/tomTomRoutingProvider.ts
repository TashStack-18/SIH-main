/**
 * 🇮🇳 BHARAT SAFE YATRA — TOMTOM ROUTING PROVIDER
 * Phase 11: Real-World Routing, Traffic & Geometry Adapter
 *
 * Ground truth routing engine per Phase 11 architecture.
 * Calls TomTom Routing API v1 for real distance, duration, turn-by-turn maneuvers,
 * and polyline geometry.
 */

import { IMapProvider, RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';

export class TomTomRoutingProvider implements IMapProvider {
  name = 'TomTom-Routing';

  private apiKey: string;
  private baseUrl = 'https://api.tomtom.com/routing/1/calculateRoute';
  private searchUrl = 'https://api.tomtom.com/search/2/geocode';

  constructor() {
    this.apiKey = process.env.TOMTOM_API_KEY || process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '';
  }

  /**
   * Calculate exact route with TomTom Routing v1 API
   */
  async calculateRoute(
    waypoints: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteCalculationResult | null> {
    if (waypoints.length < 2) return null;

    const startTime = Date.now();

    // Format locations for TomTom: lat,lng:lat,lng:...
    const locationsParam = waypoints.map((w) => `${w.lat},${w.lng}`).join(':');

    // Map transport mode to TomTom travelMode
    const travelMode = mode === 'walking' ? 'pedestrian' : mode === 'cycling' ? 'bicycle' : 'car';

    if (!this.apiKey) {
      // TomTom key not set in environment -> return null so fallback orchestrator handles gracefully
      return null;
    }

    try {
      const url = `${this.baseUrl}/${locationsParam}/json?key=${this.apiKey}&travelMode=${travelMode}&traffic=true&routeType=fastest&computeBestOrder=false&instructionsType=text`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn(`[TomTom Routing] HTTP error ${response.status}: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const route = data.routes?.[0];
      if (!route) return null;

      const summary = route.summary;
      const legs = route.legs || [];

      // Extract geometry coordinates [lng, lat]
      const coordinates: Array<[number, number]> = [];
      legs.forEach((leg: { points?: Array<{ latitude: number; longitude: number }> }) => {
        if (leg.points) {
          leg.points.forEach((pt: { latitude: number; longitude: number }) => {
            coordinates.push([pt.longitude, pt.latitude]);
          });
        }
      });

      // Extract leg segments
      const segments: Array<{ distanceMeters: number; durationSeconds: number; instruction: string }> = [];
      legs.forEach((leg: { lengthInMeters: number; travelTimeInSeconds: number }, idx: number) => {
        const fromName = waypoints[idx]?.name || `Stop ${idx + 1}`;
        const toName = waypoints[idx + 1]?.name || `Stop ${idx + 2}`;
        segments.push({
          distanceMeters: leg.lengthInMeters,
          durationSeconds: leg.travelTimeInSeconds,
          instruction: `Drive from ${fromName} to ${toName}`,
        });
      });

      return {
        totalDistanceKm: Math.round((summary.lengthInMeters / 1000) * 10) / 10,
        totalDurationMinutes: Math.round(summary.travelTimeInSeconds / 60),
        mode,
        geometryGeoJSON: {
          type: 'LineString',
          coordinates,
        },
        segments,
        waypoints,
        metadata: {
          provider: 'TomTom Routing API v1',
          source: 'TomTom Live Traffic & Telemetry Engine',
          retrievedAt: new Date().toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err) {
      console.warn('[TomTom Routing] Request failed:', err);
      return null;
    }
  }

  /**
   * Geocoding search via TomTom Geocoding Search v2
   */
  async searchGeocoding(query: string, proximity?: [number, number]): Promise<GeocodingFeature[] | null> {
    if (!this.apiKey || !query.trim()) return null;

    try {
      let url = `${this.searchUrl}/${encodeURIComponent(query.trim())}.json?key=${this.apiKey}&countrySet=IN&limit=6`;
      if (proximity && proximity.length === 2) {
        url += `&lat=${proximity[1]}&lon=${proximity[0]}&radius=100000`;
      }

      const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!res.ok) return null;

      const data = await res.json();
      const results = data.results || [];

      return results.map((r: { id: string; address?: { freeformAddress: string }; position: { lat: number; lon: number }; score: number; entityType?: string }) => ({
        id: r.id || `tomtom-${Math.random().toString(36).slice(2, 8)}`,
        placeName: r.address?.freeformAddress || query,
        center: [r.position.lon, r.position.lat],
        relevance: r.score || 0.9,
        category: r.entityType || 'Point of Interest',
      }));
    } catch (err) {
      console.warn('[TomTom Geocoding] Search failed:', err);
      return null;
    }
  }
}
