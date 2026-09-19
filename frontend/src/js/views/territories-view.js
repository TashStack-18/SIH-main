/**
 * 🇮🇳 BHARAT SAFE YATRA — 8 UNION TERRITORIES DIRECTORY
 * Phase 6 Explorer View
 */

import { TERRITORIES } from '../data/territories.js';

export function renderTerritoriesView() {
  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-official" style="width: fit-content;">8 Union Territories of India</span>
        <h1>Explore Bharat's Union Territories</h1>
        <p class="lead-text">
          Discover the unique geographical, cultural, and architectural heritage of India's 8 Union Territories with verified government intelligence.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: var(--space-xl);">
        ${TERRITORIES.map((ut, idx) => `
          <article class="card card-hoverable" style="display: flex; flex-direction: column;">
            
            <div style="position: relative; height: 240px; overflow: hidden;">
              <img src="${ut.heroImage}" alt="${ut.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
              <div style="position: absolute; top: 12px; left: 12px;">
                <span class="badge badge-verified">✓ UT ${idx + 1} of 8</span>
              </div>
              <div style="position: absolute; bottom: 12px; right: 12px;">
                <span class="badge badge-neutral" style="background: rgba(15,23,42,0.7); color: #ffffff; backdrop-filter: blur(8px);">
                  Capital: ${ut.capital}
                </span>
              </div>
            </div>

            <div style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
              <h2 style="font-size: 1.45rem; margin-bottom: 6px;">${ut.name}</h2>
              <p style="font-size: 0.875rem; color: var(--color-primary); font-weight: 600; margin-bottom: 12px;">${ut.tagline}</p>
              <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.55; margin-bottom: var(--space-md); flex-grow: 1;">
                ${ut.shortDescription}
              </p>

              <div style="margin-bottom: var(--space-md); background: var(--color-bg-surface-elevated); padding: 10px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 4px;">Key Destinations</div>
                <div style="font-size: 0.825rem; font-weight: 600; color: var(--color-text-primary);">
                  ${ut.popularDestinations.slice(0, 4).join(" • ")}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--color-border-subtle);">
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted);">
                  Best: ${ut.weatherSnapshot.bestMonths}
                </div>
                <a href="#/territories/${ut.slug}" class="btn btn-sm btn-primary">
                  Explore Territory →
                </a>
              </div>
            </div>

          </article>
        `).join('')}
      </div>

    </main>
  `;
}
