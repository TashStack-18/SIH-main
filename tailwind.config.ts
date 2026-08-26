import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: "var(--brand-navy-50)",
            100: "var(--brand-navy-100)",
            500: "var(--brand-navy-500)",
            600: "var(--brand-navy-600)",
            700: "var(--brand-navy-700)",
            800: "var(--brand-navy-800)",
            900: "var(--brand-navy-900)",
          },
          terracotta: {
            50: "var(--brand-terracotta-50)",
            100: "var(--brand-terracotta-100)",
            500: "var(--brand-terracotta-500)",
            600: "var(--brand-terracotta-600)",
            700: "var(--brand-terracotta-700)",
          },
          emerald: {
            50: "var(--brand-emerald-50)",
            100: "var(--brand-emerald-100)",
            500: "var(--brand-emerald-500)",
            600: "var(--brand-emerald-600)",
            700: "var(--brand-emerald-700)",
          }
        },
        canvas: "var(--color-bg-canvas)",
        surface: {
          DEFAULT: "var(--color-bg-surface)",
          elevated: "var(--color-bg-surface-elevated)",
          alt: "var(--color-bg-surface-alt)",
        },
        emergency: "var(--color-emergency)",
      },
      fontFamily: {
        sans: ["var(--font-family-sans)"],
        body: ["var(--font-family-body)"],
        serif: ["var(--font-family-serif)"],
        mono: ["var(--font-family-mono)"],
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        elevated: "var(--shadow-elevated)",
        modal: "var(--shadow-modal)",
        sos: "var(--shadow-sos)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      }
    },
  },
  plugins: [],
};
export default config;
