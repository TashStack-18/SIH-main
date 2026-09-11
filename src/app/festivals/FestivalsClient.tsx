"use client";

import { useState } from "react";
import Link from "next/link";

export default function FestivalsClient({ festivals }: { festivals: any[] }) {
  const [selectedUT, setSelectedUT] = useState("ALL UNION TERRITORIES");

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
    : festivals.filter(f => f.ut === selectedUT);

  return (
    <>
      <div style={{ marginBottom: "var(--space-xl)", display: "flex", justifyContent: "flex-end" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
        {filteredFestivals.map(fest => (
          <article key={fest.id} className="card card-hoverable" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
              <img src={fest.image} alt={fest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px" }}>
                <div style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(8px)", padding: "6px 12px", borderRadius: "var(--radius-sm)", color: "#ffffff", fontSize: "0.85rem", fontWeight: 700 }}>
                  {fest.displayDate}
                </div>
              </div>
            </div>

            <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", marginBottom: "4px" }}>
                {fest.ut} • {fest.category}
              </div>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>{fest.name}</h2>
              <div style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", marginBottom: "10px" }}>
                {fest.location}
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-md)", flexGrow: 1 }}>
                {fest.description}
              </p>

              <div style={{ background: "var(--color-bg-surface-elevated)", padding: "10px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--color-text-primary)", marginBottom: "14px" }}>
                <strong>Cultural Legacy:</strong> {fest.culturalSignificance}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--color-border-subtle)" }}>
                <a href={fest.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.775rem", color: "var(--color-primary)", textDecoration: "underline" }}>
                  ✓ Source: {fest.officialSource.name} ↗
                </a>
                <Link href="/itinerary" className="btn btn-sm btn-primary">
                  + Add to Itinerary
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
