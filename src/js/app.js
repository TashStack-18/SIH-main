/**
 * 🇮🇳 BHARAT SAFE YATRA — MAIN APPLICATION BOOTSTRAP
 * Phase 6 Frontend Experience Orchestrator
 */

import { store } from './stores/store.js';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderMobileNav, attachMobileNavEvents } from './components/mobile-nav.js';
import { renderFooter } from './components/footer.js';
import { renderAICompanion, attachAICompanionEvents } from './components/ai-companion.js';
import { renderSOSModal, attachSOSModalEvents } from './components/sos-modal.js';
import { initSearchModal } from './components/search-modal.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) return;

  // Render Global Shell Skeleton
  root.innerHTML = `
    <div id="navbar-root"></div>
    <div id="app-content"></div>
    <div id="footer-root"></div>
    <div id="mobile-nav-root"></div>
    <div id="ai-companion-root"></div>
    <div id="sos-modal-root"></div>
  `;

  // Render persistent Navbar & Footer
  updateNavbar();
  updateFooter();
  updateMobileNav();
  updateAICompanion();
  updateSOSModal();

  // Initialize Search Modal (Cmd+K)
  initSearchModal();

  // Initialize Client Router
  const appContent = document.getElementById('app-content');
  initRouter(appContent);

  // Subscribe to store updates for reactive UI components
  store.subscribe((state) => {
    updateNavbar();
    updateMobileNav();
    updateAICompanion();
    updateSOSModal();
  });

  // Global custom event listeners
  window.addEventListener('trigger-sos', () => {
    store.toggleSOS(true);
  });
});

function updateNavbar() {
  const container = document.getElementById('navbar-root');
  if (container) {
    container.innerHTML = renderNavbar();
    attachNavbarEvents();
  }
}

function updateFooter() {
  const container = document.getElementById('footer-root');
  if (container) {
    container.innerHTML = renderFooter();
  }
}

function updateMobileNav() {
  const container = document.getElementById('mobile-nav-root');
  if (container) {
    container.innerHTML = renderMobileNav();
    attachMobileNavEvents();
  }
}

function updateAICompanion() {
  const container = document.getElementById('ai-companion-root');
  if (container) {
    container.innerHTML = renderAICompanion();
    attachAICompanionEvents();
  }
}

function updateSOSModal() {
  const container = document.getElementById('sos-modal-root');
  if (container) {
    container.innerHTML = renderSOSModal();
    attachSOSModalEvents();
  }
}
