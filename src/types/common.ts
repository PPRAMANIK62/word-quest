import type { Database } from "./supabase";

// Extract base types from database
export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type Language = Database["public"]["Tables"]["languages"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Vocabulary = Database["public"]["Tables"]["vocabulary"]["Row"];
export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];
export type UserVocabulary = Database["public"]["Tables"]["user_vocabulary"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type UserSession = Database["public"]["Tables"]["user_sessions"]["Row"];

// Common enums and constants
export type GameMode = "flashcard" | "multiple_choice" | "typing" | "listening" | "speaking";

export type QuestionType
  = | "translate_to_english"
    | "translate_from_english"
    | "multiple_choice"
    | "fill_in_blank"
    | "pronunciation"
    | "listening_comprehension";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type LessonStatus = "not_started" | "in_progress" | "completed";

export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

export type ActivityType
  = | "lesson_started"
    | "lesson_completed"
    | "question_answered"
    | "word_learned"
    | "badge_earned"
    | "streak_updated"
    | "login"
    | "logout"
    | "profile_updated"
    | "language_changed";

export type NotificationType
  = | "achievement_unlocked"
    | "streak_reminder"
    | "lesson_available"
    | "friend_request"
    | "friend_activity"
    | "level_up"
    | "weekly_report"
    | "system_update"
    | "maintenance";

// User statistics interface
export type UserStats = {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  wordsLearned: number;
  averageScore: number;
  totalStudyTime: number; // in minutes
  badgesEarned: number;
};

// Learning preferences interface
export type LearningPreferences = {
  selectedLanguage: string;
  difficultyLevel: DifficultyLevel;
  dailyGoal: number; // minutes per day
  reminderTime?: string; // HH:MM format
  enableSound: boolean;
  enableNotifications: boolean;
  preferredGameModes: GameMode[];
};

// Badge criteria types
export type BadgeCriteria = {
  lessons_completed?: number;
  streak_days?: number;
  words_learned?: number;
  perfect_lesson?: boolean;
  languages_tried?: number;
  total_points?: number;
  study_time_minutes?: number;
};

// Generic API response wrapper
export type ApiResponse<T = any> = {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
  meta?: ResponseMeta;
};

// API error structure
export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string; // For validation errors
  timestamp: string;
};

// Response metadata
export type ResponseMeta = {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
  requestId?: string;
  timestamp: string;
};

// Utility types for common patterns
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Common ID types
export type UserId = string;
export type LanguageId = string;
export type LessonId = string;
export type VocabularyId = string;
export type BadgeId = string;
export type SessionId = string;

// Theme types
export type Theme = "light" | "dark" | "system";

// Language codes
export type LanguageCode = "es" | "de" | "fr" | "it" | "pt" | "ja" | "ko" | "zh";

// Common status types
export type LoadingState = "idle" | "loading" | "success" | "error";
export type ConnectionStatus = "online" | "offline" | "connecting";

// Pagination parameters
export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

// Sorting parameters
export type SortParams = {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// Filtering parameters
export type FilterParams = {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
};

// Query parameters combining pagination, sorting, and filtering
export type QueryParams = {} & PaginationParams & SortParams & FilterParams;
