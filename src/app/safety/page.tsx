import Link from "next/link";
import { VERIFIED_NATIONAL_CONTACTS, VERIFIED_EMERGENCY_FACILITIES, VERIFIED_ADVISORIES } from "@/src/lib/fixtures";

export const metadata = {
  title: "Safety Center & Emergency Directory",
  description: "Verified 24x7 trauma centers, all-India emergency helplines, coast guard rescue, and real-time travel advisories across 8 Union Territories."
};

export default function SafetyPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <h1>Safety Center & Emergency Hub</h1>
        <p className="lead-text">
          Instant access to verified 24x7 trauma centers, national emergency helplines, maritime rescue, and official travel advisories across India's 8 Union Territories.
        </p>
      </div>

      <section style={{ marginBottom: "var(--space-3xl)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-md)" }}>All-India Official Emergency Helplines</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-md)" }}>
          {VERIFIED_NATIONAL_CONTACTS.map((c, idx) => (
            <a key={idx} href={`tel:${c.number}`} className="card card-hoverable" style={{ padding: "var(--space-lg)", borderLeft: "4px solid var(--color-primary)", textDecoration: "none" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{c.category}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-primary)", margin: "2px 0" }}>{c.number}</div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)", marginBottom: "4px" }}>{c.service}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{c.description}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-3xl)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-md)" }}>Active Government Travel Advisories</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "var(--space-lg)" }}>
          {VERIFIED_ADVISORIES.map(adv => (
            <div key={adv.id} className="card" style={{ padding: "var(--space-lg)", borderLeft: `4px solid ${adv.severity === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)'}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className={`badge ${adv.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}`}>{adv.severity} Severity</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{adv.territoryName}</span>
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{adv.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
                {adv.summary}
              </p>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", paddingTop: "8px", borderTop: "1px solid var(--color-border-subtle)" }}>
                Official Source: {adv.officialSource}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header-row">
          <div>
            <h2>Verified 24x7 Emergency Medical Facilities</h2>
            <p className="sub-text">Apex trauma centers and district hospitals equipped with ICU, decompression, or high-altitude units.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-lg)" }}>
          {VERIFIED_EMERGENCY_FACILITIES.map(ef => (
            <article key={ef.id} className="card" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="badge badge-verified">✓ {ef.type}</span>
                <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>{ef.territoryName}</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", marginBottom: "4px", color: "var(--color-text-primary)" }}>{ef.name}</h3>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "10px" }}>{ef.address}</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                {ef.services.map((s, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>{s}</span>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a href={`tel:${ef.emergencyPhone || ef.phone}`} className="btn btn-sm btn-emergency">
                  📞 Call ({ef.phone})
                </a>
                <Link href="/map" className="btn btn-sm btn-outline">
                  📍 Locate on Map
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
