// API types
export type {
  ApiError,
  ApiResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  ExportDataRequest,
  ExportDataResponse,
  FilterParams,
  GetAnalyticsRequest,
  GetAnalyticsResponse,
  GetBadgesResponse,
  GetLanguageResponse,
  GetLanguagesResponse,
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  GetLessonResponse,
  GetLessonsRequest,
  GetLessonsResponse,
  GetReviewQueueRequest,
  GetReviewQueueResponse,
  GetUserBadgesResponse,
  GetUserProgressResponse,
  GetUserStatsResponse,
  GetUserVocabularyRequest,
  GetUserVocabularyResponse,
  GetVocabularyRequest,
  GetVocabularyResponse,
  LoginRequest,
  LoginResponse,
  PaginationParams,
  QueryParams,
  RefreshTokenRequest,
  RegisterRequest,
  ResponseMeta,
  SearchRequest,
  SearchResponse,
  SortParams,
  StartLessonRequest,
  StartLessonResponse,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
  SubmitReviewRequest,
  SubmitReviewResponse,
  UpdateUserPreferencesRequest,
  UpdateUserRequest,
  UpdateVocabularyProgressRequest,
  UpdateVocabularyProgressResponse,
  UploadRequest,
  UploadResponse,
  WebhookEvent,
} from "./api";

// Database types
export type { Database } from "./supabase";

// Game types
export type {
  Achievement,
  Badge,
  BadgeCriteria,
  DifficultyLevel,
  GameAnswer,
  ApiResponse as GameApiResponse,
  GameError,
  GameMode,
  GameQuestion,
  GameSession,
  Language,
  LeaderboardEntry,
  LearningPreferences,
  Lesson,
  LessonStatus,
  LessonWithProgress,
  MasteryLevel,
  ProgressData,
  QuestionType,
  ReviewQueueItem,
  SessionSummary,
  SpacedRepetitionData,
  UserBadge,
  UserProgress,
  UserSession,
  UserStats,
  UserVocabulary,
  Vocabulary,
  VocabularyWithProgress,
} from "./game";

// User types
export type {
  ActivityType,
  AuthState,
  NotificationType,
  StreakInfo,
  User,
  UserAchievementProgress,
  UserActivity,
  UserBackup,
  UserDevice,
  UserExportData,
  UserFeedback,
  UserFollower,
  UserFollowing,
  UserFriend,
  UserLevel,
  UserNotification,
  UserOnboarding,
  UserPreferences,
  UserPrivacySettings,
  UserProfile,
  UserProgressSummary,
  UserSessionData,
  UserSocial,
  UserSubscription,
} from "./user";

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

// Form validation types
export type ValidationError = {
  field: string;
  message: string;
  code?: string;
};

export type FormState<T> = {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
};

// Event types for analytics
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
};

// Notification types
export type NotificationLevel = "info" | "success" | "warning" | "error";

export type ToastNotification = {
  id: string;
  level: NotificationLevel;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

// Route types
export type RouteParams = Record<string, string>;
export type SearchParams = Record<string, string | string[]>;

// Component prop types
export type ComponentSize = "sm" | "md" | "lg" | "xl";
export type ComponentVariant = "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost";

// Audio types
export type AudioState = "idle" | "loading" | "playing" | "paused" | "error";

export type AudioSettings = {
  volume: number; // 0-1
  playbackRate: number; // 0.5-2
  autoplay: boolean;
  loop: boolean;
};

// Device types
export type DeviceType = "mobile" | "tablet" | "desktop";
export type Platform = "web" | "ios" | "android" | "windows" | "macos" | "linux";

// Feature flags
export type FeatureFlag = {
  name: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
};

// A/B testing
export type ExperimentVariant = {
  name: string;
  weight: number;
  config: Record<string, any>;
};

export type Experiment = {
  name: string;
  variants: ExperimentVariant[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
};

// Cache types
export type CacheEntry<T> = {
  data: T;
  timestamp: Date;
  expiresAt: Date;
  key: string;
};

export type CacheConfig = {
  ttl: number; // time to live in milliseconds
  maxSize: number;
  strategy: "lru" | "fifo" | "lfu";
};

// Error boundary types
export type ErrorInfo = {
  componentStack: string;
  errorBoundary?: string;
  eventId?: string;
};

export type ErrorFallbackProps = {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
};

// Performance monitoring
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
};

// Accessibility types
export type AriaRole = string;
export type AriaAttributes = Record<string, string | boolean | number>;

// Internationalization
export type LocaleCode = string;
export type TranslationKey = string;
export type TranslationValues = Record<string, string | number>;

// Configuration types
export type AppConfig = {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  version: string;
  features: Record<string, boolean>;
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  sentry: {
    enabled: boolean;
    dsn?: string;
  };
};
