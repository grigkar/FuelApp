// Authentication context (mock for MVP, will connect to Directus later)
import React, { createContext, useContext, useState, useEffect } from "react";
import { AppUser } from "@/types";
import { authApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem("fuel_tracker_auth");
        if (stored) {
          const { data } = await authApi.getCurrentUser();
          setUser(data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("fuel_tracker_auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      setUser(data);
      localStorage.setItem("fuel_tracker_auth", "true");
      localStorage.setItem("fuel_tracker_user", JSON.stringify(data));
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    try {
      const { data } = await authApi.signup(email, password, displayName);
      setUser(data);
      localStorage.setItem("fuel_tracker_auth", "true");
      localStorage.setItem("fuel_tracker_user", JSON.stringify(data));
      toast({
        title: "Welcome!",
        description: "Account created successfully.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem("fuel_tracker_auth");
      localStorage.removeItem("fuel_tracker_user");
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
