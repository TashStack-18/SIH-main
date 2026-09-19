/**
 * 🇮🇳 BHARAT SAFE YATRA — GOOGLE MAPS PROVIDER (SECONDARY)
 * Phase 9B: Real Google Routes & Geocoding API Integration
 */

import { IMapProvider, RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';

export class GoogleMapsProvider implements IMapProvider {
  name = 'GoogleMaps';

  private getApiKey(): string | null {
    const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key || key.includes('your_') || key.length < 20) {
      return null;
    }
    return key;
  }

  async calculateRoute(
    waypoints: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteCalculationResult | null> {
    const apiKey = this.getApiKey();
    if (!apiKey || waypoints.length < 2) return null;

    const startTime = Date.now();
    const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
    const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
    const intermediateWaypoints = waypoints
      .slice(1, -1)
      .map((wp) => `${wp.lat},${wp.lng}`)
      .join('|');

    try {
      let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`;
      if (intermediateWaypoints) {
        url += `&waypoints=${intermediateWaypoints}`;
      }

      const res = await fetch(url);
      if (!res.ok) return null;

      const json = (await res.json()) as {
        status: string;
        routes?: Array<{
          legs: Array<{
            distance: { value: number };
            duration: { value: number };
            steps?: Array<{ html_instructions?: string; distance: { value: number }; duration: { value: number } }>;
          }>;
          overview_polyline?: { points: string };
        }>;
      };

      if (json.status !== 'OK' || !json.routes?.[0]) return null;

      const route = json.routes[0];
      let totalDist = 0;
      let totalDur = 0;
      const segments: Array<{ distanceMeters: number; durationSeconds: number; instruction?: string }> = [];

      for (const leg of route.legs) {
        totalDist += leg.distance.value;
        totalDur += leg.duration.value;
        segments.push({
          distanceMeters: leg.distance.value,
          durationSeconds: leg.duration.value,
          instruction: leg.steps?.[0]?.html_instructions?.replace(/<[^>]*>?/gm, '') || 'Proceed along highway',
        });
      }

      const coords = route.overview_polyline?.points ? this.decodePolyline(route.overview_polyline.points) : [];

      return {
        totalDistanceKm: Math.round((totalDist / 1000) * 10) / 10,
        totalDurationMinutes: Math.round(totalDur / 60),
        mode,
        geometryGeoJSON: {
          type: 'LineString',
          coordinates: coords,
        },
        segments,
        waypoints,
        metadata: {
          provider: 'Google Maps Directions API',
          source: 'Google Maps Platform',
          retrievedAt: new Date().toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err) {
      console.warn('[GoogleMapsProvider] Routing error:', err);
      return null;
    }
  }

  async searchGeocoding(query: string): Promise<GeocodingFeature[] | null> {
    const apiKey = this.getApiKey();
    if (!apiKey || !query.trim()) return null;

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&components=country:IN&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const json = (await res.json()) as {
        status: string;
        results?: Array<{
          place_id: string;
          formatted_address: string;
          geometry: { location: { lat: number; lng: number } };
          types: string[];
        }>;
      };

      if (json.status !== 'OK' || !json.results) return null;

      return json.results.map((r) => ({
        id: r.place_id,
        placeName: r.formatted_address,
        center: [r.geometry.location.lng, r.geometry.location.lat],
        relevance: 1.0,
        category: r.types[0] || 'landmark',
      }));
    } catch (err) {
      console.warn('[GoogleMapsProvider] Geocoding error:', err);
      return null;
    }
  }

  private decodePolyline(encoded: string): Array<[number, number]> {
    const points: Array<[number, number]> = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b: number,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push([lng / 1e5, lat / 1e5]);
    }
    return points;
  }
}
