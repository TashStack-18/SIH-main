/**
 * 🇮🇳 BHARAT SAFE YATRA — MAPS & ROUTING SERVICE ORCHESTRATOR
 * Phase 9B: Multi-Tier Resilient Routing & Geocoding Pipeline
 */

import { TomTomRoutingProvider } from './tomTomRoutingProvider';
import { MapboxProvider } from './mapboxProvider';
import { GoogleMapsProvider } from './googleMapsProvider';
import { PostgisRoutingFallbackProvider } from './postgisRoutingFallback';
import { RouteCalculationResult, RouteWaypoint, GeocodingFeature } from '../types';
import { providerCache, deduplicateRequest, CircuitBreaker } from '../cache';

const tomtom = new TomTomRoutingProvider();
const mapbox = new MapboxProvider();
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
          // Tier 1: TomTom (Phase 11 Primary)
          const tomtomResult = await tomtom.calculateRoute(waypoints, mode);
          if (tomtomResult) return tomtomResult;

          // Tier 2: Mapbox
          const mbResult = await mapbox.calculateRoute(waypoints, mode);
          if (mbResult) return mbResult;

          // Tier 3: Google Maps
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
