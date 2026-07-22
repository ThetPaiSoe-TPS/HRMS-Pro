import { useState, useEffect, useCallback } from "react";
import type { User } from "../types/auth.types";
import { authApi } from "../api/auth/authApi";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember = false) => {
      setIsLoading(true);
      try {
        const response = await authApi.login({ email, password, remember });
        const { user, token } = response.data || response;

        if (!user || !token) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const { user, token } = response.data || response;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getProfile();
      const userData = response.data || response;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      // If profile fetch fails, clear auth state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      return user.permissions?.includes(permission) || false;
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission],
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    getProfile,
    hasPermission,
    hasAnyPermission,
  };
};
