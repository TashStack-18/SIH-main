"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export interface AccordionItem {
  id: string;
  name: string;
  image: string;
  slug: string;
  objectPosition?: string;
  scale?: number;
}

interface AccordionGalleryProps {
  items: AccordionItem[];
  onSelect?: (item: AccordionItem) => void;
}

export default function AccordionGallery({ items, onSelect }: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    // GSAP MatchMedia for responsive and reduced-motion handling
    const mm = gsap.matchMedia();

    mm.add({
      desktop: "(min-width: 521px)",
      mobile: "(max-width: 520px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { desktop, reduceMotion } = context.conditions as any;
      
      panelsRef.current.forEach((panel, index) => {
        if (!panel) return;
        const isActive = index === activeIndex;
        
        // Define target states
        const targetFlex = isActive ? 4 : 1;
        const targetFilter = isActive ? "grayscale(0%) brightness(1)" : "grayscale(80%) brightness(0.5)";
        const imgScale = isActive ? 1.05 : 1;
        const targetHeight = isActive ? "220px" : "60px";
        
        // Animation configuration
        const duration = reduceMotion ? 0 : 0.6;
        const ease = "power3.out";

        if (desktop) {
          // Horizontal expansion for desktop
          gsap.to(panel, {
            flex: targetFlex,
            height: "100%",
            duration,
            ease,
            filter: targetFilter,
            overwrite: "auto"
          });
        } else {
          // Vertical stacked expansion for mobile
          gsap.to(panel, {
            height: targetHeight,
            flex: "none",
            duration,
            ease,
            filter: targetFilter,
            overwrite: "auto"
          });
        }

        // Subtle Image Parallax/Scale
        const img = imagesRef.current[index];
        const baseScale = items[index].scale || 1;
        const targetImgScale = isActive ? baseScale * 1.05 : baseScale;

        if (img) {
          gsap.to(img, {
            scale: targetImgScale,
            duration,
            ease,
            overwrite: "auto"
          });
        }
      });
    });

    return () => mm.revert();
  }, [activeIndex]);

  return (
    <div 
      ref={containerRef}
      className="accordion-gallery-container"
      style={{
        display: "flex",
        width: "100%",
        gap: "10px",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .accordion-gallery-container {
          flex-direction: row;
          height: 480px;
        }
        .inactive-mobile-label {
          display: none;
        }
        @media (max-width: 520px) {
          .accordion-gallery-container {
            flex-direction: column !important;
            height: auto !important;
          }
          .inactive-mobile-label {
            display: flex !important;
          }
        }
      `}} />
      
      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <Link
            key={item.id}
            href={`/destinations?ut=${item.slug}`}
            ref={el => { panelsRef.current[idx] = el; }}
            onMouseEnter={() => setActiveIndex(idx)}
            onFocus={() => setActiveIndex(idx)}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(item);
              }
            }}
            className="accordion-panel"
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              // Initial fallback styles before GSAP
              flex: isActive ? 4 : 1,
              filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(80%) brightness(0.5)",
            }}
            aria-expanded={isActive}
            role="tab"
          >
            <img
              ref={el => { imagesRef.current[idx] = el; }}
              src={item.image}
              alt={item.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: item.objectPosition || "center center",
                transformOrigin: "center center",
                willChange: "transform"
              }}
              loading="lazy"
            />
            
            {/* Gradient overlay to ensure text contrast */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
              pointerEvents: "none",
              opacity: isActive ? 1 : 0.5,
              transition: "opacity 0.4s ease"
            }} />
            
            {/* Active Caption Reveal */}
            <div style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              right: "24px",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              transitionDelay: isActive ? "0.15s" : "0s",
              pointerEvents: "none"
            }}>
              <h3 className="font-serif" style={{
                color: "#ffffff",
                margin: "0 0 4px 0",
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}>
                {item.name}
              </h3>
              <span style={{
                color: "var(--color-brand-accent, #C88E44)",
                fontSize: "0.9rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)"
              }}>
                Explore →
              </span>
            </div>

            {/* Mobile Inactive Label (only visible on mobile when inactive) */}
            <div 
              className="inactive-mobile-label"
              style={{
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
                opacity: isActive ? 0 : 1,
                pointerEvents: "none",
                transition: "opacity 0.3s ease"
              }}
            >
              <span style={{
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "1.1rem",
                textShadow: "0 2px 6px rgba(0,0,0,0.8)"
              }}>
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
