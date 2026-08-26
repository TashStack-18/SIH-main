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

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

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
      aria-label="Heritage Yatra Showcase Carousel"
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
      <div className="hero-carousel-content">
        
        {/* Union Territory Tag */}
        <div className="hero-ut-tag">
          <span>🏛️ {current.shortName.toUpperCase()}</span>
          <span>•</span>
          <span>{current.capital.toUpperCase()} CAPITAL</span>
        </div>

        {/* Serif Headline (Playfair Display) */}
        <h1 className="hero-title">
          {current.name === "Ladakh" ? "Timeless Traditions of Ladakh." : `Timeless Heritage of ${current.name}.`}
        </h1>

        {/* Subtitle */}
        <p className="hero-tagline">
          {current.tagline}
        </p>

        {/* Dual CTA Action Buttons + Carousel Arrows */}
        <div className="hero-actions">
          <Link
            href={`/territories/${current.slug}`}
            className="hero-btn-primary"
          >
            <span>Discover Heritage</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/itinerary"
            className="hero-btn-secondary"
          >
            <span>Plan Experience</span>
            <span style={{ fontSize: "1rem" }}>↗</span>
          </Link>

          {/* Arrow navigation buttons placed next to discover buttons */}
          <div className="hero-arrows-inline">
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

        {/* Live Weather Pill */}
        <div className="hero-weather-pill">
          <span className="status-dot status-dot-live"></span>
          <span>
            {current.weatherSnapshot.temp}°C • {current.weatherSnapshot.condition}
          </span>
        </div>
      </div>

      {/* Bottom Carousel Controller - Elevated cleanly above search bar */}
      <div className="hero-footer-bar">
        
        {/* Slide Counter */}
        <div className="hero-counter">
          <span>0{currentIndex + 1}</span>
          <span style={{ opacity: 0.5, margin: "0 4px" }}>/</span>
          <span style={{ opacity: 0.7 }}>0{territories.length}</span>
        </div>

        {/* Progress Bars / Dots */}
        <div className="hero-progress-group">
          {territories.map((ut, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={ut.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to ${ut.name} slide`}
                className="hero-progress-dot"
                style={{
                  width: isActive ? "32px" : "8px",
                  background: isActive ? "#C88E44" : "rgba(255, 255, 255, 0.4)",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
