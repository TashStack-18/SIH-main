import Link from "next/link";
import { notFound } from "next/navigation";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : "";

  const dest = VERIFIED_DESTINATIONS.find(
    (d) =>
      d.slug === rawSlug ||
      d.id === rawSlug ||
      d.slug.toLowerCase() === rawSlug.toLowerCase() ||
      d.id.toLowerCase() === rawSlug.toLowerCase()
  );

  if (!dest) return notFound();

  return (
    <main role="main">
      <section
        style={{
          position: "relative",
          minHeight: "520px",
          backgroundImage: `url('${dest.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          color: "#ffffff",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 90%)" }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-2xl)" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", fontSize: "0.85rem", flexWrap: "wrap" }}>
            <Link href="/destinations" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Destinations</Link>
            <span>/</span>
            <Link href={`/territories/${dest.territoryId.toLowerCase().replace(/_/g, '-')}`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>{dest.territoryName}</Link>
            <span>/</span>
            <span style={{ color: "var(--brand-terracotta-500)", fontWeight: 600 }}>{dest.name}</span>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span className="badge badge-neutral" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>{dest.type}</span>
            <span className="badge badge-official">{dest.source.name}</span>
            {dest.coordinates.altitude ? (
              <span className="badge badge-neutral" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>
                Altitude: {dest.coordinates.altitude}
              </span>
            ) : null}
          </div>

          <h1 style={{ color: "#ffffff", fontSize: "clamp(2.4rem, 6vw, 4rem)", marginBottom: "8px" }}>{dest.name}</h1>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.92)", maxWidth: "780px", marginBottom: "24px" }}>{dest.tagline}</p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/itinerary" className="btn btn-lg btn-secondary" style={{ textDecoration: "none", fontWeight: 700 }}>
              + Add to My Itinerary
            </Link>
            <Link
              href="/map"
              className="btn btn-lg btn-outline"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(8px)",
                textDecoration: "none",
              }}
            >
              🗺️ Locate on Map
            </Link>
          </div>
        </div>
      </section>

      <div className="container section-spacing">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-2xl)" }}>
          
          <section className="card" style={{ padding: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>Overview</h2>
            <p className="lead-text" style={{ marginBottom: "20px" }}>{dest.overview}</p>
            
            <div style={{ background: "var(--color-bg-surface-elevated)", borderLeft: "4px solid var(--color-primary)", padding: "var(--space-md) var(--space-lg)", borderRadius: "var(--radius-sm)" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "4px" }}>Why Visit</h3>
              <p style={{ fontSize: "0.925rem", color: "var(--color-text-secondary)" }}>{dest.whyVisit}</p>
            </div>
          </section>

          <section className="card" style={{ padding: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Key Highlights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-md)" }}>
              {dest.highlights.map((hl, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "var(--color-bg-surface-elevated)", padding: "12px 16px", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--color-primary)", fontSize: "1.2rem" }}>✦</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{hl}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Things To Do & Experiences</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
              {dest.thingsToDo.map((item, idx) => (
                <div key={idx} style={{ border: "1px solid var(--color-border-subtle)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "6px" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>
            <section className="card" style={{ padding: "var(--space-xl)" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>🍲 Local Gastronomy</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "14px" }}>{dest.food.overview}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {dest.food.dishes.map((dish, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", fontWeight: 600, background: "var(--color-bg-surface-elevated)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}>
                    <span>•</span>
                    <span>{dish}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card" style={{ padding: "var(--space-xl)" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>🏛️ Culture & Etiquette</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}><strong>Tradition:</strong> {dest.culture.traditions}</p>
              <div style={{ background: "var(--color-bg-surface-elevated)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-text-primary)", borderLeft: "3px solid var(--brand-terracotta-600)" }}>
                <strong>Etiquette:</strong> {dest.culture.etiquette}
              </div>
            </section>
          </div>

          <section className="card" style={{ padding: "var(--space-lg)", background: "var(--color-bg-surface-elevated)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
            <div>
              <div className="caption-text">POSTGIS GEOSPATIAL COORDINATES (EPSG:4326)</div>
              <div className="font-mono" style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)" }}>
                {dest.coordinates.lat.toFixed(4)}° N, {dest.coordinates.lng.toFixed(4)}° E
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                Source: <a href={dest.source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>{dest.source.name}</a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
