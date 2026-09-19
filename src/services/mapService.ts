/**
 * 🇮🇳 BHARAT SAFE YATRA — MAP SERVICE (Client-side)
 * Calls: GET /api/v1/maps/markers, POST /api/v1/maps/route
 *
 * Fixes E-05: Route distances and paths calculated dynamically.
 * This service delegates to the Google Maps Directions API (with Mapbox fallback) via the server-side route handler.
 */

import type { ApiResponse, MapMarker, MapRouteSummary } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export const mapService = {
  async getMarkers(category: string = 'ALL'): Promise<ApiResponse<MapMarker[]>> {
    const params = category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${BASE}/maps/markers${params}`, { next: { revalidate: 1800 } });
    if (!res.ok) return { success: false, data: [], error: { code: 'FETCH_ERROR', message: 'Failed to load map markers' } };
    return res.json() as Promise<ApiResponse<MapMarker[]>>;
  },

  async calculateRoute(
    stops: Array<{ lat: number; lng: number; name: string }>,
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<ApiResponse<MapRouteSummary>> {
    const res = await fetch(`${BASE}/maps/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stops, mode }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      return {
        success: false,
        data: null as unknown as MapRouteSummary,
        error: {
          code: 'ROUTE_ERROR',
          message: err.error?.message ?? 'Route calculation is temporarily unavailable.',
        },
      };
    }
    return res.json() as Promise<ApiResponse<MapRouteSummary>>;
  },
};
