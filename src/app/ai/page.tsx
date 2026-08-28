'use client';

import React, { Suspense } from 'react';
import { YatraAiWorkspace } from '@/src/app/components/ai/YatraAiWorkspace';

export default function AIPage() {
  return (
    <main className="container section-spacing" role="main" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Breadcrumb & Page Introduction */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
          <span className="badge badge-verified" style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
            🇮🇳 Bharat Safe Yatra
          </span>
          <span className="badge badge-neutral" style={{ background: 'var(--color-brand-accent-light)', color: 'var(--color-text-primary)' }}>
            Yatra AI 2.0
          </span>
        </div>

        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
          Yatra AI Travel Companion
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Grounded tourism intelligence, route telemetry, and safety radar across India&apos;s 8 Union Territories.
        </p>
      </div>

      {/* Master Dual-Pane Workspace */}
      <Suspense
        fallback={
          <div
            className="card text-center"
            style={{
              minHeight: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-bg-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '8px' }}>🤖</span>
              Initializing Yatra AI Travel Workspace…
            </div>
          </div>
        }
      >
        <YatraAiWorkspace />
      </Suspense>

    </main>
  );
}
