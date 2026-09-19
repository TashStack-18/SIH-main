/**
 * 🇮🇳 BHARAT SAFE YATRA — POSTGIS / HAVERSINE DETERMINISTIC ROUTE FALLBACK
 * Phase 9B: Offline & network partition resilient route calculation
 */

import { IMapProvider, RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES } from '@/src/lib/fixtures';

export class PostgisRoutingFallbackProvider implements IMapProvider {
  name = 'PostGIS-Haversine-Fallback';

  async calculateRoute(
    waypoints: RouteWaypoint[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteCalculationResult | null> {
    if (waypoints.length < 2) return null;

    const startTime = Date.now();
    let totalDistKm = 0;
    const coords: Array<[number, number]> = [];
    const segments: Array<{ distanceMeters: number; durationSeconds: number; instruction: string }> = [];

    // Base travel speed by mode in Indian terrain (km/h)
    const baseSpeed = mode === 'walking' ? 4.5 : mode === 'cycling' ? 14 : 42; // Mountain/highway blended average

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];

      const segmentDistKm = this.calculateHaversineDistance(from.lat, from.lng, to.lat, to.lng);
      // Add a 1.28x winding factor for realistic Indian road network geometry
      const roadDistKm = segmentDistKm * 1.28;
      totalDistKm += roadDistKm;

      const durationMins = Math.round((roadDistKm / baseSpeed) * 60);

      // Generate intermediate geometric points for smooth map rendering
      const subPoints = this.interpolatePoints(from.lat, from.lng, to.lat, to.lng, 8);
      for (const p of subPoints) {
        coords.push([p.lng, p.lat]);
      }

      segments.push({
        distanceMeters: Math.round(roadDistKm * 1000),
        durationSeconds: durationMins * 60,
        instruction: `Follow highway route from ${from.name || 'Waypoint ' + (i + 1)} to ${to.name || 'Waypoint ' + (i + 2)}`,
      });
    }

    return {
      totalDistanceKm: Math.round(totalDistKm * 10) / 10,
      totalDurationMinutes: Math.round((totalDistKm / baseSpeed) * 60),
      mode,
      geometryGeoJSON: {
        type: 'LineString',
        coordinates: coords,
      },
      segments,
      waypoints,
      metadata: {
        provider: 'PostGIS / Haversine Topological Router',
        source: 'Sovereign Geometric Trajectory Engine',
        retrievedAt: new Date().toISOString(),
        status: 'FALLBACK',
        isLive: false,
        latencyMs: Date.now() - startTime,
      },
    };
  }

  async searchGeocoding(query: string): Promise<GeocodingFeature[] | null> {
    const q = query.toLowerCase().trim();
    const results: GeocodingFeature[] = [];

    // 1. Match verified destinations
    for (const d of VERIFIED_DESTINATIONS) {
      if (
        d.name.toLowerCase().includes(q) ||
        d.territoryName.toLowerCase().includes(q) ||
        d.tagline?.toLowerCase().includes(q) ||
        d.shortDescription?.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      ) {
        results.push({
          id: `dest-${d.id}`,
          placeName: `${d.name}, ${d.territoryName}`,
          center: [d.coordinates.lng, d.coordinates.lat],
          territorySlug: d.territoryId.toLowerCase().replace(/_/g, '-'),
          relevance: 1.0,
          category: d.type,
        });
      }
    }

    // 2. Match verified territories & capitals
    for (const ut of VERIFIED_TERRITORIES) {
      if (
        ut.name.toLowerCase().includes(q) ||
        ut.capital.toLowerCase().includes(q) ||
        ut.shortName.toLowerCase().includes(q) ||
        ut.code.toLowerCase().includes(q)
      ) {
        results.push({
          id: `ut-${ut.id}`,
          placeName: `${ut.name} (Capital: ${ut.capital})`,
          center: [ut.coordinates.lng, ut.coordinates.lat],
          territorySlug: ut.slug,
          relevance: 0.9,
          category: 'Union Territory',
        });
      }
    }

    return results.slice(0, 8);
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private interpolatePoints(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    steps: number
  ): Array<{ lat: number; lng: number }> {
    const pts: Array<{ lat: number; lng: number }> = [];
    for (let s = 0; s <= steps; s++) {
      const fraction = s / steps;
      pts.push({
        lat: Math.round((lat1 + (lat2 - lat1) * fraction) * 100000) / 100000,
        lng: Math.round((lng1 + (lng2 - lng1) * fraction) * 100000) / 100000,
      });
    }
    return pts;
  }
}
