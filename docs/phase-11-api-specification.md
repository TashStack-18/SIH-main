# 🇮🇳 Bharat Safe Yatra — Phase 11: REST API Specification

## 1. Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/itineraries` | List user or guest itineraries |
| `POST` | `/api/v1/itineraries` | Create new itinerary |
| `GET` | `/api/v1/itineraries/:id` | Fetch full itinerary by ID |
| `PATCH` | `/api/v1/itineraries/:id` | Update itinerary details or days |
| `DELETE` | `/api/v1/itineraries/:id` | Delete itinerary |
| `POST` | `/api/v1/itineraries/:id/route` | Compute full TomTom/PostGIS route polyline |
| `POST` | `/api/v1/itineraries/:id/optimize` | Generate optimization preview and recommendations |
| `GET` | `/api/v1/itineraries/:id/nearby` | Query PostGIS nearby places within radius |
| `GET` | `/api/v1/itineraries/:id/recommendations` | Query route-aware detour recommendations |
| `POST` | `/api/v1/itineraries/:id/journey/start` | Activate live Journey Mode |
| `PATCH` | `/api/v1/itineraries/:id/stops/:stopId` | Update stop status (`PLANNED`, `ACTIVE`, `COMPLETED`, `SKIPPED`) |

---

## 2. Optimize Proposal Schema
`POST /api/v1/itineraries/:id/optimize` returns:
```json
{
  "proposalStatus": "PENDING_USER_CONFIRMATION",
  "itinerary": { ... },
  "changes": [
    {
      "type": "STOP_REORDERED",
      "description": "Re-sequenced route waypoints to eliminate backtracking loop.",
      "impact": "Saves estimated ~35–50 km of redundant transit."
    }
  ],
  "feasibility": {
    "overallHealth": "EXCELLENT",
    "headlineExplanation": "Your itinerary is well-balanced with ample travel buffers.",
    "isFeasible": true
  },
  "recommendations": [ ... ]
}
```
