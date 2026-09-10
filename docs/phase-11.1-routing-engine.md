# 🇮🇳 Bharat Safe Yatra — Phase 11.1 Routing & Matrix Engine
## Mapbox Directions, Matrix Optimization & Real-World Geometry

### 1. Routing Engine Capabilities
1. **Real Routable Geometry**: Uses Mapbox Directions API v5 (`profile: driving-traffic` / `walking` / `cycling`).
2. **No Straight Lines**: Every calculated route contains true multi-point GeoJSON LineString coordinates conforming to actual road networks and mountain passes.
3. **Turn-by-Turn Leg Telemetry**: Returns leg distance, duration in seconds, and instructional maneuvers.

---

### 2. Mapbox Matrix API
Rather than issuing $N \times N$ individual Directions API requests when evaluating candidate stops or clusters, Bharat Safe Yatra uses the **Mapbox Matrix API**:
- **Endpoint**: `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${coordinates}`
- **Annotations**: `distance,duration`
- **Output**: Full pairwise duration matrix (minutes) and distance matrix (km).
- **Fallback**: Haversine distance matrix with realistic $1.25\times$ road-winding factor and terrain-adjusted speed calculations.

---

### 3. Spatial Detour Intelligence
When evaluating candidate recommendations along a journey leg from Stop A to Stop B:
$$\Delta \text{Detour Distance} = \text{dist}(A \to C) + \text{dist}(C \to B) - \text{dist}(A \to B)$$
$$\Delta \text{Detour Duration} = \text{driveTime}(A \to C) + \text{driveTime}(C \to B) - \text{driveTime}(A \to B)$$

Only candidate destinations within a reasonable detour threshold ($\le 45\text{ minutes}$) are ranked and presented to the traveller in the **Along Your Route** recommendation rail.
