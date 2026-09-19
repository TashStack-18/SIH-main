# 🇮🇳 Bharat Safe Yatra — Phase 11: Intelligent Itinerary Architecture

## 1. Overview & Vision
The Bharat Safe Yatra Itinerary Engine is a continuous, map-first journey companion designed for India's 8 Union Territories. Rather than presenting a disjointed form ("Select places → generate list"), the architecture integrates destinations, interactive vector mapping, real-time routing, feasibility checks, and AI co-editing into a unified travel studio.

```
Discover Destination → Plan Trip Context Handoff → Dual-Pane Studio → Real Route (TomTom) → Journey Mode
```

---

## 2. Core Subsystems

### 2.1 Context Handoff Contract
When navigating from a destination detail page or search card, a typed payload is passed via query parameters:
- `destination`: Slug of selected destination (e.g. `pangong-tso`)
- `territory`: Union Territory identifier (e.g. `LADAKH`)
- `source`: Origin page identifier (`destination_detail` | `home_card` | `search`)

The planner auto-inserts the destination, centers the map, calculates distances, and populates nearby recommendations without requiring the user to re-enter their choice.

### 2.2 Dual-Pane Map-First Layout
- **Desktop (>=1024px)**: Left 55% Timeline & Journey Controller, Right 45% Sticky Interactive Vector Map.
- **Mobile (<1024px)**: Stacked cards with a sticky "Next Stop" bottom bar and expandable map view.
- **Bidirectional Sync**: Clicking a timeline stop centers the map marker with a pulsing highlight; clicking a map marker scrolls and highlights the timeline stop.

---

## 3. Data Integrity & Provenance
Per Phase 5.2 and Phase 11 rules:
- **No Estimated Numbers Presented as Facts**: All driving distances and durations originate from TomTom or PostGIS Haversine calculations.
- **Stop State Tracking**: `PLANNED`, `ACTIVE`, `COMPLETED`, `SKIPPED`, `REMOVED`.
- **Progress Calculation**: Derived strictly from completed stops (e.g., `3 / 7 stops completed • 42%`).
