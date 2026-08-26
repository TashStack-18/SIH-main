/**
 * 🇮🇳 BHARAT SAFE YATRA — DESTINATION DETAIL VIEW
 * Editorial Layout Grounded in Phase 5 Verified Tourism Intelligence
 */

import { DESTINATIONS } from '../data/destinations.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

export function renderDestinationDetailView(slug) {
  const dest = DESTINATIONS.find(d => d.slug === slug) || DESTINATIONS[0];
  const isSaved = store.getState().savedPlaces.includes(dest.id);

  return `
    <main role="main">
      
      <!-- Immersive Destination Hero -->
      <section style="position: relative; min-height: 520px; background-image: url('${dest.image}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; color: #ffffff;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 90%);"></div>
        
        <div class="container" style="position: relative; z-index: var(--z-base); padding-top: var(--space-4xl); padding-bottom: var(--space-2xl);">
          
          <!-- Breadcrumb Navigation -->
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; font-size: 0.85rem; flex-wrap: wrap;">
            <a href="#/destinations" style="color: rgba(255,255,255,0.8);">Destinations</a>
            <span>/</span>
            <a href="#/territories/${dest.territoryId.toLowerCase().replace(/_/g, '-')}" style="color: rgba(255,255,255,0.8);">${dest.territoryName}</a>
            <span>/</span>
            <span style="color: var(--brand-terracotta-500); font-weight: 600;">${dest.name}</span>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            <span class="badge badge-verified">✓ ${dest.type}</span>
            <span class="badge badge-official">${dest.source.name}</span>
            ${dest.coordinates.altitude ? `<span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff;">Altitude: ${dest.coordinates.altitude}</span>` : ''}
          </div>

          <h1 style="color: #ffffff; font-size: clamp(2.4rem, 6vw, 4rem); margin-bottom: 8px;">${dest.name}</h1>
          <p style="font-size: 1.25rem; color: rgba(255,255,255,0.92); max-width: 780px; margin-bottom: 24px;">${dest.tagline}</p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button class="btn btn-lg btn-secondary" id="dest-add-itinerary-btn">
              + Add to My Itinerary
            </button>
            <button class="btn btn-lg btn-outline" id="dest-bookmark-btn" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.4); backdrop-filter: blur(8px);">
              ${isSaved ? '★ Saved to Bookmarks' : '☆ Save Destination'}
            </button>
            <button class="btn btn-lg btn-outline" id="dest-share-btn" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.4); backdrop-filter: blur(8px);">
              🔗 Share
            </button>
          </div>

        </div>
      </section>

      <!-- Main Editorial Layout -->
      <div class="container section-spacing">
        <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
          
          <!-- Content Columns -->
          <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
            
            <!-- Overview & Why Visit -->
            <section class="card" style="padding: var(--space-xl);">
              <h2 style="font-size: 1.6rem; margin-bottom: 12px;">Overview</h2>
              <p class="lead-text" style="margin-bottom: 20px;">${dest.overview}</p>
              
              <div style="background: var(--color-bg-surface-elevated); border-left: 4px solid var(--color-primary); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-sm);">
                <h3 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 4px;">Why Visit</h3>
                <p style="font-size: 0.925rem; color: var(--color-text-secondary);">${dest.whyVisit}</p>
              </div>
            </section>

            <!-- Key Highlights -->
            <section class="card" style="padding: var(--space-xl);">
              <h2 style="font-size: 1.5rem; margin-bottom: 16px;">Key Highlights</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md);">
                ${dest.highlights.map(hl => `
                  <div style="display: flex; align-items: flex-start; gap: 10px; background: var(--color-bg-surface-elevated); padding: 12px 16px; border-radius: var(--radius-md);">
                    <span style="color: var(--color-primary); font-size: 1.2rem;">✦</span>
                    <span style="font-size: 0.9rem; font-weight: 600; color: var(--color-text-primary);">${hl}</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- Things To Do -->
            <section class="card" style="padding: var(--space-xl);">
              <h2 style="font-size: 1.5rem; margin-bottom: 16px;">Things To Do & Experiences</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg);">
                ${dest.thingsToDo.map(item => `
                  <div style="border: 1px solid var(--color-border-subtle); padding: var(--space-md); border-radius: var(--radius-md); background: var(--color-bg-surface);">
                    <h3 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 6px;">${item.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.5;">${item.desc}</p>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- Local Cuisine & Culture -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-xl);">
              
              <!-- Food & Cuisine -->
              <section class="card" style="padding: var(--space-xl);">
                <h3 style="font-size: 1.3rem; margin-bottom: 8px;">🍲 Local Gastronomy</h3>
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 14px;">${dest.food.overview}</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${dest.food.dishes.map(dish => `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; font-weight: 600; background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm);">
                      <span>•</span>
                      <span>${dish}</span>
                    </div>
                  `).join('')}
                </div>
              </section>

              <!-- Culture & Etiquette -->
              <section class="card" style="padding: var(--space-xl);">
                <h3 style="font-size: 1.3rem; margin-bottom: 8px;">🏛️ Culture & Etiquette</h3>
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 12px;"><strong>Tradition:</strong> ${dest.culture.traditions}</p>
                <div style="background: var(--color-bg-surface-elevated); padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--color-text-primary); border-left: 3px solid var(--brand-terracotta-600);">
                  <strong>Etiquette:</strong> ${dest.culture.etiquette}
                </div>
                <div style="margin-top: 10px; font-size: 0.8rem; color: var(--color-text-muted);">
                  Languages spoken: ${dest.culture.languages.join(", ")}
                </div>
              </section>

            </div>

            <!-- Climate, Safety & Permits Card -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-xl);">
              
              <!-- Weather -->
              <section class="card" style="padding: var(--space-xl);">
                <h3 style="font-size: 1.3rem; margin-bottom: 12px;">🌤️ Weather & Best Season</h3>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary); margin-bottom: 8px;">Best Period: ${dest.weather.bestTime}</div>
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 6px;">Summer: ${dest.weather.tempSummer}</p>
                ${dest.weather.tempWinter ? `<p style="font-size: 0.85rem; color: var(--color-text-secondary);">Winter: ${dest.weather.tempWinter}</p>` : ''}
                <div style="margin-top: 12px; font-size: 0.8rem; font-weight: 600; color: var(--color-success);">
                  ● Live Status: ${dest.weather.liveStatus}
                </div>
              </section>

              <!-- Safety & Permits -->
              <section class="card" style="padding: var(--space-xl); border-left: 4px solid ${dest.permits.required ? 'var(--color-warning)' : 'var(--color-primary)'};">
                <h3 style="font-size: 1.3rem; margin-bottom: 8px;">📋 Permits & Safety Protocol</h3>
                
                ${dest.permits.required ? `
                  <div style="background: var(--color-warning-bg); border: 1px solid var(--color-warning); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 12px;">
                    <div style="font-size: 0.825rem; font-weight: 700; color: var(--color-warning-text);">⚠️ Official Permit Required: ${dest.permits.name}</div>
                    <a href="${dest.permits.portal}" target="_blank" rel="noopener noreferrer" style="font-size: 0.775rem; color: var(--color-primary); text-decoration: underline; display: block; margin-top: 4px;">
                      Apply via Official Portal ↗
                    </a>
                  </div>
                ` : `
                  <div style="font-size: 0.85rem; color: var(--color-success); font-weight: 600; margin-bottom: 10px;">
                    ✓ No special inner-line permit required for Indian tourists.
                  </div>
                `}

                <div style="font-size: 0.8rem; color: var(--color-text-secondary);">
                  <strong>Emergency Facility:</strong> ${dest.safety.emergencyFacility}
                </div>
              </section>

            </div>

            <!-- PostGIS Coordinates & Source Verification Stamp -->
            <section class="card" style="padding: var(--space-lg); background: var(--color-bg-surface-elevated); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
              <div>
                <div class="caption-text">POSTGIS GEOSPATIAL COORDINATES (EPSG:4326)</div>
                <div class="font-mono" style="font-weight: 700; font-size: 0.95rem; color: var(--color-text-primary);">
                  ${dest.coordinates.lat.toFixed(4)}° N, ${dest.coordinates.lng.toFixed(4)}° E
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-verified">✓ Verified Source</span>
                <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">
                  Source: <a href="${dest.source.url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">${dest.source.name}</a>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>

    </main>
  `;
}

export function attachDestinationDetailEvents(destSlug) {
  const dest = DESTINATIONS.find(d => d.slug === destSlug) || DESTINATIONS[0];

  const addBtn = document.getElementById('dest-add-itinerary-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      store.addItineraryItem(1, {
        time: "10:30 AM",
        title: `Explore ${dest.name}`,
        type: dest.type || "DESTINATION",
        destinationId: dest.id,
        notes: `Featured excursion at ${dest.name}`
      });
      showToast(`Added ${dest.name} to your trip itinerary!`, "success");
    });
  }

  const bookmarkBtn = document.getElementById('dest-bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      store.toggleSavePlace(dest.id);
      const isSaved = store.getState().savedPlaces.includes(dest.id);
      bookmarkBtn.innerText = isSaved ? '★ Saved to Bookmarks' : '☆ Save Destination';
      showToast(isSaved ? "Saved to your bookmarks!" : "Removed from bookmarks.", "success");
    });
  }

  const shareBtn = document.getElementById('dest-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "info");
      }
    });
  }
}
