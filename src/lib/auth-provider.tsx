import type { Session, User } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting initial session:", error);
        }
        else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
      catch (error) {
        console.error("Error in getInitialSession:", error);
      }
      finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        if (event === "SIGNED_IN") {
          const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0];
          toast.success(`Welcome back, ${userName}!`);
        }
        else if (event === "SIGNED_OUT") {
          toast.success("You've been signed out successfully");
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        toast.error("Failed to sign in with Google. Please try again.");
        throw error;
      }
    }
    catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred during sign in.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out. Please try again.");
        throw error;
      }
    }
    catch (error) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred during sign out.");
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
