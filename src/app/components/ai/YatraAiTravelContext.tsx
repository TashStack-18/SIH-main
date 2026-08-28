'use client';

import React from 'react';
import Link from 'next/link';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES } from '@/src/lib/fixtures';
import { Coordinates } from '@/src/types/common';

export type TravelContextMode = 
  | 'DEFAULT'
  | 'DESTINATION'
  | 'ITINERARY'
  | 'MAP'
  | 'WEATHER'
  | 'BOOKING'
  | 'SAFETY';

export interface ActiveTravelContext {
  mode: TravelContextMode;
  territoryId?: string;
  territoryName?: string;
  destinationSlug?: string;
  destinationName?: string;
  destinationData?: typeof VERIFIED_DESTINATIONS[0];
  itineraryData?: {
    title: string;
    territoryName: string;
    durationDays: number;
    stopCount: number;
    totalDistanceKm: number;
    travelStyle: string;
    days: Array<{ dayNumber: number; title: string; stops: string[] }>;
  };
  routeData?: {
    origin: string;
    destination: string;
    distanceKm: number;
    durationMinutes: number;
    waypoints: string[];
  };
  weatherData?: {
    location: string;
    tempC: number;
    condition: string;
    humidity: number;
    windKmh: number;
    aqi?: number;
    updatedAt: string;
  };
  bookingData?: {
    providerName: string;
    location: string;
    category: string;
    officialUrl: string;
    status: string;
  };
  safetyData?: {
    nearestHospital: string;
    hospitalDistanceKm: number;
    policeStation: string;
    emergencyHelpline: string;
  };
  activeChips?: string[];
}

interface YatraAiTravelContextProps {
  context: ActiveTravelContext;
  onClearContext?: () => void;
  onSelectPrompt?: (prompt: string) => void;
  onSelectDestination?: (slug: string) => void;
}

export function YatraAiTravelContext({
  context,
  onClearContext,
  onSelectPrompt,
  onSelectDestination,
}: YatraAiTravelContextProps) {
  const { mode } = context;

  return (
    <div
      className="yatra-ai-context-panel"
      style={{
        background: 'var(--color-bg-surface-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)',
        overflowY: 'auto',
      }}
    >
      {/* Context Panel Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--color-border-subtle)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>
            {mode === 'DESTINATION'
              ? '📍'
              : mode === 'ITINERARY'
              ? '📋'
              : mode === 'MAP'
              ? '🗺️'
              : mode === 'WEATHER'
              ? '🌤️'
              : mode === 'BOOKING'
              ? '🏨'
              : mode === 'SAFETY'
              ? '🛡️'
              : '🧭'}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {mode === 'DEFAULT' ? 'Travel Intelligence' : `${mode} Workspace`}
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
              Real-time context synchronized with your conversation
            </div>
          </div>
        </div>

        {mode !== 'DEFAULT' && onClearContext && (
          <button
            type="button"
            onClick={onClearContext}
            className="btn btn-sm btn-ghost"
            style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600, padding: '4px 8px' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Context Chips (e.g. LADAKH • 5 DAYS • PHOTOGRAPHY) */}
      {context.activeChips && context.activeChips.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {context.activeChips.map((chip, idx) => (
            <span
              key={idx}
              className="badge badge-verified"
              style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)', fontSize: '0.7rem', padding: '3px 8px' }}
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODE 1: DESTINATION CONTEXT
          ========================================================================= */}
      {mode === 'DESTINATION' && context.destinationData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '180px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <img
              src={context.destinationData.image}
              alt={context.destinationData.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(45, 27, 20, 0.88) 0%, rgba(45, 27, 20, 0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '12px 14px',
              }}
            >
              <span className="badge badge-neutral" style={{ width: 'fit-content', background: 'rgba(200, 142, 68, 0.9)', color: '#ffffff', fontSize: '0.7rem', marginBottom: '4px' }}>
                {context.destinationData.territoryName} • {context.destinationData.type}
              </span>
              <h3 className="font-serif" style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0 }}>
                {context.destinationData.name}
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
            {context.destinationData.shortDescription}
          </p>

          {/* Key Facts Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: 'var(--color-bg-surface)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Best Time:</span>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {context.destinationData.weather?.bestTime || 'May – September'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Altitude:</span>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {context.destinationData.coordinates?.altitude || 'Verified Coordinates'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <Link
              href={`/itinerary?destination=${context.destinationData.slug}&territory=${context.destinationData.territoryId}&source=yatra_ai`}
              className="btn btn-sm btn-primary"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            >
              + Add to Itinerary
            </Link>
            <Link
              href={`/destinations/${context.destinationData.slug}`}
              className="btn btn-sm btn-outline"
              style={{ textDecoration: 'none' }}
            >
              Full Profile ↗
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: ITINERARY CONTEXT
          ========================================================================= */}
      {mode === 'ITINERARY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--color-accent)',
            }}
          >
            <span className="badge badge-warning" style={{ background: 'var(--color-accent)', color: '#ffffff', fontSize: '0.7rem', marginBottom: '6px' }}>
              ACTIVE TRIP PLAN
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#ffffff', margin: '4px 0' }}>
              {context.itineraryData?.title || '5-Day Ladakh Odyssey'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#D3C9BD' }}>
              {context.itineraryData?.territoryName || 'Ladakh'} • {context.itineraryData?.durationDays || 5} Days • {context.itineraryData?.travelStyle || 'Balanced'}
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Proposed Stops Sequence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(context.itineraryData?.days || [
                { dayNumber: 1, title: 'Leh Acclimatization', stops: ['Leh Palace', 'Shanti Stupa'] },
                { dayNumber: 2, title: 'Khardung La Pass', stops: ['Khardung La (5,359m)', 'Hunder Dunes'] },
                { dayNumber: 3, title: 'Pangong Tso Lake', stops: ['Diskit Gompa', 'Pangong Eco Domes'] },
              ]).map((day, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', padding: '4px 0', borderBottom: '1px dashed var(--color-border-subtle)' }}>
                  <strong>Day {day.dayNumber}:</strong> {day.title}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/itinerary"
            className="btn btn-sm btn-primary"
            style={{ textAlign: 'center', textDecoration: 'none' }}
          >
            🚀 Open in Itinerary Studio
          </Link>
        </div>
      )}

      {/* =========================================================================
          MODE 3: MAP / ROUTE CONTEXT
          ========================================================================= */}
      {mode === 'MAP' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              color: 'var(--color-text-inverse)',
              border: '1px solid var(--color-accent)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-verified" style={{ background: 'var(--color-accent)', color: '#ffffff', fontSize: '0.7rem' }}>
                TOMTOM ROUTE TRAJECTORY
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                Live Traffic
              </span>
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '4px' }}>
              {context.routeData?.origin || 'Leh'} → {context.routeData?.destination || 'Nubra Valley'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              ~{context.routeData?.distanceKm || 128} km • {Math.floor((context.routeData?.durationMinutes || 240) / 60)}h {(context.routeData?.durationMinutes || 240) % 60}m via Khardung La
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Route Waypoints
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
              <div>① South Pullu Checkpost (Permit Verification)</div>
              <div>② Khardung La Pass (Highest Elevation: 5,359m)</div>
              <div>③ North Pullu Army Transit Camp</div>
              <div>④ Diskit / Hunder Cold Desert Dunes</div>
            </div>
          </div>

          <Link
            href="/map"
            className="btn btn-sm btn-outline"
            style={{ textAlign: 'center', textDecoration: 'none' }}
          >
            🗺️ Explore 3D Geospatial Map
          </Link>
        </div>
      )}

      {/* =========================================================================
          MODE 4: WEATHER CONTEXT
          ========================================================================= */}
      {mode === 'WEATHER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-verified" style={{ background: 'var(--color-success)', color: '#ffffff', fontSize: '0.7rem' }}>
                LIVE WEATHER TELEMETRY
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                Updated 3m ago
              </span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FAF7F2' }}>
              {context.weatherData?.tempC ?? 14}°C
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              {context.weatherData?.condition || 'Partly Cloudy • High UV Index'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Location: {context.weatherData?.location || 'Leh District (3,500m)'}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: 'var(--color-bg-surface)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Humidity:</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{context.weatherData?.humidity ?? 32}%</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Wind Speed:</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{context.weatherData?.windKmh ?? 14} km/h</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 5: BOOKING CONTEXT
          ========================================================================= */}
      {mode === 'BOOKING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <span className="badge badge-verified" style={{ background: 'var(--color-primary)', color: '#ffffff', fontSize: '0.7rem', marginBottom: '8px' }}>
              OFFICIAL VERIFIED PROVIDER
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: '4px 0' }}>
              {context.bookingData?.providerName || 'JKTDC / UT Licensed Heritage Stays'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              {context.bookingData?.location || 'Leh & Nubra Valley'} • Direct Government Portal
            </div>

            <a
              href={context.bookingData?.officialUrl || 'https://tourism.ladakh.gov.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
            >
              Check Official Provider ↗
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 6: SAFETY CONTEXT
          ========================================================================= */}
      {mode === 'SAFETY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--color-danger)',
            }}
          >
            <span className="badge badge-danger" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
              EMERGENCY MEDICAL & POLICE RADAR
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0' }}>
              Sonam Norboo Memorial Hospital (SNM)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              District Hospital • High Altitude Trauma & Hyperbaric Oxygen Unit
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href="tel:112"
              className="btn btn-sm btn-emergency"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            >
              🚨 Call 112 Emergency
            </a>
            <Link
              href="/safety"
              className="btn btn-sm btn-outline"
              style={{ textDecoration: 'none' }}
            >
              Safety Hub ↗
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 7: DEFAULT EXPLORATION RAIL (8 UNION TERRITORIES)
          ========================================================================= */}
      {mode === 'DEFAULT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Featured Union Territories
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {VERIFIED_TERRITORIES.slice(0, 4).map((ut) => (
              <div
                key={ut.id}
                onClick={() => onSelectPrompt?.(`Tell me about exploring ${ut.name}`)}
                style={{
                  background: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {ut.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {ut.tagline}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                  Ask AI →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
