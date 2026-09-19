import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

export const metadata = {
  title: "User Profile & Travel Vault",
  description: "Manage your travel preferences, saved destinations, and trusted emergency contacts."
};

export default function ProfilePage() {
  const savedDestinations = VERIFIED_DESTINATIONS.slice(0, 2);

  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-verified" style={{ width: "fit-content" }}>Yatri Vault</span>
        <h1>My Profile & Travel Vault</h1>
        <p className="lead-text">Manage your travel preferences, saved destinations, and trusted emergency contacts.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-2xl)" }}>
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--color-primary)", color: "var(--color-text-inverse)", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              BY
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Bharat Yatri</h2>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Verified Bharat Yatri • Active Profile</div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--color-text-primary)", marginBottom: "8px" }}>Preferred Travel Styles</h3>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["Adventure", "Heritage", "Nature", "Photography"].map((s, idx) => (
                <span key={idx} className="badge badge-verified">{s}</span>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--color-bg-surface-elevated)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", marginBottom: "20px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-emergency)", marginBottom: "4px" }}>
              Primary Emergency Contact
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)" }}>Aditi Sharma (Family)</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>+91 98765 43210</div>
          </div>

          <button className="btn btn-outline" style={{ width: "100%" }}>
            ⚙️ Edit Preferences
          </button>
        </div>

        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.25rem" }}>Saved Destinations ({savedDestinations.length})</h3>
            <span className="badge badge-neutral">Wishlist</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedDestinations.map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-bg-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={d.image} alt={d.name} style={{ width: "44px", height: "44px", borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                  <div>
                    <Link href={`/destinations/${d.slug}`} style={{ fontWeight: 700, fontSize: "0.925rem", color: "var(--color-text-primary)", display: "block" }}>
                      {d.name}
                    </Link>
                    <span style={{ fontSize: "0.775rem", color: "var(--color-text-muted)" }}>{d.territoryName}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <Link href={`/destinations/${d.slug}`} className="btn btn-sm btn-outline">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
