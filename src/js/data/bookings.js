/**
 * 🇮🇳 BHARAT SAFE YATRA — VERIFIED BOOKING & PROVIDER ADAPTERS
 * Phase 5.2: Verified Tourism Data System
 *
 * DATA RULES:
 * - NEVER say "AVAILABLE" unless availability was actually checked via live API.
 * - Default state is "CHECK_ON_PROVIDER" — redirect to official portal.
 * - All URLs are from the approved domain allowlist.
 */

export const BOOKING_PROVIDERS = [
  {
    id: "andaman-etourist",
    name: "Andaman & Nicobar E-Tourist Portal",
    slug: "andaman-etourist",
    type: "GOVERNMENT_TICKETING",
    badge: "Official UT Portal",
    url: "https://tourism.andamannicobar.gov.in/",
    serviceTypes: ["ACTIVITY", "FERRY", "PACKAGE"],
    territoryCoverage: ["ANDAMAN_NICOBAR"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "chandigarh-eticket",
    name: "Chandigarh Tourism E-Ticketing System",
    slug: "chandigarh-eticket",
    type: "GOVERNMENT_TICKETING",
    badge: "Official Municipal System",
    url: "https://chandigarhtourism.gov.in/",
    serviceTypes: ["ACTIVITY"],
    territoryCoverage: ["CHANDIGARH"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "jktdc-portal",
    name: "J&K Tourist Development Corporation (JKTDC)",
    slug: "jktdc",
    type: "GOVERNMENT_HOSPITALITY",
    badge: "State Tourism Corporation",
    url: "https://www.jktdc.co.in/",
    serviceTypes: ["HOTEL", "PACKAGE"],
    territoryCoverage: ["JAMMU_KASHMIR"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "lakshadweep-tourism",
    name: "SPORTS Lakshadweep Tourism Portal",
    slug: "lakshadweep-sports",
    type: "GOVERNMENT_PACKAGES",
    badge: "Official Admin Portal",
    url: "https://lakshadweep.gov.in/",
    serviceTypes: ["PACKAGE", "FERRY"],
    territoryCoverage: ["LAKSHADWEEP"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "ladakh-permit",
    name: "Ladakh ILP/PAP Permit Portal",
    slug: "ladakh-permit",
    type: "GOVERNMENT_PERMIT",
    badge: "Official Permit Portal",
    url: "https://lahdclehpermit.in/",
    serviceTypes: ["ACTIVITY"],
    territoryCoverage: ["LADAKH"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "asi-tickets",
    name: "ASI Monument E-Ticketing Portal",
    slug: "asi-tickets",
    type: "GOVERNMENT_TICKETING",
    badge: "Archaeological Survey of India",
    url: "https://asi.payumoney.com/",
    serviceTypes: ["ACTIVITY"],
    territoryCoverage: ["DELHI", "CHANDIGARH"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "lakshadweep-epermit",
    name: "Lakshadweep ePermit Portal",
    slug: "lakshadweep-epermit",
    type: "GOVERNMENT_PERMIT",
    badge: "Official Entry Permit",
    url: "https://epermit.utl.gov.in/",
    serviceTypes: ["ACTIVITY"],
    territoryCoverage: ["LAKSHADWEEP"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "delhi-tourism",
    name: "Delhi Tourism Portal",
    slug: "delhi-tourism",
    type: "GOVERNMENT_TOURISM",
    badge: "Official Tourism Portal",
    url: "https://delhitourism.gov.in/",
    serviceTypes: ["ACTIVITY", "HOTEL"],
    territoryCoverage: ["DELHI"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "ptdc",
    name: "Puducherry Tourism Development Corporation",
    slug: "ptdc",
    type: "GOVERNMENT_TOURISM",
    badge: "Official UT Tourism",
    url: "https://tourism.py.gov.in/",
    serviceTypes: ["ACTIVITY", "HOTEL", "PACKAGE"],
    territoryCoverage: ["PUDUCHERRY"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  },
  {
    id: "dnh-dd-admin",
    name: "DNH & DD UT Administration Tourism",
    slug: "dnh-dd",
    type: "GOVERNMENT_TOURISM",
    badge: "Official UT Admin Portal",
    url: "https://ddd.gov.in/",
    serviceTypes: ["ACTIVITY"],
    territoryCoverage: ["DNH_DD"],
    linkStatus: "ACTIVE",
    domainVerified: true,
    lastVerified: "2026-08-26"
  }
];

export const BOOKABLE_EXPERIENCES = [
  {
    id: "book-cellular-jail-sound-light",
    title: "Cellular Jail Sound & Light Show E-Ticket",
    providerId: "andaman-etourist",
    providerName: "Andaman E-Tourist Portal",
    location: "Sri Vijaya Puram, Andaman & Nicobar",
    category: "ACTIVITY",
    image: "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80",
    description: "Official entry slot for the historic evening Sound & Light spectacle narrating the Indian independence movement.",
    pricing: "Check live tariff on official portal",
    timing: "Daily Shows at 5:30 PM (Hindi) & 6:45 PM (English)",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://tourism.andamannicobar.gov.in/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  },
  {
    id: "book-rock-garden-chandigarh",
    title: "Nek Chand's Rock Garden Entry Pass",
    providerId: "chandigarh-eticket",
    providerName: "Chandigarh Tourism E-Ticketing",
    location: "Sector 1, Chandigarh",
    category: "ACTIVITY",
    image: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a8?auto=format&fit=crop&w=800&q=80",
    description: "Digital QR-code entry pass for the 40-acre visionary sculpture park built from industrial & urban waste.",
    pricing: "Check live official municipal tariff",
    timing: "Open Daily 9:00 AM – 7:00 PM",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://chandigarhtourism.gov.in/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  },
  {
    id: "book-jktdc-gulmarg-huts",
    title: "JKTDC Alpine Tourist Huts Gulmarg",
    providerId: "jktdc-portal",
    providerName: "J&K Tourism Development Corp",
    location: "Gulmarg Alpine Meadow, J&K",
    category: "HOTEL",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
    description: "Government-owned pine-wood chalets with panoramic views of Apharwat Peak and golf course.",
    pricing: "Check live seasonal rates on JKTDC Portal",
    timing: "Check-in 12:00 PM / Check-out 11:00 AM",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://www.jktdc.co.in/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  },
  {
    id: "book-lakshadweep-coral-package",
    title: "Official 5-Day Lakshadweep Coral Reef Package",
    providerId: "lakshadweep-tourism",
    providerName: "SPORTS Lakshadweep",
    location: "Kavaratti, Kalpeni & Minicoy",
    category: "PACKAGE",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Comprehensive 5-day island hopping cruise package including ship transfers, water sports, and permits.",
    pricing: "Check official government package tariff",
    timing: "Scheduled departures from Kochi Port",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://lakshadweep.gov.in/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  },
  {
    id: "book-red-fort-asi",
    title: "Red Fort & Delhi ASI Monument E-Tickets",
    providerId: "asi-tickets",
    providerName: "Archaeological Survey of India",
    location: "Red Fort, Qutub Minar, Humayun's Tomb, Delhi",
    category: "ACTIVITY",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    description: "Official digital entry passes for UNESCO World Heritage monuments managed by ASI in Delhi.",
    pricing: "Check live ASI tariff (Indian/Foreign categories)",
    timing: "Sunrise to Sunset, closed Mondays",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://asi.payumoney.com/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  },
  {
    id: "book-ladakh-ilp",
    title: "Ladakh Inner Line Permit (ILP/PAP)",
    providerId: "ladakh-permit",
    providerName: "LAHDC Leh Permit Portal",
    location: "Pangong Tso, Nubra Valley, Tso Moriri, Ladakh",
    category: "ACTIVITY",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    description: "Mandatory protected area permit for visiting Pangong Tso, Nubra Valley, Tso Moriri, and other restricted zones in Ladakh.",
    pricing: "Apply online (fees vary)",
    timing: "Processing: 1-2 business days",
    availabilityState: "CHECK_ON_PROVIDER",
    directUrl: "https://lahdclehpermit.in/",
    lastVerified: "2026-08-26",
    linkStatus: "ACTIVE"
  }
];
