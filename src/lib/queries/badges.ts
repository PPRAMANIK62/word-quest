import { useQuery } from "@tanstack/react-query";

import type { Badge, UserBadge } from "@/types/common";

import { queryKeys } from "@/lib/query-client";
import { supabase } from "@/lib/supabase";

// Get all available badges
export function useBadges() {
  return useQuery({
    queryKey: ["badges", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error)
        throw error;
      return data as Badge[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - badges don't change often
  });
}

// Get user's earned badges with badge details
export function useUserBadges(userId?: string) {
  return useQuery({
    queryKey: queryKeys.user.badges(userId || ""),
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badges (
            id,
            name,
            description,
            icon,
            points_reward,
            criteria
          )
        `)
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error)
        throw error;
      return data as (UserBadge & { badges: Badge })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get user's badge progress (available badges vs earned)
export function useUserBadgeProgress(userId?: string) {
  return useQuery({
    queryKey: [...queryKeys.user.badges(userId || ""), "progress"],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      // Get all available badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (badgesError)
        throw badgesError;

      // Get user's earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", userId);

      if (userBadgesError)
        throw userBadgesError;

      // Create a map of earned badge IDs
      const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

      // Combine the data
      const badgeProgress = allBadges.map(badge => ({
        ...badge,
        isEarned: earnedBadgeIds.has(badge.id),
        earnedAt: userBadges.find(ub => ub.badge_id === badge.id)?.earned_at || null,
      }));

      const totalBadges = allBadges.length;
      const earnedBadges = userBadges.length;
      const progressPercentage = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;

      return {
        badges: badgeProgress,
        totalBadges,
        earnedBadges,
        progressPercentage,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get recent badge achievements (last 30 days)
export function useRecentBadges(userId?: string, days: number = 30) {
  return useQuery({
    queryKey: [...queryKeys.user.badges(userId || ""), "recent", days],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badges (
            id,
            name,
            description,
            icon,
            points_reward
          )
        `)
        .eq("user_id", userId)
        .gte("earned_at", daysAgo.toISOString())
        .order("earned_at", { ascending: false });

      if (error)
        throw error;
      return data as (UserBadge & { badges: Badge })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
