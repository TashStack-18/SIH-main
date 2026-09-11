"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { BrandLogo } from "./BrandLogo";
import {
  VERIFIED_DESTINATIONS,
  VERIFIED_TERRITORIES,
  VERIFIED_FESTIVALS,
  VERIFIED_BOOKABLE_EXPERIENCES,
  VERIFIED_NATIONAL_CONTACTS,
} from "@/src/lib/fixtures";

interface SearchSuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  category: "UT" | "Destination" | "Festival" | "Booking" | "Safety" | "Tool";
  badge: string;
  href: string;
}

const SITE_PAGES = [
  {
    title: "Interactive 3D Map",
    subtitle: "Explore 8 Union Territories with 3D terrain & verified markers",
    category: "Tool" as const,
    badge: "Interactive Map",
    href: "/map",
    keywords: ["map", "3d", "coordinates", "terrain", "gis", "satellite", "explore"],
  },
  {
    title: "Smart Itinerary Planner",
    subtitle: "Build AI-optimized day-by-day travel schedules across Bharat",
    category: "Tool" as const,
    badge: "Trip Planner",
    href: "/itinerary",
    keywords: ["itinerary", "plan", "trip", "schedule", "planner", "days", "budget", "route"],
  },
  {
    title: "Verified Bookings & E-Tickets",
    subtitle: "Official government ticketing portals and state tourism stays",
    category: "Tool" as const,
    badge: "Official Booking",
    href: "/bookings",
    keywords: ["booking", "ticket", "hotel", "resort", "ferry", "pass", "permit", "stay"],
  },
  {
    title: "Life Safety & SOS Emergency Hub",
    subtitle: "24x7 trauma centers, national helplines (112, 1363) & travel advisories",
    category: "Tool" as const,
    badge: "Emergency 24x7",
    href: "/safety",
    keywords: ["safety", "emergency", "sos", "police", "helpline", "hospital", "ambulance", "112", "1363", "advisory"],
  },
  {
    title: "2026 Cultural Festival Calendar",
    subtitle: "Verified festival schedules directly from UT Tourism departments",
    category: "Tool" as const,
    badge: "2026 Calendar",
    href: "/festivals",
    keywords: ["festival", "event", "culture", "calendar", "dance", "celebration", "hemis", "tulip"],
  },
  {
    title: "All Verified Destinations Hub",
    subtitle: "Browse 40+ curated attractions across all 8 Union Territories",
    category: "Tool" as const,
    badge: "Explore All",
    href: "/destinations",
    keywords: ["destinations", "places", "attractions", "beaches", "forts", "monasteries", "all"],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("bsy_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Reset search state on route change
  useEffect(() => {
    setIsSearchFocused(false);
    setSelectedIndex(-1);
  }, [pathname]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bsy_theme", theme);
  };

  // Comprehensive multi-dataset live suggestions computation
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchSuggestionItem[] = [];

    // 1. Union Territories
    VERIFIED_TERRITORIES.forEach((t) => {
      const matchScore =
        (t.name.toLowerCase().includes(q) ? 10 : 0) +
        (t.shortName.toLowerCase().includes(q) ? 8 : 0) +
        (t.capital.toLowerCase().includes(q) ? 6 : 0) +
        (t.popularDestinations?.some((p) => p.toLowerCase().includes(q)) ? 5 : 0) +
        (t.tagline.toLowerCase().includes(q) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `ut-${t.id}`,
          title: t.name,
          subtitle: `Capital: ${t.capital} • ${t.tagline}`,
          category: "UT",
          badge: "Union Territory",
          href: `/destinations?ut=${t.slug}`,
        });
      }
    });

    // 2. Destinations & Attractions
    VERIFIED_DESTINATIONS.forEach((d) => {
      const matchScore =
        (d.name.toLowerCase().includes(q) ? 10 : 0) +
        (d.type?.toLowerCase().includes(q) ? 6 : 0) +
        (d.territoryName?.toLowerCase().includes(q) ? 5 : 0) +
        (d.shortDescription?.toLowerCase().includes(q) ? 4 : 0) +
        (d.highlights?.some((h) => h.toLowerCase().includes(q)) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `dest-${d.id}`,
          title: d.name,
          subtitle: `${d.territoryName} • ${d.type}`,
          category: "Destination",
          badge: d.type || "Attraction",
          href: `/destinations/${d.slug}`,
        });
      }
    });

    // 3. Cultural Festivals
    VERIFIED_FESTIVALS.forEach((f) => {
      const matchScore =
        (f.name.toLowerCase().includes(q) ? 10 : 0) +
        (f.location?.toLowerCase().includes(q) ? 6 : 0) +
        (f.territoryName?.toLowerCase().includes(q) ? 5 : 0) +
        (f.category?.toLowerCase().includes(q) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `fest-${f.id}`,
          title: f.name,
          subtitle: `${f.displayDate} • ${f.location} (${f.territoryName})`,
          category: "Festival",
          badge: "Festival",
          href: "/festivals",
        });
      }
    });

    // 4. Bookable Experiences & Passes
    VERIFIED_BOOKABLE_EXPERIENCES.forEach((b) => {
      const matchScore =
        (b.title.toLowerCase().includes(q) ? 10 : 0) +
        (b.location?.toLowerCase().includes(q) ? 5 : 0) +
        (b.providerName?.toLowerCase().includes(q) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `booking-${b.id}`,
          title: b.title,
          subtitle: `${b.location} • Official Provider: ${b.providerName}`,
          category: "Booking",
          badge: "E-Ticket",
          href: "/bookings",
        });
      }
    });

    // 5. Emergency Helplines & Safety Contacts
    VERIFIED_NATIONAL_CONTACTS.forEach((c, idx) => {
      const matchScore =
        (c.service.toLowerCase().includes(q) ? 10 : 0) +
        (c.number.toLowerCase().includes(q) ? 10 : 0) +
        (c.category?.toLowerCase().includes(q) ? 6 : 0) +
        (c.description?.toLowerCase().includes(q) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `safety-${idx}`,
          title: `${c.service} (${c.number})`,
          subtitle: `${c.category} • ${c.description}`,
          category: "Safety",
          badge: "Emergency Helpline",
          href: "/safety",
        });
      }
    });

    // 6. Site Tools & Key Pages
    SITE_PAGES.forEach((p, idx) => {
      const matchScore =
        (p.title.toLowerCase().includes(q) ? 10 : 0) +
        (p.keywords.some((k) => k.includes(q)) ? 8 : 0) +
        (p.subtitle.toLowerCase().includes(q) ? 4 : 0);

      if (matchScore > 0) {
        results.push({
          id: `page-${idx}`,
          title: p.title,
          subtitle: p.subtitle,
          category: "Tool",
          badge: p.badge,
          href: p.href,
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      router.push(suggestions[selectedIndex].href);
      setIsSearchFocused(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    } else {
      router.push("/destinations");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Itinerary", href: "/itinerary" },
    { label: "Map", href: "/map" },
    { label: "Booking", href: "/bookings" },
  ];

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`navbar fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent ? "navbar-transparent" : "navbar-scrolled"}`}
      style={{
        background: isTransparent
          ? "transparent"
          : isDark
          ? "rgba(19, 27, 46, 0.94)"
          : "rgba(250, 247, 242, 0.94)",
        backdropFilter: isTransparent ? "none" : "blur(14px)",
        WebkitBackdropFilter: isTransparent ? "none" : "blur(14px)",
        borderBottom: isTransparent ? "none" : "1px solid var(--color-border-subtle)",
        boxShadow: isScrolled ? "0 10px 30px -15px rgba(0, 0, 0, 0.2)" : "none",
      }}
      role="banner"
    >
      <div
        className="navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "72px",
          width: "100%",
          maxWidth: "100%",
          padding: "0 clamp(16px, 2.5vw, 28px)",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Left Corner: Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", zIndex: 2 }}>
          <BrandLogo size="md" textColor={isTransparent ? "#FFFFFF" : undefined} />
        </div>

        {/* Desktop Navigation Links — Exactly Centered on the Screen */}
        <nav
          className="nav-links"
          role="navigation"
          aria-label="Main Navigation"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "4px",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  color: isTransparent
                    ? "#FFFFFF"
                    : isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  background: isTransparent
                    ? isActive
                    ? "rgba(255, 255, 255, 0.22)"
                    : "transparent"
                    : isActive
                    ? "rgba(200, 142, 68, 0.12)"
                    : "transparent",
                  border: isTransparent && isActive ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
                  backdropFilter: isTransparent && isActive ? "blur(8px)" : "none",
                  WebkitBackdropFilter: isTransparent && isActive ? "blur(8px)" : "none",
                  borderRadius: "var(--radius-pill, 9999px)",
                  textShadow: isTransparent ? "0 1px 4px rgba(0, 0, 0, 0.6)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Corner: Universal Search Bar with Live Suggestions */}
        <div
          ref={searchContainerRef}
          className="navbar-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 30,
            marginLeft: "auto",
            position: "relative",
          }}
        >
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: isTransparent
                ? "rgba(255, 255, 255, 0.18)"
                : isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(45, 27, 20, 0.05)",
              border: isTransparent
                ? "1px solid rgba(255, 255, 255, 0.32)"
                : "1px solid var(--color-border-subtle)",
              backdropFilter: isTransparent ? "blur(12px)" : "none",
              WebkitBackdropFilter: isTransparent ? "blur(12px)" : "none",
              borderRadius: "var(--radius-pill, 9999px)",
              padding: "7px 14px",
              gap: "8px",
              width: "280px",
              transition: "all 0.25s ease",
              position: "relative",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{
                color: isTransparent ? "rgba(255, 255, 255, 0.85)" : "var(--color-text-muted)",
                flexShrink: 0,
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search everything across Bharat..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "0.85rem",
                color: isTransparent ? "#FFFFFF" : "var(--color-text-primary)",
                width: "100%",
              }}
              className={isTransparent ? "hero-search-input" : ""}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchFocused(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isTransparent ? "#FFFFFF" : "var(--color-text-muted)",
                  padding: "0 2px",
                  fontSize: "0.8rem",
                  lineHeight: 1,
                }}
                aria-label="Clear Search"
              >
                ✕
              </button>
            )}
          </form>

          {/* Real-time Universal Suggestions Dropdown Menu */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "min(440px, 92vw)",
                maxHeight: "440px",
                overflowY: "auto",
                background: isDark
                  ? "rgba(19, 27, 46, 0.98)"
                  : "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--radius-xl, 16px)",
                boxShadow: "0 18px 45px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(200, 142, 68, 0.15)",
                zIndex: 100,
                padding: "8px 0",
              }}
            >
              {suggestions.length > 0 ? (
                <>
                  <div
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--color-brand-accent, #C88E44)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    Instant Results ({suggestions.length})
                  </div>

                  <div style={{ padding: "4px 0" }}>
                    {suggestions.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsSearchFocused(false)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          style={{
                            display: "block",
                            padding: "9px 16px",
                            textDecoration: "none",
                            background: isSelected
                              ? isDark
                                ? "rgba(200, 142, 68, 0.22)"
                                : "rgba(200, 142, 68, 0.14)"
                              : "transparent",
                            transition: "background 0.15s ease",
                            borderLeft: isSelected ? "3px solid var(--color-brand-accent, #C88E44)" : "3px solid transparent",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                            <span
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.title}
                            </span>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                padding: "2px 7px",
                                borderRadius: "4px",
                                background: "rgba(200, 142, 68, 0.15)",
                                color: "var(--color-brand-accent, #C88E44)",
                                flexShrink: 0,
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                              }}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "0.775rem",
                              color: "var(--color-text-secondary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.subtitle}
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Full Search Page Action Footer */}
                  <div
                    style={{
                      borderTop: "1px solid var(--color-border-subtle)",
                      padding: "8px 16px 4px",
                      marginTop: "4px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setIsSearchFocused(false);
                      }}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-brand-accent, #C88E44)",
                        fontSize: "0.825rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 0",
                      }}
                    >
                      <span>View all search results for &ldquo;{searchQuery}&rdquo;</span>
                      <span>→</span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                    No exact instant matches
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                    Try searching by territory, destination name, festival, or helpline.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchFocused(false);
                    }}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: "0.8rem", width: "100%" }}
                  >
                    Search full site database for &ldquo;{searchQuery}&rdquo; →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Profile */}
          <Link
            href="/profile"
            className="btn btn-sm btn-ghost btn-icon-only rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)]"
            aria-label="User Profile"
            style={{
              color: isTransparent ? "#FFFFFF" : "var(--color-text-primary)",
              background: isTransparent ? "rgba(255, 255, 255, 0.16)" : "transparent",
              border: isTransparent ? "1px solid rgba(255, 255, 255, 0.25)" : "none",
              backdropFilter: isTransparent ? "blur(8px)" : "none",
              WebkitBackdropFilter: isTransparent ? "blur(8px)" : "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Dark/Light Theme Switcher */}
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-icon-only rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)]"
            onClick={toggleTheme}
            aria-label={`Toggle ${isDark ? "Light" : "Dark"} Mode`}
            style={{
              color: isTransparent ? "#FFFFFF" : "var(--color-text-primary)",
              background: isTransparent ? "rgba(255, 255, 255, 0.16)" : "transparent",
              border: isTransparent ? "1px solid rgba(255, 255, 255, 0.25)" : "none",
              backdropFilter: isTransparent ? "blur(8px)" : "none",
              WebkitBackdropFilter: isTransparent ? "blur(8px)" : "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
