import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app/",
  css: ["./app/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
    optimizeDeps: {
      include: [
        "@lucide/vue",
        "@tanstack/vue-form",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@vueuse/core",
        "class-variance-authority",
        "clsx",
        "reka-ui",
        "tailwind-merge",
        "vue-sonner",
        "zod",
      ],
    },
  },

  modules: ["shadcn-nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
});
