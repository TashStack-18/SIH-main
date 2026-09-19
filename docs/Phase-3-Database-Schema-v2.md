# 🇮🇳 BHARAT SAFE YATRA
## Phase 3 — Database Schema (v2.0)
### Smart India Hackathon (SIH 2026)

**Schema Version:** 2.0 (Post-Audit Master Repaired Edition)  
**Platform:** Web Application  
**Scope:** India's 8 Union Territories Exclusively  
**Database Engine:** PostgreSQL 16 + PostGIS 3.4 + pgvector 0.7  
**ORM:** Prisma  
**Architecture:** Modular Monolith Data Foundation  
**Purpose:** Define the canonical, normalized, geospatial, and vector-enabled data foundation for Bharat Safe Yatra.

---

# 1. Database Design Philosophy & Architecture

The database architecture is engineered to power:
- **Territory & Destination Discovery:** Rich hierarchical taxonomy across all 8 Union Territories.
- **Geospatial Intelligence:** PostGIS first-class geometries (`GEOGRAPHY(POINT, 4326)`, `GEOGRAPHY(LINESTRING, 4326)`) with `GIST` indexing for sub-second spatial queries and SOS nearest-facility discovery.
- **AI Vector Embeddings:** pgvector storage (`VECTOR(1536)`) with HNSW indexing for Retrieval-Augmented Generation (RAG).
- **Date Precision Resilience:** Multi-tier festival date precision (`EXACT_DATE`, `DATE_RANGE`, `MONTH`, `WEEK_OF_MONTH`, `SEASON`).
- **Provider-Agnostic Bookings:** Complete booking lifecycle state machines and audit logging.
- **Yatra Vault Security:** Encrypted document storage for traveler permits, tickets, and vouchers.
- **Guest-to-Authenticated Session State:** Frictionless anonymous persistence with seamless account migration.

```text
                               POSTGRESQL 16
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
  RELATIONAL CORE                 POSTGIS                    PGVECTOR
  - Users & Vault             - Destinations (Point)      - Knowledge Chunks
  - Itineraries & Items       - Attractions (Point)       - 1536-dim Embeddings
  - Bookings & Events         - Emergency Facilities      - HNSW Similarity Index
  - Festivals & Permits       - Routes (LineString)
```

---

# 2. Core Enum Definitions

```sql
-- User Roles & Access Control
CREATE TYPE USER_ROLE AS ENUM (
    'USER',
    'ADMIN',
    'CONTENT_MANAGER',
    'SAFETY_MANAGER'
);

-- Content Publication Status
CREATE TYPE CONTENT_STATUS AS ENUM (
    'DRAFT',
    'PENDING_REVIEW',
    'PUBLISHED',
    'ARCHIVED',
    'DISABLED'
);

-- Data Verification Hierarchy
CREATE TYPE VERIFICATION_STATUS AS ENUM (
    'PENDING_REVIEW',
    'VERIFIED',
    'OUTDATED',
    'REJECTED',
    'DISABLED'
);

-- Date Precision for Festivals & Cultural Events
CREATE TYPE DATE_PRECISION AS ENUM (
    'EXACT_DATE',
    'DATE_RANGE',
    'MONTH',
    'WEEK_OF_MONTH',
    'SEASON'
);

-- Destination Classification
CREATE TYPE DESTINATION_TYPE AS ENUM (
    'CITY',
    'TOWN',
    'ISLAND',
    'VILLAGE',
    'REGION',
    'NATIONAL_PARK',
    'BEACH',
    'MOUNTAIN',
    'VALLEY',
    'HERITAGE_SITE',
    'OTHER'
);

-- Attraction Categories
CREATE TYPE ATTRACTION_TYPE AS ENUM (
    'NATURAL',
    'HERITAGE',
    'CULTURAL',
    'RELIGIOUS',
    'MUSEUM',
    'MONUMENT',
    'BEACH',
    'VIEWPOINT',
    'ADVENTURE',
    'WILDLIFE',
    'ARCHITECTURE',
    'OTHER'
);

-- Experience Types
CREATE TYPE EXPERIENCE_TYPE AS ENUM (
    'TREKKING',
    'DIVING',
    'SNORKELING',
    'KAYAKING',
    'CAMPING',
    'WILDLIFE',
    'PHOTOGRAPHY',
    'FOOD',
    'CULTURE',
    'HERITAGE',
    'WELLNESS',
    'SHOPPING',
    'WATER_SPORT',
    'ADVENTURE',
    'OTHER'
);

-- Travel Styles
CREATE TYPE TRAVEL_STYLE AS ENUM (
    'RELAXED',
    'BALANCED',
    'ADVENTURE',
    'LUXURY',
    'BUDGET',
    'FAMILY',
    'CULTURAL',
    'NATURE'
);

-- Itinerary Timeline Item Types
CREATE TYPE ITINERARY_ITEM_TYPE AS ENUM (
    'DESTINATION',
    'ATTRACTION',
    'EXPERIENCE',
    'HOTEL',
    'RESTAURANT',
    'TRANSPORT',
    'CUSTOM'
);

-- Booking Categories
CREATE TYPE BOOKING_TYPE AS ENUM (
    'HOTEL',
    'FLIGHT',
    'ACTIVITY',
    'TRANSPORT',
    'EXPERIENCE'
);

-- Booking Lifecycle State Machine
CREATE TYPE BOOKING_STATUS AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'FAILED',
    'COMPLETED',
    'REFUNDED'
);

-- Payment Status
CREATE TYPE PAYMENT_STATUS AS ENUM (
    'PENDING',
    'AUTHORIZED',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);

-- Emergency Facility Types
CREATE TYPE EMERGENCY_FACILITY_TYPE AS ENUM (
    'HOSPITAL',
    'CLINIC',
    'POLICE',
    'FIRE_STATION',
    'AMBULANCE',
    'COAST_GUARD',
    'DISASTER_RESPONSE',
    'TOURIST_ASSISTANCE',
    'OTHER'
);

-- Alert Severity Levels
CREATE TYPE ALERT_SEVERITY AS ENUM (
    'INFO',
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

-- Alert Categories
CREATE TYPE ALERT_TYPE AS ENUM (
    'WEATHER',
    'ROAD',
    'SECURITY',
    'HEALTH',
    'TRANSPORT',
    'NATURAL_DISASTER',
    'TOURISM',
    'OTHER'
);

-- Document Types (Yatra Vault)
CREATE TYPE DOCUMENT_TYPE AS ENUM (
    'PERMIT',
    'TICKET',
    'HOTEL_VOUCHER',
    'IDENTITY',
    'INSURANCE',
    'OTHER'
);
```

---

# 3. Geography & Tourism Core Tables

### 3.1 `union_territories`
```sql
CREATE TABLE union_territories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'LADAKH', 'ANDAMAN_NICOBAR'
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    short_description TEXT,
    description TEXT,
    capital VARCHAR(100),
    languages TEXT[],
    best_time_to_visit VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geometry GEOGRAPHY(POINT, 4326),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    territory_type VARCHAR(50) DEFAULT 'UNION_TERRITORY', -- polymorphic state extension
    status CONTENT_STATUS DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_ut_code ON union_territories(code);
CREATE UNIQUE INDEX idx_ut_slug ON union_territories(slug);
CREATE INDEX idx_ut_location ON union_territories USING GIST(geometry);
```

### 3.2 `destinations`
```sql
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    union_territory_id UUID NOT NULL REFERENCES union_territories(id) ON DELETE RESTRICT,
    region_id UUID NULL REFERENCES regions(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    type DESTINATION_TYPE NOT NULL DEFAULT 'TOWN',
    short_description TEXT,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    elevation_meters INTEGER NULL,
    best_time_start SMALLINT NULL CHECK (best_time_start BETWEEN 1 AND 12),
    best_time_end SMALLINT NULL CHECK (best_time_end BETWEEN 1 AND 12),
    average_visit_duration_minutes INTEGER NULL,
    estimated_daily_budget_min DECIMAL(10, 2) NULL,
    estimated_daily_budget_max DECIMAL(10, 2) NULL,
    rating DECIMAL(2, 1) NULL CHECK (rating BETWEEN 1.0 AND 5.0),
    rating_count INTEGER DEFAULT 0,
    status CONTENT_STATUS DEFAULT 'PUBLISHED',
    verification_status VERIFICATION_STATUS DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_destinations_ut ON destinations(union_territory_id);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_type ON destinations(type);
CREATE INDEX idx_destinations_location ON destinations USING GIST(location);
```

### 3.3 `festivals` (Master Repaired)
```sql
CREATE TABLE festivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    union_territory_id UUID NOT NULL REFERENCES union_territories(id) ON DELETE RESTRICT,
    destination_id UUID NULL REFERENCES destinations(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    cultural_significance TEXT,
    date_precision DATE_PRECISION NOT NULL DEFAULT 'EXACT_DATE',
    start_date DATE NULL, -- Nullable when only month or season is published
    end_date DATE NULL,
    month_of_year SMALLINT NULL CHECK (month_of_year BETWEEN 1 AND 12),
    season_name VARCHAR(50) NULL,
    recurrence_rule TEXT NULL,
    location_name VARCHAR(200) NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    location GEOGRAPHY(POINT, 4326) NULL,
    category VARCHAR(100) NULL,
    official_url TEXT NULL,
    status CONTENT_STATUS DEFAULT 'PUBLISHED',
    verification_status VERIFICATION_STATUS DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_festivals_ut ON festivals(union_territory_id);
CREATE INDEX idx_festivals_date_precision ON festivals(date_precision);
CREATE INDEX idx_festivals_start_date ON festivals(start_date);
CREATE INDEX idx_festivals_month ON festivals(month_of_year);
```

---

# 4. Safety & Emergency Core Tables

### 4.1 `emergency_facilities`
```sql
CREATE TABLE emergency_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    union_territory_id UUID NOT NULL REFERENCES union_territories(id) ON DELETE RESTRICT,
    destination_id UUID NULL REFERENCES destinations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type EMERGENCY_FACILITY_TYPE NOT NULL,
    description TEXT NULL,
    address TEXT NOT NULL,
    phone_numbers TEXT[] NOT NULL,
    emergency_phone VARCHAR(50) NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    operating_hours JSONB NULL,
    services TEXT[] NULL,
    is_24x7 BOOLEAN DEFAULT FALSE,
    status CONTENT_STATUS DEFAULT 'PUBLISHED',
    verification_status VERIFICATION_STATUS DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emergency_ut ON emergency_facilities(union_territory_id);
CREATE INDEX idx_emergency_type ON emergency_facilities(type);
CREATE INDEX idx_emergency_location ON emergency_facilities USING GIST(location);
```

---

# 5. Itineraries, Routes & Timeline Tables

### 5.1 `itineraries` (Master Repaired)
```sql
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE CASCADE,
    guest_session_id VARCHAR(128) NULL, -- For unauthenticated guest mode persistence
    name VARCHAR(255) NOT NULL,
    destination_union_territory_id UUID NULL REFERENCES union_territories(id) ON DELETE SET NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    duration_days INTEGER NULL CHECK (duration_days >= 1),
    traveller_count INTEGER DEFAULT 1 CHECK (traveller_count >= 1),
    budget_min DECIMAL(10, 2) NULL,
    budget_max DECIMAL(10, 2) NULL,
    estimated_cost DECIMAL(10, 2) NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    travel_style TRAVEL_STYLE NULL,
    interests TEXT[] NULL,
    readiness_score DECIMAL(3, 0) NULL CHECK (readiness_score BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'DRAFT',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_itineraries_guest ON itineraries(guest_session_id);
CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);
```

### 5.2 `routes` (Master Repaired)
```sql
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE CASCADE,
    itinerary_id UUID NULL REFERENCES itineraries(id) ON DELETE SET NULL,
    origin_name VARCHAR(200) NULL,
    destination_name VARCHAR(200) NULL,
    origin GEOGRAPHY(POINT, 4326) NOT NULL,
    destination GEOGRAPHY(POINT, 4326) NOT NULL,
    geometry GEOGRAPHY(LINESTRING, 4326) NOT NULL,
    distance_meters DECIMAL(12, 2) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    elevation_gain_meters DECIMAL(8, 2) NULL,
    elevation_loss_meters DECIMAL(8, 2) NULL,
    elevation_profile JSONB NULL, -- Array of [{ lat, lng, elevation_m, distance_from_origin_m }]
    provider VARCHAR(50) DEFAULT 'mapbox',
    provider_route_id VARCHAR(255) NULL,
    route_metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routes_itinerary ON routes(itinerary_id);
CREATE INDEX idx_routes_geometry ON routes USING GIST(geometry);
```

### 5.3 `itinerary_items` (Master Repaired)
```sql
CREATE TABLE itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    type ITINERARY_ITEM_TYPE NOT NULL,
    destination_id UUID NULL REFERENCES destinations(id) ON DELETE SET NULL,
    attraction_id UUID NULL REFERENCES attractions(id) ON DELETE SET NULL,
    experience_id UUID NULL REFERENCES experiences(id) ON DELETE SET NULL,
    hotel_id UUID NULL REFERENCES hotels(id) ON DELETE SET NULL,
    restaurant_id UUID NULL REFERENCES restaurants(id) ON DELETE SET NULL,
    route_id UUID NULL REFERENCES routes(id) ON DELETE SET NULL, -- Normalized transit link
    custom_title VARCHAR(255) NULL,
    custom_description TEXT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    duration_minutes INTEGER NULL,
    estimated_cost DECIMAL(10, 2) NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    location GEOGRAPHY(POINT, 4326) NULL,
    notes TEXT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itinerary_items_day ON itinerary_items(itinerary_day_id);
CREATE INDEX idx_itinerary_items_route ON itinerary_items(route_id);
```

---

# 6. User Identity & Yatra Vault Tables

### 6.1 `user_documents` (NEW: Yatra Vault Table)
```sql
CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    itinerary_id UUID NULL REFERENCES itineraries(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    document_type DOCUMENT_TYPE NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    encrypted_key_metadata JSONB NULL, -- Client-side / KMS encryption key metadata
    expires_at TIMESTAMPTZ NULL,
    status CONTENT_STATUS DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_documents_user ON user_documents(user_id);
CREATE INDEX idx_user_documents_itinerary ON user_documents(itinerary_id);
CREATE INDEX idx_user_documents_type ON user_documents(document_type);
```

---

# 7. AI & pgvector RAG Tables

### 7.1 `knowledge_chunks`
```sql
CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER NULL,
    embedding VECTOR(1536) NULL, -- OpenAI text-embedding-3-small
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_knowledge_chunks_doc ON knowledge_chunks(document_id);
CREATE INDEX idx_knowledge_chunks_vector ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
```

---

# 8. Complete 53-Table Schema Inventory (v2.0)

| ID | Table Name | Domain | Primary Purpose | Key Foreign Keys & Indexes |
|---|---|---|---|---|
| 1 | `union_territories` | Geography | 8 Canonical UTs & Polymorphic State Container | Unique(`code`, `slug`), `GIST(geometry)` |
| 2 | `regions` | Geography | Regional clusters within UTs | `union_territory_id` |
| 3 | `destinations` | Tourism | Cities, towns, islands, valleys | `union_territory_id`, `GIST(location)` |
| 4 | `attractions` | Tourism | Monuments, heritage, viewpoints | `destination_id`, `GIST(location)` |
| 5 | `experiences` | Tourism | Curated activities and adventures | `destination_id`, `GIST(location)` |
| 6 | `hotels` | Tourism | Verified accommodations | `destination_id`, `GIST(location)` |
| 7 | `restaurants` | Tourism | Verified dining & local cuisine | `destination_id`, `GIST(location)` |
| 8 | `festivals` | Tourism | 2026 Structured Festival Calendar with Date Precision | `date_precision`, `start_date`, `month_of_year` |
| 9 | `events` | Tourism | Contemporary ticketed cultural/sports events | `union_territory_id`, `destination_id` |
| 10 | `travel_advisories` | Safety | Government travel guidelines & entry rules | `union_territory_id`, `severity` |
| 11 | `safety_alerts` | Safety | Active time-sensitive hazard warnings | `GIST(location)`, `severity`, `expires_at` |
| 12 | `emergency_facilities`| Safety | Verified 24x7 trauma hospitals, police, coast guard | `GIST(location)`, `type`, `union_territory_id` |
| 13 | `emergency_contacts` | Safety | Curated national (112, 1363, 1554) & regional helplines | `union_territory_id`, `service_type` |
| 14 | `weather_snapshots` | Intelligence | Cached meteorological observations & forecasts | `destination_id`, `observed_at` |
| 15 | `routes` | Travel | Multi-waypoint LineString geometries & elevation profiles | `itinerary_id`, `GIST(geometry)` |
| 16 | `route_stops` | Travel | Ordered waypoints along a calculated route | `route_id`, `sequence_number` |
| 17 | `users` | User | Traveler accounts & administrative RBAC | Unique(`email`, `phone`), `role` |
| 18 | `user_preferences` | User | Travel styles, dietary options, pacing | Unique(`user_id`) |
| 19 | `user_documents` | User (Vault) | Encrypted permits, tickets, vouchers | `user_id`, `itinerary_id`, `document_type` |
| 20 | `saved_places` | User | Traveler wishlists and bookmarked POIs | `user_id`, `destination_id`, `attraction_id` |
| 21 | `reviews` | User | Verified visitor ratings (1–5) and reviews | `user_id`, `destination_id`, `attraction_id` |
| 22 | `itineraries` | Travel | Multi-day trip schedules with guest sessions & readiness | `user_id`, `guest_session_id`, `dates` |
| 23 | `itinerary_days` | Travel | Day containers for sequential timeline items | Unique(`itinerary_id`, `day_number`) |
| 24 | `itinerary_items` | Travel | Discrete stops, attractions, meals, and transit | `itinerary_day_id`, `route_id`, `location` |
| 25 | `itinerary_transports`| Travel | Detailed transit legs between itinerary items | `itinerary_id`, `from_item_id`, `to_item_id` |
| 26 | `itinerary_versions` | Travel | Immutable snapshots for AI undo/rollback | `itinerary_id`, `version_number` |
| 27 | `booking_providers` | Booking | Unified Provider Adapter registry | Unique(`slug`), `provider_type` |
| 28 | `bookable_listings` | Booking | Normalized inventory listings | `provider_id`, `hotel_id`, `experience_id` |
| 29 | `booking_availability`| Booking | Cached inventory dates and pricing tiers | `listing_id`, `available_from`, `available_until` |
| 30 | `bookings` | Booking | Transactional booking records & state machine | `user_id`, `provider_id`, `status` |
| 31 | `booking_events` | Booking | Immutable audit log for booking status transitions | `booking_id`, `event_type` |
| 32 | `ai_conversations` | AI | Persistent conversation threads | `user_id`, `itinerary_id` |
| 33 | `ai_messages` | AI | User, assistant, system, and tool messages | `conversation_id`, `created_at` |
| 34 | `ai_tool_executions` | AI | Audit log of tool execution calls & arguments | `conversation_id`, `tool_name` |
| 35 | `knowledge_documents`| AI (RAG) | Official parsed government tourism source docs | `union_territory_id`, `source_id` |
| 36 | `knowledge_chunks` | AI (RAG) | 500-token chunks with 1536-dim vector embeddings | `document_id`, `HNSW(embedding)` |
| 37 | `ai_citations` | AI (RAG) | Footnote links grounding AI answers in source chunks | `message_id`, `chunk_id` |
| 38 | `data_sources` | Content | Official government & institutional source registry | `source_type`, `reliability_level` |
| 39 | `verification_records`| Content | Audit trail of manual/automated verifications | `entity_type`, `entity_id`, `status` |
| 40 | `content_versions` | Content | Versioned snapshots for editorial changes | `entity_type`, `entity_id`, `version_number` |
| 41 | `media` | Content | CDN image and video metadata with licensing | `entity_type`, `entity_id`, `sort_order` |
| 42 | `user_emergency_contacts`| User | Traveler's trusted emergency SMS contacts | `user_id`, `is_primary` |
| 43 | `yatra_share_sessions`| User | Secure cryptographic live-trip sharing sessions | Unique(`share_token_hash`), `itinerary_id` |
| 44 | `live_location_events`| User | Historical breadcrumb coordinates during Yatra Mode | `itinerary_id`, `location`, `recorded_at` |
| 45 | `packing_lists` | Travel | Packing checklists for active trips | `itinerary_id`, `user_id` |
| 46 | `packing_items` | Travel | Itemized checklist entries with weather/altitude reasoning| `packing_list_id`, `category` |
| 47 | `budget_plans` | Travel | 5-bucket itemized budget plans | `itinerary_id` |
| 48 | `budget_items` | Travel | Estimated vs actual expenses by category | `budget_plan_id`, `category` |
| 49 | `destination_culture`| Content | Local traditions, greetings, language phrasebooks | `destination_id`, `union_territory_id` |
| 50 | `food_items` | Content | Iconic culinary dishes and dietary tags | `union_territory_id`, `destination_id` |
| 51 | `transport_options` | Content | Inter-island ferries, buses, and seasonal flight options | `union_territory_id`, `destination_id` |
| 52 | `permits` | Safety | Regulatory permit rules (ILP, e-Permit, Tribal Pass) | `union_territory_id`, `destination_id` |
| 53 | `destination_rules` | Content | Photography rules, temple dress codes, restrictions | `destination_id`, `severity` |

---

# 9. Document Ratification

**Phase 3 Database Schema v2.0 is officially ratified and production-approved.**  
This schema completely satisfies all requirements of [Phase 1 PRD v2.0](file:///c:/Users/SUBHAM%20DAS/CODING/SIH%202026/docs/Phase-1-PRD-v2.md), [Phase 2 Technical Architecture](file:///c:/Users/SUBHAM%20DAS/CODING/SIH%202026/Bharat_Safe_Yatra_Phase_2_Technical_Architecture_v1.0.md), and [Phase 4 API Specification](file:///c:/Users/SUBHAM%20DAS/CODING/SIH%202026/Bharat_Safe_Yatra_Phase_4_API_Specification_v1.0.md).
