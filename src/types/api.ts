import type {
  Badge,
  Language,
  Lesson,
  User,
  UserBadge,
  UserProgress,
  UserStats,
  UserVocabulary,
  Vocabulary,
} from "./common";
import type {
  GameSession,
  ProgressData,
  ReviewQueueItem,
  SessionSummary,
} from "./game";

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

// Authentication API types
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
  selectedLanguage?: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

// User API types
export type UpdateUserRequest = {
  displayName?: string;
  selectedLanguage?: string;
};

export type UpdateUserPreferencesRequest = {
  theme?: "light" | "dark" | "system";
  dailyGoal?: number;
  reminderTime?: string;
  enableSound?: boolean;
  enableNotifications?: boolean;
};

export type GetUserStatsResponse = {} & UserStats;

export type GetUserProgressResponse = {
  progress: ProgressData;
  summary: {
    totalLessons: number;
    completedLessons: number;
    totalWords: number;
    learnedWords: number;
  };
};

// Language API types
export type GetLanguagesResponse = {
  languages: Language[];
};

export type GetLanguageResponse = {
  language: Language;
  stats: {
    totalLessons: number;
    totalWords: number;
    averageDifficulty: number;
  };
};

// Lesson API types
export type GetLessonsRequest = {
  languageId?: string;
  difficultyLevel?: number;
  isPublished?: boolean;
} & QueryParams;

export type GetLessonsResponse = {
  lessons: Lesson[];
  meta: ResponseMeta;
};

export type GetLessonResponse = {
  lesson: Lesson;
  vocabulary: Vocabulary[];
  userProgress?: UserProgress;
};

export type StartLessonRequest = {
  lessonId: string;
};

export type StartLessonResponse = {
  session: GameSession;
};

export type CompleteLessonRequest = {
  lessonId: string;
  sessionId: string;
  score: number;
  answers: Array<{
    vocabularyId: string;
    isCorrect: boolean;
    timeSpent: number;
    attempts: number;
  }>;
};

export type CompleteLessonResponse = {
  progress: UserProgress;
  summary: SessionSummary;
  newBadges: Badge[];
};

// Vocabulary API types
export type GetVocabularyRequest = {
  lessonId?: string;
  difficultyLevel?: number;
  wordType?: string;
  search?: string;
} & QueryParams;

export type GetVocabularyResponse = {
  vocabulary: Vocabulary[];
  meta: ResponseMeta;
};

export type GetUserVocabularyRequest = {
  masteryLevel?: number;
  needsReview?: boolean;
} & QueryParams;

export type GetUserVocabularyResponse = {
  vocabulary: UserVocabulary[];
  meta: ResponseMeta;
};

export type UpdateVocabularyProgressRequest = {
  vocabularyId: string;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: number;
};

export type UpdateVocabularyProgressResponse = {
  userVocabulary: UserVocabulary;
  nextReviewDate: string;
};

// Review API types
export type GetReviewQueueRequest = {
  limit?: number;
  includeOverdue?: boolean;
};

export type GetReviewQueueResponse = {
  items: ReviewQueueItem[];
  stats: {
    totalDue: number;
    overdue: number;
    upcoming: number;
  };
};

export type SubmitReviewRequest = {
  vocabularyId: string;
  quality: number; // 0-5 for spaced repetition algorithm
  timeSpent: number;
};

export type SubmitReviewResponse = {
  userVocabulary: UserVocabulary;
  nextReviewDate: string;
  masteryLevelChanged: boolean;
};

// Badge API types
export type GetBadgesResponse = {
  badges: Badge[];
};

export type GetUserBadgesResponse = {
  userBadges: UserBadge[];
  availableBadges: Badge[];
  progress: Array<{
    badgeId: string;
    currentValue: number;
    targetValue: number;
    progress: number;
  }>;
};

// Analytics API types
export type GetAnalyticsRequest = {
  period: "day" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
};

export type GetAnalyticsResponse = {
  studyTime: {
    total: number;
    average: number;
    trend: number;
  };
  accuracy: {
    overall: number;
    byDifficulty: Record<number, number>;
    trend: number;
  };
  progress: {
    lessonsCompleted: number;
    wordsLearned: number;
    pointsEarned: number;
  };
  streaks: {
    current: number;
    longest: number;
    daysActive: number;
  };
};

// Leaderboard API types
export type GetLeaderboardRequest = {
  type: "points" | "streak" | "lessons" | "words";
  period: "daily" | "weekly" | "monthly" | "all_time";
  limit?: number;
};

export type GetLeaderboardResponse = {
  entries: Array<{
    rank: number;
    userId: string;
    displayName: string;
    value: number;
    avatar?: string;
  }>;
  userRank?: number;
  userValue?: number;
};

// Search API types
export type SearchRequest = {
  query: string;
  type?: "lessons" | "vocabulary" | "all";
  languageId?: string;
  limit?: number;
};

export type SearchResponse = {
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  total: number;
};

// Feedback API types
export type SubmitFeedbackRequest = {
  type: "bug" | "feature" | "improvement" | "general";
  title: string;
  description: string;
  rating?: number;
  metadata?: Record<string, any>;
};

export type SubmitFeedbackResponse = {
  feedbackId: string;
  message: string;
};

// Export API types
export type ExportDataRequest = {
  format: "json" | "csv";
  includeProgress?: boolean;
  includeActivities?: boolean;
  includePreferences?: boolean;
};

export type ExportDataResponse = {
  downloadUrl: string;
  expiresAt: string;
  fileSize: number;
};

// Webhook types for real-time updates
export type WebhookEvent = {
  type: string;
  userId: string;
  data: Record<string, any>;
  timestamp: string;
};

// File upload types
export type UploadRequest = {
  file: File;
  type: "avatar" | "audio" | "feedback_attachment";
};

export type UploadResponse = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};
