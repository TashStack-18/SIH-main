'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VERIFIED_TERRITORIES } from '@/src/lib/fixtures';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const quickLinks = [
    { label: 'All Verified Destinations', href: '/destinations' },
    { label: 'Bookings & Experiences', href: '/bookings' },
    { label: 'Smart Itinerary AI', href: '/itinerary' },
    { label: 'Interactive 3D Map', href: '/map' },
    { label: '2026 Cultural Festivals', href: '/festivals' },
    { label: 'Dishaara AI Companion', href: '/ai' },
    { label: 'Safety & Emergency Hub', href: '/safety' },
  ];

  return (
    <footer
      className="footer relative overflow-hidden"
      role="contentinfo"
      style={{
        background: 'linear-gradient(180deg, var(--color-bg-canvas) 0%, var(--color-bg-surface-elevated) 100%)',
        borderTop: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-secondary)',
        padding: 'clamp(48px, 6vw, 72px) 0 32px',
        marginTop: 'auto',
      }}
    >
      <div className="container relative z-10" style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '0 24px' }}>
        
        {/* ============================================================
            1. PRE-FOOTER NEWSLETTER / TRAVEL ADVISORY BANNER
            ============================================================ */}
        <div
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl, 24px)',
            padding: 'clamp(24px, 4vw, 36px)',
            marginBottom: 'clamp(40px, 5vw, 56px)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ flex: '1 1 380px' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-brand-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}
            >
              Travel Intelligence
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-family-serif)',
                fontSize: 'clamp(1.25rem, 2.2vw, 1.65rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.25,
                margin: '0 0 6px',
              }}
            >
              Real-Time Insights for Your Next Journey
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Receive verified travel advisories, seasonal highlights, and cultural festival guides across all 8 Union Territories.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            style={{
              flex: '1 1 320px',
              maxWidth: '480px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for travel alerts"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  border: '1px solid var(--color-border-medium, #D3C9BD)',
                  background: 'var(--color-bg-canvas)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-accent)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 142, 68, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-medium, #D3C9BD)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'var(--color-brand-accent)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill, 9999px)',
                padding: '12px 22px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(200, 142, 68, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {subscribed ? 'Subscribed' : 'Get Alerts'}
            </button>
          </form>
        </div>

        {/* ============================================================
            2. MAIN 4-COLUMN FOOTER GRID
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(32px, 4vw, 48px)',
            marginBottom: 'clamp(40px, 5vw, 56px)',
          }}
        >
          {/* Column 1: Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <BrandLogo size="md" />
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Preserving cultural legacies and securing journeys across India&apos;s 8 Union Territories with verified government intelligence, geospatial navigation, and 24/7 AI-backed safety.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: 'rgba(200, 142, 68, 0.12)',
                  color: 'var(--color-brand-accent)',
                  border: '1px solid rgba(200, 142, 68, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill, 9999px)',
                }}
              >
                8 Union Territories
              </span>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: 'rgba(22, 163, 74, 0.12)',
                  color: 'var(--color-success, #16A34A)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill, 9999px)',
                }}
              >
                Verified Safety Grid
              </span>
            </div>
          </div>

          {/* Column 2: 8 Union Territories */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-primary)',
              }}
            >
              8 Union Territories
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {VERIFIED_TERRITORIES.map((ut) => (
                <Link
                  key={ut.id}
                  href={`/destinations?ut=${ut.slug}`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.15s ease',
                    padding: '2px 0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-brand-accent)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {ut.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Navigation & Services */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-primary)',
              }}
            >
              Platform & Tools
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'all 0.15s ease',
                      padding: '2px 0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-brand-accent)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Emergency Helplines & Direct Calling */}
          <div>
            <h4
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-danger, #DC2626)',
              }}
            >
              Emergency Helplines
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* National Emergency 112 */}
              <a
                href="tel:112"
                style={{
                  background: 'var(--color-bg-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg, 14px)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DC2626';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    National Emergency (All UTs)
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-danger, #DC2626)', lineHeight: 1.1, marginTop: '2px' }}>
                    112
                  </div>
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: 'var(--color-danger, #DC2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </a>

              {/* Tourist Helpline 1363 */}
              <a
                href="tel:1363"
                style={{
                  background: 'var(--color-bg-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg, 14px)',
                  border: '1px solid var(--color-border-subtle)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-accent)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(200, 142, 68, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    24x7 Tourist Helpline
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1, marginTop: '2px' }}>
                    1363
                  </div>
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(200, 142, 68, 0.12)',
                    color: 'var(--color-brand-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </a>


              {/* Women Helpline 1091 */}
              <a
                href="tel:1091"
                style={{
                  background: 'var(--color-bg-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg, 14px)',
                  border: '1px solid rgba(147, 51, 234, 0.25)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#9333EA';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(147, 51, 234, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.25)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Women Helpline
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#9333EA', lineHeight: 1.1, marginTop: '2px' }}>
                    1091
                  </div>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(147, 51, 234, 0.1)', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </a>

              {/* Childline 1098 */}
              <a
                href="tel:1098"
                style={{
                  background: 'var(--color-bg-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg, 14px)',
                  border: '1px solid rgba(234, 88, 12, 0.25)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#EA580C';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(234, 88, 12, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(234, 88, 12, 0.25)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Childline
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#EA580C', lineHeight: 1.1, marginTop: '2px' }}>
                    1098
                  </div>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </a>

              {/* System Relay Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.725rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    boxShadow: '0 0 6px #16A34A',
                    display: 'inline-block',
                  }}
                />
                <span>Safety Network Online (Response &lt; 3s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            3. COPYRIGHT, TRUST SIGNALS & LEGAL LINKS
            ============================================================ */}
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.825rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            © 2026 <strong>Dishaara</strong>. Built for Bharat Safe Yatra Initiative.
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link
              href="/privacy"
              style={{ textDecoration: 'none', color: 'var(--color-text-muted)', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              Privacy Policy
            </Link>
            <Link
              href="/privacy"
              style={{ textDecoration: 'none', color: 'var(--color-text-muted)', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              Terms of Service
            </Link>
            <Link
              href="/safety"
              style={{ textDecoration: 'none', color: 'var(--color-text-muted)', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              Safety Protocols
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
