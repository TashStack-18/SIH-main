'use client';

/**
 * 🇮🇳 BHARAT SAFE YATRA — NEXT-GENERATION ITINERARY STUDIO
 * Phase 11.1: Complete Destination Control + Feasibility + Routing + Optimization + Map + Booking
 *
 * Enforces:
 * 1. The traveller's selected destination is the source of truth.
 * 2. Works identically for every verified destination across all 8 Union Territories.
 * 3. Never defaults to Khardung La or Ladakh.
 * 4. Mode A (Destination-First) and Mode B (Trip-From-Scratch).
 * 5. Optimization proposals with explicit user choice ([ Apply ] / [ Keep My Plan ]).
 * 6. Along-the-Route detour recommendations with real calculated delta.
 * 7. Unified BharatMap synchronization and Journey Mode.
 */

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES, VERIFIED_BOOKING_PROVIDERS } from '@/src/lib/fixtures';
import { BharatMap } from '@/src/app/components/BharatMap';
import { YatraAiItineraryEditor } from '@/src/app/components/YatraAiItineraryEditor';
import AccordionGallery from '@/src/app/components/AccordionGallery';
export type ItineraryStep = 'DESTINATION' | 'PLANNING' | 'JOURNEY';
import { ItineraryBuilder } from '@/src/lib/itinerary/itineraryBuilder';
import { FeasibilityEngine, ItineraryFeasibilityReport } from '@/src/lib/itinerary/feasibilityEngine';
import { RecommendationEngine } from '@/src/lib/itinerary/recommendationEngine';
import { SpatialEngine, DetourCalculationResult } from '@/src/lib/geospatial/spatialEngine';
import { calculateRouteWithFallback } from '@/src/lib/providers/maps';
import { RouteCalculationResult } from '@/src/lib/providers/types';
import type { Destination, TerritoryCode } from '@/src/types';
import type { Itinerary, ItineraryDay, ItineraryItem, TravelStyle, StopStatus, OptimizationProposal } from '@/src/types/itinerary';

function generateBaseItineraryForTerritory(territoryId: string): Itinerary | null {
  const territory = VERIFIED_TERRITORIES.find((t) => t.id === territoryId || t.name.toLowerCase() === territoryId.toLowerCase());
  if (!territory) return null;

  const dests = VERIFIED_DESTINATIONS.filter((d) => d.territoryId === territory.id || d.territoryName === territory.name);
  const selectedDests = dests.slice(0, 6);

  const days: ItineraryDay[] = [];
  const itemsPerDay = 2;
  const dayCount = Math.max(1, Math.ceil(selectedDests.length / itemsPerDay));

  for (let d = 1; d <= dayCount; d++) {
    const dayStops = selectedDests.slice((d - 1) * itemsPerDay, d * itemsPerDay);
    days.push({
      dayNumber: d,
      title: dayStops.length > 0 ? `${dayStops[0].name} Exploration` : `Discover ${territory.name}`,
      summary: `Highlights of ${territory.name} including key cultural and natural sites.`,
      items: dayStops.map((dest, i) => ({
        id: `stop-${d}-${i + 1}`,
        time: i === 0 ? '09:00 AM' : '02:00 PM',
        title: dest.name,
        type: (dest.type as string === 'MONUMENT' ? 'HERITAGE' : dest.type) as any,
        destinationId: dest.id,
        notes: dest.tagline || dest.shortDescription || '',
        durationMinutes: 90,
        location: dest.coordinates,
        image: dest.image,
        status: (i === 0 && d === 1 ? 'ACTIVE' : 'PLANNED') as StopStatus,
      })),
    });
  }

  return {
    id: `itin-${territory.id}`,
    title: `Journey through ${territory.name}`,
    territoryId: territory.id as any,
    territoryName: territory.name,
    durationDays: dayCount,
    travellers: 2,
    startDate: '2026-09-10',
    endDate: '2026-09-14',
    travelStyle: 'BALANCED',
    estimatedBudget: 25000,
    days,
  };
}




// --- Added Scheduling Helpers ---
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
  if (!match) return 9 * 60;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const isPM = match[3].toUpperCase() === 'PM';
  if (h === 12 && !isPM) h = 0;
  else if (h < 12 && isPM) h += 12;
  return h * 60 + m;
}

function formatMinutesToTime(totalMins: number): string {
  const h24 = Math.floor(totalMins / 60) % 24;
  const m = Math.floor(totalMins % 60);
  const isPM = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const hh = h12.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm} ${isPM ? 'PM' : 'AM'}`;
}

function recalculateDaySchedule(day: ItineraryDay): ItineraryDay {
  if (!day.items || day.items.length === 0) return day;

  const newItems = [];
  for (let i = 0; i < day.items.length; i++) {
    const item = { ...day.items[i] };

    if (i > 0) {
      const prevItem = newItems[i - 1];
      let travelMins = 30;
      if (prevItem.location && item.location) {
         travelMins = SpatialEngine.estimateDriveTimeMinutes(
            SpatialEngine.estimateRoadDistanceKm(prevItem.location.lat, prevItem.location.lng, item.location.lat, item.location.lng)
         );
      }

      const prevStartMins = parseTimeToMinutes(prevItem.time);
      const minimumNextStartTime = prevStartMins + (prevItem.durationMinutes || 90) + travelMins;

      let intendedTime = parseTimeToMinutes(item.time);

      if (intendedTime < minimumNextStartTime) {
         intendedTime = minimumNextStartTime;
      }

      item.time = formatMinutesToTime(intendedTime);
    }

    newItems.push(item);
  }

  return {
    ...day,
    items: newItems
  };
}
// --------------------------------

function ItineraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destinationParam = searchParams.get('destination');
  const territoryParam = searchParams.get('territory');

  // State
  const [step, setStep] = useState<ItineraryStep>('DESTINATION');
  const [selectedUt, setSelectedUt] = useState<any>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [showAiEditor, setShowAiEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING'>('SAVED');
  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [feasibility, setFeasibility] = useState<ItineraryFeasibilityReport | null>(null);
  const [detourRecommendations, setDetourRecommendations] = useState<DetourCalculationResult[]>([]);
  const [optimizationProposal, setOptimizationProposal] = useState<OptimizationProposal | null>(null);
  const [dismissedProposalId, setDismissedProposalId] = useState<string | null>(null);

  // Scratch / Mode B search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUtFilter, setSelectedUtFilter] = useState<string>('ALL');
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>('BALANCED');
  const [selectedTravellers, setSelectedTravellers] = useState<number>(2);

  // Async concurrency & cancellation ref
  const versionRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Live real-time stop telemetry state
  const [liveStopWeather, setLiveStopWeather] = useState<{
    tempC: number;
    feelsLikeC: number;
    humidityPercent: number;
    windSpeedKmh: number;
    conditionText: string;
    airQualityBand: string;
    source: string;
  } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Active item lookup
  const allItineraryStops = (itinerary?.days || []).flatMap((d) => d.items);
  const activeStopItem = allItineraryStops.find((i) => i.id === activeStopId) || allItineraryStops[0] || null;

  // Real-time live weather fetch for active stop
  useEffect(() => {
    if (!activeStopItem || !activeStopItem.location) {
      setLiveStopWeather(null);
      return;
    }

    let isMounted = true;
    setIsWeatherLoading(true);

    fetch(`/api/v1/weather?lat=${activeStopItem.location.lat}&lng=${activeStopItem.location.lng}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          const d = json.data;
          setLiveStopWeather({
            tempC: d.current.tempC,
            feelsLikeC: d.current.feelsLikeC,
            humidityPercent: d.current.humidityPercent,
            windSpeedKmh: d.current.windSpeedKmh,
            conditionText: d.current.conditionText,
            airQualityBand: d.current.airQualityBand || 'MODERATE',
            source: d.metadata?.provider || 'OpenWeather / WeatherAPI Live',
          });
        }
      })
      .catch((err) => {
        console.warn('Weather fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setIsWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeStopItem?.id, activeStopItem?.location?.lat, activeStopItem?.location?.lng]);

  // Automatically scroll the left timeline to keep the active stop in view
  useEffect(() => {
    if (!activeStopId || typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const targetCard = document.getElementById(`stop-card-${activeStopId}`);
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeStopId]);

  // -------------------------------------------------------------
  // Mode A & Initial Handoff Loader
  // -------------------------------------------------------------
  useEffect(() => {
    if (destinationParam && step === 'DESTINATION') {
      const match = VERIFIED_DESTINATIONS.find(
        (d) => d.id === destinationParam || d.slug === destinationParam || d.id.toLowerCase() === destinationParam.toLowerCase()
      );

      if (match) {
        setSelectedDestination(match);
        const built = ItineraryBuilder.buildFromDestination({
          destinationId: match.id,
          durationDays: selectedDuration,
          travelStyle: selectedStyle,
          travellers: selectedTravellers,
        });

        if (built.success && built.itinerary) {
          setItinerary(built.itinerary);
          const firstStop = built.itinerary.days[0]?.items[0]?.id || null;
          setActiveStopId(firstStop);
          setStep('JOURNEY');
        }
      }
    }
  }, [destinationParam, step, selectedDuration, selectedStyle, selectedTravellers]);

  // -------------------------------------------------------------
  // Recalculate Routes, Feasibility, Detours & Optimization
  // -------------------------------------------------------------
  const recalculateItineraryData = useCallback(async (currentItin: Itinerary) => {
    if (!currentItin) return;
    setSaveStatus('SAVING');

    versionRef.current += 1;
    const currentVersion = versionRef.current;

    // 1. Feasibility Engine Evaluation
    const feasibilityInput = currentItin.days.map((d) => ({
      dayNumber: d.dayNumber,
      date: d.date,
      stops: d.items.map((item) => ({
        id: item.id,
        destinationId: item.destinationId,
        name: item.title,
        coordinates: item.location,
        durationMinutes: item.durationMinutes,
      })),
    }));

    const feasReport = FeasibilityEngine.evaluateItinerary(
      feasibilityInput,
      currentItin.travelStyle === 'RELAXED' ? 'RELAXED' : currentItin.travelStyle === 'FAST-PACED' ? 'FAST-PACED' : 'BALANCED',
      currentItin.territoryId
    );
    setFeasibility(feasReport);

    // 2. Spatial Engine Detour Recommendations
    const allStops = currentItin.days.flatMap((d) =>
      d.items
        .map((i) => ({
          lat: i.location?.lat || 0,
          lng: i.location?.lng || 0,
          name: i.title,
          slug: i.destinationId,
        }))
        .filter((s) => s.lat !== 0)
    );

    const recs = SpatialEngine.findRouteAwareRecommendations(allStops, 45, currentItin.territoryId);
    setDetourRecommendations(recs);

    // 3. Optimization Proposal (Non-destructive check)
    const proposal = RecommendationEngine.generateOptimizationProposal(currentItin);
    if (proposal && proposal.id !== dismissedProposalId) {
      setOptimizationProposal(proposal);
    } else {
      setOptimizationProposal(null);
    }

    // 4. Mapbox / Multi-tier Route Calculation
    const waypoints = allStops.map((s) => ({
      lat: s.lat,
      lng: s.lng,
      name: s.name,
    }));

    if (waypoints.length >= 2) {
      try {
        const res = await fetch('/api/v1/maps/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ waypoints, mode: 'driving' }),
        });
        const json = await res.json();
        if (json.success && json.data && versionRef.current === currentVersion) {
          setRouteResult(json.data);
        }
      } catch (err) {
        console.warn('[ItineraryStudio] Route calculation error:', err);
      }
    } else {
      setRouteResult(null);
    }

    setTimeout(() => setSaveStatus('SAVED'), 300);
  }, [dismissedProposalId]);

  useEffect(() => {
    if (itinerary) {
      recalculateItineraryData(itinerary);
    }
  }, [itinerary, recalculateItineraryData]);

  // -------------------------------------------------------------
  // User Actions
  // -------------------------------------------------------------
  const handleSelectUt = (utItem: any) => {
    setSelectedUt(utItem);
    const match = VERIFIED_DESTINATIONS.find((d) => d.territoryId === utItem.id);
    if (match) {
      setSelectedDestination(match);
      setStep('PLANNING');
    }
  };

  const handleBuildJourney = () => {
    if (!selectedDestination) return;
    const built = ItineraryBuilder.buildFromDestination({
      destinationId: selectedDestination.id,
      durationDays: selectedDuration,
      travelStyle: selectedStyle,
      travellers: selectedTravellers,
    });

    if (built.success && built.itinerary) {
      setItinerary(built.itinerary);
      const firstStop = built.itinerary.days[0]?.items[0]?.id || null;
      setActiveStopId(firstStop);
      setStep('JOURNEY');
      router.push(`/itinerary?destination=${selectedDestination.slug}`);
    }
  };

  const handleChangeDestination = () => {
    setItinerary(null);
    setSelectedDestination(null);
    setSelectedUt(null);
    setStep('DESTINATION');
    router.push('/itinerary');
  };

  const handleToggleStopComplete = (stopId: string) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;
      const updatedDays: ItineraryDay[] = prev.days.map((d) => ({
        ...d,
        items: d.items.map((item) => {
          if (item.id === stopId) {
            const nextStatus: StopStatus = item.status === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
            return { ...item, status: nextStatus };
          }
          return item;
        }),
      }));
      return { ...prev, days: updatedDays };
    });
  };

  const handleToggleLockStop = (stopId: string) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;
      const updatedDays: ItineraryDay[] = prev.days.map((d) => ({
        ...d,
        items: d.items.map((item) => {
          if (item.id === stopId) {
            return { ...item, isLocked: !item.isLocked };
          }
          return item;
        }),
      }));
      return { ...prev, days: updatedDays };
    });
  };

  const handleToggleMustVisit = (stopId: string) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;
      const updatedDays: ItineraryDay[] = prev.days.map((d) => ({
        ...d,
        items: d.items.map((item) => {
          if (item.id === stopId) {
            return { ...item, isMustVisit: !item.isMustVisit };
          }
          return item;
        }),
      }));
      return { ...prev, days: updatedDays };
    });
  };

  const handleRemoveStop = (stopId: string) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;
      const updatedDays: ItineraryDay[] = prev.days.map((d) => {
        const filteredItems = d.items.filter((item) => item.id !== stopId);
        if (filteredItems.length !== d.items.length) {
            return recalculateDaySchedule({ ...d, items: filteredItems });
        }
        return d;
      }).filter((d) => d.items.length > 0);
      return { ...prev, days: updatedDays };
    });
  };

  const handleAddDetourStop = (recOrCandidate: any) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;

      const candidate = recOrCandidate.candidateDestination || recOrCandidate;
      const originName = recOrCandidate.originName;

      const updatedDays: ItineraryDay[] = JSON.parse(JSON.stringify(prev.days));

      let targetDayIndex = 0;
      let insertIndex = updatedDays[0].items.length;

      if (originName) {
        for (let d = 0; d < updatedDays.length; d++) {
          const idx = updatedDays[d].items.findIndex(i => i.title === originName);
          if (idx !== -1) {
            targetDayIndex = d;
            insertIndex = idx + 1;
            break;
          }
        }
      } else {
        targetDayIndex = updatedDays.length > 1 ? 1 : 0;
        insertIndex = updatedDays[targetDayIndex].items.length;
      }

      const targetDay = updatedDays[targetDayIndex];

      const newStop: ItineraryItem = {
          id: `stop-${Date.now()}`,
          time: '09:00 AM', // Will be recalculated
          title: candidate.name,
          type: candidate.type as any,
          destinationId: candidate.id,
          notes: candidate.tagline || candidate.shortDescription,
          durationMinutes: 90,
          location: candidate.coordinates,
          status: 'PLANNED' as StopStatus,
          isMustVisit: false,
          isLocked: false,
      };

      targetDay.items.splice(insertIndex, 0, newStop);
      updatedDays[targetDayIndex] = recalculateDaySchedule(targetDay);

      return { ...prev, days: updatedDays };
    });
  };

  const handleApplyOptimization = () => {
    if (!optimizationProposal) return;
    setItinerary(optimizationProposal.itinerary);
    setOptimizationProposal(null);
  };

  const handleDismissOptimization = () => {
    if (optimizationProposal) {
      setDismissedProposalId(optimizationProposal.id);
    }
    setOptimizationProposal(null);
  };

  const handleDurationScale = (newDays: number) => {
    if (!itinerary) return;
    const result = RecommendationEngine.scaleDuration(itinerary, newDays);
    setItinerary(result.itinerary);
    setSelectedDuration(newDays);
  };

  // Convert stops for Map component
  let seqCounter = 1;
  const mapStops = (itinerary?.days || []).flatMap((day) =>
    day.items
      .filter((item) => item.location)
      .map((item) => ({
        id: item.id,
        name: item.title,
        lat: item.location!.lat,
        lng: item.location!.lng,
        dayNumber: day.dayNumber,
        sequenceNumber: seqCounter++,
        isActive: activeStopId === item.id,
        isCompleted: item.status === 'COMPLETED',
        isLocked: item.isLocked,
        isMustVisit: item.isMustVisit,
        type: item.type,
        notes: item.notes,
      }))
  );

  const allItems = (itinerary?.days || []).flatMap((d) => d.items);
  const completedCount = allItems.filter((i) => i.status === 'COMPLETED').length;
  const totalStopsCount = allItems.length;
  const progressPercent = totalStopsCount > 0 ? Math.round((completedCount / totalStopsCount) * 100) : 0;

  // Filter verified destinations for search in Mode B
  const filteredDestinations = VERIFIED_DESTINATIONS.filter((d) => {
    const matchesUt = selectedUtFilter === 'ALL' || d.territoryId === selectedUtFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.territoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUt && matchesQuery;
  });

  // -------------------------------------------------------------
  // Render: DESTINATION
  // -------------------------------------------------------------
  if (step === 'DESTINATION') {
    return (
      <main className="container section-spacing" role="main" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: 'var(--color-text-primary, #ffffff)', margin: '8px 0 12px' }}>
            Choose a destination to start planning
          </h1>
          <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 28px' }}>
            Select any of the 8 Union Territories and Dishaara will shape the journey around it.
          </p>
        </div>

        <AccordionGallery items={VERIFIED_TERRITORIES.map(ut => {
          const config: Record<string, {file: string; pos: string; scale?: number}> = {
            "ANDAMAN_NICOBAR": { file: "andaman-nicobar.jpg", pos: "30% 60%" },
            "CHANDIGARH": { file: "chandigarh.jpg", pos: "center 50%" },
            "DNH_DD": { file: "dadra-nagar-haveli-daman-diu.jpg", pos: "center 65%" },
            "DELHI": { file: "delhi.jpg", pos: "45% 40%", scale: 1.05 },
            "JAMMU_KASHMIR": { file: "jammu-kashmir.jpg", pos: "center 60%" },
            "LADAKH": { file: "ladakh.jpg", pos: "center 55%" },
            "LAKSHADWEEP": { file: "lakshadweep.jpg", pos: "65% 75%", scale: 1.1 },
            "PUDUCHERRY": { file: "puducherry.jpg", pos: "center center", scale: 1.02 }
          };
          const c = config[ut.id] || { file: null, pos: "center center", scale: 1 };

          return {
            id: ut.id,
            name: ut.name,
            slug: ut.slug,
            image: c.file ? `/images/utflashcard/${c.file}` : (ut as any).heroImage || (ut as any).thumbnailImage,
            objectPosition: c.pos,
            scale: c.scale
          };
        })} onSelect={handleSelectUt} />
      </main>
    );
  }

  // -------------------------------------------------------------
  // Render: PLANNING
  // -------------------------------------------------------------
  if (step === 'PLANNING' && selectedUt) {
    return (
      <main className="container section-spacing" role="main" style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '60vh', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            {selectedUt.name}
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#475569' }}>
            Configure your journey preferences below
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 'clamp(24px, 5vw, 40px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '24px', textAlign: 'center' }}>
            JOURNEY DETAILS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Trip Duration Stepper */}
            <div>
              <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
                Trip duration
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px' }}>
                <button
                  type="button"
                  aria-label="Decrease trip duration"
                  onClick={() => setSelectedDuration(Math.max(1, selectedDuration - 1))}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '1.4rem' }}>
                  −
                </button>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', width: '100px', textAlign: 'center' }}>
                  {selectedDuration} {selectedDuration === 1 ? 'day' : 'days'}
                </span>
                <button
                  type="button"
                  aria-label="Increase trip duration"
                  onClick={() => setSelectedDuration(Math.min(30, selectedDuration + 1))}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '1.4rem' }}>
                  +
                </button>
              </div>
            </div>

            {/* Travel Pace */}
            <div>
              <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
                Travel pace
              </div>
              <div style={{ display: 'flex', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4px' }}>
                {(['RELAXED', 'BALANCED', 'FAST-PACED'] as TravelStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStyle(st)}
                    style={{
                      flex: 1,
                      background: selectedStyle === st ? '#1e293b' : 'transparent',
                      color: selectedStyle === st ? '#ffffff' : '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {st === 'RELAXED' ? 'Relaxed' : st === 'BALANCED' ? 'Balanced' : 'Fast-paced'}
                  </button>
                ))}
              </div>
            </div>

            {/* Travellers Stepper */}
            <div>
              <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
                Travellers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px' }}>
                <button
                  type="button"
                  aria-label="Decrease travellers"
                  onClick={() => setSelectedTravellers(Math.max(1, selectedTravellers - 1))}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '1.4rem' }}>
                  −
                </button>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', width: '120px', textAlign: 'center' }}>
                  {selectedTravellers} {selectedTravellers === 1 ? 'traveller' : 'travellers'}
                </span>
                <button
                  type="button"
                  aria-label="Increase travellers"
                  onClick={() => setSelectedTravellers(Math.min(15, selectedTravellers + 1))}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#0f172a', cursor: 'pointer', fontSize: '1.4rem' }}>
                  +
                </button>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleBuildJourney}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              BUILD MY JOURNEY &rarr;
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Render: JOURNEY
  // -------------------------------------------------------------
  if (!itinerary) return null;



  const totalVisitMinutes = allItems.reduce((acc, item) => acc + (item.durationMinutes || 0), 0);
  const totalTravelMinutes = routeResult?.totalDurationMinutes || 0;
  const totalJourneyMinutes = totalVisitMinutes + totalTravelMinutes;

  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  let runningLocationIndex = 0;

  // Active Itinerary Studio View
  // -------------------------------------------------------------
  return (
    <main className="container section-spacing" role="main" style={{ maxWidth: '1440px', margin: '0 auto' }}>

      {/* 1. Header Hero */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#C88E44', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '8px' }}>
              {itinerary.territoryName}
            </div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              {selectedDestination?.name || itinerary.days[0]?.items[0]?.title}
            </h1>
            <div style={{ fontSize: '1.1rem', color: '#475569' }}>
              {itinerary.durationDays}-Day {itinerary.travelStyle.toLowerCase().replace('-', ' ')} journey • {itinerary.travellers} {itinerary.travellers === 1 ? 'traveller' : 'travellers'}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Overall journey:</strong> ~{formatMins(totalJourneyMinutes)}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Visit time:</strong> ~{formatMins(totalVisitMinutes)}
              </div>
              {totalTravelMinutes > 0 && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Travel time:</strong> ~{formatMins(totalTravelMinutes)}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleChangeDestination}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem', fontWeight: 600, borderColor: '#cbd5e1', color: '#0f172a', background: 'transparent' }}
            >
              Start a new journey
            </button>
            <button
              type="button"
              onClick={() => setShowAiEditor((prev) => !prev)}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem', fontWeight: 600, borderColor: '#cbd5e1', color: '#0f172a', background: 'transparent' }}
            >
              Yatra AI
            </button>
            <button
              onClick={() => setIsJourneyMode((prev) => !prev)}
              className="btn btn-primary"
              style={{
                background: isJourneyMode ? '#10b981' : '#f59e0b',
                borderColor: isJourneyMode ? '#10b981' : '#f59e0b',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {isJourneyMode ? '✓ Exit Journey Mode' : 'Start Live Journey'}
            </button>
          </div>
        </div>

        {/* Duration Scaling & Progress Ribbon */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Duration Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
              Duration Scaling:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[2, 3, 5, 7, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationScale(d)}
                  className={`btn btn-sm ${itinerary.durationDays === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                  }}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Journey Completion Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
              {completedCount} / {totalStopsCount} Stops ({progressPercent}%)
            </div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(200, 142, 68, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#10b981',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quiet Feasibility Insight (JOURNEY CHECK) */}
      {feasibility && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderLeft: `4px solid ${feasibility.overallHealth === 'INFEASIBLE' ? '#ef4444' : feasibility.overallHealth === 'BUSY' ? '#f59e0b' : '#C88E44'}`,
            borderRadius: '4px 8px 8px 4px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>
              JOURNEY CHECK • {feasibility.overallHealth}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
              {feasibility.headlineExplanation}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '48px', alignItems: 'start' }}>

        {/* Left Column: Timeline Days & Stops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {itinerary.days.map((day) => (
            <div
              key={day.dayNumber}
              style={{
                marginBottom: '40px',
              }}
            >
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#C88E44', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DAY {String(day.dayNumber).padStart(2, '0')}
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.8rem', color: '#0f172a', margin: '8px 0 6px', letterSpacing: '-0.01em' }}>
                  {day.title}
                </h3>
                <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, maxWidth: '600px' }}>
                  {day.summary}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {day.items.map((item, index) => {
                  const isActive = activeStopId === item.id;
                  const isPrimary = index === 0;
                  const hasLocation = !!item.location;
                  const currentLocIndex = hasLocation ? runningLocationIndex++ : -1;
                  const nextSegment = (hasLocation && routeResult?.segments?.[currentLocIndex]) ? routeResult.segments[currentLocIndex] : null;
                  const destData = VERIFIED_DESTINATIONS.find((d) => d.id === item.destinationId);

                  return (
                    <div
                      key={item.id}
                      id={`stop-card-${item.id}`}
                      onClick={() => setActiveStopId(item.id)}
                      style={{
                        position: 'relative',
                        padding: '24px 0',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                        borderBottom: '1px solid #f1f5f9',
                        opacity: isActive ? 1 : 0.6
                      }}
                    >
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ minWidth: '85px', paddingTop: '4px' }}>
                          <span style={{ fontSize: '0.85rem', color: isActive ? '#C88E44' : '#64748b', fontWeight: 700 }}>
                            {item.time}
                          </span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{
                              fontSize: '0.7rem',
                              color: '#64748b',
                              textTransform: 'uppercase',
                              fontWeight: 700,
                              letterSpacing: '0.05em'
                            }}>
                              {item.type}
                            </div>
                          </div>

                          <div style={{
                            fontWeight: isPrimary ? 800 : 600,
                            fontSize: isPrimary ? '1.25rem' : '1.05rem',
                            color: '#0f172a',
                            marginBottom: '8px',
                            fontFamily: isPrimary ? 'var(--font-serif)' : 'inherit'
                          }}>
                            {item.title}
                          </div>

                          {item.notes && (
                            <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                              {item.notes}
                            </div>
                          )}
                          {destData?.weather?.bestTime && (
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                              <strong style={{ color: '#475569' }}>Best time to visit:</strong> {destData.weather.bestTime}
                            </div>
                          )}
                        </div>
                      </div>

                      {nextSegment && (
                        <div style={{ paddingLeft: '105px', marginTop: '16px', marginBottom: '-8px' }}>
                          <div style={{ borderLeft: '2px dashed #cbd5e1', paddingLeft: '16px', paddingBottom: '8px', paddingTop: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                              ↓ Recommended transport: {routeResult?.mode === 'driving' ? 'Cab / Auto' : routeResult?.mode === 'walking' ? 'Walk' : 'Transit'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Approx. travel: {formatMins(nextSegment.durationSeconds / 60)} ({ (nextSegment.distanceMeters / 1000).toFixed(1) } km)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {detourRecommendations.length > 0 && (
            <div style={{ marginTop: '20px', padding: '32px 0', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: '#C88E44', letterSpacing: '0.05em', marginBottom: '16px' }}>
                ALONG YOUR ROUTE RECOMMENDATIONS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {detourRecommendations.slice(0, 3).map((rec) => (
                  <div
                     key={rec.candidateDestination.id}
                     style={{
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center',
                       gap: '10px',
                       padding: '12px 0',
                       borderBottom: '1px solid #f1f5f9'
                     }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                        {rec.candidateDestination.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {rec.detourDisplay} (+{rec.addedDistanceKm} km)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDetourStop(rec)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#C88E44',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      + Add Stop
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Persistent Unified BharatMap */}
        <div style={{ position: 'sticky', top: '24px', zIndex: 10 }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#e2e8f0' }}>
            <BharatMap
              stops={mapStops}
              routeResult={routeResult}
              activeStopId={activeStopId}
              onSelectStop={(id) => setActiveStopId(id)}
              nearbyPlaces={detourRecommendations.slice(0, 4).map((r) => ({
                id: r.candidateDestination.id,
                name: r.candidateDestination.name,
                lat: r.candidateDestination.coordinates.lat,
                lng: r.candidateDestination.coordinates.lng,
                type: r.candidateDestination.type,
                detourDisplay: r.detourDisplay,
                distanceKm: r.addedDistanceKm,
              }))}
              onAddNearby={(id) => {
                const match = VERIFIED_DESTINATIONS.find((d) => d.id === id);
                if (match) handleAddDetourStop(match); // Fallback for map clicks
              }}
              isJourneyMode={isJourneyMode}
              height="600px"
            />
          </div>

          {/* Official Booking Providers Section */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              BOOKING & OFFICIAL LINKS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VERIFIED_BOOKING_PROVIDERS.filter((p) => p.territoryCoverage?.includes(itinerary.territoryId as any)).map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 0',
                    fontWeight: 500
                  }}
                >
                  {p.name} <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>↗</span>
                </a>
              ))}
              {VERIFIED_BOOKING_PROVIDERS.filter((p) => p.territoryCoverage?.includes(itinerary.territoryId as any)).length === 0 && (
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No official providers listed for this route.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 5. Optional Yatra AI Co-Editor Modal/Drawer */}
      {showAiEditor && (
        <YatraAiItineraryEditor
          itinerary={itinerary}
          onApplyChanges={(opt) => {
            setItinerary(opt);
            setShowAiEditor(false);
          }}
          onClose={() => setShowAiEditor(false)}
        />
      )}
    </main>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense
      fallback={
        <div className="container section-spacing" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ color: '#C88E44', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
            Preparing Dishaara Itinerary...
          </div>
        </div>
      }
    >
      <ItineraryContent />
    </Suspense>
  );
}
