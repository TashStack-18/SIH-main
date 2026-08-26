# 🇮🇳 Bharat Safe Yatra — Phase 11: Routing & Spatial Engine

## 1. Routing Engine Architecture
The routing engine executes across a multi-tier resilient pipeline:

```
Tier 1: TomTom Routing API v1 (Real Traffic & Turn-by-Turn Maneuvers)
   ↓ (fallback on failure or missing key)
Tier 2: Mapbox Directions v5
   ↓ (fallback)
Tier 3: Google Maps Directions API
   ↓ (fallback)
Tier 4: PostGIS / Haversine Topological Router (100% Offline & Sovereign)
```

---

## 2. Detour Cost Computation
The Spatial Engine calculates the exact incremental cost of inserting an attraction $C$ into an existing leg $A \to B$:

$$\Delta \text{Detour} = \text{dist}(A \to C) + \text{dist}(C \to B) - \text{dist}(A \to B)$$

- Displayed to the user as `+18 min detour` or `+1 hr 10 min detour`.
- Eliminates generic recommendations by prioritizing places with $\Delta \text{Detour} \le 45\text{ mins}$.

---

## 3. Backtracking Elimination
Detects circular loops where a traveler visits $A \to B \to C$ when $C$ was adjacent to $A$. The optimizer re-sequences waypoints and reports estimated kilometer savings.
