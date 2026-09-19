"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VERIFIED_TERRITORIES } from "@/src/lib/fixtures";

export function QuickSearchBar() {
  const router = useRouter();
  const [selectedTerritory, setSelectedTerritory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [season, setSeason] = useState("ALL");
  const [style, setStyle] = useState("ALL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedTerritory) params.set("territory", selectedTerritory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (season !== "ALL") params.set("season", season);
    if (style !== "ALL") params.set("style", style);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="floating-search-wrap">
      <form onSubmit={handleSubmit} className="floating-search-card">
        
        {/* Field 1: Union Territory */}
        <div className="search-input-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9C8D7F"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <select
            id="qs-territory-dropdown"
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            aria-label="Select Heritage Territory"
          >
            <option value="">Which Heritage Territory? (All 8 UTs)</option>
            {VERIFIED_TERRITORIES.map((ut) => (
              <option key={ut.id} value={ut.code}>
                {ut.name} ({ut.capital})
              </option>
            ))}
          </select>
        </div>

        {/* Field 2: Dates / Travel Season */}
        <div className="search-input-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9C8D7F"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            aria-label="Select Travel Season"
          >
            <option value="ALL">Dates of Journey (All Seasons)</option>
            <option value="SUMMER">Summer Peak (May – Sep)</option>
            <option value="WINTER">Winter / Autumn (Oct – Mar)</option>
          </select>
        </div>

        {/* Field 3: Cultural Interests & Travel Style */}
        <div className="search-input-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9C8D7F"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M4 22h16"></path>
            <path d="M4 10h16"></path>
            <path d="M12 2L2 7h20L12 2z"></path>
            <path d="M6 10v12"></path>
            <path d="M10 10v12"></path>
            <path d="M14 10v12"></path>
            <path d="M18 10v12"></path>
          </svg>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            aria-label="Select Travel Style"
          >
            <option value="ALL">Cultural Interests (All Styles)</option>
            <option value="Heritage">Heritage Citadels & Forts</option>
            <option value="Adventure">High Altitude Treks & Lakes</option>
            <option value="Nature">Pristine Nature & Star Reserves</option>
            <option value="Relaxed">Island Waters & Coral Lagoons</option>
          </select>
        </div>

        {/* Submit Explore Button */}
        <button type="submit" className="search-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Explore</span>
        </button>
      </form>
    </div>
  );
}
