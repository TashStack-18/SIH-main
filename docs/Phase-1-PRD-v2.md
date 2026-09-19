# 🇮🇳 BHARAT SAFE YATRA
## Product Requirements Document — PRD v2.0
### Smart India Hackathon (SIH 2026)

**Version:** 2.0 (Post-Audit Master Repaired Edition)  
**Project:** SIH 2026  
**Product:** Bharat Safe Yatra  
**Geographic Scope:** All 8 Union Territories of India Exclusively  
**Platform:** Modern Responsive Web Application (Desktop, Tablet, Mobile)  
**Primary Objective:** Create a unified, intelligent, data-grounded, and safety-first digital tourism companion for India's 8 Union Territories.

---

# 1. Executive Summary

**Bharat Safe Yatra** is a unified digital tourism and safety intelligence platform engineered to provide travelers with a single, highly reliable ecosystem to **discover, plan, book, navigate, experience, and safely explore India's 8 Union Territories**.

The platform eliminates the friction of switching across fragmented, disconnected platforms by unifying:
- Verified destination discovery and regional intelligence
- Dynamic AI-assisted trip planning and intelligent itinerary management
- 2D/3D interactive geospatial mapping and route elevation profiles
- Multi-category booking provider integrations
- Structured 2026 festival calendars with flexible date precisions
- Live contextual weather, road alerts, and travel advisories
- Deterministic 1-tap SOS emergency assistance and trauma hospital locator
- Regulatory permit guidance (Inner Line Permits, e-Permits, Tribal Passes)
- Offline-ready emergency registries and active trip caching

```text
       ┌───────────────────────────────────────────────────────────┐
       │                   BHARAT SAFE YATRA                       │
       │                      One Platform                         │
       └─────────────────────────────┬─────────────────────────────┘
                                     │
    ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
    ▼              ▼                 ▼                 ▼              ▼
 DISCOVER        PLAN              BOOK            NAVIGATE       STAY SAFE
Destinations  Intelligent      Accommodations    2D/3D Map       1-Tap SOS
Attractions   Itineraries      Activities &      Elevation       112/108/1363
Festivals     Budget & Packing Transport         Waypoints       Trauma Locator
Cuisine       Permit Checks    Experiences       Yatra Mode      Offline Registry
```

---

# 2. Problem Statement

Tourists traveling to India's Union Territories currently navigate a fragmented, high-friction ecosystem requiring 8+ disconnected tools:
1. **Fragmented Information:** Official tourism data, opening hours, cultural etiquette, and seasonal advice are scattered across generic search engines and out-of-date departmental portals.
2. **Cumbersome Trip Planning:** Manual research fails to connect route feasibility, weather conditions, mountain elevation challenges, and realistic budgets into an actionable schedule.
3. **Lack of Contextual Intelligence:** Existing commercial aggregators treat destinations in isolation without combining *Destination + Real-Time Weather + Elevation + Safety Alerts + Traveler Preferences*.
4. **Safety & Emergency Vulnerability:** Emergency contacts and medical facilities are disconnected from the traveler's active itinerary. In remote high-altitude or island zones, emergency access fails when mobile internet is lost.
5. **Permit & Regulatory Friction:** Critical regulatory requirements—such as Ladakh Protected Area Permits (ILP), Lakshadweep e-Permits, and Andaman Tribal Passes—are discovered too late, causing travel disruption.
6. **Data Unreliability & Hallucinations:** Uncurated travel blogs and ungrounded LLM chatbots frequently fabricate prices, outdated seasonal timings, or incorrect emergency numbers.
7. **Connectivity Constraints:** Remote UT regions experience severe cellular dead zones where online-only applications become entirely non-functional.

---

# 3. Proposed Solution & Core Value Proposition

Bharat Safe Yatra delivers a **verified, data-grounded tourism intelligence platform** spanning all eight Union Territories.

The platform executes the complete traveler lifecycle:
$$\text{Discover} \longrightarrow \text{Plan} \longrightarrow \text{Book} \longrightarrow \text{Navigate} \longrightarrow \text{Experience} \longrightarrow \text{Stay Safe}$$

### Core Value Pillars
- **Data Grounding:** 100% of factual destination information, emergency helplines, and festival dates are grounded in official Union Territory Administration and Ministry of Tourism datasets.
- **Safety First:** Immediate 1-tap SOS access, curated trauma centers, and offline cellular-free emergency protocols.
- **Human-in-the-Loop AI:** Yatra AI acts as an intelligent co-pilot using Retrieval-Augmented Generation (RAG) with mandatory client-side confirmation (`Preview → Confirm → Apply`) before state mutation.
- **Provider-Agnostic Booking:** Standardized provider adapter architecture supporting real sandbox APIs and fallback flows without vendor lock-in.

---

# 4. Product Vision & Philosophy

### Product Vision
> **To become the definitive, trusted digital travel companion for discovering and safely experiencing India's Union Territories.**

### Product Philosophy
**One Platform. One Journey. One Safe Yatra.**

---

# 5. Target User Personas

| Persona | Key Needs | Primary Platform Modules Utilized |
|---|---|---|
| **Domestic Explorer** | Authentic cultural insights, regional food, budget optimization, Hindi/English accessibility | Discover, AI Trip Planner, Festival Calendar, Itinerary |
| **International Traveler** | Verified safety advisories, permit requirements, medical emergency support, multi-currency display | Safety Center, Permits Engine, Yatra Vault, SOS |
| **Family Vacationer** | Child/elder-friendly filters, balanced pacing, reliable hotel bookings, verified facilities | Itinerary Studio, Bookings, Popular Destinations |
| **Solo Traveler** | Live safety tracking, emergency SOS, trusted route navigation, community-verified spots | Yatra Mode, Safety Center, Offline Maps, SOS |
| **High-Altitude Adventurer** | Trekking routes, elevation gain profiles, AMS warnings, gear packing lists, offline maps | 3D Map, Elevation Profiles, Packing Assistant, Weather |
| **Cultural & Heritage Seeker** | Accurate festival dates, temple etiquette, architectural history, artisan discovery | Festival Intelligence, Culture & Local Guide, Audio snippets |

---

# 6. Strict Geographic Scope & Future State Extensibility

### Strict Core Scope (SIH 2026)
The product strictly and exclusively covers India's **8 Union Territories**:
1. `ANDAMAN_NICOBAR` — Andaman & Nicobar Islands
2. `CHANDIGARH` — Chandigarh
3. `DNH_DD` — Dadra & Nagar Haveli and Daman & Diu
4. `DELHI` — National Capital Territory of Delhi
5. `JAMMU_KASHMIR` — Jammu & Kashmir
6. `LADAKH` — Ladakh
7. `LAKSHADWEEP` — Lakshadweep
8. `PUDUCHERRY` — Puducherry

### Architectural Extensibility Requirement
To guarantee seamless future expansion without code or schema refactoring:
- Database entities and API contracts must represent geographic entities via a polymorphic `territories` schema utilizing a `territory_type` enum (`UNION_TERRITORY`, `STATE`).
- Adding a future Indian State must require only database seed insertion without schema migration or frontend routing alterations.

---

# 7. Data Classification Model

To ensure realistic technical architecture and avoid misleading "real-time" claims, all system data is explicitly categorized:

| Classification | Data Domain | Refresh Frequency | Primary Storage / Cache Strategy |
|---|---|---|---|
| **Static Data** | Destination descriptions, cultural guides, geographical boundaries, history, etiquette | Quarterly / Annual audit | PostgreSQL + PostGIS, CDN Edge Cache |
| **Semi-Static Data** | Festival dates, permit rules, seasonal opening hours, standard ticket prices, emergency contacts | Daily / Weekly cache sync | PostgreSQL, Redis Cache (TTL: 24h), IndexedDB |
| **Live Data** | Contextual weather forecasts, active road closures, official disaster alerts, live booking inventory | Real-time / On-demand | Live Provider APIs, Redis (TTL: 5-15m), WebSockets/SSE |

---

# 8. Core Product Modules

```text
Bharat Safe Yatra Ecosystem
│
├── 1. Discovery & Intelligence Hub
│   ├── 8-UT Explorer Rail & Overview Pages
│   ├── Editorial Destination Detail Showcase
│   ├── Universal Categorized Search & Filters
│   └── 2026 Structured Festival Calendar
│
├── 2. Planning & Organization Studio
│   ├── AI-Powered Trip Generator
│   ├── Interactive Timeline Itinerary Studio
│   ├── Dynamic Recalculation Engine
│   ├── Budget Optimizer & Category Breakdown
│   ├── Context-Aware Packing Assistant
│   └── Permit & Regulatory Intelligence Engine
│
├── 3. Geospatial Navigation Engine
│   ├── 2D/3D Interactive Mapbox Engine
│   ├── Route Elevation Profiles & Mountain Pass Advisories
│   ├── POI & Multi-Category Marker Filtering
│   └── Active Yatra Mode Travel Interface
│
├── 4. Safety & Emergency Center (Yatra Safe)
│   ├── 1-Tap SOS Multi-Action Modal
│   ├── Verified 24/7 Helpline Directory (112, 108, 100, 1363, 1554)
│   ├── PostGIS Geospatial Trauma Hospital & Police Finder
│   ├── Offline Cellular-Free Emergency Fallback
│   └── Active Travel Advisories & Alert Broadcasts
│
├── 5. Yatra AI Companion Studio
│   ├── RAG-Grounded Tourism Chatbot
│   ├── Clickable Verified Source Citations
│   └── Human-in-the-Loop Action Execution Protocol
│
├── 6. Bookings Hub & Provider Adapters
│   ├── Standardized Provider Adapter Interface
│   ├── Real Sandbox / Demo Booking Integrations
│   └── Non-Linear Booking State Machine (Cancel, Refund, Status)
│
└── 7. User Profile, Guest Mode & Yatra Vault
    ├── Frictionless LocalStorage Guest State Persistence
    ├── Seamless Anonymous-to-Authenticated Session Migration
    └── AES-256 Client/Server Encrypted Travel Document Vault
```

---

# 9. Global Navigation & Homepage Requirements

### 9.1 Global Navigation Header
- **Desktop:** Brand logo with Indian tricolor accent, Primary Nav Links (`Explore UTs`, `Destinations`, `Festivals`, `Itinerary`, `Map`, `Bookings`, `Yatra AI`, `Safety`), Global Search trigger (`Cmd+K`), Theme Toggle (Light/Dark), and Persistent Red **🚨 SOS** Button.
- **Mobile:** Bottom navigation bar for core views (`Explore`, `Itinerary`, `Map`, `AI`, `Safety`) with an elevated, unmistakable SOS Floating Action Button (FAB).

### 9.2 Hero Showcase Section
- **Cinematic 8-UT Carousel:** High-resolution optimized visual cards for all 8 UTs with auto-play and manual controls.
- **Card Content:** UT name, dynamic weather badge, best travel season, traveler satisfaction rating, and direct "Discover UT" button.
- **Direct Search Input:** Prominent centered search bar with destination autocompletion.
- **Quick Action Bar:** Direct access chips: `Explore 8 UTs`, `AI Trip Planner`, `Festival Calendar`, `Permit Guide`, `Safety Center`.

---

# 10. Universal Search Engine

### Functional Requirements
1. The search engine must index and retrieve across all 8 UTs:
   - Union Territories & Regions
   - Destinations & Towns
   - Attractions & Monuments
   - Cultural Experiences & Activities
   - Accommodations & Stays
   - Verified Restaurants & Cuisine Types
   - 2026 Festivals & Cultural Events
2. Search results must return categorized tabs with instant keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
3. Results must display the verified badge (`VERIFIED_GOVERNMENT` or `VERIFIED_PRIMARY`) and direct action buttons (`View Details`, `Add to Itinerary`, `Navigate on Map`).

---

# 11. Destination & Territory Intelligence

Every Union Territory and Destination must provide a structured, source-attributed detail page containing:
1. **Hero & Vital Stats:** High-res image gallery, capital, primary languages, elevation (meters), best time to visit, and current live weather snapshot.
2. **Editorial Overview:** Verified description, historical significance, cultural context, and travel connectivity options (Air, Rail, Road, Sea).
3. **Attractions & Things to Do:** Filterable grid with opening hours, entry fees, recommended duration, and GPS coordinates.
4. **Signature Cuisine & Dining:** Iconic local dishes, dietary options (Vegetarian, Jain, Halal), and verified dining recommendations.
5. **Cultural Guidelines & Etiquette:** Dress codes, photography rules at religious/military sites, local customs, and key phrases.
6. **Permit Requirements:** Immediate notice of required Inner Line Permits or tribal passes with official portal links.
7. **Emergency Contacts:** Local police headquarters, district hospital, tourist police desk, and coastal guard numbers.

---

# 12. 2026 Structured Festival Intelligence

### Date Precision Handling
Festival dates in official Indian tourism sources vary in certainty. The platform must explicitly support a flexible date precision model:

| Date Precision Type | Data Format | UI Display Example | Handling Rule |
|---|---|---|---|
| `EXACT_DATE` | `YYYY-MM-DD` | `24 October 2026` | Render exact date and calendar add button |
| `DATE_RANGE` | `YYYY-MM-DD` to `YYYY-MM-DD` | `15 – 18 September 2026` | Render multi-day span |
| `MONTH` | `YYYY-MM` | `August 2026` | Do NOT fabricate exact date; display month banner |
| `WEEK_OF_MONTH` | `YYYY-MM-W[1-4]` | `1st Week of November 2026` | Display approximate timeframe |
| `SEASON` | `YYYY-SEASON` | `Winter 2026 (Dec – Jan)` | Display seasonal banner with historical context |

---

# 13. Interactive Timeline Itinerary Studio

### Functional Requirements
1. **Itinerary Creation:** Users (guest or authenticated) can create multi-day itineraries by selecting destination(s), dates, travel style, and group size.
2. **Timeline Management:** Itineraries must render a day-by-day timeline showing sequential destinations, attractions, meal stops, and transit segments.
3. **Interactive Modification:**
   - Drag-and-drop or 1-click reordering of itinerary items.
   - 1-click duration resizing (e.g. dynamically expanding a 5-day trip to 7 days).
   - Adding or removing attractions with instant recalculation of total driving distance, travel duration, and estimated cost.
4. **Export & Sharing:** 1-click export to PDF, print-friendly view, calendar sync (.ics), and shareable read-only link.

---

# 14. Permits, Inner Line Permits (ILP) & Regulatory Engine

### Mandatory Regulatory Intelligence
Because several Indian Union Territories enforce strict legal entry regulations, the platform must provide an integrated permit verification engine:

```text
               User Selects Destination
                          │
                          ▼
            Check Regulatory Database
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
Permit Required? (Yes)           Permit Required? (No)
          │                               │
          ▼                               ▼
Determine Requirements           Standard Discovery
  - Ladakh: Protected Area Permit / ILP
  - Lakshadweep: e-Permit & Police Clearance
  - Andaman & Nicobar: Tribal Pass / RAP
  - DNH_DD: Standard ID
          │
          ▼
Generate Permit Action Card
  - Eligibility Rules (Domestic vs Foreign)
  - Processing Time & Government Fee
  - Official Application Portal Direct Link
  - 1-Click "Attach to Yatra Vault"
```

---

# 15. Yatra AI Assistant & Travel Studio

### 15.1 Core Architecture & RAG Grounding
Yatra AI operates as a **Retrieval-Augmented Generation (RAG) agent** connected to pgvector embeddings of the Phase 5 verified tourism knowledge base.
- AI responses must prioritize verified database records over generic LLM parametric memory.
- Every factual recommendation must display clickable inline citations linking directly to the verified database record or official government URL.

### 15.2 Human-in-the-Loop (HITL) Action Protocol
To eliminate accidental mutations and maintain traveler control, Yatra AI must adhere to a strict 3-phase execution protocol:
1. **Preview:** AI outputs a structured proposal card (e.g., *"Proposed Change: Move Pangong Lake to Day 4 to avoid snowstorm"*).
2. **Confirm:** User reviews the visual before/after diff of dates, routes, and budget impacts.
3. **Apply:** Only upon explicit user click on **[Apply Changes]** does the client-side state update. The AI engine is strictly prohibited from mutating state autonomously.

### 15.3 AI Tool Capabilities
The AI agent is equipped with standardized tool definitions:
- `search_destinations(query, ut, filters)`
- `calculate_route(origin, destination, waypoints)`
- `check_weather(destination_id, date)`
- `generate_itinerary(destination, days, budget, travel_style, group_size)`
- `optimize_itinerary(itinerary_id, reason, constraint)`
- `lookup_emergency_facilities(lat, lng, radius_km, facility_type)`
- `get_permit_guidelines(ut_code, nationality)`

### 15.4 AI Evaluation Benchmark & Acceptance Suite
The AI assistant must achieve $\ge 90\%$ accuracy across a 20-category standardized test suite (itineraries, budgets, permits, emergency lookups) without hallucinations, outputting valid JSON schemas matching the application specification.

---

# 16. Dynamic Itinerary Recalculation & Simulation Mode

### Functional Requirements
1. The platform must dynamically react to environmental disruptions (weather warnings, road blockages, mountain pass closures).
2. **Simulation Mode (SIH Demonstration Ready):** To allow predictable hackathon demonstration without depending on live natural disasters, the system must include an interactive Simulation Trigger:
   - *Trigger Example:* "Simulate Heavy Snowfall at Khardung La".
   - *System Action:* Generates an urgent alert banner $\to$ AI evaluates active itinerary $\to$ Proposes safe alternative route/timing $\to$ Displays `Preview` $\to$ User clicks `Apply` $\to$ Itinerary and map update seamlessly.

---

# 17. 2D / 3D Geospatial Map Engine

### Functional Requirements
1. **Interactive Map Canvas:** Built on Mapbox GL JS with support for 2D standard view, satellite imagery, and 3D terrain elevation mesh.
2. **Multi-Category Geospatial Markers:**
   - 📍 Destinations & Towns (Custom Blue Pin)
   - 🏛️ Heritage Attractions & Viewpoints (Terracotta Pin)
   - 🏨 Hotels & Homestays (Emerald Pin)
   - 🍽️ Verified Restaurants (Gold Pin)
   - 🏥 Trauma Hospitals & Clinics (Red Cross Pin)
   - 👮 Police Stations & Checkposts (Navy Shield Pin)
3. **Waypoint Routing & Elevation Profiles:**
   - Calculate multi-stop driving/transit routes connecting itinerary waypoints.
   - Display an interactive **Route Elevation Profile** showing altitude changes across mountain passes.
   - **High-Altitude Safety Triggers:** Automatically display Acute Mountain Sickness (AMS) acclimatization warnings whenever a route segment exceeds 3,000 meters elevation (e.g., Leh $\to$ Khardung La at 5,359m).

---

# 18. Yatra Mode (Active Travel Interface)

### Functional Requirements
1. When a traveler embarks on an active trip, the interface provides a distraction-free, high-contrast **Yatra Mode**:
   - Current location and next sequential destination
   - Remaining distance (km) and estimated travel time (ETA)
   - Live contextual weather badge and active road advisories
   - Direct 1-tap navigation button launching native turn-by-turn navigation (Google Maps / Apple Maps)
   - Persistent, oversized **🚨 SOS Emergency Trigger**
2. *Scope Clarification:* In-app turn-by-turn voice navigation is scheduled for FUTURE native mobile releases; Phase 1 web delivers active route tracking with external navigation handoff.

---

# 19. Safety Center (Yatra Safe) & Emergency SOS

### 19.1 Curated National & UT Emergency Helplines
The Safety Center must provide instant, pre-configured access to verified emergency helplines:
- **National Unified Emergency:** `112`
- **National Ambulance / Medical Emergency:** `108`
- **National Police Emergency:** `100`
- **Ministry of Tourism 24/7 Multi-Lingual Helpline:** `1363`
- **Indian Coast Guard Search & Rescue (Islands/Coastal):** `1554`
- **UT-Specific Disaster Management Desks:** Direct regional control room landlines.

### 19.2 1-Tap SOS Emergency Response Protocol
Activating the global SOS button must execute a deterministic 3-tier emergency protocol:
1. **1-Tap Direct Telephony:** Instant dialer launch for `112`, `108`, `100`, `1363`, and `1554`.
2. **Instant Emergency SMS Dispatch:** Generates a pre-filled SMS message containing current raw GPS coordinates, timestamp, and a Google Maps link addressed to the traveler's configured emergency contacts.
3. **Geospatial Nearest-Facility Discovery:** Executes a PostGIS spatial query ordering verified hospitals, trauma centers, and police stations by distance from the user's GPS coordinates, rendering contact numbers and 1-tap navigation.

### 19.3 Offline Cellular-Free Emergency Fallback
When network connectivity is completely unavailable:
- The SOS modal must immediately load the pre-cached static emergency directory for the current Union Territory from browser storage.
- The system must use the browser Geolocation API to extract latitude/longitude coordinates offline and display them in large, high-contrast text for vocal transmission over radio/voice calls.

---

# 20. Booking Hub & Provider Adapters

### 20.1 Architecture & Provider Independence
To avoid brittle dependencies on proprietary external booking systems, the platform utilizes a **Provider Adapter Architecture**:
```typescript
interface BookingProvider {
  search(params: BookingSearchParams): Promise<BookingListing[]>;
  getDetails(listingId: string): Promise<BookingDetails>;
  checkAvailability(listingId: string, dates: DateRange): Promise<AvailabilityResult>;
  createBooking(request: BookingRequest): Promise<BookingConfirmation>;
  cancelBooking(bookingId: string, reason: string): Promise<CancellationResult>;
}
```

### 20.2 Phase 1 Booking Scope
- **Real Sandbox Provider:** Integration with live demo/sandbox APIs for verified UT experiences (e.g., Andaman Cellular Jail Light & Sound Show, Chandigarh Rock Garden e-tickets, JKTDC government resort reservations).
- **Graceful Fallback:** When a provider does not expose a public API, the platform provides verified official government booking links with clear handoff messaging.

### 20.3 Non-Linear Booking State Machine
Every booking must transition through explicit lifecycle states:
$$\text{PENDING} \longrightarrow \text{CONFIRMED} \longrightarrow \begin{cases} \text{COMPLETED} \\ \text{CANCELLED} \longrightarrow \text{REFUNDED} \\ \text{FAILED} \end{cases}$$

---

# 21. Budget Optimizer & Packing Assistant

### 21.1 Budget Optimizer
- Calculates itemized estimates across 5 buckets: Transport, Accommodation, Food, Activities, and Emergency Buffer (10-15%).
- Provides 1-click AI optimization to fit itineraries into specified budgets (e.g. "Optimize for ₹35,000").

### 21.2 Context-Aware Packing Assistant
- Dynamically generates personalized packing checklists based on:
  - Destination climate and seasonal forecast
  - High-altitude thermal requirements (e.g., windproof jackets, thermal base layers for Ladakh)
  - Cultural dress codes (e.g., headscarves for religious shrines)
  - Island/water sports essentials (e.g., reef-safe sunscreen, dry bags for Andaman/Lakshadweep)

---

# 22. User Account, Guest Mode & Yatra Vault

### 22.1 Guest Mode State Persistence
- Unauthenticated travelers must be able to explore all UTs, create/edit itineraries, calculate budgets, and configure emergency contacts.
- All guest actions are persisted in local browser storage (LocalStorage & IndexedDB).
- Upon subsequent sign-in/registration, all local guest trips and preferences are automatically migrated to the user's permanent database account.

### 22.2 Yatra Vault & Travel Document Security
- A secure repository for storing travel tickets, hotel vouchers, government permits, and identity documents.
- **Security Specifications:**
  - Client-side encryption via Web Crypto API for unauthenticated guest sessions.
  - AES-256 server-side encryption at rest and TLS 1.3 in transit for authenticated accounts.
  - Document access restricted via signed, time-limited URLs with maximum 15-minute Time-To-Live (TTL).
  - Zero exposure of PII or documents in public storage buckets or client logs.

### 22.3 Travel Readiness Score Algorithm
The platform calculates a deterministic, weighted readiness score before trip departure:
$$\text{Readiness Score} = (P \times 0.40) + (S \times 0.30) + (E \times 0.15) + (K \times 0.15)$$
- **$P$ (Mandatory Permits):** 40% weight. *Hard Blocker:* If a mandatory permit is missing, readiness is capped at $< 50\%$ with an urgent alert.
- **$S$ (Stays & Transport):** 30% weight (confirmed hotel and transit bookings).
- **$E$ (Emergency Contacts):** 15% weight (at least 1 verified contact configured).
- **$K$ (Packing & Readiness Checklist):** 15% weight.

---

# 23. Data Verification & Source Attribution

### 23.1 Verification Taxonomy & Badges
To maintain absolute traveler trust, all destinations, attractions, and advisories must display standardized verification badges:
- 🟢 `VERIFIED_GOVERNMENT`: Sourced directly from official UT Administrations, Ministry of Tourism, or Official Gazettes.
- 🔵 `VERIFIED_PRIMARY`: Verified by Bharat Safe Yatra research team from primary operating authorities (e.g., ASI, Port Trust).
- 🟡 `COMMUNITY_REPORTED`: Traveler-submitted data pending official moderation.

### 23.2 Data Freshness SLAs & Staleness Handling
- **Safety Advisories & Road Closures:** 24-hour verification SLA. If unverified for $>24$h, flagged with a "Verification Pending" banner.
- **Emergency Helplines:** 30-day verification SLA.
- **Attraction Timings & Entry Fees:** 90-day verification SLA.

---

# 24. Knowledge Base Ingestion & Vector RAG Pipeline

1. **Document Ingestion:** Official tourism PDFs, government gazettes, and verified Phase 5 research are parsed into structured markdown.
2. **Chunking Strategy:** Text is chunked into 500-token segments with 50-token semantic overlap.
3. **Vector Embeddings:** Generated via text-embedding models (1536 dimensions) and stored in PostgreSQL `pgvector` tables.
4. **Retrieval & Citations:** Semantic cosine similarity queries retrieve the top 3 relevant chunks, which are supplied as ground truth context to Yatra AI.

---

# 25. Administration Portal & Role-Based Access Control (RBAC)

The administrative system enforces 3 distinct operational roles:
1. `ADMIN`: Full platform configuration, user moderation, and provider management.
2. `CONTENT_MANAGER`: Editorial publishing and verification lifecycle (`DRAFT` $\to$ `PENDING_REVIEW` $\to$ `PUBLISHED`).
3. `SAFETY_MANAGER`: Authorized broadcast of official travel advisories, disaster alerts, and emergency helpline updates.

---

# 26. Non-Functional Requirements & Engineering Standards

### 26.1 Performance & Core Web Vitals
- **Largest Contentful Paint (LCP):** $\le 2.5\text{s}$ on standard 4G mobile networks.
- **Cumulative Layout Shift (CLS):** $\le 0.1$.
- **Interaction to Next Paint (INP):** $\le 200\text{ms}$.
- **API Response Latency (p95):** $\le 300\text{ms}$ for metadata endpoints; $\le 1500\text{ms}$ for initial streaming AI chunk.
- **Lighthouse Performance Score:** $\ge 90$ on key public pages under standard production conditions.

### 26.2 Security & Compliance
- HTTPS enforcement with TLS 1.3.
- OWASP Top 10 compliance: Strict input sanitization, CSRF tokens, and parameterized SQL queries.
- Rate limiting: 100 requests/minute per IP for standard endpoints; 20 requests/minute for AI and SOS dispatch endpoints.

### 26.3 Accessibility & Responsiveness
- **WCAG 2.1 Level AA Compliance:** High color contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text).
- **Touch Targets:** Minimum $44 \times 44\text{px}$ for all interactive buttons and emergency triggers.
- **Full Keyboard Navigation:** Logical Tab order, visible focus rings, and screen reader ARIA landmarks.
- **Responsive Viewports:** Seamless rendering across Mobile (360px+), Tablet (768px+), and Desktop (1024px – 2560px).

### 26.4 Offline Caching & PWA Boundaries
- Service Worker caching for core application shell, CSS/JS bundles, and static assets.
- IndexedDB storage for active user itinerary, offline emergency directories for all 8 UTs, and vector tile bounding boxes capped at 50 MB per territory.

---

# 27. Testable Acceptance Criteria (Gherkin Format)

### Scenario 1: Generating a Verified Itinerary via Yatra AI
```gherkin
Given a traveler is exploring the "Ladakh" territory
When the traveler requests a "6-day trip with ₹50,000 budget"
Then Yatra AI returns a structured 6-day itinerary JSON
And every day contains verified attractions with valid GPS coordinates
And the total estimated cost is within the specified ₹50,000 budget
And the UI displays a "Preview Changes" card requiring user confirmation before saving.
```

### Scenario 2: Executing Emergency SOS with Direct Dispatch
```gherkin
Given a traveler is anywhere on the platform
When the traveler activates the "🚨 SOS" button
Then the SOS modal opens in under 100ms
And the system identifies the user's current GPS coordinates
And the UI displays direct-dial buttons for 112, 108, 100, 1363, and 1554
And the system queries PostGIS and displays the top 3 nearest trauma hospitals with driving distance.
```

### Scenario 3: Offline Fallback in Remote Zones
```gherkin
Given a traveler is in a zero-connectivity zone in Andaman or Ladakh
When the traveler opens the Safety Center or SOS modal
Then the application loads cached territory emergency helplines from IndexedDB
And displays the device's offline GPS coordinates in high-contrast text
And enables native phone dialer calls without requiring internet access.
```

### Scenario 4: Mandatory Permit Gatekeeping
```gherkin
Given a traveler adds "Pangong Lake, Ladakh" or "Agatti Island, Lakshadweep" to their itinerary
When the system calculates the Travel Readiness Score
Then the system detects that a mandatory Permit is required
And displays an urgent Permit Advisory with the official government portal link
And caps the Travel Readiness Score below 50% until the permit is acknowledged.
```

---

# 28. Explicit Out-of-Scope Boundaries (SIH 2026)

To ensure razor-sharp focus and realistic technical feasibility, the following domains are strictly **OUT OF SCOPE**:
1. **Primary Coverage of Indian States:** The platform focuses exclusively on the 8 Union Territories; state expansion is architecturally supported for the future but not populated in MVP.
2. **Direct Operation of Emergency Dispatch:** The platform connects travelers directly to official emergency agencies (112/108/Police/Coast Guard) via telephony and SMS; it does not operate its own private dispatch ambulances or police fleets.
3. **Medical Diagnosis or Clinical Triage:** The platform directs users to physical trauma hospitals and emergency facilities; it does not provide AI medical diagnostic advice.
4. **Direct Ownership of Stays/Transport Inventory:** The platform operates as an aggregator and intelligence layer via provider adapters; it does not operate hotels, airlines, or ferries.

---

# 29. End-to-End Requirement Traceability Matrix

| Requirement ID | Requirement Description | Phase 2 Component | Phase 3 Entity | Phase 4 API Endpoint | Phase 5 Knowledge Base | Phase 6 UI Token / Component | Phase 7 Implementation |
|---|---|---|---|---|---|---|---|
| **REQ-01** | 8 Union Territory Discovery | `TourismService` | `union_territories` | `GET /api/v1/territories` | Section 2 (8 UT Dataset) | `TerritoryCard`, `HeroCarousel` | `territories.js`, `explore.js` |
| **REQ-02** | Destination Intelligence | `DestinationService`| `destinations`, `attractions` | `GET /api/v1/destinations` | Section 3–10 (POI Data) | `DestinationCard`, `RatingBadge` | `destinations.js`, `destination-view.js` |
| **REQ-03** | 2026 Festival Calendar | `FestivalService` | `festivals` | `GET /api/v1/festivals` | Festival Calendars | `FestivalCard`, `DatePrecisionTag`| `festivals.js`, `festival-view.js` |
| **REQ-04** | AI Itinerary Generator | `AIService` + RAG | `itineraries`, `itinerary_items`| `POST /api/v1/ai/itinerary` | All UT Data Chunks | `ItineraryTimeline`, `AIDialog` | `itineraryService.ts`, `ai-studio.js` |
| **REQ-05** | Dynamic Recalculation | `AIService` (HITL) | `itineraries` | `POST /api/v1/ai/optimize` | Travel Advisories | `PreviewConfirmApplyModal` | `itinerary-editor.js`, `store.js` |
| **REQ-06** | 2D/3D Geospatial Map | `MapService` (Mapbox) | `destinations.location` | `GET /api/v1/maps/markers` | Coordinates / Bounding Boxes | `MapContainer`, `MapboxGL` | `map-view.js`, `mapbox-adapter.js`|
| **REQ-07** | Route Elevation & AMS | `RouteEngine` (PostGIS) | `routes.elevation_profile` | `POST /api/v1/maps/route` | High-Pass Elevation Data | `ElevationChart`, `AMSAlert` | `elevation-profile.js` |
| **REQ-08** | Active Yatra Mode | `TripService` | `itineraries.active` | `GET /api/v1/trips/active` | Live Route Data | `ActiveTripBar`, `YatraModeDrawer`| `yatra-mode.js`, `store.js` |
| **REQ-09** | 1-Tap SOS Emergency | `SafetyService` | `emergency_facilities` | `POST /api/v1/emergency/sos` | Emergency Helplines | `SOSButton`, `SOSModal` | `sos-modal.js`, `safety.js` |
| **REQ-10** | Offline Emergency Fallback| Service Worker / PWA | Pre-cached Static Registry | `GET /api/v1/emergency/offline` | National & UT Helplines | `OfflineNotice`, `DialerCard` | `service-worker.js`, `fixtures/` |
| **REQ-11** | Permit Regulatory Engine| `SafetyService` | `travel_advisories` | `GET /api/v1/safety/permits` | Permit Regulations | `PermitAlertBadge`, `VaultUpload` | `permits.js`, `permit-modal.js` |
| **REQ-12** | Booking Provider Adapters| `BookingService` | `bookings`, `providers` | `POST /api/v1/bookings` | Official Booking Portals | `BookingCard`, `CheckoutSheet` | `bookingService.ts`, `bookings.js`|
| **REQ-13** | Yatra Vault Storage | `VaultService` (Crypto) | `user_documents` | `GET /api/v1/users/vault` | Safety Guidelines | `VaultSheet`, `EncryptedBadge` | `vault-view.js`, `profile.js` |
| **REQ-14** | Travel Readiness Score | `AnalyticsService` | `itineraries.readiness` | `GET /api/v1/itineraries/score`| Verification Standards | `ReadinessScoreRing` | `readiness-badge.js` |
| **REQ-15** | Data Verification Badges | `ContentService` | `verification_records` | `meta.verification_status` | Source Attribution Links | `VerifiedBadge` (`--color-verified`)| `badge.js`, `tokens.css` |
| **REQ-16** | Guest Mode & State Sync | Client LocalStorage | `users.guest_session` | `POST /api/v1/itineraries/sync`| N/A | `GuestNoticeBanner` | `store.js`, `auth-sync.js` |

---

# 30. MVP Scope Matrix (SIH 2026)

### MUST HAVE (Core SIH Prototype)
- [x] All 8 Union Territories fully populated with verified government tourism data
- [x] Editorial Destination Detail pages with culture, cuisine, stays, and emergency contacts
- [x] Categorized Universal Search across UTs, destinations, attractions, and festivals
- [x] 2026 Festival Calendar with flexible date precisions (`EXACT_DATE`, `DATE_RANGE`, `MONTH`, `SEASON`)
- [x] RAG-grounded Yatra AI Assistant with clickable verified citations and suggested prompts
- [x] Interactive Itinerary Studio with drag-and-drop reordering, 3/5/7/10-day resizing, and budget calculator
- [x] Dynamic Itinerary Recalculation simulation mode for weather/disruption alerts
- [x] 2D/3D Geospatial Mapbox view with 6 SVG marker types, multi-stop routing, and elevation profile
- [x] Yatra Mode active travel bar with route tracking and 1-tap navigation handoff
- [x] Safety Center & 1-Tap SOS Emergency Modal with 112/108/100/1363/1554 direct dialer
- [x] PostGIS nearest trauma hospital and police station finder with GPS calculation
- [x] Offline emergency fallback with cached territory registries and raw GPS display
- [x] Mandatory Permit Regulatory engine with official portal links and Vault attachment
- [x] Working booking flow with unified provider adapter for UT experiences
- [x] Frictionless Guest Mode state persistence in LocalStorage with zero mandatory login
- [x] Fully responsive, high-contrast accessible UI (WCAG 2.1 AA, light/dark themes)

### SHOULD HAVE (Extended Polish)
- [ ] Context-aware packing checklist generator
- [ ] Travel Readiness Score gauge ($0 - 100\%$)
- [ ] Multi-lingual interface support (English + Hindi)
- [ ] Client-side encrypted Yatra Vault for permits and tickets

### FUTURE (Post-Hackathon Roadmap)
- [ ] Native Android/iOS mobile application with offline vector tile packs
- [ ] Turn-by-turn voice navigation in Yatra Mode
- [ ] Expansion to all 28 Indian States via polymorphic database schema
- [ ] Direct IoT emergency beacon and satellite SOS integration

---

# 31. Document Sign-Off & Status

**Phase 1 PRD v2.0 is officially ratified and approved.**  
This document represents the definitive source of truth for Bharat Safe Yatra, providing 100% architectural alignment across technical architecture, database schemas, REST APIs, research knowledge bases, UI/UX designs, and frontend implementations.
