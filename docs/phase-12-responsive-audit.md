# 🇮🇳 Bharat Safe Yatra — Phase 12: Responsive Design & Layout Audit

## 1. Viewport Testing Matrix

| Breakpoint | Target Devices | Layout Strategy | Audit Result |
|---|---|---|---|
| **1440 × 900** | Large Desktops, Studio Displays | Dual-Pane (55% Conversation, 45% Context), height: `calc(100vh - 210px)`. | ✅ PASS (Zero horizontal overflow) |
| **1280 × 800** | Standard Laptops, MacBook Pro | Dual-Pane compact spacing, scrollable stream, sticky bottom composer. | ✅ PASS (No clipped buttons) |
| **1024 × 768** | iPad Pro Landscape, Small Laptops | Dual-Pane minimum column constraints (min 400px / 360px). | ✅ PASS (No card overlap) |
| **768 × 1024** | iPad / Tablet Portrait | Stacked single-column conversation with top context drawer toggle. | ✅ PASS (Seamless drawer transition) |
| **430 × 932** | iPhone 15 Pro Max, Large Phones | Full-width stream, sticky mobile composer above navigation, slide-up bottom sheet for context. | ✅ PASS (Keyboard-friendly) |
| **390 × 844** | iPhone 14 / 15 Standard | Full-width stream, touch-friendly prompt chips. | ✅ PASS (No horizontal scroll) |
| **360 × 800** | Android Standard Viewport | Single primary scroll, responsive button wrapping. | ✅ PASS (Zero frame breakage) |

---

## 2. Scrollbar & Height Audit
- **Old Behavior**: Whole page had an uncontrolled vertical stretch causing double scrollbars on small laptop screens.
- **Yatra AI 2.0 Behavior**: Bounded layout container (`max-height: 840px`, `height: calc(100vh - 210px)` on desktop) with independent overflow in the conversation stream.
