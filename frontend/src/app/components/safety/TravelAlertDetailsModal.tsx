'use client';

/**
 * 🇮🇳 DISHAARA — TRAVEL ALERT DETAILS MODAL
 * Grounded in Official Government Data with Direct Authoritative Source Links
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelAlert } from '@/src/context/TravelAlertContext';

export function TravelAlertDetailsModal() {
  const router = useRouter();
  const { selectedAlertForDetails, closeAlertDetails, relevantAlerts, openAlertDetails } = useTravelAlert();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAlertDetails();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAlertDetails]);

  if (!selectedAlertForDetails) return null;

  const alert = selectedAlertForDetails;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { bg: '#FEF2F2', text: '#991B1B', border: '#F87171', badgeBg: '#DC2626' };
      case 'WARNING':
        return { bg: '#FFFBEB', text: '#92400E', border: '#FBBF24', badgeBg: '#D97706' };
      case 'ADVISORY':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#93C5FD', badgeBg: '#2563EB' };
      default:
        return { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1', badgeBg: '#64748B' };
    }
  };

  const style = getSeverityStyle(alert.severity);

  const handleViewOnMap = () => {
    closeAlertDetails();
    if (alert.affected_coordinates) {
      router.push(`/map?alertId=${alert.alert_id}&lat=${alert.affected_coordinates.lat}&lng=${alert.affected_coordinates.lng}`);
    } else {
      router.push(`/map?alertId=${alert.alert_id}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'alertFadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAlertDetails();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface-elevated, #FFFFFF)',
          color: 'var(--color-text-primary, #0F172A)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: `1px solid ${style.border}`,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border-subtle, rgba(0,0,0,0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: style.bg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: style.badgeBg,
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
              }}
            >
              {alert.severity}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: style.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {alert.category} ADVISORY
            </span>
          </div>

          <button
            onClick={closeAlertDetails}
            aria-label="Close alert details"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              lineHeight: 1,
              cursor: 'pointer',
              color: 'var(--color-text-muted, #64748B)',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
          <h2
            id="alert-modal-title"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '12px',
              color: 'var(--color-text-primary, #0F172A)',
            }}
          >
            {alert.title}
          </h2>

          {/* Verification Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#047857',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              marginBottom: '16px',
            }}
          >
            <span>✓</span>
            <span>VERIFIED GOVERNMENT NOTICE</span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary, #334155)',
              marginBottom: '20px',
            }}
          >
            {alert.message}
          </p>

          {/* Recommended Action */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle, rgba(0,0,0,0.03))',
              borderLeft: `4px solid ${style.badgeBg}`,
              padding: '14px 16px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: style.text, marginBottom: '4px' }}>
              RECOMMENDED TRAVEL ACTION
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--color-text-primary, #0F172A)' }}>
              {alert.recommended_action}
            </div>
          </div>

          {/* Date & Validity Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--color-bg-subtle, rgba(0,0,0,0.02))',
              border: '1px solid var(--color-border-subtle, rgba(0,0,0,0.06))',
              marginBottom: '20px',
              fontSize: '0.8rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted, #64748B)', display: 'block' }}>Effective From:</span>
              <strong>{new Date(alert.effective_from).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted, #64748B)', display: 'block' }}>Valid Until:</span>
              <strong>{new Date(alert.effective_until).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted, #64748B)', display: 'block' }}>Last Verified:</span>
              <strong>{new Date(alert.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
          </div>

          {/* Official Authority Source */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #64748B)', textTransform: 'uppercase', marginBottom: '6px' }}>
              OFFICIAL ISSUING AUTHORITY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{alert.source_name}</span>
              <a
                href={alert.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-brand-primary, #0284C7)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                View Official Source ↗
              </a>
            </div>
          </div>

          {/* Emergency Contacts */}
          {alert.emergency_contacts && alert.emergency_contacts.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #64748B)', textTransform: 'uppercase', marginBottom: '8px' }}>
                DIRECT EMERGENCY HELPLINES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {alert.emergency_contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--color-bg-subtle, rgba(0,0,0,0.03))',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{contact.label}</div>
                      {contact.description && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748B)' }}>{contact.description}</div>}
                    </div>
                    <a
                      href={`tel:${contact.number}`}
                      style={{
                        padding: '4px 12px',
                        background: 'var(--color-brand-primary, #0F172A)',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                      }}
                    >
                      📞 {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other relevant alerts switcher if multiple */}
          {relevantAlerts.length > 1 && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle, rgba(0,0,0,0.08))' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #64748B)', marginBottom: '8px' }}>
                OTHER ACTIVE TRAVEL ALERTS ({relevantAlerts.length - 1})
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {relevantAlerts
                  .filter((item) => item.alert.alert_id !== alert.alert_id)
                  .map((item) => (
                    <button
                      key={item.alert.alert_id}
                      onClick={() => openAlertDetails(item.alert)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border-subtle, rgba(0,0,0,0.15))',
                        background: 'transparent',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary, #0F172A)',
                        fontWeight: 600,
                      }}
                    >
                      {item.alert.title}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--color-border-subtle, rgba(0,0,0,0.08))',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'var(--color-bg-subtle, rgba(0,0,0,0.02))',
          }}
        >
          <button
            onClick={closeAlertDetails}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-border-subtle, rgba(0,0,0,0.15))',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary, #475569)',
            }}
          >
            Dismiss
          </button>
          <button
            onClick={handleViewOnMap}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-brand-primary, #0F172A)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🗺 View on Map
          </button>
        </div>
      </div>

      <style>{`
        @keyframes alertFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
