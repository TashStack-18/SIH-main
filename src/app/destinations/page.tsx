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
      t => t.id.toLowerCase() === utParam.toLowerCase() ||
           t.code.toLowerCase() === utParam.toLowerCase() ||
           t.slug.toLowerCase() === utParam.toLowerCase()
    );
    return match ? match.id : null;
  }, [utParam]);

  // Active territory ID (e.g. "DELHI", "LADAKH", or null for the 8 UT cards hub)
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
      const target = VERIFIED_TERRITORIES.find(t => t.id === territoryId);
      const slug = target ? target.slug : territoryId.toLowerCase();
      router.push(`/destinations?ut=${encodeURIComponent(slug)}`, { scroll: true });
    } else {
      router.push("/destinations", { scroll: true });
    }
  };

  // Selected territory details
  const currentTerritory = useMemo(() => {
    if (!selectedTerritoryId) return null;
    return VERIFIED_TERRITORIES.find(
      t => t.id === selectedTerritoryId || t.code === selectedTerritoryId
    ) || null;
  }, [selectedTerritoryId]);

  // Filtered territories for the 8-card hub view
  const filteredTerritories = useMemo(() => {
    if (!searchQuery.trim()) return VERIFIED_TERRITORIES;
    const q = searchQuery.toLowerCase();
    return VERIFIED_TERRITORIES.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.capital.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.popularDestinations.some(p => p.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Global matching destinations across all 8 UTs when searching from the main hub
  const globalMatchingDestinations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return VERIFIED_DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.territoryName.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
      (d.tagline && d.tagline.toLowerCase().includes(q)) ||
      (d.categories && d.categories.some(c => c.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  // Suggestions for global search when typing in the search bar
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return { territories: [], destinations: [] };
    const q = searchQuery.toLowerCase();
    
    const matchingTerritories = VERIFIED_TERRITORIES.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.capital.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchingDestinations = VERIFIED_DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.territoryName.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      (d.shortDescription && d.shortDescription.toLowerCase().includes(q))
    ).slice(0, 6);

    return { territories: matchingTerritories, destinations: matchingDestinations };
  }, [searchQuery]);

  // Filtered destinations when a specific territory is open
  const territoryDestinations = useMemo(() => {
    if (!selectedTerritoryId) return [];
    let list = VERIFIED_DESTINATIONS.filter(
      d => d.territoryId === selectedTerritoryId || 
           (currentTerritory && (d.territoryId === currentTerritory.code || d.territoryId === currentTerritory.id))
    );

    if (activeCategory !== "ALL") {
      list = list.filter(d => 
        d.type.toUpperCase() === activeCategory.toUpperCase() ||
        d.categories.some(c => c.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.categories.some(c => c.toLowerCase() === q || c.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedTerritoryId, currentTerritory, activeCategory, searchQuery]);

  return (
    <main className="container section-spacing" role="main">
      {/* Top Header Section */}
      <div className="section-header" style={{ marginBottom: "var(--space-xl)" }}>
        {selectedTerritoryId && currentTerritory ? (
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginBottom: "8px" }}>
              {currentTerritory.name}
            </h1>
            <p className="lead-text" style={{ maxWidth: "800px" }}>
              {currentTerritory.tagline} • Capital: {currentTerritory.capital}
            </p>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", marginBottom: "10px" }}>
              Destinations Across the 8 UTs
            </h1>
            <p className="lead-text" style={{ maxWidth: "850px" }}>
              Browse verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments organized by Union Territory.
            </p>
          </div>
        )}
      </div>

      {/* Union Territory Quick Selector Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "var(--space-xl)",
          scrollbarWidth: "none"
        }}
      >
        <button
          onClick={() => handleSelectTerritory(null)}
          className={`btn btn-sm ${!selectedTerritoryId ? "btn-primary" : "btn-outline"}`}
          style={{
            whiteSpace: "nowrap",
            borderRadius: "var(--radius-pill)",
            padding: "8px 18px",
            fontWeight: !selectedTerritoryId ? 700 : 500
          }}
        >
          All 8 Union Territories
        </button>
        {VERIFIED_TERRITORIES.map(t => {
          const isSelected = selectedTerritoryId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTerritory(t.id)}
              className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
              style={{
                whiteSpace: "nowrap",
                borderRadius: "var(--radius-pill)",
                padding: "8px 16px",
                fontWeight: isSelected ? 700 : 500
              }}
            >
              {t.shortName || t.name}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: 8 UNION TERRITORY CARDS HUB (When no specific territory is selected) */}
      {!selectedTerritoryId && (
        <section>
          {/* Search bar with Autocomplete Suggestions */}
          <div ref={searchContainerRef} style={{ position: "relative", marginBottom: "var(--space-2xl)" }}>
            <div
              style={{
                background: "var(--color-bg-surface)",
                border: isSearchFocused ? "1px solid var(--stitch-accent, #C88E44)" : "1px solid var(--color-border-subtle)",
                borderRadius: "var(--radius-pill)",
                padding: "10px 18px",
                boxShadow: isSearchFocused ? "0 4px 20px rgba(200, 142, 68, 0.15)" : "var(--shadow-card)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.6, flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search Union Territories by name, capital, or attractions..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "1rem",
                  color: "var(--color-text-primary)",
                  padding: 0
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
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 0.15s ease"
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  zIndex: 60,
                  background: "var(--color-bg-surface-elevated, #ffffff)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                  maxHeight: "380px",
                  overflowY: "auto"
                }}
              >
                {searchSuggestions.territories.length > 0 && (
                  <div style={{ padding: "8px 0" }}>
                    <div style={{ padding: "6px 16px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.05em" }}>
                      Union Territories
                    </div>
                    {searchSuggestions.territories.map(ut => (
                      <div
                        key={ut.id}
                        onClick={() => handleSelectTerritory(ut.id)}
                        style={{
                          padding: "10px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-surface)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "var(--color-text-primary)" }}>{ut.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>Capital: {ut.capital}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--stitch-accent, #C88E44)", fontWeight: 600 }}>Explore →</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchSuggestions.destinations.length > 0 && (
                  <div style={{ padding: "8px 0", borderTop: searchSuggestions.territories.length > 0 ? "1px solid var(--color-border-subtle)" : "none" }}>
                    <div style={{ padding: "6px 16px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.05em" }}>
                      Destinations & Places
                    </div>
                    {searchSuggestions.destinations.map(d => (
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
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-surface)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "var(--color-text-primary)" }}>{d.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>{d.territoryName} • {d.type}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>View Place →</span>
                      </Link>
                    ))}
                  </div>
                )}

                {searchSuggestions.territories.length === 0 && searchSuggestions.destinations.length === 0 && (
                  <div style={{ padding: "20px 16px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                    No territories or places match &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results when searching from main hub */}
          {searchQuery.trim() && globalMatchingDestinations.length > 0 && (
            <div style={{ marginBottom: "var(--space-3xl)" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "var(--space-lg)", color: "var(--color-text-primary)" }}>
                Destinations & Places ({globalMatchingDestinations.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "var(--space-xl)"
                }}
              >
                {globalMatchingDestinations.map(dest => (
                  <article
                    key={dest.id}
                    className="destination-card card-hoverable"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                    onClick={() => router.push(`/destinations/${dest.slug}`)}
                  >
                    <div className="destination-card-media" style={{ height: "220px", position: "relative" }}>
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="destination-card-img"
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div className="destination-card-badges" style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between" }}>
                        <span className="badge badge-neutral" style={{ background: "rgba(0,0,0,0.65)", color: "#ffffff", backdropFilter: "blur(6px)", fontWeight: 700 }}>
                          {dest.type}
                        </span>
                        <span className="badge badge-neutral" style={{ background: "rgba(200, 142, 68, 0.85)", color: "#ffffff", fontSize: "0.7rem", fontWeight: 700 }}>
                          {dest.territoryName}
                        </span>
                      </div>
                    </div>

                    <div className="destination-card-body" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <h2 className="destination-card-title" style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
                        {dest.name}
                      </h2>
                      <p className="destination-card-desc" style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "14px", flexGrow: 1 }}>
                        {dest.shortDescription}
                      </p>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                        {(dest.categories || []).map((c, idx) => (
                          <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                            {c}
                          </span>
                        ))}
                      </div>

                      <div
                        className="destination-card-footer"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "8px",
                          paddingTop: "12px",
                          borderTop: "1px solid var(--color-border-subtle)",
                          marginTop: "auto"
                        }}
                      >
                        <Link
                          href={`/destinations/${dest.slug}`}
                          className="btn btn-sm btn-outline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore Place
                        </Link>
                        <Link
                          href={`/itinerary?destination=${dest.slug}&territory=${dest.territoryId}`}
                          className="btn btn-sm btn-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          + Itinerary
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Union Territories Section (when no search or when matching UTs exist) */}
          {filteredTerritories.length > 0 && (
            <div>
              {searchQuery.trim() && (
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "var(--space-lg)", color: "var(--color-text-primary)" }}>
                  Union Territories ({filteredTerritories.length})
                </h2>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                  gap: "var(--space-xl)"
                }}
              >
                {filteredTerritories.map((ut) => {
                  return (
                    <article
                      key={ut.id}
                      className="card card-hoverable"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        border: "1px solid var(--color-border-subtle)"
                      }}
                      onClick={() => handleSelectTerritory(ut.id)}
                    >
                      {/* Hero Media Thumbnail */}
                      <div style={{ position: "relative", height: "280px", overflow: "hidden", background: "#1a1a1a" }}>
                        <img
                          src={ut.heroImage || ut.thumbnailImage}
                          alt={ut.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease"
                          }}
                          loading="lazy"
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)"
                          }}
                        />
                      </div>

                      {/* Body Content */}
                      <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "6px", color: "var(--color-text-primary)" }}>
                          {ut.name}
                        </h2>
                        <p style={{ fontSize: "0.85rem", color: "var(--stitch-accent, #C88E44)", fontWeight: 600, marginBottom: "10px" }}>
                          {ut.tagline}
                        </p>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.55,
                            marginBottom: "var(--space-md)",
                            flexGrow: 1
                          }}
                        >
                          {ut.shortDescription}
                        </p>

                        {/* Footer CTA */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--color-border-subtle)",
                            marginTop: "auto"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>
                              Best time to visit
                            </div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                              {ut.weatherSnapshot.bestMonths}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTerritory(ut.id);
                            }}
                            className="btn btn-sm btn-primary"
                            style={{ fontWeight: 600, borderRadius: "var(--radius-pill)", padding: "8px 18px" }}
                          >
                            Explore Places →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state when neither destinations nor UTs match query */}
          {searchQuery.trim() && filteredTerritories.length === 0 && globalMatchingDestinations.length === 0 && (
            <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔍</div>
              <h3>No places or Union Territories match &ldquo;{searchQuery}&rdquo;</h3>
              <p style={{ marginTop: "6px" }}>Try searching for a different destination, monument, lake, or territory name.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-sm btn-outline"
                style={{ marginTop: "16px" }}
              >
                Reset Search
              </button>
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: PLACES INSIDE THE SELECTED UNION TERRITORY (e.g., Delhi, Ladakh, etc.) */}
      {selectedTerritoryId && currentTerritory && (
        <section>
          {/* Territory Hero Feature Card - Expanded & Cleaned */}
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginBottom: "var(--space-2xl)",
              minHeight: "480px",
              display: "flex",
              alignItems: "flex-end",
              padding: "56px 40px",
              color: "#ffffff",
              backgroundImage: `url('${currentTerritory.heroImage || currentTerritory.thumbnailImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "var(--shadow-elevated)"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.85) 100%)"
              }}
            />
            <div style={{ position: "relative", zIndex: 2, maxWidth: "880px" }}>
              <h2 style={{ color: "#ffffff", fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>
                All Places in {currentTerritory.name}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "840px", marginBottom: "8px" }}>
                {currentTerritory.description}
              </p>
              <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "1rem", fontWeight: 600 }}>
                Best time to visit: {currentTerritory.weatherSnapshot.bestMonths}
              </p>
            </div>
          </div>

          {/* Place Filter & Search Bar - Cleaned without 'All 8 UTs' button */}
          <div
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-lg)",
              marginBottom: "var(--space-2xl)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "var(--space-md)",
                alignItems: "flex-end"
              }}
            >
              {/* Search within Territory */}
              <div>
                <label className="search-label" htmlFor="territory-place-search" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", display: "block", marginBottom: "6px" }}>
                  Search Places in {currentTerritory.shortName}
                </label>
                <div
                  style={{
                    background: "var(--color-bg-surface-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px"
                  }}
                >
                  <input
                    type="text"
                    id="territory-place-search"
                    className="search-input"
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background: "transparent",
                      padding: "10px 0",
                      width: "100%",
                      fontSize: "0.9rem",
                      color: "var(--color-text-primary)"
                    }}
                    placeholder={`Search in ${currentTerritory.shortName}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
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
                        fontWeight: 700
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Styled Category Dropdown */}
              <div>
                <label className="search-label" htmlFor="territory-category-filter" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", display: "block", marginBottom: "6px" }}>
                  Experience / Category
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="territory-category-filter"
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
                      MozAppearance: "none"
                    }}
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="HERITAGE">Heritage & Monuments</option>
                    <option value="LAKE">Glacial & Urban Lakes</option>
                    <option value="ISLAND">Coral Islands & Atolls</option>
                    <option value="Nature">Pristine Nature</option>
                    <option value="Adventure">Adventure & Trekking</option>
                    <option value="Culture">Culture & Cuisine</option>
                    <option value="Family">Family & Leisure</option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      opacity: 0.7
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Reset action if filtered */}
              {(searchQuery || activeCategory !== "ALL") && (
                <div>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("ALL");
                    }}
                    style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", width: "100%" }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Destinations Grid for Selected Territory */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "var(--space-xl)",
              marginBottom: "var(--space-2xl)"
            }}
          >
            {territoryDestinations.map(dest => (
              <article
                key={dest.id}
                className="destination-card card-hoverable"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onClick={() => router.push(`/destinations/${dest.slug}`)}
              >
                {/* Media banner: type badge only, no UT badge */}
                <div className="destination-card-media" style={{ height: "220px", position: "relative" }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="destination-card-img"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="destination-card-badges" style={{ position: "absolute", top: "12px", left: "12px" }}>
                    <span className="badge badge-neutral" style={{ background: "rgba(0,0,0,0.65)", color: "#ffffff", backdropFilter: "blur(6px)", fontWeight: 700 }}>
                      {dest.type}
                    </span>
                  </div>
                </div>

                {/* Content: Title, description, tags, footer without UT name or Best time */}
                <div className="destination-card-body" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h2 className="destination-card-title" style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
                    {dest.name}
                  </h2>
                  <p className="destination-card-desc" style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "14px", flexGrow: 1 }}>
                    {dest.shortDescription}
                  </p>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                    {dest.categories.map((c, idx) => (
                      <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer: Action buttons aligned right */}
                  <div
                    className="destination-card-footer"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "8px",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--color-border-subtle)",
                      marginTop: "auto"
                    }}
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="btn btn-sm btn-outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explore Place
                    </Link>
                    <Link
                      href={`/itinerary?destination=${dest.slug}&territory=${dest.territoryId}`}
                      className="btn btn-sm btn-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      + Itinerary
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {territoryDestinations.length === 0 && (
            <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)", marginBottom: "var(--space-2xl)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📍</div>
              <h3>No places match your search criteria in {currentTerritory.name}.</h3>
              <p style={{ marginTop: "6px" }}>Try adjusting your search keyword or clearing the category filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="btn btn-sm btn-outline"
                style={{ marginTop: "16px" }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Verified Emergency Support for Current Territory (Positioned at bottom) */}
          <div
            style={{
              background: "var(--color-bg-surface-elevated, #F0EADE)",
              borderRadius: "var(--radius-xl, 20px)",
              padding: "28px 32px",
              marginTop: "var(--space-2xl)",
              borderLeft: "5px solid var(--color-danger, #BA1A1A)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <h3
              className="font-serif"
              style={{
                fontSize: "1.45rem",
                fontWeight: 700,
                color: "var(--color-danger, #BA1A1A)",
                marginBottom: "20px",
                lineHeight: 1.25,
              }}
            >
              Verified Emergency Support for {currentTerritory.name}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {currentTerritory.emergencyContacts?.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.replace(/[^0-9]/g, "")}`}
                  style={{
                    background: "var(--color-bg-surface, #FFFFFF)",
                    borderRadius: "var(--radius-lg, 14px)",
                    padding: "16px 20px",
                    border: "1px solid var(--color-border-subtle)",
                    textDecoration: "none",
                    display: "block",
                    boxShadow: "var(--shadow-subtle)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--color-danger, #BA1A1A)";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                    e.currentTarget.style.boxShadow = "var(--shadow-subtle)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    {contact.name}
                  </div>
                  <div
                    style={{
                      fontSize: "1.45rem",
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

            {currentTerritory.officialPortal && (
              <div style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", marginTop: "12px" }}>
                Official Portal:{" "}
                <a
                  href={currentTerritory.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-text-secondary)",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  {currentTerritory.officialPortal} ↗
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <main className="container section-spacing" role="main">
        <div className="section-header">
          <h1>Destinations Across the 8 UTs</h1>
          <p className="lead-text">Loading verified destinations across the 8 Union Territories...</p>
        </div>
      </main>
    }>
      <DestinationsContent />
    </Suspense>
  );
}
