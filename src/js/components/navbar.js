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
    { label: "Destinations", href: "#/destinations" },
    { label: "Itinerary", href: "#/itinerary" },
    { label: "Geospatial Map", href: "#/map" },
    { label: "Safety", href: "#/safety" }
  ];

  return `
    <header class="navbar" role="banner">
      <div class="container navbar-container">
        
        <!-- Brand Logo -->
        <a href="#/" class="brand-logo" aria-label="Bharat Safe Yatra Home">
          <div class="brand-badge">🇮🇳</div>
          <span>BHARAT SAFE YATRA</span>
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
            <span class="desktop-only" style="display: none;">Search...</span>
            <span class="kbd-shortcut">⌘K</span>
          </button>

          <!-- Yatra AI Companion Trigger -->
          <button class="btn btn-sm btn-outline" id="nav-ai-trigger" aria-label="Open Yatra AI Travel Companion">
            <span>🤖 Yatra AI</span>
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

          <!-- Emergency SOS Action -->
          <button class="btn btn-sm btn-emergency" id="nav-sos-btn" aria-label="Trigger Emergency SOS Center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>SOS</span>
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
