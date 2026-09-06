/**
 * 🇮🇳 BHARAT SAFE YATRA — DESTINATIONS DIRECTORY VIEW
 * Multi-Faceted Filtering across 8 Union Territories
 */

import { DESTINATIONS } from '../data/destinations.js';
import { TERRITORIES } from '../data/territories.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

let activeTerritory = 'ALL';
let activeType = 'ALL';
let searchQuery = '';

export function renderDestinationsView() {
  const savedPlaces = new Set(store.getState().savedPlaces);

  // Check if viewing a specific territory or the 8 UT cards hub
  const isViewingSpecificTerritory = activeTerritory !== 'ALL';
  const selectedUT = isViewingSpecificTerritory
    ? TERRITORIES.find(t => t.id === activeTerritory)
    : null;

  // Filtered places if inside a specific territory
  const filteredPlaces = DESTINATIONS.filter(d => {
    const matchTerritory = !isViewingSpecificTerritory || d.territoryId === activeTerritory;
    const matchType = activeType === 'ALL' || d.type === activeType || (d.categories && d.categories.includes(activeType));
    const matchSearch = !searchQuery || 
      d.name.toLowerCase().includes(searchQuery) || 
      d.territoryName.toLowerCase().includes(searchQuery) || 
      (d.shortDescription && d.shortDescription.toLowerCase().includes(searchQuery)) ||
      (d.tagline && d.tagline.toLowerCase().includes(searchQuery));
    return matchTerritory && matchType && matchSearch;
  });

  // Filtered territories if on the 8 UT cards hub
  const filteredTerritories = TERRITORIES.filter(t => {
    if (!searchQuery) return true;
    return (
      t.name.toLowerCase().includes(searchQuery) ||
      t.shortName.toLowerCase().includes(searchQuery) ||
      t.capital.toLowerCase().includes(searchQuery) ||
      t.tagline.toLowerCase().includes(searchQuery) ||
      t.popularDestinations.some(p => p.toLowerCase().includes(searchQuery))
    );
  });

  return `
    <main class="container section-spacing" role="main">
      
      <!-- Top Section Header -->
      <div class="section-header" style="margin-bottom: var(--space-xl);">
        ${isViewingSpecificTerritory && selectedUT ? `
          <div>
            <button id="dest-back-to-all" class="btn btn-sm btn-outline" style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; font-weight: 600; border-radius: var(--radius-pill); padding: 6px 16px;">
              ← Back to All 8 Union Territories
            </button>
            <h1 style="font-size: clamp(2rem, 4vw, 2.8rem); margin-bottom: 8px;">
              ${selectedUT.name}
            </h1>
            <p class="lead-text" style="max-width: 800px;">
              ${selectedUT.tagline} • Capital: ${selectedUT.capital}
            </p>
          </div>
        ` : `
          <div>
            <h1 style="font-size: clamp(2.2rem, 4vw, 3rem); margin-bottom: 10px;">
              Destinations Across the 8 UTs
            </h1>
            <p class="lead-text" style="max-width: 850px;">
              Browse verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments organized by Union Territory.
            </p>
          </div>
        `}
      </div>

      <!-- Union Territory Quick Selector Tabs -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: var(--space-xl); scrollbar-width: none;">
        <button class="btn btn-sm ut-tab-btn ${activeTerritory === 'ALL' ? 'btn-primary' : 'btn-outline'}" 
                data-ut="ALL" 
                style="white-space: nowrap; border-radius: var(--radius-pill); padding: 8px 18px; font-weight: ${activeTerritory === 'ALL' ? '700' : '500'};">
          All 8 Union Territories
        </button>
        ${TERRITORIES.map(t => `
          <button class="btn btn-sm ut-tab-btn ${activeTerritory === t.id ? 'btn-primary' : 'btn-outline'}" 
                  data-ut="${t.id}" 
                  style="white-space: nowrap; border-radius: var(--radius-pill); padding: 8px 16px; font-weight: ${activeTerritory === t.id ? '700' : '500'};">
            ${t.shortName || t.name}
          </button>
        `).join('')}
      </div>

      ${!isViewingSpecificTerritory ? `
        <!-- VIEW 1: 8 UNION TERRITORY CARDS -->
        <section>
          <!-- Search bar with Autocomplete Suggestions -->
          <div id="dest-search-container" style="position: relative; margin-bottom: var(--space-2xl);">
            <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-pill); padding: 10px 18px; box-shadow: var(--shadow-card); display: flex; align-items: center; gap: 12px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style="opacity: 0.6; flex-shrink: 0;">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" 
                     id="dest-search-input" 
                     class="search-input" 
                     style="border: none; outline: none; box-shadow: none; background: transparent; width: 100%; font-size: 1rem; color: var(--color-text-primary); padding: 0;" 
                     placeholder="Search Union Territories by name, capital, or attractions..." 
                     value="${searchQuery}" />
              ${searchQuery ? `
                <button id="dest-clear-search" type="button" aria-label="Clear search" style="border: none; background: rgba(0,0,0,0.08); color: var(--color-text-secondary); width: 24px; height: 24px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">✕</button>
              ` : ''}
            </div>

            <!-- Suggestions container -->
            <div id="dest-suggestions-dropdown" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 60; background: var(--color-bg-surface-elevated, #ffffff); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.15); overflow: hidden; max-height: 380px; overflow-y: auto;">
            </div>
          </div>

          <!-- Results when searching from main hub -->
          ${searchQuery && filteredPlaces.length > 0 ? `
            <div style="margin-bottom: var(--space-3xl);">
              <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: var(--space-lg); color: var(--color-text-primary);">
                Destinations & Places (${filteredPlaces.length})
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
                ${filteredPlaces.map(dest => `
                  <article class="destination-card card-hoverable place-card-item" data-slug="${dest.slug}" style="display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div class="destination-card-media" style="height: 220px; position: relative;">
                      <img src="${dest.image}" alt="${dest.name}" class="destination-card-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
                      <div class="destination-card-badges" style="position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between;">
                        <span class="badge badge-neutral" style="background: rgba(0,0,0,0.65); color: #ffffff; backdrop-filter: blur(6px); font-weight: 700;">
                          ${dest.type}
                        </span>
                        <span class="badge badge-neutral" style="background: rgba(200, 142, 68, 0.85)", color: #ffffff; font-size: 0.7rem; font-weight: 700;">
                          ${dest.territoryName}
                        </span>
                      </div>
                    </div>

                    <div class="destination-card-body" style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
                      <h2 class="destination-card-title" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">${dest.name}</h2>
                      <p class="destination-card-desc" style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 14px; flex-grow: 1;">
                        ${dest.shortDescription}
                      </p>

                      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                        ${(dest.categories || []).map(c => `
                          <span class="badge badge-neutral" style="font-size: 0.68rem; padding: 2px 8px;">${c}</span>
                        `).join('')}
                      </div>

                      <div class="destination-card-footer" style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle); margin-top: auto;">
                        <a href="#/destinations/${dest.slug}" class="btn btn-sm btn-outline place-explore-link">Explore Place</a>
                        <button class="btn btn-sm btn-primary add-to-trip-btn" data-dest='${JSON.stringify({ id: dest.id, name: dest.name, type: dest.type })}'>
                          + Itinerary
                        </button>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 8 UT Cards Grid -->
          ${filteredTerritories.length > 0 ? `
            <div>
              ${searchQuery ? `
                <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: var(--space-lg); color: var(--color-text-primary);">
                  Union Territories (${filteredTerritories.length})
                </h2>
              ` : ''}
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: var(--space-xl);">
                ${filteredTerritories.map((ut) => {
                  return `
                    <article class="card card-hoverable ut-card-item" data-ut="${ut.id}" style="display: flex; flex-direction: column; overflow: hidden; cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease; border: 1px solid var(--color-border-subtle);">
                      <!-- Hero Thumbnail (no badges, no capital text overlay) -->
                      <div style="position: relative; height: 280px; overflow: hidden; background: #1a1a1a;">
                        <img src="${ut.heroImage || ut.thumbnailImage}" alt="${ut.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%);"></div>
                      </div>

                      <!-- Content Body -->
                      <div style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
                        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 6px; color: var(--color-text-primary);">${ut.name}</h2>
                        <p style="font-size: 0.85rem; color: var(--stitch-accent, #C88E44); font-weight: 600; margin-bottom: 10px;">${ut.tagline}</p>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.55; margin-bottom: var(--space-md); flex-grow: 1;">
                          ${ut.shortDescription}
                        </p>

                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--color-border-subtle); margin-top: auto;">
                          <div>
                            <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px;">
                              Best time to visit
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary);">
                              ${ut.weatherSnapshot.bestMonths}
                            </div>
                          </div>
                          <button class="btn btn-sm btn-primary open-ut-btn" data-ut="${ut.id}" style="font-weight: 600; border-radius: var(--radius-pill); padding: 8px 18px;">
                            Explore Places →
                          </button>
                        </div>
                      </div>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          ${searchQuery && filteredTerritories.length === 0 && filteredPlaces.length === 0 ? `
            <div class="card" style="padding: 48px; text-align: center; color: var(--color-text-muted);">
              <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
              <h3>No places or Union Territories match "${searchQuery}"</h3>
              <p style="margin-top: 6px;">Try searching for a different destination, monument, lake, or territory name.</p>
              <button id="dest-reset-all" class="btn btn-sm btn-outline" style="margin-top: 16px;">Reset Search</button>
            </div>
          ` : ''}
        </section>
      ` : `
        <!-- VIEW 2: PLACES IN SELECTED UT -->
        <section>
          <!-- Hero Banner for Territory - Expanded by 35%+ -->
          <div style="position: relative; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: var(--space-2xl); min-height: 340px; display: flex; align-items: flex-end; padding: 48px 36px; color: #ffffff; background-image: url('${selectedUT.heroImage || selectedUT.thumbnailImage}'); background-size: cover; background-position: center; box-shadow: var(--shadow-elevated);">
            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%);"></div>
            <div style="position: relative; z-index: 2; max-width: 880px;">
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                <span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff; backdrop-filter: blur(6px);">
                  🏛️ Capital: ${selectedUT.capital}
                </span>
                <span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff; backdrop-filter: blur(6px);">
                  🌡️ ${selectedUT.weatherSnapshot.temp}°C • ${selectedUT.weatherSnapshot.condition}
                </span>
                <span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff; backdrop-filter: blur(6px);">
                  Best time to visit: ${selectedUT.weatherSnapshot.bestMonths}
                </span>
              </div>
              <h2 style="color: #ffffff; font-size: clamp(1.9rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 10px; line-height: 1.2;">
                All Places in ${selectedUT.name}
              </h2>
              <p style="color: rgba(255,255,255,0.92); font-size: 1.05rem; line-height: 1.6; max-width: 800px;">
                ${selectedUT.description}
              </p>
            </div>
          </div>

          <!-- Places Filter Bar (without All 8 UTs button) -->
          <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-2xl); box-shadow: var(--shadow-card);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-md); align-items: flex-end;">
              <div>
                <label class="search-label" for="dest-search-input" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); display: block; margin-bottom: 6px;">
                  Search Places in ${selectedUT.shortName}
                </label>
                <div style="background: var(--color-bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; padding: 0 12px;">
                  <input type="text" 
                         id="dest-search-input" 
                         class="search-input" 
                         style="border: none; outline: none; box-shadow: none; background: transparent; padding: 10px 0; width: 100%; font-size: 0.9rem; color: var(--color-text-primary);" 
                         placeholder="Search in ${selectedUT.shortName}..." 
                         value="${searchQuery}" />
                  ${searchQuery ? `
                    <button id="dest-clear-search" type="button" aria-label="Clear search" style="border: none; background: rgba(0,0,0,0.08); color: var(--color-text-secondary); width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; font-weight: 700;">✕</button>
                  ` : ''}
                </div>
              </div>

              <div>
                <label class="search-label" for="dest-type-filter" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); display: block; margin-bottom: 6px;">
                  Experience / Category
                </label>
                <div style="position: relative;">
                  <select id="dest-type-filter" class="search-input" style="background: var(--color-bg-surface-elevated); padding: 10px 38px 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); width: 100%; font-size: 0.9rem; color: var(--color-text-primary); cursor: pointer; outline: none; appearance: none; -webkit-appearance: none;">
                    <option value="ALL">All Categories</option>
                    <option value="HERITAGE" ${activeType === 'HERITAGE' ? 'selected' : ''}>Heritage & Monuments</option>
                    <option value="LAKE" ${activeType === 'LAKE' ? 'selected' : ''}>Glacial & Urban Lakes</option>
                    <option value="ISLAND" ${activeType === 'ISLAND' ? 'selected' : ''}>Coral Islands & Atolls</option>
                    <option value="Nature" ${activeType === 'Nature' ? 'selected' : ''}>Pristine Nature</option>
                    <option value="Adventure" ${activeType === 'Adventure' ? 'selected' : ''}>Adventure & Trekking</option>
                    <option value="Culture" ${activeType === 'Culture' ? 'selected' : ''}>Culture & Cuisine</option>
                    <option value="Family" ${activeType === 'Family' ? 'selected' : ''}>Family & Leisure</option>
                  </select>
                  <div style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.7;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              ${(searchQuery || activeType !== 'ALL') ? `
                <div>
                  <button class="btn btn-outline" id="dest-reset-filters" style="padding: 10px 16px; border-radius: var(--radius-md); width: 100%;">
                    Reset Filters
                  </button>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Places Grid (Clickable entire card, no UT badge or location name, no best time in footer) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
            ${filteredPlaces.map(dest => `
              <article class="destination-card card-hoverable place-card-item" data-slug="${dest.slug}" style="display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                <div class="destination-card-media" style="height: 220px; position: relative;">
                  <img src="${dest.image}" alt="${dest.name}" class="destination-card-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
                  <div class="destination-card-badges" style="position: absolute; top: 12px; left: 12px;">
                    <span class="badge badge-neutral" style="background: rgba(0,0,0,0.65); color: #ffffff; backdrop-filter: blur(6px); font-weight: 700;">
                      ${dest.type}
                    </span>
                  </div>
                </div>

                <div class="destination-card-body" style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
                  <h2 class="destination-card-title" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">${dest.name}</h2>
                  <p class="destination-card-desc" style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 14px; flex-grow: 1;">
                    ${dest.shortDescription}
                  </p>

                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                    ${(dest.categories || []).map(c => `
                      <span class="badge badge-neutral" style="font-size: 0.68rem; padding: 2px 8px;">${c}</span>
                    `).join('')}
                  </div>

                  <div class="destination-card-footer" style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle); margin-top: auto;">
                    <a href="#/destinations/${dest.slug}" class="btn btn-sm btn-outline place-explore-link">Explore Place</a>
                    <button class="btn btn-sm btn-primary add-to-trip-btn" data-dest='${JSON.stringify({ id: dest.id, name: dest.name, type: dest.type })}'>
                      + Itinerary
                    </button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>

          ${filteredPlaces.length === 0 ? `
            <div class="card" style="padding: 48px; text-align: center; color: var(--color-text-muted);">
              <div style="font-size: 3rem; margin-bottom: 12px;">📍</div>
              <h3>No destinations match your filter criteria in ${selectedUT.name}.</h3>
              <p style="margin-top: 6px;">Try adjusting your search terms or clearing the active filters.</p>
              <button id="dest-reset-filters" class="btn btn-sm btn-outline" style="margin-top: 16px;">Clear Filters</button>
            </div>
          ` : ''}
        </section>
      `}

    </main>
  `;
}

export function attachDestinationsEvents() {
  const searchInput = document.getElementById('dest-search-input');
  const typeFilter = document.getElementById('dest-type-filter');
  const resetBtn = document.getElementById('dest-reset-filters');
  const resetAllBtn = document.getElementById('dest-reset-all');
  const clearSearchBtn = document.getElementById('dest-clear-search');
  const backToAllBtn = document.getElementById('dest-back-to-all');
  const suggestionsDropdown = document.getElementById('dest-suggestions-dropdown');

  const reRender = () => {
    const main = document.querySelector('main');
    if (main) {
      main.outerHTML = renderDestinationsView();
      attachDestinationsEvents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch territory via tabs
  document.querySelectorAll('.ut-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeTerritory = btn.getAttribute('data-ut');
      searchQuery = '';
      activeType = 'ALL';
      reRender();
    });
  });

  // Switch territory via clicking UT card
  document.querySelectorAll('.ut-card-item').forEach(card => {
    card.addEventListener('click', () => {
      activeTerritory = card.getAttribute('data-ut');
      searchQuery = '';
      activeType = 'ALL';
      reRender();
    });
  });

  // Make entire place cards clickable to navigate to destination detail
  document.querySelectorAll('.place-card-item').forEach(card => {
    card.addEventListener('click', (e) => {
      const slug = card.getAttribute('data-slug');
      if (slug) {
        window.location.hash = `#/destinations/${slug}`;
      }
    });
  });

  document.querySelectorAll('.place-explore-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Back to All UTs
  if (backToAllBtn) {
    backToAllBtn.addEventListener('click', () => {
      activeTerritory = 'ALL';
      searchQuery = '';
      activeType = 'ALL';
      reRender();
    });
  }

  // Search input & Suggestions Dropdown
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      
      // Update suggestions dropdown
      if (suggestionsDropdown) {
        if (searchQuery.length > 0) {
          const matchingUTs = TERRITORIES.filter(t =>
            t.name.toLowerCase().includes(searchQuery) ||
            t.shortName.toLowerCase().includes(searchQuery) ||
            t.capital.toLowerCase().includes(searchQuery)
          ).slice(0, 4);

          const matchingDests = DESTINATIONS.filter(d =>
            d.name.toLowerCase().includes(searchQuery) ||
            d.territoryName.toLowerCase().includes(searchQuery) ||
            (d.shortDescription && d.shortDescription.toLowerCase().includes(searchQuery))
          ).slice(0, 6);

          if (matchingUTs.length === 0 && matchingDests.length === 0) {
            suggestionsDropdown.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">No matches found</div>`;
          } else {
            let html = '';
            if (matchingUTs.length > 0) {
              html += `<div style="padding: 6px 16px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Union Territories</div>`;
              matchingUTs.forEach(ut => {
                html += `
                  <div class="suggestion-ut-item" data-ut="${ut.id}" style="padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                    <div style="font-weight: 600; font-size: 0.9rem;">🏛️ ${ut.name}</div>
                    <span style="font-size: 0.75rem; color: var(--stitch-accent, #C88E44);">Explore →</span>
                  </div>
                `;
              });
            }
            if (matchingDests.length > 0) {
              html += `<div style="padding: 6px 16px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); border-top: 1px solid var(--color-border-subtle);">Destinations</div>`;
              matchingDests.forEach(d => {
                html += `
                  <div class="suggestion-dest-item" data-slug="${d.slug}" style="padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                    <div>
                      <div style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary);">${d.name}</div>
                      <div style="font-size: 0.78rem; color: var(--color-text-secondary);">${d.territoryName} • ${d.type}</div>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">View →</span>
                  </div>
                `;
              });
            }
            suggestionsDropdown.innerHTML = html;

            // Attach suggestion clicks
            suggestionsDropdown.querySelectorAll('.suggestion-ut-item').forEach(item => {
              item.addEventListener('click', () => {
                activeTerritory = item.getAttribute('data-ut');
                searchQuery = '';
                reRender();
              });
            });

            suggestionsDropdown.querySelectorAll('.suggestion-dest-item').forEach(item => {
              item.addEventListener('click', () => {
                const slug = item.getAttribute('data-slug');
                window.location.hash = `#/destinations/${slug}`;
              });
            });
          }
          suggestionsDropdown.style.display = 'block';
        } else {
          suggestionsDropdown.style.display = 'none';
        }
      }

      // Re-render grid after a short debounce if on active territory
      if (activeTerritory !== 'ALL') {
        const main = document.querySelector('main');
        if (main) {
          main.outerHTML = renderDestinationsView();
          attachDestinationsEvents();
        }
      }
    });

    searchInput.addEventListener('focus', () => {
      if (searchQuery.length > 0 && suggestionsDropdown) {
        suggestionsDropdown.style.display = 'block';
      }
    });
  }

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    const container = document.getElementById('dest-search-container');
    if (suggestionsDropdown && container && !container.contains(e.target)) {
      suggestionsDropdown.style.display = 'none';
    }
  });

  // Clear search
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      reRender();
    });
  }

  // Category filter
  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      activeType = e.target.value;
      reRender();
    });
  }

  // Reset filter
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeType = 'ALL';
      searchQuery = '';
      reRender();
    });
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      activeTerritory = 'ALL';
      activeType = 'ALL';
      searchQuery = '';
      reRender();
    });
  }

  // Add to trip actions
  document.querySelectorAll('.add-to-trip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dest = JSON.parse(btn.getAttribute('data-dest'));
      store.addItineraryItem(1, {
        time: "11:00 AM",
        title: `Visit ${dest.name}`,
        type: dest.type || "DESTINATION",
        notes: "Added from destinations directory"
      });
      showToast(`Added ${dest.name} to Day 1 of your trip!`, "success");
    });
  });
}
