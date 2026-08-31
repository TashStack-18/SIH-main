'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

/**
 * 🇮🇳 BHARAT SAFE YATRA — PURE EDITORIAL WORDMARK IDENTITY
 * 
 * Text-only, bold, commanding national tourism brand identity:
 * - High-contrast, premium editorial display serif (Cormorant Garamond)
 * - Large, confident optical scale that dominates the navbar
 * - Zero icons, zero symbols, zero badges, zero subtitles
 * - Seamless single-entity brand reading: "Bharat Safe Yatra"
 */
export function BrandLogo({
  theme = 'auto',
  size = 'md',
  className = '',
  href = '/',
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  const textColor =
    isDark
      ? '#FAF7F2'
      : theme === 'light'
      ? '#2D1B14'
      : 'var(--color-text-primary, #2D1B14)';

  const content = (
    <span
      className={`brand-wordmark-lockup brand-size-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        userSelect: 'none',
        verticalAlign: 'middle',
      }}
    >
      <span
        className="brand-wordmark font-serif"
        style={{
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: textColor,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease, opacity 0.15s ease',
        }}
      >
        Bharat Safe Yatra
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Bharat Safe Yatra Home"
        className="brand-link"
        style={{
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
