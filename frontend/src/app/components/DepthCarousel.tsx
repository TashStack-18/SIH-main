'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  chapter?: number | string;
}

interface DepthCarouselProps {
  items: CarouselItem[];
  onSelect: (id: string) => void;
  cardWidth?: number;
  cardHeight?: number;
  depth?: number;
  spread?: number;
  tilt?: number;
  perspective?: number;
  visibleCards?: number;
  blur?: number;
}

export function DepthCarousel({
  items,
  onSelect,
  cardWidth = 320,
  cardHeight = 440,
  depth = 120,
  spread = 110,
  tilt = 12,
  perspective = 1000,
  visibleCards = 3,
  blur = 2,
}: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch/Drag/Wheel Handling
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 20) handleNext();
      if (e.deltaX < -20) handlePrev();
    }
  };

  // GSAP Animation
  useEffect(() => {
    if (!cardsRef.current.length) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      let dist = index - activeIndex;
      const total = items.length;
      
      // Wrap distance to create a continuous circular spread
      if (dist > total / 2) {
        dist -= total;
      } else if (dist < -total / 2) {
        dist += total;
      }
      
      const isVisible = Math.abs(dist) <= visibleCards;
      
      const x = dist * spread;
      const z = -Math.abs(dist) * depth;
      const rotateY = dist !== 0 ? Math.sign(dist) * -tilt : 0;
      const opacity = isVisible ? (1 - Math.abs(dist) * 0.15) : 0;
      const blurAmount = isVisible ? Math.abs(dist) * blur : blur * visibleCards;
      const zIndex = items.length - Math.abs(dist);
      const scale = isVisible ? 1 - Math.abs(dist) * 0.05 : 0.8;

      gsap.to(card, {
        x,
        xPercent: -50,
        z,
        rotateY,
        opacity,
        scale,
        zIndex,
        filter: `blur(${blurAmount}px)`,
        duration: prefersReducedMotion.current ? 0 : 0.6,
        ease: 'power3.out',
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      });
    });
  }, [activeIndex, items.length, depth, spread, tilt, visibleCards, blur]);

  return (
    <div className="relative w-full overflow-hidden py-12 flex flex-col items-center select-none">
      
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center outline-none"
        style={{ perspective: `${perspective}px`, width: '100%', height: `${cardHeight}px` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        tabIndex={0}
        aria-label="Interactive Destinations Carousel"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          
          return (
            <div
              key={item.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute top-0 cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-colors glass-panel"
              style={{
                left: '50%',
                top: '50%',
                marginTop: `-${cardHeight / 2}px`,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                border: isActive ? '1px solid var(--color-accent)' : '1px solid var(--color-border-subtle)',
                transformStyle: 'preserve-3d',
                backgroundColor: 'var(--color-bg-surface)',
                willChange: 'transform, opacity, filter',
              }}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    style={{ objectPosition: 'center 40%' }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent mix-blend-multiply" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                  {item.chapter && (
                    <div className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest mb-2 font-semibold">
                      Chapter {item.chapter}
                    </div>
                  )}
                  <h3 className="font-serif text-3xl md:text-4xl mb-3 leading-tight" style={{ letterSpacing: '-0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {item.title}
                  </h3>
                  
                  <div 
                    className="overflow-hidden transition-all duration-500 ease-out" 
                    style={{ maxHeight: isActive ? '100px' : '0px', opacity: isActive ? 1 : 0 }}
                  >
                    <p className="text-sm text-white/80 mb-6 line-clamp-2 leading-relaxed">
                      {item.description || item.subtitle}
                    </p>
                    <button 
                      className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2 group-hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents carousel selection trigger if it's somehow active
                        if (isActive) onSelect(item.id);
                      }}
                      tabIndex={isActive ? 0 : -1}
                    >
                      Plan this journey <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8 z-10">
        <button 
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-3 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous destination"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-[var(--color-accent)] w-6' : 'bg-[var(--color-border-strong)] hover:bg-[var(--color-text-muted)]'}`}
              aria-label={`Go to destination ${i + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={activeIndex === items.length - 1}
          className="p-3 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next destination"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

    </div>
  );
}
