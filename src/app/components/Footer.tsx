import Link from "next/link";
import { VERIFIED_TERRITORIES } from "@/src/lib/fixtures";

export function Footer() {
  return (
    <footer
      className="footer"
      role="contentinfo"
      style={{
        background: "var(--stitch-surface-variant, #F0EADE)",
        borderTop: "1px solid var(--stitch-outline-variant, #D3C9BD)",
        color: "var(--stitch-on-surface-variant, #4A3C31)",
        padding: "var(--space-3xl) 0 var(--space-xl)",
        marginTop: "auto",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-2xl)",
          marginBottom: "var(--space-2xl)",
          maxWidth: "var(--container-max-width)",
          margin: "0 auto var(--space-2xl)",
        }}
      >
        {/* Col 1: Platform Mission */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>🇮🇳</span>
            <span
              className="font-serif"
              style={{
                fontWeight: 700,
                fontSize: "1.2rem",
                letterSpacing: "-0.01em",
                color: "#2D1B14",
              }}
            >
              Heritage Yatra
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "inherit", lineHeight: 1.6, marginBottom: "16px", opacity: 0.9 }}>
            Preserving traditions and securing journeys across India&apos;s 8 Union Territories with verified government intelligence, geospatial routing, and Yatra AI.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="badge badge-verified" style={{ fontSize: "0.7rem", background: "rgba(200, 142, 68, 0.15)", color: "#2D1B14", borderColor: "#C88E44" }}>
              8 Union Territories
            </span>
            <span className="badge badge-emergency" style={{ fontSize: "0.7rem", background: "#ba1a1a", color: "#ffffff" }}>
              24x7 Safety Guard
            </span>
          </div>
        </div>

        {/* Col 2: 8 Union Territories */}
        <div>
          <h4
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#2D1B14",
            }}
          >
            8 Union Territories
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {VERIFIED_TERRITORIES.map((ut) => (
              <li key={ut.id}>
                <Link
                  href={`/territories/${ut.slug}`}
                  style={{
                    fontSize: "0.85rem",
                    color: "inherit",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  className="hover:text-[#C88E44]"
                >
                  {ut.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <h4
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#2D1B14",
            }}
          >
            Quick Navigation
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><Link href="/destinations" style={{ fontSize: "0.85rem", color: "inherit", textDecoration: "none" }} className="hover:text-[#C88E44]">All Verified Destinations</Link></li>
            <li><Link href="/itinerary" style={{ fontSize: "0.85rem", color: "inherit", textDecoration: "none" }} className="hover:text-[#C88E44]">Smart Itinerary Builder</Link></li>
            <li><Link href="/map" style={{ fontSize: "0.85rem", color: "inherit", textDecoration: "none" }} className="hover:text-[#C88E44]">Geospatial 3D Map</Link></li>
            <li><Link href="/ai" style={{ fontSize: "0.85rem", color: "inherit", textDecoration: "none" }} className="hover:text-[#C88E44]">Yatra AI Travel Studio</Link></li>
            <li><Link href="/safety" style={{ fontSize: "0.85rem", color: "inherit", textDecoration: "none" }} className="hover:text-[#C88E44]">Safety & Emergency Protocol</Link></li>
          </ul>
        </div>

        {/* Col 4: Safety & Helplines */}
        <div>
          <h4
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              marginBottom: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#ba1a1a",
            }}
          >
            Emergency Helplines
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(211, 201, 189, 0.6)",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--stitch-outline, #9C8D7F)" }}>
                National Emergency Service
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ba1a1a" }}>112</div>
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(211, 201, 189, 0.6)",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--stitch-outline, #9C8D7F)" }}>
                All-India 24x7 Tourist Helpline
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2D1B14" }}>1363</div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        className="container"
        style={{
          borderTop: "1px solid rgba(156, 141, 127, 0.3)",
          paddingTop: "var(--space-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.8rem",
          maxWidth: "var(--container-max-width)",
          margin: "0 auto",
        }}
      >
        <div>© 2026 Bharat Heritage Yatra • Bharat Safe Yatra. Preserving traditions and securing travelers.</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/privacy" style={{ textDecoration: "none", color: "inherit" }} className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" style={{ textDecoration: "none", color: "inherit" }} className="hover:underline">Terms of Service</Link>
          <Link href="/safety" style={{ textDecoration: "none", color: "inherit" }} className="hover:underline">Travel Safely</Link>
        </div>
      </div>
    </footer>
  );
}
