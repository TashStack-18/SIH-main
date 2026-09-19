# 🇮🇳 Bharat Safe Yatra — Phase 12: Yatra AI 2.0 Complete Redesign

## 1. Executive Summary & Design Vision
Yatra AI 2.0 transforms Yatra AI from an isolated, generic chatbot into a **native travel intelligence workspace** embedded seamlessly within Bharat Safe Yatra.

```
Conversational Stream (Left 55%) ──synchronized──> Dynamic Travel Context Workspace (Right 45%)
```

---

## 2. Core Architectural Shifts

### 2.1 Frame Preservation
- Yatra AI strictly resides within the standard application shell (`container section-spacing`, `max-width: 1440px`).
- No full-screen window breakout.
- No multi-scrollbar pollution (single unified viewport scrolling or bounded dual-scroll).

### 2.2 Dual-Pane Travel Workspace
- **Left Panel (55%)**: Conversational intelligence stream, editorial assistant cards, source citations, suggested action chips, and a sticky multi-line composer.
- **Right Panel (45%)**: Contextual Travel Workspace that dynamically switches modes based on conversational intent:
  - `DESTINATION`: High-res hero, altitude, best time to visit, key highlights, `[ + Add to Itinerary ]`.
  - `ITINERARY`: Live trip proposal, day-by-day stops, route feasibility, `[ Open Itinerary Studio ]`.
  - `MAP`: Route summary, TomTom road trajectory, elevation highlights, `[ Explore 3D Map ]`.
  - `WEATHER`: Live telemetry (Temperature, Condition, Humidity, Wind, UV index), updated timestamp.
  - `BOOKING`: Verified official government stays (JKTDC, Andaman Tourism) with external provider links.
  - `SAFETY`: Emergency medical radar, Sonam Norboo Memorial Hospital (SNM), `[ Call 112 ]`.
  - `DEFAULT`: 8 Union Territories discovery cards with prompt trigger pills.

### 2.3 Grounding & Anti-Hallucination
- Uses the Phase 10 & 11 verified knowledge base (48 destinations, 8 UTs).
- Honest source citations (`Ladakh Tourism • Verified 26 Aug 2026`).
- Real-time telemetry badges (`LIVE • Updated 3m ago`).
