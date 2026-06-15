/** @type {import('tailwindcss').Config} */

/**
 * CSS Property           Tailwind Prefix
 * --------------------------------------
 * background-color       bg-
 * color                  text-
 * border-color           border-
 * font-family            font-
 * box-shadow             shadow-
 * border-radius          rounded-
 * height                 h-
 * min-height             min-h-
 * max-height             max-h-
 * width                  w-
 * min-width              min-w-
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Level colours
        level1: {
          DEFAULT: "#3B82F6",   // blue
          light:   "#DBEAFE",
          dark:    "#1D4ED8",
        },
        level2: {
          DEFAULT: "#8B5CF6",   // purple
          light:   "#EDE9FE",
          dark:    "#6D28D9",
        },
        level3: {
          DEFAULT: "#F59E0B",   // amber
          light:   "#FEF3C7",
          dark:    "#D97706",
        },
        level4: {
          DEFAULT: "#10B981",   // green
          light:   "#D1FAE5",
          dark:    "#059669",
        },
        // Category colours
        food:          "#F97316",
        attraction:    "#3B82F6",
        transport:     "#8B5CF6",
        accommodation: "#22C55E",
        // App accent
        french: {
          blue:  "#002395",
          white: "#FFFFFF",
          red:   "#ED2939",
        }
      },
      fontFamily: {
        fun: ["'Nunito'", "sans-serif"],
      },
      borderRadius: {
        xl:  "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card:   "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.12)",
      }
    },
  },
  plugins: [],
}