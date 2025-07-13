import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GameSession } from "@/types";

import { supabase } from "@/lib/supabase";

/**
 * Submit exercise session results and update user progress
 */
export function useSubmitExerciseSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: GameSession) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user)
        throw new Error("User not authenticated");

      // Calculate points based on performance
      const correctAnswers = session.answers.filter(a => a.isCorrect).length;
      const totalQuestions = session.answers.length;
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
      const basePoints = 10;
      const bonusPoints = Math.floor(accuracy * 20); // Up to 20 bonus points for perfect score
      const pointsEarned = basePoints + bonusPoints;

      // Update user session
      const { error: sessionError } = await supabase
        .from("user_sessions")
        .insert({
          user_id: user.id,
          started_at: session.startedAt.toISOString(),
          ended_at: session.endedAt?.toISOString() || new Date().toISOString(),
          duration_minutes: session.endedAt
            ? Math.ceil((session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60))
            : 1,
          points_earned: pointsEarned,
          words_practiced: session.questions.length,
          lessons_completed: 0, // This is an exercise session, not a lesson completion
        });

      if (sessionError) {
        console.error("Error saving session:", sessionError);
        throw new Error("Failed to save session");
      }

      // Update vocabulary progress for each question
      const vocabularyUpdates = session.answers.map(async (answer) => {
        const question = session.questions.find(q => q.id === answer.questionId);
        if (!question)
          return;

        const vocabularyId = question.vocabulary.id;

        // Get current user vocabulary progress
        const { data: currentProgress } = await supabase
          .from("user_vocabulary")
          .select("*")
          .eq("user_id", user.id)
          .eq("vocabulary_id", vocabularyId)
          .single();

        const now = new Date().toISOString();
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + (answer.isCorrect ? 3 : 1));

        if (currentProgress) {
          // Update existing progress
          const newCorrectAnswers = (currentProgress.correct_answers || 0) + (answer.isCorrect ? 1 : 0);
          const newTotalAttempts = (currentProgress.total_attempts || 0) + 1;
          const newMasteryLevel = Math.min(5, Math.floor((newCorrectAnswers / newTotalAttempts) * 5) + 1);

          const { error } = await supabase
            .from("user_vocabulary")
            .update({
              correct_answers: newCorrectAnswers,
              total_attempts: newTotalAttempts,
              mastery_level: newMasteryLevel,
              last_reviewed_at: now,
              next_review_at: nextReviewDate.toISOString(),
              updated_at: now,
            })
            .eq("id", currentProgress.id);

          if (error) {
            console.error("Error updating vocabulary progress:", error);
          }
        }
        else {
          // Create new progress entry
          const { error } = await supabase
            .from("user_vocabulary")
            .insert({
              user_id: user.id,
              vocabulary_id: vocabularyId,
              correct_answers: answer.isCorrect ? 1 : 0,
              total_attempts: 1,
              mastery_level: answer.isCorrect ? 2 : 1,
              last_reviewed_at: now,
              next_review_at: nextReviewDate.toISOString(),
              created_at: now,
              updated_at: now,
            });

          if (error) {
            console.error("Error creating vocabulary progress:", error);
          }
        }
      });

      await Promise.all(vocabularyUpdates);

      // Update user profile points
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .single();

      if (profile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            total_points: (profile.total_points || 0) + pointsEarned,
          })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error updating profile points:", profileError);
        }
      }

      return {
        pointsEarned,
        accuracy: Math.round(accuracy * 100),
        correctAnswers,
        totalQuestions,
      };
    },
    onSuccess: (data) => {
      toast.success(`Exercise completed! +${data.pointsEarned} points earned!`);

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-vocabulary"] });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    onError: (error) => {
      console.error("Exercise submission error:", error);
      toast.error("Failed to save exercise results. Please try again.");
    },
  });
}

/**
 * Update vocabulary mastery level based on exercise performance
 */
export function useUpdateVocabularyMastery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vocabularyId,
      isCorrect,
      timeSpent: _timeSpent,
    }: {
      vocabularyId: string;
      isCorrect: boolean;
      timeSpent: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user)
        throw new Error("User not authenticated");

      // Get current progress
      const { data: currentProgress } = await supabase
        .from("user_vocabulary")
        .select("*")
        .eq("user_id", user.id)
        .eq("vocabulary_id", vocabularyId)
        .single();

      const now = new Date().toISOString();
      const nextReviewDate = new Date();

      // Spaced repetition algorithm
      if (isCorrect) {
        const currentInterval = currentProgress?.mastery_level || 1;
        nextReviewDate.setDate(nextReviewDate.getDate() + 2 ** currentInterval);
      }
      else {
        nextReviewDate.setDate(nextReviewDate.getDate() + 1);
      }

      if (currentProgress) {
        // Update existing
        const newCorrectAnswers = (currentProgress.correct_answers || 0) + (isCorrect ? 1 : 0);
        const newTotalAttempts = (currentProgress.total_attempts || 0) + 1;
        const accuracy = newCorrectAnswers / newTotalAttempts;
        const newMasteryLevel = Math.min(5, Math.max(1, Math.floor(accuracy * 5) + 1));

        const { data, error } = await supabase
          .from("user_vocabulary")
          .update({
            correct_answers: newCorrectAnswers,
            total_attempts: newTotalAttempts,
            mastery_level: newMasteryLevel,
            last_reviewed_at: now,
            next_review_at: nextReviewDate.toISOString(),
            updated_at: now,
          })
          .eq("id", currentProgress.id)
          .select()
          .single();

        if (error)
          throw error;
        return data;
      }
      else {
        // Create new
        const { data, error } = await supabase
          .from("user_vocabulary")
          .insert({
            user_id: user.id,
            vocabulary_id: vocabularyId,
            correct_answers: isCorrect ? 1 : 0,
            total_attempts: 1,
            mastery_level: isCorrect ? 2 : 1,
            last_reviewed_at: now,
            next_review_at: nextReviewDate.toISOString(),
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (error)
          throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-vocabulary"] });
      queryClient.invalidateQueries({ queryKey: ["review-queue"] });
    },
    onError: (error) => {
      console.error("Vocabulary mastery update error:", error);
      toast.error("Failed to update vocabulary progress");
    },
  });
}
