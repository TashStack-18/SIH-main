# 🇮🇳 BHARAT SAFE YATRA
## Phase 6 — UI/UX Design System & Frontend Architecture Specification
### Smart India Hackathon (SIH 2026)

**Specification Version:** 1.0  
**Target Platform:** Modern Responsive Web (Desktop, Tablet, Mobile)  
**Coverage:** All 8 Union Territories of India  
**Design Philosophy:** Data-First, Intelligence-Grounded, Geospatially Aware & Safety-First

---

# 1. Design Philosophy & Brand Direction

Bharat Safe Yatra is positioned as **India's Intelligent Union Territory Tourism & Safety Platform**. It moves away from generic government dashboards, AI template chatbots, and flashy superficial widgets, delivering a world-class travel technology product.

### Core Brand Personality
- **Premium**: Editorial whitespace, crisp typography, layered surfaces, subtle elevation, and balanced photography.
- **Trustworthy**: Every travel fact, festival date, emergency contact, and rule has clear source attribution and verification badges (`VERIFIED_PRIMARY`, `VERIFIED_GOVERNMENT`).
- **Exploratory**: Immersive imagery, dynamic 8-UT discovery rail, rich regional guides, and geospatial maps.
- **Intelligent**: Yatra AI is context-aware (knows the current itinerary, weather, and budget), providing actionable recommendations with a clear `Preview` $\to$ `Confirm` $\to$ `Apply` safety layer.
- **Calm & Safe**: High-contrast, unmistakable SOS emergency access with instant offline-ready emergency numbers (100, 108, 112, 1363, 1554) and nearest hospital locator.
- **Sophisticated Indian Identity**: Subtle visual nuances inspired by Indian geography—Himalayan mist, terracotta earth tones, coastal azure, temple granite, and palm emerald—avoiding superficial nationalistic cliches.

---

# 2. Color System & Token Architecture

The design uses a centralized token system rooted in CSS variables. Light mode serves as the primary experience, while dark mode provides an immersive setting for geospatial navigation, cinematic sections, and Yatra AI.

### Light Theme (Primary)

```css
:root {
  /* Brand Core */
  --color-brand-primary: hsl(215, 88%, 36%);       /* Royal Bharat Navy */
  --color-brand-primary-hover: hsl(215, 90%, 28%);
  --color-brand-secondary: hsl(28, 85%, 52%);     /* Warm Terracotta Saffron */
  --color-brand-secondary-hover: hsl(28, 90%, 45%);
  --color-brand-accent: hsl(164, 76%, 36%);        /* Verdant Emerald */
  
  /* Neutral Surfaces */
  --color-bg-canvas: hsl(210, 20%, 98%);          /* Soft Himalayan Pearl */
  --color-bg-surface: hsl(0, 0%, 100%);           /* Pure White */
  --color-bg-surface-elevated: hsl(210, 25%, 96%);/* Subdued Card Surface */
  --color-bg-scrim: hsla(220, 30%, 10%, 0.65);    /* Scrim for Hero Overlays */
  
  /* Typography */
  --color-text-primary: hsl(220, 35%, 13%);       /* Deep Obsidian */
  --color-text-secondary: hsl(220, 15%, 42%);     /* Cool Slate */
  --color-text-muted: hsl(220, 12%, 62%);         /* Subdued Grey */
  --color-text-inverse: hsl(0, 0%, 100%);
  
  /* Structural Borders */
  --color-border-subtle: hsl(220, 16%, 90%);
  --color-border-strong: hsl(220, 18%, 80%);
  
  /* Semantic Statuses */
  --color-status-success: hsl(152, 68%, 38%);
  --color-status-warning: hsl(38, 92%, 50%);
  --color-status-danger: hsl(0, 84%, 60%);        /* Emergency Coral */
  --color-status-info: hsl(204, 88%, 48%);
  
  /* Badges & Tags */
  --color-verified-bg: hsl(152, 60%, 94%);
  --color-verified-text: hsl(152, 75%, 28%);
  --color-official-bg: hsl(215, 80%, 95%);
  --color-official-text: hsl(215, 85%, 32%);
}
```

### Dark Theme (Immersive & Map Mode)

```css
[data-theme="dark"] {
  --color-brand-primary: hsl(215, 85%, 58%);
  --color-brand-primary-hover: hsl(215, 90%, 65%);
  --color-brand-secondary: hsl(28, 90%, 58%);
  --color-brand-accent: hsl(164, 70%, 48%);
  
  --color-bg-canvas: hsl(222, 28%, 9%);           /* Night Void */
  --color-bg-surface: hsl(222, 24%, 13%);         /* Deep Slate Surface */
  --color-bg-surface-elevated: hsl(222, 20%, 18%);
  --color-bg-scrim: hsla(222, 35%, 6%, 0.85);
  
  --color-text-primary: hsl(210, 30%, 96%);
  --color-text-secondary: hsl(215, 18%, 70%);
  --color-text-muted: hsl(215, 12%, 48%);
  --color-text-inverse: hsl(222, 28%, 9%);
  
  --color-border-subtle: hsl(222, 20%, 20%);
  --color-border-strong: hsl(222, 20%, 30%);
  
  --color-status-success: hsl(152, 65%, 48%);
  --color-status-warning: hsl(38, 90%, 56%);
  --color-status-danger: hsl(0, 85%, 65%);
  --color-status-info: hsl(204, 90%, 60%);
  
  --color-verified-bg: hsl(152, 50%, 15%);
  --color-verified-text: hsl(152, 70%, 65%);
  --color-official-bg: hsl(215, 50%, 18%);
  --color-official-text: hsl(215, 75%, 75%);
}
```

---

# 3. Typography System

| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Use Case |
|---|---|---|---|---|---|---|
| **Display** | Plus Jakarta Sans / Serif Accent | 48px – 64px | 800 | 1.1 | -0.03em | Hero Slide Main Headlines |
| **H1** | Plus Jakarta Sans | 36px – 40px | 700 | 1.2 | -0.02em | Page Titles, Territory Showcase |
| **H2** | Plus Jakarta Sans | 28px – 32px | 700 | 1.25 | -0.015em | Major Section Headers |
| **H3** | Plus Jakarta Sans | 22px – 24px | 600 | 1.3 | -0.01em | Destination & Itinerary Day Titles |
| **H4** | Plus Jakarta Sans | 18px – 20px | 600 | 1.35 | 0 | Sub-cards, Modal Titles |
| **Body Large** | Inter / System Sans | 18px | 400/500 | 1.6 | 0 | Editorial Intros, Hero Subtitles |
| **Body Regular**| Inter / System Sans | 15px – 16px | 400/500 | 1.55 | 0 | Standard Body Copy, Descriptions |
| **Body Small** | Inter / System Sans | 13px – 14px | 400/500 | 1.5 | 0 | Metadata, Secondary Information |
| **Caption** | Inter / System Sans | 12px | 500 | 1.4 | 0.02em | Source Citations, Verification Notes |
| **Mono Meta** | JetBrains Mono / Monospace | 12px – 13px | 500 | 1.4 | 0.04em | Coordinates, Timings, Reference IDs |
| **Button** | Plus Jakarta Sans | 14px – 15px | 600 | 1 | 0.01em | Interactive Actions |

---

# 4. Spacing, Elevation & Restrained Radius

### Spacing Tokens
- `space-2xs`: 4px
- `space-xs`: 8px
- `space-sm`: 12px
- `space-md`: 16px
- `space-lg`: 24px
- `space-xl`: 32px
- `space-2xl`: 48px
- `space-3xl`: 64px
- `space-4xl`: 96px

### Border Radius Tokens
- `radius-sm`: 6px (Badges, small tags, tooltips)
- `radius-md`: 10px (Buttons, inputs, compact cards)
- `radius-lg`: 16px (Destination cards, modals, sheets)
- `radius-xl`: 24px (Hero banners, cinematic containers)
- `radius-full`: 9999px (Pills, circular icons, avatar badges)

### Shadow & Elevation Tokens
- `shadow-subtle`: `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)`
- `shadow-card`: `0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)`
- `shadow-elevated`: `0 12px 32px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.04)`
- `shadow-floating`: `0 20px 48px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.06)`

---

# 5. Core Navigation Structure

```text
DESKTOP NAVIGATION (Fixed Top Bar)
[🇮🇳 BHARAT SAFE YATRA]  [Home] [Explore UTs] [Destinations] [Itinerary] [Map] [Festivals] [Bookings] [Safety]  
                                                [🔍 Search Cmd+K] [🤖 AI] [👤 Profile] [🚨 SOS] [🌙/☀️]

MOBILE NAVIGATION (Persistent Bottom Bar + Floating SOS)
[🏠 Home]  [🗺️ Explore]  [📅 Itinerary]  [📍 Map]  [👤 Profile]      (Floating [🚨 SOS] at bottom-right)
```

---

# 6. Page Inventory & UX Workflows

1. **`/` (Homepage)**: 8-UT Hero Carousel, Quick Search Filter Bar, Popular Across Bharat, 8 UT Distinctive Rail, Experiences, 2026 Festival Calendar Preview, Smart Itinerary Teaser, Map Preview, Safety & SOS Highlight, Yatra AI Banner, Footer.
2. **`/territories` & `/territories/[slug]`**: Deep dive into each of the 8 Union Territories with official capital, geographical highlights, seasonal guide, official government links, and attractions.
3. **`/destinations` & `/destinations/[slug]`**: Editorial destination view with Overview, Highlights, Things To Do, Local Cuisine, Culture & Etiquette, Live Weather, Permits & Rules, Stay, Map, and "Add to Itinerary".
4. **`/festivals`**: Interactive 2026 Festival Calendar with Month filter, UT filter, Category filter, and strict Date Precision tags (`EXACT_DATE`, `DATE_RANGE`, `MONTH`, `SEASON`).
5. **`/itinerary`**: Interactive Trip Planner with Day Timeline, Activity Reordering, Trip Duration Resizer (e.g. 5 $\to$ 7 days with impact preview), Route Distance Tracker, Budget Calculator, and AI recommendations.
6. **`/map`**: Geospatial Navigation with 70/30 layout (Desktop) / Bottom Sheet (Mobile), 2D/3D toggle, 6 SVG marker types, multi-stop route generator, and nearby emergency facility locator.
7. **`/ai` & Floating Travel Companion**: Context-aware AI assistant grounded in Phase 5 data with source citations and `Preview` $\to$ `Confirm` $\to$ `Apply` safety confirmations.
8. **`/bookings`**: Multi-provider booking interface (Cellular Jail Sound & Light show, Chandigarh e-tickets, Lakshadweep packages, JKTDC) with real live price check states.
9. **`/safety` & SOS**: Safety Center with active travel advisories, verified emergency contacts directory, and 1-tap SOS modal with geolocation and hospital routing.
10. **`/profile` & `/saved`**: User travel preferences, saved bookmarks, trip history, and emergency contacts.
11. **`/search` & Universal Command Palette (`Cmd+K`)**: Keyboard-driven universal search across all destinations, attractions, festivals, and emergency services.

---

# 7. Verification & Accessibility Rules
- **WCAG 2.1 AA Compliance**: All text-to-background contrast ratios $\ge 4.5:1$ (normal text) and $\ge 3:1$ (large text).
- **Accessible Touch Targets**: All interactive buttons, chips, and navigational tabs have minimum $\ge 44 \times 44$px touch dimensions on mobile devices.
- **Motion Sensitivity**: Respects `prefers-reduced-motion: reduce` by disabling smooth scroll transitions and large scale transforms.
- **No Hallucinated Data**: 100% data integrity verified against Phase 5 research.
