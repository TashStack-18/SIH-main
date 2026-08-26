/**
 * 🇮🇳 BHARAT SAFE YATRA — WEATHER SERVICE ORCHESTRATOR
 * Phase 9B: Multi-Tier Resilient Weather & Marine Pipeline
 */

import { OpenWeatherProvider } from './openWeatherProvider';
import { WeatherApiProvider } from './weatherApiProvider';
import { ImdFallbackProvider } from './imdFallbackProvider';
import { WeatherDataResponse } from '../types';
import { providerCache, deduplicateRequest, CircuitBreaker } from '../cache';

const openWeather = new OpenWeatherProvider();
const weatherApi = new WeatherApiProvider();
const imdFallback = new ImdFallbackProvider();
const circuitBreaker = new CircuitBreaker(3, 30000);

export async function getWeatherData(lat: number, lng: number): Promise<WeatherDataResponse> {
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;
  const cacheKey = `weather:${roundedLat}:${roundedLng}`;

  // 1. Check in-memory / Redis cache
  const cached = providerCache.get<WeatherDataResponse>(cacheKey);
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

  // 2. Fetch using Request Deduplication & Circuit Breaker
  return deduplicateRequest(cacheKey, async () => {
    try {
      const data = await circuitBreaker.execute(
        async () => {
          // Primary: OpenWeather
          const owData = await openWeather.getWeatherByCoords(lat, lng);
          if (owData) return owData;

          // Secondary: WeatherAPI.com
          const waData = await weatherApi.getWeatherByCoords(lat, lng);
          if (waData) return waData;

          throw new Error('Primary & Secondary weather providers returned null');
        },
        async () => {
          // Fallback: IMD / Open-Meteo
          const fallbackData = await imdFallback.getWeatherByCoords(lat, lng);
          return fallbackData!;
        }
      );

      if (data) {
        // Cache valid result for 15 minutes (900 seconds)
        providerCache.set(cacheKey, data, 900);
        return data;
      }
    } catch (err) {
      console.warn('[Weather Service] Downstream failure, invoking sovereign fallback:', err);
    }

    // 3. Guaranteed Sovereign Fallback
    const guaranteedFallback = (await imdFallback.getWeatherByCoords(lat, lng))!;
    providerCache.set(cacheKey, guaranteedFallback, 3600);
    return guaranteedFallback;
  });
}
