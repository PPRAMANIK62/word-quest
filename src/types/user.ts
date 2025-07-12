// User-related types for WordQuest

import type { LearningPreferences, UserStats } from "./common";
import type { Database } from "./supabase";

// Extract user profile type from database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Extended user profile with additional computed fields
export type UserProfile = {
  stats: UserStats;
  preferences: LearningPreferences;
  isOnline?: boolean;
  lastSeen?: Date;
  joinedAt: Date;
} & Profile;

// User authentication state
export type AuthState = {
  user: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
};

// User session data
export type UserSessionData = {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  activities: UserActivity[];
  totalTimeSpent: number; // in seconds
  pointsEarned: number;
  lessonsCompleted: string[];
  wordsReviewed: string[];
};

// User activity tracking
export type UserActivity = {
  id: string;
  type: ActivityType;
  timestamp: Date;
  data: Record<string, any>;
  pointsEarned?: number;
};

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

// User preferences for the application
export type UserPreferences = {
  theme: "light" | "dark" | "system";
  language: string; // UI language, not learning language
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEffects: boolean;
  animations: boolean;
  autoplay: boolean;
  showHints: boolean;
  showTranslations: boolean;
} & LearningPreferences;

// User progress summary
export type UserProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  totalWords: number;
  learnedWords: number;
  currentLevel: number;
  nextLevelProgress: number; // 0-100 percentage
  weeklyGoalProgress: number; // 0-100 percentage
  monthlyGoalProgress: number; // 0-100 percentage;
};

// User achievement progress
export type UserAchievementProgress = {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100 percentage
  isCompleted: boolean;
  completedAt?: Date;
};

// User streak information
export type StreakInfo = {
  current: number;
  longest: number;
  lastActivityDate: Date;
  isActiveToday: boolean;
  daysUntilFreeze: number;
  freezesUsed: number;
  freezesAvailable: number;
};

// User level system
export type UserLevel = {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelName: string;
  levelIcon: string;
  perks: string[];
};

// User social features
export type UserSocial = {
  friends: UserFriend[];
  followers: UserFollower[];
  following: UserFollowing[];
  publicProfile: boolean;
  shareProgress: boolean;
  allowFriendRequests: boolean;
};

export type UserFriend = {
  userId: string;
  displayName: string;
  avatar?: string;
  level: number;
  currentStreak: number;
  isOnline: boolean;
  friendsSince: Date;
};

export type UserFollower = {
  userId: string;
  displayName: string;
  avatar?: string;
  followedAt: Date;
};

export type UserFollowing = {
  userId: string;
  displayName: string;
  avatar?: string;
  followingAt: Date;
};

// User notification types
export type UserNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
};

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

// User settings for privacy and data
export type UserPrivacySettings = {
  profileVisibility: "public" | "friends" | "private";
  showRealName: boolean;
  showProgress: boolean;
  showStreak: boolean;
  showBadges: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
};

// User subscription/premium features
export type UserSubscription = {
  isActive: boolean;
  plan: "free" | "premium" | "family";
  startDate?: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: string[];
  paymentMethod?: string;
};

// User device information
export type UserDevice = {
  id: string;
  name: string;
  type: "mobile" | "tablet" | "desktop" | "web";
  os: string;
  browser?: string;
  lastUsed: Date;
  isActive: boolean;
  pushToken?: string;
};

// User backup and sync
export type UserBackup = {
  lastBackupDate: Date;
  autoBackup: boolean;
  cloudSync: boolean;
  backupSize: number; // in bytes
  backupLocation: string;
};

// User onboarding state
export type UserOnboarding = {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
};

// User feedback and support
export type UserFeedback = {
  id: string;
  userId: string;
  type: "bug" | "feature" | "improvement" | "general";
  title: string;
  description: string;
  rating?: number; // 1-5 stars
  attachments?: string[];
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
};

// User export data (for GDPR compliance)
export type UserExportData = {
  profile: UserProfile;
  progress: UserProgressSummary;
  activities: UserActivity[];
  achievements: UserAchievementProgress[];
  preferences: UserPreferences;
  notifications: UserNotification[];
  feedback: UserFeedback[];
  exportedAt: Date;
  format: "json" | "csv" | "pdf";
};
