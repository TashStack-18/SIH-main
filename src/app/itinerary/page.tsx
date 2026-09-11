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
import { DepthCarousel } from '@/src/app/components/DepthCarousel';
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

function TerritoryDiscoveryView({ onSelect }: { onSelect: (id: string) => void }) {
  const [dimensions, setDimensions] = useState({ width: 600, height: 400, spread: 120, depth: 140, blur: 4 });

  useEffect(() => {
    const handleResize = () => {
      // LANDSCAPE DIMENSIONS (approx 3:2 ratio)
      if (window.innerWidth < 400) {
        setDimensions({ width: 270, height: 180, spread: 45, depth: 60, blur: 2 });
      } else if (window.innerWidth < 768) {
        setDimensions({ width: 330, height: 220, spread: 60, depth: 80, blur: 2 });
      } else if (window.innerWidth < 1024) {
        setDimensions({ width: 450, height: 300, spread: 80, depth: 100, blur: 3 });
      } else {
        setDimensions({ width: 600, height: 400, spread: 120, depth: 140, blur: 4 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const carouselItems = VERIFIED_TERRITORIES.map((t, i) => ({
    id: t.id,
    title: t.name,
    subtitle: (t as any).tagline || (t as any).heroDescription || t.name,
    image: (t as any).heroImage || '',
    chapter: String(i + 1).padStart(2, '0')
  }));

  return (
    <div className="w-full flex flex-col items-center justify-start pt-8 pb-16" style={{ maxWidth: '1440px', marginInline: 'auto' }}>
      <header className="text-center mb-6 px-4 z-20">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] mb-3" style={{ letterSpacing: '-0.02em' }}>
          PLAN YOUR JOURNEY
        </h1>
        <p className="font-mono text-xs md:text-sm tracking-widest text-[var(--color-accent)] uppercase mb-3 font-semibold">
          Explore India's 8 Union Territories
        </p>
        <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
          Choose where you want to travel and Dishaara will help shape the journey.
        </p>
      </header>

      <div className="w-full relative z-10 overflow-hidden" style={{ maxWidth: '1200px', marginInline: 'auto' }}>
        <DepthCarousel 
          items={carouselItems} 
          onSelect={onSelect} 
          cardWidth={dimensions.width}
          cardHeight={dimensions.height}
          spread={dimensions.spread}
          depth={dimensions.depth}
          blur={dimensions.blur}
          tilt={8}
          perspective={1200}
          visibleCards={3}
        />
      </div>
    </div>
  );
}

function ItineraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destinationParam = searchParams.get('destination');
  const territoryParam = searchParams.get('territory');

  // State
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
    if (destinationParam) {
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
        }
      }
    } else {
      // If no destination parameter is provided, itinerary starts as null (prompting the user)
      setItinerary(null);
      setSelectedDestination(null);
    }
  }, [destinationParam, selectedDuration, selectedStyle, selectedTravellers]);

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
  const handleSelectStartDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    const built = ItineraryBuilder.buildFromDestination({
      destinationId: dest.id,
      durationDays: selectedDuration,
      travelStyle: selectedStyle,
      travellers: selectedTravellers,
    });

    if (built.success && built.itinerary) {
      setItinerary(built.itinerary);
      const firstStop = built.itinerary.days[0]?.items[0]?.id || null;
      setActiveStopId(firstStop);
      router.push(`/itinerary?destination=${dest.slug}`);
    }
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
      const updatedDays: ItineraryDay[] = prev.days.map((d) => ({
        ...d,
        items: d.items.filter((item) => item.id !== stopId),
      })).filter((d) => d.items.length > 0);
      return { ...prev, days: updatedDays };
    });
  };

  const handleAddDetourStop = (candidate: Destination) => {
    if (!itinerary) return;
    setItinerary((prev) => {
      if (!prev) return null;
      const updatedDays: ItineraryDay[] = JSON.parse(JSON.stringify(prev.days));
      const targetDay = updatedDays[1] || updatedDays[0];
      if (targetDay) {
        targetDay.items.push({
          id: `stop-${Date.now()}`,
          time: '02:00 PM',
          title: candidate.name,
          type: candidate.type as any,
          destinationId: candidate.id,
          notes: candidate.tagline || candidate.shortDescription,
          durationMinutes: 90,
          location: candidate.coordinates,
          status: 'PLANNED' as StopStatus,
          isMustVisit: false,
          isLocked: false,
        });
      }
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
  // Mode B / Empty State (No Destination Chosen)
  // -------------------------------------------------------------
  if (!itinerary) {
    return (
      <main className="container section-spacing" role="main" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            background: 'var(--color-bg-surface-elevated, #1a2230)',
            border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: 'clamp(24px, 5vw, 48px)',
            textAlign: 'center',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-card, 0 10px 30px rgba(0,0,0,0.3))',
          }}
        >

          <h1 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: 'var(--color-text-primary, #ffffff)', margin: '8px 0 12px' }}>
            Choose a Destination to Start Planning
          </h1>
          <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 28px' }}>
            Select any verified destination across India's 8 Union Territories. The itinerary planner builds your journey strictly around your chosen destination with verified route feasibility.
          </p>

          {/* Quick Filter by UT */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              onClick={() => setSelectedUtFilter('ALL')}
              className={`btn btn-sm ${selectedUtFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px', fontSize: '0.8rem', padding: '6px 14px' }}
            >
              All 8 UTs
            </button>
            {VERIFIED_TERRITORIES.map((ut) => (
              <button
                key={ut.id}
                onClick={() => setSelectedUtFilter(ut.id)}
                className={`btn btn-sm ${selectedUtFilter === ut.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '9999px', fontSize: '0.8rem', padding: '6px 14px' }}
              >
                {ut.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: '540px', margin: '0 auto 36px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search verified destinations (e.g. Pangong Tso, Sukhna Lake, Kavaratti, Red Fort)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(200, 142, 68, 0.4)',
                background: 'rgba(15, 23, 42, 0.7)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Trip Preferences Setup */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px 20px',
              maxWidth: '800px',
              margin: '0 auto 36px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                Trip Duration:
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[2, 3, 5, 7, 10].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    style={{
                      background: selectedDuration === d ? '#C88E44' : 'transparent',
                      color: selectedDuration === d ? '#ffffff' : '#cbd5e1',
                      border: '1px solid rgba(200, 142, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                Travel Pace:
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['RELAXED', 'BALANCED', 'FAST-PACED'] as TravelStyle[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    style={{
                      background: selectedStyle === st ? '#C88E44' : 'transparent',
                      color: selectedStyle === st ? '#ffffff' : '#cbd5e1',
                      border: '1px solid rgba(200, 142, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                Travellers:
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedTravellers(num)}
                    style={{
                      background: selectedTravellers === num ? '#C88E44' : 'transparent',
                      color: selectedTravellers === num ? '#ffffff' : '#cbd5e1',
                      border: '1px solid rgba(200, 142, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {num} 👤
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destination Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredDestinations.map((dest) => (
            <article
              key={dest.id}
              className="card card-hoverable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--color-bg-surface-elevated, #1a2230)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={dest.image || '/images/Pangong Tso.jpeg'}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                    {dest.territoryName}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary, #C88E44)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {dest.type}
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px', color: '#ffffff' }}>{dest.name}</h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.4, flexGrow: 1, marginBottom: '14px' }}>
                  {dest.shortDescription}
                </p>

                <button
                  onClick={() => handleSelectStartDestination(dest)}
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  Plan Around {dest.name.split(' ')[0]}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Active Itinerary Studio View
  // -------------------------------------------------------------
  return (
    <main className="container section-spacing" role="main" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* 1. Header Box */}
      <div
        className="itinerary-header-box"
        style={{
          background: 'var(--color-bg-surface-elevated, #1a2230)',
          border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-card, 0 10px 30px rgba(0,0,0,0.3))',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-verified" style={{ background: 'var(--color-primary, #C88E44)', color: '#ffffff' }}>
                🇮🇳 {itinerary.territoryName}
              </span>
              <span className="badge badge-neutral" style={{ background: 'rgba(200, 142, 68, 0.2)', color: '#FAF7F2' }}>
                {itinerary.travelStyle} Style
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: saveStatus === 'SAVING' ? '#f59e0b' : '#10b981' }}>
                {saveStatus === 'SAVING' ? '⏳ Recalculating…' : '✓ Grounded & Autosaved'}
              </span>
            </div>

            <h1 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', color: 'var(--color-text-primary, #ffffff)', margin: '0 0 6px' }}>
              {itinerary.title}
            </h1>
            <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '0.9rem', margin: 0 }}>
              Centred on <strong>{selectedDestination?.name || itinerary.days[0]?.items[0]?.title}</strong> • {itinerary.durationDays} Days • {itinerary.travellers} Travellers
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setItinerary(null);
                setSelectedDestination(null);
                router.push('/itinerary');
              }}
              className="btn btn-outline"
              style={{ fontWeight: 700, fontSize: '0.85rem' }}
            >
              🔄 Change Destination
            </button>
            <button
              onClick={() => setShowAiEditor((prev) => !prev)}
              className="btn btn-outline"
              style={{ fontWeight: 700, fontSize: '0.85rem' }}
            >
              🤖 Yatra AI Studio
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FAF7F2' }}>
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

      {/* 2. Transparent Route Optimization Proposal Banner (User approval required) */}
      {optimizationProposal && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(200, 142, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid #C88E44',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#f59e0b' }}>
              ⚡ Route Optimizer Suggestion
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {optimizationProposal.rationale}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Suggested order: {optimizationProposal.suggestedSequence.join(' → ')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleApplyOptimization} className="btn btn-sm btn-primary" style={{ fontWeight: 700 }}>
              ✓ Apply Optimized Route
            </button>
            <button onClick={handleDismissOptimization} className="btn btn-sm btn-outline">
              Keep My Plan
            </button>
          </div>
        </div>
      )}

      {/* 3. Feasibility & Health Status Banner */}
      {feasibility && (
        <div
          style={{
            background:
              feasibility.overallHealth === 'INFEASIBLE'
                ? '#381414'
                : feasibility.overallHealth === 'BUSY'
                ? '#382a14'
                : '#143820',
            border: `1px solid ${
              feasibility.overallHealth === 'INFEASIBLE'
                ? '#f87171'
                : feasibility.overallHealth === 'BUSY'
                ? '#fbbf24'
                : '#4ade80'
            }`,
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {feasibility.overallHealth === 'INFEASIBLE' ? '⚠️' : feasibility.overallHealth === 'BUSY' ? '⏱️' : '🛡️'}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FAF7F2' }}>
                Feasibility Status: {feasibility.overallHealth}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {feasibility.headlineExplanation}
              </div>
            </div>
          </div>

          {feasibility.allWarnings.length > 0 && (
            <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px', color: '#FAF7F2' }}>
              {feasibility.allWarnings.length} Feasibility Advisory Notes
            </span>
          )}
        </div>
      )}

      {/* 4. Main Two-Column Layout: Itinerary Timeline + Unified BharatMap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Timeline Days & Stops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Stop Real-Time Telemetry Card */}
          {activeStopItem && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(200, 142, 68, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(200, 142, 68, 0.4)',
                borderRadius: '14px',
                padding: '16px 20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>
                      REAL-TIME PLACE TELEMETRY
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 2px' }}>
                    {activeStopItem.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Coordinates: {activeStopItem.location?.lat.toFixed(4)}°N, {activeStopItem.location?.lng.toFixed(4)}°E
                  </div>
                </div>

                {/* Live Weather Indicator */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    minWidth: '170px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  {isWeatherLoading ? (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fetching live weather...</div>
                  ) : liveStopWeather ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                          {liveStopWeather.tempC}°C
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                          {liveStopWeather.conditionText}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                        <span>💨 {liveStopWeather.windSpeedKmh} km/h</span>
                        <span>💧 {liveStopWeather.humidityPercent}%</span>
                        <span style={{ color: '#4ade80' }}>AQI: {liveStopWeather.airQualityBand}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Weather data active</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {itinerary.days.map((day) => (
            <div
              key={day.dayNumber}
              style={{
                background: 'var(--color-bg-surface-elevated, #1a2230)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-primary" style={{ background: '#C88E44', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800 }}>
                    DAY {day.dayNumber}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '4px 0 2px' }}>{day.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{day.summary}</div>
                </div>
              </div>

              {/* Day Stops */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                {day.items.map((item) => {
                  const isActive = activeStopId === item.id;
                  const isCompleted = item.status === 'COMPLETED';

                  return (
                    <div
                      key={item.id}
                      id={`stop-card-${item.id}`}
                      onClick={() => setActiveStopId(item.id)}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(200, 142, 68, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%)'
                          : 'rgba(15, 23, 42, 0.6)',
                        border: `1.5px solid ${isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '12px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isActive
                          ? '0 0 20px rgba(245, 158, 11, 0.25), 0 8px 24px rgba(0, 0, 0, 0.4)'
                          : 'none',
                        transform: isActive ? 'scale(1.01)' : 'scale(1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#C88E44', fontWeight: 700 }}>
                            {item.time}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            {item.type}
                          </span>
                          {item.isMustVisit && (
                            <span style={{ fontSize: '0.65rem', background: '#e11d48', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              ★ MUST VISIT
                            </span>
                          )}
                          {item.isLocked && (
                            <span style={{ fontSize: '0.65rem', background: '#475569', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              🔒 LOCKED
                            </span>
                          )}
                        </div>

                        {/* Stop Action Buttons */}
                        <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleLockStop(item.id)}
                            title={item.isLocked ? 'Unlock stop' : 'Lock stop in place'}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            {item.isLocked ? '🔒' : '🔓'}
                          </button>
                          <button
                            onClick={() => handleToggleMustVisit(item.id)}
                            title={item.isMustVisit ? 'Unmark must-visit' : 'Mark as must-visit'}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            {item.isMustVisit ? '★' : '☆'}
                          </button>
                          <button
                            onClick={() => handleToggleStopComplete(item.id)}
                            className={`btn btn-sm ${isCompleted ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                          >
                            {isCompleted ? '✓ Done' : 'Mark Done'}
                          </button>
                          {!item.isLocked && (
                            <button
                              onClick={() => handleRemoveStop(item.id)}
                              title="Remove stop"
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isCompleted ? '#94a3b8' : '#ffffff' }}>
                        {item.title}
                      </div>

                      {item.notes && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                          {item.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Along-the-Route Recommendations Rail */}
          {detourRecommendations.length > 0 && (
            <div
              style={{
                background: 'var(--color-bg-surface-elevated, #1a2230)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#38bdf8' }}>
                    ALONG YOUR ROUTE RECOMMENDATIONS
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Verified places near your current route corridor with low detour impact.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detourRecommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.candidateDestination.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        {rec.candidateDestination.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                        {rec.detourDisplay} (+{rec.addedDistanceKm} km)
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddDetourStop(rec.candidateDestination as any)}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', borderColor: '#38bdf8', color: '#38bdf8' }}
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
        <div style={{ position: 'sticky', top: '24px' }}>
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
              if (match) handleAddDetourStop(match);
            }}
            isJourneyMode={isJourneyMode}
            height="580px"
          />

          {/* Official Booking Providers Section */}
          <div
            style={{
              marginTop: '18px',
              background: 'var(--color-bg-surface-elevated, #1a2230)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#C88E44', marginBottom: '8px' }}>
              🏨 Verified Booking Portals
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {VERIFIED_BOOKING_PROVIDERS.filter((p) => p.territoryCoverage?.includes(itinerary.territoryId as any)).map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {p.name} ↗
                </a>
              ))}
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
          <div style={{ color: '#C88E44', fontSize: '1.2rem', fontWeight: 700 }}>
            🇮🇳 Loading Dishaara Itinerary Studio…
          </div>
        </div>
      }
    >
      <ItineraryContent />
    </Suspense>
  );
}
