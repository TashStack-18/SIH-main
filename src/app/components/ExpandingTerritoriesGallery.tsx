"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PremiumDepthImage } from "./PremiumDepthImage";

interface Territory {
  id: string;
  slug: string;
  name: string;
  capital: string;
  tagline: string;
  thumbnailImage: string;
}

interface ExpandingTerritoriesGalleryProps {
  territories: Territory[];
}

export function ExpandingTerritoriesGallery({ territories }: ExpandingTerritoriesGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div 
      className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full gap-2 md:gap-3`}
      style={{ height: isMobile ? 'auto' : '450px' }}
      onMouseLeave={() => !isMobile && setActiveId(null)}
    >
      {territories.map((ut) => {
        const isActive = activeId === ut.id;
        const isDefault = activeId === null;
        
        let desktopFlex = 1;
        if (!isMobile) {
          desktopFlex = isDefault ? 1 : (isActive ? 4 : 0.85);
        }
        
        let mobileHeight = "120px";
        if (isMobile) {
          mobileHeight = isDefault ? "120px" : (isActive ? "320px" : "80px");
        }

        return (
          <motion.div
            key={ut.id}
            layout
            initial={false}
            animate={{
              flex: isMobile ? 'none' : desktopFlex,
              height: isMobile ? mobileHeight : '100%',
            }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="relative overflow-hidden rounded-[var(--radius-xl)]"
            data-territory={ut.slug}
            onMouseEnter={() => !isMobile && setActiveId(ut.id)}
            onClick={() => isMobile && setActiveId(isActive ? null : ut.id)}
            style={{ 
              width: isMobile ? '100%' : 'auto',
              cursor: 'pointer' 
            }}
            tabIndex={0}
            onFocus={() => setActiveId(ut.id)}
            onBlur={() => setActiveId(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // If it's already active and we press enter, maybe navigate?
                if (isActive) {
                   window.location.href = `/territories/${ut.slug}`;
                } else {
                   setActiveId(ut.id);
                }
              }
            }}
          >
            <Link href={`/territories/${ut.slug}`} className="block w-full h-full relative focus:outline-none" tabIndex={-1}>
              <PremiumDepthImage
                src={ut.thumbnailImage}
                alt={ut.name}
                className="w-full h-full object-cover"
                disableOnMobile={true} // disable 3D float on touch devices since they are tapping to expand
              >
                <div 
                  className="w-full h-full flex flex-col justify-end pointer-events-none" 
                  style={{ 
                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.35) 25%, transparent 50%)", 
                    padding: "0 20px 16px 20px" 
                  }}
                >
                  <motion.div 
                    layout="position"
                    initial={false}
                    animate={{
                        opacity: 1, // Always show the title
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ 
                        fontSize: "0.6rem", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.08em", 
                        color: "rgba(255, 255, 255, 0.65)", 
                        fontWeight: 500, 
                        marginBottom: "4px" 
                      }}>
                      {isActive || isDefault ? `Capital: ${ut.capital}` : ""}
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="font-serif whitespace-nowrap" style={{ 
                            margin: "0 0 4px 0", 
                            fontSize: (isActive || isDefault) ? "1.45rem" : "1.1rem", 
                            lineHeight: 1.15, 
                            letterSpacing: "0.02em", 
                            color: "#ffffff", 
                            textShadow: "0 1px 4px rgba(0,0,0,0.4)" 
                          }}>
                          {!isMobile && !isActive && !isDefault ? ut.name.substring(0, 3) + "..." : ut.name}
                        </h3>
                        
                        <AnimatePresence>
                          {(isActive || (isDefault && isMobile)) && (
                              <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                              >
                                  <p style={{ 
                                      color: "rgba(255,255,255,0.8)", 
                                      fontSize: "0.8rem", 
                                      lineHeight: 1.4, 
                                      marginBottom: "12px", 
                                      fontWeight: 300, 
                                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                      whiteSpace: "normal" // allow wrapping when expanded
                                    }}>
                                    {ut.tagline}
                                  </p>
                                  <div style={{ 
                                      fontSize: "0.75rem", 
                                      fontWeight: 600, 
                                      color: "var(--color-territory-accent, var(--color-accent))", 
                                      textTransform: "uppercase", 
                                      letterSpacing: "0.04em", 
                                      display: "inline-flex", 
                                      alignItems: "center" 
                                    }}>
                                    Explore Territory <span style={{ marginLeft: "4px", fontSize: "1.1em" }}>→</span>
                                  </div>
                              </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </PremiumDepthImage>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
