"use client";

import { useState } from "react";
import Link from "next/link";
import BorderGlow from "../components/BorderGlow";

export default function FestivalsClient({ festivals }: { festivals: any[] }) {
  const [selectedUT, setSelectedUT] = useState<string>("ALL UNION TERRITORIES");

  const utOptions = [
    "ALL UNION TERRITORIES",
    "Andaman & Nicobar Islands",
    "Chandigarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];

  const filteredFestivals = selectedUT === "ALL UNION TERRITORIES" 
    ? festivals 
    : festivals.filter(f => f.territoryName === selectedUT || f.ut === selectedUT);

  return (
    <>
      {/* UT Filter Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-2xl)", marginTop: "var(--space-xl)" }}>
        <select 
          value={selectedUT} 
          onChange={(e) => setSelectedUT(e.target.value)}
          aria-label="Filter by Union Territory"
          style={{ 
            padding: "10px 16px", 
            borderRadius: "var(--radius-sm)", 
            border: "1px solid var(--color-border-subtle)",
            backgroundColor: "var(--color-bg-surface-elevated)",
            color: "var(--color-text-primary)",
            fontSize: "0.95rem",
            fontWeight: 500,
            maxWidth: "100%",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          {utOptions.map(ut => (
            <option key={ut} value={ut}>{ut}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xl)", justifyContent: "center" }}>
        {filteredFestivals.map(fest => (
          <BorderGlow 
            key={fest.id} 
            className="card-hoverable" 
            style={{ 
              flex: "1 1 340px", 
              maxWidth: "420px", 
              width: "100%",
            }}
            backgroundColor="#FFFFFF"
            borderRadius={20}
            glowColor="35 60 50"
            glowRadius={44}
            glowIntensity={1.5}
            edgeSensitivity={44}
            coneSpread={35}
            animated={false}
            colors={['#C88E44', '#f59e0b', '#78350f']}
          >
            <div style={{ position: "relative", height: "230px", overflow: "hidden" }}>
              <img src={fest.image} alt={fest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              
              {/* UT, Category & Date Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.06em",
                  color: (() => {
                    const utColors: Record<string, string> = {
                      "Andaman & Nicobar Islands": "#0284c7",
                      "Chandigarh": "#16a34a",
                      "Dadra & Nagar Haveli and Daman & Diu": "#d97706",
                      "Delhi": "#dc2626",
                      "Jammu & Kashmir": "#9333ea",
                      "Ladakh": "#C88E44",
                      "Lakshadweep": "#0d9488",
                      "Puducherry": "#e11d48",
                    };
                    return utColors[fest.ut] || "var(--color-primary)";
                  })(),
                  background: (() => {
                    const utBg: Record<string, string> = {
                      "Andaman & Nicobar Islands": "rgba(2,132,199,0.12)",
                      "Chandigarh": "rgba(22,163,74,0.12)",
                      "Dadra & Nagar Haveli and Daman & Diu": "rgba(217,119,6,0.12)",
                      "Delhi": "rgba(220,38,38,0.12)",
                      "Jammu & Kashmir": "rgba(147,51,234,0.12)",
                      "Ladakh": "rgba(200,142,68,0.15)",
                      "Lakshadweep": "rgba(13,148,136,0.12)",
                      "Puducherry": "rgba(225,29,72,0.12)",
                    };
                    return utBg[fest.ut] || "rgba(0,0,0,0.05)";
                  })(),
                  padding: "5px 10px",
                  borderRadius: "6px"
                }}>
                  {fest.ut}
                </span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8E8076", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  • {fest.category}
                </span>

                <div style={{ 
                  marginLeft: "auto", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  fontSize: "0.75rem", 
                  fontWeight: 800, 
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  color: (() => {
                    const utColors: Record<string, string> = {
                      "Andaman & Nicobar Islands": "#0284c7",
                      "Chandigarh": "#16a34a",
                      "Dadra & Nagar Haveli and Daman & Diu": "#d97706",
                      "Delhi": "#dc2626",
                      "Jammu & Kashmir": "#9333ea",
                      "Ladakh": "#C88E44",
                      "Lakshadweep": "#0d9488",
                      "Puducherry": "#e11d48",
                    };
                    return utColors[fest.ut] || "var(--color-primary)";
                  })(),
                  border: `1px solid ${(() => {
                    const utColors: Record<string, string> = {
                      "Andaman & Nicobar Islands": "#0284c7",
                      "Chandigarh": "#16a34a",
                      "Dadra & Nagar Haveli and Daman & Diu": "#d97706",
                      "Delhi": "#dc2626",
                      "Jammu & Kashmir": "#9333ea",
                      "Ladakh": "#C88E44",
                      "Lakshadweep": "#0d9488",
                      "Puducherry": "#e11d48",
                    };
                    return utColors[fest.ut] || "var(--color-primary)";
                  })()}`,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)"
                }}>
                  <span style={{ fontSize: "0.9rem" }}>🗓️</span> {fest.displayDate}
                </div>
              </div>

              {/* Title & Location */}
              <h2 className="font-serif" style={{ fontSize: "1.45rem", fontWeight: 700, color: "#2D1B14", margin: "0 0 6px 0", lineHeight: 1.2 }}>
                {fest.name}
              </h2>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#C88E44", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>📍</span> {fest.location}
              </div>
              
              <p style={{ fontSize: "0.95rem", color: "#4A3C31", lineHeight: 1.6, marginBottom: "20px", flexGrow: 1 }}>
                {fest.description}
              </p>

              {/* Cultural Legacy Callout Box */}
              <div style={{ 
                background: "linear-gradient(to right, rgba(200, 142, 68, 0.08), rgba(200, 142, 68, 0.02))", 
                borderLeft: "4px solid #C88E44",
                padding: "16px 20px", 
                borderRadius: "0 10px 10px 0", 
                marginBottom: "22px" 
              }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#C88E44", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                  Cultural Legacy
                </div>
                <div style={{ fontSize: "0.95rem", color: "#3A2A22", lineHeight: 1.65, fontWeight: 500 }}>
                  {fest.culturalSignificance}
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "18px", borderTop: "1px solid rgba(45, 27, 20, 0.08)" }}>
                <a 
                  href={fest.officialSource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8E8076", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#C88E44'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#8E8076'}
                >
                  ✓ Source: {fest.officialSource.name} ↗
                </a>
                <Link 
                  href={`/itinerary?festival=${fest.id}`} 
                  style={{
                    background: "linear-gradient(135deg, #C88E44 0%, #a76d29 100%)",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(200, 142, 68, 0.3)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(200, 142, 68, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 142, 68, 0.3)';
                  }}
                >
                  + Itinerary
                </Link>
              </div>
            </div>
          </BorderGlow>
        ))}
      </div>
    </>
  );
}
