import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UserProgress, UserVocabulary } from "@/types/common";

import { queryKeys } from "@/lib/query-client";
import { supabase } from "@/lib/supabase";

// Start a lesson (create initial progress record)
export function useStartLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, lessonId }: {
      userId: string;
      lessonId: string;
    }) => {
      // Check if progress already exists
      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single();

      if (existingProgress) {
        // Update existing progress to mark as started
        const { data, error } = await supabase
          .from("user_progress")
          .update({
            status: "in_progress",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
          .select()
          .single();

        if (error)
          throw error;
        return data as UserProgress;
      }
      else {
        // Create new progress record
        const { data, error } = await supabase
          .from("user_progress")
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            status: "in_progress",
            score: 0,
            attempts: 1,
          })
          .select()
          .single();

        if (error)
          throw error;
        return data as UserProgress;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate lesson queries to refresh progress
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.all(""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.detail(variables.lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.progress(variables.userId, variables.lessonId),
      });
    },
    onError: (error: any) => {
      console.error("Error starting lesson:", error);
      toast.error("Failed to start lesson. Please try again.");
    },
  });
}

// Update lesson progress
export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, lessonId, score, status }: {
      userId: string;
      lessonId: string;
      score?: number;
      status?: "in_progress" | "completed" | "paused";
    }) => {
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (score !== undefined)
        updates.score = score;
      if (status !== undefined)
        updates.status = status;

      const { data, error } = await supabase
        .from("user_progress")
        .update(updates)
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .select()
        .single();

      if (error)
        throw error;
      return data as UserProgress;
    },
    onSuccess: (_, variables) => {
      // Invalidate lesson queries to refresh progress
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.all(""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.detail(variables.lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.progress(variables.userId, variables.lessonId),
      });
    },
    onError: (error: any) => {
      console.error("Error updating lesson progress:", error);
      toast.error("Failed to save progress. Please try again.");
    },
  });
}

// Complete a lesson
export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, lessonId, score, pointsEarned }: {
      userId: string;
      lessonId: string;
      score: number;
      pointsEarned: number;
    }) => {
      // Update lesson progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          score,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .select()
        .single();

      if (progressError)
        throw progressError;

      // Update user's total points
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", userId)
        .single();

      if (profileError)
        throw profileError;

      const newTotalPoints = (profileData.total_points || 0) + pointsEarned;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          total_points: newTotalPoints,
          last_activity_date: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError)
        throw updateError;

      return {
        progress: progressData as UserProgress,
        pointsEarned,
        newTotalPoints,
      };
    },
    onSuccess: (data, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.all(""),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.detail(variables.lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.progress(variables.userId, variables.lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.progress(variables.userId),
      });

      toast.success(`Lesson completed! You earned ${data.pointsEarned} points!`);
    },
    onError: (error: any) => {
      console.error("Error completing lesson:", error);
      toast.error("Failed to complete lesson. Please try again.");
    },
  });
}

// Update vocabulary progress
export function useUpdateVocabularyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, vocabularyId, isCorrect }: {
      userId: string;
      vocabularyId: string;
      isCorrect: boolean;
    }) => {
      // Get existing progress or create new
      const { data: existingProgress } = await supabase
        .from("user_vocabulary")
        .select("*")
        .eq("user_id", userId)
        .eq("vocabulary_id", vocabularyId)
        .single();

      if (existingProgress) {
        // Update existing progress
        const newTotalAttempts = (existingProgress.total_attempts || 0) + 1;
        const newCorrectAnswers = (existingProgress.correct_answers || 0) + (isCorrect ? 1 : 0);
        const accuracy = newCorrectAnswers / newTotalAttempts;

        // Simple mastery level calculation (0-5 scale)
        let newMasteryLevel = existingProgress.mastery_level || 0;
        if (isCorrect && accuracy >= 0.8 && newTotalAttempts >= 3) {
          newMasteryLevel = Math.min(5, newMasteryLevel + 1);
        }
        else if (!isCorrect && newMasteryLevel > 0) {
          newMasteryLevel = Math.max(0, newMasteryLevel - 1);
        }

        const { data, error } = await supabase
          .from("user_vocabulary")
          .update({
            total_attempts: newTotalAttempts,
            correct_answers: newCorrectAnswers,
            mastery_level: newMasteryLevel,
            last_reviewed_at: new Date().toISOString(),
            // Simple spaced repetition: next review in 1-7 days based on mastery
            next_review_at: new Date(Date.now() + (newMasteryLevel + 1) * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("user_id", userId)
          .eq("vocabulary_id", vocabularyId)
          .select()
          .single();

        if (error)
          throw error;
        return data as UserVocabulary;
      }
      else {
        // Create new progress record
        const { data, error } = await supabase
          .from("user_vocabulary")
          .insert({
            user_id: userId,
            vocabulary_id: vocabularyId,
            total_attempts: 1,
            correct_answers: isCorrect ? 1 : 0,
            mastery_level: isCorrect ? 1 : 0,
            last_reviewed_at: new Date().toISOString(),
            next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
          })
          .select()
          .single();

        if (error)
          throw error;
        return data as UserVocabulary;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate vocabulary queries to refresh progress data
      queryClient.invalidateQueries({
        queryKey: queryKeys.languages.vocabulary(""),
      });

      // Also invalidate user vocabulary queries
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.languages.vocabulary(""), variables.userId],
      });
    },
    onError: (error: any) => {
      console.error("Error updating vocabulary progress:", error);
      // Don't show error toast for vocabulary progress as it's background
    },
  });
}
