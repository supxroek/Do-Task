// composables/useAuth.ts
type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  birthday?: string | Date | null;
  gender?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type AuthResponse = {
  success: boolean;
  status: number;
  message: string;
  user?: AuthUser;
};

function getApiFetch() {
  return import.meta.server ? useRequestFetch() : $fetch;
}

export const useAuth = () => {
  const user = useState<AuthUser | null>("authUser", () => null);
  const loading = useState("authLoading", () => false);
  const initialized = useState("authInitialized", () => false);

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true;

    try {
      const data = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });

      if (!data.success) {
        return { success: false, message: data.message };
      }

      user.value = data.user ?? null;
      initialized.value = true;
      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err?.data?.message ?? "Unable to login";
      user.value = null;
      initialized.value = true;
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string,
    birthday: string,
    gender: string,
  ) => {
    loading.value = true;

    try {
      const data = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: { email, password, name, birthday, gender },
      });

      if (!data.success) {
        return { success: false, message: data.message };
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      const message = err?.data?.message ?? "Unable to register";
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } finally {
      user.value = null;
      initialized.value = true;
      await navigateTo("/auth/login");
    }
  };

  // Fetch current user
  const fetchUser = async (force = false) => {
    if (initialized.value && !force) {
      return user.value;
    }

    loading.value = true;

    try {
      const apiFetch = getApiFetch();
      const data = await apiFetch<AuthResponse>("/api/auth/me", {
        credentials: "include",
      });

      if (data.success) {
        user.value = data.user ?? null;
        return user.value;
      }
    } catch (error) {
      user.value = null;
    } finally {
      initialized.value = true;
      loading.value = false;
    }

    return user.value;
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };
};
