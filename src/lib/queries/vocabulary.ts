import { useQuery } from "@tanstack/react-query";

import type { UserVocabulary } from "@/types/common";

import { queryKeys } from "@/lib/query-client";
import { supabase } from "@/lib/supabase";

// Get vocabulary for a specific lesson
export function useVocabulary(lessonId?: string, userId?: string) {
  return useQuery({
    queryKey: [...queryKeys.languages.vocabulary("", lessonId || ""), userId],
    queryFn: async () => {
      if (!lessonId)
        throw new Error("Lesson ID is required");

      // First, get vocabulary for the lesson
      const { data: vocabulary, error: vocabError } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("english_word");

      if (vocabError)
        throw vocabError;

      // If user is provided, get their vocabulary progress separately
      const userProgressMap = new Map();
      if (userId && vocabulary.length > 0) {
        const vocabularyIds = vocabulary.map(vocab => vocab.id);
        const { data: progressData, error: progressError } = await supabase
          .from("user_vocabulary")
          .select(`
            vocabulary_id,
            mastery_level,
            total_attempts,
            correct_answers,
            last_reviewed_at,
            next_review_at
          `)
          .eq("user_id", userId)
          .in("vocabulary_id", vocabularyIds);

        if (progressError)
          throw progressError;

        // Create a map for quick lookup
        progressData?.forEach((progress) => {
          userProgressMap.set(progress.vocabulary_id, progress);
        });
      }

      return vocabulary.map((vocab) => {
        const userProgress = userProgressMap.get(vocab.id);
        return {
          ...vocab,
          userProgress: userProgress || null,
          masteryLevel: userProgress?.mastery_level || 0,
          timesReviewed: userProgress?.total_attempts || 0,
          lastReviewed: userProgress?.last_reviewed_at,
          nextReview: userProgress?.next_review_at,
        };
      });
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user's vocabulary across all lessons
export function useUserVocabulary(userId?: string, languageId?: string) {
  return useQuery({
    queryKey: [...queryKeys.languages.vocabulary(languageId || ""), userId],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      let query = supabase
        .from("user_vocabulary")
        .select(`
          *,
          vocabulary (
            id,
            english_word,
            translated_word,
            pronunciation,
            word_type,
            example_sentence_english,
            example_sentence_translated,
            audio_url,
            lessons (
              id,
              title,
              language_id
            )
          )
        `)
        .eq("user_id", userId);

      // Filter by language if provided
      if (languageId) {
        query = query.eq("vocabulary.lessons.language_id", languageId);
      }

      const { data, error } = await query.order("last_reviewed_at", { ascending: false });
      if (error)
        throw error;

      return data as (UserVocabulary & { vocabulary: any })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get words due for review (spaced repetition)
export function useReviewQueue(userId?: string, languageId?: string) {
  return useQuery({
    queryKey: queryKeys.reviews.due(userId || ""),
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      const now = new Date().toISOString();

      let query = supabase
        .from("user_vocabulary")
        .select(`
          *,
          vocabulary (
            id,
            english_word,
            translated_word,
            pronunciation,
            word_type,
            example_sentence_english,
            example_sentence_translated,
            audio_url,
            lessons (
              id,
              title,
              language_id
            )
          )
        `)
        .eq("user_id", userId)
        .lte("next_review_at", now)
        .gt("mastery_level", 0); // Only include words that have been learned

      // Filter by language if provided
      if (languageId) {
        query = query.eq("vocabulary.lessons.language_id", languageId);
      }

      const { data, error } = await query.order("next_review_at", { ascending: true });
      if (error)
        throw error;

      return data as (UserVocabulary & { vocabulary: any })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1, // 1 minute - review queue should be fresh
  });
}

// Get words that were recently incorrect
export function useRecentMistakes(userId?: string, languageId?: string, days: number = 7) {
  return useQuery({
    queryKey: [...queryKeys.reviews.history(userId || ""), "mistakes", days],
    queryFn: async () => {
      if (!userId)
        throw new Error("User ID is required");

      // Since user_sessions doesn't track individual vocabulary mistakes,
      // we'll return words with low accuracy based on user_vocabulary data
      const { data: userVocab, error } = await supabase
        .from("user_vocabulary")
        .select(`
          *,
          vocabulary (
            id,
            english_word,
            translated_word,
            pronunciation,
            word_type,
            example_sentence_english,
            example_sentence_translated,
            audio_url,
            lessons (
              id,
              title,
              language_id
            )
          )
        `)
        .eq("user_id", userId)
        .gt("total_attempts", 0); // Only words that have been attempted

      if (error)
        throw error;

      // Calculate accuracy and filter for low-performing words
      let mistakes = userVocab
        .map((item) => {
          const totalAttempts = item.total_attempts || 0;
          const correctAnswers = item.correct_answers || 0;
          const accuracy = totalAttempts > 0
            ? correctAnswers / totalAttempts
            : 0;
          return {
            vocabulary: item.vocabulary,
            mistakeCount: totalAttempts - correctAnswers,
            accuracy,
            totalAttempts,
          };
        })
        .filter(item => item.accuracy < 0.7 && item.totalAttempts >= 3); // Less than 70% accuracy with at least 3 attempts

      // Filter by language if provided
      if (languageId) {
        mistakes = mistakes.filter(mistake =>
          mistake.vocabulary?.lessons?.language_id === languageId,
        );
      }

      // Sort by mistake count (most mistakes first)
      return mistakes.sort((a, b) => b.mistakeCount - a.mistakeCount);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
