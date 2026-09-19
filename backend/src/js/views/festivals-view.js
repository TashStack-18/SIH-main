/**
 * 🇮🇳 BHARAT SAFE YATRA — 2026 FESTIVAL CALENDAR VIEW
 * Strict Date Precision & Source Verification Engine
 */

import { FESTIVALS } from '../data/festivals.js';
import { TERRITORIES } from '../data/territories.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

let selectedTerritory = 'ALL';
let selectedCategory = 'ALL';
let searchQuery = '';

export function renderFestivalsView() {
  const filtered = FESTIVALS.filter(f => {
    const matchTerritory = selectedTerritory === 'ALL' || f.territoryId === selectedTerritory;
    const matchCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery) || f.location.toLowerCase().includes(searchQuery) || f.description.toLowerCase().includes(searchQuery);
    return matchTerritory && matchCategory && matchSearch;
  });

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-warning" style="width: fit-content;">Phase 5 Research Standard</span>
        <h1>2026 Cultural Festival Calendar</h1>
        <p class="lead-text">
          Verified annual monastic ceremonies, island food galas, and national cultural carnivals across India's 8 Union Territories with strict date precision.
        </p>
      </div>

      <!-- Filters Bar -->
      <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-2xl); box-shadow: var(--shadow-card);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-md); align-items: flex-end;">
          
          <!-- Search -->
          <div>
            <label class="search-label" for="fest-search-input">Search Festivals</label>
            <input type="text" 
                   id="fest-search-input" 
                   class="search-input" 
                   placeholder="Search Hemis, Apricot, Carnival..." 
                   value="${searchQuery}" 
                   style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);" />
          </div>

          <!-- Territory Filter -->
          <div>
            <label class="search-label" for="fest-ut-filter">Union Territory</label>
            <select id="fest-ut-filter" class="search-input" style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <option value="ALL">All 8 Union Territories</option>
              ${TERRITORIES.map(t => `
                <option value="${t.id}" ${selectedTerritory === t.id ? 'selected' : ''}>${t.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="search-label" for="fest-cat-filter">Category</label>
            <select id="fest-cat-filter" class="search-input" style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <option value="ALL">All Categories</option>
              <option value="CULTURAL" ${selectedCategory === 'CULTURAL' ? 'selected' : ''}>Monastic & Folk Culture</option>
              <option value="FOOD_CULINARY" ${selectedCategory === 'FOOD_CULINARY' ? 'selected' : ''}>Food & Gastronomy</option>
              <option value="HERITAGE" ${selectedCategory === 'HERITAGE' ? 'selected' : ''}>Heritage & Crafts</option>
            </select>
          </div>

          <!-- Reset Filter -->
          <div>
            <button class="btn btn-outline" id="fest-reset-filters" style="width: 100%;">
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      <!-- Festival Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
        ${filtered.map(fest => `
          <article class="card card-hoverable" style="display: flex; flex-direction: column;">
            
            <div style="position: relative; height: 200px; overflow: hidden;">
              <img src="${fest.image}" alt="${fest.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
              <div style="position: absolute; bottom: 12px; left: 12px; right: 12px;">
                <div style="background: rgba(15,23,42,0.85); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: var(--radius-sm); color: #ffffff; font-size: 0.85rem; font-weight: 700;">
                  ${fest.displayDate}
                </div>
              </div>
            </div>

            <div style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 4px;">
                ${fest.territoryName} • ${fest.category}
              </div>
              <h2 style="font-size: 1.3rem; margin-bottom: 6px;">${fest.name}</h2>
              <div style="font-size: 0.825rem; color: var(--color-text-muted); margin-bottom: 10px;">
                ${fest.location}
              </div>
              <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-md); flex-grow: 1;">
                ${fest.description}
              </p>

              <div style="background: var(--color-bg-surface-elevated); padding: 10px; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--color-text-primary); margin-bottom: 14px;">
                <strong>Cultural Legacy:</strong> ${fest.culturalSignificance}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--color-border-subtle);">
                <a href="${fest.officialSource.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.775rem; color: var(--color-primary); text-decoration: underline;">
                  ✓ Source: ${fest.officialSource.name} ↗
                </a>
                <button class="btn btn-sm btn-primary add-fest-btn" data-fest='${JSON.stringify({ name: fest.name, location: fest.location, date: fest.displayDate })}'>
                  + Add to Itinerary
                </button>
              </div>
            </div>

          </article>
        `).join('')}
      </div>

    </main>
  `;
}

export function attachFestivalsEvents() {
  const searchInput = document.getElementById('fest-search-input');
  const utFilter = document.getElementById('fest-ut-filter');
  const catFilter = document.getElementById('fest-cat-filter');
  const resetBtn = document.getElementById('fest-reset-filters');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderFestivalsView();
        attachFestivalsEvents();
      }
    });
  }

  if (utFilter) {
    utFilter.addEventListener('change', (e) => {
      selectedTerritory = e.target.value;
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderFestivalsView();
        attachFestivalsEvents();
      }
    });
  }

  if (catFilter) {
    catFilter.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderFestivalsView();
        attachFestivalsEvents();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedTerritory = 'ALL';
      selectedCategory = 'ALL';
      searchQuery = '';
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderFestivalsView();
        attachFestivalsEvents();
      }
    });
  }

  document.querySelectorAll('.add-fest-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const fest = JSON.parse(btn.getAttribute('data-fest'));
      store.addItineraryItem(1, {
        time: "02:00 PM",
        title: `Attend ${fest.name}`,
        type: "CUSTOM",
        notes: `Cultural festival at ${fest.location} (${fest.date})`
      });
      showToast(`Added ${fest.name} to Day 1 of your trip!`, "success");
    });
  });
}
