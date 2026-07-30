import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import type { User } from "../types/auth.types";
import { authApi } from "../api/auth/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<any>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
  canEditAnnouncement: (createdBy: number) => boolean;
  canDeleteAnnouncement: () => boolean;
  canPublishAnnouncement: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [location.pathname]);

  // After successful login, set isAuthenticated to true
  const login = async (
    email: string,
    password: string,
    remember: boolean = false,
  ) => {
    setIsLoading(true);
    try {
      const response: any = await authApi.login({ email, password });
      // api.post already unwraps response.data.data, so response is { user, token, ... }
      const userData = response?.user;
      const token = response?.token ?? response?.access_token;

      if (!userData || !token) {
        throw new Error("Invalid response from server");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token", token);
      // isAuthenticated will be true because user is set

      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    // Optionally redirect to login
    window.location.href = "/login";
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const userRole =
      typeof user.role === "string"
        ? user.role.toLowerCase()
        : String(user.role ?? "").toLowerCase();
    const allowedRoles = Array.isArray(roles)
      ? roles.map((r) => r.toLowerCase())
      : [roles.toLowerCase()];
    return allowedRoles.includes(userRole);
  };

  // Check if user can edit an announcement
  const canEditAnnouncement = (createdBy: number) => {
    if (!user) return false;

    // Super admin can edit everything
    if (user.role === "super_admin") return true;

    // Manager can only edit their own announcements
    if (["manager", "hr_manager"].includes(user.role)) {
      return user.id === createdBy;
    }

    return false;
  };

  // Only super admin can delete
  const canDeleteAnnouncement = () => {
    if (!user) return false;
    return user.role === "super_admin";
  };

  // Only super admin can publish
  const canPublishAnnouncement = () => {
    if (!user) return false;
    return user.role === "super_admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        canEditAnnouncement,
        canDeleteAnnouncement,
        canPublishAnnouncement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
