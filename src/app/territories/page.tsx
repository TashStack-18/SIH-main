import Link from "next/link";
import { VERIFIED_TERRITORIES } from "@/src/lib/fixtures";
import { PremiumDepthImage } from "@/src/app/components/PremiumDepthImage";

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
          <Link href={`/territories/${ut.slug}`} key={ut.id} data-territory={ut.slug} className="card card-hoverable relative overflow-hidden block" style={{ minHeight: "400px", borderRadius: "var(--radius-xl)", border: "none" }}>
            <PremiumDepthImage
              src={ut.heroImage}
              alt={ut.name}
              className="w-full h-full object-cover"
            >
              <div className="w-full h-full flex flex-col justify-end" style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.35) 30%, transparent 55%)", padding: "0 20px 20px 20px" }}>
                <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-territory-accent, #ffffff)", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    0{idx + 1} &mdash; {ut.shortName.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255, 255, 255, 0.65)", fontWeight: 500, marginBottom: "4px" }}>
                  Capital: {ut.capital}
                </div>
                <h2 className="font-serif" style={{ margin: "0 0 6px 0", fontSize: "1.55rem", lineHeight: 1.15, letterSpacing: "0.02em", color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                  {ut.name}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.825rem", lineHeight: 1.45, marginBottom: "16px", fontWeight: 300, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                  {ut.shortDescription}
                </p>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-territory-accent, var(--color-accent))", textTransform: "uppercase", letterSpacing: "0.04em", display: "inline-flex", alignItems: "center" }}>
                  Explore Territory <span style={{ marginLeft: "4px", fontSize: "1.2em", transition: "transform 0.2s ease" }}>→</span>
                </div>
              </div>
            </PremiumDepthImage>
          </Link>
        ))}
      </div>
    </main>
  );
}
