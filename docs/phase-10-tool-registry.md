# 🇮🇳 BHARAT SAFE YATRA
## Phase 10 — Controlled AI Tool Registry
### SIH 2026

**Document Version:** 1.0  
**Phase:** 10 (Tool Registry & Execution Engine)  
**Status:** **OPERATIONAL & VERIFIED**

---

# 1. Tool Classification & Permission Matrix

To prevent unauthorized mutations and protect data sovereignty, tools are strictly split into **Read Tools** and **Write Tools**:

| Tool Name | Type | Underlying Provider | Is Write Action | Requires User Confirmation |
|---|:---:|---|:---:|:---:|
| `get_weather` | READ | OpenWeather One Call 3.0 + IMD Normals | ❌ No | ❌ No |
| `calculate_route` | READ | Mapbox Directions v5 + PostGIS Haversine | ❌ No | ❌ No |
| `search_destinations` | READ | Phase 5 Verified Destination Database | ❌ No | ❌ No |
| `search_festivals` | READ | MoT Utsav Portal + Official UT Gazettes | ❌ No | ❌ No |
| `find_emergency_services` | READ | ABDM Health Facility Registry + ERSS 112 | ❌ No | ❌ No |
| `search_flights` | READ | Amadeus Flight Search v2 + DGCA Timetables | ❌ No | ❌ No |
| `search_hotels` | READ | Amadeus Hotel Search v3 + Govt Stays | ❌ No | ❌ No |
| `create_itinerary_proposal`| WRITE | Yatra AI Route-Validated Planner | ✅ YES | ✅ **YES** |
| `modify_itinerary_proposal`| WRITE | Yatra AI Constraint Optimizer | ✅ YES | ✅ **YES** |

---

# 2. Tool Parameter Specifications

### A. `get_weather`
* **Purpose:** Retrieves real-time weather, 5-day forecast, air quality (AQI), and marine swell.
* **Parameters:** `lat` (number), `lng` (number), `destinationSlug` (optional string).
* **Return Schema:** `{ current: WeatherCondition, forecast: ForecastDay[], marine: MarineTelemetry, metadata: FreshnessMetadata }`.

### B. `calculate_route`
* **Purpose:** Calculates real turn-by-turn road route, distance in km, and duration in minutes.
* **Parameters:** `originLat`, `originLng`, `originName`, `destLat`, `destLng`, `destName`, `mode` (`driving` | `walking` | `cycling`).
* **Return Schema:** `{ totalDistanceKm: number, totalDurationMinutes: number, segments: Segment[], metadata: FreshnessMetadata }`.

### C. `find_emergency_services`
* **Purpose:** Queries ABDM registered apex hospitals, trauma centers with hyperbaric oxygen chambers, and statutory dispatch desks.
* **Parameters:** `lat` (number), `lng` (number), `radiusKm` (number).
* **Return Schema:** `{ nearestFacilities: EmergencyFacility[], statutoryHelpline: "112", touristHelpline: "1363", maritimeSAR: "1554" }`.

### D. `create_itinerary_proposal`
* **Purpose:** Generates a structured multi-day travel itinerary with realistic daily route travel times, safety notes, and verified attractions.
* **Parameters:** `territorySlug` (string), `durationDays` (1–14), `travelStyle` (string), `travellers` (number).
* **Return Schema:** `{ title: string, territory: string, durationDays: number, days: Day[], routeFeasibility: string, requiresConfirmation: true }`.
