/**
 * 🇮🇳 BHARAT SAFE YATRA — HOMEPAGE VIEW
 * Cinematic 8-UT Carousel, Quick Search, Editorial Grids, Itinerary & Safety Teasers
 */

import { TERRITORIES } from '../data/territories.js';
import { DESTINATIONS } from '../data/destinations.js';
import { FESTIVALS } from '../data/festivals.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

let carouselInterval = null;
let currentSlideIndex = 0;

export function renderHomeView() {
  const popularDestinations = DESTINATIONS.slice(0, 6);
  const featuredFestivals = FESTIVALS.slice(0, 4);
  const savedPlaces = new Set(store.getState().savedPlaces);

  const experienceCategories = [
    { title: "Adventure & Trekking", icon: "🏔️", count: "48 Trails", desc: "High passes, glacial treks, and diving atoll reefs", category: "Adventure" },
    { title: "Heritage & Architecture", icon: "🏛️", count: "120+ Monuments", desc: "UNESCO modernism, Mughal citadels, and Portuguese forts", category: "Heritage" },
    { title: "Coastal & Island Waters", icon: "🌊", count: "14 Blue Flag & Coral Beaches", desc: "Bioluminescent lagoons, scuba diving, and surfing", category: "Nature" },
    { title: "Spiritual & Meditation", icon: "🕊️", count: "35 Sacred Sanctuaries", desc: "Ancient Buddhist Gompas, Sufi shrines, and ashrams", category: "Spiritual" },
    { title: "Cuisine & Culture", icon: "🍲", count: "8 Distinct Gastronomies", desc: "Wazwan feasts, Franco-Tamil bistros, and coastal curries", category: "Culture" },
    { title: "Dark Sky & Astro-Tourism", icon: "🌌", count: "Bortle-1 Reserves", desc: "Pristine stargazing in Hanle and high-altitude Changthang", category: "Photography" }
  ];

  return `
    <main role="main">
      
      <!-- =========================================================================
           1. FULL-WIDTH CINEMATIC HERO CAROUSEL (8 UNION TERRITORIES)
           ========================================================================= -->
      <section class="hero-carousel" id="hero-carousel" aria-label="Union Territories Showcase Carousel">
        
        ${TERRITORIES.map((ut, idx) => `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
            <div class="hero-slide-bg" style="background-image: url('${ut.heroImage}');"></div>
            <div class="hero-scrim"></div>
            
            <div class="container hero-content">
              <div class="hero-ut-tag">
                <span>🏛️ ${ut.name.toUpperCase()}</span>
              </div>
              
              <h1 class="hero-title">${ut.name.toUpperCase()}</h1>
              
              <p class="hero-description">${ut.tagline}</p>
              
              <div class="hero-actions">
                <a href="#/territories/${ut.slug}" class="btn btn-lg btn-secondary">
                  Discover ${ut.shortName}
                </a>
                <a href="#/itinerary" class="btn btn-lg btn-outline" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border-color: rgba(255, 255, 255, 0.4); backdrop-filter: blur(8px);">
                  Plan This Trip ↗
                </a>
                <div style="display: flex; align-items: center; gap: 6px; margin-left: 8px;">
                  <span class="status-dot status-dot-live"></span>
                  <span style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">${ut.weatherSnapshot.temp}°C • ${ut.weatherSnapshot.condition}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Carousel Navigation Controls -->
        <div class="hero-controls">
          <button class="btn btn-ghost btn-sm btn-icon-only" id="hero-prev-btn" style="color: #ffffff; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.2);" aria-label="Previous Slide">
            ‹
          </button>
          
          <div class="hero-pagination-dots" id="hero-dots-container">
            ${TERRITORIES.map((_, idx) => `
              <div class="hero-dot ${idx === 0 ? 'active' : ''}" data-dot="${idx}" aria-label="Slide ${idx + 1}"></div>
            `).join('')}
          </div>

          <button class="btn btn-ghost btn-sm btn-icon-only" id="hero-next-btn" style="color: #ffffff; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.2);" aria-label="Next Slide">
            ›
          </button>
        </div>

      </section>

      <!-- =========================================================================
           2. QUICK SEARCH BAR (BELOW HERO)
           ========================================================================= -->
      <section class="container quick-search-wrapper" aria-label="Quick Search Engine">
        <form class="quick-search-card" id="home-quick-search-form">
          
          <!-- Destination Field -->
          <div class="search-input-group">
            <label class="search-label" for="qs-destination">Where to?</label>
            <input type="text" id="qs-destination" class="search-input" placeholder="Search 8 UTs (Ladakh, Andaman, Delhi...)" />
          </div>

          <!-- Travel Dates Field -->
          <div class="search-input-group">
            <label class="search-label" for="qs-dates">Travel Season / Month</label>
            <select id="qs-dates" class="search-input">
              <option value="ALL">All Seasons (Verified)</option>
              <option value="MAY_SEP">Summer Peak (May – Sep)</option>
              <option value="OCT_MAR">Winter / Autumn (Oct – Mar)</option>
              <option value="MONSOON">Monsoon Wonders (Jul – Aug)</option>
            </select>
          </div>

          <!-- Travel Style Field -->
          <div class="search-input-group">
            <label class="search-label" for="qs-interest">Travel Style</label>
            <select id="qs-interest" class="search-input">
              <option value="ALL">All Travel Styles</option>
              <option value="Adventure">Adventure & Trekking</option>
              <option value="Heritage">Heritage & Architecture</option>
              <option value="Nature">Pristine Nature & Lakes</option>
              <option value="Photography">Photography & Stargazing</option>
            </select>
          </div>

          <!-- Search CTA -->
          <button type="submit" class="btn btn-lg btn-primary" style="align-self: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>

        </form>
      </section>

      <!-- =========================================================================
           3. POPULAR ACROSS BHARAT (EDITORIAL DESTINATION GRID)
           ========================================================================= -->
      <section class="section-spacing container" aria-label="Popular Verified Destinations">
        <div class="section-header-row">
          <div>
            <h2>Popular Across Bharat</h2>
            <p class="sub-text">Hand-picked destinations with verified coordinates, entry guidelines, and seasonal intelligence.</p>
          </div>
          <a href="#/destinations" class="btn btn-outline">View All Destinations →</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
          ${popularDestinations.map(dest => `
            <article class="destination-card card-hoverable">
              
              <div class="destination-card-media">
                <img src="${dest.image}" alt="${dest.name}" class="destination-card-img" loading="lazy" />
                <div class="destination-card-badges">
                  <span class="badge badge-neutral" style="background: rgba(0,0,0,0.6); color: #ffffff;">${dest.type}</span>
                  <button class="btn btn-sm btn-ghost btn-icon-only bookmark-btn" 
                          data-id="${dest.id}"
                          style="background: rgba(15, 23, 42, 0.6); color: ${savedPlaces.has(dest.id) ? '#f59e0b' : '#ffffff'}; border-radius: 50%; width: 34px; height: 34px;" 
                          aria-label="Save ${dest.name}">
                    ${savedPlaces.has(dest.id) ? '★' : '☆'}
                  </button>
                </div>
              </div>

              <div class="destination-card-body">
                <div class="destination-card-location">${dest.territoryName} • ${dest.type}</div>
                <h3 class="destination-card-title">${dest.name}</h3>
                <p class="destination-card-desc">${dest.shortDescription}</p>
                
                <div class="destination-card-footer">
                  <span style="font-weight: 600; color: var(--color-text-secondary);">${dest.weather.bestTime}</span>
                  <div style="display: flex; gap: 6px;">
                    <a href="#/destinations/${dest.slug}" class="btn btn-sm btn-outline">Details</a>
                    <button class="btn btn-sm btn-primary add-to-trip-btn" data-dest='${JSON.stringify({ id: dest.id, name: dest.name, type: dest.type })}'>
                      + Itinerary
                    </button>
                  </div>
                </div>
              </div>

            </article>
          `).join('')}
        </div>
      </section>

      <!-- =========================================================================
           4. 8 UNION TERRITORIES DISTINCTIVE EXPLORER
           ========================================================================= -->
      <section class="section-spacing" style="background-color: var(--color-bg-surface-elevated);" aria-label="8 Union Territories Explorer">
        <div class="container">
          <div class="section-header">
            <h2>Explore the 8 Union Territories</h2>
            <p class="sub-text">From the trans-Himalayan summits of Ladakh to the tropical coral lagoons of Lakshadweep.</p>
          </div>

          <div class="ut-grid">
            ${TERRITORIES.map(ut => `
              <a href="#/territories/${ut.slug}" class="ut-card card-hoverable" style="background-image: url('${ut.thumbnailImage}');">
                <div class="ut-card-content">
                  <span class="badge badge-neutral" style="background: rgba(255,255,255,0.2); color: #ffffff; margin-bottom: 6px; font-size: 0.7rem;">
                    Capital: ${ut.capital}
                  </span>
                  <h3 class="ut-card-name">${ut.name}</h3>
                  <p class="ut-card-tagline">${ut.tagline}</p>
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--brand-terracotta-500);">
                    Explore Territory →
                  </span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- =========================================================================
           5. SIGNATURE EXPERIENCES
           ========================================================================= -->
      <section class="section-spacing container" aria-label="Signature Experience Categories">
        <div class="section-header">
          <h2>Travel by Experience</h2>
          <p class="sub-text">Filter across curated journeys tailored for adventure seekers, heritage lovers, and culinary explorers.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg);">
          ${experienceCategories.map(exp => `
            <div class="card card-hoverable" style="padding: var(--space-lg); cursor: pointer;" onclick="window.location.hash='#/destinations'">
              <div style="font-size: 2.2rem; margin-bottom: 12px;">${exp.icon}</div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">${exp.count}</div>
              <h3 style="font-size: 1.15rem; margin: 4px 0 8px;">${exp.title}</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.45;">${exp.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- =========================================================================
           6. 2026 FESTIVAL CALENDAR HIGHLIGHTS (STRICT DATE PRECISION)
           ========================================================================= -->
      <section class="section-spacing" style="background-color: var(--color-bg-surface-elevated);" aria-label="2026 Cultural Festival Calendar">
        <div class="container">
          <div class="section-header-row">
            <div>
              <h2>Cultural Festivals & Events</h2>
              <p class="sub-text">Verified festival schedules with explicit date precisions directly from UT Tourism departments.</p>
            </div>
            <a href="#/festivals" class="btn btn-outline">Full 2026 Calendar →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: var(--space-lg);">
            ${featuredFestivals.map(fest => `
              <div class="festival-card">
                <div class="festival-date-badge">
                  <span>📅</span>
                  <span>${fest.displayDate}</span>
                </div>
                <h3 style="font-size: 1.15rem; color: var(--color-text-primary); margin-top: 4px;">${fest.name}</h3>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">${fest.location} (${fest.territoryName})</div>
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.5; flex-grow: 1;">${fest.description}</p>
                <div style="padding-top: 10px; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge badge-neutral">${fest.datePrecision}</span>
                  <a href="#/festivals" style="font-size: 0.825rem; font-weight: 700; color: var(--color-primary);">View Details →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- =========================================================================
           7. SMART ITINERARY & GEOSPATIAL MAP TEASER BANNERS
           ========================================================================= -->
      <section class="section-spacing container" aria-label="Product Features">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: var(--space-xl);">
          
          <!-- Itinerary Teaser Card -->
          <div class="card" style="background: linear-gradient(135deg, var(--brand-navy-900) 0%, var(--brand-navy-700) 100%); color: #ffffff; padding: var(--space-2xl); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-neutral" style="background: rgba(255,255,255,0.15); color: #ffffff; margin-bottom: 12px;">
                Dynamic Travel Companion
              </span>
              <h2 style="color: #ffffff; font-size: 1.75rem; margin-bottom: 12px;">Smart Interactive Itinerary Planner</h2>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
                Build, edit, and reorder multi-day trips with instant route calculations, budget tracking, weather updates, and AI duration resizing (3, 5, 7, or 10 days).
              </p>
            </div>
            <div>
              <a href="#/itinerary" class="btn btn-secondary">Open Itinerary Studio →</a>
            </div>
          </div>

          <!-- Geospatial Map Teaser Card -->
          <div class="card" style="background: linear-gradient(135deg, hsl(215, 45%, 15%) 0%, hsl(215, 60%, 25%) 100%); color: #ffffff; padding: var(--space-2xl); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-neutral" style="background: rgba(255,255,255,0.15); color: #ffffff; margin-bottom: 12px;">
                PostGIS-Aware Geospatial Engine
              </span>
              <h2 style="color: #ffffff; font-size: 1.75rem; margin-bottom: 12px;">Interactive 3D Navigation & Routes</h2>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
                Explore all 8 UTs with classified marker pins for attractions, hotels, restaurants, festivals, and life safety emergency services with live radius filtering.
              </p>
            </div>
            <div>
              <a href="#/map" class="btn btn-outline" style="color: #ffffff; border-color: rgba(255,255,255,0.4);">Launch Fullscreen Map ↗</a>
            </div>
          </div>

        </div>
      </section>

      <!-- =========================================================================
           8. YATRA SAFE & SOS EMERGENCY BANNER
           ========================================================================= -->
      <section class="container" style="margin-bottom: var(--space-3xl);" aria-label="Life Safety & SOS Emergency">
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%); border: 2px solid #fecaca; border-radius: var(--radius-xl); padding: var(--space-xl); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-lg);">
          
          <div style="max-width: 680px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="badge badge-danger">🚨 Life Safety Protocol</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-emergency);">National Helpline: 112 • Tourist Support: 1363</span>
            </div>
            <h3 style="font-size: 1.4rem; color: #991b1b; margin-bottom: 6px;">Travel Safely with Real-Time Emergency Grounding</h3>
            <p style="font-size: 0.875rem; color: #7f1d1d; line-height: 1.5;">
              Bharat Safe Yatra maintains verified trauma centers, high-altitude oxygen facilities, coast guard stations, and real-time travel advisories across every Union Territory.
            </p>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-emergency btn-lg" onclick="window.dispatchEvent(new CustomEvent('trigger-sos'))">
              🚨 Trigger SOS Assistance
            </button>
            <a href="#/safety" class="btn btn-outline" style="border-color: #f87171; color: #991b1b; background: #ffffff;">
              View Safety Directory →
            </a>
          </div>

        </div>
      </section>

    </main>
  `;
}

export function attachHomeEvents() {
  // Hero Carousel Autoplay & Controls
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  function goToSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) {
      dots[currentSlideIndex].classList.add('active');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(carouselInterval);
      goToSlide(currentSlideIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(carouselInterval);
      goToSlide(currentSlideIndex + 1);
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-dot'), 10);
      clearInterval(carouselInterval);
      goToSlide(idx);
      startAutoplay();
    });
  });

  function startAutoplay() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 6000);
  }

  startAutoplay();

  // Quick Search Form
  const searchForm = document.getElementById('home-quick-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destQuery = document.getElementById('qs-destination').value.trim();
      if (destQuery) {
        window.location.hash = `#/search?q=${encodeURIComponent(destQuery)}`;
      } else {
        window.location.hash = '#/destinations';
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
        title: `Explore ${dest.name}`,
        type: dest.type || "DESTINATION",
        notes: "Added from popular destinations showcase"
      });
      showToast(`Added ${dest.name} to Day 1 of your trip!`, "success");
    });
  });
}
