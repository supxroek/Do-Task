// Nuxt provides an app/app.config.ts config file to expose reactive configuration
// within your application with the ability to update it at runtime (lifecycle
// hooks or plugins) and to edit it with HMR (hot-module-replacement).

export default defineAppConfig({
  // Basic app metadata
  app: {
    name: "Do-Task",
    description: "A minimal task manager",
    version: "0.1.0",
  },

  // UI-related settings, can be updated at runtime
  ui: {
    theme: ["light", "dark"], // ธีมที่รองรับ: "light" หรือ "dark"
    showLogo: true,
    logo: "/logo.png",
  },

  // Example feature flags
  features: {
    enableNotifications: true, // เปิดหรือปิดสำหรับการแจ้งเตือน
    enableDarkMode: false, // เปิดหรือปิดสำหรับโหมดมืด
    enableEditing: true, // เปิดหรือปิดสำหรับการแก้ไขงาน
  },
});
