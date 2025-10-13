// User settings context for managing units, currency, and preferences
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { userApi } from "@/lib/api";
import { AppUser } from "@/types";

interface UserContextType {
  user: AppUser | null;
  updateUser: (updates: Partial<AppUser>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user from auth context
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setIsLoading(false);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [authUser]);

  const updateUser = async (updates: Partial<AppUser>) => {
    if (!user) return;

    try {
      const { data } = await userApi.updateProfile(user.id, updates);
      setUser(data);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
