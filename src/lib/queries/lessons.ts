import { useQuery } from "@tanstack/react-query";

import type { Language, UserProgress } from "@/types/common";

import { queryKeys } from "@/lib/query-client";
import { supabase } from "@/lib/supabase";

// Get all available languages
export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.languages.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error)
        throw error;
      return data as Language[];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - languages don't change often
  });
}

// Get lessons for a specific language
export function useLessons(languageId?: string, userId?: string) {
  return useQuery({
    queryKey: queryKeys.lessons.all(languageId || ""),
    queryFn: async () => {
      if (!languageId)
        throw new Error("Language ID is required");

      // First, get lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("language_id", languageId)
        .eq("is_published", true)
        .order("order_index");

      if (lessonsError)
        throw lessonsError;

      // Get vocabulary counts for all lessons
      const vocabularyCountMap = new Map();
      if (lessons.length > 0) {
        const lessonIds = lessons.map(lesson => lesson.id);
        const { data: vocabularyCounts, error: vocabError } = await supabase
          .from("vocabulary")
          .select("lesson_id")
          .in("lesson_id", lessonIds);

        if (vocabError)
          throw vocabError;

        // Count vocabulary per lesson
        vocabularyCounts?.forEach((vocab) => {
          const currentCount = vocabularyCountMap.get(vocab.lesson_id) || 0;
          vocabularyCountMap.set(vocab.lesson_id, currentCount + 1);
        });
      }

      // If user is provided, get their progress separately
      const userProgressMap = new Map();
      if (userId && lessons.length > 0) {
        const lessonIds = lessons.map(lesson => lesson.id);
        const { data: progressData, error: progressError } = await supabase
          .from("user_progress")
          .select(`
            lesson_id,
            status,
            completed_at,
            score,
            attempts,
            updated_at
          `)
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);

        if (progressError)
          throw progressError;

        // Create a map for quick lookup
        progressData?.forEach((progress) => {
          userProgressMap.set(progress.lesson_id, progress);
        });
      }

      // Transform data to include progress information
      return lessons.map((lesson) => {
        const userProgress = userProgressMap.get(lesson.id);
        const isCompleted = userProgress?.status === "completed" || !!userProgress?.completed_at;
        const progress = isCompleted ? 100 : (userProgress?.score || 0);

        return {
          ...lesson,
          vocabularyCount: vocabularyCountMap.get(lesson.id) || 0,
          progress,
          isCompleted,
          pointsEarned: userProgress?.score || 0,
          lastAccessed: userProgress?.updated_at,
        };
      });
    },
    enabled: !!languageId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get specific lesson details
export function useLesson(lessonId?: string, userId?: string) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(lessonId || ""),
    queryFn: async () => {
      if (!lessonId)
        throw new Error("Lesson ID is required");

      const query = supabase
        .from("lessons")
        .select(`
          *,
          languages (
            id,
            name,
            code,
            flag_emoji
          ),
          vocabulary (
            id,
            english_word,
            translated_word,
            pronunciation,
            word_type,
            difficulty_level,
            example_sentence_english,
            example_sentence_translated,
            audio_url
          )
        `)
        .eq("id", lessonId)
        .single();

      const { data: lesson, error } = await query;
      if (error)
        throw error;

      // Get user progress if userId is provided
      let userProgress = null;
      if (userId) {
        const { data: progress, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
          .single();

        if (progressError && progressError.code !== "PGRST116") {
          throw progressError;
        }
        userProgress = progress;
      }

      return {
        ...lesson,
        userProgress,
        vocabularyCount: lesson.vocabulary?.length || 0,
      };
    },
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user's progress for a specific lesson
export function useLessonProgress(userId?: string, lessonId?: string) {
  return useQuery({
    queryKey: queryKeys.lessons.progress(userId || "", lessonId || ""),
    queryFn: async () => {
      if (!userId || !lessonId)
        throw new Error("User ID and Lesson ID are required");

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data as UserProgress | null;
    },
    enabled: !!userId && !!lessonId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
