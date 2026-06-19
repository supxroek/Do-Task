import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      // avoid importing 'vite' types directly (may be missing); use a loose cast
      tailwindcss() as unknown as any,
    ],
  },
});
