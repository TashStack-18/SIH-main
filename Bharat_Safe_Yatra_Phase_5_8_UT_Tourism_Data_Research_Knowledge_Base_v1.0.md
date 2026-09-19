# 🇮🇳 BHARAT SAFE YATRA
## Phase 5 — 8 Union Territory Tourism Data Research & Knowledge Base
### SIH 2026

**Research Version:** 1.0  
**Research Cut-off:** 26 August 2026  
**Scope:** India's 8 Union Territories  
**Data Policy:** Verified / source-backed information only  
**Primary Sources:** Union Territory Administrations, UT Tourism Departments, Government of India, Ministry of Tourism, National Government Services Portal, official government tourism corporations  
**Purpose:** Create the factual tourism knowledge base that will feed PostgreSQL, PostGIS, the REST API, maps, itinerary generation, bookings, safety features and Yatra AI.

---

# 0. IMPORTANT DATA INTEGRITY NOTICE

This document follows a strict rule:

> **No invented tourism data.**

If a field cannot be verified from an authoritative source, it is intentionally marked:

```text
NOT VERIFIED
```

or:

```text
NOT CURRENTLY PUBLISHED
```

rather than being filled with an estimate.

This is especially important for:

- emergency phone numbers
- hotel prices
- live availability
- festival dates
- road conditions
- permit requirements
- opening hours
- booking inventory
- weather
- route times
- safety advisories

Those values should be obtained through the appropriate live API or official source at runtime.

---

# 1. RESEARCH SOURCE HIERARCHY

Sources are ranked in the following order.

## Tier 1 — Primary Authority

```text
Union Territory Administration
UT Tourism Department
Official Government Department
Official Government Gazette
Official Government booking / permit portal
```

## Tier 2 — Central Government

```text
Ministry of Tourism
Incredible India
National Government Services Portal
India.gov.in
Ministry / statutory authority publications
```

## Tier 3 — Government-Owned Tourism Corporations

Examples:

```text
JKTDC
PTDC
```

## Tier 4 — Other authoritative institutional sources

Used only where primary government sources do not provide the required information.

---

# 2. THE 8 UNION TERRITORIES

The Bharat Safe Yatra Phase 5 dataset covers:

| Canonical ID | Union Territory |
|---|---|
| ANDAMAN_NICOBAR | Andaman & Nicobar Islands |
| CHANDIGARH | Chandigarh |
| DNH_DD | Dadra & Nagar Haveli and Daman & Diu |
| DELHI | Delhi |
| JAMMU_KASHMIR | Jammu & Kashmir |
| LADAKH | Ladakh |
| LAKSHADWEEP | Lakshadweep |
| PUDUCHERRY | Puducherry |

The Ministry of Tourism's official Incredible India portal also maintains a dedicated list of UT tourism websites covering these territories. [Source: Incredible India](https://www.incredibleindia.gov.in/content/incredible-india-v2/en/destinations/states.html)

---

# 3. OFFICIAL TOURISM SOURCE REGISTRY

| UT | Primary official source |
|---|---|
| Andaman & Nicobar | `tourism.andamannicobar.gov.in` |
| Chandigarh | `chandigarhtourism.gov.in` |
| Dadra & Nagar Haveli and Daman & Diu | `ddd.gov.in` |
| Delhi | `delhitourism.gov.in` |
| Jammu & Kashmir | `jktdc.co.in` + J&K Government sources |
| Ladakh | `tourism.ladakh.gov.in` + `ladakh.gov.in` |
| Lakshadweep | `lakshadweep.gov.in` + official ePermit |
| Puducherry | `tourism.py.gov.in` |

---

# 4. OFFICIAL TOURISM STATISTICS BASELINE

The Ministry of Tourism published state/UT-wise Foreign Tourist Visits for 2021–2023.

| Union Territory | 2021 | 2022 | 2023 |
|---|---:|---:|---:|
| Andaman & Nicobar Islands | 1,687 | 4,461 | 9,025 |
| Chandigarh | 5,451 | 28,439 | 31,498 |
| DNH & Daman & Diu | 185 | 1,791 | 4,048 |
| Delhi | 100,178 | 815,713 | 1,828,116 |
| Jammu & Kashmir | 1,650 | 19,985 | 55,337 |
| Ladakh | 1,054 | 21,259 | 40,970 |
| Lakshadweep | 4 | 125 | 755 |
| Puducherry | 321 | 862 | 31,214 |

**Important:** These are **Foreign Tourist Visits**, not total tourist arrivals. Do not use them as total visitor counts.

Source: Ministry of Tourism, Government of India, Lok Sabha answer dated 03 February 2025.

---

# 5. DATA MODEL MAPPING

Every verified research record should ultimately map to Phase 3 entities.

```text
Research
   ↓
Data Source
   ↓
Verification Record
   ↓
Structured Entity
   ↓
PostgreSQL
   ↓
API
   ↓
Frontend / Map / AI
```

Example:

```text
Official Ladakh Tourism page
        ↓
Pangong Tso record
        ↓
destination
        ↓
verification_status = VERIFIED
        ↓
PostgreSQL
        ↓
Yatra AI / Map / Itinerary
```

---

# 6. ANDAMAN & NICOBAR ISLANDS

## 6.1 Identity

**Canonical ID**

```text
ANDAMAN_NICOBAR
```

**Official tourism portal**

```text
https://tourism.andamannicobar.gov.in/
```

The current official tourism portal provides destination discovery, itineraries, activities, tourism services, travel information, ferry services, accommodation, watersports registration, guide directory and policies/guidelines.

Source: Andaman & Nicobar Tourism.

---

## 6.2 Primary Tourism Gateway

```text
Sri Vijaya Puram
```

The current official tourism site uses the present name **Sri Vijaya Puram** for the administrative/tourism centre formerly widely known as Port Blair.

Do not hard-code the old name as the canonical city name in new records.

---

## 6.3 Verified Major Island/Destination Records

The official tourism portal currently identifies:

```text
Sri Vijaya Puram
Swaraj Dweep (Havelock Island)
Shaheed Dweep (Neil Island)
Little Andaman Island
Long Island
Great Nicobar Island
```

Additional officially promoted destinations / places include:

```text
Baratang Island
Barren Island
Mayabunder
Diglipur
Rangat
Ross & Smith Islands
Wandoor
Chidiyatapu
North Bay
Netaji Subhas Chandra Bose Island
```

Source: Andaman & Nicobar Tourism destination and itinerary pages.

---

## 6.4 Verified Major Attractions

### Sri Vijaya Puram / South Andaman

```text
Cellular Jail
Chatham Saw Mill
Samudrika Naval Marine Museum
Anthropological Museum
Fisheries Museum
Forest Museum
Science Centre
Corbyn's Cove Beach
Chidiyatapu
Munda Pahar Beach
Wandoor
Mahatma Gandhi Marine National Park
```

The District South Andaman government tourism page also lists Cellular Jail, Mahatma Gandhi Marine National Park, Andaman Water Sports Complex, Chatham Saw Mill, museums, Corbyn's Cove, Chidiyatapu, Wandoor, Ross Island, Viper Island and other destinations.

---

## 6.5 Swaraj Dweep

Verified attractions / experiences:

```text
Radhanagar Beach
Elephant Beach
Kalapathar Beach
Vijaynagar Beach
Scuba diving
Snorkelling
Sea walking
Water sports
```

---

## 6.6 Shaheed Dweep

Verified attractions:

```text
Bharatpur Beach
Laxmanpur Beach
Sitapur Beach
Natural Bridge Formation
Snorkelling
Scuba diving
```

---

## 6.7 Little Andaman

Official tourism information identifies:

```text
Butler Bay Beach
Prabhas Mundi Beach
Netaji Nagar Beach
Whisper Wave Waterfall
White Surf Waterfall
Surfing
Trekking
Birdwatching
Nature exploration
```

Little Andaman is also officially promoted as an adventure and eco-tourism destination.

---

## 6.8 Long Island

Verified:

```text
Lalaji Bay Beach
Guitar Island
Merk Bay
Eco-tourism
Birdlife
Marine ecosystem
```

The official portal describes Long Island as a comparatively less-commercialised inhabited island and provides access information through Rangat / Yeratta Jetty.

---

## 6.9 Baratang

Verified:

```text
Mangrove boat rides
Limestone Caves
Mud Volcano
Parrot Island
```

Travel through protected areas must follow applicable government rules and authorised routes.

---

## 6.10 Diglipur

Verified:

```text
Ross & Smith Islands
Kalipur Beach
Lamiya Bay
Saddle Peak
Limestone Caves
Mud Volcano
```

---

## 6.11 Experiences

Officially promoted experiences include:

```text
Scuba Diving
Snorkelling
Sea Walk
Jet Ski
Parasailing
Sea Kart
Kayaking
Banana Ride
Glass Bottom Boat Ride
Bird Watching
Trekking
Camping
Game Fishing
Harbour / Dinner Cruise
Barren Volcano Cruise
Astro Tourism / Stargazing
Mangrove Tourism
```

---

## 6.12 Safety / Restricted Areas

The official tourism portal publishes rules and guidelines for restricted areas, watersports and protected locations.

The official FAQ states that entry into tribal reserves and meeting/photographing protected indigenous tribes is prohibited.

This must be represented in the product as a **hard safety/rules record**, not as a recommendation.

---

## 6.13 Emergency Baseline

The official Long Island tourism page publishes:

```text
Police: 100
Fire: 101
Ambulance: 108
Tourist Helpline: 1363
Coast Guard: 1554
```

These numbers should still be verified against the latest official emergency directory before being promoted as live SOS data.

---

## 6.14 Live Booking Capability

The official Andaman e-Tourist portal currently provides real-time availability for Cellular Jail Sound & Light Show bookings.

On 26 August 2026, the official portal showed availability for the next several days.

Therefore:

```text
Cellular Jail Sound & Light Show
= REAL LIVE AVAILABILITY SOURCE
```

This should be integrated through the booking/provider layer rather than copied into static database content.

---

## 6.15 Current 2026 Events / Tourism Updates

Verified official 2026 information includes:

```text
Island Food Festival 2026
17–19 April 2026
ITF Ground, Sri Vijaya Puram
```

The tourism department also published 2026 announcements concerning:

```text
Monsoon Food & Culture Festival
Monsoon Carnival
Rainforest Birding Trail
Astro Guide Training
Scuba diving sites
Night sea kayaking guidelines
Parasailing
Mangrove tourism
Phaag Festival
Tourism Calendar June 2026 – April 2027
```

Only events with an official published date should be displayed as date-confirmed events.

---

## 6.16 Andaman Data Status

```text
Destination data: VERIFIED
Experience data: VERIFIED
Tourism services: VERIFIED
Current booking portal: VERIFIED
Safety rules: VERIFIED from official sources
2026 events: PARTIALLY DATE-VERIFIED
Live weather: API REQUIRED
Live ferry availability: API / official portal REQUIRED
Live hotel availability: PROVIDER REQUIRED
```

---

# 7. CHANDIGARH

## 7.1 Identity

```text
Canonical ID:
CHANDIGARH
```

Official tourism portal:

```text
https://chandigarhtourism.gov.in/
```

---

## 7.2 Tourism Positioning

The official Chandigarh Tourism Department describes Chandigarh as a modern urban destination combining:

```text
Architecture
Nature
Culture
Gardens
Heritage
Leisure
Events
```

---

## 7.3 Verified Major Attractions

Official Chandigarh Tourism lists:

```text
Open Hand Monument
Chandigarh Architecture Museum
Garden of Silence
Sukhna Lake
Capitol Complex
Bird Park
Rock Garden
Rose Garden
Le Corbusier Centre
Government Museum and Art Gallery
Natural History Museum
National Gallery of Portraits
International Dolls Museum
High Court Museum
Indian Air Force Heritage Centre
Maison Jeanneret
Leisure Valley
Japanese Garden
Garden of Fragrance
Hibiscus Garden
Bougainvillea Garden
Botanical Garden
Rajendra Park
Chandigarh War Memorial
```

---

## 7.4 Capitol Complex

The official tourism department confirms:

```text
UNESCO World Heritage status
Assembly
Secretariat
High Court
Open Hand Monument
Tower of Shadows
Geometric Hill
Martyr's Memorial
```

The official tourism page states that guided tours are available at:

```text
10:00 AM
12:00 noon
3:00 PM
```

and that visitors should reach 15 minutes before the tour.

Entry is listed as free with ID proof.

Timings and operational rules should still be checked at runtime.

---

## 7.5 Museums

Verified official museum records include:

```text
Government Museum and Art Gallery
Natural History Museum
National Gallery of Portraits
International Dolls Museum
Chandigarh Architecture Museum
Maison Jeanneret
High Court Museum
Le Corbusier Centre
Indian Air Force Heritage Centre
```

---

## 7.6 Gardens

Official Chandigarh Tourism lists:

```text
Leisure Valley
Rajendra Park
Bougainvillea Garden
Hibiscus Garden
Garden of Fragrance
Smriti Upavan
Botanical Garden
Terraced Garden
Topiary Park
Garden of Silence
Japanese Garden
```

---

## 7.7 Activities

Verified categories:

```text
Boating
Bird Park visits
Nature Trails
Garden Trails
Heritage Walks
Architectural Tours
Museum Visits
Shopping
Shows
Cultural Events
```

---

## 7.8 Tourism Assistance

The official tourism department lists Tourist Information Centres at:

```text
Sector 17 Plaza
Sukhna Lake
Capitol Complex
```

Official tourist helpline:

```text
1800-180-2116
```

---

## 7.9 E-Ticketing

Chandigarh Tourism operates a dedicated e-ticketing system for selected tourism attractions and activities.

The official tourism site states that the system supports QR-based tickets and attractions such as:

```text
Rock Garden
Sukhna Lake activities
Bird Park
Other Chandigarh Tourism-managed attractions as notified
```

This is a strong candidate for a real booking integration.

---

## 7.10 Verified 2026 Events

Official Chandigarh Tourism calendar currently lists:

```text
International Puppet Festival — 16 Feb 2026
World Heritage Day — 18 Apr 2026
International Museum Day — 18 May 2026
World Music Day — 21 Jun 2026
National Classical Dance Festival — 2nd week of July 2026
Teej Festival — August 2026
Chandigarh Arts and Heritage Festival — 2nd week of August/September 2026
Theatre Festival — October 2026
World Tourism Day celebrations — 27 Sep 2026
National Unity Day — 31 Oct 2026
National Craft Mela — 1st or 2nd week of October
Chandigarh Carnival — last weekend of November
Chrysanthemum Show — December 2026
New Year Extravaganza — last week of December
```

Important:

```text
Exact date not published
≠
invent a date
```

The application should store date precision as:

```text
EXACT_DATE
DATE_RANGE
MONTH
WEEK_OF_MONTH
SEASON
ANNUAL
```

---

# 8. DADRA & NAGAR HAVELI AND DAMAN & DIU

## 8.1 Identity

```text
Canonical ID:
DNH_DD
```

Official administration:

```text
https://ddd.gov.in/
```

---

## 8.2 Internal Geographic Structure

The official administration separates the territory into:

```text
Dadra & Nagar Haveli
Daman
Diu
```

---

## 8.3 Silvassa / Dadra & Nagar Haveli

Verified attractions:

```text
Tribal Museum
Satmalia Deer Sanctuary
Hirwa Van Garden
Daman Ganga Riverfront
Vasona Lion Safari
Nakshatra Garden
Tapovan Tourist Complex
BAPS Swaminarayan Temple
Vanganga Lake Garden
```

The official administration and forest department also promote:

```text
eco-tourism
wildlife
nature trails
safaris
gardens
riverside recreation
```

---

## 8.4 Daman

Verified major attractions:

```text
Moti Daman Fort
Fort of St. Jerome
Church of Bom Jesus
Dominican Monastery / Ruined Church
Church of Our Lady of the Sea
Church of Our Lady of Remedios
Lighthouse Beach
Devka Beach
Jampore Beach
Daman Ganga River
Ram Setu / Lighthouse beachfront
Mirasol Lake Resort
```

---

## 8.5 Diu

Verified major attractions:

```text
Diu Fort
Naida Caves
Ghoghla Beach
Nagoa Beach
INS Khukri Memorial
Diu Museum
Gangeshwar Mahadev
St. Paul's Church
```

The official UT at-a-glance page identifies Ghoghla Beach as having Blue Flag certification.

---

## 8.6 Tourism Ecosystem

Themes:

```text
Beaches
Portuguese heritage
Forts
Churches
Wildlife
Gardens
Nature
Riverfronts
Family recreation
```

---

## 8.7 Official Accommodation Records

The administration publishes government/state-owned accommodation records including:

```text
New Circuit House, Silvassa
Nagoa Annexe I, Diu
Nagoa Annexe II, Diu
Fort Circuit House, Diu
```

This is preferable to inventing hotel recommendations.

---

## 8.8 2026 Event Verification

The official Tourism Department published a tender concerning:

```text
Kite Festival 2026 in Daman
```

with tender dates:

```text
30 Dec 2025 – 08 Jan 2026
```

This proves the 2026 event activity but does not by itself establish a public visitor event date.

Therefore:

```text
Kite Festival 2026
event existence: VERIFIED
public event date: NOT VERIFIED FROM THIS SOURCE
```

Do not display a fabricated event date.

---

## 8.9 Current 2026 Tourism Administration Signals

Official 2026 records show active tourism work involving:

```text
hotel registration
homestay / B&B registration
tourist trade rules
premium hotel projects
Ghughlaam Beach tent city project
Ram Setu / Namopath seafront development
tourism asset monetization
```

These are useful for the project's tourism intelligence layer but should not be presented to tourists as completed attractions unless officially completed.

---

# 9. DELHI

## 9.1 Identity

```text
Canonical ID:
DELHI
```

Official tourism portal:

```text
https://delhitourism.gov.in/
```

---

## 9.2 Tourism Positioning

Delhi Tourism describes Delhi as:

```text
heritage
art and culture
cuisine
gardens
religious tourism
modern metropolitan tourism
shopping
food tours
heritage walks
```

---

## 9.3 Major Verified Destinations

Official Delhi Tourism lists:

```text
Humayun's Tomb
Qutub Minar
Red Fort
Jantar Mantar
India Gate
Agrasen Ki Baoli
Lodhi Garden
Lotus Temple
Akshardham Temple
Birla Mandir
Bangla Sahib
Gurudwara Bangla Sahib
Purana Qila
Safdarjung Tomb
Rashtrapati Bhavan
Dilli Haat
Garden of Five Senses
National War Memorial
National Police Memorial
```

---

## 9.4 UNESCO / World Heritage

Delhi Tourism identifies:

```text
Humayun's Tomb
Qutb Minar
Red Fort
```

as World Heritage monuments.

---

## 9.5 Museums

Official Delhi Tourism listings include:

```text
National Museum
National Rail Museum
National War Memorial
National Charkha Museum
Air Force Museum
National Gandhi Museum
National Science Centre
National Handicrafts and Handlooms Museum
National Children’s Museum
National Police Museum
Ghalib Museum
Indira Gandhi Memorial Museum
Metro Museum
Rashtrapati Bhavan Museum
Red Fort Archaeological Museum
Shankar’s International Dolls Museum
Supreme Court Museum
```

---

## 9.6 Parks / Gardens

Verified official listings include:

```text
Lodhi Garden
Garden of Five Senses
Sunder Nursery
Deer Park
Nehru Park
Buddha Jayanti Park
Roshanara Garden
Talkatora Gardens
Mehrauli Archaeological Park
Japanese Park
Delhi Ridge
Jahanpanah City Forest
Central Park
Waste to Wonder Park
National Rose Garden
```

---

## 9.7 Religious Tourism

Official tourism listings cover:

```text
Temples
Mosques
Gurudwaras
Churches
```

Examples:

```text
Jama Masjid
Bangla Sahib
Lotus Temple
Birla Mandir
ISKCON Temple
Akshardham
```

---

## 9.8 Heritage / Lesser-Known Places

Delhi Tourism also maintains a dedicated lesser-known monument inventory.

Examples include:

```text
Mutiny Memorial
Dara Shikoh Library Building
Turkman Gate
Qudsia Garden Baradari
Ghalib Haveli
Maqbara Paik
Tomb of Muhammad Quli Khan
Gol Gumbad
```

These should be classified as:

```text
HERITAGE / LESSER_KNOWN
```

rather than "hidden gems" unless the product team explicitly uses that marketing label.

---

## 9.9 Travel Categories

Official Delhi Tourism provides:

```text
Explore the City
Unexplored Delhi
Entertainment & Fun
Delhi for Kids
Delhi Delicacies
Food Tours
Shopping
Health Walks
Festivals
Travel Within Delhi
Travel To / From Delhi
```

These categories map directly to Bharat Safe Yatra filters.

---

# 10. JAMMU & KASHMIR

## 10.1 Identity

```text
Canonical ID:
JAMMU_KASHMIR
```

Jammu & Kashmir is a Union Territory.

---

# 10.2 Tourism Data Sources

Primary tourism ecosystem sources:

```text
J&K Government
Jammu & Kashmir Tourism Department
Jammu and Kashmir Tourist Development Corporation (JKTDC)
```

Official JKTDC:

```text
https://www.jktdc.co.in/
```

---

## 10.3 Kashmir Destinations

JKTDC currently lists:

```text
Srinagar
Pahalgam
Gulmarg
Sonamarg
Doodhpathri
Gurez
Aharbal
Daksum
Lolab Valley
Naranag
Sinthan Top
Yusmarg
Watlab
Peer Ki Gali
Warwan Valley
```

---

## 10.4 Gardens

Official JKTDC listings:

```text
Shalimar Garden
Nishat Garden
Chashma Shahi
Pari Mahal
Tulip Garden
```

---

## 10.5 Lakes / Springs

Verified JKTDC listings:

```text
Dal Lake
Nigeen Lake
Kokernag
Verinag
Gangabal Lake
Manasbal Lake
```

---

## 10.6 Adventure Tourism

Official JKTDC categories include:

```text
Dachigam
Fishing
Golfing
Mountaineering
Trekking
River Rafting
Paragliding
Skiing
```

---

## 10.7 Religious / Heritage Tourism

Verified official listings include:

```text
Amarnath Yatra
Hazratbal Shrine
Charar-e-Sharif
Jamia Masjid
Kheer Bhawani Temple
Khanqah-e-Molla
Shankaracharya Temple
```

---

## 10.8 Jammu Destinations

Official JKTDC lists:

```text
Jammu
Katra
Patnitop
Sanasar
Akhnoor
Udhampur
Kud
Mansar
Surinsar
Sudh Mahadev Mandir
Bahu Fort & Garden
```

---

## 10.9 Tourism Packages

JKTDC publishes tourism packages including:

```text
Mystic Kashmir
Vale of Kashmir
Kashmir Retreat
Amazing Kashmir
```

These should be stored as:

```text
OFFICIAL_PACKAGE
```

and not copied into generic itinerary recommendations without checking availability.

---

## 10.10 Regulatory / Tourist Trade Data

The J&K Government maintains the:

```text
Jammu and Kashmir Registration of Tourist Trade Act, 1978
```

The law regulates tourist trade including relevant tourism businesses.

This should feed the AI knowledge base as a regulatory source.

---

## 10.11 Booking

JKTDC provides government accommodation and tourism services.

The product should treat JKTDC as a possible provider adapter rather than manually copying live room prices.

---

# 11. LADAKH

## 11.1 Identity

```text
Canonical ID:
LADAKH
```

Official tourism:

```text
https://tourism.ladakh.gov.in/
```

Government:

```text
https://ladakh.gov.in/
```

---

## 11.2 Major Geography

Official Ladakh Tourism identifies:

### Lakes

```text
Pangong Tso
Tso Kar
Tso Moriri
```

### Monasteries

```text
Alchi
Thiksey
Hemis
```

### Passes

```text
Khardung La
Fotu La
Chang La
```

### Valleys

```text
Nubra
Suru
Zanskar
Aryan Valley
Sham Valley
Mushkoh Valley
```

---

## 11.3 Signature Destinations

Official Ladakh Tourism currently promotes:

```text
Pangong Lake
Hunder Sand Dunes
Turtuk Village
Umling La
Hemis Monastery
Thiksey Monastery
Gonbo Rangjon
```

---

## 11.4 Trekking

Official tourism lists:

```text
Sham Valley Trek
Rumtse to Tso Moriri Trek
Markha Valley Trek
Chadar Trek
```

---

## 11.5 Wildlife / Nature

Official tourism identifies:

```text
Changthang Wildlife Sanctuary
Tso Kar Basin
Hemis National Park
```

Wildlife records include:

```text
Snow Leopard
Himalayan Marmot
Tibetan Wild Ass
Black-necked Crane
Himalayan Ibex
```

These should be treated as wildlife information, not guarantees of sightings.

---

## 11.6 Pangong Tso

Official tourism gives:

```text
Latitude: 33.7530 N
Longitude: 78.6670 E
Approximate altitude: 4,350 m
```

The official tourism page describes Pangong Tso as a high-altitude lake and identifies it as an important habitat for birds including Bar-headed Goose and Black-necked Crane.

---

## 11.7 Tso Moriri

Official tourism identifies Tso Moriri as:

```text
Latitude: 32.9000 N
Longitude: 78.3000 E
```

---

## 11.8 Tso Kar

Official tourism identifies:

```text
Latitude: 33.3000 N
Longitude: 78.0000 E
```

---

## 11.9 Monasteries

Official tourism records:

```text
Alchi Monastery
Thiksey Monastery
Hemis Monastery
```

Hemis is officially described as one of Ladakh's major monasteries and is associated with the Hemis Tsechu festival.

---

## 11.10 Current 2026 Festival Data

The official Ladakh Tourism event database currently publishes:

```text
Apricot Blossom Festival
8–16 April 2026

Ladakh Astro Week
20–26 May 2026

Hemis Tsechu
24–25 June 2026

Changthang Nomadic Festival
9–10 August 2026

Suru Summer Festival
26–27 August 2026

Ladakh Bike Week
1–7 September 2026

Zanskar Festival
15–16 September 2026

Ladakh Festival
21–23 September 2026

Himalayan Film Festival
29 September – 1 October 2026
```

The official tourism portal also maintains a broader:

```text
Monastic Festivals of Ladakh
```

calendar.

---

## 11.11 Seasonal Intelligence

Official Ladakh Tourism currently groups travel experiences approximately as:

```text
Spring: March–April
Summer: May–September
Autumn: September–October
Winter: November–February
```

Seasonal product mapping:

### Spring

```text
Apricot blossoms
Snow-melt landscapes
Photography
```

### Summer

```text
Lakes
Trekking
Biking
Monastery festivals
```

### Autumn

```text
Clear skies
Golden landscapes
Photography
```

### Winter

```text
Snow landscapes
Chadar Trek
Losar-related cultural season
```

---

## 11.12 High-Altitude Safety

Ladakh content must include high-altitude risk context.

The AI should not make medical claims.

Recommended system behaviour:

```text
If altitude-sensitive itinerary:
    show official travel guidance
    recommend gradual acclimatization
    display emergency contacts
    avoid presenting medical advice as diagnosis
```

---

## 11.13 Permit / Access Data

Ladakh access rules can change.

Therefore:

```text
permit requirements
restricted areas
route access
foreign visitor access
```

must be retrieved from current official government sources before the user travels.

The static database should store the official rule/source and last verification timestamp.

---

# 12. LAKSHADWEEP

## 12.1 Identity

```text
Canonical ID:
LAKSHADWEEP
```

Official administration:

```text
https://lakshadweep.gov.in/
```

Official ePermit:

```text
https://epermit.utl.gov.in/
```

---

## 12.2 Geography

The official Lakshadweep Administration currently describes Lakshadweep as:

```text
36 islands
32 sq km total land area
12 atolls
3 reefs
5 submerged banks
10 inhabited islands
Capital: Kavaratti
```

The islands are approximately:

```text
220–440 km from Kochi
```

---

## 12.3 Major Tourist Islands / Places

Official tourism listings include:

```text
Kavaratti
Agatti
Bangaram
Kadmat
Minicoy
Kalpeni
```

---

## 12.4 Kavaratti

Official tourism identifies:

```text
Administration headquarters
52 mosques
Ujra Mosque
Marine Aquarium
Lagoon
Swimming
Snorkelling
Glass-bottom boat
Kayaking
Windsurfing
Sailing
Dolphin Dive Centre
```

---

## 12.5 Agatti

Official tourism lists Agatti as:

```text
Beautiful lagoon
Airport
Major gateway island
```

---

## 12.6 Bangaram

Official tourism identifies:

```text
Tiny teardrop-shaped island
Tourist resort
Nearby Thinnakara and Parali
Boat / helicopter transfer from Agatti
Uninhabited island resort
Marine environment
```

---

## 12.7 Kadmat

Official Lakshadweep tourism identifies Kadmat as a tourism island and a location for:

```text
Diving
Water sports
Resort tourism
```

---

## 12.8 Minicoy

Official tourism lists Minicoy as a major destination and includes it in official packages.

---

## 12.9 Kalpeni

Official tourism identifies Kalpeni with:

```text
Tilakkam
Pitti
Cheriyam
Lagoon / island tourism
```

---

## 12.10 Water Sports

Verified official tourism activities include:

```text
Scuba Diving
Snorkelling
Swimming
Windsurfing
Surfing
Kayaking
Glass-bottom boat rides
Sailing
```

---

## 12.11 Official Tourism Packages

The Lakshadweep Administration currently publishes:

```text
Coral Reef Package
Marine Wealth Awareness Package
Taratashi Package
Swaying Palm Package
Diving Package
```

The official page gives:

### Coral Reef Package

```text
5 days
Kavaratti
Kalpeni
Minicoy
```

### Marine Wealth Awareness Package

```text
4–6 days
Kadmat
```

### Taratashi Package

```text
4–6 days
Kavaratti
```

### Swaying Palm Package

```text
2–6 days
Minicoy
```

### Diving Package

```text
Kadmat
Kavaratti
Minicoy
```

---

## 12.12 Permit Requirement

This is a critical safety / regulatory record.

The current official Lakshadweep ePermit portal states that:

> Every person who is not a native of the islands must obtain a permit to enter and reside in the islands, subject to stated exemptions.

The portal also currently states:

```text
Tourist-category sponsorship is no longer required.
PCC upload is no longer required for tourist-category applications.
Maximum applicants per application form: 6.
```

These rules are current portal information and must be rechecked before every trip.

---

## 12.13 Foreign Visitor Access

The official Lakshadweep tourism page currently states that after obtaining a permit:

```text
Indian visitors: permitted to visit all islands
Foreign visitors: permitted to visit Agatti, Bangaram and Kadmat
```

This is a critical rule and must be stored with:

```text
source
verification_date
expiry / recheck requirement
```

---

## 12.14 Booking / Service Integration Opportunities

The National Government Services Portal currently exposes official Lakshadweep services for:

```text
Tour packages
Entry permits
Ship ticket status
Ship seat availability
Ship schedules
Ship ticket reservation
```

This makes Lakshadweep one of the strongest candidates for real government-service integration.

---

# 13. PUDUCHERRY

## 13.1 Identity

```text
Canonical ID:
PUDUCHERRY
```

Official tourism:

```text
https://tourism.py.gov.in/
```

---

## 13.2 Geographic Components

Puducherry UT comprises:

```text
Puducherry
Karaikal
Mahe
Yanam
```

These geographically separated regions must be represented as separate region records in the database.

---

## 13.3 Tourism Positioning

The official Department of Tourism describes Puducherry around:

```text
French heritage
Indian culture
beaches
promenade
heritage buildings
spiritual tourism
culinary tourism
backwaters
water sports
```

---

## 13.4 Verified Core Attractions / Experiences

Official government sources identify:

```text
Sri Aurobindo Ashram
Auroville
French Heritage / Boulevard Town
Beaches
Promenade
Chunnambar Boat House
Backwaters
Water sports
Heritage buildings
Temples
Churches
Museums
```

---

## 13.5 Chunnambar

Government planning documentation identifies:

```text
Chunnambar River
Boat House
Backwaters
Boating
```

as tourism resources.

---

## 13.6 Sri Aurobindo Ashram

Official Puducherry government material identifies the Ashram as a major spiritual tourism attraction.

It should be categorized:

```text
SPIRITUAL
CULTURAL
HERITAGE
```

---

## 13.7 Auroville

Auroville is geographically associated with the surrounding Tamil Nadu region rather than being wholly inside Puducherry UT.

For Bharat Safe Yatra:

```text
Do not store Auroville as a Puducherry-administered destination.
```

Instead:

```text
related_external_destination = true
```

and link it as a nearby destination from Puducherry.

This prevents geographic data corruption.

---

## 13.8 Official Tourism Services

Puducherry Tourism provides:

```text
Tourism information
Government tourist accommodation information
Local sightseeing
Package tours
Hospitality services
Water sports
Tourism Development Corporation services
```

---

## 13.9 Official Travel Guidance

The official tourism FAQ currently states:

### Best time

```text
January–March
August–October
```

### Air

Chennai is the major international gateway for the region.

Puducherry has limited services according to the official tourism FAQ.

### Road

Regular road connections exist to:

```text
Chennai
Bengaluru
Tiruchirapalli
```

### Rail

The official tourism FAQ describes limited rail connectivity.

These statements should be revalidated against live transport schedules before itinerary generation.

---

# 14. CROSS-UT TOURISM TAXONOMY

All records should use a common taxonomy.

## Nature

```text
Beach
Lake
Island
Waterfall
Mountain
Valley
Forest
Wildlife
National Park
Sanctuary
Garden
```

## Heritage

```text
Fort
Monument
Museum
Archaeological Site
Colonial Heritage
UNESCO Site
Religious Heritage
Architecture
```

## Adventure

```text
Scuba Diving
Snorkelling
Trekking
Camping
Kayaking
Rafting
Paragliding
Skiing
Surfing
Cycling
Wildlife Safari
```

## Culture

```text
Festival
Dance
Music
Craft
Cuisine
Traditional Community
Heritage Walk
Local Market
```

---

# 15. DESTINATION DATA QUALITY LEVELS

Every record should include:

```text
VERIFIED_PRIMARY
VERIFIED_GOVERNMENT
VERIFIED_SECONDARY
PENDING_REVIEW
OUTDATED
```

Recommended product behaviour:

```text
VERIFIED_PRIMARY
    ↓
Can be prominently displayed

VERIFIED_GOVERNMENT
    ↓
Can be displayed

VERIFIED_SECONDARY
    ↓
Display with source context

PENDING_REVIEW
    ↓
Admin only

OUTDATED
    ↓
Do not use for safety / booking decisions
```

---

# 16. DATE PRECISION MODEL

Festival and event records must not force exact dates when the source only provides a broad period.

Allowed:

```text
EXACT_DATE
DATE_RANGE
MONTH
WEEK_OF_MONTH
SEASON
ANNUAL
TBD
```

Example:

```text
Chandigarh Carnival
precision = WEEK_OF_MONTH
value = "Last weekend of November"
```

Do not convert this into:

```text
28 November 2026
```

unless the official source publishes that exact date.

---

# 17. LIVE DATA VS STATIC DATA

## Static / semi-static database

```text
Destination descriptions
Culture
History
Attraction categories
Verified coordinates
Official tourism information
Rules
Official source metadata
```

## Live API

```text
Weather
Hotel availability
Flight availability
Transport schedules
Ferry availability
Ticket availability
Current road status
Current emergency facilities
Active alerts
```

## Hybrid

```text
Festivals
Travel advisories
Permit requirements
Attraction timings
```

Static database stores the verified official record.

Runtime checks determine whether the information has changed.

---

# 18. BOOKING PROVIDER CANDIDATES IDENTIFIED DURING RESEARCH

## Andaman

Official e-Tourist portal:

```text
Cellular Jail Sound & Light Show
```

## Chandigarh

Official e-ticketing:

```text
Rock Garden
Sukhna Lake activities
Bird Park
Other notified Chandigarh Tourism attractions
```

## Lakshadweep

Official government services:

```text
Tour packages
Entry permits
Ship tickets
Ship availability
Ship schedules
```

## J&K

Government-owned JKTDC:

```text
Hotels
Tour packages
Tourism services
```

## Puducherry

PTDC / official tourism ecosystem:

```text
Local sightseeing
Tours
Packages
Hospitality
Water sports
```

These should be implemented through provider adapters.

---

# 19. SAFETY DATA POLICY

Safety data is more sensitive than ordinary tourism data.

Every emergency record must contain:

```text
source_id
source_url
verification_status
verified_at
last_updated
```

Never use a random travel blog as the sole source for:

```text
hospital
police
ambulance
fire
coast guard
emergency number
permit requirement
restricted area
```

---

# 20. AI KNOWLEDGE POLICY

Yatra AI should distinguish:

```text
VERIFIED_FACT
OFFICIAL_RULE
CURRENT_LIVE_DATA
RECOMMENDATION
USER_PREFERENCE
AI_GENERATED_SUMMARY
```

The model should never transform:

```text
AI_GENERATED_SUMMARY
```

into:

```text
VERIFIED_FACT
```

automatically.

---

# 21. AI ANSWER SOURCE POLICY

For questions involving:

```text
permits
restrictions
safety
emergency
booking
opening hours
festival dates
weather
transport
```

Yatra AI should prefer current official sources.

If no current official source is available:

```text
Tell the user that current verification is unavailable.
```

Do not guess.

---

# 22. DATA FRESHNESS POLICY

Recommended refresh intervals:

| Data | Suggested refresh |
|---|---|
| Weather | minutes / provider TTL |
| Emergency alerts | minutes |
| Road status | minutes-hours |
| Booking availability | live/provider TTL |
| Ferry schedules | hours/day |
| Festival calendar | daily/weekly |
| Travel advisories | daily |
| Destination content | monthly / on source change |
| Government rules | on source change |
| Historical information | low frequency |

---

# 23. SOURCE SNAPSHOT

Every research record should preserve:

```json
{
  "source_name": "Official Tourism Department",
  "source_url": "https://...",
  "source_type": "PRIMARY_GOVERNMENT",
  "retrieved_at": "2026-08-26",
  "verification_status": "VERIFIED",
  "notes": "..."
}
```

---

# 24. REQUIRED DATABASE FIELDS FOR RESEARCHED RECORDS

Every destination / attraction / festival / safety record should support:

```text
id
name
slug
description
union_territory_id
region_id
latitude
longitude
location
status
verification_status
source_id
source_url
verified_at
last_updated
created_at
updated_at
```

---

# 25. DATA THAT MUST NOT BE FABRICATED

The following are explicitly prohibited from being guessed:

```text
Hotel prices
Hotel availability
Restaurant opening hours
Restaurant ratings
Emergency phone numbers
Festival exact dates
Transport departure times
Flight schedules
Ferry schedules
Permit fees
Permit processing times
Road travel times
Weather
Crowd levels
Live map conditions
Booking availability
Medical facility availability
```

---

# 26. PHASE 5 RESEARCH COVERAGE STATUS

| UT | Destination | Attractions | Experiences | Festivals | Safety | Booking | Official Source |
|---|---|---|---|---|---|---|---|
| Andaman & Nicobar | VERIFIED | VERIFIED | VERIFIED | PARTIAL + 2026 | VERIFIED BASELINE | LIVE GOV PORTAL FOUND | YES |
| Chandigarh | VERIFIED | VERIFIED | VERIFIED | 2026 CALENDAR | VERIFIED BASELINE | LIVE GOV E-TICKETING | YES |
| DNH & DD | VERIFIED | VERIFIED | VERIFIED | PARTIAL | GOVERNMENT SOURCES | GOVERNMENT TOURISM | YES |
| Delhi | VERIFIED | VERIFIED | VERIFIED | SOURCE AVAILABLE / DATES PARTIAL | NEED LIVE SAFETY API | GOVERNMENT TOURISM | YES |
| Jammu & Kashmir | VERIFIED | VERIFIED | VERIFIED | NEED DATE-SPECIFIC SYNC | NEED LIVE SAFETY API | JKTDC | YES |
| Ladakh | VERIFIED | VERIFIED | VERIFIED | 2026 DATES VERIFIED | GOVERNMENT SOURCES | PROVIDER / GOVERNMENT | YES |
| Lakshadweep | VERIFIED | VERIFIED | VERIFIED | NEED CURRENT EVENT CALENDAR | OFFICIAL PERMIT + ADMIN | GOVERNMENT SERVICES | YES |
| Puducherry | VERIFIED | VERIFIED | VERIFIED | DATE-SPECIFIC SYNC REQUIRED | NEED LIVE SAFETY API | PTDC / GOV | YES |

---

# 27. WHAT IS READY FOR DATABASE SEEDING

The following can be safely seeded after normalization:

```text
8 Union Territories
Primary regions
Verified destination names
Verified attraction names
Verified experience categories
Verified official tourism sources
Official source URLs
Known official coordinates
Known festival dates where explicitly published
Official tourism service links
Permit information
Government booking service references
Tourism statistics
Verification metadata
```

---

# 28. WHAT SHOULD NOT YET BE SEEDED AS STATIC FACT

Until a live/current source is integrated:

```text
Hotel prices
Hotel inventory
Current weather
Live ferry schedules
Current flight schedules
Live road status
Current emergency facility availability
Current restaurant opening hours
Exact 2026 festival dates where not published
```

---

# 29. RECOMMENDED SEED DATA FORMAT

Example:

```json
{
  "name": "Pangong Tso",
  "slug": "pangong-tso",
  "type": "LAKE",
  "union_territory": "LADAKH",
  "latitude": 33.7530,
  "longitude": 78.6670,
  "verification_status": "VERIFIED_PRIMARY",
  "source": {
    "name": "Ladakh Tourism",
    "url": "https://tourism.ladakh.gov.in/places/pangong-tso",
    "retrieved_at": "2026-08-26"
  }
}
```

---

# 30. FESTIVAL SEED EXAMPLE

```json
{
  "name": "Zanskar Festival",
  "union_territory": "LADAKH",
  "start_date": "2026-09-15",
  "end_date": "2026-09-16",
  "date_precision": "DATE_RANGE",
  "location_name": "Sani, Zanskar",
  "verification_status": "VERIFIED_PRIMARY",
  "source": {
    "name": "Ladakh Tourism",
    "url": "https://tourism.ladakh.gov.in/events"
  }
}
```

---

# 31. PERMIT SEED EXAMPLE

```json
{
  "name": "Lakshadweep Entry Permit",
  "union_territory": "LAKSHADWEEP",
  "required": true,
  "application_url": "https://epermit.utl.gov.in/",
  "verification_status": "VERIFIED_PRIMARY",
  "source": {
    "name": "UT Administration of Lakshadweep",
    "retrieved_at": "2026-08-26"
  }
}
```

---

# 32. SOURCE REGISTRY — KEY OFFICIAL REFERENCES

## Andaman & Nicobar

```text
https://tourism.andamannicobar.gov.in/
https://southandaman.nic.in/tourism/
```

## Chandigarh

```text
https://chandigarhtourism.gov.in/
```

## DNH & DD

```text
https://ddd.gov.in/
https://ddd.gov.in/places-centres/
https://ddd.gov.in/tourism-2/
```

## Delhi

```text
https://delhitourism.gov.in/
```

## Jammu & Kashmir

```text
https://www.jktdc.co.in/
https://law.jk.gov.in/
```

## Ladakh

```text
https://tourism.ladakh.gov.in/
https://ladakh.gov.in/
```

## Lakshadweep

```text
https://lakshadweep.gov.in/
https://epermit.utl.gov.in/
https://services.india.gov.in/
```

## Puducherry

```text
https://tourism.py.gov.in/
https://pondytourism.py.gov.in/
```

## Central Government

```text
https://www.incredibleindia.gov.in/
https://tourism.gov.in/
https://www.data.tourism.gov.in/
https://www.india.gov.in/
```

---

# 33. OFFICIAL SOURCE EVIDENCE SUMMARY

### Andaman & Nicobar

The official tourism portal currently provides destinations, activities, itineraries, travel care, accommodation, ferry services, water sports registration, guide directory and policies.

### Chandigarh

The official tourism department provides attractions, events, itineraries, travel desk services and e-ticketing.

### DNH & DD

The official UT administration provides places, tourism department information, accommodation, tourism notices and current tourism development information.

### Delhi

The official Delhi Tourism portal provides destinations, heritage, museums, gardens, religious tourism, food, shopping, festivals and travel information.

### Jammu & Kashmir

JKTDC provides destinations, hotels, adventure tourism, gardens, lakes, shrines, packages and tourism services.

### Ladakh

The official Ladakh Tourism portal provides destination data, coordinates, experiences, seasonal information and a current 2026 event calendar.

### Lakshadweep

The official administration provides destination information, tourism packages, permit requirements and government booking/service portals.

### Puducherry

The official Tourism Department provides tourism information, PTDC services, travel guidance, accommodation information and tourism development information.

---

# 34. CRITICAL DATA QUALITY OBSERVATIONS

## Observation 1

Different government websites use different names.

Example:

```text
Port Blair
Sri Vijaya Puram
```

Bharat Safe Yatra should maintain:

```text
canonical_name
historical/common_name
aliases
```

rather than deleting older names from the search index.

---

## Observation 2

Festival dates have different precision.

Therefore:

```text
exact date
date range
month
week
annual
TBD
```

must be first-class data.

---

## Observation 3

Tourism information changes frequently.

Therefore every important record needs:

```text
last_verified_at
source_url
verification_status
```

---

## Observation 4

Booking information should never be copied into static research.

Availability must come from the provider.

---

## Observation 5

Safety information should have a higher verification threshold than ordinary tourism content.

---

# 35. YATRA AI KNOWLEDGE CATEGORIES

The RAG system should index documents under:

```text
DESTINATION
ATTRACTION
EXPERIENCE
CULTURE
FOOD
FESTIVAL
TRANSPORT
PERMIT
RULE
SAFETY
EMERGENCY
WEATHER_GUIDANCE
BOOKING
TRAVEL_ADVISORY
HISTORY
```

---

# 36. YATRA AI SOURCE PRIORITY

For a question:

> "Do I need a permit?"

Priority:

```text
Official permit portal
      ↓
UT Administration
      ↓
Government notification
      ↓
Ministry of Tourism
      ↓
Other authoritative source
```

For:

> "What should I see?"

Priority:

```text
UT Tourism
      ↓
Incredible India
      ↓
Government tourism corporation
```

For:

> "Where is the nearest hospital?"

Priority:

```text
Current official safety / health data
      ↓
PostGIS
      ↓
Live distance
```

---

# 37. USER-FACING DATA LABELS

The frontend should visibly distinguish:

```text
Official
Verified
Updated recently
Live
Estimated
AI Recommendation
```

Example:

```text
✓ Official Tourism Source
Updated: 26 Aug 2026
```

For live:

```text
● Live
Updated 2 minutes ago
```

For AI:

```text
AI Recommendation
Based on your preferences
```

---

# 38. RESEARCH STATUS RULE

A record can be marked:

```text
VERIFIED
```

only when:

1. the source is authoritative,
2. the information is clearly identifiable,
3. the source is current enough for the data type,
4. the retrieved information matches the record,
5. the source URL is retained.

---

# 39. FINAL PHASE 5 DATA PIPELINE

```text
OFFICIAL SOURCE
       ↓
RESEARCH
       ↓
SOURCE SNAPSHOT
       ↓
NORMALIZATION
       ↓
DUPLICATE CHECK
       ↓
FACT CHECK
       ↓
VERIFICATION
       ↓
DATABASE SEED
       ↓
POSTGRESQL
       ↓
POSTGIS / PGVECTOR
       ↓
API
       ↓
BHARAT SAFE YATRA
       ↓
YATRA AI
```

---

# 40. PHASE 5 IMPLEMENTATION RULE

The development team must never create records simply to make the website look complete.

If the real source says:

```text
Unknown
```

the database should say:

```text
NULL
```

If the date is not announced:

```text
TBD
```

If the price is dynamic:

```text
provider_api_required = true
```

If a destination is restricted:

```text
access_restricted = true
```

If a source is outdated:

```text
verification_status = OUTDATED
```

This is how Bharat Safe Yatra remains trustworthy.

---

# 41. PHASE 5 COMPLETION STATUS

### Core UT Coverage

```text
8 / 8 Union Territories researched
```

### Official Tourism Sources

```text
8 / 8 identified
```

### Destination taxonomy

```text
Defined
```

### Tourism category taxonomy

```text
Defined
```

### Source / verification model

```text
Defined
```

### 2026 festival data

```text
Partially exact-date verified
Remaining events require official calendar synchronization
```

### Live booking opportunities

```text
Identified
```

### Live data requirements

```text
Identified
```

### Safety data

```text
Official baselines identified
Live safety layer still required
```

---

# 42. PHASE 5 → PHASE 6

The next phase should be:

# **PHASE 6 — UI/UX DESIGN SYSTEM**

The UI/UX phase will transform this verified knowledge into the actual Bharat Safe Yatra experience.

It should define:

```text
Design system
Color system
Typography
Navbar
Hero carousel
Union Territory pages
Destination cards
Destination detail pages
Search
Filters
Interactive map
3D map presentation
Itinerary builder
AI assistant
Booking interface
Festival calendar
Safety / SOS UI
Live alerts
Weather cards
Footer
Mobile responsive layouts
Accessibility
Loading states
Error states
Empty states
```

The design should be built around one core principle:

> **The tourist should not need another website to understand, plan and manage the journey.**

---

# 43. FINAL PHASE 5 PRINCIPLE

## 🇮🇳 Bharat Safe Yatra must be a verified tourism intelligence layer, not a collection of copied travel blogs.

The product should combine:

```text
OFFICIAL DATA
+
LIVE DATA
+
GEOSPATIAL INTELLIGENCE
+
BOOKING INTEGRATIONS
+
AI
+
SAFETY
```

while maintaining a clear distinction between:

```text
FACT
LIVE INFORMATION
RECOMMENDATION
```

That distinction is the foundation of trust for Bharat Safe Yatra.

---

# 44. PHASE 5 SOURCE NOTES

The principal evidence used for this research includes official government sources such as:

- Ministry of Tourism / Incredible India
- Andaman & Nicobar Tourism
- South Andaman District Administration
- Chandigarh Tourism
- UT Administration of Dadra & Nagar Haveli and Daman & Diu
- Delhi Tourism
- Jammu & Kashmir Tourist Development Corporation
- J&K Government legal / tourism sources
- Ladakh Tourism
- Administration of Union Territory of Ladakh
- Lakshadweep Administration
- Lakshadweep ePermit
- National Government Services Portal
- Puducherry Department of Tourism
- Puducherry Tourism Development Corporation

---

# 45. RESEARCH CUTOFF

```text
26 August 2026
```

Because tourism information changes, this document should be treated as:

```text
RESEARCH BASELINE
```

not as a substitute for live provider/API verification.

Before production deployment, the system should run a source synchronization process and update:

```text
last_verified_at
source_snapshot
verification_status
```

for all time-sensitive records.

---

# 🇮🇳 BHARAT SAFE YATRA

> **Discover. Plan. Book. Navigate. Stay Safe.**

**Phase 5 — Tourism Data Research & Knowledge Base v1.0**

**Status:** Research baseline established with official-source-backed data and explicit no-fabrication rules.
