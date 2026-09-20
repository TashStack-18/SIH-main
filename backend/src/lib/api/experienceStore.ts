/**
 * 🇮🇳 BHARAT SAFE YATRA — IN-MEMORY EXPERIENCE STORE
 *
 * This is the data access layer for user travel experiences.
 * Since no persistent database exists yet, this uses an in-memory Map
 * that resets on server restart.
 */

export interface ExperienceRecord {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  destinationId: string;
  destinationName?: string;
  territoryId?: string;
  territorySlug?: string;
  territoryName?: string;
  title?: string;
  rating: number; // 1 to 5
  text: string;
  photos: string[]; // URLs / paths
  travelTips?: string;
  likesCount?: number;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

const SEED_EXPERIENCES: ExperienceRecord[] = [
  {
    id: "exp-001",
    userId: "aarav_mehta",
    userName: "Aarav Mehta",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    destinationId: "baratang-island",
    destinationName: "Baratang & Havelock Waters",
    territoryId: "ANDAMAN_NICOBAR",
    territorySlug: "andaman-and-nicobar",
    territoryName: "Andaman & Nicobar",
    title: "Kayaking through hidden beaches & mangroves",
    rating: 4.9,
    text: "An unforgettable experience exploring the crystal clear waters of Havelock and the mangrove trails of Baratang. The marine life is just magical! We kayaked through silent emerald canopies and saw schools of flying fish and coral formations right below our glass-bottom kayak.",
    photos: [
      "/images/Andaman and Nicobar Islands_hero.jpeg",
      "/images/Baratang Island & Limestone Caves.jpeg",
      "/images/Cellular Jail National Memorial.jpeg"
    ],
    travelTips: "Book the early 5:30 AM sunrise kayaking slot to avoid the coastal winds and see bioluminescence if paddling near sunset.",
    likesCount: 142,
    status: "PUBLISHED",
    createdAt: "2025-08-12T09:30:00.000Z",
    updatedAt: "2025-08-12T09:30:00.000Z",
  },
  {
    id: "exp-002",
    userId: "simran_kaur",
    userName: "Simran Kaur",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    destinationId: "pangong-tso",
    destinationName: "Pangong Tso & Chang La",
    territoryId: "LADAKH",
    territorySlug: "ladakh",
    territoryName: "J&K / Ladakh",
    title: "Ladakh's silence that speaks to your soul",
    rating: 4.9,
    text: "Ladakh isn't just a destination, it's a feeling. The dramatic high-altitude desert, the warm Ladakhi smiles over butter tea, and the pure stillness of Pangong Lake at twilight where the water mirrors seven distinct shades of sapphire. Everything feels completely surreal.",
    photos: [
      "/images/Pangong Tso.jpeg",
      "/images/Leh Old Town & Palace.jpeg",
      "/images/Nubra Valley & Hunder Sand Dunes.jpeg"
    ],
    travelTips: "Acclimatize in Leh for at least 48 hours before crossing Chang La Pass. Carry layered thermals and a thermos for hot water.",
    likesCount: 238,
    status: "PUBLISHED",
    createdAt: "2025-07-05T14:15:00.000Z",
    updatedAt: "2025-07-05T14:15:00.000Z",
  },
  {
    id: "exp-003",
    userId: "elena_roche",
    userName: "Elena & Rohan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    destinationId: "french-quarter",
    destinationName: "White Town (French Quarter)",
    territoryId: "PUDUCHERRY",
    territorySlug: "puducherry",
    territoryName: "Puducherry",
    title: "The Art in Every Corner of White Town",
    rating: 4.8,
    text: "Waking up in a restored French-colonial villa with bougainvillea cascading over mustard-yellow walls. Cycling down Rue Dumas at dawn, grabbing fresh pain au chocolat from a heritage bakery, and enjoying the breeze along the Goubert Promenade. A poetic fusion of Tamil warmth and French elegance.",
    photos: [
      "/images/French Quarter (White Town) & Promenade.jpeg",
      "/images/Auroville & Matrimandir.jpeg",
      "/images/Paradise Beach (Plage Paradiso).jpeg"
    ],
    travelTips: "Rent a vintage pastel bicycle for ₹100/day. The pedestrian-only evening promenade from 6 PM to 7:30 AM is bliss.",
    likesCount: 189,
    status: "PUBLISHED",
    createdAt: "2025-06-20T11:45:00.000Z",
    updatedAt: "2025-06-20T11:45:00.000Z",
  },
  {
    id: "exp-004",
    userId: "zain_patel",
    userName: "Zain Patel",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    destinationId: "agatti-island",
    destinationName: "Agatti Coral Lagoon",
    territoryId: "LAKSHADWEEP",
    territorySlug: "lakshadweep",
    territoryName: "Lakshadweep",
    title: "A Slice of Turquoise Paradise",
    rating: 5.0,
    text: "The airstrip approach over Agatti lagoon is easily the most breathtaking view in South Asia! The water clarity is unmatched — visibility exceeding 30 meters. Snorkeling at the outer reef brought sea turtles, manta rays, and vibrant live coral gardens right into view.",
    photos: [
      "/images/Agatti Island & Airport.jpeg",
      "/images/Bangaram Atoll & Kadmat Reef.jpeg",
      "/images/Kadmat Island.jpeg"
    ],
    travelTips: "Obtain your e-Permit at least 15 days in advance through the official Lakshadweep portal. Only BSNL and Airtel work reliably.",
    likesCount: 312,
    status: "PUBLISHED",
    createdAt: "2025-05-18T16:00:00.000Z",
    updatedAt: "2025-05-18T16:00:00.000Z",
  },
  {
    id: "exp-005",
    userId: "priya_deshmukh",
    userName: "Priya Deshmukh",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    destinationId: "rock-garden",
    destinationName: "Rock Garden & Capitol Complex",
    territoryId: "CHANDIGARH",
    territorySlug: "chandigarh",
    territoryName: "Chandigarh",
    title: "Visionary Sculptures & Urban Geometry",
    rating: 4.7,
    text: "Nek Chand's visionary Rock Garden created from recycled industrial and ceramic waste is pure genius. The meandering corridors, water cascades, and army of dancing stone sculptures represent India's raw artistic spirit. Chandigarh's tree-lined avenues make walking so restorative.",
    photos: [
      "/images/Nek Chand's Rock Garden.jpeg",
      "/images/The Capitol Complex (UNESCO World Heritage).jpeg",
      "/images/Sukhna Lake.jpeg"
    ],
    travelTips: "Visit early morning before 10 AM to experience the Rock Garden without crowds. Sukhna Lake sunset boating is right next door.",
    likesCount: 98,
    status: "PUBLISHED",
    createdAt: "2025-04-10T13:20:00.000Z",
    updatedAt: "2025-04-10T13:20:00.000Z",
  },
  {
    id: "exp-006",
    userId: "dev_rathore",
    userName: "Devrath Sharma",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    destinationId: "qutub-minar",
    destinationName: "Qutub Complex & Mehrauli",
    territoryId: "DELHI",
    territorySlug: "delhi",
    territoryName: "Delhi",
    title: "Centuries of Heritage in One Golden Sunset",
    rating: 4.8,
    text: "Exploring the intricate calligraphy carved into the fluted sandstone of Qutub Minar as the Delhi sunset paints the sky in shades of amber. The ancient iron pillar that has resisted rust for 1,600 years still boggles the mind. Truly one of the world's great open-air archaeological wonders.",
    photos: [
      "/images/Qutub Minar Complex.jpeg",
      "/images/Humayun's Tomb.jpeg",
      "/images/Red Fort (Lal Qila).jpeg"
    ],
    travelTips: "Use the Delhi Metro (Yellow Line - Qutub Minar Station). Book tickets online to skip the main queue.",
    likesCount: 167,
    status: "PUBLISHED",
    createdAt: "2025-03-22T17:40:00.000Z",
    updatedAt: "2025-03-22T17:40:00.000Z",
  },
  {
    id: "exp-007",
    userId: "kavya_nair",
    userName: "Kavya Nair",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    destinationId: "diu-fort",
    destinationName: "Diu Fortress & Naida Caves",
    territoryId: "DADRA_NAGAR_HAVELI_DAMAN_DIU",
    territorySlug: "daman-diu",
    territoryName: "Daman & Diu",
    title: "Sea Bastions, Naida Caves & Arabian Waves",
    rating: 4.8,
    text: "Standing atop the centuries-old Portuguese fort ramparts watching powerful Arabian sea waves crash below with brass cannons still overlooking the horizon. Later, exploring Naida Caves felt like walking into an Indiana Jones film with light shafts piercing through natural rock openings.",
    photos: [
      "/images/Diu Fort & Naida Caves.jpeg",
      "/images/Ghoghla Beach (Blue Flag Certified).jpeg",
      "/images/Nagoa Beach.jpeg"
    ],
    travelTips: "Naida Caves are most magical around 11:30 AM to 1:00 PM when the midday sun casts dramatic vertical light rays into the cavern.",
    likesCount: 124,
    status: "PUBLISHED",
    createdAt: "2025-02-14T10:00:00.000Z",
    updatedAt: "2025-02-14T10:00:00.000Z",
  },
  {
    id: "exp-008",
    userId: "vikramaditya",
    userName: "Vikram & Ananya",
    userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    destinationId: "silvassa-tribal-museum",
    destinationName: "Silvassa & Madhuban",
    territoryId: "DADRA_NAGAR_HAVELI_DAMAN_DIU",
    territorySlug: "dadra-nagar-haveli",
    territoryName: "Dadra & Nagar Haveli",
    title: "Warli Traditions, River Rapids & Tribal Soul",
    rating: 4.7,
    text: "Silvassa is a hidden gem for culture enthusiasts. Learning authentic Warli painting from resident tribal artisans and tasting local bamboo shoot curry was an enriching grounding experience. The lush greenery around Madhuban Dam is tranquil and untouched by commercial tourism.",
    photos: [
      "/images/Silvassa & Tribal Cultural Museum.jpeg",
      "/images/Satmalia Deer Sanctuary.jpeg",
      "/images/dnhdd_hero.png"
    ],
    travelTips: "Buy authentic Warli artworks directly from artisan cooperatives at the Tribal Cultural Museum to support the indigenous artists.",
    likesCount: 88,
    status: "PUBLISHED",
    createdAt: "2025-01-29T15:10:00.000Z",
    updatedAt: "2025-01-29T15:10:00.000Z",
  },
  {
    id: "exp-009",
    userId: "farhan_mirza",
    userName: "Farhan Mirza",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    destinationId: "gulmarg-valley",
    destinationName: "Gulmarg & Dal Lake",
    territoryId: "JAMMU_KASHMIR",
    territorySlug: "jammu-and-kashmir",
    territoryName: "J&K / Ladakh",
    title: "Meadows of Gold & Floating Shikara Mornings",
    rating: 4.9,
    text: "Waking up to the gentle lap of Dal Lake against our wooden cedar houseboat with steam rising from a brass Samovar of saffron Kahwa. The gondola ride up Apharwat peak in Gulmarg at 14,000 ft offered unobstructed panoramic views of the Pir Panjal range.",
    photos: [
      "/images/Dal Lake & Mughal Gardens.jpeg",
      "/images/Gulmarg (Meadow of Flowers).jpeg",
      "/images/Sonamarg (Meadow of Gold).jpeg"
    ],
    travelTips: "Book Gulmarg Phase 2 Gondola tickets online at least 3 weeks in advance. Try authentic Kashmiri Nadru Yakhni at Lalit or local wazas.",
    likesCount: 276,
    status: "PUBLISHED",
    createdAt: "2025-01-15T08:20:00.000Z",
    updatedAt: "2025-01-15T08:20:00.000Z",
  }
];

const experienceStore = new Map<string, ExperienceRecord>();

// Populate seed records
for (const seed of SEED_EXPERIENCES) {
  experienceStore.set(seed.id, seed);
}

let expIdCounter = 10;

function generateExpId(): string {
  return `exp-${Date.now()}-${(expIdCounter++).toString().padStart(4, '0')}`;
}

export function createExperience(data: Omit<ExperienceRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): ExperienceRecord {
  const id = generateExpId();
  const now = new Date().toISOString();
  
  const record: ExperienceRecord = {
    ...data,
    id,
    likesCount: data.likesCount || 0,
    status: 'PUBLISHED', // Auto-publish for the mock
    createdAt: now,
    updatedAt: now,
  };
  
  experienceStore.set(id, record);
  return record;
}

export function getExperienceById(id: string): ExperienceRecord | undefined {
  return experienceStore.get(id);
}

export function getExperiencesByDestination(destinationId: string): ExperienceRecord[] {
  const results: ExperienceRecord[] = [];
  for (const exp of experienceStore.values()) {
    if ((exp.destinationId === destinationId || exp.destinationId.toLowerCase() === destinationId.toLowerCase()) && exp.status === 'PUBLISHED') {
      results.push(exp);
    }
  }
  // Sort descending by createdAt
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllExperiences(): ExperienceRecord[] {
  const results: ExperienceRecord[] = [];
  for (const exp of experienceStore.values()) {
    if (exp.status === 'PUBLISHED') {
      results.push(exp);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteExperience(id: string): boolean {
  return experienceStore.delete(id);
}


