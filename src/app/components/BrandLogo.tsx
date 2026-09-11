'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  textColor?: string;
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
  textColor: customTextColor,
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  const textColor =
    customTextColor ||
    (isDark
      ? '#FAF7F2'
      : theme === 'light'
      ? '#2D1B14'
      : 'var(--color-text-primary, #2D1B14)');

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src="/favicon.png" 
          alt="Dishaara Icon" 
          style={{ 
            height: size === 'lg' ? '60px' : size === 'sm' ? '30px' : '44px', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
        <img 
          src="/logo.png" 
          alt="Dishaara" 
          style={{ 
            height: size === 'lg' ? '46px' : size === 'sm' ? '23px' : '35px', 
            width: 'auto',
            objectFit: 'contain' 
          }} 
        />
      </div>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Dishaara Home"
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
