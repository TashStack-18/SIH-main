'use client';

/**
 * 🇮🇳 DISHAARA — GLOBAL LIVE TRAVEL ALERT COMPONENT
 *
 * Event-driven floating notification system:
 * - Completely INVISIBLE during normal conditions (zero DOM, no empty container)
 * - Available globally across every page/view via root mounting
 * - Desktop: Fixed bottom-right notification card stacked neatly above floating FABs
 * - Mobile: Responsive bottom sheet / notification banner
 * - Deterministic relevance & official government source transparency
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTravelAlert } from '@/src/context/TravelAlertContext';
import { TravelAlertDetailsModal } from './TravelAlertDetailsModal';

export function GlobalTravelAlert() {
  const router = useRouter();
  const {
    currentAlert,
    currentEvaluation,
    dismissAlert,
    totalRelevantCount,
    openAlertDetails,
  } = useTravelAlert();

  // NORMAL STATE: Render absolutely nothing if no active relevant alert exists
  if (!currentAlert) {
    return <TravelAlertDetailsModal />;
  }

  const alert = currentAlert;

  const getSeverityTheme = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          cardBg: '#FFFFFF',
          darkCardBg: '#1C1917',
          accent: '#DC2626',
          badgeBg: '#DC2626',
          badgeText: '#FFFFFF',
          borderColor: 'rgba(220, 38, 38, 0.4)',
          glow: '0 12px 36px rgba(220, 38, 38, 0.25)',
          ariaLive: 'assertive' as const,
        };
      case 'WARNING':
        return {
          cardBg: '#FFFFFF',
          darkCardBg: '#1C1917',
          accent: '#D97706',
          badgeBg: '#D97706',
          badgeText: '#FFFFFF',
          borderColor: 'rgba(217, 119, 6, 0.4)',
          glow: '0 12px 36px rgba(217, 119, 6, 0.2)',
          ariaLive: 'polite' as const,
        };
      case 'ADVISORY':
        return {
          cardBg: '#FFFFFF',
          darkCardBg: '#1C1917',
          accent: '#2563EB',
          badgeBg: '#2563EB',
          badgeText: '#FFFFFF',
          borderColor: 'rgba(37, 99, 235, 0.35)',
          glow: '0 12px 36px rgba(37, 99, 235, 0.18)',
          ariaLive: 'polite' as const,
        };
      default:
        return {
          cardBg: '#FFFFFF',
          darkCardBg: '#1C1917',
          accent: '#475569',
          badgeBg: '#475569',
          badgeText: '#FFFFFF',
          borderColor: 'rgba(71, 85, 105, 0.3)',
          glow: '0 12px 36px rgba(0, 0, 0, 0.12)',
          ariaLive: 'polite' as const,
        };
    }
  };

  const theme = getSeverityTheme(alert.severity);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissAlert(alert.alert_id);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alert.affected_coordinates) {
      router.push(`/map?alertId=${alert.alert_id}&lat=${alert.affected_coordinates.lat}&lng=${alert.affected_coordinates.lng}`);
    } else {
      router.push(`/map?alertId=${alert.alert_id}`);
    }
  };

  const handleOpenDetails = () => {
    openAlertDetails(alert);
  };

  return (
    <>
      <div
        role="alert"
        aria-live={theme.ariaLive}
        className="dishaara-global-alert-container"
        style={{
          position: 'fixed',
          zIndex: 99990,
        }}
      >
        <div
          className="dishaara-alert-card"
          onClick={handleOpenDetails}
          style={{
            cursor: 'pointer',
            backgroundColor: 'var(--color-bg-surface-elevated, #FFFFFF)',
            color: 'var(--color-text-primary, #0F172A)',
            border: `1.5px solid ${theme.borderColor}`,
            borderRadius: '16px',
            boxShadow: theme.glow,
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {/* Top Severity Accent Strip */}
          <div style={{ height: '4px', width: '100%', backgroundColor: theme.accent }} />

          <div style={{ padding: '16px 18px' }}>
            {/* Header: Icon + Category + Badge + Dismiss */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }} aria-hidden="true">
                  ⚠
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: theme.accent,
                  }}
                >
                  TRAVEL ALERT
                </span>
                <span
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.03em',
                  }}
                >
                  {alert.severity}
                </span>
              </div>

              <button
                onClick={handleDismiss}
                aria-label="Dismiss travel alert"
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                  color: 'var(--color-text-muted, #64748B)',
                  transition: 'background 0.15s ease',
                }}
              >
                ×
              </button>
            </div>

            {/* Alert Title */}
            <div
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--color-text-primary, #0F172A)',
                marginBottom: '6px',
              }}
            >
              {alert.title}
            </div>

            {/* Short Situation Description */}
            <p
              style={{
                fontSize: '0.84rem',
                lineHeight: 1.45,
                color: 'var(--color-text-secondary, #475569)',
                margin: '0 0 10px 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {alert.short_message || alert.message}
            </p>

            {/* Relevance Reason Badge */}
            {currentEvaluation?.matchReason && (
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: theme.accent,
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  borderLeft: `3px solid ${theme.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📍</span>
                <span>{currentEvaluation.matchReason}</span>
              </div>
            )}

            {/* Official Source Transparency */}
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted, #64748B)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '14px',
              }}
            >
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Verified by {alert.source_name}
              </span>
            </div>

            {/* Action Buttons & Multi-Alert Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleOpenDetails}
                  style={{
                    backgroundColor: 'var(--color-brand-primary, #0F172A)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Alert
                </button>

                <button
                  type="button"
                  onClick={handleViewOnMap}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary, #0F172A)',
                    border: '1px solid var(--color-border-subtle, rgba(0,0,0,0.15))',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>🗺</span>
                  <span>View on Map</span>
                </button>
              </div>

              {totalRelevantCount > 1 && (
                <button
                  type="button"
                  onClick={handleOpenDetails}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: theme.accent,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  +{totalRelevantCount - 1} more alert{totalRelevantCount - 1 > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <TravelAlertDetailsModal />

      {/* Global CSS for Desktop Bottom-Right Float + Mobile Bottom Sheet */}
      <style>{`
        .dishaara-global-alert-container {
          bottom: 84px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          animation: dishaaraAlertEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dishaara-alert-card:hover {
          transform: translateY(-2px);
        }

        @keyframes dishaaraAlertEntrance {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Viewport Adaptation */
        @media (max-width: 640px) {
          .dishaara-global-alert-container {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            padding: 0 !important;
            animation: dishaaraAlertMobileEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .dishaara-alert-card {
            border-radius: 16px 16px 0 0 !important;
            border-bottom: none !important;
            border-left: none !important;
            border-right: none !important;
            padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2) !important;
          }

          @keyframes dishaaraAlertMobileEntrance {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </>
  );
}
