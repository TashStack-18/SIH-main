'use client';

/**
 * 🇮🇳 BHARAT SAFE YATRA — GEOSPATIAL MAP & NAVIGATION EXPLORER
 * Unified Mapbox GL Engine with Real-Time Routing, 3D Daylight Terrain,
 * 8 Union Territories Filtering, Live Meteorological Telemetry & Heritage Daylight Theme
 */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BharatMap, BharatMapStop } from './BharatMap';
import { VERIFIED_DESTINATIONS, VERIFIED_EMERGENCY_FACILITIES } from '@/src/lib/fixtures';
import type { RouteCalculationResult } from '@/src/lib/providers/types';

interface UTData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  coordinates: { lat: number; lng: number; zoom: number };
}

const UT_LIST: UTData[] = [
  { id: 'ALL', name: 'All 8 UTs', shortName: 'In All UTs', color: '#4B6FA5', coordinates: { lat: 22.5937, lng: 78.9629, zoom: 5 } },
  { id: 'LADAKH', name: 'Ladakh', shortName: 'Ladakh', color: '#6B7E5A', coordinates: { lat: 34.1526, lng: 77.5771, zoom: 8 } },
  { id: 'JAMMU_KASHMIR', name: 'Jammu & Kashmir', shortName: 'J&K', color: '#5B8A9F', coordinates: { lat: 34.0837, lng: 74.7973, zoom: 9 } },
  { id: 'DELHI', name: 'Delhi NCR', shortName: 'Delhi', color: '#8B6C42', coordinates: { lat: 28.6139, lng: 77.2090, zoom: 11 } },
  { id: 'CHANDIGARH', name: 'Chandigarh', shortName: 'Chandigarh', color: '#5A7A6B', coordinates: { lat: 30.7333, lng: 76.7794, zoom: 12 } },
  { id: 'PUDUCHERRY', name: 'Puducherry', shortName: 'Puducherry', color: '#7A6B9A', coordinates: { lat: 11.9416, lng: 79.8083, zoom: 12 } },
  { id: 'ANDAMAN_NICOBAR', name: 'Andaman & Nicobar', shortName: 'Andaman', color: '#4A8A7A', coordinates: { lat: 11.6234, lng: 92.7265, zoom: 9 } },
  { id: 'LAKSHADWEEP', name: 'Lakshadweep', shortName: 'Lakshadweep', color: '#4A7A9A', coordinates: { lat: 10.5667, lng: 72.6417, zoom: 10 } },
  { id: 'DADRA_NAGAR_HAVELI_DAMAN_DIU', name: 'DNH & Daman & Diu', shortName: 'Daman & Diu', color: '#8A6A5A', coordinates: { lat: 20.3974, lng: 72.8328, zoom: 10 } },
];

export default function GoogleMapView() {
  const [selectedUT, setSelectedUT] = useState<string>('DELHI');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ATTRACTIONS' | 'EMERGENCY'>('ALL');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('red-fort');
  const [liveWeather, setLiveWeather] = useState<{
    tempC: number;
    conditionText: string;
    humidityPercent: number;
    windSpeedKmh: number;
    airQualityBand: string;
  } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Filter destinations based on selected UT
  const filteredDestinations = useMemo(() => {
    return VERIFIED_DESTINATIONS.filter((d) => {
      if (selectedUT !== 'ALL' && d.territoryId !== selectedUT) return false;
      return true;
    });
  }, [selectedUT]);

  // Filter emergency facilities
  const filteredEmergency = useMemo(() => {
    return VERIFIED_EMERGENCY_FACILITIES.filter((e) => {
      if (selectedUT !== 'ALL' && e.territoryId !== selectedUT) return false;
      return true;
    });
  }, [selectedUT]);

  // Convert to BharatMapStop format
  const mapStops: BharatMapStop[] = useMemo(() => {
    const stops: BharatMapStop[] = [];

    if (activeCategory === 'ALL' || activeCategory === 'ATTRACTIONS') {
      filteredDestinations.forEach((d, idx) => {
        stops.push({
          id: d.id,
          name: d.name,
          lat: d.coordinates.lat,
          lng: d.coordinates.lng,
          dayNumber: 1,
          sequenceNumber: idx + 1,
          type: d.type,
          isActive: d.id === selectedPlaceId,
          notes: d.tagline || d.shortDescription,
        });
      });
    }

    if (activeCategory === 'ALL' || activeCategory === 'EMERGENCY') {
      filteredEmergency.forEach((e, idx) => {
        stops.push({
          id: e.id,
          name: `🏥 ${e.name}`,
          lat: e.coordinates.lat,
          lng: e.coordinates.lng,
          dayNumber: 1,
          sequenceNumber: stops.length + idx + 1,
          type: 'HOSPITAL',
          isActive: e.id === selectedPlaceId,
          notes: `${e.address} • Call: ${e.phone}`,
        });
      });
    }

    return stops;
  }, [filteredDestinations, filteredEmergency, activeCategory, selectedPlaceId]);

  // Find currently selected place
  const selectedPlace = useMemo(() => {
    const d = filteredDestinations.find((item) => item.id === selectedPlaceId);
    if (d) return { ...d, isEmergency: false };
    const e = filteredEmergency.find((item) => item.id === selectedPlaceId);
    if (e) return { ...e, isEmergency: true };
    return filteredDestinations[0] ? { ...filteredDestinations[0], isEmergency: false } : null;
  }, [filteredDestinations, filteredEmergency, selectedPlaceId]);

  // Dynamic route calculation result for selected UT circuit
  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    if (filteredDestinations.length < 2) {
      setRouteResult(null);
      return;
    }

    let isMounted = true;
    setIsRouteLoading(true);

    const waypoints = filteredDestinations.slice(0, 6).map((d) => ({
      lat: d.coordinates.lat,
      lng: d.coordinates.lng,
      name: d.name,
    }));

    fetch('/api/v1/maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waypoints, mode: 'driving' }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setRouteResult(json.data);
        }
      })
      .catch((err) => {
        console.warn('[GoogleMapView] Route calculation error:', err);
      })
      .finally(() => {
        if (isMounted) setIsRouteLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filteredDestinations]);

  // Fetch live weather when selected place changes
  useEffect(() => {
    if (!selectedPlace || !selectedPlace.coordinates) {
      setLiveWeather(null);
      return;
    }

    let isMounted = true;
    setIsWeatherLoading(true);

    fetch(`/api/v1/weather?lat=${selectedPlace.coordinates.lat}&lng=${selectedPlace.coordinates.lng}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          const d = json.data;
          setLiveWeather({
            tempC: d.current.tempC,
            conditionText: d.current.conditionText,
            humidityPercent: d.current.humidityPercent,
            windSpeedKmh: d.current.windSpeedKmh,
            airQualityBand: d.current.airQualityBand || 'GOOD',
          });
        }
      })
      .catch((err) => console.warn('Weather fetch error:', err))
      .finally(() => {
        if (isMounted) setIsWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPlace?.coordinates?.lat, selectedPlace?.coordinates?.lng]);

  // Handle UT switch
  const handleSelectUT = (utId: string) => {
    setSelectedUT(utId);
    const dests = utId === 'ALL' ? VERIFIED_DESTINATIONS : VERIFIED_DESTINATIONS.filter((d) => d.territoryId === utId);
    if (dests.length > 0) {
      setSelectedPlaceId(dests[0].id);
    } else {
      const em = VERIFIED_EMERGENCY_FACILITIES.filter((e) => utId === 'ALL' || e.territoryId === utId);
      if (em.length > 0) setSelectedPlaceId(em[0].id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', color: '#2D1B14', paddingBottom: '70px' }}>
      {/* Top Heritage Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)',
          borderBottom: '1px solid rgba(200, 142, 68, 0.25)',
          padding: '28px 20px 20px',
          boxShadow: '0 4px 16px rgba(45, 27, 20, 0.04)',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '6px 0 2px', color: '#2D1B14', letterSpacing: '-0.02em' }}>
                Interactive Union Territory Map Explorer
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#78685C', margin: 0 }}>
                Explore India’s 8 Union Territories with verified PostGIS coordinates, 3D terrain, hospital telemetry, and intelligent routing.
              </p>
            </div>

            {/* Quick Action */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href="/itinerary"
                style={{
                  background: 'linear-gradient(135deg, #C88E44 0%, #a76d29 100%)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(200, 142, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🗺️</span> Open Itinerary Studio
              </Link>
            </div>
          </div>

          {/* UT Pill Ribbon (Clean Light Style) */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingTop: '18px',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {UT_LIST.map((ut) => {
              const isSelected = selectedUT === ut.id;
              return (
                <button
                  key={ut.id}
                  onClick={() => handleSelectUT(ut.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '7px 16px',
                    borderRadius: '30px',
                    border: `1.5px solid ${isSelected ? ut.color : 'rgba(0,0,0,0.10)'}`,
                    background: isSelected ? ut.color : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#4A4A4A',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 3px 10px ${ut.color}55` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {ut.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map & Intelligence Section */}
      <div style={{ maxWidth: '1380px', margin: '24px auto 0', padding: '0 20px' }}>

        {/* Filter Chips Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveCategory('ALL')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1.5px solid ${activeCategory === 'ALL' ? '#0284c7' : 'rgba(200, 142, 68, 0.25)'}`,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeCategory === 'ALL' ? '#0284c7' : '#FFFFFF',
                color: activeCategory === 'ALL' ? '#FFFFFF' : '#4A3C31',
                boxShadow: activeCategory === 'ALL' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              • All Pins ({mapStops.length})
            </button>
            <button
              onClick={() => setActiveCategory('ATTRACTIONS')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1.5px solid ${activeCategory === 'ATTRACTIONS' ? '#C88E44' : 'rgba(200, 142, 68, 0.25)'}`,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeCategory === 'ATTRACTIONS' ? '#C88E44' : '#FFFFFF',
                color: activeCategory === 'ATTRACTIONS' ? '#FFFFFF' : '#4A3C31',
                boxShadow: activeCategory === 'ATTRACTIONS' ? '0 2px 8px rgba(200, 142, 68, 0.35)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              Attractions ({filteredDestinations.length})
            </button>
            <button
              onClick={() => setActiveCategory('EMERGENCY')}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1.5px solid ${activeCategory === 'EMERGENCY' ? '#059669' : 'rgba(200, 142, 68, 0.25)'}`,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeCategory === 'EMERGENCY' ? '#059669' : '#FFFFFF',
                color: activeCategory === 'EMERGENCY' ? '#FFFFFF' : '#4A3C31',
                boxShadow: activeCategory === 'EMERGENCY' ? '0 2px 8px rgba(5, 150, 105, 0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              24x7 Hospitals ({filteredEmergency.length})
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#78685C' }}>
            Showing <strong>{mapStops.length}</strong> verified locations across{' '}
            <span style={{ color: '#C88E44', fontWeight: 800 }}>
              {UT_LIST.find((u) => u.id === selectedUT)?.name || 'India'}
            </span>
          </div>
        </div>

        {/* Unified BharatMap Engine (Bright Daylight 3D Theme) */}
        <BharatMap
          stops={mapStops}
          routeResult={routeResult}
          activeStopId={selectedPlaceId}
          onSelectStop={(id) => setSelectedPlaceId(id)}
          height="580px"
          showControls={true}
        />

        {/* Selected Place Live Intelligence & Route Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginTop: '24px' }}>

          {/* Active Place Detail Card (Clean Light Surface) */}
          {selectedPlace && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(200, 142, 68, 0.35)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(45, 27, 20, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary" style={{ background: '#C88E44', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800 }}>
                      {selectedPlace.type || 'DESTINATION'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#78685C', fontWeight: 600 }}>
                      {selectedPlace.territoryName || selectedUT}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2D1B14', margin: '6px 0 4px' }}>
                    {selectedPlace.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#C88E44', fontWeight: 700 }}>
                    {'tagline' in selectedPlace && selectedPlace.tagline ? selectedPlace.tagline : 'address' in selectedPlace ? selectedPlace.address : 'Verified Tourism Asset'}
                  </div>
                </div>

                {/* Real-time Weather Telemetry Pill */}
                {liveWeather && (
                  <div
                    style={{
                      background: '#FAF7F2',
                      border: '1px solid rgba(200, 142, 68, 0.25)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      textAlign: 'right',
                      minWidth: '130px',
                      boxShadow: '0 2px 6px rgba(45, 27, 20, 0.04)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2D1B14' }}>
                      {liveWeather.tempC}°C
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
                      {liveWeather.conditionText}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                      AQI: {liveWeather.airQualityBand}
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#4A3C31', lineHeight: '1.6', margin: '14px 0 16px' }}>
                {'shortDescription' in selectedPlace && selectedPlace.shortDescription
                  ? selectedPlace.shortDescription
                  : 'services' in selectedPlace
                    ? `24x7 Emergency Medical Facility providing: ${selectedPlace.services?.join(', ')}`
                    : 'Verified destination coordinate fixture.'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid rgba(200, 142, 68, 0.15)' }}>
                {'slug' in selectedPlace && selectedPlace.slug && (
                  <>
                    <Link
                      href={`/itinerary?destination=${selectedPlace.slug}&territory=${selectedPlace.territoryId}`}
                      style={{
                        background: '#C88E44',
                        color: '#ffffff',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(200, 142, 68, 0.3)',
                      }}
                    >
                      Plan Trip Around {selectedPlace.name.split(' ')[0]}
                    </Link>
                    <Link
                      href={`/destinations/${selectedPlace.slug}`}
                      style={{
                        background: '#FAF7F2',
                        color: '#2D1B14',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        border: '1px solid rgba(200, 142, 68, 0.3)',
                      }}
                    >
                      Explore Destination ↗
                    </Link>
                  </>
                )}
                {'phone' in selectedPlace && selectedPlace.phone && (
                  <a
                    href={`tel:${selectedPlace.phone}`}
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    📞 Call Hospital: {selectedPlace.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Territory Route Navigation Circuit (Clean Light Surface) */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(200, 142, 68, 0.35)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(45, 27, 20, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#EA580C', letterSpacing: '0.05em' }}>
                  ⚡ LIVE ROUTE CIRCUIT • MAPBOX NAVIGATION
                </span>
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2D1B14', margin: '6px 0 4px' }}>
                {UT_LIST.find((u) => u.id === selectedUT)?.name} Verified Heritage & Scenic Circuit
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#78685C', margin: 0 }}>
                {filteredDestinations.length > 1
                  ? filteredDestinations.map((d) => d.name).slice(0, 4).join(' → ') + ' Circuit'
                  : 'Multi-destination route circuit across verified coordinates.'}
              </p>

              {routeResult && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '18px' }}>
                  <div style={{ background: '#FAF7F2', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(200, 142, 68, 0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#78685C' }}>Total Route Distance</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
                      ~{routeResult.totalDistanceKm} km
                    </div>
                  </div>
                  <div style={{ background: '#FAF7F2', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(200, 142, 68, 0.25)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#78685C' }}>Est. Transit Drive Time</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                      {Math.floor(routeResult.totalDurationMinutes / 60)}h {routeResult.totalDurationMinutes % 60}m
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Protocols Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', paddingTop: '14px', borderTop: '1px solid rgba(200, 142, 68, 0.15)' }}>
              <div style={{ fontSize: '0.78rem', color: '#78685C' }}>
                Emergency: <strong style={{ color: '#dc2626' }}>ERSS 112</strong> • Tourist Help: <strong style={{ color: '#0284c7' }}>1363</strong>
              </div>
              <Link
                href="/safety"
                style={{ fontSize: '0.8rem', color: '#C88E44', fontWeight: 800, textDecoration: 'none' }}
              >
                View UT Safety Protocols ↗
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
