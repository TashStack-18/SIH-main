/**
 * 🇮🇳 BHARAT SAFE YATRA — MAPS & ROUTING SERVICE ORCHESTRATOR
 * Phase 9B: Multi-Tier Resilient Routing & Geocoding Pipeline
 */

import { TomTomRoutingProvider } from './tomTomRoutingProvider';
import { MapboxProvider } from './mapboxProvider';
import { OsrmRoutingProvider } from './osrmRoutingProvider';
import { GoogleMapsProvider } from './googleMapsProvider';
import { PostgisRoutingFallbackProvider } from './postgisRoutingFallback';
import { RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';
import { providerCache, deduplicateRequest, CircuitBreaker } from '../cache';

const tomtom = new TomTomRoutingProvider();
const mapbox = new MapboxProvider();
const osrm = new OsrmRoutingProvider();
const googleMaps = new GoogleMapsProvider();
const postgisFallback = new PostgisRoutingFallbackProvider();
const routeCircuitBreaker = new CircuitBreaker(4, 30000);

export async function calculateRouteWithFallback(
  waypoints: RouteWaypoint[],
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<RouteCalculationResult> {
  const coordsKey = waypoints.map((w) => `${w.lat.toFixed(3)},${w.lng.toFixed(3)}`).join(':');
  const cacheKey = `route:${mode}:${coordsKey}`;

  // 1. Check in-memory cache (1 hour TTL for identical route queries)
  const cached = providerCache.get<RouteCalculationResult>(cacheKey);
  if (cached && !cached.isExpired) {
    return {
      ...cached.data,
      metadata: {
        ...cached.data.metadata,
        status: 'CACHED',
        isLive: true,
      },
    };
  }

  // 2. Execute via circuit breaker
  return deduplicateRequest(cacheKey, async () => {
    try {
      const result = await routeCircuitBreaker.execute(
        async () => {
          // Tier 1: Mapbox Directions API v5 (Real Road Network Primary)
          const mbResult = await mapbox.calculateRoute(waypoints, mode);
          if (mbResult) return mbResult;

          // Tier 2: OSRM OpenStreetMap (Verified Street & Highway Network)
          const osrmResult = await osrm.calculateRoute(waypoints, mode);
          if (osrmResult) return osrmResult;

          // Tier 3: TomTom
          const tomtomResult = await tomtom.calculateRoute(waypoints, mode);
          if (tomtomResult) return tomtomResult;

          // Tier 4: Google Maps
          const gmResult = await googleMaps.calculateRoute(waypoints, mode);
          if (gmResult) return gmResult;

          throw new Error('Remote routing providers unavailable');
        },
        async () => {
          const fallback = await postgisFallback.calculateRoute(waypoints, mode);
          return fallback!;
        }
      );

      if (result) {
        providerCache.set(cacheKey, result, 3600);
        return result;
      }
    } catch (err) {
      console.warn('[Routing Service] Downstream routing failed, using topological fallback:', err);
    }

    const sovereignFallback = (await postgisFallback.calculateRoute(waypoints, mode))!;
    providerCache.set(cacheKey, sovereignFallback, 7200);
    return sovereignFallback;
  });
}

export async function calculateMatrixWithFallback(
  origins: RouteWaypoint[],
  destinations: RouteWaypoint[],
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<import('../types').MatrixCalculationResult> {
  const origKey = origins.map((w) => `${w.lat.toFixed(2)},${w.lng.toFixed(2)}`).join(':');
  const destKey = destinations.map((w) => `${w.lat.toFixed(2)},${w.lng.toFixed(2)}`).join(':');
  const cacheKey = `matrix:${mode}:${origKey}->${destKey}`;

  const cached = providerCache.get<import('../types').MatrixCalculationResult>(cacheKey);
  if (cached && !cached.isExpired) {
    return cached.data;
  }

  try {
    const mbMatrix = await mapbox.calculateMatrix(origins, destinations, mode);
    if (mbMatrix) {
      providerCache.set(cacheKey, mbMatrix, 3600);
      return mbMatrix;
    }
  } catch (err) {
    console.warn('[Routing Service] Mapbox Matrix unavailable, using spatial distance fallback:', err);
  }

  // Topological / Haversine Matrix Fallback
  const durations: number[][] = [];
  const distances: number[][] = [];
  const speedKmh = mode === 'walking' ? 5 : mode === 'cycling' ? 15 : 40;

  for (let i = 0; i < origins.length; i++) {
    const rowDur: number[] = [];
    const rowDist: number[] = [];
    for (let j = 0; j < destinations.length; j++) {
      const o = origins[i];
      const d = destinations[j];
      const dLat = ((d.lat - o.lat) * Math.PI) / 180;
      const dLng = ((d.lng - o.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((o.lat * Math.PI) / 180) *
          Math.cos((d.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = Math.round(6371 * c * 1.25 * 10) / 10;
      const durMins = Math.max(5, Math.round((distKm / speedKmh) * 60));

      rowDist.push(distKm);
      rowDur.push(durMins);
    }
    distances.push(rowDist);
    durations.push(rowDur);
  }

  const fallbackResult: import('../types').MatrixCalculationResult = {
    durations,
    distances,
    origins,
    destinations,
    metadata: {
      provider: 'Bharat Safe Yatra Spatial Fallback Matrix',
      source: 'Haversine Topological Router',
      retrievedAt: new Date().toISOString(),
      status: 'FALLBACK',
      isLive: false,
    },
  };

  providerCache.set(cacheKey, fallbackResult, 7200);
  return fallbackResult;
}

export async function searchGeocodingWithFallback(query: string, proximity?: [number, number]): Promise<GeocodingFeature[]> {
  const cacheKey = `geocoding:${query.trim().toLowerCase()}`;
  const cached = providerCache.get<GeocodingFeature[]>(cacheKey);
  if (cached && !cached.isExpired) {
    return cached.data;
  }

  try {
    // 1. Primary: Mapbox
    const mbResults = await mapbox.searchGeocoding(query, proximity);
    if (mbResults && mbResults.length > 0) {
      providerCache.set(cacheKey, mbResults, 86400);
      return mbResults;
    }

    // 2. Secondary: Google Maps
    const gmResults = await googleMaps.searchGeocoding(query);
    if (gmResults && gmResults.length > 0) {
      providerCache.set(cacheKey, gmResults, 86400);
      return gmResults;
    }
  } catch (err) {
    console.warn('[Geocoding Service] Remote geocoding failed, using local database search:', err);
  }

  // 3. Fallback: Local database search
  const fallbackResults = (await postgisFallback.searchGeocoding(query)) || [];
  providerCache.set(cacheKey, fallbackResults, 86400);
  return fallbackResults;
}
