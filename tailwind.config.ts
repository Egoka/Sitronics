import type { Config } from 'tailwindcss'
import colors from "tailwindcss/colors";

import forms from "@tailwindcss/forms";

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // "./node_modules/flowbite/**/*.js",
    // "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          50: "hsl(var(--color-theme-50) / <alpha-value>)",
          100: "hsl(var(--color-theme-100) / <alpha-value>)",
          200: "hsl(var(--color-theme-200) / <alpha-value>)",
          300: "hsl(var(--color-theme-300) / <alpha-value>)",
          400: "hsl(var(--color-theme-400) / <alpha-value>)",
          500: "hsl(var(--color-theme-500) / <alpha-value>)",
          600: "hsl(var(--color-theme-600) / <alpha-value>)",
          700: "hsl(var(--color-theme-700) / <alpha-value>)",
          800: "hsl(var(--color-theme-800) / <alpha-value>)",
          900: "hsl(var(--color-theme-900) / <alpha-value>)",
          950: "hsl(var(--color-theme-950) / <alpha-value>)",
        },
        primary: colors.emerald,
        secondary: colors.neutral
      },
    },
  },
  plugins: [
    forms,
    // require('flowbite/plugin'),
    // require("daisyui"),
    // require("tw-elements/dist/plugin.cjs")
  ]
} satisfies Config

