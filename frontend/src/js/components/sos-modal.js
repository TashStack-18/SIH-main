/**
 * 🇮🇳 BHARAT SAFE YATRA — SOS EMERGENCY MODAL
 * Deterministic, High-Priority Life Safety Workflow
 */

import { store } from '../stores/store.js';
import { EMERGENCY_NATIONAL_CONTACTS, EMERGENCY_FACILITIES } from '../data/safety.js';

export function renderSOSModal() {
  const state = store.getState();
  if (!state.sos.isOpen) return '';

  const loc = state.sos.userLocation;
  const hospital = state.sos.nearestHospital || EMERGENCY_FACILITIES[0];

  return `
    <div class="modal-backdrop" id="sos-modal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="sos-modal-title">
      <div class="sos-modal" id="sos-modal-box">
        
        <!-- Pulsing SOS Beacon Icon -->
        <div class="sos-beacon-ring">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 id="sos-modal-title" style="color: var(--color-emergency); font-size: 1.6rem; font-weight: 800;">
          EMERGENCY ASSISTANCE ACTIVE
        </h2>
        
        <p class="sub-text" style="margin-top: 4px; font-size: 0.9rem;">
          Your GPS Coordinates: <strong class="font-mono" style="color: var(--color-text-primary);">${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E</strong> (${loc.label})
        </p>

        <!-- Immediate Dialling Grid -->
        <div class="sos-numbers-grid">
          ${EMERGENCY_NATIONAL_CONTACTS.slice(0, 4).map(c => `
            <a href="tel:${c.number}" class="sos-number-card card-hoverable" style="text-decoration: none;">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted);">${c.service.toUpperCase()}</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-emergency);">${c.number}</div>
              <div style="font-size: 0.725rem; color: var(--color-text-secondary);">${c.description}</div>
            </a>
          `).join('')}
        </div>

        <!-- Nearest Hospital Card -->
        <div style="background: var(--color-bg-surface-elevated); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); padding: var(--space-md); text-align: left; margin-bottom: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="badge badge-danger">Nearest Verified Hospital</span>
            <span class="badge badge-verified">24x7 Emergency</span>
          </div>
          <div style="font-weight: 700; font-size: 1.05rem; color: var(--color-text-primary);">${hospital.name}</div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 8px;">${hospital.address}</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="tel:${hospital.emergencyPhone || hospital.phone}" class="btn btn-sm btn-emergency">
              📞 Call Hospital (${hospital.emergencyPhone || hospital.phone})
            </a>
            <button class="btn btn-sm btn-outline" id="sos-navigate-btn" data-coords="${hospital.coordinates.lat},${hospital.coordinates.lng}">
              📍 Navigate on Map
            </button>
          </div>
        </div>

        <!-- Close Action -->
        <button class="btn btn-outline" id="sos-close-btn" style="width: 100%;">
          Close Emergency Panel
        </button>

      </div>
    </div>
  `;
}

export function attachSOSModalEvents() {
  const backdrop = document.getElementById('sos-modal-backdrop');
  const box = document.getElementById('sos-modal-box');
  const closeBtn = document.getElementById('sos-close-btn');
  const navBtn = document.getElementById('sos-navigate-btn');

  if (backdrop && box) {
    backdrop.addEventListener('click', (e) => {
      if (!box.contains(e.target)) {
        store.toggleSOS(false);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.toggleSOS(false));
  }

  if (navBtn) {
    navBtn.addEventListener('click', () => {
      store.toggleSOS(false);
      window.location.hash = '#/map';
    });
  }
}
