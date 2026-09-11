"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LiveAlert {
  id: string;
  territoryId: string;
  title: string;
  description: string;
  severity: "Info" | "Moderate" | "High" | "Critical";
  timestamp: string;
  source: string;
  type: string;
  coordinates?: [number, number];
  url?: string;
}

interface TravelAdvisory {
  id: string;
  territoryId: string;
  territorySlug: string;
  title: string;
  summary: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  officialSource: string;
  url: string;
}

interface SafetyConditions {
  liveAlerts: LiveAlert[];
  advisories: TravelAdvisory[];
  fetchedAt: string;
  error?: boolean;
}

const TERRITORIES: Record<string, string> = {
  "andaman-and-nicobar-islands": "Andaman & Nicobar Islands",
  "chandigarh": "Chandigarh",
  "dadra-and-nagar-haveli-and-daman-and-diu": "Dadra & Nagar Haveli and Daman & Diu",
  "delhi": "Delhi",
  "jammu-and-kashmir": "Jammu & Kashmir",
  "ladakh": "Ladakh",
  "lakshadweep": "Lakshadweep",
  "puducherry": "Puducherry",
};

interface LiveSafetyAlertsPopoverProps {
  isTransparent?: boolean;
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
}

export function LiveSafetyAlertsPopover({ isTransparent, isMobile, onCloseMobileMenu }: LiveSafetyAlertsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [safetyConditions, setSafetyConditions] = useState<SafetyConditions | null>(null);
  const [loading, setLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/safety/live");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setSafetyConditions(data);
        }
      } catch (err) {
        console.error("Failed to fetch live safety alerts:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const activeAlerts = safetyConditions?.liveAlerts || [];
  const activeCount = activeAlerts.length;

  const togglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL": return "var(--color-danger, #DC2626)";
      case "HIGH": return "var(--color-warning, #EA580C)";
      case "MODERATE":
      case "MEDIUM": return "var(--color-brand-accent, #C88E44)";
      default: return "var(--color-primary, #2D1B14)";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL": return "rgba(220, 38, 38, 0.08)";
      case "HIGH": return "rgba(234, 88, 12, 0.08)";
      case "MODERATE":
      case "MEDIUM": return "rgba(200, 142, 68, 0.08)";
      default: return "rgba(45, 27, 20, 0.05)";
    }
  };

  // Sort alerts: CRITICAL > HIGH > MODERATE > INFO, then by timestamp
  const sortedAlerts = [...activeAlerts].sort((a, b) => {
    const sevScore = (sev: string) => {
      if (sev === "Critical") return 0;
      if (sev === "High") return 1;
      if (sev === "Moderate") return 2;
      return 3;
    };
    if (sevScore(a.severity) !== sevScore(b.severity)) {
      return sevScore(a.severity) - sevScore(b.severity);
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div style={{ position: "relative", display: isMobile ? "block" : "inline-block" }}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={togglePopover}
        aria-label="Open live safety alerts"
        aria-expanded={isOpen}
        aria-controls="live-safety-alerts-panel"
        className={!isMobile ? `nav-link` : ""}
        style={
          isMobile
            ? {
                fontSize: "1.1rem",
                fontWeight: 500,
                textAlign: "left",
                padding: "8px 0",
                color: "var(--color-text-primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }
            : {
                padding: "6px 14px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: isTransparent ? "#FFFFFF" : "var(--color-text-primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "var(--radius-pill, 9999px)",
                transition: "all 0.2s ease",
                textShadow: isTransparent ? "0 1px 4px rgba(0, 0, 0, 0.6)" : "none",
              }
        }
      >
        <span>Live Safety Alerts</span>
        {activeCount > 0 && (
          <span
            style={{
              background: "var(--color-danger, #DC2626)",
              color: "#FFFFFF",
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "10px",
              lineHeight: 1,
            }}
          >
            {activeCount}
          </span>
        )}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          ref={popoverRef}
          id="live-safety-alerts-panel"
          style={{
            position: isMobile ? "static" : "absolute",
            top: isMobile ? "auto" : "100%",
            left: isMobile ? "auto" : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            marginTop: isMobile ? "8px" : "16px",
            width: isMobile ? "100%" : "380px",
            background: "var(--color-bg-canvas, #F2F2ED)",
            borderRadius: "var(--radius-xl, 16px)",
            border: "1px solid var(--color-border-subtle)",
            boxShadow: "0 12px 32px rgba(45, 27, 20, 0.12)",
            zIndex: 100,
            overflow: "hidden",
            animation: "fadeInDown 0.2s ease-out",
            color: "var(--color-text-primary, #2D1B14)",
          }}
        >
          <style>{`
            @keyframes fadeInDown {
              from { opacity: 0; transform: ${isMobile ? "translateY(-10px)" : "translate(-50%, -10px)"}; }
              to { opacity: 1; transform: ${isMobile ? "translateY(0)" : "translate(-50%, 0)"}; }
            }
            .alert-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .alert-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .alert-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(45, 27, 20, 0.15);
              border-radius: 4px;
            }
          `}</style>

          {/* Panel Header */}
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--color-border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.04em" }}>LIVE SAFETY ALERTS</span>
              {activeCount > 0 && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                  {activeCount} active
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <Link
                href="/safety"
                onClick={() => {
                  setIsOpen(false);
                  if (onCloseMobileMenu) onCloseMobileMenu();
                }}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-brand-accent, #C88E44)",
                  textDecoration: "none",
                }}
              >
                View all →
              </Link>
            )}
          </div>

          {/* Panel Body */}
          <div
            className="alert-scrollbar"
            style={{
              maxHeight: "55vh",
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                Loading live alerts...
              </div>
            ) : safetyConditions?.error ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                Live alerts are currently unavailable.<br />Try again later.
              </div>
            ) : activeCount === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                  No active alerts right now.
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  All monitored Union Territories are currently clear.
                </div>
              </div>
            ) : (
              sortedAlerts.map((alert) => {
                const sevColor = getSeverityColor(alert.severity);
                const sevBg = getSeverityBg(alert.severity);
                const isCritical = alert.severity.toUpperCase() === "CRITICAL";

                return (
                  <div
                    key={alert.id}
                    style={{
                      background: sevBg,
                      border: isCritical ? `1px solid ${sevColor}` : "1px solid var(--color-border-subtle)",
                      borderRadius: "var(--radius-lg, 12px)",
                      padding: "16px",
                      position: "relative",
                    }}
                  >
                    {/* Top Row: Severity, UT, Time */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            color: sevColor,
                            fontWeight: 800,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {alert.severity}
                        </span>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-text-muted)" }}></span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "var(--color-text-secondary)",
                            textTransform: "uppercase",
                          }}
                        >
                          {TERRITORIES[alert.territoryId] || alert.territoryId}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: "6px",
                        lineHeight: 1.3,
                      }}
                    >
                      {alert.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.45,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {alert.description}
                    </p>

                    {/* Source / Action */}
                    <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                        {alert.source}
                      </span>
                      {alert.url && (
                        <a
                          href={alert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--color-brand-accent, #C88E44)",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          View advisory <span style={{ fontSize: "1rem", lineHeight: 0 }}>→</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
