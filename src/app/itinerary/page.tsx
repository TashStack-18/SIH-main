import Link from "next/link";

export const metadata = {
  title: "Smart Itinerary Planner",
  description: "Plan, customize, and optimize multi-day trips across India's 8 Union Territories with verified routes and budget calculation."
};

export default function ItineraryPage() {
  const days = [
    {
      dayNumber: 1,
      title: "Acclimatization & Leh Heritage Walk",
      date: "10 Sep 2026",
      summary: "Mandatory rest in Leh followed by evening stroll around Leh Main Bazaar & Shanti Stupa.",
      items: [
        { time: "09:30 AM", title: "Arrival at Leh Airport (3,256m)", type: "TRANSPORT", notes: "Immediate check-in & 48-hour acclimatization protocol" },
        { time: "05:00 PM", title: "Shanti Stupa Sunset Viewpoint", type: "ATTRACTION", notes: "Panoramic view over Indus Valley" }
      ]
    },
    {
      dayNumber: 2,
      title: "Leh to Nubra Valley via Khardung La",
      date: "11 Sep 2026",
      summary: "Cross one of the highest motorable passes in the world and descend into the dunes of Hunder.",
      items: [
        { time: "08:00 AM", title: "Scenic Ascent to Khardung La Pass (5,359m)", type: "TRANSPORT", notes: "Limit pass stop to 20 mins to prevent altitude sickness" },
        { time: "05:00 PM", title: "Hunder Sand Dunes & Bactrian Camel Safari", type: "EXPERIENCE", notes: "Double-humped camel ride along cold desert dunes" }
      ]
    },
    {
      dayNumber: 3,
      title: "Nubra Valley to Majestic Pangong Tso",
      date: "12 Sep 2026",
      summary: "Drive along the wild Shyok River route to the turquoise expanse of Pangong Tso.",
      items: [
        { time: "08:30 AM", title: "Scenic Drive via Shyok River Canyon", type: "TRANSPORT", notes: "Dramatic river canyons and high desert terrain" },
        { time: "02:00 PM", title: "First Glimpse of Pangong Tso (Spangmik)", type: "DESTINATION", notes: "Check-in to eco-dome camp" },
        { time: "08:30 PM", title: "Milky Way Stargazing Session", type: "EXPERIENCE", notes: "Unmatched Bortle-1 dark sky photography" }
      ]
    }
  ];

  return (
    <main className="container section-spacing" role="main">
      <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-xl)", padding: "var(--space-2xl)", marginBottom: "var(--space-2xl)", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              <span className="badge badge-verified">✓ Active Trip Plan</span>
              <span className="badge badge-official">Ladakh</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "6px" }}>Trans-Himalayan Ladakh Adventure</h1>
            <p className="lead-text" style={{ fontSize: "1rem" }}>
              5 Days • 2 Travellers • 10 Sep to 14 Sep 2026
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/ai" className="btn btn-outline">
              🤖 Yatra AI Optimize
            </Link>
            <Link href="/map" className="btn btn-primary">
              🗺️ View Route on Map
            </Link>
          </div>
        </div>

        <div style={{ background: "var(--color-bg-surface-elevated)", padding: "var(--space-md) var(--space-lg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <div>
            <span style={{ fontSize: "0.825rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)" }}>Trip Duration Editor:</span>
            <span style={{ fontWeight: 700, marginLeft: "6px", color: "var(--color-primary)" }}>5 Days</span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[3, 5, 7, 10].map(d => (
              <span key={d} className={`btn btn-sm ${d === 5 ? 'btn-primary' : 'btn-outline'}`}>
                {d} Days
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-xl)" }}>
        {days.map(day => (
          <section key={day.dayNumber} className="itinerary-day-box">
            <div className="itinerary-day-header">
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: "4px" }}>Day {day.dayNumber}</span>
                <h2 style={{ fontSize: "1.35rem", color: "var(--color-text-primary)" }}>{day.title}</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{day.date} • {day.summary}</p>
              </div>
            </div>

            <div className="timeline-items">
              {day.items.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-item-marker">●</div>
                  <div className="timeline-item-card">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                        <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>{item.type}</span>
                        <span className="font-mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>{item.time}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)" }}>{item.title}</div>
                      {item.notes ? <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "2px" }}>{item.notes}</div> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
