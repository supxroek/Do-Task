// middleware/guest.ts

import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();
  await auth.fetchUser();

  if (auth.isAuthenticated.value) {
    return navigateTo("/dashboard");
  }
});
