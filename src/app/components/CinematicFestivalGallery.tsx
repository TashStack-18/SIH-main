"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { VERIFIED_FESTIVALS } from "@/src/lib/fixtures";

export default function CinematicFestivalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slidesRef.current;
      
      // Pin the container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${slides.length * 100}%`,
        pin: true,
        scrub: 1,
      });

      // Animate each slide
      slides.forEach((slide, i) => {
        if (!slide) return;
        
        const isFirst = i === 0;
        const isLast = i === slides.length - 1;
        const imageBg = slide.querySelector(".slide-bg");
        const content = slide.querySelector(".slide-content");

        // Initial setup
        gsap.set(slide, { zIndex: slides.length - i });
        if (!isFirst) {
          gsap.set(slide, { opacity: 0 });
          gsap.set(imageBg, { scale: 1.1 });
        } else {
          gsap.set(imageBg, { scale: 1 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: `${i * 100}% top`,
            end: `${(i + 1) * 100}% top`,
            scrub: 1,
          }
        });

        // Fading in this slide (if not first)
        if (!isFirst) {
          tl.to(slide, { opacity: 1, duration: 0.5 }, 0);
          tl.to(imageBg, { scale: 1.05, duration: 1 }, 0); // Smooth scaling down while fading in
        }

        // Fading out the current slide early enough for the next one to fade in
        if (!isLast) {
          tl.to(slide, { opacity: 0, duration: 0.5 }, 0.5);
          tl.to(imageBg, { scale: 1.1, duration: 0.5 }, 0.5); 
        } else {
          // Extra slow scale for the last one
          tl.to(imageBg, { scale: 1.05, duration: 1 }, 0);
        }
        
        // Content subtle parallax
        if (content && !isFirst) {
          tl.fromTo(content, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5 }, 0
          );
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-black text-white"
      style={{ isolation: "isolate" }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      
      {VERIFIED_FESTIVALS.slice(0, 6).map((dest, idx) => (
        <div
          key={dest.id}
          ref={(el) => {
            slidesRef.current[idx] = el;
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div
            className="slide-bg absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('${dest.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformOrigin: "center center",
            }}
          />
          
          {/* Content */}
          <div className="slide-content relative z-20 text-center max-w-4xl px-6 pointer-events-none">
            <h3 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg" style={{ color: "var(--color-text-inverse, #fff)" }}>
              {dest.name}
            </h3>
            <p className="text-xl md:text-2xl font-medium tracking-wide drop-shadow-md text-white/90">
              {dest.location} ({dest.territoryName})
            </p>
          </div>
        </div>
      ))}
      
      {/* Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-70 animate-bounce">
        <span className="text-sm font-semibold tracking-widest uppercase">Scroll to Explore</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </section>
  );
}
