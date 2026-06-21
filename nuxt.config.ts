// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "shadcn-nuxt",
    "nuxt-mongoose",
    "nuxt-lucide-icons",
    "dayjs-nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
  ],

  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "dayjs", // CJS
        "dayjs/plugin/relativeTime", // CJS
        "dayjs/plugin/updateLocale", // CJS
        "dayjs/plugin/utc", // CJS
      ],
    },
  },
});
