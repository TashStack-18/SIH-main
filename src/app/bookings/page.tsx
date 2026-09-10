"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VERIFIED_DESTINATIONS, VERIFIED_BOOKABLE_EXPERIENCES, VERIFIED_BOOKING_PROVIDERS } from "@/src/lib/fixtures";
import { FloatingYatraAI } from "@/src/app/components/FloatingYatraAI";

const BOOKING_CATEGORIES = [
  { id: "flights", label: "Flights" },
  { id: "trains", label: "Trains" },
  { id: "hotels", label: "Hotels" },
  { id: "stays", label: "Vacation stays" },
  { id: "cabs", label: "Cabs / transport" },
  { id: "guides", label: "Tour guides" },
  { id: "darshan", label: "Temple darshan" },
  { id: "tours", label: "Tours / experiences" },
];

function BookingsContent() {
  const searchParams = useSearchParams();
  
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [travellers, setTravellers] = useState<string>("2");
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for pre-filling
    const dest = searchParams.get("destination");
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const pax = searchParams.get("travellers");

    if (dest) {
      // Try to find the exact destination name or match by ID
      const matchedDest = VERIFIED_DESTINATIONS.find(d => 
        d.id.toLowerCase() === dest.toLowerCase() || 
        d.name.toLowerCase() === dest.toLowerCase() ||
        d.territoryId.toLowerCase() === dest.toLowerCase()
      );
      if (matchedDest) {
        setSelectedDestination(matchedDest.name);
      } else {
        setSelectedDestination(dest); // fallback to raw param
      }
    }
    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (pax) setTravellers(pax);
  }, [searchParams]);

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestination) {
      setIsPlanning(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="container section-spacing" role="main" style={{ minHeight: "100vh" }}>
      
      {!isPlanning ? (
        <section className="booking-hero" style={{ padding: "var(--space-3xl) 0", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 className="font-serif" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "var(--space-md)", lineHeight: 1.1 }}>
            Plan every part of your journey.
          </h1>
          <p className="lead-text" style={{ fontSize: "1.2rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-2xl)", maxWidth: "600px", margin: "0 auto var(--space-2xl)" }}>
            Flights, trains, stays, transport, guides and experiences — organized around your trip, with trusted providers to complete the booking.
          </p>

          <form onSubmit={handleStartPlanning} className="trip-context-form glass-panel ambient-shadow" style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)", textAlign: "left", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div>
              <label htmlFor="destination" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Where are you going?</label>
              <select 
                id="destination" 
                value={selectedDestination} 
                onChange={(e) => setSelectedDestination(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", background: "var(--color-bg-canvas)", fontSize: "1rem" }}
              >
                <option value="" disabled>Search a destination</option>
                <optgroup label="Popular Territories">
                  <option value="Ladakh">Ladakh</option>
                  <option value="Andaman & Nicobar">Andaman & Nicobar Islands</option>
                  <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                </optgroup>
                <optgroup label="Specific Destinations">
                  {VERIFIED_DESTINATIONS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <div>
                <label htmlFor="startDate" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Start date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", background: "var(--color-bg-canvas)", fontSize: "1rem", color: "var(--color-text-primary)" }}
                />
              </div>
              <div>
                <label htmlFor="endDate" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>End date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", background: "var(--color-bg-canvas)", fontSize: "1rem", color: "var(--color-text-primary)" }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="travellers" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>Travellers</label>
              <select 
                id="travellers" 
                value={travellers} 
                onChange={(e) => setTravellers(e.target.value)}
                style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", background: "var(--color-bg-canvas)", fontSize: "1rem" }}
              >
                <option value="1">1 traveller</option>
                <option value="2">2 travellers</option>
                <option value="3">3 travellers</option>
                <option value="4">4 travellers</option>
                <option value="5+">5+ travellers</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.1rem", marginTop: "8px", cursor: "pointer" }}>
              Start planning
            </button>
          </form>
        </section>
      ) : (
        <section className="booking-planner" style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-xl) 0" }}>
          
          <div className="trip-summary" style={{ marginBottom: "var(--space-3xl)", paddingBottom: "var(--space-2xl)", borderBottom: "1px solid var(--color-border-subtle)", textAlign: "center" }}>
            <span className="font-mono text-sm tracking-widest text-[var(--color-text-muted)] uppercase mb-4 block">Travel Concierge</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[var(--color-text-primary)] leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Planning <span className="text-[var(--color-accent)]">{selectedDestination}</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] font-medium max-w-2xl mx-auto mb-8">
              {startDate && endDate ? `${startDate} — ${endDate}` : "Flexible Dates"} <span className="mx-2">•</span> {travellers} {travellers === "1" ? "traveller" : "travellers"}
            </p>
            <button 
              onClick={() => setIsPlanning(false)} 
              className="btn btn-outline btn-sm rounded-full" 
            >
              Modify Travel Details
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-2xl)" }}>
            
            {/* LEFT COLUMN: CONCIERGE CHECKLIST */}
            <div className="pr-0 md:pr-8">
              <h2 className="font-serif text-2xl mb-8 text-[var(--color-text-primary)]">Your Travel Itinerary</h2>
              
              <div className="checklist" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
                <div className="checklist-group">
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Getting there</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button onClick={() => setActiveCategory("flights")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "flights" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "flights" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      <span style={{ marginRight: "12px" }}></span> Flights <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Compare</span>
                    </button>
                    <button onClick={() => setActiveCategory("trains")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "trains" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "trains" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      <span style={{ marginRight: "12px" }}>🚆</span> Trains <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                  </div>
                </div>

                <div className="checklist-group">
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Staying there</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button onClick={() => setActiveCategory("hotels")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "hotels" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "hotels" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      <span style={{ marginRight: "12px" }}>🏨</span> Hotels <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                    <button onClick={() => setActiveCategory("stays")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "stays" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "stays" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      <span style={{ marginRight: "12px" }}>🏡</span> Vacation stays <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                  </div>
                </div>

                <div className="checklist-group">
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Getting around</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button onClick={() => setActiveCategory("cabs")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "cabs" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "cabs" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      <span style={{ marginRight: "12px" }}>🚕</span> Cabs / transport <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                  </div>
                </div>

                <div className="checklist-group">
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Experience it</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button onClick={() => setActiveCategory("guides")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "guides" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "guides" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      Tour guides <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                    <button onClick={() => setActiveCategory("tours")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "tours" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "tours" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      Tours / experiences <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                    <button onClick={() => setActiveCategory("darshan")} className="btn btn-ghost" style={{ justifyContent: "flex-start", padding: "12px", background: activeCategory === "darshan" ? "var(--color-bg-surface-elevated)" : "transparent", border: "1px solid", borderColor: activeCategory === "darshan" ? "var(--color-primary)" : "var(--color-border-subtle)", borderRadius: "var(--radius-md)", width: "100%", textAlign: "left" }}>
                      Temple darshan <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Explore</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONCIERGE OPTIONS */}
            <div className="provider-options" style={{ background: "var(--color-bg-surface-elevated)", padding: "var(--space-2xl)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-subtle)", alignSelf: "start", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }}>
              {!activeCategory ? (
                <div style={{ textAlign: "center", padding: "var(--space-3xl) 0" }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] mb-6 text-[var(--color-text-muted)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-[var(--color-text-primary)]">Curated Partners</h3>
                  <p className="text-[var(--color-text-secondary)]">Select a category from your itinerary to view our verified booking partners.</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-6 text-[var(--color-text-primary)] leading-tight">
                    {BOOKING_CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h3>

                  <div style={{ marginBottom: "var(--space-xl)" }}>
                    <div className="badge badge-neutral" style={{ display: "inline-flex", alignItems: "flex-start", gap: "8px", marginBottom: "16px", background: "var(--color-bg-surface)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-subtle)", padding: "8px 12px", textAlign: "left", whiteSpace: "normal", lineHeight: 1.4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      Booking is completed on the selected provider's website. Prices and availability may change.
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                    {/* FLIGHTS */}
                    {activeCategory === "flights" && (
                      <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Skyscanner India</h4>
                            <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>Flight comparison/search provider</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Search flights for {selectedDestination}</span>
                          <a href="https://www.skyscanner.co.in/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to Skyscanner ↗</a>
                        </div>
                      </div>
                    )}

                    {/* TRAINS */}
                    {activeCategory === "trains" && (
                      <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>IRCTC</h4>
                            <span className="badge badge-official" style={{ fontSize: "0.65rem" }}>Official railway booking portal</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Book through the official railway portal</span>
                          <a href="https://www.irctc.co.in/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to IRCTC ↗</a>
                        </div>
                      </div>
                    )}

                    {/* CABS */}
                    {activeCategory === "cabs" && (
                      <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Uber India</h4>
                            <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>External ride provider</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Book a ride locally</span>
                          <a href="https://www.uber.com/in/en/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to Uber ↗</a>
                        </div>
                      </div>
                    )}

                    {/* GUIDES */}
                    {activeCategory === "guides" && (
                      <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Ministry of Tourism (DESH)</h4>
                            <span className="badge badge-official" style={{ fontSize: "0.65rem" }}>Official guide platform</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Find verified tourism guides where available</span>
                          <a href="https://tourism.gov.in/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to DESH ↗</a>
                        </div>
                      </div>
                    )}

                    {/* DARSHAN */}
                    {activeCategory === "darshan" && (() => {
                      const TEMPLE_PORTALS: Record<string, { name: string, url: string, badge: string }> = {
                        "Tirupati": { name: "Tirumala Tirupati Devasthanams", url: "https://tirupatibalaji.ap.gov.in/", badge: "Official temple booking portal" },
                        "Andhra Pradesh": { name: "Tirumala Tirupati Devasthanams", url: "https://tirupatibalaji.ap.gov.in/", badge: "Official temple booking portal" },
                        "Shirdi": { name: "Shree Saibaba Sansthan Trust", url: "https://online.sai.org.in/", badge: "Official temple booking portal" },
                        "Maharashtra": { name: "Shree Saibaba Sansthan Trust", url: "https://online.sai.org.in/", badge: "Official temple booking portal" }
                      };
                      const portal = TEMPLE_PORTALS[selectedDestination];
                      
                      if (portal) {
                        return (
                          <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                              <div>
                                <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{portal.name}</h4>
                                <span className="badge badge-official" style={{ fontSize: "0.65rem" }}>{portal.badge}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                              <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Official destination portal</span>
                              <a href={portal.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to official portal ↗</a>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)", opacity: 0.8 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                              <div>
                                <h4 style={{ fontSize: "1.1rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>{selectedDestination} Temples</h4>
                              </div>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: 0 }}>Official online booking link not available for this specific destination.</p>
                          </div>
                        );
                      }
                    })()}

                    {/* TOURS & EXPERIENCES */}
                    {activeCategory === "tours" && (
                      VERIFIED_BOOKABLE_EXPERIENCES.length > 0 ? (
                        VERIFIED_BOOKABLE_EXPERIENCES.map(exp => (
                          <div key={exp.id} className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                            <h4 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>{exp.title}</h4>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>{exp.providerName}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Check current availability</span>
                              <a href={exp.directUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to provider ↗</a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)", opacity: 0.8 }}>
                          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: 0 }}>Verified experiences not yet configured.</p>
                        </div>
                      )
                    )}

                    {/* HOTELS & STAYS */}
                    {(activeCategory === "hotels" || activeCategory === "stays") && (() => {
                      const filteredProviders = VERIFIED_BOOKING_PROVIDERS.filter(p => {
                        const types = (p as any).serviceTypes || [];
                        if (activeCategory === "hotels" || activeCategory === "stays") return types.includes("HOTEL") || types.includes("PACKAGE");
                        return false;
                      });

                      if (filteredProviders.length > 0) {
                        return filteredProviders.map(p => (
                          <div key={p.id} className="provider-card" style={{ padding: "var(--space-lg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                              <div>
                                <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{p.name}</h4>
                                <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>{p.badge}</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)", flexWrap: "wrap", gap: "12px" }}>
                              <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Search verified providers</span>
                              <a href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Continue to provider ↗</a>
                            </div>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="provider-card" style={{ padding: "var(--space-lg)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)", background: "var(--color-bg-canvas)", opacity: 0.8 }}>
                            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: 0 }}>Hotel/Stay search integration coming soon.</p>
                          </div>
                        );
                      }
                    })()}

                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="secondary-discovery" style={{ marginTop: "var(--space-3xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--color-border-subtle)" }}>
            <h3 className="font-sans" style={{ fontSize: "1.1rem", marginBottom: "var(--space-md)", textAlign: "center", color: "var(--color-text-secondary)" }}>Need something specific?</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {BOOKING_CATEGORIES.map(category => (
                <button 
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="btn btn-sm btn-ghost"
                  style={{ 
                    border: "1px solid var(--color-border-subtle)", 
                    background: activeCategory === category.id ? "var(--color-bg-surface-elevated)" : "var(--color-bg-canvas)",
                    color: activeCategory === category.id ? "var(--color-accent)" : "var(--color-text-primary)",
                    cursor: "pointer"
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Yatra AI widget remains available contextually */}
      <FloatingYatraAI />
    </main>
  );
}

export default function BookingsPage() {
  return (
    <React.Suspense fallback={<div className="container py-20 text-center" style={{ minHeight: "100vh" }}>Loading booking details...</div>}>
      <BookingsContent />
    </React.Suspense>
  );
}
