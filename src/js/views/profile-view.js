/**
 * 🇮🇳 BHARAT SAFE YATRA — USER PROFILE & PREFERENCES
 * Profile, Wishlist Bookmarks, Trip History & Emergency Contacts
 */

import { store } from '../stores/store.js';
import { DESTINATIONS } from '../data/destinations.js';
import { showToast } from '../components/toast.js';

export function renderProfileView() {
  const state = store.getState();
  const prefs = state.preferences;
  const savedIds = new Set(state.savedPlaces);
  const savedDestinations = DESTINATIONS.filter(d => savedIds.has(d.id));

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-verified" style="width: fit-content;">Yatri Vault</span>
        <h1>My Profile & Travel Vault</h1>
        <p class="lead-text">Manage your travel preferences, saved destinations, and trusted emergency contacts.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-2xl);">
        
        <!-- User Preferences & Profile Info -->
        <div class="card" style="padding: var(--space-xl);">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: #ffffff; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; font-weight: 800;">
              BY
            </div>
            <div>
              <h2 style="font-size: 1.3rem; margin-bottom: 2px;">${prefs.name}</h2>
              <div style="font-size: 0.85rem; color: var(--color-text-muted);">Verified Bharat Yatri • SIH 2026 Demo Profile</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1rem; color: var(--color-text-primary); margin-bottom: 8px;">Preferred Travel Styles</h3>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${prefs.travelStyles.map(s => `
                <span class="badge badge-verified">${s}</span>
              `).join('')}
            </div>
          </div>

          <div style="background: var(--color-bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); margin-bottom: 20px;">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-emergency); margin-bottom: 4px;">
              Primary Emergency Contact
            </div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-text-primary);">${prefs.emergencyContact.name} (${prefs.emergencyContact.relation})</div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">${prefs.emergencyContact.phone}</div>
          </div>

          <button class="btn btn-outline" style="width: 100%;" onclick="showToast('Preferences updated in Yatra Vault.', 'success')">
            ⚙️ Edit Preferences
          </button>
        </div>

        <!-- Saved Places / Wishlist -->
        <div class="card" style="padding: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.25rem;">Saved Destinations (${savedDestinations.length})</h3>
            <span class="badge badge-neutral">Wishlist</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${savedDestinations.map(d => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--color-bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${d.image}" alt="${d.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;" />
                  <div>
                    <a href="#/destinations/${d.slug}" style="font-weight: 700; font-size: 0.925rem; color: var(--color-text-primary); display: block;">
                      ${d.name}
                    </a>
                    <span style="font-size: 0.775rem; color: var(--color-text-muted);">${d.territoryName}</span>
                  </div>
                </div>

                <div style="display: flex; gap: 6px;">
                  <a href="#/destinations/${d.slug}" class="btn btn-sm btn-outline">View</a>
                  <button class="btn btn-sm btn-ghost remove-saved-btn" data-id="${d.id}" style="color: var(--color-danger);">✕</button>
                </div>
              </div>
            `).join('')}

            ${savedDestinations.length === 0 ? `
              <div style="padding: 32px; text-align: center; color: var(--color-text-muted);">
                No saved destinations yet. Explore the 8 UTs and click the star icon to save places.
              </div>
            ` : ''}
          </div>
        </div>

      </div>

    </main>
  `;
}

export function attachProfileEvents() {
  document.querySelectorAll('.remove-saved-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      store.toggleSavePlace(id);
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderProfileView();
        attachProfileEvents();
        showToast("Destination removed from bookmarks.", "info");
      }
    });
  });
}
