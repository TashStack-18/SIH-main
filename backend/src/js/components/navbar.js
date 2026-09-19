/**
 * 🇮🇳 BHARAT SAFE YATRA — NAVBAR COMPONENT
 * Responsive Top Header with Navigation, Universal Search (Cmd+K), AI & SOS
 */

import { store } from '../stores/store.js';

export function renderNavbar() {
  const state = store.getState();
  const currentRoute = state.currentRoute;
  const isDark = state.theme === 'dark';

  const navLinks = [
    { label: "Home", href: "#/" },
    { label: "Booking", href: "#/bookings" },
    { label: "Destinations", href: "#/destinations" },
    { label: "Itinerary", href: "#/itinerary" },
    { label: "Map", href: "#/map" }
  ];

  return `
    <header class="navbar" role="banner">
      <div class="container navbar-container">
        
        <!-- Pure Text Brand Wordmark -->
        <a href="#/" class="brand-logo" aria-label="Dishaara Home">
          <span class="brand-wordmark" style="font-size: 1.5rem; font-family: var(--font-family-serif);">Dishaara</span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links" role="navigation" aria-label="Main Navigation">
          ${navLinks.map(link => `
            <a href="${link.href}" 
               class="nav-link ${currentRoute === link.href ? 'active' : ''}">
              ${link.label}
            </a>
          `).join('')}
        </nav>

        <!-- Utility Actions -->
        <div class="navbar-actions">
          
          <!-- Universal Search Trigger (Cmd+K) -->
          <button class="search-trigger-btn" id="nav-search-trigger" aria-label="Search destinations, festivals, and emergency facilities (Press Cmd+K)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style="font-size: 0.8rem; margin: 0 4px;">Search...</span>
            <span class="kbd-shortcut">⌘K</span>
          </button>

          <!-- User Profile -->
          <a href="#/profile" class="btn btn-sm btn-ghost btn-icon-only" aria-label="User Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>

          <!-- Dark/Light Theme Switcher -->
          <button class="btn btn-sm btn-ghost btn-icon-only" id="theme-toggle-btn" aria-label="Toggle ${isDark ? 'Light' : 'Dark'} Mode">
            ${isDark ? `
              <!-- Sun Icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ` : `
              <!-- Moon Icon -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            `}
          </button>
        </div>

      </div>
    </header>
  `;
}

export function attachNavbarEvents() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => store.toggleTheme());
  }

  const searchBtn = document.getElementById('nav-search-trigger');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-search-palette'));
    });
  }

  const aiBtn = document.getElementById('nav-ai-trigger');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => store.toggleAI(true));
  }

  const sosBtn = document.getElementById('nav-sos-btn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => store.toggleSOS(true));
  }
}
