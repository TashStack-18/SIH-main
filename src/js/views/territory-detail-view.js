/**
 * 🇮🇳 BHARAT SAFE YATRA — TERRITORY DETAIL VIEW
 * Editorial Deep-Dive into Individual Union Territory
 */

import { TERRITORIES } from '../data/territories.js';
import { DESTINATIONS } from '../data/destinations.js';
import { FESTIVALS } from '../data/festivals.js';

export function renderTerritoryDetailView(slug) {
  const territory = TERRITORIES.find(t => t.slug === slug) || TERRITORIES[0];
  const relatedDestinations = DESTINATIONS.filter(d => d.territoryId === territory.id);
  const relatedFestivals = FESTIVALS.filter(f => f.territoryId === territory.id);

  return `
    <main role="main">
      
      <!-- Territory Hero Banner -->
      <section style="position: relative; min-height: 440px; background-image: url('${territory.heroImage}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; color: #ffffff;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 90%);"></div>
        
        <div class="container" style="position: relative; z-index: var(--z-base); padding-top: var(--space-3xl); padding-bottom: var(--space-2xl);">
          <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
            <a href="#/territories" style="color: rgba(255,255,255,0.8); font-size: 0.85rem; font-weight: 600;">← All Territories</a>
            <span>•</span>
            <span class="badge badge-verified">✓ 100% Phase 5 Verified</span>
            <span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff;">Capital: ${territory.capital}</span>
          </div>

          <h1 style="color: #ffffff; font-size: clamp(2.2rem, 5vw, 3.5rem); margin-bottom: 8px;">${territory.name}</h1>
          <p style="font-size: 1.2rem; color: var(--brand-terracotta-500); font-weight: 600; max-width: 780px;">${territory.tagline}</p>
        </div>
      </section>

      <!-- Main Content Layout -->
      <div class="container section-spacing">
        <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
          
          <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
            
            <!-- Overview & Description -->
            <section class="card" style="padding: var(--space-xl);">
              <h2 style="font-size: 1.5rem; margin-bottom: 12px;">About ${territory.name}</h2>
              <p class="lead-text" style="margin-bottom: 16px;">${territory.description}</p>
              
              <!-- Quick Stats Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg); background: var(--color-bg-surface-elevated); padding: var(--space-lg); border-radius: var(--radius-md);">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Administrative Capital</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary);">${territory.capital}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Best Travel Season</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary);">${territory.weatherSnapshot.bestMonths}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Current Climate</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary);">${territory.weatherSnapshot.temp}°C • ${territory.weatherSnapshot.condition}</div>
                </div>
              </div>
            </section>

            <!-- Key Destinations in this UT -->
            <section>
              <div class="section-header-row">
                <div>
                  <h2>Key Verified Destinations in ${territory.shortName}</h2>
                  <p class="sub-text">Explore featured places with complete coordinates, cultural highlights, and safety rules.</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
                ${relatedDestinations.map(d => `
                  <div class="destination-card card-hoverable">
                    <div class="destination-card-media">
                      <img src="${d.image}" alt="${d.name}" class="destination-card-img" loading="lazy" />
                      <div class="destination-card-badges">
                        <span class="badge badge-verified">${d.type}</span>
                      </div>
                    </div>
                    <div class="destination-card-body">
                      <h3 class="destination-card-title">${d.name}</h3>
                      <p class="destination-card-desc">${d.shortDescription}</p>
                      <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted);">${d.weather.bestTime}</span>
                        <a href="#/destinations/${d.slug}" class="btn btn-sm btn-outline">Explore Place →</a>
                      </div>
                    </div>
                  </div>
                `).join('')}

                ${relatedDestinations.length === 0 ? `
                  <div class="card" style="padding: var(--space-xl); text-align: center; color: var(--color-text-muted);">
                    <p style="font-weight: 600;">Explore popular destinations catalog for ${territory.name}.</p>
                    <a href="#/destinations" class="btn btn-sm btn-primary" style="margin-top: 8px;">Browse All Destinations</a>
                  </div>
                ` : ''}
              </div>
            </section>

            <!-- Signature Experiences -->
            <section class="card" style="padding: var(--space-xl);">
              <h2 style="font-size: 1.4rem; margin-bottom: 16px;">Signature Experiences</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-md);">
                ${territory.signatureExperiences.map(exp => `
                  <div style="display: flex; align-items: flex-start; gap: 10px; background: var(--color-bg-surface-elevated); padding: 12px 16px; border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
                    <span style="font-size: 1.2rem;">✨</span>
                    <span style="font-size: 0.9rem; font-weight: 600; color: var(--color-text-primary);">${exp}</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- Emergency Contacts & Official Authority -->
            <section class="card" style="padding: var(--space-xl); background: var(--color-bg-surface-elevated); border-left: 4px solid var(--color-emergency);">
              <h3 style="color: var(--color-emergency); margin-bottom: 8px;">Verified Emergency Support for ${territory.name}</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-md); margin-bottom: 16px;">
                ${territory.emergencyContacts.map(c => `
                  <div style="background: var(--color-bg-surface); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle);">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">${c.name}</div>
                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-emergency);">${c.number}</div>
                  </div>
                `).join('')}
              </div>

              ${territory.advisories && territory.advisories.length > 0 ? `
                <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: var(--radius-sm); padding: 12px; font-size: 0.85rem; color: #92400e;">
                  <strong>⚠️ Official Travel Advisory:</strong> ${territory.advisories[0]}
                </div>
              ` : ''}

              <div style="margin-top: 16px; font-size: 0.8rem; color: var(--color-text-muted);">
                Official Portal: <a href="${territory.officialPortal}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">${territory.officialPortal} ↗</a>
              </div>
            </section>

          </div>

        </div>
      </div>

    </main>
  `;
}
