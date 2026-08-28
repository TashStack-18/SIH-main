import Link from "next/link";
import { VERIFIED_TERRITORIES } from "@/src/lib/fixtures";

export const metadata = {
  title: "8 Union Territories Directory",
  description: "Explore India's 8 Union Territories with verified government intelligence, capital details, and seasonal guides."
};

export default function TerritoriesPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-official" style={{ width: "fit-content" }}>8 Union Territories of India</span>
        <h1>Explore Bharat's Union Territories</h1>
        <p className="lead-text">
          Discover the unique geographical, cultural, and architectural heritage of India's 8 Union Territories with verified government intelligence.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "var(--space-xl)" }}>
        {VERIFIED_TERRITORIES.map((ut, idx) => (
          <article key={ut.id} className="card card-hoverable" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
              <img src={ut.heroImage} alt={ut.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                <span className="badge badge-verified">✓ UT {idx + 1} of 8</span>
              </div>
              <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
                <span className="badge badge-neutral" style={{ background: "rgba(45, 27, 20, 0.75)", color: "#ffffff", backdropFilter: "blur(8px)" }}>
                  Capital: {ut.capital}
                </span>
              </div>
            </div>

            <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <h2 style={{ fontSize: "1.45rem", marginBottom: "6px" }}>{ut.name}</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--color-accent)", fontWeight: 600, marginBottom: "12px" }}>{ut.tagline}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.55, marginBottom: "var(--space-md)", flexGrow: 1 }}>
                {ut.shortDescription}
              </p>

              <div style={{ marginBottom: "var(--space-md)", background: "var(--color-bg-surface-elevated)", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "4px" }}>Key Destinations</div>
                <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {ut.popularDestinations.slice(0, 4).join(" • ")}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                  Best: {ut.weatherSnapshot.bestMonths}
                </div>
                <Link href={`/territories/${ut.slug}`} className="btn btn-sm btn-primary">
                  Explore Territory →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
