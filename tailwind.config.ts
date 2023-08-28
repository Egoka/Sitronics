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

