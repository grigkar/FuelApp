import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { userApi } from "@/lib/api";
import type { AppUser } from "@/types";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { createComponentLogger } from "@/lib/logger";
import { handleError, formatErrorForUser } from "@/lib/errorHandling";

const logger = createComponentLogger("AuthContext");

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        // Only synchronous state updates here
        if (!session?.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        // Defer Supabase calls to avoid deadlocks
        setTimeout(() => {
          userApi
            .getProfile(session.user!.id)
            .then(({ data }) => setUser(data))
            .catch((error) => console.error("Failed to fetch user profile:", error))
            .finally(() => setIsLoading(false));
        }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        try {
          const { data } = await userApi.getProfile(session.user.id);
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Welcome back!",
      description: "Successfully logged in.",
    });
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    // Detect browser timezone
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Redirect to dashboard after email confirmation
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
          time_zone: browserTimeZone,
        },
      },
    });

    if (error) {
      const appError = handleError(error, {
        component: "AuthContext",
        action: "signup",
      });
      
      toast({
        title: "Signup failed",
        description: formatErrorForUser(appError),
        variant: "destructive",
      });
      throw error;
    }

    // Check if user already exists (identities array is empty when email is already registered)
    if (data?.user?.identities?.length === 0) {
      toast({
        title: "Account already exists",
        description: "This email is already registered. Please use the login tab instead.",
        variant: "destructive",
      });
      throw new Error("USER_ALREADY_EXISTS");
    }

    // Check if email confirmation is required (no session means confirmation is needed)
    if (data?.user && !data.session) {
      toast({
        title: "Check your email",
        description: "Please check your email (including spam folder) and click the confirmation link to activate your account.",
      });
      throw new Error("EMAIL_CONFIRMATION_REQUIRED");
    }
    
    toast({
      title: "Welcome!",
      description: "Account created successfully.",
    });
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error);
      return;
    }
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
