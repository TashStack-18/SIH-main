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
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
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
        sans: ["var(--font-family-sans)", "sans-serif"],
        body: ["var(--font-family-body)", "sans-serif"],
        serif: ["var(--font-family-serif)", "serif"],
        display: ["var(--font-family-display)", "serif"],
        mono: ["var(--font-family-mono)", "monospace"],
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
