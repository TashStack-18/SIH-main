/**
 * 🇮🇳 BHARAT SAFE YATRA — BOOKINGS HUB VIEW
 * Multi-Provider Verified Booking Experience (E-Tickets, Government Stays, Packages)
 */

import { BOOKABLE_EXPERIENCES, BOOKING_PROVIDERS } from '../data/bookings.js';
import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

let activeCategory = 'ALL';

export function renderBookingsView() {
  const userBookings = store.getState().bookings.userBookings;

  const filteredExperiences = BOOKABLE_EXPERIENCES.filter(exp => {
    return activeCategory === 'ALL' || exp.category === activeCategory;
  });

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <span class="badge badge-verified" style="width: fit-content;">Provider Adapter Architecture</span>
        <h1>Verified Bookings & E-Tickets</h1>
        <p class="lead-text">
          Access official government ticketing portals, state tourism corporation stays, and authorized island packages with genuine availability states.
        </p>
      </div>

      <!-- Active User Bookings Section -->
      ${userBookings.length > 0 ? `
        <section style="margin-bottom: var(--space-3xl);">
          <h2 style="font-size: 1.4rem; margin-bottom: var(--space-md);">Your Confirmed Bookings</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: var(--space-lg);">
            ${userBookings.map(bk => `
              <div class="card" style="padding: var(--space-lg); border-left: 4px solid var(--color-success);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="badge badge-verified">✓ ${bk.status}</span>
                  <span class="font-mono" style="font-size: 0.775rem; color: var(--color-text-muted);">Ref: ${bk.reference}</span>
                </div>
                <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${bk.title}</h3>
                <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600; margin-bottom: 8px;">${bk.date}</div>
                <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 14px;">Provider: ${bk.provider}</div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--color-border-subtle);">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary);">${bk.amount}</span>
                  <button class="btn btn-sm btn-outline" onclick="showToast('Digital e-ticket pass verified and saved to vault.', 'success')">
                    📄 View Digital Pass
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Official Provider Partners Showcase -->
      <section style="margin-bottom: var(--space-3xl); background: var(--color-bg-surface-elevated); padding: var(--space-xl); border-radius: var(--radius-xl);">
        <h2 style="font-size: 1.3rem; margin-bottom: 12px;">Integrated Government Tourism Providers</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-md);">
          ${BOOKING_PROVIDERS.map(p => `
            <div style="background: var(--color-bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <span class="badge badge-official" style="font-size: 0.65rem; margin-bottom: 4px;">${p.badge}</span>
              <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">${p.name}</div>
              <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.775rem; color: var(--color-primary); text-decoration: underline;">
                Visit Official Portal ↗
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Bookable Experiences & Official Stays -->
      <section>
        <div class="section-header-row">
          <div>
            <h2>Authorized Experiences & Accommodation</h2>
            <p class="sub-text">Genuine government e-tickets and verified tour packages across the 8 UTs.</p>
          </div>
          
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${["ALL", "ACTIVITY", "HOTEL", "PACKAGE"].map(cat => `
              <button class="badge ${activeCategory === cat ? 'badge-official' : 'badge-neutral'} booking-cat-btn" data-cat="${cat}" style="cursor: pointer;">
                ${cat === 'ALL' ? 'All Inventory' : cat}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl);">
          ${filteredExperiences.map(exp => `
            <article class="card card-hoverable" style="display: flex; flex-direction: column;">
              <div style="position: relative; height: 200px; overflow: hidden;">
                <img src="${exp.image}" alt="${exp.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                <div style="position: absolute; top: 12px; left: 12px;">
                  <span class="badge badge-verified">✓ ${exp.category}</span>
                </div>
              </div>

              <div style="padding: var(--space-lg); display: flex; flex-direction: column; flex-grow: 1;">
                <div style="font-size: 0.775rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 4px;">
                  ${exp.location}
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 6px;">${exp.title}</h3>
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-md); flex-grow: 1;">
                  ${exp.description}
                </p>

                <div style="background: var(--color-bg-surface-elevated); padding: 10px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 14px;">
                  <div><strong>Provider:</strong> ${exp.providerName}</div>
                  <div><strong>Timing:</strong> ${exp.timing}</div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--color-border-subtle);">
                  <div style="font-size: 0.825rem; font-weight: 700; color: var(--color-text-primary);">
                    ${exp.pricing}
                  </div>
                  <a href="${exp.directUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    Book on Official Portal ↗
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

    </main>
  `;
}

export function attachBookingsEvents() {
  document.querySelectorAll('.booking-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderBookingsView();
        attachBookingsEvents();
      }
    });
  });
}
