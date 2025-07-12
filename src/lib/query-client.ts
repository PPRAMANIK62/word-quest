import { QueryClient } from '@tanstack/react-query'

// Create a client with optimized defaults for our language learning app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time for different types of data
      staleTime: 1000 * 60 * 5, // 5 minutes default
      // Cache time
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Show error notifications for failed mutations
      onError: (error: any) => {
        console.error('Mutation error:', error)
        // TODO: Add toast notification here when we implement it
      },
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // User-related queries
  user: {
    current: ['user', 'current'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
    progress: (userId: string) => ['user', 'progress', userId] as const,
    badges: (userId: string) => ['user', 'badges', userId] as const,
    streaks: (userId: string) => ['user', 'streaks', userId] as const,
  },
  // Language-related queries
  languages: {
    all: ['languages'] as const,
    lessons: (languageId: string) => ['languages', languageId, 'lessons'] as const,
    vocabulary: (languageId: string, lessonId?: string) =>
      lessonId
        ? ['languages', languageId, 'vocabulary', lessonId] as const
        : ['languages', languageId, 'vocabulary'] as const,
  },
  // Learning-related queries
  lessons: {
    all: (languageId: string) => ['lessons', languageId] as const,
    detail: (lessonId: string) => ['lessons', 'detail', lessonId] as const,
    progress: (userId: string, lessonId: string) =>
      ['lessons', 'progress', userId, lessonId] as const,
  },
  // Review-related queries
  reviews: {
    due: (userId: string) => ['reviews', 'due', userId] as const,
    history: (userId: string) => ['reviews', 'history', userId] as const,
  },
} as const
