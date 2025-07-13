import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

import { env } from "@/env";

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to check if user is authenticated
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  return user;
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Helper function to get user profile from public.profiles table
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting user profile:", error);
    return null;
  }

  return data;
}

// Helper function to update user profile
export async function updateUserProfile(userId: string, updates: Partial<{
  display_name: string;
  selected_language: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

// Helper function to check connection
export async function testConnection() {
  try {
    const { error } = await supabase.from("profiles").select("count").limit(1);
    if (error && error.code !== "PGRST116") { // PGRST116 is "relation does not exist" which is expected before schema setup
      throw error;
    }
    return true;
  }
  catch (error) {
    console.error("Supabase connection test failed:", error);
    return false;
  }
}
