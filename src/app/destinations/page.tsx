import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

export const metadata = {
  title: "Destinations Across 8 UTs",
  description: "Browse verified high-altitude lakes, heritage citadels, coral atolls, and spiritual sanctuaries across India's 8 Union Territories."
};

export default function DestinationsPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-verified" style={{ width: "fit-content" }}>Phase 5 Verified Knowledge</span>
        <h1>Destinations Across the 8 UTs</h1>
        <p className="lead-text">
          Browse verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
        {VERIFIED_DESTINATIONS.map(dest => (
          <article key={dest.id} className="destination-card card-hoverable">
            <div className="destination-card-media">
              <img src={dest.image} alt={dest.name} className="destination-card-img" loading="lazy" />
            </div>

            <div className="destination-card-body">
              <div className="destination-card-location">{dest.territoryName}</div>
              <h2 className="destination-card-title" style={{ fontSize: "1.25rem" }}>{dest.name}</h2>
              <p className="destination-card-desc">{dest.shortDescription}</p>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {dest.categories.map((c, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>{c}</span>
                ))}
              </div>

              <div className="destination-card-footer">
                <span style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{dest.weather.bestTime}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Link href={`/destinations/${dest.slug}`} className="btn btn-sm btn-outline">Explore Place</Link>
                  <Link href="/itinerary" className="btn btn-sm btn-primary">+ Itinerary</Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
