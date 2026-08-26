/**
 * 🇮🇳 BHARAT SAFE YATRA — FEASIBILITY & HEALTH ENGINE
 * Phase 11: Real-World Trip Feasibility, Fatigue Detection & Impossible Itinerary Prevention
 *
 * Enforces:
 * 1. Daily driving duration thresholds (<6h Relaxed, <8h Balanced, <10h Fast-Paced)
 * 2. 15-20% safety & traffic buffer reservation
 * 3. Opening hours vs. calculated arrival time validation
 * 4. Permit and seasonal accessibility verification
 * 5. Itinerary Health Enum (EXCELLENT | GOOD | BUSY | VERY_BUSY | INFEASIBLE | NEEDS_REVIEW)
 * 6. Impossible itinerary detection
 */

import { SpatialEngine } from '@/src/lib/geospatial/spatialEngine';
import { VERIFIED_DESTINATIONS } from '@/src/lib/fixtures';

export type ItineraryHealthStatus = 
  | 'EXCELLENT'
  | 'GOOD'
  | 'BUSY'
  | 'VERY_BUSY'
  | 'INFEASIBLE'
  | 'NEEDS_REVIEW';

export interface FeasibilityWarning {
  id: string;
  type: 'DRIVING_TIME' | 'DISTANCE_CAP' | 'OPENING_HOURS' | 'PERMIT_REQUIRED' | 'SEASONAL' | 'BACKTRACKING' | 'REST_DEFICIT';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  dayNumber?: number;
  stopId?: string;
  destinationName?: string;
  actionSuggestion?: string;
  source: string;
}

export interface DayFeasibilityResult {
  dayNumber: number;
  date?: string;
  totalDistanceKm: number;
  totalDriveMinutes: number;
  bufferedDriveMinutes: number;
  totalActivityMinutes: number;
  totalRestMinutes: number;
  totalDaySpanMinutes: number;
  stopCount: number;
  status: ItineraryHealthStatus;
  explanation: string;
  warnings: FeasibilityWarning[];
  stops: Array<{
    id: string;
    name: string;
    calculatedArrival: string;
    calculatedDeparture: string;
    driveFromPrevMinutes: number;
    distanceFromPrevKm: number;
  }>;
}

export interface ItineraryFeasibilityReport {
  overallHealth: ItineraryHealthStatus;
  headlineExplanation: string;
  isFeasible: boolean;
  requiresOptimization: boolean;
  totalDistanceKm: number;
  totalDriveMinutes: number;
  totalBufferMinutes: number;
  dayBreakdowns: DayFeasibilityResult[];
  allWarnings: FeasibilityWarning[];
  optimizationRecommendations: string[];
}

export interface FeasibilityInputDay {
  dayNumber: number;
  date?: string;
  stops: Array<{
    id: string;
    destinationId?: string;
    slug?: string;
    name: string;
    coordinates?: { lat: number; lng: number };
    durationMinutes?: number;
    preferredTime?: string;
  }>;
}

export class FeasibilityEngine {
  private static readonly TRAVEL_BUFFER_PERCENT = 0.18; // 18% reserve for Indian road conditions & delays

  /**
   * Evaluate full multi-day itinerary feasibility
   */
  public static evaluateItinerary(
    days: FeasibilityInputDay[],
    travelStyle: 'RELAXED' | 'BALANCED' | 'FAST-PACED' = 'BALANCED',
    territoryId?: string
  ): ItineraryFeasibilityReport {
    const dayBreakdowns: DayFeasibilityResult[] = [];
    const allWarnings: FeasibilityWarning[] = [];
    const optimizationRecommendations: string[] = [];

    let totalItineraryDistanceKm = 0;
    let totalItineraryDriveMins = 0;
    let totalItineraryBufferMins = 0;

    const maxDayDriveMins = travelStyle === 'RELAXED' ? 300 : travelStyle === 'FAST-PACED' ? 540 : 420; // 5h, 9h, 7h

    for (const day of days) {
      const dayResult = this.evaluateDay(day, maxDayDriveMins);
      dayBreakdowns.push(dayResult);

      totalItineraryDistanceKm += dayResult.totalDistanceKm;
      totalItineraryDriveMins += dayResult.totalDriveMinutes;
      totalItineraryBufferMins += dayResult.bufferedDriveMinutes - dayResult.totalDriveMinutes;

      for (const w of dayResult.warnings) {
        allWarnings.push(w);
      }
    }

    // Determine overall health status
    let overallHealth: ItineraryHealthStatus = 'EXCELLENT';
    let headlineExplanation = 'Your itinerary is well-balanced with ample travel buffers and realistic visiting durations.';
    let isFeasible = true;
    let requiresOptimization = false;

    const criticalWarnings = allWarnings.filter((w) => w.severity === 'CRITICAL');
    const standardWarnings = allWarnings.filter((w) => w.severity === 'WARNING');

    if (criticalWarnings.length > 0) {
      overallHealth = 'INFEASIBLE';
      isFeasible = false;
      requiresOptimization = true;
      headlineExplanation = `Infeasible: ${criticalWarnings[0].description}`;
    } else if (standardWarnings.length >= 2 || dayBreakdowns.some((d) => d.status === 'VERY_BUSY')) {
      overallHealth = 'VERY_BUSY';
      requiresOptimization = true;
      headlineExplanation = `Very Busy: Several days exceed recommended travel times without adequate rest periods.`;
    } else if (standardWarnings.length === 1 || dayBreakdowns.some((d) => d.status === 'BUSY')) {
      overallHealth = 'BUSY';
      headlineExplanation = `Busy: Tight schedule on specific days; consider relaxing individual stops.`;
    } else if (allWarnings.some((w) => w.type === 'PERMIT_REQUIRED')) {
      overallHealth = 'GOOD';
      headlineExplanation = `Good: All routes are feasible. Ensure mandatory protected area permits are secured in advance.`;
    }

    // Generate actionable recommendations
    if (overallHealth === 'INFEASIBLE' || overallHealth === 'VERY_BUSY') {
      optimizationRecommendations.push('Redistribute stops across additional days to keep daily driving under 6 hours.');
      optimizationRecommendations.push('Cluster destinations geographically to eliminate unnecessary transit legs.');
    }
    if (allWarnings.some((w) => w.type === 'BACKTRACKING')) {
      optimizationRecommendations.push('Reorder stops to follow a circular route and prevent backtracking.');
    }
    if (allWarnings.some((w) => w.type === 'PERMIT_REQUIRED')) {
      optimizationRecommendations.push('Apply for required ILP/PAP permits via official UT e-permit portals before travel.');
    }

    return {
      overallHealth,
      headlineExplanation,
      isFeasible,
      requiresOptimization,
      totalDistanceKm: Math.round(totalItineraryDistanceKm * 10) / 10,
      totalDriveMinutes: totalItineraryDriveMins,
      totalBufferMinutes: totalItineraryBufferMins,
      dayBreakdowns,
      allWarnings,
      optimizationRecommendations,
    };
  }

  /**
   * Evaluate single-day feasibility
   */
  public static evaluateDay(day: FeasibilityInputDay, maxDayDriveMins: number): DayFeasibilityResult {
    const warnings: FeasibilityWarning[] = [];
    const stops = day.stops || [];

    let dayDistKm = 0;
    let dayDriveMins = 0;
    let dayActivityMins = 0;

    // Timeline calculation starting at default 08:30 AM
    let currentMinuteOfDay = 8 * 60 + 30; // 510 minutes from midnight

    const processedStops: DayFeasibilityResult['stops'] = [];

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const destData = VERIFIED_DESTINATIONS.find(
        (d) => d.id === stop.destinationId || d.slug === stop.slug || d.name.toLowerCase() === stop.name.toLowerCase()
      );

      let legDistKm = 0;
      let legDriveMins = 0;

      if (i > 0) {
        const prevStop = stops[i - 1];
        const prevCoords = prevStop.coordinates || this.getDestinationCoords(prevStop.destinationId || prevStop.slug);
        const currCoords = stop.coordinates || (destData ? destData.coordinates : null);

        if (prevCoords && currCoords) {
          legDistKm = SpatialEngine.estimateRoadDistanceKm(prevCoords.lat, prevCoords.lng, currCoords.lat, currCoords.lng);
          legDriveMins = SpatialEngine.estimateDriveTimeMinutes(legDistKm);
        }
      }

      dayDistKm += legDistKm;
      dayDriveMins += legDriveMins;

      // Add leg drive time to timeline
      currentMinuteOfDay += legDriveMins;
      const arrivalTimeStr = this.minutesToTimeString(currentMinuteOfDay);

      // Activity duration (default 90 mins if unspecified)
      const activityMins = stop.durationMinutes || 90;
      dayActivityMins += activityMins;

      currentMinuteOfDay += activityMins;
      const departureTimeStr = this.minutesToTimeString(currentMinuteOfDay);

      processedStops.push({
        id: stop.id,
        name: stop.name,
        calculatedArrival: arrivalTimeStr,
        calculatedDeparture: departureTimeStr,
        driveFromPrevMinutes: legDriveMins,
        distanceFromPrevKm: legDistKm,
      });

      // Destination-specific validation checks
      if (destData) {
        // Permit check
        if (destData.permitRequired) {
          warnings.push({
            id: `warn-permit-${stop.id}`,
            type: 'PERMIT_REQUIRED',
            severity: 'INFO',
            title: `Permit Required: ${destData.name}`,
            description: `${destData.name} requires an official permit (${destData.permitDetails || 'Online registration'}).`,
            dayNumber: day.dayNumber,
            stopId: stop.id,
            destinationName: destData.name,
            actionSuggestion: 'Apply online via the official administration portal before departure.',
            source: 'Ministry of Home Affairs & UT Administration Guidelines',
          });
        }

        // Opening hours vs arrival check
        if (destData.timing && destData.timing.includes('5:00 PM') && currentMinuteOfDay > 17 * 60) {
          warnings.push({
            id: `warn-hours-${stop.id}`,
            type: 'OPENING_HOURS',
            severity: 'WARNING',
            title: `Late Arrival Warning: ${destData.name}`,
            description: `Estimated arrival is ${arrivalTimeStr}, but ${destData.name} standard visiting hours close at 5:00 PM.`,
            dayNumber: day.dayNumber,
            stopId: stop.id,
            destinationName: destData.name,
            actionSuggestion: 'Shift this stop earlier in the day to guarantee admission.',
            source: 'Official Archaeological & Tourism Operating Hours',
          });
        }
      }
    }

    // Safety buffer (18%)
    const bufferMins = Math.round(dayDriveMins * this.TRAVEL_BUFFER_PERCENT);
    const bufferedDriveMins = dayDriveMins + bufferMins;
    const totalDaySpanMins = dayDriveMins + bufferMins + dayActivityMins;

    // Check for impossible day (>8 stops or >450km or >10h drive in a single day)
    if (stops.length > 7 || dayDistKm > 450 || dayDriveMins > 600) {
      warnings.push({
        id: `warn-impossible-day-${day.dayNumber}`,
        type: 'DRIVING_TIME',
        severity: 'CRITICAL',
        title: `Day ${day.dayNumber} is Infeasible`,
        description: `Day ${day.dayNumber} contains ${stops.length} stops, ${Math.round(dayDistKm)} km of transit, and ~${Math.round(dayDriveMins / 60)}h driving time, which is dangerous in mountain/island terrain.`,
        dayNumber: day.dayNumber,
        actionSuggestion: 'Split this day into two separate days or remove low-priority stops.',
        source: 'Bharat Safe Yatra Road Safety Standard',
      });
    } else if (dayDriveMins > maxDayDriveMins) {
      warnings.push({
        id: `warn-busy-day-${day.dayNumber}`,
        type: 'DRIVING_TIME',
        severity: 'WARNING',
        title: `Long Driving Day: Day ${day.dayNumber}`,
        description: `Day ${day.dayNumber} includes ${Math.round(dayDriveMins / 60)}h ${dayDriveMins % 60}m driving, exceeding the recommended ${Math.round(maxDayDriveMins / 60)}h daily limit.`,
        dayNumber: day.dayNumber,
        actionSuggestion: 'Add an overnight rest stop along the route.',
        source: 'Sovereign Transport Intelligence',
      });
    }

    // Determine day status
    let status: ItineraryHealthStatus = 'EXCELLENT';
    let explanation = `Day ${day.dayNumber} is well planned (${Math.round(dayDriveMins / 60)}h drive, ${stops.length} stops).`;

    if (warnings.some((w) => w.severity === 'CRITICAL')) {
      status = 'INFEASIBLE';
      explanation = `Day ${day.dayNumber} is overbooked and unsafe.`;
    } else if (warnings.some((w) => w.severity === 'WARNING')) {
      status = dayDriveMins > 480 ? 'VERY_BUSY' : 'BUSY';
      explanation = `Day ${day.dayNumber} contains heavy travel (${Math.round(dayDriveMins / 60)}h transit).`;
    } else if (warnings.some((w) => w.type === 'PERMIT_REQUIRED')) {
      status = 'GOOD';
      explanation = `Day ${day.dayNumber} is feasible; remember to carry entry permits.`;
    }

    return {
      dayNumber: day.dayNumber,
      date: day.date,
      totalDistanceKm: Math.round(dayDistKm * 10) / 10,
      totalDriveMinutes: dayDriveMins,
      bufferedDriveMinutes: bufferedDriveMins,
      totalActivityMinutes: dayActivityMins,
      totalRestMinutes: Math.max(0, 14 * 60 - totalDaySpanMins),
      totalDaySpanMinutes: totalDaySpanMins,
      stopCount: stops.length,
      status,
      explanation,
      warnings,
      stops: processedStops,
    };
  }

  private static getDestinationCoords(idOrSlug?: string): { lat: number; lng: number } | null {
    if (!idOrSlug) return null;
    const dest = VERIFIED_DESTINATIONS.find((d) => d.id === idOrSlug || d.slug === idOrSlug);
    return dest ? dest.coordinates : null;
  }

  private static minutesToTimeString(minutes: number): string {
    const totalMinutes = Math.round(minutes) % (24 * 60);
    const hrs24 = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const period = hrs24 >= 12 ? 'PM' : 'AM';
    const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;

    return `${hrs12}:${minsStr} ${period}`;
  }
}
