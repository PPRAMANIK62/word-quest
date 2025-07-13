import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { User, UserBadge } from "@/types/common";

import { queryKeys } from "@/lib/query-client";
import { supabase, updateUserProfile } from "@/lib/supabase";

// Get current user profile
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: queryKeys.user.profile(userId || ""),
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error)
        throw error;
      return data as User;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user statistics (aggregated data)
export function useUserStats(userId?: string) {
  return useQuery({
    queryKey: queryKeys.user.progress(userId || ""),
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      // Get user profile for basic stats
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("total_points, current_streak, longest_streak")
        .eq("id", userId)
        .single();

      if (profileError)
        throw profileError;

      // Get completed lessons count
      const { count: completedLessons, error: lessonsError } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed");

      if (lessonsError)
        throw lessonsError;

      // Get total vocabulary learned
      const { count: vocabularyLearned, error: vocabError } = await supabase
        .from("user_vocabulary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("mastery_level", 1);

      if (vocabError)
        throw vocabError;

      return {
        totalPoints: profile.total_points || 0,
        currentStreak: profile.current_streak || 0,
        longestStreak: profile.longest_streak || 0,
        completedLessons: completedLessons || 0,
        vocabularyLearned: vocabularyLearned || 0,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get user's learning progress for current language
export function useUserProgress(userId?: string, languageId?: string) {
  return useQuery({
    queryKey: [...queryKeys.user.progress(userId || ""), languageId],
    queryFn: async () => {
      if (!userId || !languageId)
        throw new Error("User ID and Language ID are required");

      // Get lessons for the language with user progress
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          user_progress!inner(
            user_id,
            status,
            completed_at,
            score,
            updated_at
          )
        `)
        .eq("language_id", languageId)
        .eq("user_progress.user_id", userId)
        .order("order_index");

      if (error)
        throw error;

      const totalLessons = data.length;
      const completedLessons = data.filter(lesson =>
        lesson.user_progress?.[0]?.status === "completed"
        || lesson.user_progress?.[0]?.completed_at,
      ).length;

      const overallProgress = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      return {
        totalLessons,
        completedLessons,
        overallProgress,
        lessons: data,
      };
    },
    enabled: !!userId && !!languageId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user's weekly activity data
export function useWeeklyActivity(userId?: string, days: number = 7) {
  return useQuery({
    queryKey: [...queryKeys.user.progress(userId || ""), "weekly", days],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", daysAgo.toISOString())
        .order("started_at", { ascending: true });

      if (error)
        throw error;

      // Group sessions by day and aggregate data
      const weeklyData = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const daySessions = data.filter((session) => {
          const sessionDate = new Date(session.started_at || "");
          return sessionDate >= dayStart && sessionDate < dayEnd;
        });

        const dayData = {
          day: dayNames[date.getDay()],
          date: date.toISOString().split("T")[0],
          lessons: daySessions.reduce((sum, session) => sum + (session.lessons_completed || 0), 0),
          reviews: daySessions.reduce((sum, session) => sum + (session.words_practiced || 0), 0),
          points: daySessions.reduce((sum, session) => sum + (session.points_earned || 0), 0),
          sessions: daySessions.length,
        };

        weeklyData.push(dayData);
      }

      return weeklyData;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user's recent activity (sessions, lessons, badges)
export function useRecentActivity(userId?: string, days: number = 7) {
  return useQuery({
    queryKey: [...queryKeys.user.progress(userId || ""), "recent-activity", days],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      // Get recent user sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("started_at", daysAgo.toISOString())
        .order("started_at", { ascending: false })
        .limit(10);

      if (sessionsError)
        throw sessionsError;

      // Get recent completed lessons
      const { data: completedLessons, error: lessonsError } = await supabase
        .from("user_progress")
        .select(`
          *,
          lessons (
            id,
            title,
            languages (
              name
            )
          )
        `)
        .eq("user_id", userId)
        .eq("status", "completed")
        .gte("completed_at", daysAgo.toISOString())
        .order("completed_at", { ascending: false })
        .limit(5);

      if (lessonsError)
        throw lessonsError;

      // Get recent badges
      const { data: recentBadges, error: badgesError } = await supabase
        .from("user_badges")
        .select(`
          *,
          badges (
            id,
            name,
            description,
            icon
          )
        `)
        .eq("user_id", userId)
        .gte("earned_at", daysAgo.toISOString())
        .order("earned_at", { ascending: false })
        .limit(5);

      if (badgesError)
        throw badgesError;

      // Combine and sort all activities by timestamp
      const activities: Array<{
        id: string;
        type: string;
        title: string;
        subtitle?: string;
        timestamp: string;
        color: string;
        icon: string;
      }> = [];

      // Add completed lessons
      completedLessons?.forEach((lesson) => {
        if (lesson.completed_at) {
          activities.push({
            id: `lesson-${lesson.id}`,
            type: "lesson_completed",
            title: `Completed: ${lesson.lessons?.title}`,
            subtitle: lesson.lessons?.languages?.name,
            timestamp: lesson.completed_at,
            color: "green",
            icon: "✅",
          });
        }
      });

      // Add earned badges
      recentBadges?.forEach((userBadge) => {
        if (userBadge.earned_at) {
          activities.push({
            id: `badge-${userBadge.id}`,
            type: "badge_earned",
            title: `Earned: ${userBadge.badges?.name} badge`,
            subtitle: userBadge.badges?.description || undefined,
            timestamp: userBadge.earned_at,
            color: "purple",
            icon: userBadge.badges?.icon || "🏆",
          });
        }
      });

      // Add review sessions (from user_sessions with words_practiced > 0)
      sessions?.forEach((session) => {
        if (session.words_practiced && session.words_practiced > 0 && session.started_at) {
          activities.push({
            id: `session-${session.id}`,
            type: "review_session",
            title: `Reviewed ${session.words_practiced} words`,
            subtitle: `Earned ${session.points_earned || 0} points`,
            timestamp: session.started_at,
            color: "blue",
            icon: "📚",
          });
        }
      });

      // Sort by timestamp (most recent first) and limit to 5
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get user's earned badges
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
            points_reward
          )
        `)
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error)
        throw error;
      return data as (UserBadge & { badges: any })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Mutation to update user profile
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: {
      userId: string;
      updates: Partial<{
        display_name: string;
        selected_language: string;
        total_points: number;
        current_streak: number;
        longest_streak: number;
        last_activity_date: string;
      }>;
    }) => {
      return await updateUserProfile(userId, updates);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch user profile queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(variables.userId),
      });

      // Also invalidate user stats if we updated relevant fields
      if (variables.updates.total_points !== undefined
        || variables.updates.current_streak !== undefined
        || variables.updates.longest_streak !== undefined) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.progress(variables.userId),
        });
      }

      // Show success message for language changes
      if (variables.updates.selected_language) {
        toast.success("Language preference updated successfully!");
      }
    },
    onError: (error: any) => {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },
  });
}

// Mutation specifically for updating selected language
export function useUpdateSelectedLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, languageCode }: {
      userId: string;
      languageCode: string;
    }) => {
      return await updateUserProfile(userId, { selected_language: languageCode });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch user profile queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(variables.userId),
      });

      // Invalidate all user-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.progress(variables.userId),
      });

      // Invalidate language-related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.languages.all,
      });

      // Force refetch of user profile to ensure UI updates
      queryClient.refetchQueries({
        queryKey: queryKeys.user.profile(variables.userId),
      });

      toast.success("Language updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating selected language:", error);
      toast.error("Failed to update language. Please try again.");
    },
  });
}
