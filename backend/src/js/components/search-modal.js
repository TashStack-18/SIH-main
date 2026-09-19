/**
 * 🇮🇳 BHARAT SAFE YATRA — UNIVERSAL SEARCH (CMD+K)
 * Accessible Global Command Palette
 */

import { DESTINATIONS } from '../data/destinations.js';
import { TERRITORIES } from '../data/territories.js';
import { FESTIVALS } from '../data/festivals.js';
import { EMERGENCY_FACILITIES } from '../data/safety.js';
import { store } from '../stores/store.js';

let isModalOpen = false;

export function initSearchModal() {
  // Global Cmd+K or Ctrl+K shortcut listener
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleSearchModal(!isModalOpen);
    }
    if (e.key === 'Escape' && isModalOpen) {
      toggleSearchModal(false);
    }
  });

  window.addEventListener('open-search-palette', () => {
    toggleSearchModal(true);
  });
}

export function toggleSearchModal(open) {
  isModalOpen = open;
  const existing = document.getElementById('search-palette-modal-root');

  if (open) {
    if (!existing) {
      const modalContainer = document.createElement('div');
      modalContainer.id = 'search-palette-modal-root';
      modalContainer.innerHTML = renderSearchModalContent('');
      document.body.appendChild(modalContainer);
      attachSearchModalEvents(modalContainer);

      setTimeout(() => {
        const input = document.getElementById('palette-search-input');
        if (input) input.focus();
      }, 50);
    }
  } else {
    if (existing) {
      existing.remove();
    }
  }
}

function renderSearchModalContent(query = '') {
  const q = query.toLowerCase().trim();

  const matchedTerritories = TERRITORIES.filter(t => 
    !q || t.name.toLowerCase().includes(q) || t.capital.toLowerCase().includes(q) || t.popularDestinations.some(d => d.toLowerCase().includes(q))
  ).slice(0, 3);

  const matchedDestinations = DESTINATIONS.filter(d =>
    !q || d.name.toLowerCase().includes(q) || d.territoryName.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedFestivals = FESTIVALS.filter(f =>
    !q || f.name.toLowerCase().includes(q) || f.territoryName.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedEmergency = EMERGENCY_FACILITIES.filter(ef =>
    !q || ef.name.toLowerCase().includes(q) || ef.territoryName.toLowerCase().includes(q) || ef.services.some(s => s.toLowerCase().includes(q))
  ).slice(0, 2);

  return `
    <div class="modal-backdrop" id="palette-backdrop" role="dialog" aria-modal="true" aria-label="Universal Tourism Search">
      <div class="search-palette" id="palette-box">
        
        <div class="palette-input-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-primary);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" 
                 id="palette-search-input" 
                 class="palette-input" 
                 placeholder="Search all 8 Union Territories, destinations, 2026 festivals, hospitals..." 
                 value="${query}" 
                 autocomplete="off" />
          <button class="kbd-shortcut" id="palette-close-btn">ESC</button>
        </div>

        <div class="palette-results">
          
          <!-- Union Territories -->
          ${matchedTerritories.length > 0 ? `
            <div class="palette-group-title">Union Territories</div>
            ${matchedTerritories.map(t => `
              <div class="palette-item" data-href="#/territories/${t.slug}">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.2rem;">🏛️</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.925rem;">${t.name}</div>
                    <div style="font-size: 0.775rem; color: var(--color-text-muted);">Capital: ${t.capital} • ${t.tagline}</div>
                  </div>
                </div>
                <span class="badge badge-verified">Verified UT</span>
              </div>
            `).join('')}
          ` : ''}

          <!-- Destinations -->
          ${matchedDestinations.length > 0 ? `
            <div class="palette-group-title" style="margin-top: 8px;">Destinations & Attractions</div>
            ${matchedDestinations.map(d => `
              <div class="palette-item" data-href="#/destinations/${d.slug}">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.2rem;">📍</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.925rem;">${d.name}</div>
                    <div style="font-size: 0.775rem; color: var(--color-text-muted);">${d.territoryName} • ${d.type}</div>
                  </div>
                </div>
                <span class="badge badge-official">Verified</span>
              </div>
            `).join('')}
          ` : ''}

          <!-- 2026 Festivals -->
          ${matchedFestivals.length > 0 ? `
            <div class="palette-group-title" style="margin-top: 8px;">2026 Cultural Festivals</div>
            ${matchedFestivals.map(f => `
              <div class="palette-item" data-href="#/festivals">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.2rem;">🎭</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.925rem;">${f.name}</div>
                    <div style="font-size: 0.775rem; color: var(--color-text-muted);">${f.displayDate} • ${f.location}</div>
                  </div>
                </div>
                <span class="badge badge-warning">${f.datePrecision}</span>
              </div>
            `).join('')}
          ` : ''}

          <!-- Emergency Facilities -->
          ${matchedEmergency.length > 0 ? `
            <div class="palette-group-title" style="margin-top: 8px;">Emergency Services</div>
            ${matchedEmergency.map(ef => `
              <div class="palette-item" data-href="#/safety">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.2rem;">🏥</span>
                  <div>
                    <div style="font-weight: 600; font-size: 0.925rem; color: var(--color-emergency);">${ef.name}</div>
                    <div style="font-size: 0.775rem; color: var(--color-text-muted);">24x7 Trauma Care • Tel: ${ef.phone}</div>
                  </div>
                </div>
                <span class="badge badge-danger">24x7 ER</span>
              </div>
            `).join('')}
          ` : ''}

          ${matchedTerritories.length === 0 && matchedDestinations.length === 0 && matchedFestivals.length === 0 ? `
            <div style="padding: 32px; text-align: center; color: var(--color-text-muted);">
              <p style="font-weight: 600;">No exact match found for "${query}"</p>
              <p style="font-size: 0.825rem; margin-top: 4px;">Try searching for Ladakh, Pangong, Cellular Jail, Red Fort, or Hospitals.</p>
            </div>
          ` : ''}

        </div>
      </div>
    </div>
  `;
}

function attachSearchModalEvents(container) {
  const backdrop = container.querySelector('#palette-backdrop');
  const box = container.querySelector('#palette-box');
  const input = container.querySelector('#palette-search-input');
  const closeBtn = container.querySelector('#palette-close-btn');

  backdrop.addEventListener('click', (e) => {
    if (!box.contains(e.target)) {
      toggleSearchModal(false);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleSearchModal(false));
  }

  input.addEventListener('input', (e) => {
    const query = e.target.value;
    container.innerHTML = renderSearchModalContent(query);
    attachSearchModalEvents(container);
    const newInput = container.querySelector('#palette-search-input');
    newInput.focus();
    newInput.setSelectionRange(query.length, query.length);
  });

  container.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('click', () => {
      const href = item.getAttribute('data-href');
      if (href) {
        toggleSearchModal(false);
        window.location.hash = href;
      }
    });
  });
}
