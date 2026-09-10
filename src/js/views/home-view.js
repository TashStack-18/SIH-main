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
    { title: "High-Altitude Expeditions", tag: "Trails & Alpine Treks", desc: "Chadar frozen river traverses, high Himalayan passes, and scenic trans-territory trails.", category: "Adventure" },
    { title: "Living Heritage & Forts", tag: "Monuments & Citadels", desc: "Centuries of architectural marvels, ancient Buddhist gompas, and royal Mughal fortresses.", category: "Heritage" },
    { title: "Coastal & Coral Escapes", tag: "Islands & Marine Life", desc: "Turquoise atolls, bioluminescent night shores, and premier scuba diving expeditions.", category: "Nature" },
    { title: "Spiritual & Sacred Sanctuaries", tag: "Peace & Pilgrimage", desc: "Tranquil monastery retreats, historic Sufi shrines, and reflective coastal ashrams.", category: "Spiritual" },
    { title: "Regional Culinary Journeys", tag: "Authentic Gastronomy", desc: "Multi-course Kashmiri wazwan feasts, Franco-Tamil bistros, and fresh coastal delicacies.", category: "Culture" },
    { title: "Dark Sky & Astro-Tourism", tag: "Stargazing & Reserves", desc: "Unrivaled stargazing under pristine Bortle-1 dark skies across the Hanle plateau.", category: "Photography" }
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
              <div class="hero-text-block">
                <h1 class="hero-title">${ut.heroLabel || ut.name}</h1>
                <p class="hero-description">${ut.heroDescription || ut.tagline}</p>
              </div>
              
              <div class="hero-bottom-block">
                <div class="hero-actions">
                  <a href="#/destinations?ut=${ut.slug}" class="btn btn-lg btn-secondary">
                    Discover ${ut.shortName}
                  </a>
                  <a href="#/itinerary" class="btn btn-lg btn-outline" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border-color: rgba(255, 255, 255, 0.4); backdrop-filter: blur(8px);">
                    Plan This Trip ↗
                  </a>
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
          <div class="section-header-row" style="margin-bottom: var(--space-2xl);">
            <div>
              <h2>Explore the 8 Union Territories</h2>
              <p class="sub-text">From the trans-Himalayan summits of Ladakh to the tropical coral lagoons of Lakshadweep.</p>
            </div>
            <a href="#/destinations" class="btn btn-outline" style="border-radius: var(--radius-pill); padding: 10px 22px; font-weight: 600;">All Destinations →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-xl);">
            ${TERRITORIES.map(ut => `
              <a href="#/destinations?ut=${ut.slug}" class="card card-hoverable" style="position: relative; height: 360px; border-radius: var(--radius-xl, 20px); overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; text-decoration: none; box-shadow: var(--shadow-card); border: 1px solid var(--color-border-subtle); transition: transform 0.3s ease, box-shadow 0.3s ease;">
                <!-- Full-bleed background image -->
                <img src="${ut.heroImage || ut.thumbnailImage}" alt="${ut.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" loading="lazy" />
                
                <!-- Dark gradient overlay -->
                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 100%);"></div>

                <!-- Text Content Overlay -->
                <div style="position: relative; z-index: 2; display: flex; flex-direction: column; gap: 10px;">
                  <h3 style="font-family: var(--font-family-serif); font-size: 1.45rem; font-weight: 700; color: #FFFFFF; margin: 0; line-height: 1.25; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                    ${ut.name}
                  </h3>
                  <div>
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-brand-accent, #C88E44); display: inline-flex; align-items: center; gap: 4px; text-shadow: 0 1px 4px rgba(0,0,0,0.5);">
                      Explore →
                    </span>
                  </div>
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
        <div class="section-header" style="margin-bottom: var(--space-2xl);">
          <h2>Travel by Experience</h2>
          <p class="sub-text">Curated journeys designed for high-altitude explorers, heritage seekers, and cultural connoisseurs.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
          ${experienceCategories.map(exp => `
            <div class="card card-hoverable" style="padding: 24px; cursor: pointer; display: flex; flex-direction: column; background: var(--color-bg-surface); border-radius: var(--radius-xl, 20px); border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-subtle);" onclick="window.location.hash='#/destinations'">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(200, 142, 68, 0.12); color: var(--color-brand-accent); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700;">
                  ✦
                </div>
                <span style="font-size: 0.725rem; font-weight: 700; color: var(--color-brand-accent); text-transform: uppercase; letter-spacing: 0.06em; background: var(--color-bg-canvas); padding: 4px 10px; border-radius: 9999px; border: 1px solid var(--color-border-subtle);">
                  ${exp.tag}
                </span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 8px; color: var(--color-text-primary);">${exp.title}</h3>
              <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.55; margin: 0 0 16px; flex-grow: 1;">${exp.desc}</p>
              <div style="font-size: 0.825rem; font-weight: 600; color: var(--color-brand-accent); display: inline-flex; align-items: center; gap: 4px;">Explore Journeys →</div>
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
                  <span>${fest.displayDate}</span>
                </div>
                <h3 style="font-size: 1.15rem; color: var(--color-text-primary); margin-top: 4px;">${fest.name}</h3>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">${fest.location} (${fest.territoryName})</div>
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.5; flex-grow: 1;">${fest.description}</p>
                <div style="padding-top: 10px; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.775rem; color: #78685C; font-weight: 600;">${fest.category}</span>
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
