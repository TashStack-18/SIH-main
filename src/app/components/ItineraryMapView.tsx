'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RouteCalculationResult } from '@/src/lib/providers/types';

interface StopMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dayNumber: number;
  sequenceNumber: number;
  isActive?: boolean;
  isCompleted?: boolean;
  type?: string;
}

interface NearbyMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  detourDisplay?: string;
  distanceKm?: number;
}

interface ItineraryMapViewProps {
  stops: StopMarker[];
  routeResult: RouteCalculationResult | null;
  activeStopId?: string | null;
  onSelectStop?: (stopId: string) => void;
  nearbyPlaces?: NearbyMarker[];
  onAddNearby?: (placeId: string) => void;
}

export function ItineraryMapView({
  stops,
  routeResult,
  activeStopId,
  onSelectStop,
  nearbyPlaces = [],
  onAddNearby,
}: ItineraryMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);

  // Compute bounding box
  const validStops = stops.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number');
  const lats = validStops.map((s) => s.lat);
  const lngs = validStops.map((s) => s.lng);

  const minLat = lats.length > 0 ? Math.min(...lats) : 20.0;
  const maxLat = lats.length > 0 ? Math.max(...lats) : 35.0;
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 70.0;
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 90.0;

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Convert lat/lng to container % coordinates for deterministic SVG/Canvas overlay
  const toMapPercent = (lat: number, lng: number) => {
    const latSpan = Math.max(0.1, maxLat - minLat);
    const lngSpan = Math.max(0.1, maxLng - minLng);

    // Padding margins
    const pad = 12;
    const x = pad + ((lng - minLng) / lngSpan) * (100 - pad * 2);
    const y = pad + ((maxLat - lat) / latSpan) * (100 - pad * 2);

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const polylinePoints = validStops
    .map((s) => {
      const pt = toMapPercent(s.lat, s.lng);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div
      ref={mapContainerRef}
      className="itinerary-map-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #1b2433 0%, #0d131f 100%)',
        border: '1px solid rgba(200, 142, 68, 0.3)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Top Map Status Ribbon */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 12px',
            borderRadius: '9999px',
            color: '#FAF7F2',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#C88E44' }}>🗺️</span>
          <span>
            {routeResult?.metadata?.provider || 'TomTom / PostGIS Dynamic Route'}
          </span>
          {routeResult?.totalDistanceKm ? (
            <span style={{ color: '#C88E44', marginLeft: '4px' }}>
              • {routeResult.totalDistanceKm} km • ~{Math.floor((routeResult.totalDurationMinutes || 0) / 60)}h{' '}
              {(routeResult.totalDurationMinutes || 0) % 60}m
            </span>
          ) : null}
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 12px',
            borderRadius: '9999px',
            color: '#FAF7F2',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <span>{validStops.length} Waypoints</span>
        </div>
      </div>

      {/* SVG Map Canvas with Routes & Waypoints */}
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background Grid Lines for Terrain Feel */}
        <defs>
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C88E44" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Route Shadow Polyline */}
        {validStops.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="rgba(0, 0, 0, 0.6)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Real Drawn Route Polyline */}
        {validStops.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            strokeDasharray="0"
          />
        )}
      </svg>

      {/* Interactive Sequenced Stop Markers */}
      {validStops.map((stop) => {
        const pt = toMapPercent(stop.lat, stop.lng);
        const isSelected = activeStopId === stop.id;
        const isHovered = hoveredStop === stop.id;

        return (
          <div
            key={stop.id}
            onClick={() => onSelectStop?.(stop.id)}
            onMouseEnter={() => setHoveredStop(stop.id)}
            onMouseLeave={() => setHoveredStop(null)}
            style={{
              position: 'absolute',
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected || isHovered ? 25 : 15,
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            title={`${stop.name} (Day ${stop.dayNumber})`}
          >
            {/* Pulsing Active Ring */}
            {isSelected && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  background: 'rgba(200, 142, 68, 0.35)',
                  animation: 'pulse 1.8s infinite',
                }}
              />
            )}

            {/* Pin Badge */}
            <div
              style={{
                width: isSelected || isHovered ? '36px' : '30px',
                height: isSelected || isHovered ? '36px' : '30px',
                borderRadius: '50%',
                background: stop.isCompleted
                  ? '#16a34a'
                  : isSelected
                  ? '#C88E44'
                  : '#2D1B14',
                color: '#ffffff',
                border: '2px solid #FAF7F2',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: isSelected || isHovered ? '0.9rem' : '0.75rem',
              }}
            >
              {stop.isCompleted ? '✓' : stop.sequenceNumber}
            </div>

            {/* Stop Label Tooltip */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '4px',
                background: 'rgba(15, 23, 42, 0.92)',
                color: '#FAF7F2',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                pointerEvents: 'none',
                opacity: isSelected || isHovered ? 1 : 0.85,
              }}
            >
              Day {stop.dayNumber}: {stop.name}
            </div>
          </div>
        );
      })}

      {/* Nearby Places Pins (Yellow Outlines) */}
      {nearbyPlaces.slice(0, 4).map((nb) => {
        const pt = toMapPercent(nb.lat, nb.lng);
        return (
          <div
            key={`nb-${nb.id}`}
            style={{
              position: 'absolute',
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 12,
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1.5px dashed #C88E44',
                color: '#C88E44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title={`Nearby Attraction: ${nb.name}`}
            >
              +
            </div>
          </div>
        );
      })}

      {/* Bottom Map Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          right: '14px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '8px 14px',
          borderRadius: '12px',
          color: '#FAF7F2',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C88E44', display: 'inline-block' }} />
            Active Route
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Completed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px dashed #C88E44', display: 'inline-block' }} />
            Nearby
          </span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.7)' }}>
          Lat: {centerLat.toFixed(2)}°, Lng: {centerLng.toFixed(2)}°
        </span>
      </div>
    </div>
  );
}
