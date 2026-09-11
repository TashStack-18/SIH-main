import Link from "next/link";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS } from "@/src/lib/fixtures";
import { HeroCarousel } from "@/src/app/components/HeroCarousel";
import { ExploreRail } from "@/src/app/components/ExploreRail";
import AccordionGallery from "@/src/app/components/AccordionGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dishaara — India's Intelligent Union Territory Tourism & Safety Platform",
  description: "Welcome to Dishaara, India's Intelligent Union Territory Tourism & Safety Platform.",
};

export default function HomePage() {
  const popularDestinations = VERIFIED_DESTINATIONS.slice(0, 6);
  const featuredFestivals = VERIFIED_FESTIVALS.slice(0, 4);

  const experienceCategories = [
    {
      title: "High-Altitude Expeditions",
      tag: "Trails & Alpine Treks",
      desc: "Chadar frozen river traverses, high Himalayan passes, and scenic trans-territory trails.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      ),
    },
    {
      title: "Living Heritage & Forts",
      tag: "Monuments & Citadels",
      desc: "Centuries of architectural marvels, ancient Buddhist gompas, and royal Mughal fortresses.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="6" y1="21" x2="6" y2="10" />
          <line x1="18" y1="21" x2="18" y2="10" />
          <path d="M12 21V10" />
          <path d="M3 10h18l-9-7-9 7z" />
        </svg>
      ),
    },
    {
      title: "Coastal & Coral Escapes",
      tag: "Islands & Marine Life",
      desc: "Turquoise atolls, bioluminescent night shores, and premier scuba diving expeditions.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20" />
          <path d="M20 12c0-4.4-3.6-8-8-8s-8 3.6-8 8" />
          <path d="M6 12v3a6 6 0 0 0 12 0v-3" />
        </svg>
      ),
    },
    {
      title: "Spiritual & Sacred Sanctuaries",
      tag: "Peace & Pilgrimage",
      desc: "Tranquil monastery retreats, historic Sufi shrines, and reflective coastal ashrams.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: "Regional Culinary Journeys",
      tag: "Authentic Gastronomy",
      desc: "Multi-course Kashmiri wazwan feasts, Franco-Tamil bistros, and fresh coastal delicacies.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
    },
    {
      title: "Dark Sky & Astro-Tourism",
      tag: "Stargazing & Reserves",
      desc: "Unrivaled stargazing under pristine Bortle-1 dark skies across the Hanle plateau.",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <main role="main">
      
      {/* 1. Cinematic Hero Carousel (Stitch Heritage Soul - 8 UTs) */}
      <HeroCarousel />

      {/* 2. Explore Authentic India (Stitch Horizontal Snap-Scroll Rail) */}
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
                <img src={dest.image} alt={dest.name} className="destination-card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                <div className="destination-card-badges">
                  <span className="badge badge-neutral" style={{ background: "rgba(45, 27, 20, 0.75)", color: "#ffffff", backdropFilter: "blur(6px)" }}>
                    {dest.type}
                  </span>
                </div>
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
          <div className="section-header-row" style={{ marginBottom: "var(--space-2xl)" }}>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14] dark:text-[#FAF7F2]">
                Explore the 8 Union Territories
              </h2>
              <p className="sub-text" style={{ color: "var(--color-text-secondary)" }}>
                From the trans-Himalayan summits of Ladakh to the tropical coral lagoons of Lakshadweep.
              </p>
            </div>
            <Link href="/destinations" className="btn btn-outline" style={{ borderRadius: "var(--radius-pill)", padding: "10px 22px", fontWeight: 600 }}>
              All Destinations →
            </Link>
          </div>

          <AccordionGallery items={VERIFIED_TERRITORIES.map(ut => {
            const config = {
              "ANDAMAN_NICOBAR": { file: "andaman-nicobar.jpg", pos: "30% 60%" },
              "CHANDIGARH": { file: "chandigarh.jpg", pos: "center 50%" },
              "DNH_DD": { file: "dadra-nagar-haveli-daman-diu.jpg", pos: "center 65%" },
              "DELHI": { file: "delhi.jpg", pos: "45% 40%", scale: 1.05 },
              "JAMMU_KASHMIR": { file: "jammu-kashmir.jpg", pos: "center 60%" },
              "LADAKH": { file: "ladakh.jpg", pos: "center 55%" },
              "LAKSHADWEEP": { file: "lakshadweep.jpg", pos: "65% 75%", scale: 1.1 },
              "PUDUCHERRY": { file: "puducherry.jpg", pos: "center center", scale: 1.02 }
            }[ut.id] || { file: null, pos: "center center", scale: 1 };

            return {
              id: ut.id,
              name: ut.name,
              slug: ut.slug,
              image: config.file ? `/images/utflashcard/${config.file}` : ut.heroImage || ut.thumbnailImage,
              objectPosition: config.pos,
              scale: config.scale
            };
          })} />
        </div>
      </section>

      {/* 6. Travel by Experience */}
      <section className="section-spacing container" aria-label="Signature Experience Categories">
        <div className="section-header" style={{ marginBottom: "var(--space-2xl)" }}>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#2D1B14] dark:text-[#FAF7F2]">
            Travel by Experience
          </h2>
          <p className="sub-text">
            Curated journeys designed for high-altitude explorers, heritage seekers, and cultural connoisseurs.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
          {experienceCategories.map((exp, idx) => (
            <Link
              key={idx}
              href="/destinations"
              className="card card-hoverable"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                background: "var(--color-bg-surface)",
                borderRadius: "var(--radius-xl, 20px)",
                border: "1px solid var(--color-border-subtle)",
                boxShadow: "var(--shadow-subtle)",
                transition: "all 0.25s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(200, 142, 68, 0.12)",
                    color: "var(--color-brand-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {exp.svg}
                </div>
                <span
                  style={{
                    fontSize: "0.725rem",
                    fontWeight: 700,
                    color: "var(--color-brand-accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: "var(--color-bg-canvas)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill, 9999px)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  {exp.tag}
                </span>
              </div>

              <h3
                className="font-serif"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.3,
                }}
              >
                {exp.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.55,
                  margin: "0 0 16px",
                  flexGrow: 1,
                }}
              >
                {exp.desc}
              </p>

              <div
                style={{
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "var(--color-brand-accent)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Explore Journeys →
              </div>
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
