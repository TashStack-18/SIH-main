/**
 * 🇮🇳 BHARAT SAFE YATRA — GEOSPATIAL MAP EXPERIENCE (70/30 SPLIT)
 * 2D/3D Terrain Toggle, 6 SVG Pin Types, Itinerary Polyline & Emergency Radius
 */

import { DESTINATIONS } from '../data/destinations.js';
import { EMERGENCY_FACILITIES } from '../data/safety.js';
import { FESTIVALS } from '../data/festivals.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

let activeCategory = 'ALL';
let is3DMode = false;
let selectedEntity = DESTINATIONS[0];

export function renderMapView() {
  const itinerary = store.getState().itinerary;

  // Itinerary route stops (Leh -> Khardung La -> Hunder -> Pangong -> Chang La -> Leh)
  const routeStops = [
    { name: "Leh Capital (3,256m)", lat: 34.1526, lng: 77.5771, type: "START" },
    { name: "Khardung La Pass (5,359m)", lat: 34.2792, lng: 77.6047, type: "PASS" },
    { name: "Hunder Sand Dunes (3,048m)", lat: 34.5800, lng: 77.4600, type: "STOP" },
    { name: "Pangong Tso (4,350m)", lat: 33.7530, lng: 78.6670, type: "LAKE" },
    { name: "Chang La Pass (5,360m)", lat: 34.0500, lng: 77.9300, type: "PASS" }
  ];

  return `
    <main class="map-layout" role="main">
      
      <!-- 70% Geospatial Viewport -->
      <section class="map-viewport-container" id="map-canvas-container" aria-label="Interactive Map">
        
        <!-- Floating Map Controls -->
        <div class="map-controls-floating">
          <button class="map-control-btn" id="map-zoom-in" aria-label="Zoom In">+</button>
          <button class="map-control-btn" id="map-zoom-out" aria-label="Zoom Out">-</button>
          <button class="map-control-btn" id="map-3d-toggle" aria-label="Toggle 2D / 3D Terrain">
            <span style="font-size: 0.75rem; font-weight: 800;">${is3DMode ? '3D' : '2D'}</span>
          </button>
          <button class="map-control-btn" id="map-locate-me" aria-label="Locate User Position">
            📍
          </button>
          <button class="map-control-btn" id="map-fit-route" aria-label="Fit Itinerary Route">
            🛣️
          </button>
        </div>

        <!-- Custom Geospatial Canvas/SVG Rendering -->
        <svg width="100%" height="100%" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid slice" style="background: ${is3DMode ? 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f19 100%)' : '#0f172a'};">
          
          <!-- Topographic Grid Lines & Elevation Shading -->
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="50%" stop-color="#2563eb"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          <!-- Simulated India 8-UT Geospatial Landmass Contours -->
          <path d="M 420 80 Q 480 60 520 100 T 560 160 T 500 240 T 430 200 Z" fill="rgba(37, 99, 235, 0.08)" stroke="rgba(56, 189, 248, 0.25)" stroke-width="2" />
          <text x="460" y="110" fill="rgba(255,255,255,0.4)" font-size="12" font-weight="700" letter-spacing="2">LADAKH REGION</text>

          <path d="M 360 130 Q 400 110 430 150 T 400 210 Z" fill="rgba(37, 99, 235, 0.06)" stroke="rgba(56, 189, 248, 0.2)" stroke-width="1.5" />
          <text x="375" y="160" fill="rgba(255,255,255,0.3)" font-size="10" font-weight="600">J&K</text>

          <circle cx="440" cy="220" r="18" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.5)" />
          <text x="445" y="224" fill="#fbbf24" font-size="9" font-weight="700">DELHI</text>

          <circle cx="415" cy="195" r="14" fill="rgba(52, 211, 153, 0.15)" stroke="rgba(52, 211, 153, 0.5)" />
          <text x="420" y="198" fill="#34d399" font-size="9" font-weight="700">CHD</text>

          <path d="M 850 480 Q 865 520 860 560 T 870 600" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="3" stroke-dasharray="4,4" />
          <text x="760" y="520" fill="rgba(255,255,255,0.35)" font-size="10" font-weight="700">ANDAMAN & NICOBAR</text>

          <circle cx="340" cy="540" r="22" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.4)" />
          <text x="280" y="545" fill="rgba(255,255,255,0.4)" font-size="10" font-weight="700">LAKSHADWEEP</text>

          <!-- Active Ladakh Itinerary Route Polyline -->
          <g id="itinerary-route-layer">
            <polyline points="470,140 485,115 510,95 560,110 525,145 470,140" 
                      fill="none" 
                      stroke="url(#routeGradient)" 
                      stroke-width="4" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                      filter="url(#glow)" />
            
            <!-- Animated Route Flow -->
            <polyline points="470,140 485,115 510,95 560,110 525,145 470,140" 
                      fill="none" 
                      stroke="#ffffff" 
                      stroke-width="2" 
                      stroke-dasharray="8,12" 
                      stroke-linecap="round" />
          </g>

          <!-- Route Stops Pins -->
          <g id="map-pins-layer">
            <!-- Stop 1: Leh -->
            <g class="map-pin-node" data-id="leh" transform="translate(470, 140)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="14" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="800">1</text>
              <text x="0" y="26" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700" filter="url(#glow)">Leh (Start)</text>
            </g>

            <!-- Stop 2: Khardung La -->
            <g class="map-pin-node" data-id="khardung-la" transform="translate(485, 115)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="12" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="800">2</text>
              <text x="0" y="24" text-anchor="middle" fill="#bae6fd" font-size="10" font-weight="600">Khardung La</text>
            </g>

            <!-- Stop 3: Hunder Nubra -->
            <g class="map-pin-node" data-id="hunder" transform="translate(510, 95)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="12" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="800">3</text>
              <text x="0" y="24" text-anchor="middle" fill="#bae6fd" font-size="10" font-weight="600">Hunder Dunes</text>
            </g>

            <!-- Stop 4: Pangong Tso -->
            <g class="map-pin-node" data-id="pangong-tso" transform="translate(560, 110)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="16" fill="#f59e0b" stroke="#ffffff" stroke-width="3" filter="url(#glow)" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">4</text>
              <text x="0" y="28" text-anchor="middle" fill="#fde68a" font-size="12" font-weight="800">Pangong Tso</text>
            </g>

            <!-- Stop 5: Chang La -->
            <g class="map-pin-node" data-id="chang-la" transform="translate(525, 145)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="12" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="800">5</text>
              <text x="0" y="24" text-anchor="middle" fill="#bae6fd" font-size="10" font-weight="600">Chang La</text>
            </g>

            <!-- Emergency Hospital Marker Pin -->
            <g class="map-pin-node" data-id="snm-hospital" transform="translate(460, 155)" style="cursor: pointer;">
              <circle cx="0" cy="0" r="13" fill="#dc2626" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">✚</text>
              <text x="0" y="24" text-anchor="middle" fill="#fecaca" font-size="10" font-weight="700">SNM Hospital</text>
            </g>
          </g>
        </svg>

        <!-- Live Route HUD Tag -->
        <div style="position: absolute; bottom: 24px; left: 24px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: var(--radius-md); padding: 12px 18px; color: #ffffff; display: flex; align-items: center; gap: 16px;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--brand-terracotta-500); text-transform: uppercase;">Active Route Simulation</div>
            <div style="font-size: 1.1rem; font-weight: 700;">Leh → Nubra → Pangong Tso (Circuit)</div>
          </div>
          <div style="border-left: 1px solid rgba(255,255,255,0.2); padding-left: 16px;">
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7);">Total Distance / Time</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: #38bdf8;">~340 km • 9h 45m drive</div>
          </div>
        </div>

      </section>

      <!-- 30% Information & Controls Sidebar -->
      <aside class="map-sidebar" role="complementary" aria-label="Map Controls and Destination Info">
        
        <!-- Layer Filters -->
        <div>
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">
            Map Layer Filter
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${["ALL", "Attractions", "Hotels", "Festivals", "Emergency"].map(cat => `
              <button class="badge ${activeCategory === cat ? 'badge-official' : 'badge-neutral'} map-filter-chip" data-cat="${cat}" style="cursor: pointer;">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Selected Entity Card -->
        <div class="card" style="padding: var(--space-lg); border-color: var(--color-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="badge badge-verified">✓ Selected Stop</span>
            <span class="font-mono" style="font-size: 0.75rem; color: var(--color-text-muted);">4,350 m Altitude</span>
          </div>

          <h3 style="font-size: 1.35rem; margin-bottom: 4px;">Pangong Tso</h3>
          <div style="font-size: 0.825rem; font-weight: 600; color: var(--color-primary); margin-bottom: 10px;">Ladakh • Trans-Himalayan Lake</div>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 14px;">
            Endorheic salt lake known for vibrant blue and emerald color changes. Minimum 48-hour acclimatization required.
          </p>

          <div style="background: var(--color-bg-surface-elevated); padding: 10px; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 14px;">
            <div><strong>Route Segment:</strong> Day 3 of Active Itinerary</div>
            <div><strong>Driving Distance from Leh:</strong> 140 km via Chang La</div>
          </div>

          <div style="display: flex; gap: 8px;">
            <a href="#/destinations/pangong-tso" class="btn btn-sm btn-primary" style="flex-grow: 1;">
              Explore Destination
            </a>
            <button class="btn btn-sm btn-outline" onclick="store.toggleSOS(true)">
              🚨 Emergency
            </button>
          </div>
        </div>

        <!-- Nearby Emergency Facilities in Radius -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-emergency);">
              Verified Emergency Facilities
            </span>
            <span class="badge badge-danger">PostGIS 50km Radius</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${EMERGENCY_FACILITIES.slice(0, 2).map(ef => `
              <div style="background: var(--color-bg-surface-elevated); border: 1px solid var(--color-border-subtle); padding: 10px 14px; border-radius: var(--radius-md);">
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--color-text-primary);">${ef.name}</div>
                <div style="font-size: 0.775rem; color: var(--color-text-muted);">${ef.address}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--color-border-subtle);">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-success);">● 24x7 Trauma Unit</span>
                  <a href="tel:${ef.phone}" style="font-size: 0.8rem; font-weight: 700; color: var(--color-emergency);">📞 ${ef.phone}</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </aside>

    </main>
  `;
}

export function attachMapEvents() {
  const toggle3DBtn = document.getElementById('map-3d-toggle');
  if (toggle3DBtn) {
    toggle3DBtn.addEventListener('click', () => {
      is3DMode = !is3DMode;
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderMapView();
        attachMapEvents();
        showToast(is3DMode ? "3D Terrain Mode enabled" : "Standard 2D Map view enabled", "info");
      }
    });
  }

  const zoomIn = document.getElementById('map-zoom-in');
  const zoomOut = document.getElementById('map-zoom-out');
  if (zoomIn) {
    zoomIn.addEventListener('click', () => showToast("Zoom In (Simulated vector map zoom)", "info"));
  }
  if (zoomOut) {
    zoomOut.addEventListener('click', () => showToast("Zoom Out", "info"));
  }

  const locateBtn = document.getElementById('map-locate-me');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      showToast("Current simulated GPS: Leh, Ladakh (34.1526° N, 77.5771° E)", "success");
    });
  }

  const fitRouteBtn = document.getElementById('map-fit-route');
  if (fitRouteBtn) {
    fitRouteBtn.addEventListener('click', () => {
      showToast("Camera bounds fitted to 5-day Ladakh Itinerary route.", "success");
    });
  }

  // Filter chips
  document.querySelectorAll('.map-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.getAttribute('data-cat');
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderMapView();
        attachMapEvents();
      }
    });
  });

  // Pin click interactions
  document.querySelectorAll('.map-pin-node').forEach(pin => {
    pin.addEventListener('click', () => {
      const id = pin.getAttribute('data-id');
      showToast(`Selected map location: ${id}`, "info");
    });
  });
}
