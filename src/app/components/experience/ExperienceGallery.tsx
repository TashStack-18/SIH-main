"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";
import type { ExperienceRecord } from "@/src/lib/api/experienceStore";

const UT_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Andaman & Nicobar", value: "andaman-and-nicobar", aliases: ["ANDAMAN_NICOBAR", "Andaman & Nicobar Islands", "Andaman & Nicobar"] },
  { label: "Chandigarh", value: "chandigarh", aliases: ["CHANDIGARH", "Chandigarh"] },
  { label: "Dadra & Nagar Haveli", value: "dadra-nagar-haveli", aliases: ["DADRA_NAGAR_HAVELI", "Dadra & Nagar Haveli"] },
  { label: "Daman & Diu", value: "daman-diu", aliases: ["DAMAN_DIU", "Daman & Diu"] },
  { label: "Delhi", value: "delhi", aliases: ["DELHI", "Delhi", "National Capital Territory of Delhi"] },
  { label: "J&K / Ladakh", value: "jk-ladakh", aliases: ["JAMMU_KASHMIR", "LADAKH", "Jammu & Kashmir", "Ladakh", "J&K / Ladakh"] },
  { label: "Lakshadweep", value: "lakshadweep", aliases: ["LAKSHADWEEP", "Lakshadweep Islands", "Lakshadweep"] },
  { label: "Puducherry", value: "puducherry", aliases: ["PUDUCHERRY", "Puducherry", "Pondicherry"] },
];

export function ExperienceGallery() {
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters, search, sort
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "highest_rated" | "most_popular">("latest");

  // Favorites state (persisted in localStorage)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Quick Share Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDestinationId, setFormDestinationId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState("");
  const [formTips, setFormTips] = useState("");
  const [formUserName, setFormUserName] = useState("");
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load experiences & favorites
  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch("/api/v1/experience");
        if (!res.ok) throw new Error("Failed to fetch experiences");
        const data = await res.json();
        if (data.success) {
          setExperiences(data.data.experiences || []);
        } else {
          throw new Error(data.error?.message || "Unknown error");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();

    try {
      const saved = localStorage.getItem("dishaara_fav_experiences");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = !favorites[id];
    setFavorites((prev) => {
      const next = { ...prev, [id]: nextVal };
      try {
        localStorage.setItem("dishaara_fav_experiences", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Optimistically update likes count
    setExperiences((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentLikes = item.likesCount || 0;
          return {
            ...item,
            likesCount: nextVal ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          };
        }
        return item;
      })
    );
  };

  // Delete experience handler
  const handleDeleteExperience = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!window.confirm("Are you sure you want to remove this travel experience?")) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/experience/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete experience");
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to remove experience");
    }
  };

  // Compute dynamic stats
  const avgRating = useMemo(() => {
    if (!experiences.length) return "4.8";
    const sum = experiences.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    return (sum / experiences.length).toFixed(1);
  }, [experiences]);

  // Handle Photo selection in modal
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setFormPhotos((prev) => [...prev, ...urls].slice(0, 5));
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDestinationId) return setFormError("Please choose a destination.");
    if (!formText.trim()) return setFormError("Please share your experience.");

    setFormSubmitting(true);
    setFormError(null);

    const selectedDest = VERIFIED_DESTINATIONS.find((d) => d.id === formDestinationId);

    try {
      const defaultPhoto = selectedDest?.image || "/images/Pangong Tso.jpeg";
      const payload = {
        destinationId: formDestinationId,
        destinationName: selectedDest?.name || "Verified Bharat Destination",
        territoryId: selectedDest?.territoryId || "UT",
        territoryName: selectedDest?.territoryName || "Union Territory",
        title: formTitle.trim() || (selectedDest ? `Memories from ${selectedDest.name}` : "My Bharat Journey"),
        rating: formRating,
        text: formText,
        travelTips: formTips.trim() || undefined,
        photos: formPhotos.length > 0 ? formPhotos : [defaultPhoto],
        userId: formUserName.trim().toLowerCase().replace(/\s+/g, "_") || "community_traveler",
        userName: formUserName.trim() || "Community Traveler",
        userAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      };

      const res = await fetch("/api/v1/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to submit story");

      if (data.success && data.data.experience) {
        setExperiences((prev) => [data.data.experience, ...prev]);
        setFormSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(false);
          setFormDestinationId("");
          setFormTitle("");
          setFormText("");
          setFormTips("");
          setFormUserName("");
          setFormPhotos([]);
        }, 1200);
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to submit experience");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter & Search & Sort logic
  const filteredExperiences = useMemo(() => {
    let result = [...experiences];

    // Filter by Territory
    if (activeFilter !== "ALL") {
      const selectedFilterObj = UT_FILTERS.find((f) => f.value === activeFilter);
      const aliases = selectedFilterObj?.aliases || [activeFilter];

      result = result.filter((exp) => {
        const dest = VERIFIED_DESTINATIONS.find((d) => d.id === exp.destinationId);
        const terrName = (exp.territoryName || dest?.territoryName || "").toLowerCase();
        const terrId = (exp.territoryId || dest?.territoryId || "").toLowerCase();
        const terrSlug = (exp.territorySlug || "").toLowerCase();

        return aliases.some((alias) => {
          const a = alias.toLowerCase();
          return (
            terrName.includes(a) ||
            terrId === a ||
            terrSlug.includes(a) ||
            (activeFilter === "jk-ladakh" && (terrId.includes("ladakh") || terrId.includes("jammu") || terrName.includes("ladakh") || terrName.includes("kashmir"))) ||
            (activeFilter === "dadra-nagar-haveli" && (terrName.includes("dadra") || terrId.includes("dnh"))) ||
            (activeFilter === "daman-diu" && (terrName.includes("daman") || terrName.includes("diu") || terrId.includes("dnh")))
          );
        });
      });
    }

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((exp) => {
        const dest = VERIFIED_DESTINATIONS.find((d) => d.id === exp.destinationId);
        const titleMatch = (exp.title || "").toLowerCase().includes(q);
        const textMatch = (exp.text || "").toLowerCase().includes(q);
        const userMatch = (exp.userName || exp.userId || "").toLowerCase().includes(q);
        const destMatch = (dest?.name || exp.destinationName || "").toLowerCase().includes(q);
        const terrMatch = (dest?.territoryName || exp.territoryName || "").toLowerCase().includes(q);
        const tipsMatch = (exp.travelTips || "").toLowerCase().includes(q);

        return titleMatch || textMatch || userMatch || destMatch || terrMatch || tipsMatch;
      });
    }

    // Sorting
    if (sortBy === "highest_rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "most_popular") {
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else {
      // Latest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [experiences, activeFilter, searchQuery, sortBy]);

  return (
    <div className="exp-wrapper">
      {/* BACKGROUND TOPOGRAPHIC & CONTOUR LINES */}
      <div className="exp-bg-topo" aria-hidden="true">
        <svg style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo-pattern" width="600" height="600" patternUnits="userSpaceOnUse">
              <path d="M 50 150 Q 150 50 300 120 T 550 180 M 30 250 Q 180 140 320 230 T 580 260 M 70 380 Q 220 280 370 360 T 590 400 M 20 480 Q 160 410 330 470 T 570 510" fill="none" stroke="#172B5B" strokeWidth="1.5" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="#172B5B" strokeWidth="1" />
              <circle cx="450" cy="380" r="110" fill="none" stroke="#172B5B" strokeWidth="1" />
              <path d="M 120 50 L 140 80 L 160 50 Z M 480 200 L 500 230 L 520 200 Z" fill="none" stroke="#172B5B" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo-pattern)" />
        </svg>
      </div>

      {/* =========================================================================
          1. HERO SECTION (EDITORIAL & POLAROID SCRAPBOOK COLLAGE)
          ========================================================================= */}
      <section className="exp-hero-section">
        <div className="exp-hero-grid">
          
          {/* Left Column: Heading, Copy, Stats, Primary CTA */}
          <div className="exp-hero-content">
            
            {/* Main Editorial Heading */}
            <h1 className="exp-hero-title">
              Experience India,<br />
              <span className="exp-hero-title-italic">Through Travelers' Eyes</span>
            </h1>

            {/* Supporting Text */}
            <p className="exp-hero-desc">
              Real stories, verified tips, and authentic photography from travelers exploring the Union Territories. Discover hidden gems, read practical recommendations, and document your own journey to help the community.
            </p>

            {/* 2. COMMUNITY STATISTICS */}
            <div className="exp-stats-container">
              <div className="exp-stat-item">
                <div className="exp-stat-header">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#159BC5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span className="exp-stat-num">500+</span>
                </div>
                <span className="exp-stat-label">Travel Stories</span>
              </div>

              <div className="exp-stat-item">
                <div className="exp-stat-header">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#159BC5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="exp-stat-num">2.1K</span>
                </div>
                <span className="exp-stat-label">Community</span>
              </div>

              <div className="exp-stat-item">
                <div className="exp-stat-header">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#D4A94E" stroke="#D4A94E" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="exp-stat-num">{avgRating}</span>
                </div>
                <span className="exp-stat-label">Avg Rating</span>
              </div>

              <div className="exp-stat-item">
                <div className="exp-stat-header">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#159BC5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span className="exp-stat-num">1.2K+</span>
                </div>
                <span className="exp-stat-label">Photos Shared</span>
              </div>
            </div>

            {/* 3. PRIMARY CTA WITH HANDWRITTEN ANNOTATION */}
            <div className="exp-cta-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="exp-primary-btn"
              >
                <span style={{ fontSize: '1.1rem' }}>↑</span>
                <span>SHARE YOUR EXPERIENCE</span>
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </button>

              {/* Handwritten annotation beside button */}
              <div className="exp-cta-annotation">
                <svg 
                  width="42" 
                  height="30" 
                  viewBox="0 0 48 36" 
                  fill="none" 
                  className="exp-arrow-svg"
                >
                  <path 
                    d="M 42 28 C 30 32, 16 26, 8 10 M 8 10 L 16 10 M 8 10 L 8 18" 
                    stroke="currentColor" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                <span className="exp-handwritten-cta-text">
                  Your story inspires<br />the next traveler!
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: POLAROID SCRAPBOOK COLLAGE */}
          <div className="exp-hero-collage">

            {/* POLAROID 1: Beach (Andaman/Lakshadweep) */}
            <div className="exp-polaroid exp-polaroid-1" onClick={() => setActiveFilter("andaman-and-nicobar")}>
              <div className="exp-polaroid-tape"></div>
              <div className="exp-polaroid-img-box">
                <img 
                  src="/images/Andaman and Nicobar Islands_hero.jpeg" 
                  alt="Havelock Turquoise Waters" 
                  className="exp-polaroid-img"
                />
              </div>
              <div className="exp-polaroid-caption">
                Havelock turquoise breeze 🌊
              </div>
            </div>

            {/* POLAROID 2: Mountain (Ladakh) */}
            <div className="exp-polaroid exp-polaroid-2" onClick={() => setActiveFilter("jk-ladakh")}>
              <div className="exp-polaroid-tape" style={{ transform: 'translateX(-50%) rotate(4deg)' }}></div>
              <div className="exp-polaroid-img-box">
                <img 
                  src="/images/Pangong Tso.jpeg" 
                  alt="Pangong Lake Ladakh" 
                  className="exp-polaroid-img"
                />
              </div>
              <div className="exp-polaroid-caption">
                Pangong stillness at 14,000 ft ✨
              </div>
            </div>

            {/* POLAROID 3: Heritage / Cultural (Puducherry) */}
            <div className="exp-polaroid exp-polaroid-3" onClick={() => setActiveFilter("puducherry")}>
              <div className="exp-polaroid-img-box">
                <img 
                  src="/images/French Quarter (White Town) & Promenade.jpeg" 
                  alt="White Town Pondicherry" 
                  className="exp-polaroid-img"
                />
              </div>
              <div className="exp-polaroid-caption">
                Bougainvillea & filter coffee ☕
              </div>
            </div>

            {/* Handwritten Note: Bottom Right */}
            <div className="exp-note-bottomright">
              "Different places.<br />Same beautiful people."
            </div>

            {/* CIRCULAR STAMP / BADGE: Real People • Real Stories • Real Bharat */}
            <div className="exp-stamp-badge">
              <svg viewBox="0 0 100 100" className="exp-spin-text">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', fill: '#F7F6F1', textTransform: 'uppercase' }}>
                  <textPath xlinkHref="#circlePath">
                    REAL PEOPLE • REAL STORIES • REAL BHARAT •
                  </textPath>
                </text>
              </svg>
              <div className="exp-stamp-center">
                <span style={{ fontSize: '18px' }}>🇮🇳</span>
                <span style={{ fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#159BC5' }}>JOURNAL</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DISCOVERY TOOLBAR (FILTER PILLS + SEARCH + SORTING)
          ========================================================================= */}
      <section className="exp-toolbar-container">
        <div className="exp-toolbar">
          
          {/* Filter Pills (Horizontally scrollable on mobile) */}
          <div className="exp-filter-pills">
            {UT_FILTERS.map((f) => {
              const isActive = activeFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  className={`exp-pill-btn ${isActive ? 'active' : 'inactive'}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Row */}
          <div className="exp-search-sort-row">
            
            {/* Search Bar */}
            <div className="exp-search-box">
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="exp-search-input"
              />
              <svg
                className="exp-search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="exp-clear-search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="exp-sort-box">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="exp-sort-select"
              >
                <option value="latest">Latest</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="most_popular">Most Popular</option>
              </select>
              <div className="exp-sort-arrow">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. & 6. EXPERIENCE CARD GRID (4 COLS DESKTOP, 2 TABLET, 1 MOBILE)
          ========================================================================= */}
      {loading ? (
        <div className="exp-grid" style={{ padding: '32px 0' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="exp-card" style={{ opacity: 0.7 }}>
              <div className="exp-card-image-box" style={{ backgroundColor: '#E8E6DF' }}></div>
              <div className="exp-card-body" style={{ gap: '12px' }}>
                <div style={{ height: '14px', width: '40%', backgroundColor: '#E8E6DF', borderRadius: '4px' }}></div>
                <div style={{ height: '22px', width: '80%', backgroundColor: '#E8E6DF', borderRadius: '4px' }}></div>
                <div style={{ height: '40px', width: '100%', backgroundColor: '#E8E6DF', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #FCA5A5', color: '#BA1A1A' }}>
          <p style={{ fontWeight: 700, marginBottom: '8px' }}>Failed to load experiences</p>
          <p style={{ fontSize: '0.85rem', color: '#7980A3', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="exp-primary-btn"
            style={{ padding: '8px 20px', fontSize: '0.8rem' }}
          >
            Retry
          </button>
        </div>
      ) : filteredExperiences.length === 0 ? (
        /* =========================================================================
           9. POLISHED EMPTY STATE
           ========================================================================= */
        <div className="exp-empty-container">
          <div className="exp-empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <h3 className="exp-empty-title">
            Be the first traveler to share your story.
          </h3>
          <p className="exp-empty-text">
            {searchQuery || activeFilter !== "ALL"
              ? "No experiences matched your current filters. Try resetting the search or share a new story!"
              : "Your experience could help someone discover a new side of Bharat."}
          </p>
          <div className="exp-empty-actions">
            {(searchQuery || activeFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("ALL");
                  setSearchQuery("");
                }}
                className="exp-pill-btn inactive"
                style={{ padding: '12px 24px' }}
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="exp-primary-btn"
              style={{ padding: '12px 28px' }}
            >
              Share Your Experience →
            </button>
          </div>
        </div>
      ) : (
        /* EXPERIENCE CARDS GRID */
        <div className="exp-grid">
          {filteredExperiences.map((exp) => {
            const dest = VERIFIED_DESTINATIONS.find((d) => d.id === exp.destinationId);
            const destinationTitle = exp.title || (dest ? dest.name : "Bharat Travel Story");
            const territoryLabel = exp.territoryName || dest?.territoryName || "Union Territory";
            const photoSrc = exp.photos?.[0] || dest?.image || "/images/Andaman and Nicobar Islands_hero.jpeg";
            const isFav = !!favorites[exp.id];
            const dateStr = new Date(exp.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const travelerDisplayName = exp.userName || (exp.userId === "anonymous_traveler" ? "Anonymous" : exp.userId);

            return (
              <article key={exp.id} className="exp-card">
                
                {/* Card Image Area */}
                <div className="exp-card-image-box">
                  <img
                    src={photoSrc}
                    alt={destinationTitle}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/Andaman and Nicobar Islands_hero.jpeg";
                    }}
                    className="exp-card-img"
                  />

                  {/* Gradient Overlay */}
                  <div className="exp-card-gradient"></div>

                  {/* Union Territory Badge */}
                  <div className="exp-card-badge">
                    {territoryLabel}
                  </div>

                  {/* Remove/Delete Experience Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteExperience(exp.id, e)}
                    title="Remove experience"
                    aria-label="Remove experience"
                    className="exp-delete-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>

                  {/* Interactive Favorite / Heart Icon */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(exp.id, e)}
                    aria-label="Save to favorites"
                    className={`exp-heart-btn ${isFav ? 'is-fav' : 'not-fav'}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFav ? "#EF4444" : "none"}
                      stroke={isFav ? "#EF4444" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {/* Multiple Photos indicator */}
                  {exp.photos && exp.photos.length > 1 && (
                    <div className="exp-card-photos-count">
                      1/{exp.photos.length}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="exp-card-body">
                  
                  {/* Destination Sub-title + Star Rating */}
                  <div className="exp-card-meta">
                    <span className="exp-card-dest-name">
                      {dest?.name || exp.destinationName || "Verified Destination"}
                    </span>
                    <div className="exp-card-rating">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4A94E" stroke="#D4A94E" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="exp-card-rating-num">
                        {(exp.rating || 5).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Experience Title */}
                  <h3 className="exp-card-title">
                    <Link href={`/experience/${exp.id}`}>
                      {destinationTitle}
                    </Link>
                  </h3>

                  {/* Short Story Snippet */}
                  <p className="exp-card-quote">
                    "{exp.text}"
                  </p>

                  {/* Optional Travel Tip */}
                  {exp.travelTips && (
                    <div className="exp-card-tip">
                      <strong style={{ color: '#159BC5' }}>💡 Tip: </strong>
                      {exp.travelTips}
                    </div>
                  )}

                  {/* Traveler Details & Read Story CTA */}
                  <div className="exp-card-footer">
                    <div className="exp-card-author">
                      {exp.userAvatar ? (
                        <img
                          src={exp.userAvatar}
                          alt={travelerDisplayName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                          }}
                          className="exp-card-avatar"
                        />
                      ) : (
                        <div className="exp-card-avatar-initial">
                          {travelerDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="exp-card-author-info">
                        <p className="exp-card-author-name">
                          {travelerDisplayName}
                        </p>
                        <p className="exp-card-date">
                          {dateStr}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/experience/${exp.id}`}
                      className="exp-card-read-link"
                    >
                      <span>Read Story</span>
                      <span>→</span>
                    </Link>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          10. BOTTOM EDITORIAL CTA CONTAINER
          ========================================================================= */}
      <section className="exp-bottom-banner">
        <div className="exp-banner-glow-1"></div>
        <div className="exp-banner-glow-2"></div>

        <div className="exp-banner-content">
          <div className="exp-banner-left">
            {/* Camera Badge */}
            <div className="exp-banner-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
            </div>

            <div>
              <h2 className="exp-banner-title">
                Have a story to tell?
              </h2>
              <p className="exp-banner-desc">
                Share your travel experiences, photos, tips, and recommendations with fellow travelers exploring the incredible tapestry of Bharat.
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="exp-banner-btn"
            >
              Share Your Experience →
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK-SHARE EXPERIENCE MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div 
          className="exp-modal-backdrop"
          onClick={() => !formSubmitting && setIsModalOpen(false)}
        >
          <div 
            className="exp-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              disabled={formSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="exp-modal-close"
            >
              ✕
            </button>

            {formSuccess ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
                  ✓
                </div>
                <h3 style={{ fontFamily: 'var(--font-family-serif), serif', fontSize: '1.75rem', fontWeight: 700, color: '#172B5B', marginBottom: '8px' }}>
                  Story Published!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#5A6080' }}>
                  Thank you for contributing to the Dishaara Traveler Journal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#159BC5' }}>
                    TRAVELER COMMUNITY
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-family-serif), serif', fontSize: '1.75rem', fontWeight: 700, color: '#172B5B', marginTop: '2px' }}>
                    Share Your Experience
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#5A6080', marginTop: '4px' }}>
                    Inspire thousands of travelers exploring India's Union Territories.
                  </p>
                </div>

                {formError && (
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#BA1A1A', fontSize: '0.8rem', marginBottom: '16px' }}>
                    {formError}
                  </div>
                )}

                {/* Destination Dropdown */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Where did you go? <span style={{ color: '#BA1A1A' }}>*</span>
                  </label>
                  <select
                    value={formDestinationId}
                    onChange={(e) => setFormDestinationId(e.target.value)}
                    required
                    disabled={formSubmitting}
                    className="exp-form-select"
                  >
                    <option value="" disabled>Select destination...</option>
                    {VERIFIED_DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.territoryName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Experience Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Silence That Speaks in Ladakh"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    disabled={formSubmitting}
                    className="exp-form-input"
                  />
                </div>

                {/* Rating (1 to 5 Stars) */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Your Rating
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={formRating >= star ? "#D4A94E" : "none"}
                          stroke={formRating >= star ? "#D4A94E" : "#7980A3"}
                          strokeWidth="1.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    ))}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#172B5B', marginLeft: '8px' }}>
                      {formRating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* Story / Experience */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Your Story <span style={{ color: '#BA1A1A' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you experienced, what surprised you, and what made it special..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    required
                    disabled={formSubmitting}
                    className="exp-form-textarea"
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                {/* Practical Tips */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Practical Travel Tips (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best time to visit, permits needed, local food recommendation..."
                    value={formTips}
                    onChange={(e) => setFormTips(e.target.value)}
                    disabled={formSubmitting}
                    className="exp-form-input"
                  />
                </div>

                {/* Traveler Name */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Mehta"
                    value={formUserName}
                    onChange={(e) => setFormUserName(e.target.value)}
                    disabled={formSubmitting}
                    className="exp-form-input"
                  />
                </div>

                {/* Photos Upload */}
                <div className="exp-form-field">
                  <label className="exp-form-label">
                    Add Photos (Up to 5)
                  </label>
                  <div className="exp-photo-upload-box">
                    {formPhotos.map((p, idx) => (
                      <div key={idx} className="exp-photo-thumb">
                        <img src={p} alt="preview" />
                        <button
                          type="button"
                          onClick={() => setFormPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="exp-photo-thumb-del"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {formPhotos.length < 5 && (
                      <label className="exp-photo-add-btn">
                        <span style={{ fontSize: '20px', fontWeight: 700 }}>+</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                          disabled={formSubmitting}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div style={{ paddingTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="exp-primary-btn"
                    style={{ width: '100%', padding: '15px' }}
                  >
                    {formSubmitting ? "Publishing Story..." : "Publish Experience →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
