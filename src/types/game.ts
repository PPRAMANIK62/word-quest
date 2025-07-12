// Game-related types for WordQuest

import type {
  Badge,
  BadgeCriteria,
  DifficultyLevel,
  GameMode,
  Language,
  LearningPreferences,
  Lesson,
  LessonStatus,
  MasteryLevel,
  QuestionType,
  UserBadge,
  UserProgress,
  UserSession,
  UserStats,
  UserVocabulary,
  Vocabulary,
} from "./common";

// Re-export common types for backward compatibility
export type {
  Badge,
  BadgeCriteria,
  DifficultyLevel,
  GameMode,
  Language,
  LearningPreferences,
  Lesson,
  LessonStatus,
  MasteryLevel,
  QuestionType,
  UserBadge,
  UserProgress,
  UserSession,
  UserStats,
  UserVocabulary,
  Vocabulary,
};

// Game question interface
export type GameQuestion = {
  id: string;
  type: QuestionType;
  vocabulary: Vocabulary;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  hint?: string;
  explanation?: string;
};

// Game session interface
export type GameSession = {
  id: string;
  lessonId: string;
  userId: string;
  questions: GameQuestion[];
  currentQuestionIndex: number;
  answers: GameAnswer[];
  startedAt: Date;
  endedAt?: Date;
  score?: number;
  isCompleted: boolean;
};

// Game answer interface
export type GameAnswer = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attempts: number;
};

// Lesson with progress
export type LessonWithProgress = {
  progress?: UserProgress;
  vocabularyCount: number;
  completedVocabularyCount: number;
} & Lesson;

// Vocabulary with user progress
export type VocabularyWithProgress = {
  userProgress?: UserVocabulary;
} & Vocabulary;

// Spaced repetition algorithm types
export type SpacedRepetitionData = {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
};

// Learning session summary
export type SessionSummary = {
  duration: number; // in minutes
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number; // percentage
  pointsEarned: number;
  wordsReviewed: string[];
  newWordsLearned: string[];
  badgesEarned: Badge[];
};

// Progress tracking
export type ProgressData = {
  daily: {
    date: string;
    lessonsCompleted: number;
    wordsLearned: number;
    pointsEarned: number;
    studyTime: number;
  }[];
  weekly: {
    week: string;
    lessonsCompleted: number;
    wordsLearned: number;
    pointsEarned: number;
    studyTime: number;
  }[];
  monthly: {
    month: string;
    lessonsCompleted: number;
    wordsLearned: number;
    pointsEarned: number;
    studyTime: number;
  }[];
};

// Achievement system
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "progress" | "streak" | "mastery" | "social" | "special";
  criteria: BadgeCriteria;
  pointsReward: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // 0-100 percentage
};

// Leaderboard entry
export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  totalPoints: number;
  currentStreak: number;
  rank: number;
  avatar?: string;
};

// Review queue item for spaced repetition
export type ReviewQueueItem = {
  vocabularyId: string;
  vocabulary: Vocabulary;
  userProgress: UserVocabulary;
  priority: "overdue" | "due" | "upcoming";
  daysOverdue?: number;
};

// Error types for better error handling
export type GameError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};

// API response wrapper
export type ApiResponse<T> = {
  data?: T;
  error?: GameError;
  success: boolean;
  message?: string;
};
