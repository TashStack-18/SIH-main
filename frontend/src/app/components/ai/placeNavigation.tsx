"use client";

import React from "react";
import Link from "next/link";

export interface PlaceEntity {
  id: string;
  name: string;
  type: "destination" | "territory";
  url: string;
  icon: string;
  aliases: string[];
}

export const KNOWN_PLACES: PlaceEntity[] = [
  // ==========================================
  // 8 UNION TERRITORIES
  // ==========================================
  {
    id: "ladakh-ut",
    name: "Ladakh",
    type: "territory",
    url: "/destinations?ut=ladakh",
    icon: "🏔️",
    aliases: ["Ladakh", "Leh Ladakh", "UT of Ladakh"],
  },
  {
    id: "andaman-ut",
    name: "Andaman & Nicobar Islands",
    type: "territory",
    url: "/destinations?ut=andaman-and-nicobar",
    icon: "🏝️",
    aliases: [
      "Andaman & Nicobar Islands",
      "Andaman and Nicobar Islands",
      "Andaman & Nicobar",
      "Andaman and Nicobar",
      "Andaman Islands",
      "Andamans",
    ],
  },
  {
    id: "chandigarh-ut",
    name: "Chandigarh",
    type: "territory",
    url: "/destinations?ut=chandigarh",
    icon: "🏛️",
    aliases: ["Chandigarh", "The City Beautiful"],
  },
  {
    id: "dnh-dd-ut",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    type: "territory",
    url: "/destinations?ut=dadra-and-nagar-haveli-and-daman-and-diu",
    icon: "🏖️",
    aliases: [
      "Dadra & Nagar Haveli and Daman & Diu",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Daman & Diu",
      "Daman and Diu",
      "Dadra & Nagar Haveli",
      "Silvassa",
    ],
  },
  {
    id: "delhi-ut",
    name: "Delhi",
    type: "territory",
    url: "/destinations?ut=delhi",
    icon: "🏛️",
    aliases: ["Delhi", "New Delhi", "NCT of Delhi", "National Capital Territory of Delhi"],
  },
  {
    id: "jk-ut",
    name: "Jammu & Kashmir",
    type: "territory",
    url: "/destinations?ut=jammu-and-kashmir",
    icon: "❄️",
    aliases: ["Jammu & Kashmir", "Jammu and Kashmir", "Kashmir Valley", "Kashmir", "Jammu"],
  },
  {
    id: "lakshadweep-ut",
    name: "Lakshadweep",
    type: "territory",
    url: "/destinations?ut=lakshadweep",
    icon: "🪸",
    aliases: ["Lakshadweep", "Lakshadweep Islands", "Lakshadweep Archipelago"],
  },
  {
    id: "puducherry-ut",
    name: "Puducherry",
    type: "territory",
    url: "/destinations?ut=puducherry",
    icon: "🌊",
    aliases: ["Puducherry", "Pondicherry", "Pondi"],
  },

  // ==========================================
  // 48 VERIFIED DESTINATIONS
  // ==========================================
  // Andaman & Nicobar
  {
    id: "cellular-jail",
    name: "Cellular Jail National Memorial",
    type: "destination",
    url: "/destinations/cellular-jail",
    icon: "🏛️",
    aliases: ["Cellular Jail National Memorial", "Cellular Jail", "Kala Pani"],
  },
  {
    id: "radhanagar-beach",
    name: "Radhanagar Beach (Havelock)",
    type: "destination",
    url: "/destinations/radhanagar-beach",
    icon: "🏖️",
    aliases: ["Radhanagar Beach", "Radhanagar", "Havelock Island", "Swaraj Dweep"],
  },
  {
    id: "elephant-beach",
    name: "Elephant Beach",
    type: "destination",
    url: "/destinations/elephant-beach",
    icon: "🤿",
    aliases: ["Elephant Beach"],
  },
  {
    id: "ross-island",
    name: "Ross Island (Netaji Subhash Chandra Bose Island)",
    type: "destination",
    url: "/destinations/ross-island",
    icon: "🏝️",
    aliases: ["Ross Island", "Netaji Subhash Chandra Bose Island"],
  },
  {
    id: "baratang-island",
    name: "Baratang Island & Mud Volcanoes",
    type: "destination",
    url: "/destinations/baratang-island",
    icon: "🛶",
    aliases: ["Baratang Island", "Baratang", "Mud Volcanoes", "Limestone Caves Baratang"],
  },
  {
    id: "neil-island",
    name: "Neil Island (Shaheed Dweep)",
    type: "destination",
    url: "/destinations/neil-island",
    icon: "🐚",
    aliases: ["Neil Island", "Shaheed Dweep", "Bharatpur Beach", "Laxmanpur Beach"],
  },

  // Chandigarh
  {
    id: "rock-garden-chandigarh",
    name: "Rock Garden of Chandigarh",
    type: "destination",
    url: "/destinations/rock-garden-chandigarh",
    icon: "🗿",
    aliases: ["Rock Garden of Chandigarh", "Rock Garden", "Nek Chand's Rock Garden", "Nek Chand Rock Garden"],
  },
  {
    id: "sukhna-lake",
    name: "Sukhna Lake",
    type: "destination",
    url: "/destinations/sukhna-lake",
    icon: "⛵",
    aliases: ["Sukhna Lake"],
  },
  {
    id: "capitol-complex-chandigarh",
    name: "Capitol Complex (UNESCO)",
    type: "destination",
    url: "/destinations/capitol-complex-chandigarh",
    icon: "🏛️",
    aliases: ["Capitol Complex", "Le Corbusier Centre", "Open Hand Monument"],
  },
  {
    id: "rose-garden-chandigarh",
    name: "Zakir Hussain Rose Garden",
    type: "destination",
    url: "/destinations/rose-garden-chandigarh",
    icon: "🌹",
    aliases: ["Zakir Hussain Rose Garden", "Rose Garden Chandigarh", "Rose Garden"],
  },
  {
    id: "govt-museum-chandigarh",
    name: "Govt. Museum & Art Gallery",
    type: "destination",
    url: "/destinations/govt-museum-chandigarh",
    icon: "🎨",
    aliases: [
      "Government Museum & Art Gallery",
      "Govt. Museum & Art Gallery",
      "Government Museum",
      "Govt Museum",
      "Chandigarh Museum",
    ],
  },
  {
    id: "japanese-garden-chandigarh",
    name: "Japanese Garden Chandigarh",
    type: "destination",
    url: "/destinations/japanese-garden-chandigarh",
    icon: "⛩️",
    aliases: ["Japanese Garden Chandigarh", "Japanese Garden"],
  },

  // Dadra & Nagar Haveli and Daman & Diu
  {
    id: "diu-fort",
    name: "Diu Fort & Lighthouse",
    type: "destination",
    url: "/destinations/diu-fort",
    icon: "🏰",
    aliases: ["Diu Fort & Lighthouse", "Diu Fort"],
  },
  {
    id: "ghoghla-beach",
    name: "Ghoghla Beach",
    type: "destination",
    url: "/destinations/ghoghla-beach",
    icon: "🏖️",
    aliases: ["Ghoghla Beach (Blue Flag Certified)", "Ghoghla Beach", "Ghoghla"],
  },
  {
    id: "moti-daman-fort",
    name: "Moti Daman Fort & Cathedral",
    type: "destination",
    url: "/destinations/moti-daman-fort",
    icon: "🏰",
    aliases: ["Moti Daman Fort & Cathedral", "Moti Daman Fort", "Moti Daman", "Bom Jesus Cathedral"],
  },
  {
    id: "nagoa-beach",
    name: "Nagoa Beach",
    type: "destination",
    url: "/destinations/nagoa-beach",
    icon: "🌴",
    aliases: ["Nagoa Beach"],
  },
  {
    id: "satmalia-deer-sanctuary",
    name: "Satmalia Deer Sanctuary",
    type: "destination",
    url: "/destinations/satmalia-deer-sanctuary",
    icon: "🦌",
    aliases: ["Satmalia Deer Sanctuary", "Satmalia"],
  },
  {
    id: "dudhni-lake",
    name: "Dudhni Lake & Water Sports",
    type: "destination",
    url: "/destinations/dudhni-lake",
    icon: "🚤",
    aliases: ["Dudhni Lake & Water Sports Complex", "Dudhni Lake", "Dudhni"],
  },

  // Delhi
  {
    id: "red-fort-delhi",
    name: "Red Fort (Lal Qila)",
    type: "destination",
    url: "/destinations/red-fort-delhi",
    icon: "🏰",
    aliases: ["Red Fort (Lal Qila)", "Red Fort", "Lal Qila"],
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar Complex",
    type: "destination",
    url: "/destinations/qutub-minar",
    icon: "🗼",
    aliases: ["Qutub Minar Complex", "Qutub Minar", "Iron Pillar of Delhi"],
  },
  {
    id: "humayuns-tomb",
    name: "Humayun's Tomb",
    type: "destination",
    url: "/destinations/humayuns-tomb",
    icon: "🕌",
    aliases: ["Humayun's Tomb", "Humayuns Tomb"],
  },
  {
    id: "india-gate",
    name: "India Gate & Kartavya Path",
    type: "destination",
    url: "/destinations/india-gate",
    icon: "🎖️",
    aliases: ["India Gate & Kartavya Path", "India Gate", "Kartavya Path", "National War Memorial"],
  },
  {
    id: "lotus-temple",
    name: "Lotus Temple",
    type: "destination",
    url: "/destinations/lotus-temple",
    icon: "🪷",
    aliases: ["Lotus Temple (Bahá'í House of Worship)", "Lotus Temple", "Bahá'í House of Worship"],
  },
  {
    id: "jantar-mantar-delhi",
    name: "Jantar Mantar",
    type: "destination",
    url: "/destinations/jantar-mantar-delhi",
    icon: "☀️",
    aliases: ["Jantar Mantar"],
  },

  // Jammu & Kashmir
  {
    id: "dal-lake-srinagar",
    name: "Dal Lake & Mughal Gardens",
    type: "destination",
    url: "/destinations/dal-lake-srinagar",
    icon: "🛶",
    aliases: [
      "Dal Lake & Mughal Gardens",
      "Dal Lake",
      "Mughal Gardens",
      "Shalimar Bagh",
      "Nishat Bagh",
      "Floating Vegetable Market",
      "Shikara ride",
    ],
  },
  {
    id: "gulmarg",
    name: "Gulmarg",
    type: "destination",
    url: "/destinations/gulmarg",
    icon: "⛷️",
    aliases: ["Gulmarg (Meadow of Flowers)", "Gulmarg Gondola", "Gulmarg", "Kongdoori", "Apharwat"],
  },
  {
    id: "pahalgam",
    name: "Pahalgam",
    type: "destination",
    url: "/destinations/pahalgam",
    icon: "🌲",
    aliases: ["Pahalgam (Valley of Shepherds)", "Pahalgam", "Betaab Valley", "Aru Valley", "Lidder River"],
  },
  {
    id: "sonamarg",
    name: "Sonamarg",
    type: "destination",
    url: "/destinations/sonamarg",
    icon: "🏔️",
    aliases: ["Sonamarg (Meadow of Gold)", "Sonamarg", "Thajiwas Glacier", "Zoji La"],
  },
  {
    id: "doodhpathri",
    name: "Doodhpathri",
    type: "destination",
    url: "/destinations/doodhpathri",
    icon: "🌿",
    aliases: ["Doodhpathri (Valley of Milk)", "Doodhpathri"],
  },
  {
    id: "gurez-valley",
    name: "Gurez Valley",
    type: "destination",
    url: "/destinations/gurez-valley",
    icon: "⛰️",
    aliases: ["Gurez Valley", "Gurez", "Habba Khatoon Peak", "Habba Khatoon"],
  },

  // Ladakh
  {
    id: "pangong-tso",
    name: "Pangong Tso",
    type: "destination",
    url: "/destinations/pangong-tso",
    icon: "🏔️",
    aliases: ["Pangong Tso", "Pangong Lake", "Pangong", "Spangmik"],
  },
  {
    id: "leh-town",
    name: "Leh Old Town & Palace",
    type: "destination",
    url: "/destinations/leh-town",
    icon: "🏯",
    aliases: ["Leh Old Town & Palace", "Leh Old Town", "Leh Palace", "Leh Town", "Leh", "Shanti Stupa"],
  },
  {
    id: "nubra-valley",
    name: "Nubra Valley & Hunder",
    type: "destination",
    url: "/destinations/nubra-valley",
    icon: "🐪",
    aliases: [
      "Nubra Valley & Hunder Sand Dunes",
      "Nubra Valley",
      "Hunder Sand Dunes",
      "Hunder",
      "Khardung La",
      "Khardung La pass",
      "Turtuk",
      "Diskit",
    ],
  },
  {
    id: "tso-moriri",
    name: "Tso Moriri Lake",
    type: "destination",
    url: "/destinations/tso-moriri",
    icon: "🦅",
    aliases: ["Tso Moriri Lake", "Tso Moriri", "Korzok"],
  },
  {
    id: "zanskar-valley",
    name: "Zanskar Valley & Phugtal",
    type: "destination",
    url: "/destinations/zanskar-valley",
    icon: "🧊",
    aliases: [
      "Zanskar Valley & Phugtal Monastery",
      "Zanskar Valley",
      "Phugtal Monastery",
      "Chadar Trek",
      "Zanskar",
      "Padum",
    ],
  },
  {
    id: "hemis-monastery",
    name: "Hemis Monastery",
    type: "destination",
    url: "/destinations/hemis-monastery",
    icon: "🛕",
    aliases: ["Hemis Monastery", "Hemis Tsechu", "Hemis"],
  },

  // Lakshadweep
  {
    id: "bangaram-island",
    name: "Bangaram Atoll",
    type: "destination",
    url: "/destinations/bangaram-island",
    icon: "🏝️",
    aliases: ["Bangaram Atoll & Kadmat Reef", "Bangaram Atoll", "Bangaram Island", "Bangaram"],
  },
  {
    id: "kavaratti",
    name: "Kavaratti Island",
    type: "destination",
    url: "/destinations/kavaratti",
    icon: "🐠",
    aliases: ["Kavaratti Island", "Kavaratti"],
  },
  {
    id: "agatti-island",
    name: "Agatti Island & Airport",
    type: "destination",
    url: "/destinations/agatti-island",
    icon: "✈️",
    aliases: ["Agatti Island & Airport", "Agatti Island", "Agatti"],
  },
  {
    id: "kadmat-island",
    name: "Kadmat Island",
    type: "destination",
    url: "/destinations/kadmat-island",
    icon: "🤿",
    aliases: ["Kadmat Island", "Kadmat"],
  },
  {
    id: "kalpeni-island",
    name: "Kalpeni Island",
    type: "destination",
    url: "/destinations/kalpeni-island",
    icon: "🛶",
    aliases: ["Kalpeni Island", "Kalpeni"],
  },
  {
    id: "minicoy-island",
    name: "Minicoy Island (Maliku)",
    type: "destination",
    url: "/destinations/minicoy-island",
    icon: "🏮",
    aliases: ["Minicoy Island (Maliku)", "Minicoy Island", "Minicoy", "Maliku"],
  },

  // Puducherry
  {
    id: "french-quarter-puducherry",
    name: "French Quarter (White Town)",
    type: "destination",
    url: "/destinations/french-quarter-puducherry",
    icon: "🥐",
    aliases: [
      "French Quarter (White Town) & Promenade",
      "French Quarter",
      "White Town",
      "Promenade Beach",
      "Goubert Avenue",
      "Rock Beach",
    ],
  },
  {
    id: "auroville",
    name: "Auroville & Matrimandir",
    type: "destination",
    url: "/destinations/auroville",
    icon: "🧘",
    aliases: ["Auroville & Matrimandir", "Auroville", "Matrimandir"],
  },
  {
    id: "paradise-beach",
    name: "Paradise Beach",
    type: "destination",
    url: "/destinations/paradise-beach",
    icon: "🏖️",
    aliases: ["Paradise Beach (Plage Paradiso)", "Paradise Beach", "Plage Paradiso"],
  },
  {
    id: "sri-aurobindo-ashram",
    name: "Sri Aurobindo Ashram",
    type: "destination",
    url: "/destinations/sri-aurobindo-ashram",
    icon: "🌸",
    aliases: ["Sri Aurobindo Ashram", "Aurobindo Ashram"],
  },
  {
    id: "chunnambar-boat-house",
    name: "Chunnambar Boat House",
    type: "destination",
    url: "/destinations/chunnambar-boat-house",
    icon: "🚤",
    aliases: ["Chunnambar Boat House & Backwaters", "Chunnambar Boat House", "Chunnambar"],
  },
  {
    id: "serenity-beach",
    name: "Serenity Beach",
    type: "destination",
    url: "/destinations/serenity-beach",
    icon: "🏄",
    aliases: ["Serenity Beach"],
  },
];

// Compile all aliases for fast regex matching, longest alias first so multi-word aliases match before subsets
interface AliasEntry {
  alias: string;
  regex: RegExp;
  place: PlaceEntity;
}

const COMPILED_ALIASES: AliasEntry[] = (() => {
  const list: AliasEntry[] = [];
  for (const place of KNOWN_PLACES) {
    for (const alias of place.aliases) {
      // Escape regex special chars
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Word boundary matching, case-insensitive
      list.push({
        alias,
        regex: new RegExp(`\\b${escaped}\\b`, "i"),
        place,
      });
    }
  }
  // Sort descending by alias length so "Nubra Valley & Hunder Sand Dunes" matches before "Nubra Valley"
  list.sort((a, b) => b.alias.length - a.alias.length);
  return list;
})();

/**
 * Scans an assistant response text and returns all unique matched places.
 */
export function extractMatchedPlaces(text: string): PlaceEntity[] {
  if (!text) return [];
  const found = new Map<string, PlaceEntity>();

  for (const item of COMPILED_ALIASES) {
    if (item.regex.test(text)) {
      if (!found.has(item.place.id)) {
        found.set(item.place.id, item.place);
      }
    }
  }

  return Array.from(found.values());
}

/**
 * Checks if a specific heading text (e.g. "Pangong Tso" or "Ladakh") corresponds to a known place.
 */
export function findPlaceForHeading(headingText: string): PlaceEntity | null {
  if (!headingText) return null;
  const cleanHeading = headingText.replace(/[#*✦🏔️🏛️🏖️❄️🪸🌊🏝️🗿⛵🌹🎨⛩️🏰🌴🦌🚤🗼🕌🎖️🪷☀️🛶⛷️🌲⛰️🐪🦅🧊🛕🐠✈️🏮🥐🧘🌸🏄:]/g, " ").trim();
  
  for (const item of COMPILED_ALIASES) {
    if (item.regex.test(cleanHeading)) {
      return item.place;
    }
  }
  return null;
}

/**
 * Tokenizes text and wraps matched destination/territory names into interactive, clickable Links.
 */
export function linkifyPlaces(content: string): React.ReactNode[] {
  if (!content) return [];

  // Build a single global regex matching any alias
  const patterns = COMPILED_ALIASES.map(a => a.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const combinedRegex = new RegExp(`\\b(${patterns.join("|")})\\b`, "gi");

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(content)) !== null) {
    const matchStart = match.index;
    const matchEnd = combinedRegex.lastIndex;
    const matchedText = match[0];

    // Push preceding text
    if (matchStart > lastIndex) {
      elements.push(content.substring(lastIndex, matchStart));
    }

    // Find the corresponding place
    const matchedPlace = COMPILED_ALIASES.find(a => 
      a.alias.toLowerCase() === matchedText.toLowerCase()
    )?.place;

    if (matchedPlace) {
      elements.push(
        <Link
          key={`${matchedPlace.id}-${matchStart}`}
          href={matchedPlace.url}
          title={`Click to explore ${matchedPlace.name}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            color: "var(--color-primary-dark, #0284C7)",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            padding: "1px 6px",
            borderRadius: "6px",
            fontWeight: 700,
            textDecoration: "none",
            border: "1px solid rgba(14, 165, 233, 0.25)",
            fontSize: "inherit",
            cursor: "pointer",
            transition: "all 0.15s ease",
            margin: "0 2px",
          }}
          className="hover:bg-sky-200/50 hover:underline hover:scale-105"
        >
          <span>{matchedPlace.icon}</span>
          <span style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {matchedText}
          </span>
          <span style={{ fontSize: "0.7em", opacity: 0.8 }}>↗</span>
        </Link>
      );
    } else {
      elements.push(matchedText);
    }

    lastIndex = matchEnd;
  }

  if (lastIndex < content.length) {
    elements.push(content.substring(lastIndex));
  }

  return elements.length > 0 ? elements : [content];
}

/**
 * Dedicated Interactive Action Bar rendered below assistant messages
 * displaying quick clickable redirection buttons for all places mentioned.
 */
export function QuickPlaceRedirectionStrip({ text }: { text: string }) {
  const places = extractMatchedPlaces(text);
  if (places.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "10px",
        paddingTop: "10px",
        borderTop: "1px dashed var(--color-border-subtle, rgba(0, 0, 0, 0.1))",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-text-muted, #64748B)",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span>📍</span>
        <span>Direct Place Redirects (Click to Open)</span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {places.map((place) => (
          <Link
            key={place.id}
            href={place.url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "20px",
              fontSize: "0.78rem",
              fontWeight: 700,
              textDecoration: "none",
              backgroundColor: place.type === "territory" ? "#FEF3C7" : "#F0F9FF",
              color: place.type === "territory" ? "#92400E" : "#0369A1",
              border: place.type === "territory" ? "1px solid #FCD34D" : "1px solid #BAE6FD",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              cursor: "pointer",
            }}
            className="hover:scale-105 active:scale-95"
          >
            <span>{place.icon}</span>
            <span>{place.name}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>➔</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
