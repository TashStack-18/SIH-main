# 🇮🇳 BHARAT SAFE YATRA
## Phase 3 — Database Schema
### SIH 2026

**Schema Version:** 1.0  
**Platform:** Web Application  
**Scope:** India's 8 Union Territories  
**Database:** PostgreSQL + PostGIS + pgvector  
**ORM:** Prisma  
**Architecture:** Modular Monolith  
**Purpose:** Define the complete data foundation for Bharat Safe Yatra before production implementation.

---

# 1. Database Design Philosophy

The database must support:

- Tourism discovery
- Union Territory and destination intelligence
- Attractions and experiences
- Hotels and restaurants
- Festivals and events
- Weather and travel advisories
- Emergency and safety services
- Interactive maps and geographic queries
- AI/RAG knowledge
- Itineraries
- Bookings
- User preferences
- Saved places
- Reviews
- Media
- Data verification
- Administrative management

The database should follow these principles:

### 1.1 Normalized Core Data

Core entities should avoid unnecessary duplication.

### 1.2 Geographic First-Class Support

Location should be represented using PostGIS wherever geographic queries are required.

### 1.3 Verified Information

Important tourism and safety records must retain source and verification metadata.

### 1.4 AI-Ready

The database must support document chunks and vector embeddings for Yatra AI.

### 1.5 Booking-Ready

Bookings must remain provider-independent.

### 1.6 Extensible

The schema must support future expansion beyond Union Territories without redesigning the core data model.

---

# 2. High-Level Entity Architecture

```text
Bharat Safe Yatra
│
├── Geography
│   ├── Union Territory
│   ├── Region
│   └── Location
│
├── Tourism
│   ├── Destination
│   ├── Attraction
│   ├── Experience
│   ├── Hotel
│   ├── Restaurant
│   ├── Festival
│   └── Event
│
├── Travel
│   ├── Itinerary
│   ├── Itinerary Day
│   ├── Itinerary Item
│   ├── Route
│   └── Transport
│
├── Booking
│   ├── Provider
│   ├── Listing
│   ├── Availability
│   └── Booking
│
├── Safety
│   ├── Emergency Facility
│   ├── Travel Advisory
│   ├── Safety Alert
│   └── Emergency Contact
│
├── Intelligence
│   ├── Weather Snapshot
│   ├── AI Conversation
│   ├── AI Message
│   ├── Knowledge Document
│   └── Knowledge Chunk
│
├── User
│   ├── User
│   ├── Preference
│   ├── Saved Place
│   ├── Review
│   └── Emergency Contact
│
└── Content
    ├── Media
    ├── Data Source
    ├── Verification Record
    └── Content Version
```

---

# 3. Database Technology

## PostgreSQL

Primary relational database.

## PostGIS

Geospatial extension for:

- destinations
- attractions
- hotels
- restaurants
- emergency facilities
- routes
- geographic searches

## pgvector

Vector similarity search for:

- AI knowledge
- destination descriptions
- travel advisories
- cultural information
- festival information
- FAQs

---

# 4. Naming Conventions

Tables use:

```text
snake_case
```

Examples:

```text
union_territories
destinations
itineraries
itinerary_items
emergency_facilities
```

Primary keys:

```text
id UUID
```

Foreign keys:

```text
<entity>_id UUID
```

Timestamps:

```text
created_at
updated_at
```

Soft deletion where appropriate:

```text
deleted_at
```

---

# 5. UUID Strategy

All major entities should use UUID primary keys.

Example:

```text
id UUID PRIMARY KEY
```

Reasons:

- safer public identifiers
- distributed-system compatibility
- easier future scaling
- avoids predictable sequential IDs

---

# 6. Common Timestamp Fields

Most persistent entities should include:

```text
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Content entities may additionally include:

```text
published_at TIMESTAMPTZ
```

Soft-deletable entities may include:

```text
deleted_at TIMESTAMPTZ NULL
```

---

# 7. Core Enum Definitions

The following enums should be created.

## User Role

```text
USER
ADMIN
CONTENT_MANAGER
SAFETY_MANAGER
```

---

## Content Status

```text
DRAFT
PUBLISHED
ARCHIVED
DISABLED
```

---

## Verification Status

```text
PENDING_REVIEW
VERIFIED
OUTDATED
REJECTED
DISABLED
```

---

## Destination Type

```text
CITY
TOWN
ISLAND
VILLAGE
REGION
NATIONAL_PARK
BEACH
MOUNTAIN
VALLEY
HERITAGE_SITE
OTHER
```

---

## Attraction Type

```text
NATURAL
HERITAGE
CULTURAL
RELIGIOUS
MUSEUM
MONUMENT
BEACH
VIEWPOINT
ADVENTURE
WILDLIFE
ARCHITECTURE
OTHER
```

---

## Experience Type

```text
TREKKING
DIVING
SNORKELING
KAYAKING
CAMPING
WILDLIFE
PHOTOGRAPHY
FOOD
CULTURE
HERITAGE
WELLNESS
SHOPPING
WATER_SPORT
ADVENTURE
OTHER
```

---

## Travel Style

```text
RELAXED
BALANCED
ADVENTURE
LUXURY
BUDGET
FAMILY
CULTURAL
NATURE
```

---

## Itinerary Item Type

```text
DESTINATION
ATTRACTION
EXPERIENCE
HOTEL
RESTAURANT
TRANSPORT
CUSTOM
```

---

## Booking Type

```text
HOTEL
FLIGHT
ACTIVITY
TRANSPORT
EXPERIENCE
```

---

## Booking Status

```text
PENDING
CONFIRMED
CANCELLED
FAILED
COMPLETED
REFUNDED
```

---

## Payment Status

```text
PENDING
AUTHORIZED
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

---

## Emergency Facility Type

```text
HOSPITAL
CLINIC
POLICE
FIRE_STATION
AMBULANCE
COAST_GUARD
DISASTER_RESPONSE
TOURIST_ASSISTANCE
OTHER
```

---

## Alert Severity

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

---

## Alert Type

```text
WEATHER
ROAD
SECURITY
HEALTH
TRANSPORT
NATURAL_DISASTER
TOURISM
OTHER
```

---

# 8. Union Territories Table

## `union_territories`

Stores the canonical 8 Union Territories.

### Fields

```text
id UUID PK

code VARCHAR UNIQUE NOT NULL
name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL

short_description TEXT
description TEXT

capital VARCHAR

latitude DECIMAL
longitude DECIMAL

geometry GEOGRAPHY(POINT, 4326)

timezone VARCHAR

status CONTENT_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### Initial Records

```text
ANDAMAN_NICOBAR
CHANDIGARH
DADRA_NAGAR_HAVELI_DAMAN_DIU
DELHI
JAMMU_KASHMIR
LADAKH
LAKSHADWEEP
PUDUCHERRY
```

---

# 9. Regions Table

## `regions`

Used to organize areas within Union Territories.

```text
id UUID PK

union_territory_id UUID FK

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

description TEXT

latitude DECIMAL
longitude DECIMAL
geometry GEOGRAPHY(GEOMETRY, 4326)

status CONTENT_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 10. Destinations Table

## `destinations`

The primary tourism destination entity.

```text
id UUID PK

union_territory_id UUID FK
region_id UUID FK NULL

name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL

type DESTINATION_TYPE

short_description TEXT
description TEXT

latitude DECIMAL
longitude DECIMAL

location GEOGRAPHY(POINT, 4326)

elevation_meters DECIMAL NULL

best_time_start SMALLINT NULL
best_time_end SMALLINT NULL

average_visit_duration_minutes INTEGER NULL

estimated_daily_budget_min DECIMAL NULL
estimated_daily_budget_max DECIMAL NULL

rating DECIMAL NULL
rating_count INTEGER DEFAULT 0

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 11. Destination Relationships

A destination can have:

```text
Union Territory
Region
Attractions
Experiences
Hotels
Restaurants
Festivals
Events
Media
Reviews
Travel Advisories
Weather
```

---

# 12. Attractions Table

## `attractions`

```text
id UUID PK

destination_id UUID FK
union_territory_id UUID FK

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

type ATTRACTION_TYPE

short_description TEXT
description TEXT

latitude DECIMAL
longitude DECIMAL

location GEOGRAPHY(POINT, 4326)

opening_time TIME NULL
closing_time TIME NULL

entry_fee_min DECIMAL NULL
entry_fee_max DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

average_visit_duration_minutes INTEGER NULL

rating DECIMAL NULL
rating_count INTEGER DEFAULT 0

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 13. Experiences Table

## `experiences`

```text
id UUID PK

destination_id UUID FK
union_territory_id UUID FK

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

type EXPERIENCE_TYPE

short_description TEXT
description TEXT

duration_minutes INTEGER NULL

difficulty VARCHAR NULL

minimum_age INTEGER NULL

price_min DECIMAL NULL
price_max DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

latitude DECIMAL NULL
longitude DECIMAL NULL

location GEOGRAPHY(POINT, 4326) NULL

provider_name VARCHAR NULL
provider_url TEXT NULL

rating DECIMAL NULL
rating_count INTEGER DEFAULT 0

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 14. Hotels Table

## `hotels`

```text
id UUID PK

destination_id UUID FK
union_territory_id UUID FK

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

description TEXT

address TEXT

latitude DECIMAL
longitude DECIMAL

location GEOGRAPHY(POINT, 4326)

star_rating DECIMAL NULL
guest_rating DECIMAL NULL
review_count INTEGER DEFAULT 0

price_per_night_min DECIMAL NULL
price_per_night_max DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

phone VARCHAR NULL
email VARCHAR NULL
website_url TEXT NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 15. Restaurants Table

## `restaurants`

```text
id UUID PK

destination_id UUID FK
union_territory_id UUID FK

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

description TEXT

cuisine TEXT[]

dietary_options TEXT[]

address TEXT

latitude DECIMAL
longitude DECIMAL

location GEOGRAPHY(POINT, 4326)

price_level SMALLINT NULL

rating DECIMAL NULL
rating_count INTEGER DEFAULT 0

phone VARCHAR NULL
website_url TEXT NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 16. Festivals Table

## `festivals`

```text
id UUID PK

union_territory_id UUID FK
destination_id UUID FK NULL

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

description TEXT
cultural_significance TEXT

start_date DATE NOT NULL
end_date DATE NULL

recurrence_rule TEXT NULL

location_name VARCHAR NULL

latitude DECIMAL NULL
longitude DECIMAL NULL

location GEOGRAPHY(POINT, 4326) NULL

category VARCHAR NULL

official_url TEXT NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 17. Events Table

## `events`

For non-festival events.

```text
id UUID PK

union_territory_id UUID FK
destination_id UUID FK NULL

name VARCHAR NOT NULL
slug VARCHAR NOT NULL

description TEXT

start_at TIMESTAMPTZ
end_at TIMESTAMPTZ

venue_name VARCHAR NULL

latitude DECIMAL NULL
longitude DECIMAL NULL

location GEOGRAPHY(POINT, 4326) NULL

category VARCHAR NULL

ticket_required BOOLEAN DEFAULT FALSE
ticket_url TEXT NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 18. Travel Advisories Table

## `travel_advisories`

```text
id UUID PK

union_territory_id UUID FK NULL
destination_id UUID FK NULL

title VARCHAR NOT NULL
description TEXT NOT NULL

severity ALERT_SEVERITY

valid_from TIMESTAMPTZ NULL
valid_until TIMESTAMPTZ NULL

official_url TEXT NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 19. Safety Alerts Table

## `safety_alerts`

For active or time-sensitive warnings.

```text
id UUID PK

union_territory_id UUID FK NULL
destination_id UUID FK NULL

title VARCHAR NOT NULL
message TEXT NOT NULL

type ALERT_TYPE
severity ALERT_SEVERITY

latitude DECIMAL NULL
longitude DECIMAL NULL

location GEOGRAPHY(POINT, 4326) NULL

radius_meters INTEGER NULL

starts_at TIMESTAMPTZ
expires_at TIMESTAMPTZ NULL

source_id UUID FK NULL

is_active BOOLEAN DEFAULT TRUE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 20. Emergency Facilities Table

## `emergency_facilities`

One of the most important safety tables.

```text
id UUID PK

union_territory_id UUID FK NULL
destination_id UUID FK NULL

name VARCHAR NOT NULL

type EMERGENCY_FACILITY_TYPE

description TEXT NULL

address TEXT

phone_numbers TEXT[]

emergency_phone VARCHAR NULL

latitude DECIMAL NOT NULL
longitude DECIMAL NOT NULL

location GEOGRAPHY(POINT, 4326) NOT NULL

operating_hours JSONB NULL

services TEXT[]

is_24x7 BOOLEAN DEFAULT FALSE

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 21. Emergency Contacts Table

## `emergency_contacts`

For official emergency numbers and territory-specific contacts.

```text
id UUID PK

union_territory_id UUID FK NULL

name VARCHAR NOT NULL
service_type VARCHAR NOT NULL

phone_number VARCHAR NOT NULL

description TEXT NULL

official_url TEXT NULL

verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 22. Weather Snapshots Table

## `weather_snapshots`

Stores cached weather data.

```text
id UUID PK

union_territory_id UUID FK NULL
destination_id UUID FK NULL

latitude DECIMAL NOT NULL
longitude DECIMAL NOT NULL

observed_at TIMESTAMPTZ NOT NULL

temperature_c DECIMAL NULL
feels_like_c DECIMAL NULL

humidity_percent DECIMAL NULL

wind_speed_kmh DECIMAL NULL
wind_direction_degrees DECIMAL NULL

visibility_km DECIMAL NULL

pressure_hpa DECIMAL NULL

precipitation_mm DECIMAL NULL

weather_code VARCHAR NULL
weather_description TEXT NULL

source VARCHAR NOT NULL

raw_data JSONB NULL

created_at TIMESTAMPTZ
```

---

# 23. Route Table

## `routes`

Stores generated route information.

```text
id UUID PK

user_id UUID FK NULL
itinerary_id UUID FK NULL

origin_name VARCHAR NULL
destination_name VARCHAR NULL

origin GEOGRAPHY(POINT, 4326)
destination GEOGRAPHY(POINT, 4326)

geometry GEOGRAPHY(LINESTRING, 4326)

distance_meters DECIMAL
duration_seconds INTEGER

elevation_gain_meters DECIMAL NULL
elevation_loss_meters DECIMAL NULL

provider VARCHAR

provider_route_id VARCHAR NULL

route_metadata JSONB NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 24. Route Stops Table

## `route_stops`

```text
id UUID PK

route_id UUID FK

sequence_number INTEGER NOT NULL

name VARCHAR NOT NULL

location GEOGRAPHY(POINT, 4326)

stop_type VARCHAR NULL

estimated_arrival TIMESTAMPTZ NULL
estimated_duration_minutes INTEGER NULL

created_at TIMESTAMPTZ
```

---

# 25. Users Table

## `users`

Authentication is planned for a later implementation stage, but the schema should be ready.

```text
id UUID PK

email VARCHAR UNIQUE NOT NULL

phone VARCHAR UNIQUE NULL

display_name VARCHAR NULL

first_name VARCHAR NULL
last_name VARCHAR NULL

avatar_url TEXT NULL

role USER_ROLE DEFAULT USER

preferred_language VARCHAR DEFAULT 'en'
preferred_currency VARCHAR DEFAULT 'INR'

timezone VARCHAR NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 26. User Preferences Table

## `user_preferences`

```text
id UUID PK

user_id UUID UNIQUE FK

travel_styles TEXT[]
interests TEXT[]

budget_min DECIMAL NULL
budget_max DECIMAL NULL

preferred_accommodation_types TEXT[]
preferred_transport_types TEXT[]

dietary_preferences TEXT[]

accessibility_requirements TEXT[]

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 27. Saved Places Table

## `saved_places`

```text
id UUID PK

user_id UUID FK

destination_id UUID FK NULL
attraction_id UUID FK NULL
experience_id UUID FK NULL
hotel_id UUID FK NULL
restaurant_id UUID FK NULL

note TEXT NULL

created_at TIMESTAMPTZ
```

A database constraint should ensure that a saved-place record references the intended entity correctly.

---

# 28. Reviews Table

## `reviews`

```text
id UUID PK

user_id UUID FK

destination_id UUID FK NULL
attraction_id UUID FK NULL
experience_id UUID FK NULL
hotel_id UUID FK NULL
restaurant_id UUID FK NULL

rating SMALLINT NOT NULL

title VARCHAR NULL
body TEXT NULL

status CONTENT_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Rating constraint:

```text
rating >= 1
rating <= 5
```

---

# 29. Itineraries Table

## `itineraries`

Central trip-planning entity.

```text
id UUID PK

user_id UUID FK NULL

name VARCHAR NOT NULL

destination_union_territory_id UUID FK NULL

start_date DATE NULL
end_date DATE NULL

duration_days INTEGER NULL

traveller_count INTEGER DEFAULT 1

budget_min DECIMAL NULL
budget_max DECIMAL NULL
estimated_cost DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

travel_style TRAVEL_STYLE NULL

interests TEXT[]

status VARCHAR DEFAULT 'DRAFT'

ai_generated BOOLEAN DEFAULT FALSE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
deleted_at TIMESTAMPTZ NULL
```

---

# 30. Itinerary Days Table

## `itinerary_days`

```text
id UUID PK

itinerary_id UUID FK

day_number INTEGER NOT NULL

date DATE NULL

title VARCHAR NULL

summary TEXT NULL

estimated_cost DECIMAL NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Unique constraint:

```text
(itinerary_id, day_number)
```

---

# 31. Itinerary Items Table

## `itinerary_items`

```text
id UUID PK

itinerary_day_id UUID FK

sequence_number INTEGER NOT NULL

type ITINERARY_ITEM_TYPE

destination_id UUID FK NULL
attraction_id UUID FK NULL
experience_id UUID FK NULL
hotel_id UUID FK NULL
restaurant_id UUID FK NULL

custom_title VARCHAR NULL
custom_description TEXT NULL

start_time TIME NULL
end_time TIME NULL

duration_minutes INTEGER NULL

estimated_cost DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

location GEOGRAPHY(POINT, 4326) NULL

notes TEXT NULL

ai_generated BOOLEAN DEFAULT FALSE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 32. Itinerary Transport Table

## `itinerary_transports`

```text
id UUID PK

itinerary_id UUID FK

from_item_id UUID FK
to_item_id UUID FK

transport_type VARCHAR NOT NULL

distance_meters DECIMAL NULL
duration_minutes INTEGER NULL

estimated_cost DECIMAL NULL

route_id UUID FK NULL

notes TEXT NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 33. Itinerary Versions Table

## `itinerary_versions`

Important for AI modifications and user rollback.

```text
id UUID PK

itinerary_id UUID FK

version_number INTEGER NOT NULL

snapshot JSONB NOT NULL

change_reason TEXT NULL

created_by VARCHAR NULL

created_at TIMESTAMPTZ
```

This allows:

> Restore previous itinerary.

---

# 34. Booking Providers Table

## `booking_providers`

```text
id UUID PK

name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL

provider_type BOOKING_TYPE

api_base_url TEXT NULL

website_url TEXT NULL

is_active BOOLEAN DEFAULT TRUE

configuration JSONB NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Sensitive API credentials should never be stored as plain database values.

---

# 35. Bookable Listings Table

## `bookable_listings`

Normalizes provider-specific inventory.

```text
id UUID PK

provider_id UUID FK

hotel_id UUID FK NULL
experience_id UUID FK NULL

external_listing_id VARCHAR NOT NULL

name VARCHAR NOT NULL

description TEXT NULL

currency VARCHAR DEFAULT 'INR'

metadata JSONB NULL

is_active BOOLEAN DEFAULT TRUE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 36. Booking Availability Table

## `booking_availability`

```text
id UUID PK

listing_id UUID FK

available_from TIMESTAMPTZ
available_until TIMESTAMPTZ

price DECIMAL
currency VARCHAR DEFAULT 'INR'

inventory_count INTEGER NULL

metadata JSONB NULL

retrieved_at TIMESTAMPTZ
expires_at TIMESTAMPTZ NULL
```

This is primarily a cache/availability representation and should not be treated as permanent provider truth.

---

# 37. Bookings Table

## `bookings`

```text
id UUID PK

user_id UUID FK NULL

itinerary_id UUID FK NULL

provider_id UUID FK

listing_id UUID FK NULL

booking_type BOOKING_TYPE

external_booking_id VARCHAR NULL

status BOOKING_STATUS

payment_status PAYMENT_STATUS

start_at TIMESTAMPTZ NULL
end_at TIMESTAMPTZ NULL

total_amount DECIMAL
currency VARCHAR DEFAULT 'INR'

traveller_details JSONB

provider_response JSONB NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 38. Booking Events Table

## `booking_events`

Audit trail for booking changes.

```text
id UUID PK

booking_id UUID FK

event_type VARCHAR NOT NULL

status VARCHAR NULL

payload JSONB NULL

created_at TIMESTAMPTZ
```

---

# 39. AI Conversations Table

## `ai_conversations`

```text
id UUID PK

user_id UUID FK NULL

itinerary_id UUID FK NULL

title VARCHAR NULL

context JSONB NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 40. AI Messages Table

## `ai_messages`

```text
id UUID PK

conversation_id UUID FK

role VARCHAR NOT NULL

content TEXT NOT NULL

tool_name VARCHAR NULL

tool_arguments JSONB NULL
tool_result JSONB NULL

token_usage JSONB NULL

created_at TIMESTAMPTZ
```

Roles:

```text
USER
ASSISTANT
SYSTEM
TOOL
```

---

# 41. AI Tool Execution Table

## `ai_tool_executions`

Useful for auditing tool calls.

```text
id UUID PK

conversation_id UUID FK

message_id UUID FK NULL

tool_name VARCHAR NOT NULL

arguments JSONB

result JSONB NULL

status VARCHAR NOT NULL

error_message TEXT NULL

started_at TIMESTAMPTZ
completed_at TIMESTAMPTZ NULL
```

---

# 42. Knowledge Documents Table

## `knowledge_documents`

The root entity for RAG content.

```text
id UUID PK

title VARCHAR NOT NULL

document_type VARCHAR NOT NULL

description TEXT NULL

source_id UUID FK NULL

union_territory_id UUID FK NULL
destination_id UUID FK NULL

source_url TEXT NULL

content TEXT NOT NULL

language VARCHAR DEFAULT 'en'

version INTEGER DEFAULT 1

verification_status VERIFICATION_STATUS

published_at TIMESTAMPTZ NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 43. Knowledge Chunks Table

## `knowledge_chunks`

Stores chunked RAG content.

```text
id UUID PK

document_id UUID FK

chunk_index INTEGER NOT NULL

content TEXT NOT NULL

token_count INTEGER NULL

embedding VECTOR(1536) NULL

metadata JSONB NULL

created_at TIMESTAMPTZ
```

The vector dimension should be finalized according to the embedding model selected during implementation.

---

# 44. AI Source Citations Table

## `ai_citations`

Allows AI answers to reference knowledge sources.

```text
id UUID PK

message_id UUID FK

document_id UUID FK NULL
chunk_id UUID FK NULL

citation_text TEXT NULL

source_url TEXT NULL

created_at TIMESTAMPTZ
```

---

# 45. Data Sources Table

## `data_sources`

Stores origin information for structured data.

```text
id UUID PK

name VARCHAR NOT NULL

organization VARCHAR NULL

source_type VARCHAR NOT NULL

url TEXT NULL

api_url TEXT NULL

description TEXT NULL

reliability_level VARCHAR NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 46. Verification Records Table

## `verification_records`

Tracks verification of tourism and safety data.

```text
id UUID PK

source_id UUID FK NULL

entity_type VARCHAR NOT NULL
entity_id UUID NOT NULL

status VERIFICATION_STATUS

verified_by UUID FK NULL

verified_at TIMESTAMPTZ NULL

source_url TEXT NULL

notes TEXT NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 47. Content Versions Table

## `content_versions`

Useful for important tourism content.

```text
id UUID PK

entity_type VARCHAR NOT NULL
entity_id UUID NOT NULL

version_number INTEGER NOT NULL

content_snapshot JSONB NOT NULL

created_by UUID FK NULL

created_at TIMESTAMPTZ
```

---

# 48. Media Table

## `media`

Central media metadata.

```text
id UUID PK

entity_type VARCHAR NOT NULL
entity_id UUID NOT NULL

media_type VARCHAR NOT NULL

url TEXT NOT NULL
thumbnail_url TEXT NULL

alt_text TEXT NULL

caption TEXT NULL

source_url TEXT NULL

license VARCHAR NULL

credit TEXT NULL

sort_order INTEGER DEFAULT 0

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 49. Emergency User Contacts Table

## `user_emergency_contacts`

For the user's trusted contacts.

```text
id UUID PK

user_id UUID FK

name VARCHAR NOT NULL

relationship VARCHAR NULL

phone_number VARCHAR NOT NULL

email VARCHAR NULL

is_primary BOOLEAN DEFAULT FALSE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 50. Yatra Share Sessions Table

## `yatra_share_sessions`

For future live-trip sharing.

```text
id UUID PK

user_id UUID FK

itinerary_id UUID FK

share_token_hash VARCHAR UNIQUE NOT NULL

expires_at TIMESTAMPTZ NULL

is_active BOOLEAN DEFAULT TRUE

last_location GEOGRAPHY(POINT, 4326) NULL
last_location_at TIMESTAMPTZ NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Never store a raw share token if a secure hash can be used.

---

# 51. Live Location Events Table

## `live_location_events`

Optional for Yatra Mode.

```text
id UUID PK

user_id UUID FK NULL
itinerary_id UUID FK NULL
share_session_id UUID FK NULL

location GEOGRAPHY(POINT, 4326) NOT NULL

accuracy_meters DECIMAL NULL
speed_kmh DECIMAL NULL
heading_degrees DECIMAL NULL

recorded_at TIMESTAMPTZ NOT NULL
```

This table may require retention policies because location data is sensitive.

---

# 52. Packing Lists Table

## `packing_lists`

```text
id UUID PK

user_id UUID FK NULL
itinerary_id UUID FK NULL

title VARCHAR NOT NULL

generated_by_ai BOOLEAN DEFAULT FALSE

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 53. Packing Items Table

## `packing_items`

```text
id UUID PK

packing_list_id UUID FK

name VARCHAR NOT NULL

category VARCHAR NULL

quantity INTEGER DEFAULT 1

is_required BOOLEAN DEFAULT FALSE

is_checked BOOLEAN DEFAULT FALSE

reason TEXT NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 54. Budget Plans Table

## `budget_plans`

```text
id UUID PK

itinerary_id UUID FK

total_budget DECIMAL
currency VARCHAR DEFAULT 'INR'

estimated_total DECIMAL NULL

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 55. Budget Items Table

## `budget_items`

```text
id UUID PK

budget_plan_id UUID FK

category VARCHAR NOT NULL

description TEXT NULL

estimated_amount DECIMAL NOT NULL

actual_amount DECIMAL NULL

currency VARCHAR DEFAULT 'INR'

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Categories may include:

```text
TRANSPORT
HOTEL
FOOD
ACTIVITIES
LOCAL_TRAVEL
SHOPPING
EMERGENCY_BUFFER
OTHER
```

---

# 56. Destination Culture Table

## `destination_culture`

```text
id UUID PK

destination_id UUID FK
union_territory_id UUID FK

languages TEXT[]

greetings JSONB NULL

traditions TEXT NULL

etiquette TEXT NULL

dress_guidance TEXT NULL

religious_etiquette TEXT NULL

photography_guidance TEXT NULL

local_customs TEXT NULL

useful_phrases JSONB NULL

verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 57. Food Items Table

## `food_items`

```text
id UUID PK

union_territory_id UUID FK
destination_id UUID FK NULL

name VARCHAR NOT NULL

description TEXT NULL

category VARCHAR NULL

ingredients TEXT[] NULL

dietary_tags TEXT[]

cultural_significance TEXT NULL

verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 58. Transport Options Table

## `transport_options`

```text
id UUID PK

union_territory_id UUID FK NULL
destination_id UUID FK NULL

type VARCHAR NOT NULL

name VARCHAR NOT NULL

description TEXT NULL

provider_name VARCHAR NULL

phone VARCHAR NULL
website_url TEXT NULL

route_information JSONB NULL

price_information JSONB NULL

status CONTENT_STATUS
verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 59. Permits Table

## `permits`

Important for destinations requiring permits or special authorization.

```text
id UUID PK

union_territory_id UUID FK
destination_id UUID FK NULL

name VARCHAR NOT NULL

description TEXT

required BOOLEAN DEFAULT TRUE

eligibility TEXT NULL

application_url TEXT NULL

official_url TEXT NULL

estimated_fee DECIMAL NULL
currency VARCHAR DEFAULT 'INR'

processing_time TEXT NULL

documents_required TEXT[]

verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 60. Destination Rules Table

## `destination_rules`

```text
id UUID PK

destination_id UUID FK

title VARCHAR NOT NULL

description TEXT NOT NULL

category VARCHAR NULL

severity ALERT_SEVERITY DEFAULT INFO

official_url TEXT NULL

verification_status VERIFICATION_STATUS

created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 61. Indexing Strategy

Indexes are critical because this application will perform many search and geographic operations.

---

## 61.1 Union Territory Indexes

```text
union_territories(code)
union_territories(slug)
```

---

## 61.2 Destination Indexes

```text
destinations(slug)
destinations(union_territory_id)
destinations(region_id)
destinations(type)
destinations(status)
destinations(verification_status)
```

Geographic:

```text
GIST(destinations.location)
```

---

## 61.3 Attraction Indexes

```text
attractions(destination_id)
attractions(union_territory_id)
attractions(type)
attractions(status)
```

Geographic:

```text
GIST(attractions.location)
```

---

## 61.4 Emergency Indexes

```text
emergency_facilities(type)
emergency_facilities(union_territory_id)
emergency_facilities(destination_id)
```

Most important:

```text
GIST(emergency_facilities.location)
```

---

## 61.5 Festival Indexes

```text
festivals(union_territory_id)
festivals(destination_id)
festivals(start_date)
festivals(end_date)
festivals(category)
```

---

## 61.6 Itinerary Indexes

```text
itineraries(user_id)
itineraries(start_date)
itineraries(end_date)
itinerary_days(itinerary_id)
itinerary_items(itinerary_day_id)
```

---

## 61.7 Booking Indexes

```text
bookings(user_id)
bookings(itinerary_id)
bookings(provider_id)
bookings(status)
bookings(external_booking_id)
```

---

## 61.8 AI Indexes

```text
ai_conversations(user_id)
ai_messages(conversation_id)
knowledge_chunks(document_id)
```

Vector index:

```text
HNSW / IVFFlat
```

depending on final pgvector workload and deployment.

---

# 62. Geographic Data Rules

All coordinates should use:

```text
WGS 84
EPSG:4326
```

PostGIS geometry examples:

```text
GEOGRAPHY(POINT, 4326)
GEOGRAPHY(LINESTRING, 4326)
```

Geographic searches should prefer PostGIS distance operators rather than manually calculating distances in application code.

---

# 63. Nearest Emergency Query

Conceptually:

```sql
SELECT
    id,
    name,
    type,
    phone_numbers,
    ST_Distance(
        location,
        ST_SetSRID(
            ST_MakePoint(:longitude, :latitude),
            4326
        )::geography
    ) AS distance_meters
FROM emergency_facilities
WHERE is_active = true
ORDER BY location <-> ST_SetSRID(
    ST_MakePoint(:longitude, :latitude),
    4326
)::geography
LIMIT 5;
```

This powers the SOS and nearby emergency features.

---

# 64. Nearby Destination Query

The same geographic model can answer:

> Show attractions within 5 km.

```text
User Location
      ↓
PostGIS
      ↓
Distance Filter
      ↓
Ranking
      ↓
Nearby Attractions
```

---

# 65. Route Storage Rules

Route geometry should be stored only when there is a product reason to retain it.

Examples:

- saved itinerary route
- active trip
- generated route history
- route preview cache

Temporary route requests may remain cached rather than permanently stored.

---

# 66. AI Vector Storage Strategy

RAG content should be represented as:

```text
Knowledge Document
       ↓
Chunking
       ↓
Knowledge Chunks
       ↓
Embedding
       ↓
pgvector
```

Metadata should include information such as:

```json
{
  "union_territory": "LADAKH",
  "destination": "Pangong Lake",
  "content_type": "travel_advisory",
  "language": "en",
  "verification_status": "VERIFIED"
}
```

---

# 67. RAG Retrieval Strategy

The AI retrieval system should combine:

```text
Vector Similarity
+
Keyword Matching
+
Metadata Filtering
+
Verification Priority
+
Freshness
```

Conceptually:

```text
User Question
      ↓
Semantic Search
      +
Keyword Search
      +
UT / Destination Filter
      ↓
Ranking
      ↓
Verified Context
      ↓
Yatra AI
```

---

# 68. Data Freshness

Different entities require different freshness strategies.

### Real-time / short cache

- weather
- active alerts
- live location
- availability

### Frequent updates

- transport
- festivals
- road conditions
- advisories

### Stable content

- history
- culture
- destination descriptions
- heritage information

The database should therefore store timestamps and source information.

---

# 69. Data Verification Model

Critical records should follow:

```text
Data Created
     ↓
Source Attached
     ↓
Validation
     ↓
Verification
     ↓
Published
```

Records without verification may remain:

```text
DRAFT
```

or:

```text
PENDING_REVIEW
```

depending on the content type.

---

# 70. Foreign Key Strategy

Core foreign keys should generally use:

```text
ON DELETE RESTRICT
```

for important canonical data.

Example:

A Union Territory should not be deleted if destinations depend on it.

For user-owned temporary data, cascading deletion can be considered.

Example:

```text
User
 ↓
Itinerary
 ↓
Itinerary Days
 ↓
Itinerary Items
```

---

# 71. Data Integrity Constraints

Examples:

### Rating

```text
1 <= rating <= 5
```

### Traveller count

```text
traveller_count >= 1
```

### Duration

```text
duration_days >= 1
```

### Budget

```text
budget >= 0
```

### Latitude

```text
-90 <= latitude <= 90
```

### Longitude

```text
-180 <= longitude <= 180
```

---

# 72. Polymorphic Entity Considerations

Some entities such as:

```text
media
verification_records
content_versions
```

refer to different entity types.

These can use:

```text
entity_type
entity_id
```

with application-level validation.

For highly critical relational data, prefer explicit foreign keys rather than polymorphic references.

---

# 73. Soft Delete Strategy

Soft deletion should be used for:

- destinations
- attractions
- hotels
- restaurants
- experiences
- user accounts

Example:

```text
deleted_at IS NULL
```

Historical bookings and audit records should generally not be physically deleted.

---

# 74. Auditability

Important actions should be auditable.

Examples:

- booking state changes
- AI tool execution
- admin content changes
- safety data updates
- verification changes

Relevant audit tables:

```text
booking_events
ai_tool_executions
content_versions
verification_records
```

---

# 75. Privacy-Sensitive Data

The following require stricter retention/access policies:

- user location
- emergency contacts
- travel documents
- booking information
- payment-related metadata
- AI conversations where they contain personal information

The database should separate public tourism content from private user data logically and through authorization.

---

# 76. Public vs Private Data

### Public

```text
Union Territories
Destinations
Attractions
Festivals
Public emergency facilities
Public advisories
Culture
Food
```

### Private

```text
Users
Itineraries
Bookings
Emergency contacts
AI conversations
Live location
Yatra share sessions
Travel documents
```

The API layer must enforce access boundaries.

---

# 77. Booking Data Rule

Provider-specific data should be stored in:

```text
metadata JSONB
provider_response JSONB
```

while important searchable fields remain normalized.

This avoids making the schema provider-specific.

---

# 78. AI Data Rule

AI-generated content should never automatically become authoritative tourism data.

The system should distinguish:

```text
SOURCE_DATA
STRUCTURED_VERIFIED_DATA
AI_GENERATED_CONTENT
AI_RECOMMENDATION
```

This is particularly important for safety and regulatory information.

---

# 79. Recommended Schema Modules

The database should be organized logically in the codebase:

```text
database/
│
├── geography/
├── tourism/
├── travel/
├── booking/
├── safety/
├── users/
├── ai/
├── content/
└── audit/
```

---

# 80. Prisma Model Organization

Although Prisma may use one schema file depending on project setup, the logical models should be grouped:

```text
// Geography
UnionTerritory
Region

// Tourism
Destination
Attraction
Experience
Hotel
Restaurant
Festival
Event

// Travel
Itinerary
ItineraryDay
ItineraryItem
ItineraryTransport
Route

// Booking
BookingProvider
BookableListing
BookingAvailability
Booking
BookingEvent

// Safety
EmergencyFacility
EmergencyContact
TravelAdvisory
SafetyAlert

// AI
AIConversation
AIMessage
AIToolExecution
KnowledgeDocument
KnowledgeChunk
AICitation

// Users
User
UserPreference
SavedPlace
Review
UserEmergencyContact

// Content
Media
DataSource
VerificationRecord
ContentVersion
```

---

# 81. Core Relationship Map

```text
Union Territory
│
├── Regions
│
├── Destinations
│   │
│   ├── Attractions
│   ├── Experiences
│   ├── Hotels
│   ├── Restaurants
│   ├── Festivals
│   ├── Events
│   ├── Culture
│   ├── Food
│   └── Advisories
│
├── Emergency Facilities
├── Emergency Contacts
├── Festivals
├── Events
├── Weather
└── Safety Alerts
```

---

# 82. User Relationship Map

```text
User
│
├── Preferences
├── Saved Places
├── Reviews
├── Emergency Contacts
│
├── Itineraries
│   ├── Days
│   │   └── Items
│   ├── Routes
│   ├── Budget
│   ├── Packing List
│   └── Bookings
│
├── AI Conversations
│   └── Messages
│       └── Tool Executions
│
└── Yatra Share Sessions
```

---

# 83. AI Knowledge Relationship Map

```text
Data Source
     │
     ▼
Knowledge Document
     │
     ├── Knowledge Chunks
     │        │
     │        └── Embeddings
     │
     └── Verification
              │
              ▼
          Yatra AI
```

---

# 84. Booking Relationship Map

```text
Booking Provider
      │
      ▼
Bookable Listing
      │
      ▼
Availability
      │
      ▼
Booking
      │
      ├── User
      ├── Itinerary
      └── Booking Events
```

---

# 85. Safety Relationship Map

```text
Union Territory
      │
      ├── Emergency Facilities
      ├── Emergency Contacts
      ├── Travel Advisories
      └── Safety Alerts
                │
                ▼
             Safety API
                │
                ▼
              SOS
```

---

# 86. Initial Data Seed Requirements

Before frontend implementation, seed data should include all 8 Union Territories.

At minimum:

```text
8 Union Territories
Major destinations
Major attractions
Major experiences
Important festivals
Emergency facilities
Official emergency contacts
Core travel advisories
Basic culture data
Basic food data
Data source references
```

The exact research depth will be defined in Phase 5.

---

# 87. Database Migration Strategy

All schema changes should be managed through migrations.

Never modify production schema manually without recording the migration.

Development flow:

```text
Schema Change
     ↓
Migration
     ↓
Local Test
     ↓
Staging
     ↓
Production
```

---

# 88. Seed Strategy

Create separate seeds for:

```text
Base Enums
8 Union Territories
Core Geography
Tourism Content
Emergency Data
Festival Data
Demo Users
Demo Itineraries
```

Demo data should be clearly marked and should never be confused with verified production data.

---

# 89. Development Database

Recommended local environment:

```text
PostgreSQL
PostGIS
pgvector
Redis
```

Docker Compose can provide a reproducible local environment.

---

# 90. Backup Strategy

Production database should have:

- automated backups
- point-in-time recovery where supported
- retention policy
- restoration testing

For SIH, the deployment can use a managed PostgreSQL provider with automated backups.

---

# 91. Performance Strategy

Use:

- appropriate B-tree indexes
- GIST spatial indexes
- vector indexes
- pagination
- query limits
- selective fields
- Redis caching
- database connection pooling

Avoid loading entire tourism datasets into a single API response.

---

# 92. Pagination

Public listing APIs should support:

```text
page
limit
cursor
```

Cursor-based pagination should be preferred for large or frequently changing datasets.

---

# 93. Search Optimization

Destination and attraction search should support:

```text
query
union_territory
region
type
rating
price
distance
date
```

This should be handled by indexed queries rather than retrieving everything and filtering in the frontend.

---

# 94. Database Security

Production database should:

- not be publicly exposed
- require encrypted connections
- use least-privilege credentials
- separate application and migration users where appropriate
- restrict administrative access
- rotate credentials
- maintain backups

---

# 95. Final Core Table Inventory

The Phase 3 schema currently defines the following major tables:

```text
1.  union_territories
2.  regions

3.  destinations
4.  attractions
5.  experiences
6.  hotels
7.  restaurants
8.  festivals
9.  events
10. travel_advisories
11. safety_alerts

12. emergency_facilities
13. emergency_contacts

14. weather_snapshots

15. routes
16. route_stops

17. users
18. user_preferences
19. saved_places
20. reviews

21. itineraries
22. itinerary_days
23. itinerary_items
24. itinerary_transports
25. itinerary_versions

26. booking_providers
27. bookable_listings
28. booking_availability
29. bookings
30. booking_events

31. ai_conversations
32. ai_messages
33. ai_tool_executions
34. knowledge_documents
35. knowledge_chunks
36. ai_citations

37. data_sources
38. verification_records
39. content_versions
40. media

41. user_emergency_contacts
42. yatra_share_sessions
43. live_location_events

44. packing_lists
45. packing_items

46. budget_plans
47. budget_items

48. destination_culture
49. food_items
50. transport_options
51. permits
52. destination_rules
```

---

# 96. Final Architecture

The complete database foundation becomes:

```text
                         POSTGRESQL
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    TOURISM                TRAVEL                SAFETY
        │                     │                     │
        ├── UTs               ├── Itineraries       ├── Emergency
        ├── Destinations      ├── Routes            ├── Advisories
        ├── Attractions       ├── Days              ├── Alerts
        ├── Experiences       ├── Items             └── Contacts
        ├── Hotels            └── Budgets
        ├── Restaurants
        ├── Festivals
        └── Events

        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
     BOOKING                 USERS                  AI
        │                     │                     │
        ├── Providers         ├── Profiles          ├── Conversations
        ├── Listings          ├── Preferences       ├── Messages
        ├── Availability      ├── Saved Places      ├── Tool Calls
        └── Bookings          ├── Reviews           ├── Documents
                              └── Contacts          └── Chunks
                                                        │
                                                        ▼
                                                    pgvector

                         POSTGIS
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
         Locations        Routes       Emergency
         Destinations                  Facilities
```

---

# 97. Phase 3 Architecture Decision Summary

| Area | Decision |
|---|---|
| Primary Database | PostgreSQL |
| Geospatial | PostGIS |
| Vector Search | pgvector |
| Primary Keys | UUID |
| ORM | Prisma |
| Public Content | Structured relational data |
| Geographic Coordinates | EPSG:4326 |
| Geographic Index | GIST |
| AI Knowledge | Documents + chunks + embeddings |
| Booking | Provider-independent schema |
| Safety | Dedicated emergency/safety entities |
| Verification | Source + verification records |
| Content History | Content versions |
| Media | Object storage + metadata table |
| Cache | Redis |
| Soft Delete | Selected entities |
| Auditability | Dedicated event/version tables |
| Schema Evolution | Migration-based |
| Local Development | Docker Compose |
| Future Expansion | State-ready architecture |

---

# 98. Critical Database Decision

The most important decision in Phase 3 is:

## **The database is the source of structured truth; AI is not the source of truth.**

The correct flow is:

```text
Official / Verified Information
             ↓
        Database
             ↓
       Application
             ↓
          Yatra AI
             ↓
       User Experience
```

Not:

```text
AI
 ↓
Database
```

AI-generated recommendations can be stored separately, but verified tourism, safety, regulatory and emergency information must retain its source and verification status.

---

# 99. Phase 3 → Phase 4

With the database architecture established, the next phase should be:

# **Phase 4 — API Specification**

We will define:

- every REST endpoint
- HTTP methods
- request parameters
- request bodies
- response structures
- validation rules
- authentication requirements
- authorization rules
- pagination
- filtering
- sorting
- error responses
- rate limits
- AI endpoints
- itinerary endpoints
- map endpoints
- booking endpoints
- emergency endpoints
- weather endpoints
- festival endpoints
- admin endpoints

The API specification will become the contract between the **Next.js frontend, NestJS backend, database, AI system, maps, booking providers, and external data providers.**

---

# Phase 3 Status

**Database Schema v1.0 is now defined.**

This document is the **Phase 3 database source of truth** for Bharat Safe Yatra and will guide Prisma models, migrations, seed data, API implementation, AI/RAG storage, geographic functionality, itinerary management, booking integration, safety systems, and the subsequent Phase 4 API specification.
