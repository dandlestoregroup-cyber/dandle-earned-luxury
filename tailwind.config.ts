import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  safelist: [
    "bg-gradient-radial",
    "from-orange-400/10",
    "from-orange-50/80",
    "via-rose-50/60",
    "to-amber-50/40",
    "via-rose-400/5",
    "via-rose-300/8",
    "to-transparent",
    "border-orange-400",
    "border-orange-400/50",
    "shadow-[0_0_0_2px_rgba(251,146,60,0.35)]",
    "shadow-orange-500/30",
    "shadow-orange-500/40",
    "group-hover:opacity-100",
    "hover:border-orange-400/50",
    "aspect-[4/3]",
    "scroll-snap-type-x",
    "scroll-snap-align-center",
    "snap-center",
    "no-scrollbar",
    "min-h-[90vh]",
    "md:min-h-[80vh]",
  ],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Luxury palette
        nileBlue: "hsl(var(--nile-blue))",
        dandleOrange: "hsl(var(--dandle-orange))",
        warmBeige: "hsl(var(--warm-beige))",
        bronze: "hsl(var(--bronze))",
        charcoal: "hsl(var(--charcoal))",
        warmWhite: "hsl(var(--warm-white))",
        obsidian: "hsl(var(--obsidian))",
        champagne: "hsl(var(--champagne))",
        cream: "hsl(var(--cream))",
        smoke: "hsl(var(--smoke))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '3/4': '3 / 4',
      },
      fontFamily: {
        headline: ['Playfair Display', 'serif'],
        'headline-ar': ['Cairo', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        'body-ar': ['Cairo', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'headline': '-0.03em',
        'body': '0.01em',
        'luxury': '0.15em',
      },
      fontSize: {
        'hero-desktop': '80px',
        'hero-mobile': '48px',
        'section-desktop': '48px',
        'section-mobile': '32px',
        'body-desktop': '18px',
        'body-mobile': '16px',
        'caption': '14px',
      },
      lineHeight: {
        'body': '1.8',
        'heading': '1.1',
        'relaxed': '1.6',
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
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        },
        "ken-burns-in": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" }
        },
        "ken-burns-out": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" }
        },
        "luxury-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "luxury-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" }
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "ken-burns-in": "ken-burns-in 12s ease-out forwards",
        "ken-burns-out": "ken-burns-out 12s ease-out forwards",
        "luxury-float": "luxury-float 6s ease-in-out infinite",
        "luxury-glow": "luxury-glow 4s ease-in-out infinite",
        "line-grow": "line-grow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
