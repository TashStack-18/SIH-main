/**
 * 🇮🇳 DISHAARA — FOOTER COMPONENT
 * Clean Editorial Footer with Government Affiliations, Newsletter Alerts & Emergency Helplines
 */

export function renderFooter() {
  return `
    <footer class="footer" role="contentinfo" style="background: linear-gradient(180deg, var(--color-bg-canvas) 0%, var(--color-bg-surface-elevated) 100%); border-top: 1px solid var(--color-border-subtle); color: var(--color-text-secondary); padding: clamp(48px, 6vw, 72px) 0 32px; margin-top: auto; position: relative;">
      <div class="container" style="max-width: var(--container-max-width); margin: 0 auto; padding: 0 24px;">
        
        <!-- Pre-Footer Newsletter Card -->
        <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-xl, 24px); padding: clamp(24px, 4vw, 36px); margin-bottom: clamp(40px, 5vw, 56px); box-shadow: var(--shadow-card); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px;">
          <div style="flex: 1 1 380px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-brand-accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
              Travel Intelligence
            </div>
            <h3 style="font-family: var(--font-family-serif); font-size: clamp(1.25rem, 2.2vw, 1.65rem); font-weight: 700; color: var(--color-text-primary); line-height: 1.25; margin: 0 0 6px;">
              Real-Time Insights for Your Next Journey
            </h3>
            <p style="margin: 0; font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.5;">
              Receive verified travel advisories, seasonal highlights, and cultural festival guides across all 8 Union Territories.
            </p>
          </div>
          <form onsubmit="event.preventDefault(); alert('Subscribed to Dishaara Verified Travel Alerts!');" style="flex: 1 1 320px; max-width: 480px; display: flex; gap: 10px; flex-wrap: wrap;">
            <input type="email" required placeholder="Enter your email address" style="flex: 1 1 200px; padding: 12px 16px; border-radius: 9999px; border: 1px solid var(--color-border-medium); background: var(--color-bg-canvas); color: var(--color-text-primary); font-size: 0.875rem;" />
            <button type="submit" style="background: var(--color-brand-accent); color: #fff; border: none; border-radius: 9999px; padding: 12px 22px; font-size: 0.875rem; font-weight: 600; cursor: pointer;">Get Alerts</button>
          </form>
        </div>

        <!-- Main Footer Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: clamp(32px, 4vw, 48px); margin-bottom: clamp(40px, 5vw, 56px);">
          <!-- Col 1: Brand & Mission -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="brand-wordmark font-serif" style="font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary);">Dishaara</div>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.65; margin: 0;">
              Preserving cultural legacies and securing journeys across India's 8 Union Territories with verified government intelligence, geospatial navigation, and 24/7 AI-backed safety.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="badge" style="background: rgba(200, 142, 68, 0.12); color: var(--color-brand-accent); border: 1px solid rgba(200, 142, 68, 0.3); padding: 4px 10px; border-radius: 9999px; font-size: 0.725rem; font-weight: 600;">8 Union Territories</span>
              <span class="badge" style="background: rgba(22, 163, 74, 0.12); color: var(--color-success); border: 1px solid rgba(22, 163, 74, 0.25); padding: 4px 10px; border-radius: 9999px; font-size: 0.725rem; font-weight: 600;">Verified Safety Grid</span>
            </div>
          </div>

          <!-- Col 2: 8 Union Territories -->
          <div>
            <h4 style="font-size: 0.825rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-primary);">8 Union Territories</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <a href="#/destinations?ut=andaman-and-nicobar" style="text-decoration: none; color: var(--color-text-secondary);">Andaman & Nicobar Islands</a>
              <a href="#/destinations?ut=chandigarh" style="text-decoration: none; color: var(--color-text-secondary);">Chandigarh</a>
              <a href="#/destinations?ut=dadra-nagar-haveli-daman-diu" style="text-decoration: none; color: var(--color-text-secondary);">Dadra & Nagar Haveli and Daman & Diu</a>
              <a href="#/destinations?ut=delhi" style="text-decoration: none; color: var(--color-text-secondary);">National Capital Territory of Delhi</a>
              <a href="#/destinations?ut=jammu-and-kashmir" style="text-decoration: none; color: var(--color-text-secondary);">Jammu & Kashmir</a>
              <a href="#/destinations?ut=ladakh" style="text-decoration: none; color: var(--color-text-secondary);">Ladakh</a>
              <a href="#/destinations?ut=lakshadweep" style="text-decoration: none; color: var(--color-text-secondary);">Lakshadweep</a>
              <a href="#/destinations?ut=puducherry" style="text-decoration: none; color: var(--color-text-secondary);">Puducherry</a>
            </div>
          </div>

          <!-- Col 3: Platform & Tools -->
          <div>
            <h4 style="font-size: 0.825rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-primary);">Platform & Tools</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <a href="#/destinations" style="text-decoration: none; color: var(--color-text-secondary);">All Verified Destinations</a>
              <a href="#/bookings" style="text-decoration: none; color: var(--color-text-secondary);">Bookings & Experiences</a>
              <a href="#/itinerary" style="text-decoration: none; color: var(--color-text-secondary);">Smart Itinerary AI</a>
              <a href="#/map" style="text-decoration: none; color: var(--color-text-secondary);">Interactive 3D Map</a>
              <a href="#/festivals" style="text-decoration: none; color: var(--color-text-secondary);">2026 Cultural Festivals</a>
              <a href="#/safety" style="text-decoration: none; color: var(--color-text-secondary);">Safety & Emergency Hub</a>
            </div>
          </div>

          <!-- Col 4: Emergency Helplines -->
          <div>
            <h4 style="font-size: 0.825rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-danger, #DC2626);">Emergency Helplines</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <a href="tel:112" style="background: var(--color-bg-surface); padding: 12px 16px; border-radius: 14px; border: 1px solid rgba(220, 38, 38, 0.3); text-decoration: none; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">National Emergency (All UTs)</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-danger, #DC2626);">112</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              <a href="tel:1363" style="background: var(--color-bg-surface); padding: 12px 16px; border-radius: 14px; border: 1px solid var(--color-border-subtle); text-decoration: none; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">24x7 Tourist Helpline</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-text-primary);">1363</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a href="tel:1091" style="padding: 8px; background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: 10px; text-decoration: none; text-align: center; font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">Women: <strong>1091</strong></a>
                <a href="tel:1098" style="padding: 8px; background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: 10px; text-decoration: none; text-align: center; font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">Childline: <strong>1098</strong></a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div style="border-top: 1px solid var(--color-border-subtle); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 0.825rem; color: var(--color-text-muted);">
          <div>© 2026 <strong>Dishaara</strong>. Built for Dishaara Initiative.</div>
          <div style="display: flex; gap: 20px;">
            <a href="#/privacy" style="text-decoration: none; color: inherit;">Privacy Policy</a>
            <a href="#/terms" style="text-decoration: none; color: inherit;">Terms of Service</a>
            <a href="#/safety" style="text-decoration: none; color: inherit;">Safety Protocols</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
