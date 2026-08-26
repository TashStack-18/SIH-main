/**
 * 🇮🇳 BHARAT SAFE YATRA — INTERACTIVE ITINERARY PLANNER & EDITOR
 * Day Timeline, Duration Resizer, Budget Estimator & AI Optimization Flow
 */

import { store } from '../stores/store.js';
import { showToast } from '../components/toast.js';

export function renderItineraryView() {
  const itinerary = store.getState().itinerary;
  const days = itinerary.days;

  const budgetBreakdown = [
    { category: "Transport & Fuel (4x4 SUV)", amount: Math.round(itinerary.estimatedBudget * 0.35) },
    { category: "Eco-Dome & Heritage Stays", amount: Math.round(itinerary.estimatedBudget * 0.40) },
    { category: "Meals & Traditional Gastronomy", amount: Math.round(itinerary.estimatedBudget * 0.15) },
    { category: "Permits, Entry & Emergency Buffer", amount: Math.round(itinerary.estimatedBudget * 0.10) }
  ];

  return `
    <main class="container section-spacing" role="main">
      
      <!-- Itinerary Header Overview -->
      <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-xl); padding: var(--space-2xl); margin-bottom: var(--space-2xl); box-shadow: var(--shadow-card);">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-lg); margin-bottom: var(--space-xl);">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
              <span class="badge badge-verified">✓ Active Trip Plan</span>
              <span class="badge badge-official">${itinerary.territoryName}</span>
            </div>
            <h1 style="font-size: clamp(1.8rem, 4vw, 2.5rem); margin-bottom: 6px;">${itinerary.title}</h1>
            <p class="lead-text" style="font-size: 1rem;">
              ${itinerary.durationDays} Days • ${itinerary.travellers} Travellers • ${itinerary.startDate} to ${itinerary.endDate}
            </p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-outline" id="itin-ai-optimize-btn">
              🤖 Yatra AI Optimize
            </button>
            <button class="btn btn-primary" id="itin-view-route-btn">
              🗺️ View Route on Map
            </button>
          </div>
        </div>

        <!-- Duration Resizer Bar -->
        <div style="background: var(--color-bg-surface-elevated); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <span style="font-size: 0.825rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Trip Duration Editor:</span>
            <span style="font-weight: 700; margin-left: 6px; color: var(--color-primary);">${itinerary.durationDays} Days</span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${[3, 5, 7, 10].map(d => `
              <button class="btn btn-sm ${itinerary.durationDays === d ? 'btn-primary' : 'btn-outline'} duration-pill-btn" data-days="${d}">
                ${d} Days
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Main Itinerary Layout (Timeline + Side Panels) -->
      <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-2xl);">
        
        <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-xl);">
          
          <!-- Day-by-Day Timeline Items -->
          <div id="itinerary-timeline-container">
            ${days.map(day => `
              <section class="itinerary-day-box">
                
                <div class="itinerary-day-header">
                  <div>
                    <span class="badge badge-neutral" style="margin-bottom: 4px;">Day ${day.dayNumber}</span>
                    <h2 style="font-size: 1.35rem; color: var(--color-text-primary);">${day.title}</h2>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted);">${day.date} • ${day.summary}</p>
                  </div>
                  <button class="btn btn-sm btn-outline add-item-day-btn" data-day="${day.dayNumber}">
                    + Add Stop
                  </button>
                </div>

                <div class="timeline-items">
                  ${day.items.map(item => `
                    <div class="timeline-item">
                      <div class="timeline-item-marker">●</div>
                      
                      <div class="timeline-item-card">
                        <div>
                          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                            <span class="badge badge-neutral" style="font-size: 0.7rem;">${item.type}</span>
                            <span class="font-mono" style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">${item.time}</span>
                          </div>
                          <div style="font-weight: 700; font-size: 1rem; color: var(--color-text-primary);">${item.title}</div>
                          ${item.notes ? `<div style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">${item.notes}</div>` : ''}
                        </div>

                        <button class="btn btn-ghost btn-sm btn-icon-only remove-item-btn" 
                                data-day="${day.dayNumber}" 
                                data-item-id="${item.id}" 
                                aria-label="Remove item" 
                                style="color: var(--color-text-muted);">
                          ✕
                        </button>
                      </div>
                    </div>
                  `).join('')}

                  ${day.items.length === 0 ? `
                    <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
                      No activities planned for this day. Click "+ Add Stop" to customize.
                    </div>
                  ` : ''}
                </div>

              </section>
            `).join('')}
          </div>

          <!-- Bottom Companion Panels (Budget Tracker & Packing Checklist) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-xl);">
            
            <!-- Budget Breakdown -->
            <div class="card" style="padding: var(--space-xl);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">💰 Estimated Trip Budget</h3>
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-primary); margin-bottom: 16px;">
                ₹${itinerary.estimatedBudget.toLocaleString('en-IN')}
                <span style="font-size: 0.85rem; font-weight: 500; color: var(--color-text-muted);">for ${itinerary.travellers} travellers (${itinerary.durationDays} days)</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${budgetBreakdown.map(b => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.875rem; padding: 6px 0; border-bottom: 1px dashed var(--color-border-subtle);">
                    <span style="color: var(--color-text-secondary);">${b.category}</span>
                    <span style="font-weight: 700; color: var(--color-text-primary);">₹${b.amount.toLocaleString('en-IN')}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Packing Assistant -->
            <div class="card" style="padding: var(--space-xl);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">🎒 Verified Packing Checklist</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 14px;">Tailored for high-altitude Ladakh terrain and temperature variations.</p>
              
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" checked />
                  <span>Inner Line Permits (ILP) printed copies</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" checked />
                  <span>High-SPF Sunscreen (SPF 50+) & UV Sunglasses</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" checked />
                  <span>Portable Medical Oxygen Can & Diamox</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" />
                  <span>Thermal inner layers & Windproof Fleece jacket</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" />
                  <span>BSNL / Postpaid SIM card for remote Changthang</span>
                </label>
              </div>
            </div>

          </div>

        </div>

      </div>

    </main>
  `;
}

export function attachItineraryEvents() {
  // Duration pill clicks
  document.querySelectorAll('.duration-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const days = parseInt(btn.getAttribute('data-days'), 10);
      store.resizeItineraryDuration(days);
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderItineraryView();
        attachItineraryEvents();
        showToast(`Itinerary resized to ${days} days with recalculated budget and days!`, "success");
      }
    });
  });

  // Remove item buttons
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      const itemId = btn.getAttribute('data-item-id');
      store.removeItineraryItem(day, itemId);
      const main = document.querySelector('main');
      if (main) {
        main.outerHTML = renderItineraryView();
        attachItineraryEvents();
        showToast("Activity removed from timeline.", "info");
      }
    });
  });

  // Add stop button
  document.querySelectorAll('.add-item-day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      const customTitle = prompt(`Enter custom activity or destination for Day ${day}:`, "Scenic Excursion & Local Photography");
      if (customTitle && customTitle.trim()) {
        store.addItineraryItem(day, {
          time: "03:30 PM",
          title: customTitle.trim(),
          type: "CUSTOM",
          notes: "Custom activity added by user"
        });
        const main = document.querySelector('main');
        if (main) {
          main.outerHTML = renderItineraryView();
          attachItineraryEvents();
          showToast(`Added "${customTitle}" to Day ${day}!`, "success");
        }
      }
    });
  });

  // AI Optimize Button
  const aiOptBtn = document.getElementById('itin-ai-optimize-btn');
  if (aiOptBtn) {
    aiOptBtn.addEventListener('click', () => {
      store.toggleAI(true);
      store.sendAIMessage("Optimize my current Ladakh 5-day itinerary for photography and acclimatization.");
    });
  }

  // View Route on Map
  const mapBtn = document.getElementById('itin-view-route-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      window.location.hash = '#/map';
    });
  }
}
