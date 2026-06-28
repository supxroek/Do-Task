// middleware/auth.ts
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth();
  await auth.fetchUser();

  if (!auth.isAuthenticated.value && to.path !== "/auth/login") {
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }
});
