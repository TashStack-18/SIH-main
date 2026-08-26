/**
 * 🇮🇳 BHARAT SAFE YATRA — FULL-PAGE YATRA AI STUDIO
 * Dedicated Grounded AI Travel Intelligence & Multi-Day Itinerary Generator
 */

import { store } from '../stores/store.js';

export function renderAIView() {
  const state = store.getState();
  const messages = state.ai.messages;

  return `
    <main class="container section-spacing" role="main">
      
      <div class="section-header">
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
          <span class="badge badge-verified">Phase 5 RAG Grounded</span>
          <span class="badge badge-official">Yatra AI Studio</span>
        </div>
        <h1>Yatra AI Travel Intelligence</h1>
        <p class="lead-text">
          Converse directly with our grounded AI engine for itinerary generation, permit guidelines, weather forecasts, and safety protocols across the 8 Union Territories.
        </p>
      </div>

      <!-- Studio Chat Container -->
      <div class="card" style="min-height: 600px; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-elevated);">
        
        <!-- Header Bar -->
        <div style="padding: 16px 24px; background: var(--color-bg-surface-elevated); border-bottom: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="status-dot status-dot-live"></div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">Yatra AI Engine</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">Verified Database + Geospatial + Safety Layers Active</div>
            </div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="store.setState({ ai: { ...store.getState().ai, messages: [store.getState().ai.messages[0]] } })">
            Clear Chat History
          </button>
        </div>

        <!-- Chat Stream Messages -->
        <div id="ai-studio-messages" style="flex-grow: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;">
          ${messages.map(m => `
            <div class="ai-message ${m.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}" style="max-width: 80%;">
              <div style="white-space: pre-line;">${formatStudioMarkdown(m.content)}</div>
              
              ${m.citations && m.citations.length > 0 ? `
                <div class="ai-citations-box" style="margin-top: 8px;">
                  <strong>Verified Sources:</strong>
                  ${m.citations.map(c => `
                    <a href="${c.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 8px; text-decoration: underline;">
                      ✓ ${c.title}
                    </a>
                  `).join('')}
                </div>
              ` : ''}

              ${m.actionProposal ? `
                <div class="ai-action-preview-card" style="margin-top: 10px;">
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-primary);">
                    ⚡ Proposed Itinerary Update: ${m.actionProposal.title}
                  </div>
                  <div style="font-size: 0.8rem; margin: 4px 0 8px;">
                    Target: Day ${m.actionProposal.day} • ${m.actionProposal.item.time} — ${m.actionProposal.item.title}
                  </div>
                  <button class="btn btn-sm btn-primary" onclick="store.applyAIProposal(JSON.parse('${JSON.stringify(m.actionProposal)}')); showToast('Itinerary updated!', 'success');">
                    ✓ Confirm & Apply Action
                  </button>
                </div>
              ` : ''}

              <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px; text-align: right;">${m.timestamp}</div>
            </div>
          `).join('')}
        </div>

        <!-- Studio Input Bar -->
        <form id="ai-studio-form" style="padding: 16px 24px; background: var(--color-bg-surface); border-top: 1px solid var(--color-border-subtle); display: flex; gap: 12px;">
          <input type="text" 
                 id="ai-studio-input" 
                 placeholder="Type your travel inquiry or prompt (e.g. Plan a 6-day photo tour of Ladakh under ₹50,000)..." 
                 class="search-input" 
                 style="background: var(--color-bg-surface-elevated); padding: 12px 18px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);" 
                 autocomplete="off" />
          <button type="submit" class="btn btn-primary btn-lg">Send Prompt</button>
        </form>

      </div>

    </main>
  `;
}

function formatStudioMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="kbd-shortcut">$1</code>');
}

export function attachAIEvents() {
  const form = document.getElementById('ai-studio-form');
  const input = document.getElementById('ai-studio-input');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) {
        store.sendAIMessage(val);
        input.value = '';
        const main = document.querySelector('main');
        if (main) {
          main.outerHTML = renderAIView();
          attachAIEvents();
          const box = document.getElementById('ai-studio-messages');
          if (box) box.scrollTop = box.scrollHeight;
        }
      }
    });
  }
}
