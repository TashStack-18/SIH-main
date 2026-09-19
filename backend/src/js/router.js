/**
 * 🇮🇳 BHARAT SAFE YATRA — CLIENT-SIDE HASH ROUTER
 * Seamless Deep Linking & State Synchronization
 */

import { store } from './stores/store.js';
import { renderHomeView, attachHomeEvents } from './views/home-view.js';
import { renderTerritoriesView } from './views/territories-view.js';
import { renderTerritoryDetailView } from './views/territory-detail-view.js';
import { renderDestinationsView, attachDestinationsEvents } from './views/destinations-view.js';
import { renderDestinationDetailView, attachDestinationDetailEvents } from './views/destination-detail-view.js';
import { renderFestivalsView, attachFestivalsEvents } from './views/festivals-view.js';
import { renderItineraryView, attachItineraryEvents } from './views/itinerary-view.js';
import { renderMapView, attachMapEvents } from './views/map-view.js';
import { renderBookingsView, attachBookingsEvents } from './views/bookings-view.js';
import { renderSafetyView, attachSafetyEvents } from './views/safety-view.js';
import { renderProfileView, attachProfileEvents } from './views/profile-view.js';
import { renderSearchView, attachSearchEvents } from './views/search-view.js';
import { renderAIView, attachAIEvents } from './views/ai-view.js';

export function initRouter(appRoot) {
  function handleRoute() {
    const hash = window.location.hash || '#/';
    store.setState({ currentRoute: hash });

    // Parse path and query
    const [pathPart, queryPart] = hash.split('?');
    const queryParams = new URLSearchParams(queryPart || '');

    // Match routes
    if (pathPart === '#/' || pathPart === '#' || pathPart === '') {
      appRoot.innerHTML = renderHomeView();
      attachHomeEvents();
    } else if (pathPart === '#/territories' || pathPart.startsWith('#/territories/')) {
      window.location.hash = '#/destinations';
      return;
    } else if (pathPart === '#/destinations') {
      appRoot.innerHTML = renderDestinationsView();
      attachDestinationsEvents();
    } else if (pathPart.startsWith('#/destinations/')) {
      const slug = pathPart.replace('#/destinations/', '');
      appRoot.innerHTML = renderDestinationDetailView(slug);
      attachDestinationDetailEvents(slug);
    } else if (pathPart === '#/festivals') {
      appRoot.innerHTML = renderFestivalsView();
      attachFestivalsEvents();
    } else if (pathPart === '#/itinerary') {
      appRoot.innerHTML = renderItineraryView();
      attachItineraryEvents();
    } else if (pathPart === '#/map') {
      appRoot.innerHTML = renderMapView();
      attachMapEvents();
    } else if (pathPart === '#/bookings') {
      appRoot.innerHTML = renderBookingsView();
      attachBookingsEvents();
    } else if (pathPart === '#/safety') {
      appRoot.innerHTML = renderSafetyView();
      attachSafetyEvents();
    } else if (pathPart === '#/profile') {
      appRoot.innerHTML = renderProfileView();
      attachProfileEvents();
    } else if (pathPart === '#/search') {
      const q = queryParams.get('q') || '';
      appRoot.innerHTML = renderSearchView(q);
      attachSearchEvents();
    } else if (pathPart === '#/ai') {
      appRoot.innerHTML = renderAIView();
      attachAIEvents();
    } else {
      appRoot.innerHTML = renderHomeView();
      attachHomeEvents();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active state in navbars
    updateNavbarActiveStates(hash);
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function updateNavbarActiveStates(hash) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === hash);
  });
}
