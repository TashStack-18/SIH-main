"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { VERIFIED_TERRITORIES } from "@/src/lib/fixtures";

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const territories = VERIFIED_TERRITORIES;
  const current = territories[currentIndex] || territories[0];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % territories.length);
  }, [territories.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + territories.length) % territories.length);
  }, [territories.length]);

  // Auto-advance timer (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="hero-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Dishaara Showcase Carousel"
    >
      {/* Background Slides */}
      {territories.map((ut, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={ut.id}
            className={`hero-carousel-slide ${isActive ? "active" : ""}`}
            style={{
              opacity: isActive ? 1 : 0,
              visibility: isActive ? "visible" : "hidden",
            }}
          >
            <div
              className="hero-carousel-bg"
              style={{
                backgroundImage: `url('${ut.heroImage}')`,
              }}
            />
            <div className="hero-carousel-overlay" />
          </div>
        );
      })}

      {/* Main Hero Content */}
        <div className="hero-text-block">
          {/* City / Territory Name */}
          <h1 className="hero-title">
            {current.heroLabel || current.name}
          </h1>

          {/* Short line describing the city */}
          <p className="hero-tagline">
            {current.heroDescription || current.tagline}
          </p>
        </div>

        {/* Bottom Action Section */}
        <div className="hero-bottom-block">
          {/* Dual CTA Action Buttons Framed by Left and Right Navigation Arrows */}
          <div className="hero-actions">
            {/* Left Arrow on the left side */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="hero-arrow-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Primary Action: Discover Heritage */}
            <Link
              href={`/destinations?ut=${current.slug}`}
              className="hero-btn-primary"
            >
              <span>Discover Heritage</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            {/* Secondary Action: Plan Experience */}
            <Link
              href="/itinerary"
              className="hero-btn-secondary"
            >
              <span>Plan Experience</span>
              <span style={{ fontSize: "1rem" }}>↗</span>
            </Link>

            {/* Right Arrow on the right side */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="hero-arrow-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
