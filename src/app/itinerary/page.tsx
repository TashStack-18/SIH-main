'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES } from '@/src/lib/fixtures';
import { ItineraryMapView } from '@/src/app/components/ItineraryMapView';
import { YatraAiItineraryEditor } from '@/src/app/components/YatraAiItineraryEditor';
import { FeasibilityEngine, ItineraryFeasibilityReport } from '@/src/lib/itinerary/feasibilityEngine';
import { RecommendationEngine } from '@/src/lib/itinerary/recommendationEngine';
import { SpatialEngine, DetourCalculationResult } from '@/src/lib/geospatial/spatialEngine';
import { calculateRouteWithFallback } from '@/src/lib/providers/maps';
import { RouteCalculationResult } from '@/src/lib/providers/types';
import type { Itinerary, ItineraryDay, ItineraryItem, TravelStyle, StopStatus } from '@/src/types/itinerary';

function ItineraryContent() {
  const searchParams = useSearchParams();
  const destinationParam = searchParams.get('destination');
  const territoryParam = searchParams.get('territory');

  // Initial State setup
  const [itinerary, setItinerary] = useState<Itinerary>(() => {
    // Default base itinerary (Ladakh marquee)
    return {
      id: 'itin-live-session',
      title: 'Trans-Himalayan Cultural & High Pass Journey',
      territoryId: 'LADAKH',
      territoryName: 'Ladakh',
      durationDays: 5,
      travellers: 2,
      startDate: '2026-09-10',
      endDate: '2026-09-14',
      travelStyle: 'BALANCED',
      estimatedBudget: 42000,
      days: [
        {
          dayNumber: 1,
          title: 'Acclimatization & Leh Heritage Walk',
          summary: 'Mandatory altitude acclimatization with evening walk at Shanti Stupa.',
          items: [
            {
              id: 'stop-1-1',
              time: '09:30 AM',
              title: 'Leh Main Palace & Heritage Bazaar',
              type: 'DESTINATION',
              destinationId: 'leh-palace',
              notes: '48-hour gentle rest protocol with hydration.',
              durationMinutes: 90,
              location: { lat: 34.1642, lng: 77.5848 },
              status: 'COMPLETED',
            },
            {
              id: 'stop-1-2',
              time: '05:00 PM',
              title: 'Shanti Stupa Sunset Viewpoint',
              type: 'ATTRACTION',
              destinationId: 'shanti-stupa',
              notes: 'Panoramic sunset view over Indus Valley.',
              durationMinutes: 75,
              location: { lat: 34.1706, lng: 77.5778 },
              status: 'COMPLETED',
            },
          ],
        },
        {
          dayNumber: 2,
          title: 'Leh to Nubra Valley via Khardung La',
          summary: 'Cross one of the highest passes into the cold desert dunes of Hunder.',
          items: [
            {
              id: 'stop-2-1',
              time: '08:00 AM',
              title: 'Khardung La Pass (5,359m)',
              type: 'TRANSPORT',
              destinationId: 'khardung-la',
              notes: 'Limit stay to 20 mins to prevent AMS.',
              durationMinutes: 30,
              location: { lat: 34.2792, lng: 77.6047 },
              status: 'ACTIVE',
            },
            {
              id: 'stop-2-2',
              time: '04:30 PM',
              title: 'Hunder Sand Dunes & Bactrian Camels',
              type: 'EXPERIENCE',
              destinationId: 'hunder-sand-dunes',
              notes: 'Double-humped camel safari along Karakoram dunes.',
              durationMinutes: 120,
              location: { lat: 34.58, lng: 77.46 },
              status: 'PLANNED',
            },
          ],
        },
        {
          dayNumber: 3,
          title: 'Nubra Valley to Turquoise Pangong Tso',
          summary: 'Drive along Shyok River canyon to the shifting shades of Pangong Tso.',
          items: [
            {
              id: 'stop-3-1',
              time: '08:30 AM',
              title: 'Diskit Monastery & Maitreya Buddha',
              type: 'HERITAGE',
              destinationId: 'diskit-monastery',
              notes: '106-foot tall Buddha overlooking Nubra.',
              durationMinutes: 90,
              location: { lat: 34.5428, lng: 77.5583 },
              status: 'PLANNED',
            },
            {
              id: 'stop-3-2',
              time: '03:30 PM',
              title: 'Pangong Tso (Spangmik Eco-Domes)',
              type: 'DESTINATION',
              destinationId: 'pangong-tso',
              notes: 'Endorheic salt lake with dark sky Milky Way photography.',
              durationMinutes: 180,
              location: { lat: 33.753, lng: 78.667 },
              status: 'PLANNED',
            },
          ],
        },
      ],
    };
  });

  // UI state
  const [activeStopId, setActiveStopId] = useState<string | null>('stop-2-1');
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [showAiEditor, setShowAiEditor] = useState(false);
  const [mobileTab, setMobileTab] = useState<'TIMELINE' | 'MAP'>('TIMELINE');
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING'>('SAVED');
  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [feasibility, setFeasibility] = useState<ItineraryFeasibilityReport | null>(null);
  const [detourRecommendations, setDetourRecommendations] = useState<DetourCalculationResult[]>([]);

  // Context Handoff pre-loader
  useEffect(() => {
    if (destinationParam) {
      const match = VERIFIED_DESTINATIONS.find(
        (d) => d.slug === destinationParam || d.id === destinationParam
      );
      if (match) {
        setItinerary((prev) => {
          // Check if already in itinerary
          const exists = prev.days.some((d) => d.items.some((i) => i.destinationId === match.id));
          if (exists) return prev;

          // Append to Day 2 or new day
          const updatedDays: ItineraryDay[] = JSON.parse(JSON.stringify(prev.days));
          const targetDay = updatedDays[1] || updatedDays[0];
          if (targetDay) {
            targetDay.items.push({
              id: `item-${Date.now()}`,
              time: '02:00 PM',
              title: match.name,
              type: match.type as any,
              destinationId: match.id,
              notes: match.tagline || match.shortDescription,
              durationMinutes: 90,
              location: match.coordinates,
              status: 'PLANNED' as StopStatus,
            });
          }

          return {
            ...prev,
            territoryId: match.territoryId as any,
            territoryName: match.territoryName,
            days: updatedDays,
          };
        });
      }
    }
  }, [destinationParam, territoryParam]);

  // Recalculate routes, feasibility, and recommendations
  const recalculateItineraryData = useCallback(async (currentItin: Itinerary) => {
    setSaveStatus('SAVING');

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
      currentItin.travelStyle === 'RELAXED' ? 'RELAXED' : currentItin.travelStyle === 'ADVENTURE' ? 'FAST-PACED' : 'BALANCED',
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

    // 3. TomTom Route Calculation
    const waypoints = allStops.map((s, idx) => ({
      lat: s.lat,
      lng: s.lng,
      name: s.name,
      id: `wp-${idx}`,
    }));

    if (waypoints.length >= 2) {
      const calculated = await calculateRouteWithFallback(waypoints, 'driving');
      setRouteResult(calculated);
    }

    setTimeout(() => setSaveStatus('SAVED'), 400);
  }, []);

  useEffect(() => {
    recalculateItineraryData(itinerary);
  }, [itinerary, recalculateItineraryData]);

  // Progress metrics
  const allItems = itinerary.days.flatMap((d) => d.items);
  const completedCount = allItems.filter((i) => i.status === 'COMPLETED').length;
  const totalStopsCount = allItems.length;
  const progressPercent = totalStopsCount > 0 ? Math.round((completedCount / totalStopsCount) * 100) : 0;

  // Next Stop Calculation
  const nextStop = allItems.find((i) => i.status === 'ACTIVE' || i.status === 'PLANNED') || allItems[0];

  // Actions
  const handleToggleStopComplete = (stopId: string) => {
    setItinerary((prev) => {
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

  const handleAddDetourStop = (candidate: typeof VERIFIED_DESTINATIONS[0]) => {
    setItinerary((prev) => {
      const updatedDays: ItineraryDay[] = JSON.parse(JSON.stringify(prev.days));
      const targetDay = updatedDays[1] || updatedDays[0];
      if (targetDay) {
        targetDay.items.push({
          id: `stop-${Date.now()}`,
          time: '01:30 PM',
          title: candidate.name,
          type: candidate.type as any,
          destinationId: candidate.id,
          notes: candidate.tagline || candidate.shortDescription,
          durationMinutes: 90,
          location: candidate.coordinates,
          status: 'PLANNED' as StopStatus,
        });
      }
      return { ...prev, days: updatedDays };
    });
  };

  const handleOptimizeTrigger = () => {
    const result = RecommendationEngine.optimizeItinerary(itinerary, itinerary.travelStyle);
    setItinerary(result.itinerary);
  };

  const handleDurationScale = (newDays: number) => {
    const result = RecommendationEngine.scaleDuration(itinerary, newDays);
    setItinerary(result.itinerary);
  };

  // Convert stops for map view
  let seqCounter = 1;
  const mapStops = itinerary.days.flatMap((day) =>
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
        type: item.type,
      }))
  );

  return (
    <main className="container section-spacing" role="main" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* 1. Top Itinerary Studio Header */}
      <div
        className="itinerary-header-box"
        style={{
          background: 'var(--stitch-surface-variant, #F0EADE)',
          border: '1px solid rgba(200, 142, 68, 0.4)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-2xl)',
          marginBottom: 'var(--space-xl)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-verified" style={{ background: '#2D1B14', color: '#ffffff' }}>
                🇮🇳 {itinerary.territoryName}
              </span>
              <span className="badge badge-neutral" style={{ background: 'rgba(200, 142, 68, 0.2)', color: '#2D1B14' }}>
                {itinerary.travelStyle} Style
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: saveStatus === 'SAVING' ? '#eab308' : '#16a34a' }}>
                {saveStatus === 'SAVING' ? '⏳ Saving…' : '✓ Live Autosaved'}
              </span>
            </div>

            <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#2D1B14', margin: '0 0 6px' }}>
              {itinerary.title}
            </h1>
            <p style={{ color: '#4A3C31', fontSize: '0.95rem', margin: 0 }}>
              {itinerary.durationDays} Days • {itinerary.travellers} Travellers • Verified TomTom Grounding
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAiEditor((prev) => !prev)}
              className="btn btn-outline"
              style={{ borderColor: '#C88E44', color: '#2D1B14', fontWeight: 700 }}
            >
              🤖 Yatra AI Co-Editor
            </button>
            <button
              onClick={() => setIsJourneyMode((prev) => !prev)}
              className="btn btn-primary"
              style={{
                background: isJourneyMode ? '#16a34a' : '#ba1a1a',
                borderColor: isJourneyMode ? '#16a34a' : '#ba1a1a',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              {isJourneyMode ? '✓ Exit Journey Mode' : '🚀 Start Live Journey'}
            </button>
          </div>
        </div>

        {/* Duration Scaling & Progress Ribbon */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(156, 141, 127, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Duration Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#78685C' }}>
              Duration Scaling:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[3, 5, 7, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationScale(d)}
                  className={`btn btn-sm ${itinerary.durationDays === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    background: itinerary.durationDays === d ? '#2D1B14' : 'transparent',
                    borderColor: '#2D1B14',
                    color: itinerary.durationDays === d ? '#ffffff' : '#2D1B14',
                  }}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Journey Completion Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2D1B14' }}>
              {completedCount} / {totalStopsCount} Stops ({progressPercent}%)
            </div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(45, 27, 20, 0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#16a34a',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Optional Yatra AI Co-Editor Modal/Drawer */}
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

      {/* 3. Feasibility & Health Status Banner */}
      {feasibility && (
        <div
          style={{
            background:
              feasibility.overallHealth === 'INFEASIBLE'
                ? '#fef2f2'
                : feasibility.overallHealth === 'BUSY'
                ? '#fffbeb'
                : '#f0fdf4',
            border: `1px solid ${
              feasibility.overallHealth === 'INFEASIBLE'
                ? '#f87171'
                : feasibility.overallHealth === 'BUSY'
                ? '#fbbf24'
                : '#86efac'
            }`,
            borderRadius: 'var(--radius-lg)',
            padding: '14px 20px',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>
              {feasibility.overallHealth === 'INFEASIBLE' ? '🚨' : feasibility.overallHealth === 'BUSY' ? '⚠️' : '✓'}
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2D1B14' }}>
                Trip Feasibility: {feasibility.overallHealth}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4A3C31' }}>
                {feasibility.headlineExplanation}
              </div>
            </div>
          </div>

          {feasibility.requiresOptimization && (
            <button
              onClick={handleOptimizeTrigger}
              className="btn btn-sm btn-primary"
              style={{ background: '#ba1a1a', borderColor: '#ba1a1a', color: '#ffffff', fontWeight: 700 }}
            >
              ⚡ Optimize Pacing & Route
            </button>
          )}
        </div>
      )}

      {/* 4. Mobile Map / Timeline View Switcher */}
      <div className="mobile-only" style={{ display: 'none', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMobileTab('TIMELINE')}
            className={`btn btn-sm ${mobileTab === 'TIMELINE' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            📋 Timeline
          </button>
          <button
            onClick={() => setMobileTab('MAP')}
            className={`btn btn-sm ${mobileTab === 'MAP' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            🗺️ Interactive Map
          </button>
        </div>
      </div>

      {/* 5. DUAL-PANE MAP-FIRST WORKSPACE */}
      <div
        className="itinerary-dual-workspace"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 1.15fr) minmax(380px, 1fr)',
          gap: 'var(--space-2xl)',
          alignItems: 'start',
        }}
      >
        
        {/* LEFT COLUMN: Itinerary Timeline & Next Stop Card */}
        <div className="itinerary-timeline-col">
          
          {/* Next Stop Guidance Card */}
          {nextStop && (
            <div
              className="next-stop-card"
              style={{
                background: '#2D1B14',
                color: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
                marginBottom: 'var(--space-xl)',
                border: '1px solid #C88E44',
                boxShadow: '0 8px 24px rgba(45, 27, 20, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-warning" style={{ background: '#C88E44', color: '#ffffff' }}>
                  NEXT STOP • ACTIVE ROUTE
                </span>
                <span style={{ fontSize: '0.8rem', color: '#D3C9BD' }}>
                  Leave around {nextStop.time || '08:30 AM'}
                </span>
              </div>

              <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#ffffff', margin: '4px 0 8px' }}>
                {nextStop.title}
              </h2>

              <p style={{ fontSize: '0.85rem', color: '#D3C9BD', margin: '0 0 14px' }}>
                {nextStop.notes || 'Scenic mountain pass with high altitude viewing points.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C88E44' }}>
                  {routeResult?.totalDistanceKm ? `${routeResult.totalDistanceKm} km Total` : 'Route Active'}
                </div>
                <button
                  onClick={() => handleToggleStopComplete(nextStop.id)}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#16a34a', borderColor: '#16a34a', color: '#ffffff', fontWeight: 700 }}
                >
                  ✓ Mark Stop Visited
                </button>
              </div>
            </div>
          )}

          {/* Sequential Day-by-Day Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {itinerary.days.map((day) => (
              <section
                key={day.dayNumber}
                className="itinerary-day-card"
                style={{
                  background: 'var(--color-bg-surface, #ffffff)',
                  border: '1px solid var(--color-border-subtle, rgba(211, 201, 189, 0.8))',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {/* Day Header */}
                <div
                  style={{
                    background: 'var(--stitch-surface-variant, #F0EADE)',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(200, 142, 68, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span className="badge badge-neutral" style={{ background: '#2D1B14', color: '#ffffff', marginBottom: '4px' }}>
                      Day {day.dayNumber}
                    </span>
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#2D1B14', margin: '4px 0 2px' }}>
                      {day.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#78685C' }}>
                      {day.summary}
                    </div>
                  </div>
                </div>

                {/* Stop Items */}
                <div style={{ padding: 'var(--space-lg)' }}>
                  <div className="timeline-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {day.items.map((item, idx) => {
                      const isCompleted = item.status === 'COMPLETED';
                      const isActive = activeStopId === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveStopId(item.id)}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '10px',
                            background: isActive
                              ? 'rgba(200, 142, 68, 0.1)'
                              : isCompleted
                              ? 'rgba(22, 163, 74, 0.05)'
                              : 'transparent',
                            border: `1px solid ${isActive ? '#C88E44' : 'transparent'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Checkbox / Sequence Badge */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStopComplete(item.id);
                            }}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isCompleted ? '#16a34a' : '#FAF7F2',
                              border: `2px solid ${isCompleted ? '#16a34a' : '#9C8D7F'}`,
                              color: isCompleted ? '#ffffff' : '#2D1B14',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </button>

                          {/* Stop Details */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C88E44', textTransform: 'uppercase' }}>
                                {item.type} • {item.time}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#78685C' }}>
                                ~{item.durationMinutes || 90} mins
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#2D1B14',
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                opacity: isCompleted ? 0.7 : 1,
                              }}
                            >
                              {item.title}
                            </div>

                            {item.notes && (
                              <p style={{ fontSize: '0.825rem', color: '#4A3C31', margin: '4px 0 0', lineHeight: 1.4 }}>
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* 6. Route-Aware Detour Recommendations Rail */}
          {detourRecommendations.length > 0 && (
            <div style={{ marginTop: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#2D1B14', margin: 0 }}>
                    Nearby on Route (Low Detour)
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#78685C' }}>
                    Verified stops along your path computed with real added driving delta.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detourRecommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.candidateDestination.id}
                    style={{
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid rgba(200, 142, 68, 0.4)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2D1B14' }}>
                          {rec.candidateDestination.name}
                        </span>
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          {rec.detourDisplay}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#78685C', marginTop: '2px' }}>
                        Along {rec.originLeg} • {rec.candidateDestination.type}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddDetourStop(rec.candidateDestination)}
                      className="btn btn-sm btn-outline"
                      style={{ borderColor: '#C88E44', color: '#2D1B14', fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      + Add to Route
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sticky MapView with Route Geometry */}
        <div
          className="itinerary-map-col"
          style={{
            position: 'sticky',
            top: '90px',
            height: 'calc(100vh - 120px)',
            minHeight: '520px',
          }}
        >
          <ItineraryMapView
            stops={mapStops}
            routeResult={routeResult}
            activeStopId={activeStopId}
            onSelectStop={(id) => setActiveStopId(id)}
            nearbyPlaces={detourRecommendations.map((d) => ({
              id: d.candidateDestination.id,
              name: d.candidateDestination.name,
              lat: d.candidateDestination.coordinates.lat,
              lng: d.candidateDestination.coordinates.lng,
              type: d.candidateDestination.type,
              detourDisplay: d.detourDisplay,
              distanceKm: d.addedDistanceKm,
            }))}
            onAddNearby={(id) => {
              const match = VERIFIED_DESTINATIONS.find((d) => d.id === id);
              if (match) handleAddDetourStop(match);
            }}
          />
        </div>

      </div>

    </main>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense
      fallback={
        <div className="container section-spacing text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#2D1B14', fontWeight: 700 }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🗺️</span>
            Loading Intelligent Itinerary Studio…
          </div>
        </div>
      }
    >
      <ItineraryContent />
    </Suspense>
  );
}
