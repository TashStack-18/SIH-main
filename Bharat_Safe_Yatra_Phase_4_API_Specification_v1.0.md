# 🇮🇳 BHARAT SAFE YATRA
## Phase 4 — API Specification
### SIH 2026

**API Version:** 1.0  
**Platform:** Web Application  
**Scope:** India's 8 Union Territories  
**Backend:** NestJS + TypeScript  
**Database:** PostgreSQL + PostGIS + pgvector  
**API Style:** REST + JSON  
**Base URL:** `/api/v1`  
**Purpose:** Define the complete API contract between the Bharat Safe Yatra frontend, backend, database, AI engine, maps, booking providers, safety systems, and external data providers.

---

# 1. API Philosophy

The API should be:

- RESTful
- Versioned
- Secure
- Predictable
- Typed
- Validated
- Observable
- Provider-independent
- AI-tool compatible
- Geographic-query capable
- Scalable

The frontend should communicate with the Bharat Safe Yatra API rather than directly accessing protected third-party services.

```text
Next.js
   │
   ▼
Bharat Safe Yatra API
   │
   ├── PostgreSQL
   ├── Redis
   ├── AI
   ├── Mapbox
   ├── Weather
   ├── Booking Providers
   └── Verified Data Sources
```

---

# 2. API Base Structure

All API endpoints use:

```text
/api/v1
```

Examples:

```text
/api/v1/territories
/api/v1/destinations
/api/v1/itineraries
/api/v1/maps
/api/v1/ai
/api/v1/bookings
/api/v1/safety
```

Future versions can use:

```text
/api/v2
```

without breaking existing clients.

---

# 3. HTTP Methods

The API will use:

```text
GET
POST
PATCH
PUT
DELETE
```

Primary conventions:

| Method | Purpose |
|---|---|
| GET | Retrieve resources |
| POST | Create resource / execute action |
| PATCH | Partially update resource |
| PUT | Replace resource where appropriate |
| DELETE | Remove or archive resource |

---

# 4. Standard Headers

Required/requested headers:

```http
Content-Type: application/json
Accept: application/json
```

Authenticated requests:

```http
Authorization: Bearer <token>
```

Optional request tracing:

```http
X-Request-ID: <uuid>
```

---

# 5. Standard Response Envelope

Successful responses should follow:

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "error": null
}
```

For list endpoints:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120
  },
  "error": null
}
```

---

# 6. Standard Error Response

```json
{
  "success": false,
  "data": null,
  "meta": {},
  "error": {
    "code": "DESTINATION_NOT_FOUND",
    "message": "The requested destination could not be found.",
    "details": null,
    "request_id": "req_123"
  }
}
```

---

# 7. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 202 | Accepted for asynchronous processing |
| 204 | Successful request with no content |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict |
| 422 | Validation failure |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 502 | External provider failure |
| 503 | Service temporarily unavailable |

---

# 8. Pagination

List endpoints should support:

```text
?page=1&limit=20
```

Example:

```text
GET /api/v1/destinations?page=1&limit=20
```

For high-volume resources, cursor pagination can be used:

```text
GET /api/v1/destinations?cursor=<cursor>&limit=20
```

Maximum default:

```text
limit = 50
```

Maximum allowed:

```text
limit = 100
```

---

# 9. Sorting

Generic sorting:

```text
?sort=created_at
?sort=-rating
?sort=name
```

Only whitelisted sortable fields should be accepted.

---

# 10. Filtering

Example:

```text
GET /api/v1/destinations
  ?territory=ladakh
  &type=mountain
  &rating_min=4
```

Filtering should be performed server-side.

---

# 11. Search

Global search:

```http
GET /api/v1/search?q=mountains
```

Supported query parameters:

```text
q
type
territory
destination
latitude
longitude
radius
page
limit
```

Possible response:

```json
{
  "success": true,
  "data": {
    "destinations": [],
    "attractions": [],
    "experiences": [],
    "hotels": [],
    "restaurants": [],
    "festivals": []
  }
}
```

---

# 12. Union Territory APIs

## GET `/territories`

Returns all supported Union Territories.

```http
GET /api/v1/territories
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "LADAKH",
      "name": "Ladakh",
      "slug": "ladakh",
      "capital": "Leh",
      "short_description": "...",
      "description": "...",
      "latitude": 34.1526,
      "longitude": 77.5771
    }
  ]
}
```

---

# 13. GET Territory

```http
GET /api/v1/territories/:slug
```

Example:

```text
GET /api/v1/territories/ladakh
```

Returns:

- territory details
- popular destinations
- major attractions
- festivals
- current weather
- safety alerts
- travel advisories

---

# 14. Territory Destinations

```http
GET /api/v1/territories/:slug/destinations
```

Parameters:

```text
page
limit
type
rating_min
sort
```

---

# 15. Territory Festivals

```http
GET /api/v1/territories/:slug/festivals
```

Parameters:

```text
start_date
end_date
category
page
limit
```

---

# 16. Territory Alerts

```http
GET /api/v1/territories/:slug/alerts
```

Returns active travel and safety alerts.

---

# 17. Destination APIs

## GET Destinations

```http
GET /api/v1/destinations
```

Filters:

```text
territory
region
type
rating_min
budget_min
budget_max
lat
lng
radius
sort
page
limit
```

---

# 18. GET Destination

```http
GET /api/v1/destinations/:slug
```

Returns:

```text
Destination
├── overview
├── attractions
├── experiences
├── hotels
├── restaurants
├── festivals
├── culture
├── food
├── weather
├── advisories
├── permits
├── rules
├── media
└── nearby_places
```

---

# 19. Destination Attractions

```http
GET /api/v1/destinations/:id/attractions
```

Filters:

```text
type
rating_min
distance
page
limit
```

---

# 20. Destination Experiences

```http
GET /api/v1/destinations/:id/experiences
```

Filters:

```text
type
difficulty
price_min
price_max
rating_min
page
limit
```

---

# 21. Destination Hotels

```http
GET /api/v1/destinations/:id/hotels
```

Filters:

```text
price_min
price_max
star_rating
rating_min
availability
page
limit
```

---

# 22. Destination Restaurants

```http
GET /api/v1/destinations/:id/restaurants
```

Filters:

```text
cuisine
dietary
price_level
rating_min
page
limit
```

---

# 23. Nearby Places

```http
GET /api/v1/places/nearby
```

Required:

```text
latitude
longitude
```

Optional:

```text
radius
type
limit
```

Example:

```text
GET /api/v1/places/nearby?latitude=34.15&longitude=77.57&radius=5000&type=attraction
```

---

# 24. Attraction APIs

## GET Attraction

```http
GET /api/v1/attractions/:id
```

Returns:

- details
- location
- opening hours
- fees
- rating
- media
- nearby places
- safety information

---

# 25. Experience APIs

```http
GET /api/v1/experiences/:id
```

---

# 26. Hotel APIs

```http
GET /api/v1/hotels/:id
```

---

# 27. Restaurant APIs

```http
GET /api/v1/restaurants/:id
```

---

# 28. Festival APIs

## GET Festivals

```http
GET /api/v1/festivals
```

Filters:

```text
territory
destination
start_date
end_date
category
page
limit
```

---

# 29. Festival Details

```http
GET /api/v1/festivals/:id
```

Returns:

```text
name
description
cultural_significance
start_date
end_date
location
official_url
nearby_destinations
media
verification
```

---

# 30. Upcoming Festivals

```http
GET /api/v1/festivals/upcoming
```

Parameters:

```text
days
territory
destination
limit
```

---

# 31. Events APIs

```http
GET /api/v1/events
GET /api/v1/events/:id
```

Filters:

```text
territory
destination
start_date
end_date
category
```

---

# 32. Weather APIs

## Current Weather

```http
GET /api/v1/weather/current
```

Parameters:

```text
latitude
longitude
```

or:

```text
destination_id
```

---

# 33. Destination Weather

```http
GET /api/v1/destinations/:id/weather
```

Response:

```json
{
  "temperature_c": 18.5,
  "feels_like_c": 17.9,
  "humidity_percent": 52,
  "wind_speed_kmh": 12,
  "weather_description": "Clear sky",
  "observed_at": "2026-08-26T12:00:00Z"
}
```

---

# 34. Weather Forecast

```http
GET /api/v1/weather/forecast
```

Parameters:

```text
latitude
longitude
days
```

Maximum forecast length should depend on the external provider.

---

# 35. Travel Advisory APIs

```http
GET /api/v1/advisories
GET /api/v1/advisories/:id
```

Filters:

```text
territory
destination
severity
active
```

---

# 36. Safety Alert APIs

```http
GET /api/v1/safety/alerts
GET /api/v1/safety/alerts/:id
```

Filters:

```text
latitude
longitude
radius
type
severity
active
```

---

# 37. Emergency Facility APIs

## Nearby Emergency Services

```http
GET /api/v1/safety/emergency/nearby
```

Required:

```text
latitude
longitude
```

Optional:

```text
radius
type
limit
```

Example:

```text
GET /api/v1/safety/emergency/nearby
  ?latitude=34.15
  &longitude=77.57
  &radius=10000
```

---

# 38. Emergency Facility Details

```http
GET /api/v1/safety/emergency/:id
```

Returns:

```text
name
type
address
phone_numbers
emergency_phone
services
operating_hours
location
distance
verification
```

---

# 39. Emergency Contacts

```http
GET /api/v1/safety/emergency-contacts
```

Filters:

```text
territory
service_type
```

---

# 40. SOS API

The SOS system should be extremely simple and fast.

## POST `/safety/sos`

```http
POST /api/v1/safety/sos
```

Request:

```json
{
  "latitude": 34.1526,
  "longitude": 77.5771,
  "accuracy_meters": 15,
  "itinerary_id": "uuid"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "location": {
      "latitude": 34.1526,
      "longitude": 77.5771
    },
    "nearest_services": [
      {
        "id": "uuid",
        "name": "Emergency Facility",
        "type": "HOSPITAL",
        "distance_meters": 2400,
        "phone": "+91..."
      }
    ],
    "official_contacts": []
  }
}
```

The SOS endpoint must not depend on the AI service.

---

# 41. Itinerary APIs

## Create Itinerary

```http
POST /api/v1/itineraries
```

Request:

```json
{
  "name": "Ladakh Adventure",
  "start_date": "2026-09-10",
  "end_date": "2026-09-15",
  "traveller_count": 2,
  "budget_max": 50000,
  "travel_style": "ADVENTURE",
  "interests": [
    "NATURE",
    "PHOTOGRAPHY"
  ]
}
```

---

# 42. Get User Itineraries

```http
GET /api/v1/itineraries
```

Filters:

```text
status
start_date
end_date
page
limit
```

Authentication required.

---

# 43. Get Itinerary

```http
GET /api/v1/itineraries/:id
```

Returns:

```text
itinerary
days
items
transports
routes
budget
bookings
packing_list
```

---

# 44. Update Itinerary

```http
PATCH /api/v1/itineraries/:id
```

Request example:

```json
{
  "name": "Updated Ladakh Adventure",
  "end_date": "2026-09-17",
  "budget_max": 60000
}
```

---

# 45. Delete Itinerary

```http
DELETE /api/v1/itineraries/:id
```

For user-owned itineraries, soft deletion is preferred.

---

# 46. Add Itinerary Day

```http
POST /api/v1/itineraries/:id/days
```

Request:

```json
{
  "day_number": 1,
  "date": "2026-09-10",
  "title": "Arrival in Leh"
}
```

---

# 47. Update Itinerary Day

```http
PATCH /api/v1/itineraries/:id/days/:dayId
```

---

# 48. Delete Itinerary Day

```http
DELETE /api/v1/itineraries/:id/days/:dayId
```

---

# 49. Add Itinerary Item

```http
POST /api/v1/itineraries/:id/days/:dayId/items
```

Request:

```json
{
  "type": "ATTRACTION",
  "attraction_id": "uuid",
  "sequence_number": 2,
  "start_time": "10:00",
  "duration_minutes": 120
}
```

---

# 50. Update Itinerary Item

```http
PATCH /api/v1/itineraries/:id/items/:itemId
```

---

# 51. Delete Itinerary Item

```http
DELETE /api/v1/itineraries/:id/items/:itemId
```

---

# 52. Reorder Itinerary Items

```http
POST /api/v1/itineraries/:id/reorder
```

Request:

```json
{
  "day_id": "uuid",
  "item_ids": [
    "uuid1",
    "uuid2",
    "uuid3"
  ]
}
```

---

# 53. Change Trip Duration

```http
POST /api/v1/itineraries/:id/resize
```

Request:

```json
{
  "duration_days": 8
}
```

The service should:

1. validate the new dates
2. preserve existing user selections where possible
3. reorganize days
4. recalculate routes
5. recalculate estimated cost
6. return the updated itinerary

---

# 54. Optimize Itinerary

```http
POST /api/v1/itineraries/:id/optimize
```

Request:

```json
{
  "priorities": [
    "MINIMIZE_TRAVEL_TIME",
    "MAXIMIZE_EXPERIENCES"
  ]
}
```

Response returns a proposed itinerary.

AI-generated changes should require user confirmation before destructive modifications.

---

# 55. Preview Itinerary Changes

```http
POST /api/v1/itineraries/:id/preview-changes
```

Request:

```json
{
  "changes": [
    {
      "action": "ADD",
      "attraction_id": "uuid",
      "day": 3
    }
  ]
}
```

Response:

```json
{
  "current": {},
  "proposed": {},
  "route_changes": {},
  "budget_changes": {}
}
```

---

# 56. Confirm Itinerary Changes

```http
POST /api/v1/itineraries/:id/confirm-changes
```

The endpoint commits the previously previewed changes.

---

# 57. Itinerary Versions

```http
GET /api/v1/itineraries/:id/versions
```

Get a specific version:

```http
GET /api/v1/itineraries/:id/versions/:version
```

Restore:

```http
POST /api/v1/itineraries/:id/versions/:version/restore
```

---

# 58. Route APIs

## Calculate Route

```http
POST /api/v1/maps/routes
```

Request:

```json
{
  "origin": {
    "latitude": 34.15,
    "longitude": 77.57
  },
  "destination": {
    "latitude": 34.36,
    "longitude": 77.59
  },
  "mode": "driving"
}
```

Response:

```json
{
  "distance_meters": 120000,
  "duration_seconds": 14400,
  "geometry": "encoded-or-geojson",
  "provider": "mapbox"
}
```

---

# 59. Multi-Stop Route

```http
POST /api/v1/maps/routes/multi-stop
```

Request:

```json
{
  "stops": [
    {
      "latitude": 34.15,
      "longitude": 77.57
    },
    {
      "latitude": 35.33,
      "longitude": 77.60
    },
    {
      "latitude": 33.75,
      "longitude": 78.55
    }
  ],
  "mode": "driving"
}
```

---

# 60. Itinerary Route

```http
GET /api/v1/itineraries/:id/route
```

Returns the route generated from itinerary items.

---

# 61. Nearby Map Places

```http
GET /api/v1/maps/nearby
```

Parameters:

```text
latitude
longitude
radius
categories
```

---

# 62. Map Layers

```http
GET /api/v1/maps/layers
```

Possible layers:

```text
destinations
attractions
hotels
restaurants
festivals
emergency
alerts
```

---

# 63. AI API Architecture

Yatra AI should expose a controlled application API.

```text
POST /api/v1/ai/chat
POST /api/v1/ai/itinerary
POST /api/v1/ai/recommend
POST /api/v1/ai/ask
```

The AI backend handles tool calling internally.

---

# 64. AI Chat

```http
POST /api/v1/ai/chat
```

Request:

```json
{
  "conversation_id": "uuid",
  "message": "What should I visit in Ladakh?"
}
```

Response:

```json
{
  "conversation_id": "uuid",
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "..."
  },
  "citations": []
}
```

---

# 65. Create AI Conversation

```http
POST /api/v1/ai/conversations
```

Request:

```json
{
  "title": "Ladakh Planning"
}
```

---

# 66. Get AI Conversations

```http
GET /api/v1/ai/conversations
```

Authentication required.

---

# 67. Get AI Conversation

```http
GET /api/v1/ai/conversations/:id
```

---

# 68. AI Itinerary Generation

```http
POST /api/v1/ai/itinerary
```

Request:

```json
{
  "destination": "Ladakh",
  "duration_days": 6,
  "travellers": 2,
  "budget": 50000,
  "currency": "INR",
  "interests": [
    "NATURE",
    "PHOTOGRAPHY"
  ],
  "travel_style": "ADVENTURE"
}
```

Response should be structured:

```json
{
  "destination": "Ladakh",
  "duration_days": 6,
  "estimated_cost": 48000,
  "days": [
    {
      "day": 1,
      "title": "Arrival in Leh",
      "items": []
    }
  ]
}
```

---

# 69. AI Recommendation

```http
POST /api/v1/ai/recommend
```

Request:

```json
{
  "query": "peaceful mountain destinations",
  "territory": "LADAKH",
  "budget": 30000,
  "duration_days": 5
}
```

---

# 70. AI Ask

For general destination questions:

```http
POST /api/v1/ai/ask
```

Request:

```json
{
  "question": "What permits do I need for this trip?",
  "destination_id": "uuid"
}
```

The AI should retrieve verified sources and provide citations.

---

# 71. AI Tool Execution Rules

The backend may expose internal tools:

```text
search_destinations
get_destination_details
search_attractions
search_experiences
search_hotels
search_restaurants
search_festivals
get_weather
calculate_route
create_itinerary
modify_itinerary
optimize_itinerary
estimate_budget
find_nearby_emergency_services
get_travel_advisories
search_bookings
```

These are internal service calls, not necessarily public HTTP endpoints.

---

# 72. AI Tool Permission Levels

```text
READ
WRITE
TRANSACTIONAL
EMERGENCY
```

Example:

```text
search_destinations       READ
get_weather               READ
calculate_route           READ
create_itinerary          WRITE
modify_itinerary          WRITE
create_booking            TRANSACTIONAL
cancel_booking            TRANSACTIONAL
SOS                       EMERGENCY
```

AI should not execute transactional or sensitive operations without explicit user confirmation.

---

# 73. AI Confirmation Flow

```text
User
 ↓
AI recommendation
 ↓
Preview
 ↓
User confirmation
 ↓
Tool execution
 ↓
Result
```

Example:

> "I can add Pangong Lake to Day 4. Would you like me to apply this change?"

---

# 74. Booking APIs

Booking APIs should be provider-independent.

## Search

```http
GET /api/v1/bookings/search
```

Parameters:

```text
type
destination_id
check_in
check_out
travellers
guests
budget_min
budget_max
```

---

# 75. Hotel Availability

```http
GET /api/v1/bookings/hotels/:hotelId/availability
```

Parameters:

```text
check_in
check_out
guests
rooms
```

---

# 76. Experience Availability

```http
GET /api/v1/bookings/experiences/:experienceId/availability
```

Parameters:

```text
date
travellers
```

---

# 77. Create Booking

```http
POST /api/v1/bookings
```

Request:

```json
{
  "provider_id": "uuid",
  "listing_id": "uuid",
  "booking_type": "HOTEL",
  "itinerary_id": "uuid",
  "start_at": "2026-09-10T00:00:00Z",
  "end_at": "2026-09-12T00:00:00Z",
  "traveller_details": {
    "adults": 2,
    "children": 0
  }
}
```

The backend must validate availability again before booking.

---

# 78. Booking Confirmation

```http
GET /api/v1/bookings/:id
```

Returns:

```text
booking status
payment status
provider
external booking id
dates
amount
traveller details
```

---

# 79. Cancel Booking

```http
POST /api/v1/bookings/:id/cancel
```

Cancellation must use provider rules.

---

# 80. Booking Events

```http
GET /api/v1/bookings/:id/events
```

Returns booking audit history.

---

# 81. User APIs

## Current User

```http
GET /api/v1/users/me
```

---

# 82. Update User

```http
PATCH /api/v1/users/me
```

Request:

```json
{
  "display_name": "Traveller",
  "preferred_language": "en",
  "preferred_currency": "INR"
}
```

---

# 83. User Preferences

```http
GET /api/v1/users/me/preferences
PATCH /api/v1/users/me/preferences
```

---

# 84. Saved Places

```http
GET /api/v1/users/me/saved-places
POST /api/v1/users/me/saved-places
DELETE /api/v1/users/me/saved-places/:id
```

---

# 85. Reviews

Create:

```http
POST /api/v1/reviews
```

Get:

```http
GET /api/v1/reviews
```

Delete own review:

```http
DELETE /api/v1/reviews/:id
```

Review request:

```json
{
  "destination_id": "uuid",
  "rating": 5,
  "title": "Amazing experience",
  "body": "..."
}
```

---

# 86. Emergency Contacts — User

```http
GET /api/v1/users/me/emergency-contacts
POST /api/v1/users/me/emergency-contacts
PATCH /api/v1/users/me/emergency-contacts/:id
DELETE /api/v1/users/me/emergency-contacts/:id
```

---

# 87. Yatra Share APIs

Create share session:

```http
POST /api/v1/itineraries/:id/share
```

Response:

```json
{
  "share_url": "...",
  "expires_at": "..."
}
```

Deactivate:

```http
DELETE /api/v1/itineraries/:id/share
```

Public shared view:

```http
GET /api/v1/share/:token
```

Only non-sensitive information should be exposed.

---

# 88. Live Location APIs

Start:

```http
POST /api/v1/yatra/live/start
```

Update:

```http
POST /api/v1/yatra/live/location
```

Request:

```json
{
  "share_session_id": "uuid",
  "latitude": 34.15,
  "longitude": 77.57,
  "accuracy_meters": 10,
  "speed_kmh": 22,
  "heading_degrees": 120
}
```

Stop:

```http
POST /api/v1/yatra/live/stop
```

---

# 89. Packing APIs

Generate:

```http
POST /api/v1/itineraries/:id/packing-list/generate
```

Get:

```http
GET /api/v1/itineraries/:id/packing-list
```

Update item:

```http
PATCH /api/v1/packing-items/:id
```

---

# 90. Budget APIs

Generate:

```http
POST /api/v1/itineraries/:id/budget/calculate
```

Get:

```http
GET /api/v1/itineraries/:id/budget
```

Update:

```http
PATCH /api/v1/budget-items/:id
```

---

# 91. Culture APIs

```http
GET /api/v1/destinations/:id/culture
```

---

# 92. Food APIs

```http
GET /api/v1/food
GET /api/v1/food/:id
```

Filters:

```text
territory
destination
category
dietary
```

---

# 93. Transport APIs

```http
GET /api/v1/transport
GET /api/v1/transport/:id
```

Filters:

```text
territory
destination
type
```

---

# 94. Permit APIs

```http
GET /api/v1/permits
GET /api/v1/permits/:id
```

Filters:

```text
territory
destination
required
```

---

# 95. Destination Rules APIs

```http
GET /api/v1/destinations/:id/rules
```

---

# 96. Media APIs

Media is primarily accessed through related resources.

Example:

```http
GET /api/v1/destinations/:id/media
```

Admin-only media upload endpoints are described in the admin API section.

---

# 97. Admin API

Admin APIs require role-based authorization.

```text
ADMIN
CONTENT_MANAGER
SAFETY_MANAGER
```

---

# 98. Admin Territory Management

```http
POST /api/v1/admin/territories
PATCH /api/v1/admin/territories/:id
DELETE /api/v1/admin/territories/:id
```

---

# 99. Admin Destination Management

```http
POST /api/v1/admin/destinations
PATCH /api/v1/admin/destinations/:id
DELETE /api/v1/admin/destinations/:id
```

---

# 100. Admin Attraction Management

```http
POST /api/v1/admin/attractions
PATCH /api/v1/admin/attractions/:id
DELETE /api/v1/admin/attractions/:id
```

---

# 101. Admin Festival Management

```http
POST /api/v1/admin/festivals
PATCH /api/v1/admin/festivals/:id
DELETE /api/v1/admin/festivals/:id
```

---

# 102. Admin Safety Management

```http
POST /api/v1/admin/emergency-facilities
PATCH /api/v1/admin/emergency-facilities/:id
DELETE /api/v1/admin/emergency-facilities/:id
```

---

# 103. Admin Alert Management

```http
POST /api/v1/admin/alerts
PATCH /api/v1/admin/alerts/:id
DELETE /api/v1/admin/alerts/:id
```

---

# 104. Admin Advisory Management

```http
POST /api/v1/admin/advisories
PATCH /api/v1/admin/advisories/:id
DELETE /api/v1/admin/advisories/:id
```

---

# 105. Admin Verification

```http
GET /api/v1/admin/verification/pending
POST /api/v1/admin/verification/:id/verify
POST /api/v1/admin/verification/:id/reject
```

---

# 106. Admin Knowledge Management

```http
POST /api/v1/admin/knowledge/documents
PATCH /api/v1/admin/knowledge/documents/:id
DELETE /api/v1/admin/knowledge/documents/:id
POST /api/v1/admin/knowledge/documents/:id/reindex
```

Reindexing should regenerate:

```text
chunks
embeddings
metadata
search indexes
```

---

# 107. Admin Data Sources

```http
GET /api/v1/admin/data-sources
POST /api/v1/admin/data-sources
PATCH /api/v1/admin/data-sources/:id
```

---

# 108. Admin Dashboard

```http
GET /api/v1/admin/dashboard
```

Possible metrics:

```text
destinations
attractions
festivals
verified records
pending records
active alerts
bookings
users
AI requests
system health
```

---

# 109. Health APIs

Public health:

```http
GET /api/v1/health
```

Detailed internal health:

```http
GET /api/v1/health/detailed
```

Should check:

```text
database
redis
AI
map provider
weather provider
booking providers
```

Detailed health should require authorization.

---

# 110. External Provider Abstraction

The API should never expose provider-specific logic to the frontend.

Correct:

```text
Frontend
   ↓
Booking API
   ↓
Provider Adapter
   ↓
External Provider
```

Incorrect:

```text
Frontend
   ↓
Provider-specific API
```

---

# 111. Map Provider Abstraction

Likewise:

```text
Map API
   ↓
Map Service
   ↓
Mapbox Adapter
```

If the provider changes later, frontend contracts remain stable.

---

# 112. Weather Provider Abstraction

```text
Weather API
   ↓
Weather Service
   ↓
Weather Provider Adapter
```

---

# 113. Standard Query Validation

Every query parameter must be validated.

Examples:

```text
latitude: -90 to 90
longitude: -180 to 180
radius: positive
limit: 1 to 100
rating_min: 1 to 5
date: ISO-8601
UUID: valid UUID
```

Invalid input returns:

```text
422 UNPROCESSABLE_ENTITY
```

---

# 114. Authentication

Public endpoints:

```text
GET /territories
GET /destinations
GET /festivals
GET /weather
GET /search
GET /maps/nearby
GET /safety/emergency/nearby
```

Authenticated endpoints:

```text
itineraries
bookings
saved places
reviews
AI conversations
user preferences
emergency contacts
Yatra sharing
```

Admin endpoints require appropriate roles.

---

# 115. Authorization Rules

A user may access:

```text
their own itineraries
their own bookings
their own AI conversations
their own saved places
their own emergency contacts
their own reviews
their own share sessions
```

A user must not access another user's private resources.

---

# 116. Resource Ownership

Every private resource should be checked using:

```text
resource.user_id == authenticated_user.id
```

Do not trust a user-provided ID alone.

---

# 117. Rate Limiting

Recommended initial limits:

### Public read APIs

```text
60 requests/minute/IP
```

### Search

```text
30 requests/minute/IP
```

### AI

```text
20 requests/minute/user
```

### SOS

Should have special emergency handling and must not be blocked by ordinary AI/search rate limits.

### Admin

Lower-volume authenticated limits.

Exact production values can be tuned after load testing.

---

# 118. AI Rate Limits

AI endpoints should have:

- user-based limits
- IP-based protection
- token budget controls
- request timeout
- maximum context size
- abuse detection

---

# 119. Idempotency

Transactional endpoints should support idempotency.

Especially:

```text
POST /bookings
POST /payments
POST /safety/sos
```

Example:

```http
Idempotency-Key: <uuid>
```

This prevents accidental duplicate transactions.

---

# 120. Booking Idempotency

The booking service should:

1. receive idempotency key
2. check previous request
3. return previous result if already processed
4. otherwise execute booking

This is essential for real booking integrations.

---

# 121. API Caching

Safe-to-cache resources include:

```text
territories
destination details
attractions
experiences
festivals
culture
food
transport
public advisories
weather snapshots
```

Private resources should not be publicly cached.

---

# 122. ETags / Conditional Requests

For stable content, the API can support:

```http
ETag
If-None-Match
```

This reduces unnecessary data transfer.

---

# 123. API Security Rules

The backend must:

- validate input
- sanitize output where needed
- authenticate private requests
- authorize resource access
- rate-limit
- log security events
- never expose secrets
- never expose internal stack traces
- validate uploaded files
- protect admin endpoints

---

# 124. Error Code Standards

Example error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
DESTINATION_NOT_FOUND
ITINERARY_NOT_FOUND
BOOKING_NOT_FOUND
BOOKING_UNAVAILABLE
BOOKING_PROVIDER_ERROR
WEATHER_PROVIDER_ERROR
MAP_PROVIDER_ERROR
AI_SERVICE_ERROR
AI_TOOL_ERROR
RATE_LIMITED
INVALID_COORDINATES
INVALID_DATE_RANGE
CONFLICT
INTERNAL_ERROR
```

---

# 125. External Provider Failure

If a provider fails:

```text
Provider
   ↓
Timeout / Error
   ↓
Provider Adapter
   ↓
Fallback / Cache
   ↓
API
   ↓
User-friendly response
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "WEATHER_PROVIDER_ERROR",
    "message": "Live weather data is temporarily unavailable."
  }
}
```

---

# 126. Async Jobs

Long-running operations should use background jobs.

Potential jobs:

```text
AI itinerary generation
RAG indexing
Embedding generation
Large data import
Festival synchronization
Provider synchronization
Analytics aggregation
```

Response:

```http
202 Accepted
```

Example:

```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "QUEUED"
  }
}
```

---

# 127. Job Status API

```http
GET /api/v1/jobs/:id
```

Response:

```json
{
  "job_id": "uuid",
  "status": "COMPLETED",
  "progress": 100,
  "result": {}
}
```

---

# 128. API Logging

Each request should record:

```text
request_id
timestamp
method
path
status
duration
user_id if available
ip metadata where appropriate
provider failures
```

Sensitive fields must never be logged.

Do not log:

```text
passwords
API keys
payment credentials
raw authentication tokens
full private documents
```

---

# 129. AI Logging

AI logs should include:

```text
conversation_id
message_id
model
latency
tool_calls
token usage
error status
```

Do not expose sensitive user information unnecessarily.

---

# 130. API Observability

Use:

```text
structured logs
metrics
traces
error monitoring
```

Recommended:

### Sentry

for application error monitoring.

---

# 131. API Documentation

The NestJS backend should generate:

### OpenAPI / Swagger

Documentation should include:

- endpoints
- request schemas
- response schemas
- authentication
- error responses
- examples

Recommended development endpoint:

```text
/api/docs
```

This endpoint should be protected or disabled in production depending on deployment policy.

---

# 132. Type Safety

Frontend and backend should share API types where practical.

Recommended monorepo package:

```text
packages/types
```

Possible generated API types can come from OpenAPI.

---

# 133. API Versioning Rule

Breaking changes require a new version.

Example:

```text
/api/v1
/api/v2
```

Non-breaking changes can be added to v1.

Never silently change an existing field's meaning.

---

# 134. API Contract Example

Frontend request:

```text
POST /api/v1/ai/itinerary
```

Backend:

```text
validate request
      ↓
retrieve tourism data
      ↓
retrieve weather
      ↓
calculate routes
      ↓
AI planner
      ↓
structured output validation
      ↓
save / return itinerary
```

---

# 135. Complete API Domain Map

```text
/api/v1
│
├── territories
├── regions
│
├── destinations
├── attractions
├── experiences
├── hotels
├── restaurants
├── festivals
├── events
├── food
├── culture
├── transport
├── permits
│
├── weather
├── advisories
├── safety
│   ├── alerts
│   ├── emergency
│   └── emergency-contacts
│
├── maps
│   ├── routes
│   ├── nearby
│   └── layers
│
├── itineraries
│   ├── days
│   ├── items
│   ├── routes
│   ├── budget
│   ├── packing
│   └── share
│
├── bookings
│
├── users
│   └── me
│
├── reviews
│
├── ai
│   ├── chat
│   ├── ask
│   ├── itinerary
│   ├── recommend
│   └── conversations
│
├── yatra
│   └── live
│
├── search
│
├── jobs
│
├── health
│
└── admin
```

---

# 136. Critical API Architecture Decision

The most important API principle is:

## **The frontend never owns business logic that belongs to the backend.**

Correct:

```text
Frontend
   ↓
API
   ↓
Business Service
   ↓
Database / External Provider
```

Not:

```text
Frontend
   ↓
External API
```

and not:

```text
Frontend
   ↓
Complex business logic
```

---

# 137. AI Architecture Decision

Yatra AI is an application service, not a separate uncontrolled chatbot.

```text
User
 ↓
AI API
 ↓
AI Orchestrator
 ├── RAG
 ├── Tools
 ├── Verification
 ├── Permissions
 └── Structured Output
 ↓
Application Services
```

---

# 138. Safety Architecture Decision

Safety APIs must remain deterministic.

```text
SOS
 ↓
Location
 ↓
PostGIS
 ↓
Emergency Facilities
 ↓
Official Contacts
```

AI may provide additional guidance, but emergency lookup must not depend on AI generation.

---

# 139. Booking Architecture Decision

Bookings must be:

```text
Provider-independent
+
Idempotent
+
User-confirmed
+
Auditable
```

AI can recommend bookings but must not silently perform paid transactions.

---

# 140. API Implementation Order

Implementation should proceed in this order:

### Phase 4A

Core infrastructure:

```text
authentication
validation
error handling
logging
Swagger
rate limiting
```

### Phase 4B

Tourism APIs:

```text
territories
destinations
attractions
experiences
festivals
```

### Phase 4C

Travel APIs:

```text
itineraries
routes
weather
budget
packing
```

### Phase 4D

Safety APIs:

```text
emergency
alerts
advisories
SOS
```

### Phase 4E

AI APIs:

```text
chat
RAG
recommendations
itinerary generation
tool execution
```

### Phase 4F

Booking APIs:

```text
search
availability
booking
cancellation
events
```

### Phase 4G

Admin APIs.

---

# 141. API Testing Strategy

Every major endpoint should have:

### Unit tests

For service logic.

### Integration tests

For database interactions.

### E2E tests

For complete request flows.

Critical flows:

```text
Search destination
Create itinerary
Modify itinerary
Generate route
Ask AI
Generate AI itinerary
Find emergency services
Trigger SOS
Check booking availability
Create booking
Cancel booking
```

---

# 142. API Test Example

```text
POST /api/v1/itineraries
        ↓
201 Created
        ↓
GET /api/v1/itineraries/:id
        ↓
200 OK
        ↓
POST /api/v1/itineraries/:id/resize
        ↓
200 OK
        ↓
GET /api/v1/itineraries/:id/route
        ↓
200 OK
```

---

# 143. SIH Critical Demo APIs

For the SIH demonstration, the most important APIs are:

```text
GET  /territories
GET  /destinations
GET  /destinations/:id
GET  /festivals
GET  /weather/current

POST /ai/chat
POST /ai/itinerary

POST /itineraries
PATCH /itineraries/:id
POST /itineraries/:id/resize

POST /maps/routes
GET  /itineraries/:id/route

GET  /safety/emergency/nearby
POST /safety/sos

GET  /bookings/search
GET  /bookings/.../availability
POST /bookings
```

These demonstrate the core product story.

---

# 144. Complete Request Flow

```text
USER
  │
  ▼
NEXT.JS
  │
  ▼
API ROUTE
  │
  ▼
AUTH / VALIDATION
  │
  ▼
CONTROLLER
  │
  ▼
SERVICE
  │
  ├───────────────┐
  ▼               ▼
DATABASE       EXTERNAL API
  │               │
  └───────┬───────┘
          ▼
       SERVICE
          │
          ▼
     RESPONSE DTO
          │
          ▼
       NEXT.JS
          │
          ▼
         USER
```

---

# 145. Phase 4 API Decision Summary

| Area | Decision |
|---|---|
| API Style | REST |
| Versioning | `/api/v1` |
| Format | JSON |
| Backend | NestJS |
| Documentation | OpenAPI / Swagger |
| Authentication | Secure token/session based |
| Authorization | RBAC + resource ownership |
| Validation | Server-side DTO validation |
| Pagination | Page + cursor where needed |
| Search | Keyword + semantic |
| Maps | Provider abstraction |
| Weather | Provider abstraction |
| Booking | Provider adapter |
| AI | Controlled orchestrator |
| Safety | Deterministic service |
| Errors | Standard error envelope |
| Rate Limiting | Redis-backed |
| Idempotency | Transactional endpoints |
| Async Jobs | Background queue |
| Monitoring | Sentry + structured logs |
| API Types | Shared/generated types |
| Testing | Unit + integration + E2E |

---

# 146. Phase 4 → Phase 5

With the API contract established, the next major phase should be:

# **Phase 5 — 8 Union Territory Tourism Data Research & Knowledge Base**

This phase will create the actual verified tourism intelligence required by the system.

For each Union Territory we will research and structure:

```text
Union Territory
│
├── Destinations
├── Attractions
├── Experiences
├── Hotels
├── Restaurants
├── Festivals
├── Events
├── Culture
├── Food
├── Transport
├── Permits
├── Rules
├── Emergency Facilities
├── Emergency Contacts
├── Travel Advisories
├── Safety Alerts
├── Weather Context
└── Official Sources
```

The research must prioritize:

```text
Official Government Sources
Tourism Departments
Government Notifications
Official Transport Providers
Official Emergency Services
Verified authoritative sources
```

Every important record should preserve:

```text
source
source_url
verification_status
verified_at
last_updated
```

---

# 147. Phase 4 Status

**API Specification v1.0 is now defined.**

This document is the **Phase 4 API source of truth** for Bharat Safe Yatra and will guide NestJS controllers, services, DTOs, validation, authentication, authorization, frontend integration, AI tool execution, maps, booking integrations, safety systems, testing, and API documentation.

---

# FINAL PRODUCT DEVELOPMENT CHAIN

```text
PHASE 1
PRD
 │
 ▼
PHASE 2
TECHNICAL ARCHITECTURE
 │
 ▼
PHASE 3
DATABASE SCHEMA
 │
 ▼
PHASE 4
API SPECIFICATION
 │
 ▼
PHASE 5
8-UT TOURISM DATA RESEARCH
 │
 ▼
PHASE 6
UI/UX DESIGN SYSTEM
 │
 ▼
PHASE 7
FRONTEND DEVELOPMENT
 │
 ▼
PHASE 8
BACKEND DEVELOPMENT
 │
 ▼
PHASE 9
EXTERNAL API + BOOKING INTEGRATIONS
 │
 ▼
PHASE 10
TESTING + SECURITY + PERFORMANCE + SIH POLISH
```

# 🇮🇳 BHARAT SAFE YATRA

> **Discover. Plan. Book. Navigate. Stay Safe.**

