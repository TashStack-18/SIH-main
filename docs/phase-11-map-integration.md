# 🇮🇳 Bharat Safe Yatra — Phase 11: Map Integration & Vector Rendering

## 1. Vector Map Component (`ItineraryMapView.tsx`)
The itinerary vector map renders directly in the dual-pane workspace, synchronized with the user's timeline.

---

## 2. Rendering Layers
1. **Background Terrain**: Dark mode slate canvas with golden accents.
2. **Route Polyline**: High-contrast golden gradient with shadow glow effect.
3. **Numbered Markers**: `①`, `②`, `③` indicating itinerary sequence numbers, with green `✓` for completed stops.
4. **Pulsing Active State**: Highlights the current stop selected in the timeline or active in Journey Mode.
5. **Nearby Place Pins**: Dashed golden pins showing low-detour candidate attractions.

---

## 3. Bidirectional Sync Contract
- **Timeline → Map**: Hovering or clicking a stop highlights the corresponding pin on the map and pans to its coordinates.
- **Map → Timeline**: Clicking a marker on the map selects the stop and scrolls the timeline card into focus.
