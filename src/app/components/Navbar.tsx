"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BrandLogo } from "./BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("bsy_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bsy_theme", theme);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Itinerary", href: "/itinerary" },
    { label: "Map", href: "/map" },
    { label: "Safety", href: "/safety" },
    { label: "Booking", href: "/bookings" },
  ];

  return (
    <header
      className="navbar fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "var(--color-bg-surface)" : "var(--color-glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: isScrolled ? "1px solid var(--color-border-subtle)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 4px 20px -10px rgba(0,0,0,0.05)" : "none",
      }}
      role="banner"
    >
      <div
        className="container navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px", /* taller, more premium proportion */
          maxWidth: "var(--container-max-width)",
          margin: "0 auto",
        }}
      >
        {/* Minimal Editorial Brand Logo Lockup */}
        <BrandLogo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="nav-links hidden md:flex items-center gap-6" role="navigation" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link group relative py-2 text-[0.9rem] transition-colors duration-200 ${isActive ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)]"}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Utility Actions */}
        <div className="navbar-actions flex items-center gap-2">
          
          {/* Universal Search Link */}
          <Link
            href="/search"
            className="btn btn-sm btn-ghost btn-icon-only rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)]"
            aria-label="Search destinations and festivals"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>

          {/* User Profile */}
          <Link
            href="/profile"
            className="btn btn-sm btn-ghost btn-icon-only rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)]"
            aria-label="User Profile"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Dark/Light Theme Switcher */}
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-icon-only rounded-full w-10 h-10 flex items-center justify-center text-[var(--color-text-primary)]"
            onClick={toggleTheme}
            aria-label={`Toggle ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Emergency SOS Action */}
          <Link
            href="/safety"
            className="btn btn-sm btn-emergency"
            aria-label="Trigger Emergency SOS Center"
            style={{
              textDecoration: "none",
              fontWeight: 700,
              borderRadius: "var(--radius-pill)",
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>SOS</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
