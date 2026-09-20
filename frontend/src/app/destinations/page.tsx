"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const utParam = searchParams.get("ut");

  // Determine initial territory from searchParams
  const initialTerritoryId = useMemo(() => {
    if (!utParam) return null;
    const match = VERIFIED_TERRITORIES.find(
      (t) =>
        t.id.toLowerCase() === utParam.toLowerCase() ||
        t.code.toLowerCase() === utParam.toLowerCase() ||
        t.slug.toLowerCase() === utParam.toLowerCase()
    );
    return match ? match.id : null;
  }, [utParam]);

  // Active territory ID (e.g. "DELHI", "LADAKH", or null for All Places)
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(initialTerritoryId);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keep state synchronized with URL query changes and scroll completely to top
  useEffect(() => {
    setSelectedTerritoryId(initialTerritoryId);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [initialTerritoryId]);

  // Ensure scroll to top on initial page mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTerritory = (territoryId: string | null) => {
    setSelectedTerritoryId(territoryId);
    setSearchQuery("");
    setActiveCategory("ALL");
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (territoryId) {
      const target = VERIFIED_TERRITORIES.find((t) => t.id === territoryId);
      const slug = target ? target.slug : territoryId.toLowerCase();
      router.push(`/destinations?ut=${encodeURIComponent(slug)}`, { scroll: true });
    } else {
      router.push("/destinations", { scroll: true });
    }
  };

  // Selected territory details
  const currentTerritory = useMemo(() => {
    if (!selectedTerritoryId) return null;
    return (
      VERIFIED_TERRITORIES.find(
        (t) => t.id === selectedTerritoryId || t.code === selectedTerritoryId
      ) || null
    );
  }, [selectedTerritoryId]);

  // Filtered destinations list (ALWAYS SHOWS PLACES, NEVER UT OVERVIEW CARDS)
  const displayedDestinations = useMemo(() => {
    let list = VERIFIED_DESTINATIONS;

    // Filter by territory if a territory filter is active
    if (selectedTerritoryId) {
      list = list.filter(
        (d) =>
          d.territoryId === selectedTerritoryId ||
          (currentTerritory &&
            (d.territoryId === currentTerritory.code || d.territoryId === currentTerritory.id))
      );
    }

    // Filter by category
    if (activeCategory !== "ALL") {
      const cat = activeCategory.toLowerCase();
      list = list.filter(
        (d) =>
          d.type.toLowerCase() === cat ||
          (d.categories && d.categories.some((c) => c.toLowerCase() === cat))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.territoryName.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
          (d.tagline && d.tagline.toLowerCase().includes(q)) ||
          (d.categories && d.categories.some((c) => c.toLowerCase().includes(q))) ||
          (d.highlights && d.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [selectedTerritoryId, currentTerritory, activeCategory, searchQuery]);

  // Suggestions dropdown for quick place navigation
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return VERIFIED_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.territoryName.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Territory counts for the filter chips
  const territoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of VERIFIED_DESTINATIONS) {
      counts[d.territoryId] = (counts[d.territoryId] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <main className="container section-spacing" role="main" style={{ paddingTop: "6rem" }}>
      {/* Top Header Section */}
      <div className="section-header" style={{ marginBottom: "var(--space-xl)" }}>
        {selectedTerritoryId && currentTerritory ? (
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-accent, #FF9933)",
                marginBottom: "8px",
                letterSpacing: "0.05em",
              }}
            >
              <span>📍 Union Territory Places</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginBottom: "8px" }}>
              Places in {currentTerritory.name}
            </h1>
            <p className="lead-text" style={{ maxWidth: "800px" }}>
              {currentTerritory.tagline} • Showing {displayedDestinations.length} verified places
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-accent, #FF9933)",
                marginBottom: "8px",
                letterSpacing: "0.05em",
              }}
            >
              <span>🇮🇳 Verified Tourism Directory</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", marginBottom: "10px" }}>
              Verified Places Across All Union Territories
            </h1>
            <p className="lead-text" style={{ maxWidth: "850px" }}>
              Explore verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments across all 8 Union Territories.
            </p>
          </div>
        )}
      </div>

      {/* Union Territory Filter Chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "var(--space-xl)",
          scrollbarWidth: "none",
        }}
      >
        <button
          onClick={() => handleSelectTerritory(null)}
          className={`btn btn-sm ${!selectedTerritoryId ? "btn-primary" : "btn-outline"}`}
          style={{
            whiteSpace: "nowrap",
            borderRadius: "var(--radius-pill)",
            padding: "8px 18px",
            fontWeight: !selectedTerritoryId ? 700 : 500,
          }}
        >
          All Places ({VERIFIED_DESTINATIONS.length})
        </button>
        {VERIFIED_TERRITORIES.map((t) => {
          const isSelected = selectedTerritoryId === t.id;
          const count = territoryCounts[t.id] || territoryCounts[t.code] || 6;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTerritory(t.id)}
              className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
              style={{
                whiteSpace: "nowrap",
                borderRadius: "var(--radius-pill)",
                padding: "8px 16px",
                fontWeight: isSelected ? 700 : 500,
              }}
            >
              {t.shortName || t.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-lg)",
          marginBottom: "var(--space-2xl)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-md)",
            alignItems: "flex-end",
          }}
        >
          {/* Search Box */}
          <div ref={searchContainerRef} style={{ position: "relative" }}>
            <label
              className="search-label"
              htmlFor="places-search-input"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Search Places
            </label>
            <div
              style={{
                background: "var(--color-bg-surface-elevated)",
                borderRadius: "var(--radius-md)",
                border: isSearchFocused
                  ? "1px solid var(--color-accent, #FF9933)"
                  : "1px solid var(--color-border-subtle)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: "10px",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ opacity: 0.6, flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                id="places-search-input"
                className="search-input"
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                  padding: "10px 0",
                  width: "100%",
                  fontSize: "0.9rem",
                  color: "var(--color-text-primary)",
                }}
                placeholder={
                  currentTerritory
                    ? `Search places in ${currentTerritory.shortName}...`
                    : "Search all places by name, monument, lake..."
                }
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  aria-label="Clear search"
                  style={{
                    border: "none",
                    background: "rgba(0,0,0,0.08)",
                    color: "var(--color-text-secondary)",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  zIndex: 60,
                  background: "var(--color-bg-surface-elevated, #ffffff)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                  maxHeight: "320px",
                  overflowY: "auto",
                }}
              >
                <div style={{ padding: "8px 0" }}>
                  <div
                    style={{
                      padding: "4px 16px 8px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Quick Place Jump
                  </div>
                  {searchSuggestions.map((d) => (
                    <Link
                      key={d.id}
                      href={`/destinations/${d.slug}`}
                      onClick={() => setIsSearchFocused(false)}
                      style={{
                        padding: "10px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--color-bg-surface)")
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.925rem",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {d.name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                          {d.territoryName} • {d.type}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-accent, #FF9933)",
                          fontWeight: 700,
                        }}
                      >
                        Explore →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Dropdown Filter */}
          <div>
            <label
              className="search-label"
              htmlFor="places-category-filter"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Experience / Category
            </label>
            <div style={{ position: "relative" }}>
              <select
                id="places-category-filter"
                className="search-input"
                style={{
                  background: "var(--color-bg-surface-elevated)",
                  padding: "10px 38px 10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  width: "100%",
                  fontSize: "0.9rem",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="ALL">All Place Categories</option>
                <option value="HERITAGE">Heritage & Historic Forts</option>
                <option value="LAKE">Glacial & Urban Lakes</option>
                <option value="ISLAND">Coral Islands & Beaches</option>
                <option value="BEACH">Beaches & Coastal</option>
                <option value="NATURE">Pristine Nature & Wildlife</option>
                <option value="ADVENTURE">Adventure & High Passes</option>
                <option value="SPIRITUAL">Monasteries & Sacred Sites</option>
                <option value="MEMORIAL">National Memorials</option>
              </select>
              <div
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  opacity: 0.7,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || activeCategory !== "ALL" || selectedTerritoryId) && (
            <div>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                  handleSelectTerritory(null);
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PLACES GRID — SHOWS ONLY THE DESTINATION PLACES */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-lg)",
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
            Showing {displayedDestinations.length} {displayedDestinations.length === 1 ? "Place" : "Places"}
          </div>
        </div>

        {displayedDestinations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "var(--space-xl)",
              marginBottom: "var(--space-2xl)",
            }}
          >
            {displayedDestinations.map((dest) => (
              <article
                key={dest.id}
                className="destination-card card-hoverable"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border-subtle)",
                  background: "var(--color-bg-surface-elevated, #ffffff)",
                }}
                onClick={() => router.push(`/destinations/${dest.slug}`)}
              >
                {/* Media Image with Territory & Type Badges */}
                <div
                  className="destination-card-media"
                  style={{ height: "220px", position: "relative", overflow: "hidden" }}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="destination-card-img"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(15, 23, 42, 0.8)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "6px",
                      }}
                    >
                      📍 {dest.territoryName}
                    </span>
                    <span
                      style={{
                        background: "rgba(255, 153, 51, 0.9)",
                        color: "#FFFFFF",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {dest.type}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className="destination-card-body"
                  style={{
                    padding: "var(--space-lg)",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <h2
                    className="destination-card-title"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "var(--color-text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {dest.name}
                  </h2>

                  {dest.tagline && (
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-accent, #B45309)",
                        fontWeight: 600,
                        marginBottom: "10px",
                        lineHeight: 1.4,
                      }}
                    >
                      {dest.tagline}
                    </p>
                  )}

                  <p
                    className="destination-card-desc"
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: "14px",
                      flexGrow: 1,
                    }}
                  >
                    {dest.shortDescription}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginBottom: "14px",
                    }}
                  >
                    {(dest.categories || []).map((c, idx) => (
                      <span
                        key={idx}
                        className="badge badge-neutral"
                        style={{ fontSize: "0.68rem", padding: "2px 8px" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    className="destination-card-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--color-border-subtle)",
                      marginTop: "auto",
                    }}
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="btn btn-sm btn-outline"
                      style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explore Place →
                    </Link>
                    <Link
                      href={`/itinerary?destination=${dest.slug}&territory=${dest.territoryId}`}
                      className="btn btn-sm btn-primary"
                      style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      + Itinerary
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-2xl)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</div>
            <h3>No places match your search criteria.</h3>
            <p style={{ marginTop: "6px" }}>
              Try adjusting your search keyword or clearing the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
                handleSelectTerritory(null);
              }}
              className="btn btn-sm btn-outline"
              style={{ marginTop: "16px" }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Emergency Support Strip when a territory is filtered */}
        {selectedTerritoryId && currentTerritory && (
          <div
            style={{
              background: "var(--color-bg-surface-elevated, #F0EADE)",
              borderRadius: "var(--radius-xl, 20px)",
              padding: "24px 28px",
              marginTop: "var(--space-2xl)",
              borderLeft: "5px solid var(--color-danger, #BA1A1A)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-danger, #BA1A1A)",
                marginBottom: "14px",
                lineHeight: 1.25,
              }}
            >
              Verified Emergency Support for {currentTerritory.name}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              {currentTerritory.emergencyContacts?.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.replace(/[^0-9]/g, "")}`}
                  style={{
                    background: "var(--color-bg-surface, #FFFFFF)",
                    borderRadius: "var(--radius-lg, 12px)",
                    padding: "12px 16px",
                    border: "1px solid var(--color-border-subtle)",
                    textDecoration: "none",
                    display: "block",
                    boxShadow: "var(--shadow-subtle)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      marginBottom: "4px",
                    }}
                  >
                    {contact.name}
                  </div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--color-danger, #BA1A1A)",
                      lineHeight: 1.1,
                    }}
                  >
                    {contact.number}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <main className="container section-spacing" role="main">
          <div className="section-header">
            <h1>Verified Places Across All Union Territories</h1>
            <p className="lead-text">Loading verified destinations across the 8 Union Territories...</p>
          </div>
        </main>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
