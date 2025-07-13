import type { Session, User } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

// Helper function to ensure user profile exists in public.profiles table
async function ensureUserProfile(user: User) {
  try {
    // Check if user profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new users
      console.error("Error checking user profile:", fetchError);
      return;
    }

    // If profile doesn't exist, create the record
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          display_name: user.user_metadata?.full_name || user.email || "",
        });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        // Don't show error to user as this is a background operation
        // and the database trigger should handle this automatically
      }
    }
  }
  catch (error) {
    console.error("Error in ensureUserProfile:", error);
  }
}

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
        if (event === "SIGNED_IN" && session?.user) {
          const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0];
          toast.success(`Welcome back, ${userName}!`);

          // Ensure user profile exists in public.profiles table (fallback)
          await ensureUserProfile(session.user);
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
          redirectTo: `${window.location.origin}/onboarding/language-selection`,
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
