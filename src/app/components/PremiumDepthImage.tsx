"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export interface PremiumDepthImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  maxRotation?: number; // Maximum rotation in degrees (e.g., 5)
  maxTranslation?: number; // Maximum translation in pixels (e.g., 6)
  hoverScale?: number; // Scale when hovering (e.g., 1.01)
  disableOnMobile?: boolean; // Whether to disable the effect on touch devices
  children?: React.ReactNode; // Optional children to overlay on top of the image
}

export function PremiumDepthImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  containerStyle,
  maxRotation = 5,
  maxTranslation = 6,
  hoverScale = 1.01,
  disableOnMobile = true,
  children,
  style,
  ...props
}: PremiumDepthImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Detect coarse pointers (touch screens / mobile)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(pointer: coarse)");
      setIsMobile(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Motion values for the pointer position normalized to [-1, 1]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a cinematic, premium feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Calculate rotation (Y rotation is based on X pointer, X rotation on Y pointer)
  const rotateX = useTransform(springY, [-1, 1], [maxRotation, -maxRotation]);
  const rotateY = useTransform(springX, [-1, 1], [-maxRotation, maxRotation]);
  
  // Calculate subtle translation to give a slightly floating effect
  const translateX = useTransform(springX, [-1, 1], [-maxTranslation, maxTranslation]);
  const translateY = useTransform(springY, [-1, 1], [-maxTranslation, maxTranslation]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || (disableOnMobile && isMobile) || prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Pointer position relative to the center of the container
    const pointerX = e.clientX - rect.left - width / 2;
    const pointerY = e.clientY - rect.top - height / 2;

    // Normalize to [-1, 1]
    x.set(pointerX / (width / 2));
    y.set(pointerY / (height / 2));
  };

  const handlePointerEnter = () => {
    if ((disableOnMobile && isMobile) || prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Gently reset values
    x.set(0);
    y.set(0);
  };

  // If mobile or reduced motion is active, return standard markup to ensure accessibility and performance
  const isDisabled = (disableOnMobile && isMobile) || prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ 
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        perspective: "1200px", 
        transformStyle: "preserve-3d",
        ...containerStyle 
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          rotateX: isDisabled ? 0 : rotateX,
          rotateY: isDisabled ? 0 : rotateY,
          x: isDisabled ? 0 : translateX,
          y: isDisabled ? 0 : translateY,
          scale: isDisabled ? 1 : isHovered ? hoverScale : 1,
          transformStyle: "preserve-3d",
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <img
          src={src}
          alt={alt || ""}
          className={className}
          style={{
             width: "100%",
             height: "100%",
             objectFit: "cover",
             backfaceVisibility: "hidden",
             WebkitBackfaceVisibility: "hidden", 
             ...style 
          }}
          {...props}
        />
      </motion.div>
      {children && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: "none" }}>
          {children}
        </div>
      )}
    </div>
  );
}

