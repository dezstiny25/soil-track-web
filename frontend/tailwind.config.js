import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        darkTheme: {
          "primary": "#134f14",
          "secondary": "#178219",
          "accent": "#78ce1b",
          "neutral": "#1c1c1c",
          "base-100": "#121212",
          "info": "#3a86ff",
          "success": "#23d160",
          "warning": "#ffcc00",
          "error": "#f14668",
        },
        lightTheme: {
          "primary": "#134f14",
          "secondary": "#178219",
          "accent": "#78ce1b",
          "neutral": "#f0f5eb",
          "base-100": "#ffffff",
          "info": "#3a86ff",
          "success": "#52c776",
          "warning": "#f7e39b",
          "error": "#f09e9e",
        },
      },
    ],
  },
};
