import Link from "next/link";
import { VERIFIED_BOOKABLE_EXPERIENCES, VERIFIED_BOOKING_PROVIDERS } from "@/src/lib/fixtures";

export const metadata = {
  title: "Verified Bookings & Government E-Tickets",
  description: "Official government ticketing portals, state tourism stays, and authorized island packages across India's 8 Union Territories."
};

export default function BookingsPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-verified" style={{ width: "fit-content" }}>Provider Adapter Architecture</span>
        <h1>Verified Bookings & E-Tickets</h1>
        <p className="lead-text">
          Access official government ticketing portals, state tourism corporation stays, and authorized island packages with genuine availability states.
        </p>
      </div>

      <section style={{ marginBottom: "var(--space-3xl)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-md)" }}>Your Confirmed Bookings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "var(--space-lg)" }}>
          <div className="card" style={{ padding: "var(--space-lg)", borderLeft: "4px solid var(--color-success)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="badge badge-verified">✓ CONFIRMED</span>
              <span className="font-mono" style={{ fontSize: "0.775rem", color: "var(--color-text-muted)" }}>Ref: AN-ET-99201</span>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>Cellular Jail Sound & Light Show E-Ticket</h3>
            <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600, marginBottom: "8px" }}>18 Sep 2026 • 05:30 PM</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "14px" }}>Provider: Andaman E-Tourist Portal</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--color-border-subtle)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)" }}>₹150 per person</span>
              <button className="btn btn-sm btn-outline">
                📄 View Digital Pass
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-3xl)", background: "var(--color-bg-surface-elevated)", padding: "var(--space-xl)", borderRadius: "var(--radius-xl)" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Integrated Government Tourism Providers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-md)" }}>
          {VERIFIED_BOOKING_PROVIDERS.map(p => (
            <div key={p.id} style={{ background: "var(--color-bg-surface)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)" }}>
              <span className="badge badge-official" style={{ fontSize: "0.65rem", marginBottom: "4px" }}>{p.badge}</span>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>{p.name}</div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.775rem", color: "var(--color-primary)", textDecoration: "underline" }}>
                Visit Official Portal ↗
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header-row">
          <div>
            <h2>Authorized Experiences & Accommodation</h2>
            <p className="sub-text">Genuine government e-tickets and verified tour packages across the 8 UTs.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
          {VERIFIED_BOOKABLE_EXPERIENCES.map(exp => (
            <article key={exp.id} className="card card-hoverable" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                  <span className="badge badge-verified">✓ {exp.category}</span>
                </div>
              </div>

              <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ fontSize: "0.775rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", marginBottom: "4px" }}>
                  {exp.location}
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>{exp.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-md)", flexGrow: 1 }}>
                  {exp.description}
                </p>

                <div style={{ background: "var(--color-bg-surface-elevated)", padding: "10px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", marginBottom: "14px" }}>
                  <div><strong>Provider:</strong> {exp.providerName}</div>
                  <div><strong>Timing:</strong> {exp.timing}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--color-border-subtle)" }}>
                  <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {exp.pricing}
                  </div>
                  <a href={exp.directUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    Book on Official Portal ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
