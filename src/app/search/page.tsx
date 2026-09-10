import Link from "next/link";
import {
  VERIFIED_DESTINATIONS,
  VERIFIED_TERRITORIES,
  VERIFIED_FESTIVALS,
  VERIFIED_BOOKABLE_EXPERIENCES,
  VERIFIED_NATIONAL_CONTACTS,
} from "@/src/lib/fixtures";

export const metadata = {
  title: "Universal Tourism Search Results",
  description: "Search across India's 8 Union Territories for destinations, attractions, cultural festivals, verified bookings, and emergency services."
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; territory?: string; season?: string; style?: string }> | { q?: string; territory?: string; season?: string; style?: string };
}) {
  const resolved = await searchParams;
  const query = (resolved?.q || "").toLowerCase().trim();
  const territoryCode = (resolved?.territory || "").toUpperCase().trim();

  let matchedDestinations = VERIFIED_DESTINATIONS;
  let matchedTerritories = VERIFIED_TERRITORIES;
  let matchedFestivals = VERIFIED_FESTIVALS;
  let matchedBookings = VERIFIED_BOOKABLE_EXPERIENCES;
  let matchedSafety = VERIFIED_NATIONAL_CONTACTS;

  if (territoryCode) {
    matchedDestinations = matchedDestinations.filter(d => d.territoryId === territoryCode);
    matchedTerritories = matchedTerritories.filter(t => t.code === territoryCode || t.id === territoryCode);
    matchedFestivals = matchedFestivals.filter(f => f.territoryId === territoryCode);
    matchedBookings = matchedBookings.filter(b => b.territoryId === territoryCode);
  }

  if (query) {
    matchedDestinations = matchedDestinations.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.territoryName.toLowerCase().includes(query) ||
      d.shortDescription.toLowerCase().includes(query) ||
      (d.highlights && d.highlights.some(h => h.toLowerCase().includes(query)))
    );

    matchedTerritories = matchedTerritories.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.capital.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      (t.popularDestinations && t.popularDestinations.some(p => p.toLowerCase().includes(query)))
    );

    matchedFestivals = matchedFestivals.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.territoryName.toLowerCase().includes(query) ||
      f.location.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    );

    matchedBookings = matchedBookings.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.territoryName.toLowerCase().includes(query) ||
      b.providerName.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
    );

    matchedSafety = matchedSafety.filter(c =>
      c.service.toLowerCase().includes(query) ||
      c.number.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  }

  const totalResults =
    matchedDestinations.length +
    matchedTerritories.length +
    matchedFestivals.length +
    matchedBookings.length +
    matchedSafety.length;

  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-verified" style={{ width: "fit-content" }}>Universal Tourism Search</span>
        <h1>Search Results {query ? `for "${query}"` : territoryCode ? `for ${matchedTerritories[0]?.name || territoryCode}` : ""}</h1>
        <p className="lead-text">Found {totalResults} verified records across the 8 Union Territories.</p>
      </div>

      <form action="/search" method="GET" style={{ display: "flex", gap: "8px", marginBottom: "var(--space-2xl)", maxWidth: "680px" }}>
        <input
          type="text"
          name="q"
          defaultValue={query}
          className="search-input"
          style={{ background: "var(--color-bg-surface)", padding: "12px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-medium)", flexGrow: 1 }}
          placeholder="Search destinations, territories, festivals, bookings, helplines..."
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-2xl)" }}>
        {matchedDestinations.length > 0 ? (
          <section>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "12px" }}>Destinations ({matchedDestinations.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
              {matchedDestinations.map(d => (
                <div key={d.id} className="card card-hoverable" style={{ padding: "var(--space-lg)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "4px" }}>{d.territoryName} • {d.type}</div>
                  <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{d.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>{d.shortDescription}</p>
                  <Link href={`/destinations/${d.slug}`} className="btn btn-sm btn-outline">Explore Place →</Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {matchedTerritories.length > 0 ? (
          <section>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "12px" }}>Union Territories ({matchedTerritories.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
              {matchedTerritories.map(t => (
                <div key={t.id} className="card card-hoverable" style={{ padding: "var(--space-lg)" }}>
                  <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>{t.name}</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "8px" }}>Capital: {t.capital}</div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>{t.tagline}</p>
                  <Link href={`/destinations?ut=${t.slug}`} className="btn btn-sm btn-primary">Explore Territory →</Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {matchedFestivals.length > 0 ? (
          <section>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "12px" }}>2026 Cultural Festivals ({matchedFestivals.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
              {matchedFestivals.map(f => (
                <div key={f.id} className="card card-hoverable" style={{ padding: "var(--space-lg)" }}>
                  <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>{f.name}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-accent)", fontWeight: 600, marginBottom: "8px" }}>{f.displayDate} • {f.location}</div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>{f.description}</p>
                  <Link href="/festivals" className="btn btn-sm btn-outline">View in Calendar →</Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {matchedBookings.length > 0 ? (
          <section>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "12px" }}>Verified Bookings & Passes ({matchedBookings.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
              {matchedBookings.map(b => (
                <div key={b.id} className="card card-hoverable" style={{ padding: "var(--space-lg)", borderLeft: "4px solid var(--color-brand-accent)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "4px" }}>{b.territoryName} • {b.providerName}</div>
                  <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{b.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>{b.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--color-border-subtle)" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>₹{b.pricing.inr}</span>
                    <Link href="/bookings" className="btn btn-sm btn-outline">View Booking →</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {matchedSafety.length > 0 ? (
          <section>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "12px" }}>Official Safety Helplines ({matchedSafety.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-md)" }}>
              {matchedSafety.map((c, idx) => (
                <a key={idx} href={`tel:${c.number}`} className="card card-hoverable" style={{ padding: "var(--space-lg)", borderLeft: "4px solid var(--color-emergency)", textDecoration: "none" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{c.category}</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-primary)", margin: "2px 0" }}>{c.number}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)", marginBottom: "4px" }}>{c.service}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{c.description}</div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {totalResults === 0 ? (
          <div className="card" style={{ padding: "var(--space-2xl)", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No verified records matched your search</h3>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: "480px", margin: "0 auto 16px" }}>
              Try searching by territory name (e.g. Ladakh, Andaman, Delhi), destination (Cellular Jail, Pangong, Red Fort), or festival.
            </p>
            <Link href="/destinations" className="btn btn-primary">Browse All Destinations</Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
