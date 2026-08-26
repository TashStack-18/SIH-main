/**
 * 🇮🇳 BHARAT SAFE YATRA — VERIFIED SAFETY & EMERGENCY INTELLIGENCE
 * Phase 5 Verified Knowledge Base
 * Research Cutoff: 26 August 2026
 */

export const EMERGENCY_NATIONAL_CONTACTS = [
  { service: "Unified National Emergency Helpline", number: "112", description: "All-in-one emergency response for Police, Fire, and Ambulance across India", category: "NATIONAL", icon: "shield" },
  { service: "Medical Emergency / Ambulance", number: "108", description: "Toll-free 24x7 emergency medical transport and trauma services", category: "MEDICAL", icon: "activity" },
  { service: "National Tourist Helpline (24x7)", number: "1363", description: "Ministry of Tourism multi-lingual tourist assistance (12 languages)", category: "TOURIST", icon: "phone" },
  { service: "Indian Coast Guard SAR", number: "1554", description: "Maritime search, rescue, and coastal emergency response", category: "MARITIME", icon: "life-buoy" },
  { service: "Disaster Management Helpline", number: "1070", description: "State/UT disaster management operations and relief coordination", category: "DISASTER", icon: "alert-triangle" }
];

export const EMERGENCY_FACILITIES = [
  {
    id: "snm-hospital-leh",
    name: "Sonam Norboo Memorial (SNM) District Hospital",
    territoryId: "LADAKH",
    territoryName: "Ladakh",
    type: "HOSPITAL",
    address: "Skara, Leh, UT of Ladakh 194101",
    phone: "01982-252014",
    emergencyPhone: "01982-252012",
    coordinates: { lat: 34.1610, lng: 77.5840 },
    services: ["24x7 High-Altitude Trauma Unit", "Hyperbaric Oxygen Therapy", "Emergency ICU", "Pharmacy"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "gb-pant-andaman",
    name: "Govind Ballabh Pant (GB Pant) Hospital",
    territoryId: "ANDAMAN_NICOBAR",
    territoryName: "Andaman & Nicobar Islands",
    type: "HOSPITAL",
    address: "Atlanta Point, Sri Vijaya Puram, South Andaman 744101",
    phone: "03192-232102",
    emergencyPhone: "03192-233473",
    coordinates: { lat: 11.6680, lng: 92.7410 },
    services: ["24x7 Trauma Care", "Marine Injury Treatment", "Blood Bank", "Surgical Emergency"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "pgimer-chandigarh",
    name: "Post Graduate Institute of Medical Education & Research (PGIMER)",
    territoryId: "CHANDIGARH",
    territoryName: "Chandigarh",
    type: "HOSPITAL",
    address: "Sector 12, Chandigarh 160012",
    phone: "0172-2747585",
    emergencyPhone: "0172-2756565",
    coordinates: { lat: 30.7650, lng: 76.7750 },
    services: ["Apex Trauma Center", "24x7 Emergency Cardiac Care", "Advanced Critical Care", "Helipad Access"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "smhs-hospital-srinagar",
    name: "Shri Maharaja Hari Singh (SMHS) Hospital",
    territoryId: "JAMMU_KASHMIR",
    territoryName: "Jammu & Kashmir",
    type: "HOSPITAL",
    address: "Karan Nagar, Srinagar, J&K 190010",
    phone: "0194-2503112",
    emergencyPhone: "0194-2452052",
    coordinates: { lat: 34.0900, lng: 74.8000 },
    services: ["24x7 Trauma & Emergency Center", "Hypothermia Management", "Cardiac Emergency", "Burn Unit"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "aiims-delhi",
    name: "All India Institute of Medical Sciences (AIIMS New Delhi)",
    territoryId: "DELHI",
    territoryName: "Delhi",
    type: "HOSPITAL",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
    phone: "011-26588500",
    emergencyPhone: "011-26593666",
    coordinates: { lat: 28.5672, lng: 77.2100 },
    services: ["Level 1 Apex Trauma Centre", "24x7 Multi-specialty Emergency", "Organ Transplant", "Advanced Resuscitation"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "indira-gandhi-hospital-kavaratti",
    name: "Indira Gandhi Hospital Kavaratti",
    territoryId: "LAKSHADWEEP",
    territoryName: "Lakshadweep",
    type: "HOSPITAL",
    address: "Hospital Road, Kavaratti, Lakshadweep 682555",
    phone: "04896-262243",
    emergencyPhone: "04896-262788",
    coordinates: { lat: 10.5667, lng: 72.6417 },
    services: ["Primary Trauma Unit", "Decompression Sickness Support", "Emergency Maternity Care", "Telemedicine Link to Kochi"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "ig-general-hospital-puducherry",
    name: "Indira Gandhi Government General Hospital & Post Graduate Institute",
    territoryId: "PUDUCHERRY",
    territoryName: "Puducherry",
    type: "HOSPITAL",
    address: "Victor Simonel Street, White Town, Puducherry 605001",
    phone: "0413-2336050",
    emergencyPhone: "0413-2336058",
    coordinates: { lat: 11.9350, lng: 79.8320 },
    services: ["24x7 Casualty and Trauma Care", "Cardiology Unit", "Pediatric Emergency", "ICU Services"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  },
  {
    id: "civil-hospital-diu",
    name: "Government Civil Hospital Diu",
    territoryId: "DNH_DD",
    territoryName: "Dadra & Nagar Haveli and Daman & Diu",
    type: "HOSPITAL",
    address: "Near Fort Road, Diu 362520",
    phone: "02875-252250",
    emergencyPhone: "02875-252244",
    coordinates: { lat: 20.7140, lng: 70.9850 },
    services: ["24x7 Emergency Casualty", "Sea Rescue Emergency Coordination", "Pharmacy", "Minor Surgery"],
    is24x7: true,
    verificationStatus: "VERIFIED_PRIMARY"
  }
];

export const ACTIVE_TRAVEL_ADVISORIES = [
  {
    id: "adv-ladakh-altitude-2026",
    territoryId: "LADAKH",
    territoryName: "Ladakh",
    title: "Mandatory High Altitude Acclimatization Advisory",
    severity: "HIGH",
    category: "HEALTH",
    dateIssued: "2026-05-01",
    validThrough: "2026-10-31",
    summary: "Travellers arriving by air at Leh Kushok Bakula Rimpochee Airport (3,256m) must undergo minimum 48 hours of complete rest before traveling to high-altitude passes (Khardung La, Chang La) or lakes (Pangong, Tso Moriri).",
    officialSource: "UT Administration of Ladakh Health Department & Ladakh Tourism"
  },
  {
    id: "adv-andaman-tribal-2026",
    territoryId: "ANDAMAN_NICOBAR",
    territoryName: "Andaman & Nicobar Islands",
    title: "Tribal Reserve & Marine Sanctuaries Protection Order",
    severity: "CRITICAL",
    category: "LEGAL",
    dateIssued: "2026-01-01",
    validThrough: "2026-12-31",
    summary: "Interaction, photography, videography, or entry into designated Jarawa and Sentinelese tribal reserves is strictly punishable under the Protection of Aboriginal Tribes Regulation. Coral extraction is punishable under Wildlife Protection Act.",
    officialSource: "Andaman & Nicobar Administration Directorate of Tribal Welfare"
  },
  {
    id: "adv-lakshadweep-epermit-2026",
    territoryId: "LAKSHADWEEP",
    territoryName: "Lakshadweep",
    title: "Official ePermit & Marine Conservation Guidelines",
    severity: "MEDIUM",
    category: "PERMIT",
    dateIssued: "2026-02-15",
    validThrough: "2026-12-31",
    summary: "All non-native tourists must generate a valid ePermit via epermit.utl.gov.in prior to boarding flights/ships. Collection of live corals, sea cucumber, and marine turtles is prohibited with strict penalties.",
    officialSource: "UT Administration of Lakshadweep ePermit Portal"
  }
];
