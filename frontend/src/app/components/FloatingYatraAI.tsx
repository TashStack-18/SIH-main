"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function FloatingYatraAI() {
  const router = useRouter();
  
  return (
    <>
      <button
        onClick={() => router.push("/ai")}
        aria-label="Open Yatra AI Travel Studio"
        className="floating-yatra-ai"
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "var(--color-bg-surface-elevated)",
          border: "1.5px solid var(--color-accent)",
          color: "var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 12px var(--color-accent-light)",
          cursor: "pointer",
          // The intro animation uses z-index: 99999.
          // This ensures the floating button sits below it during the intro but above normal content.
          zIndex: 9000,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 16px var(--color-accent-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px var(--color-accent-light)";
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid var(--color-accent)";
          e.currentTarget.style.outlineOffset = "4px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        ✦
      </button>
      <style>{`
        .floating-yatra-ai {
          animation: yatraIdleFloat 4s ease-in-out infinite;
        }
        @keyframes yatraIdleFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-yatra-ai {
            animation: none !important;
          }
        }
        @media (max-width: 768px) {
          .floating-yatra-ai {
            width: 52px !important;
            height: 52px !important;
            bottom: 24px !important;
            right: 24px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </>
  );
}
