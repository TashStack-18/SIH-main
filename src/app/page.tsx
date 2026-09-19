import Link from "next/link";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS } from "@/src/lib/fixtures";
import { HeroCarousel } from "@/src/app/components/HeroCarousel";
import AccordionGallery from "@/src/app/components/AccordionGallery";
import PopularDestinationsCarousel from "@/src/app/components/PopularDestinationsCarousel";
import { Footer } from "@/src/app/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dishaara — India's Intelligent Union Territory Tourism & Safety Platform",
  description: "Welcome to Dishaara, India's Intelligent Union Territory Tourism & Safety Platform.",
};

export default function HomePage() {
  const popularDestinations = VERIFIED_DESTINATIONS.slice(0, 10);
  const featuredFestivals = VERIFIED_FESTIVALS.slice(0, 4);

  return (
    <main role="main">
      
      {/* 1. Cinematic Hero Carousel (Stitch Heritage Soul - 8 UTs) */}
      <HeroCarousel />

      {/* 2. Explore the 8 Union Territories — AccordionGallery */}
      <section className="section-spacing" style={{ backgroundColor: "var(--color-bg-surface-elevated)" }} aria-label="8 Union Territories Explorer">
        <div className="container">
          <div className="section-header-row" style={{ marginBottom: "var(--space-2xl)" }}>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
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
            const config: Record<string, { file: string | null; pos: string; scale?: number }> = {
              "ANDAMAN_NICOBAR": { file: "andaman-nicobar.jpg", pos: "30% 60%" },
              "CHANDIGARH": { file: "chandigarh.jpg", pos: "center 50%" },
              "DNH_DD": { file: "dadra-nagar-haveli-daman-diu.jpg", pos: "center 65%" },
              "DELHI": { file: "delhi.jpg", pos: "45% 40%", scale: 1.05 },
              "JAMMU_KASHMIR": { file: "jammu-kashmir.jpg", pos: "center 60%" },
              "LADAKH": { file: "ladakh.jpg", pos: "center 55%" },
              "LAKSHADWEEP": { file: "lakshadweep.jpg", pos: "65% 75%", scale: 1.1 },
              "PUDUCHERRY": { file: "puducherry.jpg", pos: "center center", scale: 1.02 }
            };
            const c = config[ut.id] || { file: null, pos: "center center", scale: 1 };
            return {
              id: ut.id,
              name: ut.name,
              slug: ut.slug,
              image: c.file ? `/images/utflashcard/${c.file}` : ut.heroImage || ut.thumbnailImage,
              objectPosition: c.pos,
              scale: c.scale
            };
          })} />
        </div>
      </section>

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
          <Link
            href="/destinations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              textDecoration: "none",
              transition: "color 0.2s ease, transform 0.2s ease",
            }}
            className="hover-accent"
          >
            View All Destinations →
          </Link>
        </div>

        <PopularDestinationsCarousel destinations={popularDestinations} />
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


      {/* Footer */}
      <Footer />
    </main>
  );
}
