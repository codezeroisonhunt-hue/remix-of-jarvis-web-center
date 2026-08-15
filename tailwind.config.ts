
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        jarvis: {
          bg: "#0f1019",
          darkBg: "#080a12",
          accent: "#B30000",
          secondary: "#FFD700",
          text: "#ffffff",
          muted: "#8a8a9b",
          neon: "#8B5CF6"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        neon: "0 0 10px rgba(51, 195, 240, 0.3), 0 0 20px rgba(51, 195, 240, 0.2)",
        "neon-lg": "0 0 15px rgba(51, 195, 240, 0.5), 0 0 30px rgba(51, 195, 240, 0.3)",
        "neon-purple": "0 0 10px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)",
        "neon-purple-lg": "0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)",
        "ironman-glow": "0 0 20px rgba(179, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)",
        "reactor-glow": "0 0 30px rgba(51, 195, 240, 0.6), 0 0 60px rgba(51, 195, 240, 0.4)",
        "hologram": "0 0 20px rgba(51, 195, 240, 0.4), inset 0 0 30px rgba(51, 195, 240, 0.2)",
        "tech-panel": "inset 0 0 20px rgba(51, 195, 240, 0.2), 0 0 10px rgba(51, 195, 240, 0.1)",
        "hacker-terminal": "inset 0 0 15px rgba(255, 0, 0, 0.2), 0 0 10px rgba(255, 0, 0, 0.1)",
      },
      blur: {
        xs: '2px',
      },
      backgroundImage: {
        'tech-grid': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0h40v40H0V0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0V0zm1 1h1v1H1V1zm1 1h1v1H2V2zm1 1h1v1H3V3zm1 1h1v1H4V4zm1 1h1v1H5V5zm1 1h1v1H6V6zm1 1h1v1H7V7zm1 1h1v1H8V8zm1 1h1v1H9V9zm1 1h1v1h-1V10zm1 1h1v1h-1V11zm1 1h1v1h-1V12zm1 1h1v1h-1V13zm1 1h1v1h-1V14zm1 1h1v1h-1V15zm1 1h1v1h-1V16zm1 1h1v1h-1V17zm1 1h1v1h-1V18zm1 1h1v1h-1V19zm1 1h1v1h-1V20zm1 1h1v1h-1V21zm1 1h1v1h-1V22zm1 1h1v1h-1V23zm1 1h1v1h-1V24zm1 1h1v1h-1V25zm1 1h1v1h-1V26zm1 1h1v1h-1V27zm1 1h1v1h-1V28zm1 1h1v1h-1V29zm1 1h1v1h-1V30zm1 1h1v1h-1V31zm1 1h1v1h-1V32zm1 1h1v1h-1V33zm1 1h1v1h-1V34zm1 1h1v1h-1V35zm1 1h1v1h-1V36zm1 1h1v1h-1V37zm1 1h1v1h-1V38zm1 1h1v1h-1V39z' fill='rgba(51, 195, 240, 0.05)'/%3E%3C/svg%3E\")",
        'circuit': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%231eaedb' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%231eaedb'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse": {
          "0%": { 
            boxShadow: "0 0 0 0 rgba(51, 195, 240, 0.7)",
            transform: "scale(0.95)"
          },
          "70%": { 
            boxShadow: "0 0 0 15px rgba(51, 195, 240, 0)",
            transform: "scale(1)"
          },
          "100%": { 
            boxShadow: "0 0 0 0 rgba(51, 195, 240, 0)",
            transform: "scale(0.95)"
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px #1eaedb, 0 0 10px #1eaedb, 0 0 15px #1eaedb" },
          "100%": { boxShadow: "0 0 20px #1eaedb, 0 0 30px #1eaedb, 0 0 40px #1eaedb" }
        },
        "reactor-pulse": {
          "0%": { opacity: "0.6", transform: "scale(0.98)" },
          "50%": { opacity: "0.8", transform: "scale(1)" },
          "100%": { opacity: "0.6", transform: "scale(0.98)" }
        },
        "reactor-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "reactor-glow": {
          "0%": { 
            boxShadow: "0 0 15px #B30000, 0 0 25px #33C3F0",
            opacity: "0.7" 
          },
          "50%": { 
            boxShadow: "0 0 30px #B30000, 0 0 50px #33C3F0",
            opacity: "1"
          },
          "100%": { 
            boxShadow: "0 0 15px #B30000, 0 0 25px #33C3F0",
            opacity: "0.7" 
          }
        },
        "ironman-eyes": {
          "0%": { filter: "brightness(1) drop-shadow(0 0 2px #33C3F0)" },
          "50%": { filter: "brightness(1.5) drop-shadow(0 0 8px #33C3F0)" },
          "100%": { filter: "brightness(1) drop-shadow(0 0 2px #33C3F0)" }
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
          "25%, 75%": { opacity: "0.92" },
          "10%, 30%, 70%, 90%": { opacity: "0.8" },
          "20%, 40%, 60%, 80%": { opacity: "0.95" }
        },
        "scan-line": {
          "0%": { top: "0%" },
          "100%": { top: "100%" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 4s infinite ease",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "rotate": "rotate 10s linear infinite",
        "glow-strong": "glow 1.5s ease-in-out infinite alternate",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "reactor-pulse": "reactor-pulse 4s ease-in-out infinite",
        "reactor-rotate": "reactor-rotate 20s linear infinite",
        "reactor-glow": "reactor-glow 3s ease-in-out infinite",
        "ironman-eyes": "ironman-eyes 2s ease-in-out infinite",
        "hologram-flicker": "hologram-flicker 4s infinite",
        "scan-line": "scan-line 3s linear infinite",
        "float": "float 6s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
