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

  const filtered = DESTINATIONS.filter(d => {
    const matchTerritory = activeTerritory === 'ALL' || d.territoryId === activeTerritory;
    const matchType = activeType === 'ALL' || d.type === activeType || d.categories.includes(activeType);
    const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery) || d.territoryName.toLowerCase().includes(searchQuery) || d.shortDescription.toLowerCase().includes(searchQuery);
    return matchTerritory && matchType && matchSearch;
  });

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-verified" style="width: fit-content;">Phase 5 Verified Knowledge</span>
        <h1>Destinations Across the 8 UTs</h1>
        <p class="lead-text">
          Browse verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments.
        </p>
      </div>

      <!-- Filter Controls Bar -->
      <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-2xl); box-shadow: var(--shadow-card);">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-md); align-items: flex-end;">
          
          <!-- Search Input -->
          <div>
            <label class="search-label" for="dest-search-input">Search Destinations</label>
            <input type="text" 
                   id="dest-search-input" 
                   class="search-input" 
                   style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);" 
                   placeholder="Filter by name, highlights..." 
                   value="${searchQuery}" />
          </div>

          <!-- Territory Filter -->
          <div>
            <label class="search-label" for="dest-ut-filter">Union Territory</label>
            <select id="dest-ut-filter" class="search-input" style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <option value="ALL">All 8 Union Territories</option>
              ${TERRITORIES.map(t => `
                <option value="${t.id}" ${activeTerritory === t.id ? 'selected' : ''}>${t.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="search-label" for="dest-type-filter">Category / Experience</label>
            <select id="dest-type-filter" class="search-input" style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <option value="ALL">All Categories</option>
              <option value="HERITAGE" ${activeType === 'HERITAGE' ? 'selected' : ''}>Heritage & Monuments</option>
              <option value="LAKE" ${activeType === 'LAKE' ? 'selected' : ''}>Glacial & Urban Lakes</option>
              <option value="ISLAND" ${activeType === 'ISLAND' ? 'selected' : ''}>Coral Islands & Atolls</option>
              <option value="Nature" ${activeType === 'Nature' ? 'selected' : ''}>Pristine Nature</option>
              <option value="Adventure" ${activeType === 'Adventure' ? 'selected' : ''}>Adventure & Trekking</option>
              <option value="Culture" ${activeType === 'Culture' ? 'selected' : ''}>Culture & Cuisine</option>
            </select>
          </div>

          <!-- Reset Filter -->
          <div>
            <button class="btn btn-outline" id="dest-reset-filters" style="width: 100%;">
              Reset Filters
            </button>
          </div>

        </div>

      </div>

      <!-- Results Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
        ${filtered.map(dest => `
          <article class="destination-card card-hoverable">
            <div class="destination-card-media">
              <img src="${dest.image}" alt="${dest.name}" class="destination-card-img" loading="lazy" />
              <div class="destination-card-badges">
                <span class="badge badge-verified">✓ ${dest.type}</span>
                <button class="btn btn-sm btn-ghost btn-icon-only bookmark-btn" 
                        data-id="${dest.id}"
                        style="background: rgba(15, 23, 42, 0.6); color: ${savedPlaces.has(dest.id) ? '#f59e0b' : '#ffffff'}; border-radius: 50%; width: 34px; height: 34px;">
                  ${savedPlaces.has(dest.id) ? '★' : '☆'}
                </button>
              </div>
            </div>

            <div class="destination-card-body">
              <div class="destination-card-location">${dest.territoryName}</div>
              <h2 class="destination-card-title" style="font-size: 1.25rem;">${dest.name}</h2>
              <p class="destination-card-desc">${dest.shortDescription}</p>

              <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                ${dest.categories.map(c => `
                  <span class="badge badge-neutral" style="font-size: 0.65rem;">${c}</span>
                `).join('')}
              </div>

              <div class="destination-card-footer">
                <span style="font-weight: 600; color: var(--color-text-secondary);">${dest.weather.bestTime}</span>
                <div style="display: flex; gap: 6px;">
                  <a href="#/destinations/${dest.slug}" class="btn btn-sm btn-outline">Explore Place</a>
                  <button class="btn btn-sm btn-primary add-to-trip-btn" data-dest='${JSON.stringify({ id: dest.id, name: dest.name, type: dest.type })}'>
                    + Itinerary
                  </button>
                </div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>

      ${filtered.length === 0 ? `
        <div class="card" style="padding: 48px; text-align: center; color: var(--color-text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">📍</div>
          <h3>No destinations match your filter criteria.</h3>
          <p style="margin-top: 6px;">Try adjusting your search terms or clearing the active filters.</p>
        </div>
      ` : ''}

    </main>
  `;
}

export function attachDestinationsEvents() {
  const searchInput = document.getElementById('dest-search-input');
  const utFilter = document.getElementById('dest-ut-filter');
  const typeFilter = document.getElementById('dest-type-filter');
  const resetBtn = document.getElementById('dest-reset-filters');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderDestinationsView();
        attachDestinationsEvents();
      }
    });
  }

  if (utFilter) {
    utFilter.addEventListener('change', (e) => {
      activeTerritory = e.target.value;
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderDestinationsView();
        attachDestinationsEvents();
      }
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      activeType = e.target.value;
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderDestinationsView();
        attachDestinationsEvents();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeTerritory = 'ALL';
      activeType = 'ALL';
      searchQuery = '';
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderDestinationsView();
        attachDestinationsEvents();
      }
    });
  }

  // Bookmark actions
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      store.toggleSavePlace(id);
      const isSaved = store.getState().savedPlaces.includes(id);
      btn.innerHTML = isSaved ? '★' : '☆';
      btn.style.color = isSaved ? '#f59e0b' : '#ffffff';
      showToast(isSaved ? "Saved to your bookmarks!" : "Removed from bookmarks.", "success");
    });
  });

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
