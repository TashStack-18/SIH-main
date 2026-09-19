import { RouteCalculationResult } from '../providers/types';
import { VERIFIED_ADVISORIES } from '../fixtures';
import { WeatherApiProvider } from '../providers/weather/weatherApiProvider';
import { ActiveTravelAdvisory } from '../../types';

const TRAFFIC_WARNING_THRESHOLD = 0.10; // 10%

export interface LiveAlert {
  id: string;
  territoryId: string;
  title: string;
  description: string;
  severity: 'Info' | 'Moderate' | 'High' | 'Critical';
  timestamp: string;
  source: string;
  type: string;
  coordinates?: [number, number];
  url?: string;
}

export interface RouteTravelConditions {
  currentDurationMinutes: number;
  typicalDurationMinutes?: number;
  trafficDelaySeconds?: number;
  warningMessage?: string;
  isHeavierThanUsual: boolean;
}

export interface LiveSafetyConditions {
  liveAlerts: LiveAlert[];
  advisories: ActiveTravelAdvisory[];
  fetchedAt: string;
  error?: boolean;
}

const territoryCoords: Record<string, { lat: number; lng: number }> = {
  'andaman-and-nicobar-islands': { lat: 11.7401, lng: 92.6586 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'dadra-and-nagar-haveli-and-daman-and-diu': { lat: 20.4283, lng: 72.8397 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'jammu-and-kashmir': { lat: 33.7782, lng: 76.5762 },
  'ladakh': { lat: 34.1526, lng: 77.5771 },
  'lakshadweep': { lat: 10.5667, lng: 72.6417 },
  'puducherry': { lat: 11.9416, lng: 79.8083 },
};

export class LiveIntelligenceService {
  private weatherProvider = new WeatherApiProvider();

  async getLiveSafetyConditions(territorySlug?: string): Promise<LiveSafetyConditions> {
    const alerts: LiveAlert[] = [];
    let hasError = false;

    const slugsToFetch = territorySlug ? [territorySlug] : Object.keys(territoryCoords);

    const fetchPromises = slugsToFetch.map(async (slug) => {
      const coords = territoryCoords[slug];
      if (!coords) return [];

      try {
        const weatherData = await this.weatherProvider.getWeatherByCoords(coords.lat, coords.lng);
        if (weatherData && (weatherData as unknown as { alerts?: LiveAlert[] }).alerts) {
          const rawAlerts = (weatherData as unknown as { alerts: LiveAlert[] }).alerts;
          return rawAlerts.map((a: LiveAlert) => ({ ...a, territoryId: slug }));
        }
      } catch {
        hasError = true;
      }
      return [];
    });

    const results = await Promise.all(fetchPromises);
    results.forEach((res: LiveAlert[]) => alerts.push(...res));

    // Deduplicate alerts by title+description
    const uniqueAlertsMap = new Map<string, LiveAlert>();
    alerts.forEach((alert) => {
      uniqueAlertsMap.set(alert.title + alert.description, alert);
    });

    const liveAlerts = Array.from(uniqueAlertsMap.values()).sort((a, b) => {
      const sevMap: Record<string, number> = { Critical: 4, High: 3, Moderate: 2, Info: 1 };
      const sevA = sevMap[a.severity] || 0;
      const sevB = sevMap[b.severity] || 0;
      return sevB - sevA;
    });

    let advisories: ActiveTravelAdvisory[] = VERIFIED_ADVISORIES;
    if (territorySlug) {
      const normalizedSlug = territorySlug.toLowerCase().replace(/[^a-z0-9]/g, '_');
      advisories = advisories.filter((a) =>
        a.territoryId.toLowerCase().includes(normalizedSlug) ||
        a.territoryName.toLowerCase().replace(/\s+/g, '-').includes(territorySlug)
      );
    }

    return {
      liveAlerts,
      advisories,
      fetchedAt: new Date().toISOString(),
      error: hasError,
    };
  }

  getRouteTravelConditions(route: RouteCalculationResult & { trafficDelaySeconds?: number; typicalDurationMinutes?: number }): RouteTravelConditions | null {
    const delaySecs = route.trafficDelaySeconds;
    const typMins = route.typicalDurationMinutes;
    const curMins = route.totalDurationMinutes;

    if (delaySecs == null && typMins == null) {
      return null;
    }

    let isHeavierThanUsual = false;
    let warningMessage: string | undefined = undefined;

    if (typMins != null && typMins > 0) {
      const delayRatio = (curMins - typMins) / typMins;
      if (delayRatio > TRAFFIC_WARNING_THRESHOLD) {
        isHeavierThanUsual = true;
        warningMessage = 'Traffic is currently heavier than usual on this route.';
      }
    } else if (delaySecs != null && delaySecs > (curMins * 60 * TRAFFIC_WARNING_THRESHOLD)) {
      isHeavierThanUsual = true;
      warningMessage = 'Heavy traffic is currently reported on this route.';
    }

    return {
      currentDurationMinutes: curMins,
      typicalDurationMinutes: typMins,
      trafficDelaySeconds: delaySecs,
      warningMessage,
      isHeavierThanUsual,
    };
  }
}

export const liveIntelligenceService = new LiveIntelligenceService();
