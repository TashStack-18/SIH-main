import Link from "next/link";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS } from "@/src/lib/fixtures";
import { HeroCarousel } from "@/src/app/components/HeroCarousel";
import { QuickSearchBar } from "@/src/app/components/QuickSearchBar";
import { ExploreRail } from "@/src/app/components/ExploreRail";
import { DishaaraUTNavigation } from "@/src/app/components/DishaaraUTNavigation";
import { PremiumDepthImage } from "@/src/app/components/PremiumDepthImage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Dishaara, India's Intelligent Union Territory Tourism & Safety Platform.",
};

export default function HomePage() {
  const popularDestinations = VERIFIED_DESTINATIONS.slice(0, 6);
  const featuredFestivals = VERIFIED_FESTIVALS.slice(0, 4);

  const experienceCategories = [
    { title: "Adventure & High Treks", count: "48 Trails", desc: "Trans-Himalayan passes, frozen river walks, and coral diving" },
    { title: "Heritage & Living History", count: "120+ Citadels", desc: "UNESCO monuments, Mughal forts, and ancient Buddhist Gompas" },
    { title: "Coastal & Coral Lagoons", count: "14 Blue Flag Beaches", desc: "Bioluminescent atolls, scuba safaris, and pristine shores" },
    { title: "Spiritual & Sacred Retreats", count: "35 Sanctuaries", desc: "Monastic prayer ceremonies, Sufi dargahs, and ashrams" },
    { title: "Authentic Gastronomy", count: "8 Distinct Cuisines", desc: "Wazwan feasts, Franco-Tamil bistros, and coastal curries" },
    { title: "Dark Sky & Astro-Tourism", count: "Bortle-1 Reserves", desc: "Pristine stargazing in Hanle and high-altitude Changthang" }
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Popular Across Bharat
            </h2>
            <p className="sub-text">
              Hand-picked destinations with verified coordinates, entry guidelines, and seasonal intelligence.
            </p>
          </div>
          <Link href="/destinations" className="btn btn-outline">
            View All Destinations →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
          {popularDestinations.map(dest => (
            <article key={dest.id} className="destination-card card-hoverable" style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
              <div className="destination-card-media" style={{ height: "220px", position: "relative" }}>
                <PremiumDepthImage src={dest.image} alt={dest.name} className="destination-card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />

              </div>

              <div className="destination-card-body" style={{ padding: "var(--space-lg)", background: "var(--color-bg-surface)" }}>
                <div className="destination-card-location" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
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
      <section className="section-spacing" style={{ backgroundColor: "var(--color-bg-surface-elevated)" }} aria-label="8 Union Territories Explorer">
        <div className="container">
          <div className="section-header">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Explore the 8 Union Territories
            </h2>
            <p className="sub-text" style={{ color: "var(--color-text-secondary)" }}>
              From the trans-Himalayan summits of Ladakh to the tropical coral lagoons of Lakshadweep.
            </p>
          </div>

          <div className="ut-grid mt-6">
            {VERIFIED_TERRITORIES.map((ut, index) => (
              <Link
                key={ut.id}
                href={`/territories/${ut.slug}`}
                className="ut-card"
                data-territory={ut.slug}
              >
                <PremiumDepthImage
                  src={ut.thumbnailImage}
                  alt={ut.name}
                  className="w-full h-full object-cover"
                >
                  <div className="ut-card-content h-full w-full flex flex-col justify-between p-6 md:p-8">
                    <div className="ut-chapter-num">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="ut-card-name font-serif">{ut.name}</h3>
                      <p className="ut-card-tagline">{ut.tagline}</p>
                      <span className="editorial-link" style={{ fontSize: "0.95rem", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
                        Explore Territory <span style={{ marginLeft: "8px", fontSize: "1.2em", transition: "transform 0.2s" }} className="inline-block group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </PremiumDepthImage>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Travel by Experience */}
      <section className="section-spacing container" aria-label="Signature Experience Categories">
        <div className="section-header">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
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
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
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
      <section className="section-spacing" style={{ backgroundColor: "var(--color-bg-surface-elevated)" }} aria-label="2026 Cultural Festival Calendar">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                Cultural Festivals & Events
              </h2>
              <p className="sub-text" style={{ color: "var(--color-text-secondary)" }}>
                Verified festival schedules with explicit date precisions directly from UT Tourism departments.
              </p>
            </div>
            <Link href="/festivals" className="btn btn-outline">
              Full 2026 Calendar →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "var(--space-lg)" }}>
            {featuredFestivals.map(fest => (
              <div
                key={fest.id}
                className="festival-card card-hoverable card"
                style={{
                  padding: "var(--space-lg)",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div className="festival-date-badge" style={{ background: "var(--color-primary)", color: "var(--color-text-inverse)" }}>
                  <span>{fest.displayDate}</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--color-text-primary)", marginTop: "6px" }}>
                  {fest.name}
                </h3>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", marginBottom: "6px" }}>
                  {fest.location} ({fest.territoryName})
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, flexGrow: 1 }}>
                  {fest.description}
                </p>
                <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.775rem", color: "var(--color-text-muted)", fontWeight: 600 }}>{fest.category}</span>
                  <Link href="/festivals" style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-accent)" }} className="hover-accent">
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
            background: "var(--color-bg-surface-elevated)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-lg)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className="badge badge-danger">
                Life Safety Protocol
              </span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-danger)" }}>
                National Helpline: 112 • Tourist Support: 1363
              </span>
            </div>
            <h3 className="font-serif" style={{ fontSize: "1.5rem", color: "var(--color-text-primary)", marginBottom: "6px" }}>
              Travel Safely with Real-Time Emergency Grounding
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              Dishaara maintains verified trauma centers, high-altitude oxygen facilities, coast guard stations, and real-time travel advisories across every Union Territory.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/safety"
              className="btn btn-emergency btn-lg"
              style={{
                textDecoration: "none",
                fontWeight: 700,
                borderRadius: "var(--radius-pill)",
                padding: "12px 28px",
              }}
            >
              Open Emergency SOS Center
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
