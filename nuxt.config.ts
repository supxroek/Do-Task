import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    // Server-side only config. Not exposed to the client
    mongoURI: process.env.MONGODB_URI,
  },

  modules: [
    "shadcn-nuxt",
    "nuxt-mongoose",
    "nuxt-lucide-icons",
    "dayjs-nuxt",
    "@nuxtjs/google-fonts",
  ],

  css: ["./app/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@vueuse/core",
        "class-variance-authority",
        "clsx",
        "dayjs", // CJS
        "dayjs/plugin/relativeTime", // CJS
        "dayjs/plugin/updateLocale", // CJS
        "dayjs/plugin/utc", // CJS
        "reka-ui",
        "tailwind-merge",
        "vee-validate",
      ],
    },
  },
});
