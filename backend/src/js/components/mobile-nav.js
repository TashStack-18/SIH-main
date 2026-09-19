/**
 * 🇮🇳 BHARAT SAFE YATRA — MOBILE NAVIGATION
 * Persistent Bottom App Bar + Floating Emergency SOS
 */

import { store } from '../stores/store.js';

export function renderMobileNav() {
  const currentRoute = store.getState().currentRoute;

  const items = [
    {
      label: "Home",
      href: "#/",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      label: "Explore",
      href: "#/territories",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`
    },
    {
      label: "Itinerary",
      href: "#/itinerary",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
    },
    {
      label: "Map",
      href: "#/map",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`
    },
    {
      label: "Profile",
      href: "#/profile",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    }
  ];

  return `
    <!-- Floating Mobile SOS Button -->
    <button class="mobile-floating-sos" id="mobile-floating-sos-btn" aria-label="Trigger Emergency SOS Center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>SOS</span>
    </button>

    <!-- Persistent Bottom Bar -->
    <nav class="mobile-nav" role="navigation" aria-label="Mobile Navigation">
      ${items.map(item => `
        <a href="${item.href}" class="mobile-nav-item ${currentRoute === item.href ? 'active' : ''}">
          ${item.icon}
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

export function attachMobileNavEvents() {
  const sosBtn = document.getElementById('mobile-floating-sos-btn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => store.toggleSOS(true));
  }
}
