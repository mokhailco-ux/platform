import type { Config } from "tailwindcss";

// نظام الألوان مستوحى من عالم الفيزياء:
// navy  = خلفية الفضاء / السبورة الليلية
// orange = طاقة / تفاعل / أزرار الحركة
// electric = التيار الكهربائي / الحركة الموجية
// gold  = التقييمات والنجوم
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF2F7",
          100: "#D7E0EC",
          200: "#AFC2D9",
          300: "#7E9BBD",
          400: "#4E6E92",
          500: "#2E4A6E",
          600: "#1E3352",
          700: "#152640",
          800: "#101C30",
          900: "#0C1526",
          950: "#080D18",
        },
        orange: {
          400: "#FF9A5A",
          500: "#FF7A29",
          600: "#E8600F",
          700: "#C24B08",
        },
        electric: {
          400: "#6FC2FF",
          500: "#3AA0FF",
          600: "#1D7FE0",
        },
        gold: "#FFC145",
      },
      fontFamily: {
        display: ["var(--font-tajawal)", "sans-serif"],
        body: ["var(--font-tajawal)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "grid-physics":
          "linear-gradient(to left, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to top, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "orbit-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        wave: "wave 4s ease-in-out infinite",
        orbit: "orbit-spin 18s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
