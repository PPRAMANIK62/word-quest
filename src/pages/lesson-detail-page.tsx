import { ArrowLeft, BookOpen, Clock, Target } from "lucide-react";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { LessonProgressTracker } from "@/components/lesson/lesson-progress-tracker";
import { VocabularyCard } from "@/components/lesson/vocabulary-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAudio } from "@/hooks/use-audio";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteLesson, useStartLesson, useUpdateLessonProgress } from "@/lib/mutations";
import { useLesson, useLessonProgress, useVocabulary } from "@/lib/queries";

export function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Query hooks
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId, user?.id);
  const { data: vocabulary, isLoading: vocabularyLoading } = useVocabulary(lessonId, user?.id);
  const { data: progress } = useLessonProgress(user?.id, lessonId);

  // Mutation hooks
  const startLessonMutation = useStartLesson();
  const updateProgressMutation = useUpdateLessonProgress();
  const completeLessonMutation = useCompleteLesson();

  // Audio hook
  const audio = useAudio({
    onError: (error) => {
      toast.error(`Failed to play audio: ${error.message}`);
    },
  });

  const isLoading = lessonLoading || vocabularyLoading;
  const hasStarted = progress?.status === "in_progress" || progress?.status === "completed";
  const isCompleted = progress?.status === "completed";

  // Calculate progress from vocabulary data (source of truth)
  const vocabularyProgress = vocabulary
    ? {
        learnedCount: vocabulary.filter(word => (word as any).masteryLevel >= 1).length,
        totalCount: vocabulary.length,
        percentage: vocabulary.length > 0
          ? Math.round((vocabulary.filter(word => (word as any).masteryLevel >= 1).length / vocabulary.length) * 100)
          : 0,
      }
    : { learnedCount: 0, totalCount: 0, percentage: 0 };

  const handleProgressUpdate = useCallback(async () => {
    if (!user?.id || !lessonId)
      return;

    try {
      await updateProgressMutation.mutateAsync({
        userId: user.id,
        lessonId,
        score: vocabularyProgress.percentage,
        status: vocabularyProgress.percentage === 100 ? "completed" : "in_progress",
      });
    }
    catch (error) {
      console.error("Failed to update lesson progress:", error);
    }
  }, [user?.id, lessonId, updateProgressMutation, vocabularyProgress.percentage]);

  const handleLessonAutoComplete = useCallback(async () => {
    if (!user?.id || !lessonId || !vocabulary)
      return;

    const pointsEarned = vocabularyProgress.learnedCount * 10; // 10 points per learned word

    try {
      await completeLessonMutation.mutateAsync({
        userId: user.id,
        lessonId,
        score: vocabularyProgress.percentage,
        pointsEarned,
      });
    }
    catch (error) {
      console.error("Failed to auto-complete lesson:", error);
    }
  }, [user?.id, lessonId, vocabulary, vocabularyProgress, completeLessonMutation]);

  const handleStartLesson = useCallback(async () => {
    if (!user?.id || !lessonId)
      return;

    try {
      await startLessonMutation.mutateAsync({
        userId: user.id,
        lessonId,
      });
      toast.success("Lesson started! Let's learn some new words!");
    }
    catch (error) {
      console.error("Failed to start lesson:", error);
    }
  }, [user?.id, lessonId, startLessonMutation]);

  const handleCompleteLesson = useCallback(async () => {
    if (!user?.id || !lessonId || !vocabulary)
      return;

    const pointsEarned = vocabularyProgress.learnedCount * 10; // 10 points per learned word
    const score = vocabularyProgress.percentage; // Use actual progress

    try {
      await completeLessonMutation.mutateAsync({
        userId: user.id,
        lessonId,
        score,
        pointsEarned,
      });
    }
    catch (error) {
      console.error("Failed to complete lesson:", error);
    }
  }, [user?.id, lessonId, vocabulary, vocabularyProgress, completeLessonMutation]);

  const handleBackToLessons = useCallback(() => {
    // Navigate back to lessons with the current language parameter if available
    const currentLanguage = lesson?.languages?.code || lesson?.languages?.name?.toLowerCase();
    const searchParams = currentLanguage ? `?lang=${currentLanguage}` : "";
    navigate(`/lessons${searchParams}`);
  }, [lesson?.languages?.code, lesson?.languages?.name, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson not found
          </h1>
          <Button onClick={handleBackToLessons}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackToLessons}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{lesson.languages?.flag_emoji || "🌍"}</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Lesson Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Lesson Overview
              </CardTitle>
              <CardDescription className="mt-2">
                {lesson.description}
              </CardDescription>
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Completed" : hasStarted ? "In Progress" : "Not Started"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {vocabulary?.length || 0}
                {" "}
                words
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ~
                {lesson.estimated_duration_minutes}
                {" "}
                minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Difficulty: Level
                {" "}
                {lesson.difficulty_level}
              </span>
            </div>
          </div>

          {hasStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {vocabularyProgress.percentage}
                  %
                </span>
              </div>
              <Progress value={vocabularyProgress.percentage} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            {!hasStarted
              ? (
                  <Button
                    onClick={handleStartLesson}
                    disabled={startLessonMutation.isPending}
                    className="flex-1"
                  >
                    {startLessonMutation.isPending ? "Starting..." : "🚀 Start Lesson"}
                  </Button>
                )
              : !isCompleted
                  ? (
                      <Button
                        onClick={handleCompleteLesson}
                        disabled={completeLessonMutation.isPending}
                        className="flex-1"
                      >
                        {completeLessonMutation.isPending ? "Completing..." : "✅ Complete Lesson"}
                      </Button>
                    )
                  : (
                      <Button variant="outline" className="flex-1">
                        🔄 Review Lesson
                      </Button>
                    )}
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Section */}
      {hasStarted && vocabulary && vocabulary.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Tracker */}
          <div className="lg:col-span-1">
            <LessonProgressTracker
              vocabulary={vocabulary}
              userId={user?.id || ""}
              onProgressUpdate={handleProgressUpdate}
              onLessonComplete={handleLessonAutoComplete}
            />
          </div>

          {/* Vocabulary Cards */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Vocabulary (
              {vocabulary.length}
              {" "}
              words)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vocabulary.map(word => (
                <VocabularyCard
                  key={word.id}
                  vocabulary={word}
                  onAudioPlay={audio.play}
                  showProgress={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasStarted && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Ready to start learning?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click "Start Lesson" above to begin learning
            {" "}
            {vocabulary?.length || 0}
            {" "}
            new words!
          </p>
        </div>
      )}
    </div>
  );
}
