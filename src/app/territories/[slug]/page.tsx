import Link from "next/link";
import { notFound } from "next/navigation";
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";
import { PremiumDepthImage } from "@/src/app/components/PremiumDepthImage";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : "";
  const territory = VERIFIED_TERRITORIES.find((t) => t.slug === rawSlug || t.id.toLowerCase() === rawSlug.toLowerCase());
  
  if (!territory) return { title: "Territory Not Found" };
  
  return {
    title: territory.name,
    description: territory.tagline || `Discover ${territory.name}, a Union Territory of India.`,
  };
}

export default async function TerritoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : "";

  const territory = VERIFIED_TERRITORIES.find(
    (t) =>
      t.slug === rawSlug ||
      t.id.toLowerCase() === rawSlug.toLowerCase() ||
      t.code.toLowerCase() === rawSlug.toLowerCase() ||
      t.slug.toLowerCase() === rawSlug.toLowerCase()
  );

  if (!territory) return notFound();

  const relatedDestinations = VERIFIED_DESTINATIONS.filter(
    (d) => d.territoryId === territory.code || d.territoryId === territory.id
  );

  return (
    <main role="main" data-territory={territory.slug}>
      <section style={{ position: "relative", minHeight: "440px", backgroundImage: `url('${territory.heroImage}')`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", color: "#ffffff" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 90%)" }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-2xl)" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/territories" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>← All Territories</Link>
            <span>•</span>
            <span className="badge badge-verified">100% Verified Scope</span>
            <span className="badge badge-neutral" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>Capital: {territory.capital}</span>
          </div>

          <h1 style={{ color: "#ffffff", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", marginBottom: "8px" }}>{territory.name}</h1>
          <p style={{ fontSize: "1.2rem", color: "var(--color-territory-accent, var(--color-accent))", fontWeight: 600, maxWidth: "780px" }}>{territory.tagline}</p>
        </div>
      </section>

      <div className="container section-spacing">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-2xl)" }}>
          
          <section className="card" style={{ padding: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>About {territory.name}</h2>
            <p className="lead-text" style={{ marginBottom: "16px" }}>{territory.description}</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)", marginTop: "var(--space-lg)", background: "var(--color-bg-surface-elevated)", padding: "var(--space-lg)", borderRadius: "var(--radius-md)" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Administrative Capital</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-primary)" }}>{territory.capital}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Best Travel Season</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-primary)" }}>{territory.weatherSnapshot.bestMonths}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Current Climate</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-primary)" }}>{territory.weatherSnapshot.temp}°C • {territory.weatherSnapshot.condition}</div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-header-row">
              <div>
                <h2>Key Destinations in {territory.shortName}</h2>
                <p className="sub-text">Explore featured places with complete coordinates, cultural highlights, and safety rules.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
              {relatedDestinations.map(d => (
                <div key={d.id} className="destination-card card-hoverable">
                  <div className="destination-card-media" style={{ height: "220px", position: "relative" }}>
                    <PremiumDepthImage
                      src={d.image}
                      alt={d.name}
                      className="destination-card-img"
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    >
                      <div className="destination-card-badges" style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10 }}>
                        <span className="badge badge-neutral" style={{ background: "rgba(0,0,0,0.6)", color: "#ffffff" }}>{d.type}</span>
                      </div>
                    </PremiumDepthImage>
                  </div>
                  <div className="destination-card-body">
                    <h3 className="destination-card-title">{d.name}</h3>
                    <p className="destination-card-desc">{d.shortDescription}</p>
                    <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{d.weather.bestTime}</span>
                      <Link href={`/destinations/${d.slug}`} className="btn btn-sm btn-outline">Explore Place →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: "var(--space-xl)", background: "var(--color-bg-surface-elevated)", borderLeft: "4px solid var(--color-emergency)" }}>
            <h3 style={{ color: "var(--color-emergency)", marginBottom: "8px" }}>Verified Emergency Support for {territory.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-md)", marginBottom: "16px" }}>
              {territory.emergencyContacts.map((c, idx) => (
                <div key={idx} style={{ background: "var(--color-bg-surface)", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-subtle)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{c.name}</div>
                  <a href={`tel:${c.number.replace(/[^0-9]/g, '')}`} style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-emergency)", textDecoration: "none" }} className="hover-accent">{c.number}</a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              Official Portal: <a href={territory.officialPortal} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-territory-accent, var(--color-accent))", textDecoration: "underline" }} className="hover-accent">{territory.officialPortal} ↗</a>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
