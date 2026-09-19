/**
 * 🇮🇳 BHARAT SAFE YATRA — DEDICATED SEARCH RESULTS VIEW
 */

import { DESTINATIONS } from '../data/destinations.js';
import { TERRITORIES } from '../data/territories.js';
import { FESTIVALS } from '../data/festivals.js';
import { EMERGENCY_FACILITIES } from '../data/safety.js';

export function renderSearchView(query = '') {
  const q = query.toLowerCase().trim();

  const matchedTerritories = TERRITORIES.filter(t => 
    !q || t.name.toLowerCase().includes(q) || t.capital.toLowerCase().includes(q) || t.popularDestinations.some(d => d.toLowerCase().includes(q))
  );

  const matchedDestinations = DESTINATIONS.filter(d =>
    !q || d.name.toLowerCase().includes(q) || d.territoryName.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q) || d.categories.some(c => c.toLowerCase().includes(q))
  );

  const matchedFestivals = FESTIVALS.filter(f =>
    !q || f.name.toLowerCase().includes(q) || f.territoryName.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)
  );

  const matchedEmergency = EMERGENCY_FACILITIES.filter(ef =>
    !q || ef.name.toLowerCase().includes(q) || ef.territoryName.toLowerCase().includes(q)
  );

  const totalResults = matchedTerritories.length + matchedDestinations.length + matchedFestivals.length + matchedEmergency.length;

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-verified" style="width: fit-content;">Universal Tourism Search</span>
        <h1>Search Results ${query ? `for "${query}"` : ''}</h1>
        <p class="lead-text">Found ${totalResults} verified matching records across all 8 Union Territories.</p>
      </div>

      <!-- Search Input Form -->
      <form id="dedicated-search-form" style="display: flex; gap: 8px; margin-bottom: var(--space-2xl); max-width: 680px;">
        <input type="text" 
               id="search-page-input" 
               class="search-input" 
               style="background: var(--color-bg-surface); padding: 12px 18px; border-radius: var(--radius-md); border: 1px solid var(--color-border-medium);" 
               placeholder="Search destinations, territories, festivals..." 
               value="${query}" />
        <button type="submit" class="btn btn-primary">Search</button>
      </form>

      <!-- Categories Display -->
      <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
        
        <!-- Matching Destinations -->
        ${matchedDestinations.length > 0 ? `
          <section>
            <h2 style="font-size: 1.35rem; margin-bottom: 12px;">Destinations (${matchedDestinations.length})</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
              ${matchedDestinations.map(d => `
                <div class="card card-hoverable" style="padding: var(--space-lg);">
                  <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 4px;">${d.territoryName} • ${d.type}</div>
                  <h3 style="font-size: 1.15rem; margin-bottom: 6px;">${d.name}</h3>
                  <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 12px;">${d.shortDescription}</p>
                  <a href="#/destinations/${d.slug}" class="btn btn-sm btn-outline">Explore Place →</a>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Matching Territories -->
        ${matchedTerritories.length > 0 ? `
          <section>
            <h2 style="font-size: 1.35rem; margin-bottom: 12px;">Union Territories (${matchedTerritories.length})</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
              ${matchedTerritories.map(t => `
                <div class="card card-hoverable" style="padding: var(--space-lg);">
                  <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${t.name}</h3>
                  <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 8px;">Capital: ${t.capital}</div>
                  <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 12px;">${t.tagline}</p>
                  <a href="#/territories/${t.slug}" class="btn btn-sm btn-primary">Explore Territory →</a>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Matching Festivals -->
        ${matchedFestivals.length > 0 ? `
          <section>
            <h2 style="font-size: 1.35rem; margin-bottom: 12px;">2026 Cultural Festivals (${matchedFestivals.length})</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
              ${matchedFestivals.map(f => `
                <div class="card card-hoverable" style="padding: var(--space-lg);">
                  <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${f.name}</h3>
                  <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600; margin-bottom: 8px;">${f.displayDate} • ${f.location}</div>
                  <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 12px;">${f.description}</p>
                  <a href="#/festivals" class="btn btn-sm btn-outline">View in Calendar →</a>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

      </div>

    </main>
  `;
}

export function attachSearchEvents() {
  const form = document.getElementById('dedicated-search-form');
  const input = document.getElementById('search-page-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      window.location.hash = `#/search?q=${encodeURIComponent(val)}`;
    });
  }
}
