import Link from "next/link";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS } from "@/src/lib/fixtures";
import { HeroCarousel } from "@/src/app/components/HeroCarousel";
import { QuickSearchBar } from "@/src/app/components/QuickSearchBar";
import { ExploreRail } from "@/src/app/components/ExploreRail";

export default function HomePage() {
  const popularDestinations = VERIFIED_DESTINATIONS.slice(0, 6);
  const featuredFestivals = VERIFIED_FESTIVALS.slice(0, 4);

  const experienceCategories = [
    { title: "Adventure & High Treks", icon: "🏔️", count: "48 Trails", desc: "Trans-Himalayan passes, frozen river walks, and coral diving" },
    { title: "Heritage & Living History", icon: "🏛️", count: "120+ Citadels", desc: "UNESCO monuments, Mughal forts, and ancient Buddhist Gompas" },
    { title: "Coastal & Coral Lagoons", icon: "🌊", count: "14 Blue Flag Beaches", desc: "Bioluminescent atolls, scuba safaris, and pristine shores" },
    { title: "Spiritual & Sacred Retreats", icon: "🕊️", count: "35 Sanctuaries", desc: "Monastic prayer ceremonies, Sufi dargahs, and ashrams" },
    { title: "Authentic Gastronomy", icon: "🍲", count: "8 Distinct Cuisines", desc: "Wazwan feasts, Franco-Tamil bistros, and coastal curries" },
    { title: "Dark Sky & Astro-Tourism", icon: "🌌", count: "Bortle-1 Reserves", desc: "Pristine stargazing in Hanle and high-altitude Changthang" }
  ];

  return (
    <main role="main">
      
      {/* 1. Cinematic Hero Carousel (Stitch Heritage Soul - 8 UTs) */}
      <HeroCarousel />

      {/* 2. Floating Glass Search Engine with 8 UT Dropdown */}
      <QuickSearchBar />

      {/* 3. Explore Authentic India (Stitch Horizontal Snap-Scroll Rail) */}
      <ExploreRail />

      {/* 4. Popular Across Bharat's 8 UTs (Destinations Spotlight) */}
      <section className="section-spacing container" aria-label="Popular Verified Destinations">
        <div className="section-header-row">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14] dark:text-[#FAF7F2]">
              Popular Across Bharat
            </h2>
            <p className="sub-text">
              Hand-picked destinations with verified coordinates, entry guidelines, and seasonal intelligence.
            </p>
          </div>
          <Link href="/destinations" className="btn btn-outline" style={{ borderColor: "#C88E44", color: "var(--color-text-primary)" }}>
            View All Destinations →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
          {popularDestinations.map(dest => (
            <article key={dest.id} className="destination-card card-hoverable" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid rgba(211, 201, 189, 0.6)" }}>
              <div className="destination-card-media" style={{ height: "220px", position: "relative" }}>
                <img src={dest.image} alt={dest.name} className="destination-card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                <div className="destination-card-badges">
                  <span className="badge badge-neutral" style={{ background: "rgba(45, 27, 20, 0.75)", color: "#ffffff", backdropFilter: "blur(6px)" }}>
                    {dest.type}
                  </span>
                </div>
              </div>

              <div className="destination-card-body" style={{ padding: "var(--space-lg)", background: "var(--color-bg-surface)" }}>
                <div className="destination-card-location" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--stitch-accent, #C88E44)", textTransform: "uppercase" }}>
                  {dest.territoryName} • {dest.type}
                </div>
                <h3 className="destination-card-title font-serif" style={{ fontSize: "1.3rem", margin: "4px 0 8px", color: "var(--color-text-primary)" }}>
                  {dest.name}
                </h3>
                <p className="destination-card-desc" style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
                  {dest.shortDescription}
                </p>
                
                <div className="destination-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                    Best: {dest.weather.bestTime}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Link href={`/destinations/${dest.slug}`} className="btn btn-sm btn-outline">
                      Details
                    </Link>
                    <Link
                      href={`/itinerary?destination=${dest.slug}&territory=${dest.territoryId}&source=home_card`}
                      className="btn btn-sm btn-primary"
                      style={{ background: "#2D1B14", borderColor: "#2D1B14" }}
                    >
                      + Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. 8 Union Territories Explorer Grid */}
      <section className="section-spacing" style={{ backgroundColor: "var(--stitch-surface-variant, #F0EADE)" }} aria-label="8 Union Territories Explorer">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-official" style={{ width: "fit-content", background: "rgba(200, 142, 68, 0.2)", color: "#2D1B14", borderColor: "#C88E44" }}>
              National Geographic Scope
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14]">
              Explore the 8 Union Territories
            </h2>
            <p className="sub-text" style={{ color: "#4A3C31" }}>
              From the trans-Himalayan summits of Ladakh to the tropical coral lagoons of Lakshadweep.
            </p>
          </div>

          <div className="ut-grid">
            {VERIFIED_TERRITORIES.map(ut => (
              <Link
                key={ut.id}
                href={`/territories/${ut.slug}`}
                className="ut-card card-hoverable"
                style={{
                  backgroundImage: `url('${ut.thumbnailImage}')`,
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                }}
              >
                <div className="ut-card-content" style={{ background: "linear-gradient(to top, rgba(45, 27, 20, 0.95) 0%, rgba(45, 27, 20, 0.4) 50%, transparent 100%)" }}>
                  <span className="badge badge-neutral" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", marginBottom: "6px", fontSize: "0.7rem", backdropFilter: "blur(6px)" }}>
                    Capital: {ut.capital}
                  </span>
                  <h3 className="ut-card-name font-serif">{ut.name}</h3>
                  <p className="ut-card-tagline" style={{ opacity: 0.9 }}>{ut.tagline}</p>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#C88E44" }}>
                    Explore Territory →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Travel by Experience */}
      <section className="section-spacing container" aria-label="Signature Experience Categories">
        <div className="section-header">
          <span className="badge badge-verified" style={{ width: "fit-content", marginBottom: "6px" }}>
            Curated Themes
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14] dark:text-[#FAF7F2]">
            Travel by Experience
          </h2>
          <p className="sub-text">
            Filter across curated journeys tailored for adventure seekers, heritage lovers, and culinary explorers.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
          {experienceCategories.map((exp, idx) => (
            <Link
              key={idx}
              href="/destinations"
              className="card card-hoverable"
              style={{
                padding: "var(--space-lg)",
                display: "block",
                textDecoration: "none",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(211, 201, 189, 0.6)",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{exp.icon}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#C88E44", textTransform: "uppercase" }}>
                {exp.count}
              </div>
              <h3 className="font-serif" style={{ fontSize: "1.2rem", margin: "4px 0 8px", color: "var(--color-text-primary)" }}>
                {exp.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                {exp.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. 2026 Cultural Festival Calendar */}
      <section className="section-spacing" style={{ backgroundColor: "var(--stitch-surface-variant, #F0EADE)" }} aria-label="2026 Cultural Festival Calendar">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="badge badge-warning" style={{ marginBottom: "6px", background: "#fef3c7", color: "#92400e", borderColor: "#f59e0b" }}>
                2026 Official Calendars
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14]">
                Cultural Festivals & Events
              </h2>
              <p className="sub-text" style={{ color: "#4A3C31" }}>
                Verified festival schedules with explicit date precisions directly from UT Tourism departments.
              </p>
            </div>
            <Link href="/festivals" className="btn btn-outline" style={{ borderColor: "#C88E44", color: "#2D1B14" }}>
              Full 2026 Calendar →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "var(--space-lg)" }}>
            {featuredFestivals.map(fest => (
              <div
                key={fest.id}
                className="festival-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid rgba(211, 201, 189, 0.6)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="festival-date-badge" style={{ background: "#2D1B14", color: "#ffffff" }}>
                  <span>📅</span>
                  <span>{fest.displayDate}</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "#2D1B14", marginTop: "6px" }}>
                  {fest.name}
                </h3>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#C88E44", marginBottom: "6px" }}>
                  {fest.location} ({fest.territoryName})
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, flexGrow: 1 }}>
                  {fest.description}
                </p>
                <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge badge-neutral" style={{ fontSize: "0.725rem" }}>{fest.datePrecision}</span>
                  <Link href="/festivals" style={{ fontSize: "0.825rem", fontWeight: 700, color: "#2D1B14" }} className="hover:text-[#C88E44]">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Life Safety & SOS Hub */}
      <section className="container" style={{ margin: "var(--space-3xl) auto" }} aria-label="Life Safety & SOS Emergency">
        <div
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
            border: "1px solid rgba(200, 142, 68, 0.4)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className="badge badge-danger" style={{ background: "#ba1a1a", color: "#ffffff" }}>
                🚨 Life Safety Protocol
              </span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9a3412" }}>
                National Helpline: 112 • Tourist Support: 1363
              </span>
            </div>
            <h3 className="font-serif" style={{ fontSize: "1.5rem", color: "#431407", marginBottom: "6px" }}>
              Travel Safely with Real-Time Emergency Grounding
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#7c2d12", lineHeight: 1.55 }}>
              Bharat Safe Yatra maintains verified trauma centers, high-altitude oxygen facilities, coast guard stations, and real-time travel advisories across every Union Territory.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/safety"
              className="btn btn-emergency btn-lg"
              style={{
                textDecoration: "none",
                background: "#ba1a1a",
                color: "#ffffff",
                fontWeight: 700,
                borderRadius: "var(--radius-pill)",
                padding: "12px 28px",
              }}
            >
              🚨 Open Emergency SOS Center
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
