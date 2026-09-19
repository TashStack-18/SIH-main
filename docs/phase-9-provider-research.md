# 🇮🇳 BHARAT SAFE YATRA
## Phase 9A — Real-World API & Provider Research Document
### SIH 2026

**Document Version:** 1.0  
**Phase:** 9A (API & Provider Research & Selection)  
**Scope:** India's 8 Union Territories (*Andaman & Nicobar Islands, Chandigarh, Dadra & Nagar Haveli and Daman & Diu, Delhi, Jammu & Kashmir, Ladakh, Lakshadweep, Puducherry*)  
**Architecture Alignment:** Aligned with Phase 1 PRD v2.0, Phase 2 Technical Architecture, Phase 3 Database Schema v2.0, Phase 4 API Spec v1.0, Phase 5 Verified Tourism Data, Phase 6 UI/UX, Phase 7 Frontend, and Phase 8 Backend.

---

# 1. Research Methodology & Governance

### Core Principles
1. **Zero Fabrication:** No API capability is assumed without verification against official developer portals, published OpenAPI schemas, or authoritative government documentation.
2. **Geographic Grounding:** Every provider is evaluated specifically against the unique terrain, connectivity constraints, and regulatory parameters of India's 8 Union Territories (e.g., high-altitude Trans-Himalayas in Ladakh, maritime coral atolls in Lakshadweep, tropical archipelago in Andaman, dense metropolitan NCR in Delhi).
3. **Information vs. Booking Distinction:** Clear boundaries are maintained between read-only discovery APIs (pricing, schedules, catalogs) and transactional reservation APIs (GDS issuance, PNR creation, payment gateway settlement).
4. **Authoritative Safety Precedence:** Emergency, healthcare, disaster warning, and permit data prioritize official Government of India (GoI) feeds and statutory bodies over commercial aggregators.
5. **Architectural Isolation:** Third-party APIs are never consumed directly by the client browser; all calls route through the NestJS/Next.js backend adapter layer (`/api/v1/*`) to enforce rate limiting, secret isolation, caching, and deterministic fallbacks.

---

# 2. Domain-by-Domain Provider Evaluations

---

## 2.1 Maps, GIS & 3D Terrain

### Candidate 1: Mapbox
* **Official Website:** [https://www.mapbox.com](https://www.mapbox.com)
* **Developer Documentation:** [https://docs.mapbox.com](https://docs.mapbox.com)
* **API Category:** Geospatial Vector Maps, 3D Elevation, Directions, Geocoding
* **Capabilities:**
  * Mapbox GL JS v3 (WebGL/WebGPU vector rendering with 3D globe and terrain projection)
  * Mapbox Terrain-RGB (raster DEM global elevation tiles down to 0.1m precision)
  * Mapbox Directions API v5 (multi-modal turn-by-turn routing with polyline6 geometry)
  * Mapbox Geocoding API v6 (forward/reverse search with administrative boundary filtering)
  * Mapbox Matrix API (distance and duration matrices up to 25x25 coordinates)
* **India & 8-UT Coverage:** High. Full coverage of all 8 UTs including high-altitude passes in Ladakh (Khardung La, Chang La) and island road networks in Port Blair and Kavaratti.
* **Authentication:** Secret access token (`sk.ey...`) for backend API; public token (`pk.ey...`) with URL domain whitelisting for client WebGL renderer.
* **Rate Limits:** 300 requests/minute for Directions; 600 requests/minute for Geocoding on standard tiers.
* **Pricing & Free Tier:** Freemium. 50,000 monthly map loads free; 100,000 geocoding requests free; $0.50 per 1,000 requests thereafter.
* **Commercial / SIH Suitability:** Outstanding. Production-ready, generous free tier covers full hackathon demonstration and pilot deployment.
* **Recommendation:** **PRIMARY PROVIDER for Interactive 3D Maps, Vector Tiles, and Dynamic Route Engine.**

---

### Candidate 2: Google Maps Platform
* **Official Website:** [https://mapsplatform.google.com](https://mapsplatform.google.com)
* **Developer Documentation:** [https://developers.google.com/maps/documentation](https://developers.google.com/maps/documentation)
* **API Category:** Web Mapping, Routes API, Places API, Geocoding
* **Capabilities:** Maps JavaScript API, Routes API (Directions/Distance Matrix), Places API (New), Geocoding API, Photorealistic 3D Tiles.
* **India & 8-UT Coverage:** Industry gold standard for urban POI density (Delhi, Chandigarh, Puducherry).
* **Authentication:** API Key with HTTP referrer and IP restrictions.
* **Rate Limits:** Up to 3,000 QPM default.
* **Pricing & Free Tier:** $200 recurring monthly credit (~28,000 map loads or ~40,000 directions). Requires linked credit card upon registration.
* **Commercial Restrictions:** Strict caching limitations (storing coordinates for >30 days prohibited under Section 3.2.3 of Terms).
* **Recommendation:** **SECONDARY / ALTERNATIVE PROVIDER for urban POI enrichment and high-accuracy landmark search.**

---

### Candidate 3: MapTiler
* **Official Website:** [https://www.maptiler.com](https://www.maptiler.com)
* **Developer Documentation:** [https://docs.maptiler.com](https://docs.maptiler.com)
* **API Category:** OpenMapTiles Vector Hosting, Global 3D Terrain, Geocoding
* **Capabilities:** MapTiler SDK (MapLibre fork), 3D Terrain RGB, custom hillshading styles, offline vector packaging.
* **India & 8-UT Coverage:** Good base map coverage; POI metadata in remote island UTs (Lakshadweep, Nicobar) is noticeably sparser than Mapbox/Google.
* **Pricing & Free Tier:** 100,000 requests/month on Free tier (non-commercial only; commercial plans start at $25/month).
* **Recommendation:** **TERTIARY FALLBACK for MapLibre open-source rendering pipelines.**

---

### Candidate 4: OpenStreetMap (OSM) / OSRM (Self-Hosted)
* **Official Website:** [https://www.openstreetmap.org](https://www.openstreetmap.org) / [http://project-osrm.org](http://project-osrm.org)
* **Developer Documentation:** [https://wiki.openstreetmap.org/wiki/API](https://wiki.openstreetmap.org/wiki/API)
* **API Category:** Open Geospatial Data & Routing Engine
* **Capabilities:** Unrestricted topological road data, custom offline routing graphs, zero API fee.
* **India & 8-UT Coverage:** Variable. Dense in Delhi and Chandigarh; sparse road attribute tagging in rural DNH and remote Ladakh mountain tracks.
* **Rate Limits:** Public OSM tile servers enforce strict limits (no bulk fetching, max 1 req/sec). Self-hosted OSRM container eliminates rate limits.
* **Recommendation:** **ARCHITECTURAL FOUNDATION for PostGIS database spatial queries and offline/edge routing fallbacks.**

---

## 2.2 Weather & Climate Intelligence

### Candidate 1: OpenWeather (OpenWeatherMap)
* **Official Website:** [https://openweathermap.org](https://openweathermap.org)
* **Developer Documentation:** [https://openweathermap.org/api](https://openweathermap.org/api)
* **API Category:** Real-Time Weather, Forecast, Air Quality, Marine
* **Capabilities:**
  * One Call API 3.0 (Current weather, minute forecast for 1 hr, hourly forecast for 48 hrs, daily forecast for 8 days, national severe weather alerts)
  * Air Pollution API (AQI, PM2.5, PM10, CO, NO2, SO2, O3 - critical for Delhi NCR & industrial UTs)
  * Geocoding & Historical climate aggregation
* **India & 8-UT Coverage:** Full coverage across all 8 UT coordinates with reliable altitude scaling for Leh (3,524m) and Kargil (2,676m).
* **Authentication:** API Key passed via query parameter `appid`.
* **Rate Limits:** 60 calls/minute on free tier; 1,000 calls/day free for One Call 3.0.
* **Pricing & Free Tier:** First 1,000 One Call 3.0 calls per day are 100% free; $0.0015 per call thereafter.
* **Live Data Classification:** REAL-TIME (refreshed every 10 minutes).
* **Recommendation:** **PRIMARY WEATHER PROVIDER for live conditions, forecasts, and Air Quality Index.**

---

### Candidate 2: WeatherAPI.com
* **Official Website:** [https://www.weatherapi.com](https://www.weatherapi.com)
* **Developer Documentation:** [https://www.weatherapi.com/docs](https://www.weatherapi.com/docs)
* **API Category:** Current, 14-Day Forecast, Marine Weather, Weather Alerts
* **Capabilities:** Real-time weather, marine swell/wave height (crucial for Andaman & Lakshadweep ferry safety), astronomy data (sunrise/sunset, moon phases for dark-sky star observation).
* **India & 8-UT Coverage:** Comprehensive across all Indian latitudes and offshore marine bounding boxes.
* **Rate Limits:** 1,000,000 calls/month on Free tier.
* **Pricing & Free Tier:** Freemium. Free plan includes 3-day forecast and marine data with attribution.
* **Recommendation:** **SECONDARY PROVIDER & PRIMARY for Maritime Marine Forecasts (swell & surf conditions for island UTs).**

---

### Candidate 3: India Meteorological Department (IMD) / Mausam Feeds
* **Official Website:** [https://mausam.imd.gov.in](https://mausam.imd.gov.in)
* **API Category:** Statutory National Severe Weather Warnings & Cyclone Alerts
* **Capabilities:** Official district-level orange/red cyclone and heavy snowfall warnings, CAP RSS XML feeds.
* **India & 8-UT Coverage:** Authoritative statutory mandate for all Indian territory.
* **Access Model:** Open Government Data (OGD) RSS/XML feeds and CAP alert endpoints (no proprietary key required).
* **Recommendation:** **STATUTORY AUTHORITY for Severe Weather & Cyclone Warnings.**

---

## 2.3 Accommodation & Hotel Intelligence

### Candidate 1: Amadeus for Developers (Self-Service)
* **Official Website:** [https://developers.amadeus.com](https://developers.amadeus.com)
* **Developer Documentation:** [https://developers.amadeus.com/self-service/category/hotels](https://developers.amadeus.com/self-service/category/hotels)
* **API Category:** Hotel Search, Real-Time Rates, Hotel Offer Details
* **Capabilities:**
  * Hotel List API (Find properties by city code e.g. `DEL`, `IXZ`, `IXL`, `SXR`)
  * Hotel Search API v3 (Search real-time room availability, pricing, room categories)
  * Hotel Ratings & Sentiments API
* **India & 8-UT Coverage:** Excellent commercial hotel inventory in Delhi, Srinagar, Leh, Port Blair, Chandigarh, Puducherry; moderate in Daman/Diu; low in rural Lakshadweep (where properties are government-operated).
* **Authentication:** OAuth2 Client Credentials grant (Bearer JWT with 30-minute expiry).
* **Rate Limits:** 10 transactions/second in Self-Service Test environment.
* **Pricing & Free Tier:** Free monthly quota of 2,000 requests in Test/Production sandbox; €0.02 to €0.04 per call beyond quota.
* **Booking Capability:** SEARCH & AVAILABILITY (Booking API requires commercial accreditation).
* **Recommendation:** **PRIMARY COMMERCIAL ACCOMMODATION DISCOVERY API.**

---

### Candidate 2: Official Government Tourism Stays & Corporations
* **Key Portals:**
  * JKTDC (Jammu & Kashmir Tourism Development Corporation) — `jktdc.co.in`
  * DTTDC (Delhi Tourism & Transportation Development Corporation) — `delhitourism.gov.in`
  * ANIIDCO / APWD Guest Houses (Andaman) — `aniidco.andaman.gov.in`
  * SPORTS (Society for Promotion of Nature Tourism & Sports, Lakshadweep) — `lakshadweeptourism.com`
  * PTDC (Puducherry Tourism Development Corporation) — `pondytourism.in`
  * CITCO (Chandigarh Industrial & Tourism Development Corporation) — `citcochandigarh.com`
* **API Status:** **NO PUBLIC REST API AVAILABLE.**
* **Integration Architecture:** Adapter Pattern with structured local database caching + deep-linking to official booking engines with cryptographic referral metadata.
* **Recommendation:** **PRIMARY OFFICIAL GOVT ACCOMMODATION DATA SOURCE via Ingestion & Deep-Link Adapters.**

---

### Candidate 3: Expedia Partner Solutions (EPS) Rapid API v3
* **Official Website:** [https://developer.expediapartnersolutions.com](https://developer.expediapartnersolutions.com)
* **API Category:** Global Enterprise Hotel Distribution & Instant Booking
* **Capabilities:** 700,000+ properties, real-time rates, room inventory, cancellation policies, direct payment settlement.
* **Access Model:** Restricted B2B Enterprise API. Requires formal commercial contract, enterprise KYC, and minimum annual booking commitments.
* **Recommendation:** **AVOID FOR INITIAL PILOT / SIH (Too high barrier to entry; Amadeus covers requirements without enterprise contract).**

---

### Candidate 4: Hotelbeds (APItude)
* **Official Website:** [https://developer.hotelbeds.com](https://developer.hotelbeds.com)
* **API Category:** B2B Bedbank API
* **Access Model:** Requires business entity registration, IATA/TIDS verification, and commercial deposit.
* **Recommendation:** **AVOID FOR SIH (Enterprise B2B wholesaler only).**

---

## 2.4 Flights & Aviation Intelligence

### Candidate 1: Amadeus for Developers (Flight Search & Schedules)
* **Official Website:** [https://developers.amadeus.com](https://developers.amadeus.com)
* **Developer Documentation:** [https://developers.amadeus.com/self-service/category/flights](https://developers.amadeus.com/self-service/category/flights)
* **API Category:** Flight Offers Search, Inspiration Search, Flight Schedules, Airport Details
* **Capabilities:**
  * Flight Offers Search v2 (Real-time fare search across domestic Indian carriers including Air India, IndiGo, SpiceJet, Vistara)
  * Flight Delay Prediction API
  * Airport On-Time Performance API
  * Airport & City Search API (IATA codes: `DEL`, `IXL` Leh, `IXZ` Port Blair, `SXR` Srinagar, `IXC` Chandigarh, `AGX` Agatti)
* **India & 8-UT Coverage:** 100% coverage of all commercial airports serving the 8 Union Territories.
* **Authentication:** OAuth2 Client Credentials.
* **Rate Limits:** 10 req/sec in sandbox; free tier of 2,000 monthly searches.
* **Booking Capability:** SEARCH, PRICING & FARE RULES (Actual e-ticket issuance requires IATA accreditation).
* **Recommendation:** **PRIMARY FLIGHT SEARCH & INTELLIGENCE API.**

---

### Candidate 2: Aviationstack API
* **Official Website:** [https://aviationstack.com](https://aviationstack.com)
* **Developer Documentation:** [https://aviationstack.com/documentation](https://aviationstack.com/documentation)
* **API Category:** Real-Time Flight Tracking & Airline Timetables
* **Capabilities:** Global flight status, historical flight logs, airline routes, IATA/ICAO airport directory.
* **India Coverage:** Covers major domestic flights; real-time radar tracking for remote high-altitude routes (e.g. Delhi to Leh) can experience latency.
* **Pricing & Free Tier:** Free tier provides 100 requests/month (HTTP only, no HTTPS on free plan).
* **Security Limitation:** Lack of HTTPS on free tier prevents direct secure browser communication.
* **Recommendation:** **SECONDARY FLIGHT STATUS MONITORING ONLY (Routed through backend adapter).**

---

### Candidate 3: FlightAware AeroAPI
* **Official Website:** [https://www.flightaware.com/commercial/aeroapi](https://www.flightaware.com/commercial/aeroapi)
* **API Category:** Real-time Flight Tracking, ADS-B Radar Telemetry, Push Alerts
* **Capabilities:** High-fidelity live aircraft position tracking, flight maps, airport delay telemetry.
* **Pricing:** Pay-as-you-go starting at $0.005 per query with $5/month minimum.
* **Recommendation:** **SPECIALIZED PROVIDER for Live Flight Tracking & Radar Visualizations.**

---

## 2.5 Ferry, Maritime & Island Transport (A&N and Lakshadweep)

### Authoritative Portals & Operators:
1. **Directorate of Shipping Services (DSS), Andaman & Nicobar Administration:**
   * Official Portal: `https://dss.andaman.gov.in` / `https://stars.andaman.gov.in` (STARS eTicketing)
   * Sector Routes: Port Blair ↔ Havelock (Swaraj Dweep), Neil (Shaheed Dweep), Rangat, Diglipur, Hut Bay (Little Andaman), Car Nicobar, Campbell Bay.
2. **Lakshadweep Administration & SPORTS:**
   * Official Portal: `https://epermit.utl.gov.in` / `http://lakport.nic.in`
   * Sector Routes: Kochi ↔ Kavaratti, Agatti, Bangaram, Kadmat, Minicoy, Kalpeni, Amini, Andrott.
   * Vessels: MV Kavaratti, MV Arabian Sea, MV Lakshadweep Sea, MV Corals, MV Amindivi.
3. **Private Catamaran Ferry Operators (Andaman):**
   * Makruzz (`makruzz.com`), Nautika / Sealink (`gonautika.com`), Green Ocean (`greenoceanferry.com`).

* **API Status:** **NO PUBLIC OPEN REST API EXISTS ACROSS GOVERNMENT OR PRIVATE OPERATORS.**
* **Architectural Strategy:**
  * Pre-compiled structured database tables (`routes`, `schedules`, `vessels`, `fares`, `boarding_points`) verified against official administrative gazettes.
  * Deep-Link Generator with cryptographic referral tokens pointing to official ticketing gateways (STARS / ePermit / Makruzz).
  * Real-time weather-linked operational status via Port Management Board (PMB) advisories.
* **Recommendation:** **MANDATORY STRUCTURED INGESTION & DEEP-LINK ADAPTER PATTERN.**

---

## 2.6 Train & Ground Public Transport

### Candidate 1: Indian Railways / IRCTC / CRIS
* **Authority:** Centre for Railway Information Systems (CRIS) & IRCTC.
* **Regulatory & Legal Status:**
  * Direct IRCTC APIs are strictly proprietary and restricted to approved Principal Service Providers (PSPs) under commercial licensing agreements with multi-lakh security deposits.
  * **UNAUTHORIZED SCRAPING IS ILLEGAL** under the Information Technology Act (Sections 43, 66) and violates Indian Railways terms of service.
* **Ground Reality for 8 UTs:**
  * **Rail-Connected UTs:** Delhi (NDLS, DLI, NZM, ANVT), Chandigarh (CDG), Jammu & Kashmir (JAT, UHP, SVDK, and Udhampur-Srinagar-Baramulla Rail Link USBRL / Banihal-Sangaldan-Srinagar-Baramulla sections), Puducherry (PDY).
  * **Non-Rail UTs:** Andaman & Nicobar (Archipelago), Lakshadweep (Archipelago), Ladakh (High Altitude Cold Desert), Dadra & Nagar Haveli and Daman & Diu (Daman served by nearby Vapi GJN; Diu served by Delvada/Veraval).
* **Recommendation:**
  * Provide verified train connectivity schedules, station guides, and route maps for the 4 rail-connected UTs.
  * Provide deep-links to official IRCTC portal (`irctc.co.in`) and National Train Enquiry System (`enquiry.indianrail.gov.in`).
  * **STRICT PROHIBITION against unauthorized scraping.**

---

### Candidate 2: Open Transit Data (GTFS) & State Road Transport (SRTC)
* **Delhi Open Transit Data (OTD):** `https://otd.delhi.gov.in` (Official GTFS static and real-time transit feeds for DTC buses and Delhi Metro DMRC).
* **Chandigarh CTU:** Chandigarh Transport Undertaking GTFS feeds under Smart Cities Mission.
* **JKSRTC:** Jammu & Kashmir State Road Transport Corporation inter-district bus timetables.
* **Recommendation:** **INGEST OFFICIAL GTFS FEEDS for Delhi & Chandigarh public transit.**

---

## 2.7 Emergency Services, Life Safety & Healthcare

### Candidate 1: Emergency Response Support System (ERSS 112)
* **Authority:** Ministry of Home Affairs (MHA), Government of India.
* **Official Website:** [https://112.gov.in](https://112.gov.in)
* **Capabilities:** Single unified emergency number (112) integrating Police (100), Fire (101), Ambulance (102/108), and Women Helpline (1090) across all 36 States & UTs.
* **Integration Strategy:** Instant click-to-dispatch `tel:112` triggers, GPS location sharing payload generators, and direct integration with UT-specific police/control room dispatch desks.
* **Recommendation:** **PRIMARY ALL-INDIA EMERGENCY RESPONSE DISPATCH PROTOCOL.**

---

### Candidate 2: Ayushman Bharat Digital Mission (ABDM) — National Health Facility Registry (HFR)
* **Authority:** National Health Authority (NHA), Ministry of Health & Family Welfare.
* **Official Website:** [https://hfr.abdm.gov.in](https://hfr.abdm.gov.in) / [https://sandbox.abdm.gov.in](https://sandbox.abdm.gov.in)
* **Capabilities:** Authoritative government database and REST API containing verified hospitals, trauma centers, ICU capacity, blood banks, and verified geo-coordinates.
* **India & 8-UT Coverage:** 100% verified coverage of all apex government and registered private medical institutions across all 8 UTs (e.g. SNM Hospital Leh, AIIMS New Delhi, PGIMER Chandigarh, SMHS/SKIMS Srinagar, G.B. Pant Hospital Port Blair, IGGGH&PGI Puducherry).
* **Recommendation:** **AUTHORITATIVE GOVERNMENT HEALTHCARE REGISTRY PROVIDER.**

---

### Candidate 3: Indian Coast Guard (ICG) Maritime Rescue Coordination Centres (MRCC)
* **Authority:** Indian Coast Guard, Ministry of Defence.
* **Statutory Operational Centres:**
  * MRCC Port Blair: +91-3192-245530 / Toll-Free 1554 (covers Andaman & Nicobar EEZ)
  * MRCC Mumbai / MRCC Kochi: +91-484-2216444 (covers Lakshadweep Sea & Arabian Sea)
  * MRCC Chennai: +91-44-23460405 (covers Puducherry Coromandel Coast)
* **Recommendation:** **AUTHORITATIVE MARITIME DISTRESS & LIFE SAFETY SOURCE for Island/Coastal UTs.**

---

## 2.8 Geocoding & Address Resolution

### Candidate 1: Mapbox Geocoding API v6
* **Official Website:** [https://docs.mapbox.com/api/search/geocoding](https://docs.mapbox.com/api/search/geocoding)
* **Capabilities:** Forward geocoding, reverse geocoding, autocomplete, POI categorization, bounding-box geographic clamping (`bbox` parameter to India/UT bounds).
* **Accuracy:** High accuracy across Indian towns, tourist POIs, mountain passes, and coastal landmarks.
* **Pricing & Free Tier:** 100,000 requests/month free; $0.50/1,000 requests thereafter.
* **Recommendation:** **PRIMARY GEOCODING PROVIDER.**

---

### Candidate 2: Google Maps Geocoding & Places API (New)
* **Official Website:** [https://developers.google.com/maps/documentation/geocoding](https://developers.google.com/maps/documentation/geocoding)
* **Capabilities:** Exceptional granular address resolution in densely packed historic urban centers (Old Delhi, Puducherry French Quarter).
* **Pricing:** $5.00 per 1,000 requests (Geocoding); $17.00 per 1,000 requests (Places Text Search).
* **Recommendation:** **SECONDARY PROVIDER for complex unstructured urban address disambiguation.**

---

### Candidate 3: OpenStreetMap / Nominatim
* **Official Website:** [https://nominatim.org](https://nominatim.org)
* **Capabilities:** Open-source forward/reverse geocoding.
* **Limitation:** Public server has strict 1 request/second limit and prohibits heavy production application traffic without self-hosting.
* **Recommendation:** **DEVELOPMENT / OFFLINE FALLBACK ONLY.**

---

## 2.9 Cultural Festivals & Tourism Events

### Candidate 1: Ministry of Tourism — Utsav Portal & UT Tourism Departments
* **Official Portals:**
  * Ministry of Tourism Utsav Portal: `https://utsav.gov.in`
  * UT Tourism Event Calendars: Ladakh Tourism, JKTDC, Delhi Tourism, Andaman Tourism, Puducherry Tourism, Chandigarh Tourism, DNH&DD Tourism, Lakshadweep Administration.
* **Ground Reality:** International event APIs (Eventbrite, Ticketmaster, PredictHQ) have zero reliability for traditional lunar-based monastic ceremonies (e.g. Hemis Tsechu, Losar, Dosmoche, Karsha Gustor) or regional island festivals.
* **Integration Strategy:** Ingestion of statutory festival calendars with explicit **Date Precision Tags** (`EXACT_CONFIRMED`, `TENTATIVE_SEASONAL`, `LUNAR_CALCULATED`) to prevent hallucination.
* **Recommendation:** **STATUTORY GOVERNMENT CALENDAR INGESTION WITH ZERO-FABRICATION PROTOCOL.**

---

## 2.10 Safety Alerts, Pass Closures & Disaster Feeds

### Candidate 1: NDMA SACHET (National Disaster Alert Platform)
* **Authority:** National Disaster Management Authority (NDMA), Government of India.
* **Official Portal:** [https://sachet.ndma.gov.in](https://sachet.ndma.gov.in)
* **Protocol:** OASIS Common Alerting Protocol (CAP v1.2 XML/JSON feeds).
* **Capabilities:** Geo-targeted disaster alerts for cyclones, landslides, flash floods, avalanches, heavy precipitation across all Indian districts.
* **Access Model:** Public CAP Alert feeds.
* **Recommendation:** **PRIMARY DISASTER ALERT & EMERGENCY WARNING FEED.**

---

### Candidate 2: Border Roads Organisation (BRO) & Traffic Control Units (TCU)
* **Authority:** Border Roads Organisation (Projects HIMANK & VIJAYAK) & UT Police Traffic Wings.
* **Key High-Altitude Mountain Passes:**
  * Zoji La (Srinagar ↔ Leh highway NH-1)
  * Khardung La (Leh ↔ Nubra Valley)
  * Chang La (Leh ↔ Pangong Tso)
  * Rohtang & Atal Tunnel / Shinku La (Manali ↔ Leh axis)
* **Data Ingestion:** Periodic administrative advisory scraping and direct verified bulletins from District Magistrate / Traffic Police Leh & Srinagar feeds.
* **Recommendation:** **AUTHORITATIVE SOURCE FOR HIGH-ALTITUDE ROAD & PASS STATUS.**

---

## 2.11 Currency Exchange (FX Rates)

### Candidate 1: ExchangeRate-API
* **Official Website:** [https://www.exchangerate-api.com](https://www.exchangerate-api.com)
* **Developer Documentation:** [https://www.exchangerate-api.com/docs/overview](https://www.exchangerate-api.com/docs/overview)
* **Capabilities:** Real-time and daily reference rates for 160+ currencies with INR base currency support.
* **Rate Limits & Pricing:** Free tier provides 1,500 API requests/month; ultra-fast CDN edge caching.
* **Reliability:** 99.99% uptime with ultra-light JSON payload.
* **Recommendation:** **PRIMARY CURRENCY CONVERSION API.**

---

### Candidate 2: Frankfurter API (Open Source ECB Data)
* **Official Website:** [https://www.frankfurter.app](https://www.frankfurter.app)
* **Capabilities:** Open-source, no API key required, tracks European Central Bank published reference rates.
* **Recommendation:** **ZERO-CONFIG SECONDARY FALLBACK.**

---

## 2.12 Translation & Multilingual Support

### Candidate 1: Bhashini (National Language Translation Mission, MeitY)
* **Authority:** Ministry of Electronics and Information Technology (MeitY), Government of India.
* **Official Portal:** [https://bhashini.gov.in](https://bhashini.gov.in) / [https://github.com/ULCA-IN/bhashini-api-docs](https://github.com/ULCA-IN/bhashini-api-docs)
* **Capabilities:** State-of-the-art neural translation models built specifically for 22 scheduled Indian languages (Hindi, Tamil, Kashmiri, Urdu, Bengali, Punjabi, Gujarati, Malayalam, Marathi, etc.).
* **Recommendation:** **PRIMARY SOVEREIGN TRANSLATION PROVIDER for Indian regional languages.**

---

### Candidate 2: Google Cloud Translation API (Advanced v3)
* **Official Website:** [https://cloud.google.com/translate](https://cloud.google.com/translate)
* **Capabilities:** High-throughput translation across 130+ global languages, custom glossaries for cultural tourism terms.
* **Pricing & Free Tier:** 500,000 characters/month free; $20 per 1M characters thereafter.
* **Recommendation:** **PRIMARY GLOBAL TRANSLATION API for international foreign languages (French, Spanish, German, Japanese).**

---

## 2.13 Authentication & Identity Management

### Candidate 1: Self-Hosted Native Web Crypto JWT + PBKDF2 / Argon2 (Current Phase 8 Architecture)
* **Architecture:** In-process / Redis-backed stateless JWT signing via Web Crypto API with salted PBKDF2 / Argon2 password hashing.
* **Capabilities:** Zero external latency, zero third-party dependency, zero per-user cost, full data sovereignty, compliant with Digital Personal Data Protection Act (DPDPA 2023).
* **SIH Suitability:** 100% self-contained and demo-reliable (works completely offline or in isolated environments).
* **Recommendation:** **PRIMARY AUTHENTICATION ENGINE.**

---

### Candidate 2: Supabase Auth (GoTrue)
* **Official Website:** [https://supabase.com/auth](https://supabase.com/auth)
* **Capabilities:** Open-source, PostgreSQL Row-Level Security (RLS) native integration, OAuth social logins (Google, Apple, Phone OTP).
* **Free Tier:** 50,000 monthly active users (MAU) free.
* **Recommendation:** **SECONDARY AUTH PROVIDER if OAuth social login expansion is activated.**

---

## 2.14 Payment Gateway & Transactions

### Candidate 1: Razorpay India
* **Official Website:** [https://razorpay.com](https://razorpay.com)
* **Developer Documentation:** [https://razorpay.com/docs/api](https://razorpay.com/docs/api)
* **Capabilities:**
  * Standard Payment Gateway (UPI DeepLink/Intent, Credit/Debit Cards, NetBanking across 50+ Indian banks, Wallets)
  * Razorpay Route & Smart Collect (Automated marketplace splits between platform and certified tourism operators)
  * Webhook architecture for idempotent payment confirmation and automatic refund processing
  * Full developer sandbox with comprehensive test card and UPI simulation suite
* **India & 8-UT Coverage:** Gold standard in India; compliant with RBI tokenization and data localization regulations.
* **Pricing:** Standard 2% per successful transaction; zero setup fee, zero annual maintenance fee.
* **Recommendation:** **PRIMARY DOMESTIC PAYMENT GATEWAY.**

---

### Candidate 2: Stripe India
* **Official Website:** [https://stripe.com/in](https://stripe.com/in)
* **Capabilities:** Industry-leading global credit card processing, 135+ currencies, Apple Pay, Google Pay.
* **Limitation in India:** Domestic UPI and recurring mandate support is less optimized than Razorpay due to RBI e-mandate regulatory constraints.
* **Recommendation:** **SPECIALIZED GATEWAY for International Tourist Inbound Card Transactions.**

---

# 3. Summary of Selected Provider Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   BHARAT SAFE YATRA INTEGRATION STACK                  │
├────────────────────────────────┬───────────────────────────────────────┤
│ Domain                         │ Primary Selected Provider             │
├────────────────────────────────┼───────────────────────────────────────┤
│ 1. Maps, 3D Terrain & Routing  │ Mapbox (Mapbox GL JS v3 + Directions) │
│ 2. Real-Time Weather & Air     │ OpenWeather (One Call 3.0 + Air)      │
│ 3. Commercial Hotels           │ Amadeus for Developers (Self-Service) │
│ 4. Government Tourism Stays    │ UT Tourism Corporations (Deep-Links)  │
│ 5. Flight Search & Status      │ Amadeus for Developers (Flight v2)    │
│ 6. Island Ferries (A&N / UTL)  │ DSS & SPORTS Verified Ingestion Engine│
│ 7. Ground Transit & Trains     │ Official GTFS + IRCTC Portal Link     │
│ 8. Life Safety & Emergency     │ ERSS 112 + ABDM HFR Hospital Registry │
│ 9. Geocoding & POI Search      │ Mapbox Geocoding v6                   │
│ 10. Cultural Festivals 2026    │ MoT Utsav Portal + UT Tourism Gazette │
│ 11. Travel Alerts & Hazards    │ NDMA SACHET (CAP Feeds) + BRO Bulletins│
│ 12. Currency Exchange (FX)     │ ExchangeRate-API                      │
│ 13. Multilingual Translation   │ Bhashini (Indic) + Google Cloud (Intl)│
│ 14. Identity & Authentication  │ Self-Hosted Web Crypto JWT (Phase 8)  │
│ 15. Payments & E-Commerce      │ Razorpay (Domestic UPI/Cards)         │
│ 16. Yatra AI RAG Grounding     │ OpenAI GPT-4o-mini + PostGIS pgvector │
└────────────────────────────────┴───────────────────────────────────────┘
```
