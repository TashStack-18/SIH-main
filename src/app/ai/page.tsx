'use client';

import React, { Suspense } from 'react';
import { YatraAiWorkspace } from '@/src/app/components/ai/YatraAiWorkspace';

export default function AIPage() {
  return (
    <main className="container section-spacing" role="main" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Breadcrumb & Page Introduction */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
          <span className="badge badge-verified" style={{ background: '#2D1B14', color: '#ffffff' }}>
            🇮🇳 Bharat Safe Yatra
          </span>
          <span className="badge badge-neutral" style={{ background: 'rgba(200, 142, 68, 0.2)', color: '#2D1B14' }}>
            Yatra AI 2.0
          </span>
        </div>

        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#2D1B14', margin: '0 0 4px' }}>
          Yatra AI Travel Companion
        </h1>
        <p style={{ color: '#4A3C31', fontSize: '0.95rem', margin: 0 }}>
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
              background: 'var(--stitch-surface-variant, #F0EADE)',
              border: '1px solid rgba(200, 142, 68, 0.35)',
            }}
          >
            <div style={{ color: '#2D1B14', fontWeight: 700 }}>
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
