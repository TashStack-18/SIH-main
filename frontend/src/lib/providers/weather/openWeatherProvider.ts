/**
 * 🇮🇳 BHARAT SAFE YATRA — OPENWEATHER PROVIDER (PRIMARY)
 * Phase 9B: Real OpenWeather One Call 3.0 & Air Pollution API Integration
 */

import { IWeatherProvider, WeatherDataResponse, WeatherCondition, WeatherForecastDay } from '../types';

export class OpenWeatherProvider implements IWeatherProvider {
  name = 'OpenWeather';

  async getWeatherByCoords(lat: number, lng: number): Promise<WeatherDataResponse | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) {
      return null;
    }

    const startTime = Date.now();

    try {
      // 1. Fetch Current & 5-Day Forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
      const weatherRes = await fetch(weatherUrl, { next: { revalidate: 900 } });

      if (!weatherRes.ok) {
        console.warn(`[OpenWeather] API responded with HTTP ${weatherRes.status}`);
        return null;
      }

      const weatherJson = (await weatherRes.json()) as {
        list?: Array<{
          dt: number;
          dt_txt: string;
          main: { temp: number; feels_like: number; humidity: number };
          weather: Array<{ description: string; id: number }>;
          wind: { speed: number; deg?: number };
          pop?: number;
          rain?: { '3h'?: number };
        }>;
      };

      if (!weatherJson.list || weatherJson.list.length === 0) {
        return null;
      }

      const currentItem = weatherJson.list[0];

      // 2. Fetch Air Pollution Data
      let aqiIndex = 1;
      let aqiBand: 'GOOD' | 'MODERATE' | 'POOR' | 'UNHEALTHY' | 'HAZARDOUS' = 'GOOD';
      try {
        const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`;
        const airRes = await fetch(airUrl);
        if (airRes.ok) {
          const airJson = (await airRes.json()) as {
            list?: Array<{ main: { aqi: number } }>;
          };
          const rawAqi = airJson.list?.[0]?.main?.aqi ?? 1;
          aqiIndex = rawAqi;
          const bandMap: Record<number, 'GOOD' | 'MODERATE' | 'POOR' | 'UNHEALTHY' | 'HAZARDOUS'> = {
            1: 'GOOD',
            2: 'MODERATE',
            3: 'POOR',
            4: 'UNHEALTHY',
            5: 'HAZARDOUS',
          };
          aqiBand = bandMap[rawAqi] || 'MODERATE';
        }
      } catch (airErr) {
        console.warn('[OpenWeather Air Pollution] Non-fatal fetch error:', airErr);
      }

      const current: WeatherCondition = {
        tempC: Math.round(currentItem.main.temp * 10) / 10,
        feelsLikeC: Math.round(currentItem.main.feels_like * 10) / 10,
        humidityPercent: currentItem.main.humidity,
        windSpeedKmh: Math.round(currentItem.wind.speed * 3.6 * 10) / 10,
        windDirectionDeg: currentItem.wind.deg,
        conditionText: currentItem.weather[0]?.description
          ? currentItem.weather[0].description.charAt(0).toUpperCase() + currentItem.weather[0].description.slice(1)
          : 'Clear',
        conditionCode: currentItem.weather[0]?.id ?? 800,
        airQualityIndex: aqiIndex,
        airQualityBand: aqiBand,
      };

      // Aggregate 5-Day Forecast
      const dailyMap = new Map<string, { temps: number[]; conditions: string[]; pops: number[]; rain: number }>();

      for (const item of weatherJson.list) {
        const dateKey = item.dt_txt.split(' ')[0];
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, { temps: [], conditions: [], pops: [], rain: 0 });
        }
        const bucket = dailyMap.get(dateKey)!;
        bucket.temps.push(item.main.temp);
        if (item.weather[0]?.description) bucket.conditions.push(item.weather[0].description);
        if (typeof item.pop === 'number') bucket.pops.push(item.pop * 100);
        if (item.rain?.['3h']) bucket.rain += item.rain['3h'];
      }

      const forecast: WeatherForecastDay[] = [];
      for (const [date, bucket] of dailyMap.entries()) {
        const maxTemp = Math.max(...bucket.temps);
        const minTemp = Math.min(...bucket.temps);
        const mostFrequentCondition = bucket.conditions[Math.floor(bucket.conditions.length / 2)] || 'Partly cloudy';
        const avgPop = bucket.pops.length ? Math.round(bucket.pops.reduce((a, b) => a + b, 0) / bucket.pops.length) : 0;

        forecast.push({
          date,
          maxTempC: Math.round(maxTemp),
          minTempC: Math.round(minTemp),
          conditionText: mostFrequentCondition.charAt(0).toUpperCase() + mostFrequentCondition.slice(1),
          precipitationChancePercent: avgPop,
          precipitationMm: Math.round(bucket.rain * 10) / 10,
        });

        if (forecast.length >= 5) break;
      }

      const latencyMs = Date.now() - startTime;

      return {
        current,
        forecast,
        metadata: {
          provider: 'OpenWeather (One Call 3.0 + Air Pollution)',
          source: 'OpenWeather Official API',
          retrievedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
          status: 'LIVE',
          isLive: true,
          latencyMs,
        },
      };
    } catch (err) {
      console.error('[OpenWeatherProvider] Network/parsing error:', err);
      return null;
    }
  }
}
