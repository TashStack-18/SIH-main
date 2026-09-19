/**
 * 🇮🇳 BHARAT SAFE YATRA — YATRA AI TRAVEL COMPANION
 * Context-Aware Assistant with Verified Citations & Safety-Guarded Actions
 */

import { store } from '../stores/store.js';

export function renderAICompanion() {
  const state = store.getState();
  const { isOpen, isThinking, messages } = state.ai;

  if (!isOpen) {
    return `
      <button class="ai-floating-trigger" id="ai-launcher-btn" aria-label="Open Yatra AI Travel Companion">
        <span style="font-size: 1.25rem;">🤖</span>
        <span>Yatra AI</span>
      </button>
    `;
  }

  const suggestedPrompts = [
    "Plan a 5-day Ladakh photo itinerary",
    "Check Lakshadweep ePermit rules",
    "When is Hemis Tsechu 2026?",
    "Find nearest hospital to Leh"
  ];

  return `
    <div class="ai-modal-container" id="ai-chat-window" role="dialog" aria-modal="true" aria-label="Yatra AI Companion">
      
      <!-- AI Header -->
      <div class="ai-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-success); box-shadow: 0 0 8px var(--color-success);"></div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
              <span>Yatra AI Companion</span>
              <span class="badge badge-verified" style="font-size: 0.65rem;">Grounded</span>
            </div>
            <div style="font-size: 0.725rem; color: var(--color-text-muted);">8 UT Tourism & Safety Intelligence</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" id="ai-close-btn" aria-label="Close Yatra AI">✕</button>
      </div>

      <!-- Chat Stream Messages -->
      <div class="ai-chat-messages" id="ai-messages-scroll">
        ${messages.map(m => `
          <div class="ai-message ${m.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}">
            <div style="white-space: pre-line;">${formatMarkdown(m.content)}</div>
            
            <!-- Verified Source Citations -->
            ${m.citations && m.citations.length > 0 ? `
              <div class="ai-citations-box">
                <strong style="display: block; margin-bottom: 2px;">📚 Verified Official Citations:</strong>
                ${m.citations.map(c => `
                  <a href="${c.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 8px; text-decoration: underline;">
                    ✓ ${c.title}
                  </a>
                `).join('')}
              </div>
            ` : ''}

            <!-- Safety-Guarded Action Proposal -->
            ${m.actionProposal ? `
              <div class="ai-action-preview-card">
                <div style="font-weight: 700; font-size: 0.825rem; color: var(--color-primary); margin-bottom: 4px;">
                  ⚡ Action Proposal: ${m.actionProposal.title}
                </div>
                <div style="font-size: 0.775rem; color: var(--color-text-secondary); margin-bottom: 8px;">
                  Target: Day ${m.actionProposal.day} • ${m.actionProposal.item.time} — ${m.actionProposal.item.title}
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-sm btn-primary" id="ai-apply-action-btn" data-proposal='${JSON.stringify(m.actionProposal)}'>
                    ✓ Confirm & Apply to Itinerary
                  </button>
                </div>
              </div>
            ` : ''}

            <div style="font-size: 0.675rem; opacity: 0.7; margin-top: 4px; text-align: right;">${m.timestamp}</div>
          </div>
        `).join('')}

        ${isThinking ? `
          <div class="ai-message ai-message-assistant" style="display: flex; align-items: center; gap: 8px;">
            <div class="status-dot status-dot-live"></div>
            <span>Grounding with Phase 5 verified datasets...</span>
          </div>
        ` : ''}
      </div>

      <!-- Suggested Prompt Pills -->
      <div style="padding: 6px 12px; background: var(--color-bg-surface-elevated); border-top: 1px solid var(--color-border-subtle); display: flex; gap: 6px; overflow-x: auto;">
        ${suggestedPrompts.map(p => `
          <button class="badge badge-neutral ai-suggest-btn" data-prompt="${p}" style="cursor: pointer; flex-shrink: 0;">
            ${p}
          </button>
        `).join('')}
      </div>

      <!-- Chat Input Area -->
      <form class="ai-input-wrapper" id="ai-chat-form">
        <input type="text" 
               id="ai-user-input" 
               placeholder="Ask Yatra AI about itineraries, permits, weather..." 
               class="search-input" 
               style="background: var(--color-bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);" 
               autocomplete="off" />
        <button type="submit" class="btn btn-sm btn-primary" aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

    </div>
  `;
}

function formatMarkdown(text) {
  // Simple clean markdown formatter for **bold** and `code`
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="kbd-shortcut">$1</code>');
}

export function attachAICompanionEvents() {
  const launcher = document.getElementById('ai-launcher-btn');
  if (launcher) {
    launcher.addEventListener('click', () => store.toggleAI(true));
  }

  const closeBtn = document.getElementById('ai-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.toggleAI(false));
  }

  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-user-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        store.sendAIMessage(text);
        input.value = '';
      }
    });
  }

  document.querySelectorAll('.ai-suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        store.sendAIMessage(prompt);
      }
    });
  });

  const applyBtn = document.getElementById('ai-apply-action-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      try {
        const proposal = JSON.parse(applyBtn.getAttribute('data-proposal'));
        store.applyAIProposal(proposal);
        applyBtn.innerText = "✓ Applied to Itinerary";
        applyBtn.disabled = true;
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Scroll to bottom of chat
  const scrollContainer = document.getElementById('ai-messages-scroll');
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }
}
