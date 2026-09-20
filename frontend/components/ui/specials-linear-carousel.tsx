"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ImgHTMLAttributes } from "react";

export interface CarouselProps {
  items: React.JSX.Element[];
  initialScroll?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export type CarouselCardData = {
  src: string;
  title: string;
  category?: string;
  content?: React.ReactNode;
  href?: string;
};

export const Carousel = ({
  items = [],
  autoplay = true,
  autoplayInterval = 3400,
}: CarouselProps) => {
  const count = items.length;
  // Start centered at middle set (set 1)
  const [virtualIndex, setVirtualIndex] = useState(count > 0 ? count : 0);
  const [animateTransition, setAnimateTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive card measurements (+15% card size)
  const [cardWidth, setCardWidth] = useState(356);
  const gap = 22;

  const updateMeasurements = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width < 640) {
      setCardWidth(288);
    } else if (width < 1024) {
      setCardWidth(322);
    } else {
      setCardWidth(356);
    }
  }, []);

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, [updateMeasurements]);

  const step = cardWidth + gap;

  // Render 3 seamless repeating sets for infinite loop without blank gaps
  const loopedCards = count > 0 ? [...items, ...items, ...items] : [];

  // Active indicator index (0 to count - 1)
  const currentIndex = count > 0 ? ((virtualIndex % count) + count) % count : 0;

  // Shortest path navigation handler
  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setAnimateTransition(true);
      const currentMod = ((virtualIndex % count) + count) % count;
      let diff = index - currentMod;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      setVirtualIndex((v) => v + diff);
    },
    [count, virtualIndex],
  );

  const prev = useCallback(() => {
    if (count === 0) return;
    setAnimateTransition(true);
    setVirtualIndex((v) => v - 1);
  }, [count]);

  const next = useCallback(() => {
    if (count === 0) return;
    setAnimateTransition(true);
    setVirtualIndex((v) => v + 1);
  }, [count]);

  // Seamless jump normalization after spring animation finishes
  const handleAnimationComplete = () => {
    if (count === 0) return;
    if (virtualIndex >= count * 2 || virtualIndex < count) {
      setAnimateTransition(false);
      const normalizedMod = ((virtualIndex % count) + count) % count;
      setVirtualIndex(count + normalizedMod);
    }
  };

  // Autoplay timer (10% faster forward progression)
  useEffect(() => {
    if (!autoplay || isHovered || count < 2) return;
    const timer = setInterval(() => {
      setAnimateTransition(true);
      setVirtualIndex((v) => v + 1);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, isHovered, count, autoplayInterval]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // Wheel / Trackpad swipe gesture
  const wheelLockRef = useRef(false);
  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 25 && !wheelLockRef.current) {
      wheelLockRef.current = true;
      if (delta > 0) {
        next();
      } else {
        prev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 320);
    }
  };

  const targetX = -virtualIndex * step;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        outline: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Horizontal Viewport Window */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          padding: "16px 0 20px 0",
          cursor: "grab",
          touchAction: "pan-y",
        }}
      >
        {/* Horizontal Motion Track with Strict Flex Row */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "stretch",
            gap: `${gap}px`,
            width: "max-content",
            paddingLeft: "4px",
            paddingRight: "30px",
          }}
          animate={{ x: targetX }}
          transition={
            animateTransition
              ? {
                  type: "spring",
                  stiffness: 245,
                  damping: 25,
                  mass: 0.68,
                }
              : { duration: 0 }
          }
          onAnimationComplete={handleAnimationComplete}
          drag="x"
          dragElastic={0.15}
          onDragStart={() => setAnimateTransition(true)}
          onDragEnd={(_, { offset, velocity }) => {
            const swipeThreshold = step * 0.22;
            const velocityThreshold = 160;

            if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
              next();
            } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
              prev();
            }
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          {loopedCards.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  flexGrow: 0,
                  width: `${cardWidth}px`,
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`,
                  display: "block",
                }}
              >
                {item}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Clean Minimalist Dot Indicator */}
      {count > 1 && (
        <div
          role="tablist"
          aria-label="Destination slide dots"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "12px",
            marginBottom: "8px",
          }}
        >
          {items.map((_, i) => {
            const isActive = currentIndex === i;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: isActive ? "9px" : "7px",
                  height: isActive ? "9px" : "7px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#1e293b" : "#94a3b8",
                  opacity: isActive ? 1 : 0.55,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = "0.55";
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Card = ({
  card,
  index,
}: {
  card: CarouselCardData;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardElement = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        width: "100%",
        height: "450px",
        borderRadius: "26px",
        overflow: "hidden",
        backgroundColor: "#0d0f14",
        border: isHovered
          ? "1.5px solid rgba(255, 255, 255, 0.75)"
          : "1px solid rgba(255, 255, 255, 0.12)",
        cursor: "pointer",
        textAlign: "left",
        userSelect: "none",
        WebkitUserSelect: "none",
        flexShrink: 0,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease",
      }}
    >
      {/* Dark gradient overlay for bottom text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.05) 100%)",
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "26px 22px",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {card.category && (
          <p
            style={{
              textAlign: "left",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.825rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: isHovered ? "#93c5fd" : "#e2e8f0",
              textTransform: "uppercase",
              marginBottom: "6px",
              transition: "color 0.25s ease",
            }}
          >
            {card.category}
          </p>
        )}
        <p
          style={{
            marginTop: "2px",
            textAlign: "left",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "1.45rem",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          {card.title}
        </p>
      </div>

      {/* Background Image (Vibrant Full Color + Smooth Hover Zoom) */}
      <img
        src={card.src}
        alt={card.title}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: isHovered ? "scale(1.06)" : "scale(1)",
          filter: isHovered ? "brightness(1.05)" : "none",
          transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.3s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );

  if (card.href) {
    return (
      <Link
        href={card.href}
        style={{ textDecoration: "none", display: "block", width: "100%" }}
        draggable={false}
      >
        {cardElement}
      </Link>
    );
  }

  return cardElement;
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={className}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

export default Carousel;
