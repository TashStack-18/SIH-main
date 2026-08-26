/**
 * 🇮🇳 BHARAT SAFE YATRA — FOOTER COMPONENT
 * Comprehensive Editorial Footer with Government Affiliations & Emergency Helplines
 */

import { FESTIVALS } from '../data/festivals.js';

export function renderFooter() {
  const upcomingFestivals = FESTIVALS.slice(0, 3);

  return `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        
        <!-- Main Footer Grid -->
        <div class="footer-grid">
          
          <!-- Column 1: Brand & Mission -->
          <div>
            <div class="brand-logo" style="margin-bottom: 12px;">
              <div class="brand-badge">🇮🇳</div>
              <span>BHARAT SAFE YATRA</span>
            </div>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 16px;">
              India's intelligent tourism and life safety platform covering all 8 Union Territories. Built for Smart India Hackathon (SIH 2026) with verified government knowledge grounding, geospatial routing, and AI assistance.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="badge badge-verified">100% Verified Data</span>
              <span class="badge badge-official">8 Union Territories</span>
            </div>
          </div>

          <!-- Column 2: Explore UTs & Places -->
          <div>
            <div class="footer-col-title">Explore Territories</div>
            <ul class="footer-links">
              <li><a href="#/territories/ladakh">Ladakh Trans-Himalaya</a></li>
              <li><a href="#/territories/andaman-and-nicobar">Andaman & Nicobar Islands</a></li>
              <li><a href="#/territories/jammu-and-kashmir">Jammu & Kashmir</a></li>
              <li><a href="#/territories/lakshadweep">Lakshadweep Coral Atolls</a></li>
              <li><a href="#/territories/chandigarh">Chandigarh Modernist City</a></li>
              <li><a href="#/territories/delhi">National Capital Delhi</a></li>
              <li><a href="#/territories/puducherry">Puducherry French Quarter</a></li>
              <li><a href="#/territories/dadra-nagar-haveli-daman-diu">DNH & Daman & Diu</a></li>
            </ul>
          </div>

          <!-- Column 3: Travel Intelligence & Safety -->
          <div>
            <div class="footer-col-title">Travel & Safety</div>
            <ul class="footer-links">
              <li><a href="#/itinerary">Smart Itinerary Planner</a></li>
              <li><a href="#/map">Geospatial 3D Map</a></li>
              <li><a href="#/festivals">2026 Festival Calendar</a></li>
              <li><a href="#/bookings">Verified Bookings Hub</a></li>
              <li><a href="#/safety">Safety Center & Advisories</a></li>
              <li><a href="tel:112" style="color: var(--color-emergency); font-weight: 700;">🚨 National Emergency: 112</a></li>
              <li><a href="tel:1363" style="color: var(--color-primary); font-weight: 600;">📞 Tourist Helpline: 1363</a></li>
            </ul>
          </div>

          <!-- Column 4: 2026 Festival Ticker & Official Sources -->
          <div>
            <div class="footer-col-title">2026 Festival Highlights</div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
              ${upcomingFestivals.map(f => `
                <a href="#/festivals" style="display: block; background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle);">
                  <div style="font-size: 0.825rem; font-weight: 700; color: var(--color-text-primary);">${f.name}</div>
                  <div style="font-size: 0.725rem; color: var(--color-secondary); font-weight: 600;">${f.displayDate} • ${f.territoryName}</div>
                </a>
              `).join('')}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              Data Source: Official Union Territory Administrations & Ministry of Tourism, Government of India.
            </div>
          </div>

        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <div>
            © 2026 Bharat Safe Yatra • Smart India Hackathon (SIH 2026). All verified data strictly adheres to Phase 5 official source standards.
          </div>
          <div style="display: flex; gap: 16px;">
            <a href="#/safety">Emergency Protocol</a>
            <a href="https://tourism.gov.in" target="_blank" rel="noopener noreferrer">Incredible India ↗</a>
            <a href="https://services.india.gov.in" target="_blank" rel="noopener noreferrer">National Portal ↗</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
