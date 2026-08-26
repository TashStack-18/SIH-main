/**
 * 🇮🇳 BHARAT SAFE YATRA — SAFETY & EMERGENCY CENTER VIEW
 * Verified Life Safety Intelligence, Active Travel Advisories & Emergency Directory
 */

import { EMERGENCY_NATIONAL_CONTACTS, EMERGENCY_FACILITIES, ACTIVE_TRAVEL_ADVISORIES } from '../data/safety.js';
import { store } from '../stores/store.js';

export function renderSafetyView() {
  return `
    <main class="container section-spacing" role="main">
      
      <!-- Safety Center Header -->
      <div class="section-header">
        <span class="badge badge-danger" style="width: fit-content;">Life Safety Architecture</span>
        <h1>Safety Center & Emergency Hub</h1>
        <p class="lead-text">
          Instant access to verified 24x7 trauma centers, national emergency helplines, maritime rescue, and official travel advisories across India's 8 Union Territories.
        </p>
      </div>

      <!-- High-Priority SOS Action Banner -->
      <section style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #f87171; border-radius: var(--radius-xl); padding: var(--space-2xl); margin-bottom: var(--space-3xl); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-lg); box-shadow: var(--shadow-sos);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="status-dot status-dot-live" style="background: #dc2626;"></span>
            <span style="font-weight: 800; font-size: 0.85rem; color: #991b1b; text-transform: uppercase;">Real-Time Emergency Assistance</span>
          </div>
          <h2 style="color: #991b1b; font-size: 1.8rem; margin-bottom: 8px;">Need Immediate Emergency Help?</h2>
          <p style="color: #7f1d1d; font-size: 0.95rem; max-width: 680px; line-height: 1.5;">
            Triggering SOS automatically pinpoints your location, pulls the nearest verified hospital and police post, and enables single-tap emergency calling.
          </p>
        </div>

        <div>
          <button class="btn btn-emergency btn-lg" id="safety-page-sos-btn" style="font-size: 1.15rem; padding: 1rem 2rem;">
            🚨 Trigger Emergency SOS
          </button>
        </div>
      </section>

      <!-- National Emergency Numbers Directory -->
      <section style="margin-bottom: var(--space-3xl);">
        <h2 style="font-size: 1.4rem; margin-bottom: var(--space-md);">All-India Official Emergency Helplines</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-md);">
          ${EMERGENCY_NATIONAL_CONTACTS.map(c => `
            <a href="tel:${c.number}" class="card card-hoverable" style="padding: var(--space-lg); border-left: 4px solid var(--color-primary); text-decoration: none;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">${c.category}</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin: 2px 0;">${c.number}</div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-text-primary); margin-bottom: 4px;">${c.service}</div>
              <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${c.description}</div>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Active Travel Advisories -->
      <section style="margin-bottom: var(--space-3xl);">
        <h2 style="font-size: 1.4rem; margin-bottom: var(--space-md);">Active Government Travel Advisories</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: var(--space-lg);">
          ${ACTIVE_TRAVEL_ADVISORIES.map(adv => `
            <div class="card" style="padding: var(--space-lg); border-left: 4px solid ${adv.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge ${adv.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}">${adv.severity} Severity</span>
                <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted);">${adv.territoryName}</span>
              </div>
              <h3 style="font-size: 1.15rem; margin-bottom: 6px;">${adv.title}</h3>
              <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 12px;">
                ${adv.summary}
              </p>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); padding-top: 8px; border-top: 1px solid var(--color-border-subtle);">
                Official Source: ${adv.officialSource}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Verified 24x7 Emergency Facilities Directory -->
      <section>
        <div class="section-header-row">
          <div>
            <h2>Verified 24x7 Emergency Medical Facilities</h2>
            <p class="sub-text">Apex trauma centers and district hospitals equipped with ICU, decompression, or high-altitude units.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-lg);">
          ${EMERGENCY_FACILITIES.map(ef => `
            <article class="card" style="padding: var(--space-lg); display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge badge-verified">✓ ${ef.type}</span>
                <span class="badge badge-neutral" style="font-size: 0.65rem;">${ef.territoryName}</span>
              </div>

              <h3 style="font-size: 1.15rem; margin-bottom: 4px; color: var(--color-text-primary);">${ef.name}</h3>
              <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 10px;">${ef.address}</div>

              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px;">
                ${ef.services.map(s => `
                  <span class="badge badge-neutral" style="font-size: 0.65rem;">${s}</span>
                `).join('')}
              </div>

              <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <a href="tel:${ef.emergencyPhone || ef.phone}" class="btn btn-sm btn-emergency">
                  📞 Call (${ef.phone})
                </a>
                <a href="#/map" class="btn btn-sm btn-outline">
                  📍 Locate on Map
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

    </main>
  `;
}

export function attachSafetyEvents() {
  const sosBtn = document.getElementById('safety-page-sos-btn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      store.toggleSOS(true);
    });
  }
}
