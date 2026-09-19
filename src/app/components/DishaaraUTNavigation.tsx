"use client";

import React, { useState } from 'react';
import { VERIFIED_TERRITORIES } from '@/src/lib/fixtures';

// The verified mapping of UTs to their positions on the wheel
const WHEEL_ITEMS = [
  { id: 'LADAKH',          baseAngle: 0 },
  { id: 'CHANDIGARH',      baseAngle: 45 },
  { id: 'ANDAMAN_NICOBAR', baseAngle: 90 },
  { id: 'LAKSHADWEEP',     baseAngle: 135, customImage: '/images/Minicoy Island (Maliku).jpeg' },
  { id: 'PUDUCHERRY',      baseAngle: 180 },
  { id: 'DNH_DD',          baseAngle: 225 },
  { id: 'DELHI',           baseAngle: 270 },
  { id: 'JAMMU_KASHMIR',   baseAngle: 315 },
];

export function DishaaraUTNavigation() {
  const [activeIndex, setActiveIndex] = useState(() => WHEEL_ITEMS.findIndex(item => item.id === 'DELHI'));

  // Derive territories
  const mappedTerritories = WHEEL_ITEMS.map(item => {
    const ut = VERIFIED_TERRITORIES.find(t => t.id === item.id);
    return {
      ...item,
      ut,
      image: item.customImage || ut?.thumbnailImage || ut?.heroImage
    };
  });

  const activeItem = mappedTerritories[activeIndex];
  const activeUT = activeItem?.ut;

  return (
    <section className="relative w-full min-h-[720px] overflow-hidden bg-[#1A1A1A] flex flex-col">
      
      {/* STEP 1: Cinematic Hero Background */}
      {activeItem && (
        <div className="absolute inset-0 z-0">
          <img 
            src={activeItem.image} 
            alt="" 
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          {/* Subtle Readability Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
      )}

      {/* 3D Navigation Stage Container */}
      <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
        
        {/* The 3D Scene with Perspective */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          {/* The Tilted Orbital Plane */}
          <div 
            className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
            style={{
              transformStyle: 'preserve-3d',
              // Tilt the plane forward: Top moves closer (+Z), Bottom moves farther (-Z)
              transform: 'rotateX(-25deg)',
            }}
          >
            
            {/* STEP 2: Stationary Center Chakra */}
            <div 
              className="absolute top-1/2 left-1/2 z-20 pointer-events-none rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#C88E44]/40 bg-[#FDFBF7]"
              style={{ 
                width: '24%', 
                height: '24%',
                // Positioned perfectly in the center, lifted slightly in Z-space so it floats above the ring
                transform: 'translate3d(-50%, -50%, 15px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="w-full h-full relative">
                <img 
                  src="/images/dishaara/dishaara-logo.png" 
                  alt="Dishaara Chakra"
                  className="absolute max-w-none"
                  style={{
                    width: '450%', 
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>

            {/* Subtle Orbital Guide / Outer Ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ transform: 'translateZ(0px)' }}>
              <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(200, 142, 68, 0.3)" strokeWidth="0.5" strokeDasharray="1 3" />
            </svg>

            {/* The Rotating Wheel (Static for Step 4) */}
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'rotateZ(0deg)' }}>
              
              {/* STEP 3 & 4: Destination Petals */}
              {mappedTerritories.map((item, index) => {
                const isActive = index === activeIndex;
                const radius = 35; // % distance from center
                
                const x = 50 + radius * Math.sin(item.baseAngle * Math.PI / 180);
                const y = 50 - radius * Math.cos(item.baseAngle * Math.PI / 180);
                
                const leafSize = isActive ? "24%" : "18%";
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88E44] transition-all duration-300 ease-out"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: leafSize,
                      height: leafSize,
                      // Active items pop out more in Z-space!
                      transform: `translate3d(-50%, -50%, ${isActive ? '25px' : '5px'})`,
                      transformStyle: 'preserve-3d',
                      zIndex: isActive ? 10 : 5,
                      // Organic teardrop silhouette
                      borderRadius: '50% 50% 50% 0',
                      // Orient the pointed tail toward the center Chakra
                      rotate: `${item.baseAngle - 45}deg`,
                      overflow: 'hidden',
                      border: isActive ? '3px solid rgba(200, 142, 68, 1)' : '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: isActive ? '0 15px 35px rgba(0,0,0,0.6)' : '0 5px 15px rgba(0,0,0,0.3)',
                      opacity: isActive ? 1 : 0.8,
                      filter: isActive ? 'brightness(1.1)' : 'brightness(0.7) grayscale(0.2)'
                    }}
                    aria-label={`Select ${item.ut?.name}`}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 w-[150%] h-[150%]" 
                      style={{ 
                        // Counter-rotate the image so it sits upright in its local container
                        transform: `translate(-50%, -50%) rotate(${-(item.baseAngle - 45)}deg)`
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.ut?.name || ''} 
                        className="w-full h-full object-cover" 
                        draggable={false}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Active Territory Content Area (Simple text for now) */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-[#C88E44]/40 bg-[#C88E44]/10 backdrop-blur-md">
          <span className="text-xs tracking-[0.2em] text-[#C88E44] uppercase font-bold">
            {activeUT?.heroLabel}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#FAF7F2] drop-shadow-xl">
          {activeUT?.name}
        </h2>
      </div>

    </section>
  );
}
