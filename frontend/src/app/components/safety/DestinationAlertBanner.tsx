'use client';

/**
 * 🇮🇳 DISHAARA — CONTEXTUAL DESTINATION ALERT BANNER
 *
 * Appears ONLY when the actively viewed destination is subject to a verified active emergency.
 * Remains 100% invisible during normal conditions (returns null).
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelAlert } from '@/src/context/TravelAlertContext';

interface DestinationAlertBannerProps {
  destinationSlug: string;
  territoryId: string;
}

export function DestinationAlertBanner({ destinationSlug, territoryId }: DestinationAlertBannerProps) {
  const router = useRouter();
  const { relevantAlerts, openAlertDetails, updateTravelContext } = useTravelAlert();

  // Notify context of current destination slug
  useEffect(() => {
    updateTravelContext({
      currentViewedDestinationSlug: destinationSlug,
      selectedDestinationId: destinationSlug,
    });

    return () => {
      updateTravelContext({
        currentViewedDestinationSlug: null,
      });
    };
  }, [destinationSlug, updateTravelContext]);

  // Find if any relevant alert specifically matches this destination
  const matchedItem = relevantAlerts.find((item) => {
    const alert = item.alert;
    const destNorm = destinationSlug.toLowerCase();
    const terrNorm = territoryId.toLowerCase();

    const matchesDest = alert.affected_destination_ids.some((d) => d.toLowerCase().includes(destNorm) || destNorm.includes(d.toLowerCase()));
    const matchesTerr = alert.affected_territory_ids.some((t) => t.toLowerCase().includes(terrNorm) || terrNorm.includes(t.toLowerCase()));

    return matchesDest || matchesTerr;
  });

  // Zero DOM if no active alert matches this destination
  if (!matchedItem) return null;

  const alert = matchedItem.alert;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { bg: '#FEF2F2', border: '#F87171', text: '#991B1B', badgeBg: '#DC2626' };
      case 'WARNING':
        return { bg: '#FFFBEB', border: '#FBBF24', text: '#92400E', badgeBg: '#D97706' };
      case 'ADVISORY':
        return { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF', badgeBg: '#2563EB' };
      default:
        return { bg: '#F8FAFC', border: '#CBD5E1', text: '#334155', badgeBg: '#64748B' };
    }
  };

  const style = getSeverityStyle(alert.severity);

  return (
    <div
      role="alert"
      style={{
        backgroundColor: style.bg,
        border: `1.5px solid ${style.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚠</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: style.text }}>
            ACTIVE TRAVEL ADVISORY — {alert.category}
          </span>
          <span
            style={{
              backgroundColor: style.badgeBg,
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {alert.severity}
          </span>
        </div>

        <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
          ✓ Verified by {alert.source_name}
        </span>
      </div>

      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary, #0F172A)' }}>
        {alert.title}
      </div>

      <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--color-text-secondary, #334155)' }}>
        {alert.short_message || alert.message}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
        <div style={{ fontSize: '0.8rem', color: style.text, fontWeight: 600 }}>
          Recommended: {alert.recommended_action}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => openAlertDetails(alert)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-brand-primary, #0F172A)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View Official Details
          </button>
          <button
            type="button"
            onClick={() => {
              if (alert.affected_coordinates) {
                router.push(`/map?alertId=${alert.alert_id}&lat=${alert.affected_coordinates.lat}&lng=${alert.affected_coordinates.lng}`);
              } else {
                router.push(`/map?alertId=${alert.alert_id}`);
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary, #0F172A)',
              border: `1px solid ${style.border}`,
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🗺 View on Map
          </button>
        </div>
      </div>
    </div>
  );
}
