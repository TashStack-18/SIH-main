# 🇮🇳 BHARAT SAFE YATRA
## Phase 2 — Technical Architecture
### SIH 2026

**Architecture Version:** 1.0  
**Platform:** Web  
**Scope:** 8 Union Territories  
**Primary Goal:** Build a modular, scalable and demo-ready tourism intelligence platform.

---

# 1. Architecture Philosophy

The architecture should follow five principles:

### 1. Modular

Each major capability should be independently maintainable.

### 2. API-first

The frontend should never directly depend on external providers.

### 3. Data-driven

Tourism information should come from structured, verified data.

### 4. AI-grounded

Yatra AI should use verified platform data rather than relying purely on model knowledge.

### 5. Safety-first

Safety and emergency functionality should be treated as a separate high-priority domain.

---

# 2. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │       USER            │
                         │    Web Browser        │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      NEXT.JS          │
                         │     FRONTEND          │
                         └───────────┬───────────┘
                                     │
                              HTTPS / REST
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │           API LAYER              │
                    │        NestJS Backend            │
                    └───────────────┬─────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
 ┌────────────────┐       ┌────────────────┐       ┌────────────────┐
 │ Tourism        │       │ Itinerary      │       │ Booking        │
 │ Service        │       │ Service        │       │ Service        │
 └───────┬────────┘       └───────┬────────┘       └───────┬────────┘
         │                        │                        │
         ▼                        ▼                        ▼
 ┌────────────────┐       ┌────────────────┐       ┌────────────────┐
 │ Destination    │       │ Route Engine   │       │ Provider APIs  │
 │ Data           │       │                │       │                │
 └────────────────┘       └────────────────┘       └────────────────┘
          │                        │
          └────────────┬───────────┘
                       ▼
               ┌─────────────────┐
               │ PostgreSQL      │
               │ + PostGIS       │
               │ + pgvector      │
               └─────────────────┘

                       ▲
                       │
               ┌───────┴────────┐
               │   AI ENGINE    │
               │    YATRA AI    │
               └───────┬────────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
           LLM       RAG       Tools
```

---

# 3. Frontend Architecture

## Recommended

### Next.js + TypeScript

We'll use the **App Router**.

Structure:

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── explore/
│   ├── destination/
│   ├── ut/
│   ├── map/
│   ├── itinerary/
│   ├── bookings/
│   ├── ai/
│   ├── safety/
│   └── profile/
│
├── components/
│   ├── ui/
│   ├── navbar/
│   ├── hero/
│   ├── destination/
│   ├── map/
│   ├── itinerary/
│   ├── booking/
│   ├── ai/
│   └── safety/
│
├── features/
│   ├── discovery/
│   ├── itinerary/
│   ├── booking/
│   ├── map/
│   ├── ai/
│   └── safety/
│
├── lib/
│   ├── api/
│   ├── map/
│   ├── auth/
│   └── utils/
│
├── hooks/
├── types/
└── config/
```

The important principle is:

> **Components should not contain business logic.**

Business logic belongs in feature/service layers.

---

# 4. Frontend State Management

I recommend:

### Zustand

for client-side application state.

Example:

```text
Trip State
    │
    ├── selected destination
    ├── itinerary
    ├── map state
    ├── traveller preferences
    └── active trip
```

Server data should be managed separately using:

### TanStack Query

This gives us:

- caching
- background updates
- loading states
- retries
- invalidation

---

# 5. UI Architecture

We'll use:

### Tailwind CSS

+

### shadcn/ui

+

### Framer Motion

The UI should have a reusable design system.

```text
Design System
│
├── Typography
├── Colors
├── Spacing
├── Buttons
├── Cards
├── Inputs
├── Dialogs
├── Drawers
├── Toasts
├── Maps
├── Itinerary Cards
├── Booking Cards
└── Emergency Components
```

---

# 6. Backend Architecture

For the backend:

## NestJS

I recommend NestJS because this project has enough domains that a structured backend becomes valuable.

Architecture:

```text
src/
│
├── modules/
│   ├── users/
│   ├── tourism/
│   ├── destinations/
│   ├── attractions/
│   ├── festivals/
│   ├── itineraries/
│   ├── maps/
│   ├── bookings/
│   ├── ai/
│   ├── weather/
│   ├── safety/
│   ├── emergency/
│   ├── alerts/
│   └── admin/
│
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── decorators/
│   └── middleware/
│
├── integrations/
│   ├── mapbox/
│   ├── weather/
│   ├── booking/
│   └── government/
│
└── config/
```

---

# 7. API Architecture

The browser communicates with **our API**, not directly with third-party services.

```text
Browser
   │
   ▼
Bharat Safe Yatra API
   │
   ├── Mapbox
   ├── Weather
   ├── Booking providers
   ├── Transport providers
   └── Government data
```

This protects API credentials and allows us to change providers later.

---

# 8. API Gateway

Every request enters through:

```text
/api/v1/
```

Example:

```text
/api/v1/territories
/api/v1/destinations
/api/v1/attractions
/api/v1/festivals
/api/v1/itineraries
/api/v1/maps
/api/v1/bookings
/api/v1/weather
/api/v1/emergency
/api/v1/ai
```

Versioning from day one gives us future compatibility.

---

# 9. Database Architecture

## PostgreSQL

Primary relational database.

## PostGIS

Geospatial capabilities.

## pgvector

AI vector search.

So:

```text
PostgreSQL
│
├── Relational Data
│
├── PostGIS
│   └── Geographic Data
│
└── pgvector
    └── AI Embeddings
```

This avoids creating separate databases for each capability.

---

# 10. Redis

Redis will handle temporary/high-speed data.

Use cases:

### API caching

### Weather cache

### Map route cache

### Search cache

### Session data

### Rate limiting

### Temporary AI state

Example:

```text
Weather API
     ↓
Redis
     ↓
Users
```

Instead of requesting weather from the external provider every time.

---

# 11. Tourism Data Architecture

The most important data flow:

```text
Official Sources
      ↓
Data Collection
      ↓
Validation
      ↓
Normalization
      ↓
PostgreSQL
      ↓
Search Index
      ↓
RAG
      ↓
Yatra AI
```

We should distinguish:

### Source Data

What the official source says.

### Structured Data

Our normalized database representation.

### AI Context

Relevant data retrieved for a particular question.

---

# 12. Yatra AI Architecture

This will be one of our most important components.

I recommend a **tool-using RAG agent**.

```text
                 USER
                  │
                  ▼
              YATRA AI
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
       RAG SEARCH       TOOL CALL
          │                │
          ▼                ├── Search destinations
    Verified Data          ├── Search hotels
                           ├── Search activities
                           ├── Calculate route
                           ├── Check weather
                           ├── Build itinerary
                           ├── Modify itinerary
                           └── Search emergency facilities
```

---

# 13. Why RAG?

Suppose the user asks:

> "What are the permit requirements for Ladakh?"

The AI shouldn't simply answer from its training knowledge.

Instead:

```text
Question
   ↓
Retrieve verified information
   ↓
Relevant documents
   ↓
LLM
   ↓
Answer + source
```

This greatly reduces hallucination risk.

---

# 14. AI Tools

Yatra AI should eventually have tools such as:

```text
search_destinations()

get_destination_details()

search_attractions()

search_festivals()

search_hotels()

search_activities()

calculate_route()

get_weather()

create_itinerary()

modify_itinerary()

optimize_itinerary()

estimate_budget()

find_nearby_emergency_services()

get_travel_advisories()

search_bookings()
```

The AI becomes capable of actually interacting with the product.

---

# 15. AI Itinerary Architecture

Example:

User:

> "Plan a 6-day Ladakh trip for two people under ₹50,000."

Architecture:

```text
User Request
     ↓
Intent Detection
     ↓
Extract Parameters
     │
     ├── Destination = Ladakh
     ├── Days = 6
     ├── Travellers = 2
     └── Budget = ₹50,000
     ↓
Destination Retrieval
     ↓
Attraction Retrieval
     ↓
Route Calculation
     ↓
Budget Calculation
     ↓
Weather Check
     ↓
AI Planning
     ↓
Itinerary JSON
     ↓
Database
     ↓
Frontend
```

---

# 16. AI Output Must Be Structured

We shouldn't let the model return arbitrary text when creating itineraries.

Use structured output.

Example:

```json
{
  "destination": "Ladakh",
  "duration": 6,
  "days": [
    {
      "day": 1,
      "location": "Leh",
      "activities": []
    }
  ],
  "estimated_cost": 48000
}
```

This makes AI output usable by the application.

---

# 17. Map Architecture

### Mapbox

The frontend uses Mapbox for rendering.

Backend handles:

- route requests
- geospatial queries
- saved routes
- itinerary geometry

Architecture:

```text
Frontend
   │
   ▼
Map Service
   │
   ├── Mapbox Maps
   ├── Mapbox Directions
   └── PostGIS
```

---

# 18. PostGIS

This is particularly important for the safety system.

Example:

```sql
SELECT *
FROM emergency_facilities
ORDER BY location <-> user_location
LIMIT 5;
```

This allows:

> Find the nearest hospital.

We can also search:

> Emergency services within 10 km.

or:

> Emergency services along the user's route.

---

# 19. Booking Architecture

We'll create a provider abstraction.

```text
Booking Service
      │
      ├── Hotel Provider
      ├── Flight Provider
      ├── Activity Provider
      └── Transport Provider
```

Each provider implements a common interface.

Example:

```text
search()
getDetails()
checkAvailability()
createBooking()
cancelBooking()
```

This prevents provider lock-in.

---

# 20. Booking Flow

```text
User
 ↓
Bharat Safe Yatra
 ↓
Booking API
 ↓
Provider
 ↓
Availability
 ↓
Price
 ↓
Checkout
 ↓
Confirmation
 ↓
Bharat Safe Yatra
 ↓
My Yatra
```

---

# 21. Important Booking Decision

For SIH, we should not claim an API is integrated unless we actually have legitimate access to it.

Therefore we'll build:

### Provider abstraction

+

### At least one real integration

+

### Clearly separated fallback/demo providers if necessary.

This gives us a credible technical implementation without pretending that unavailable APIs are live.

---

# 22. Weather Architecture

```text
Weather Provider
      ↓
Weather Service
      ↓
Redis Cache
      ↓
PostgreSQL where appropriate
      ↓
Frontend / AI
```

The AI can then use weather information when planning trips.

---

# 23. Real-Time Data Architecture

Not everything needs WebSockets.

We'll categorize data.

### Frequently changing

Weather  
Alerts  
Trip location

→ realtime/polling

### Moderately changing

Festivals  
Transport  
Road conditions

→ cached API refresh

### Stable

Destination descriptions  
Culture  
Historical information

→ database

This reduces infrastructure complexity.

---

# 24. SOS Architecture

```text
                  USER
                   │
                   ▼
             SOS BUTTON
                   │
                   ▼
             GPS LOCATION
                   │
                   ▼
               SAFETY API
                   │
             ┌─────┴─────┐
             ▼           ▼
          PostGIS      Official
          Search       Contacts
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
    Hospital Police Fire
       │
       ▼
 Emergency UI
```

The emergency UI should prioritize:

**Call / contact action**

**Location**

**Nearest facility**

**Navigation**

**Emergency information**

---

# 25. Safety Data Reliability

Safety data requires a stricter verification system.

Each record should include:

```text
source
source_url
verified_at
verification_status
last_updated
```

Potential statuses:

```text
VERIFIED
PENDING_REVIEW
OUTDATED
DISABLED
```

---

# 26. Authentication Architecture

Authentication is planned for later, but architecture should support it.

Eventually:

```text
Browser
   ↓
Auth
   ↓
User
   ↓
JWT / Secure Session
   ↓
API
```

Potential implementation:

### Auth.js

or another secure identity provider depending on the final architecture.

---

# 27. Admin Architecture

```text
Admin
  │
  ▼
Admin Dashboard
  │
  ▼
Admin API
  │
  ├── Content
  ├── Destinations
  ├── Festivals
  ├── Safety
  ├── Alerts
  └── AI Knowledge
```

Admin endpoints must have role-based access control.

---

# 28. Search Architecture

I recommend combining:

### PostgreSQL full-text search

+

### Vector search

+

### Semantic AI search

Eventually:

```text
User Query
    │
    ├── Keyword Search
    ├── Semantic Search
    └── Filters
          ↓
       Ranking
          ↓
       Results
```

This lets us support both:

> "Pangong Lake"

and:

> "peaceful places with mountains and photography opportunities."

---

# 29. Media Architecture

Images shouldn't be stored directly in PostgreSQL.

Use:

### Object Storage

Such as:

**Cloudflare R2 / S3**

Database stores:

```text
image_url
thumbnail_url
alt_text
source
license
```

---

# 30. Caching Strategy

Example:

```text
Request
  ↓
Redis?
  │
 ├── YES → Return cached
 │
 └── NO
      ↓
   Database/API
      ↓
    Cache
      ↓
    Return
```

Important for:

- Weather
- Destinations
- Search
- Routes
- Festivals

---

# 31. Error Handling

Every external integration must have:

### Timeout

### Retry

### Fallback

### Logging

### User-friendly error

Example:

Instead of:

> `500 INTERNAL SERVER ERROR`

show:

> **Weather data is temporarily unavailable. Your saved itinerary is still available.**

---

# 32. Security Architecture

Important security rules:

### Never expose secret API keys in frontend.

### Validate every API request.

### Rate-limit public endpoints.

### Sanitize user-generated content.

### Secure AI tool execution.

### Restrict admin endpoints.

### Encrypt sensitive data where appropriate.

### Use HTTPS.

---

# 33. AI Security

This deserves special attention.

Yatra AI must not have unlimited access.

Use:

```text
AI
 │
 ▼
Tool Permission Layer
 │
 ├── Read destination ✓
 ├── Read weather ✓
 ├── Modify itinerary ✓
 ├── Create booking ⚠️
 ├── Delete booking ⚠️
 └── Emergency actions ⚠️
```

Sensitive actions should require explicit user confirmation.

---

# 34. Booking Safety

AI should never silently make a paid booking.

Correct flow:

```text
AI recommends
      ↓
User reviews
      ↓
User confirms
      ↓
Booking system
      ↓
Payment/provider
```

---

# 35. SOS Safety

The AI should not be the primary emergency mechanism.

The priority is:

```text
SOS
 ↓
Location
 ↓
Emergency Services
```

AI can assist with context, but the emergency flow should remain deterministic and fast.

---

# 36. Deployment Architecture

Initial production-style architecture:

```text
                   INTERNET
                      │
                      ▼
                 VERCEL
                      │
                 Next.js
                      │
                      ▼
                 API / Backend
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   PostgreSQL       Redis       Object Storage
     +PostGIS
     +pgvector
        │
        ▼
 External APIs
```

---

# 37. Environment Separation

We should maintain:

```text
Development
     ↓
Staging
     ↓
Production
```

Environment variables:

```text
DATABASE_URL
REDIS_URL
OPENAI_API_KEY
MAPBOX_TOKEN
WEATHER_API_KEY
BOOKING_API_KEY
STORAGE_KEY
```

Secrets should never be committed to Git.

---

# 38. Observability

Use:

### Sentry

for application errors.

And structured logs for:

- API requests
- AI calls
- booking failures
- map errors
- external API failures
- SOS events

---

# 39. Monitoring Dashboard

Eventually:

```text
Bharat Safe Yatra
────────────────────────

API Health        ✓
Database          ✓
Redis             ✓
AI                ✓
Mapbox            ✓
Weather           ✓
Booking           ✓

Errors today      12
AI requests       2,842
Active users      317
```

---

# 40. API Communication

Frontend:

```text
HTTPS
REST
JSON
```

For some realtime features:

```text
WebSocket / SSE
```

GraphQL is **not necessary initially**.

REST keeps the SIH implementation simpler and easier to debug.

---

# 41. Recommended Repository Structure

I recommend a monorepo.

```text
bharat-safe-yatra/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── utils/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│
├── docs/
│
├── scripts/
│
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

This gives us a clean foundation.

---

# 42. Recommended Development Stack

### Frontend

**Next.js**

**TypeScript**

**Tailwind CSS**

**shadcn/ui**

**Framer Motion**

**Zustand**

**TanStack Query**

---

### Backend

**NestJS**

**TypeScript**

**Prisma**

---

### Database

**PostgreSQL**

**PostGIS**

**pgvector**

---

### AI

**OpenAI API**

**RAG**

**Tool Calling**

---

### Infrastructure

**Redis**

**Object Storage**

**Vercel**

---

### Maps

**Mapbox**

---

# 43. Why I Recommend OpenAI

For this particular application, we need:

- Structured outputs
- Tool calling
- RAG
- Reasoning over travel information
- Itinerary generation
- Function execution
- Natural conversation

The important part isn't simply:

> "Which model gives the best chat?"

It's:

> **Which platform lets us reliably connect AI to our application?**

Yatra AI needs to call application functions.

---

# 44. Why PostgreSQL Instead of MongoDB?

This application has highly relational data:

```text
UT
 ↓
Destination
 ↓
Attraction
 ↓
Experience
 ↓
Itinerary
 ↓
Booking
```

and geographic relationships.

PostgreSQL + PostGIS is therefore a better foundation.

---

# 45. Why Not Microservices?

For SIH, I strongly recommend **not starting with full microservices**.

We can have modular backend domains without deploying 15 independent services.

Start with:

### Modular Monolith

```text
NestJS
│
├── Tourism
├── AI
├── Maps
├── Booking
├── Safety
├── Weather
└── Admin
```

Later, if scale requires it, individual modules can be extracted.

This is significantly more practical for SIH.

---

# 46. Architecture Style

Our final architecture will therefore be:

> **Modular Monolith + API-first + Event-ready**

rather than:

> Full Microservices.

This gives us speed without sacrificing future scalability.

---

# 47. Data Flow — Example

User asks:

> "Plan a 5-day trip to Ladakh."

```text
USER
 │
 ▼
Next.js
 │
 ▼
NestJS
 │
 ▼
Yatra AI
 │
 ├── Destination Search
 │
 ├── Attractions
 │
 ├── Weather
 │
 ├── Routes
 │
 └── Budget
 │
 ▼
Structured Itinerary
 │
 ▼
PostgreSQL
 │
 ▼
Next.js
 │
 ▼
Interactive Itinerary
```

---

# 48. Data Flow — Map

```text
User selects itinerary
        ↓
Backend
        ↓
Route Service
        ↓
Mapbox Directions
        ↓
Route geometry
        ↓
Frontend Mapbox
        ↓
3D route visualization
```

---

# 49. Data Flow — SOS

```text
User presses SOS
       ↓
Browser GPS
       ↓
Safety API
       ↓
PostGIS nearest-neighbor query
       ↓
Emergency facilities
       ↓
Emergency UI
```

---

# 50. Data Flow — Booking

```text
User
 ↓
Booking UI
 ↓
Bharat Safe Yatra API
 ↓
Provider Adapter
 ↓
External Booking API
 ↓
Availability
 ↓
User Confirmation
 ↓
Provider Checkout
 ↓
Booking Confirmation
 ↓
My Yatra
```

---

# 51. Data Flow — Festival

```text
Official Source
      ↓
Data Collection
      ↓
Admin / Validation
      ↓
Festival Database
      ↓
API
      ↓
Website
      ↓
Yatra AI
```

---

# 52. Complete Architecture

The final system conceptually becomes:

```text
                              🇮🇳
                     BHARAT SAFE YATRA
                              │
                    ┌─────────┴─────────┐
                    │     NEXT.JS       │
                    │     WEB APP       │
                    └─────────┬─────────┘
                              │
                         REST / SSE
                              │
                    ┌─────────▼─────────┐
                    │      NESTJS       │
                    │    API LAYER      │
                    └─────────┬─────────┘
                              │
      ┌───────────────┬───────┼────────┬──────────────┐
      │               │       │        │              │
      ▼               ▼       ▼        ▼              ▼
  TOURISM          ITINERARY  AI     BOOKING        SAFETY
   SERVICE          SERVICE  ENGINE   SERVICE        SERVICE
      │               │       │        │              │
      │               │       │        │              │
      └───────────────┴───────┼────────┴──────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL     │
                    │     PostGIS       │
                    │     pgvector      │
                    └─────────┬─────────┘
                              │
                         ┌────▼────┐
                         │  Redis  │
                         └─────────┘

             EXTERNAL INTEGRATIONS
                     │
       ┌─────────────┼─────────────────┐
       ▼             ▼                 ▼
    Mapbox        Weather          Booking APIs
       │             │                 │
       └─────────────┼─────────────────┘
                     ▼
                LIVE DATA

                     AI
                     │
          ┌──────────┼───────────┐
          ▼          ▼           ▼
         LLM         RAG        TOOLS
                                │
                    ┌───────────┼────────────┐
                    ▼           ▼            ▼
                 Maps       Itinerary    Safety
                              Booking
```

---

# 53. Critical Architectural Decision

The most important decision in this phase is:

## **Bharat Safe Yatra will NOT be an AI-first application.**

It will be:

> **Data-first + AI-powered.**

Meaning:

```text
Verified Data
      ↓
Application Services
      ↓
AI Intelligence
      ↓
User Experience
```

rather than:

```text
AI
 ↓
Random answer
 ↓
User
```

That distinction is extremely important for a tourism + safety platform.

---

# 54. Phase 2 Architecture Decision Summary

| Component | Decision |
|---|---|
| Frontend | Next.js + TypeScript |
| Backend | NestJS |
| Architecture | Modular Monolith |
| API | REST |
| Realtime | SSE/WebSockets where required |
| Database | PostgreSQL |
| Geo | PostGIS |
| Vector Search | pgvector |
| ORM | Prisma |
| Cache | Redis |
| AI | OpenAI |
| AI Pattern | RAG + Tool Calling |
| Maps | Mapbox |
| Booking | Provider Adapter Architecture |
| Storage | S3/R2 |
| State | Zustand |
| Server State | TanStack Query |
| UI | Tailwind + shadcn/ui |
| Animation | Framer Motion |
| Deployment | Vercel + Managed Infrastructure |
| Monitoring | Sentry |

---

# 55. Phase 2 → Phase 3

With this architecture established, **we should now move to Phase 3: Database Schema**.

That phase is where we will design the actual data foundation:

```text
Users
Union Territories
Destinations
Attractions
Experiences
Hotels
Restaurants
Festivals
Emergency Facilities
Travel Advisories
Weather
Routes
Itineraries
Itinerary Days
Itinerary Items
Bookings
Booking Providers
AI Conversations
AI Messages
AI Embeddings
Alerts
Saved Places
Reviews
Media
Data Sources
Verification Records
```

We'll define the **tables, columns, primary keys, foreign keys, indexes, PostGIS geometry fields, enums, relationships, constraints, and AI/vector-storage strategy**.

That schema should be designed **before we write a single production frontend component**, because almost every major feature in Bharat Safe Yatra will depend on it.

---

# Phase 2 Status

**Technical Architecture v1.0 is now defined.**

This document is the **Phase 2 technical source of truth** for Bharat Safe Yatra and will guide the database schema, API specification, tourism data architecture, UI/UX implementation, backend implementation, integrations, and deployment.
