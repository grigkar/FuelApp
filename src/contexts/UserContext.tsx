// User settings context for managing units, currency, and preferences
import React, { createContext, useContext, useState, useEffect } from "react";
import { AppUser } from "@/types";
import { mockUser } from "@/lib/mockData";

interface UserContextType {
  user: AppUser | null;
  updateUser: (updates: Partial<AppUser>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from session/localStorage
    const loadUser = () => {
      const stored = localStorage.getItem("fuel_tracker_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to mock user for MVP
        setUser(mockUser);
        localStorage.setItem("fuel_tracker_user", JSON.stringify(mockUser));
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const updateUser = (updates: Partial<AppUser>) => {
    if (!user) return;

    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem("fuel_tracker_user", JSON.stringify(updated));
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
