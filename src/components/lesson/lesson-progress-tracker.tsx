import { CheckCircle, Circle, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { UserVocabulary, Vocabulary } from "@/types/common";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUpdateVocabularyProgress } from "@/lib/mutations";

// Extended vocabulary type that includes user progress data
type VocabularyWithProgress = Vocabulary & {
  userProgress?: UserVocabulary | null;
  masteryLevel?: number;
  timesReviewed?: number;
  lastReviewed?: string;
  nextReview?: string;
};

type LessonProgressTrackerProps = {
  vocabulary: VocabularyWithProgress[];
  userId: string;
  onProgressUpdate?: () => void;
  onLessonComplete?: () => void;
};

type VocabularyProgress = {
  vocabularyId: string;
  isLearned: boolean;
  attempts: number;
  correctAttempts: number;
};

export function LessonProgressTracker({
  vocabulary,
  userId,
  onProgressUpdate,
  onLessonComplete,
}: LessonProgressTrackerProps) {
  const [vocabularyProgress, setVocabularyProgress] = useState<Map<string, VocabularyProgress>>(
    new Map(),
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const updateVocabularyMutation = useUpdateVocabularyProgress();

  // Use refs to store the latest callback functions to avoid infinite re-renders
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const onLessonCompleteRef = useRef(onLessonComplete);

  // Update refs when callbacks change
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    onLessonCompleteRef.current = onLessonComplete;
  }, [onLessonComplete]);

  // Initialize progress tracking from database data
  useEffect(() => {
    const newProgress = new Map<string, VocabularyProgress>();

    vocabulary.forEach((word) => {
      // Use database data if available, otherwise initialize as new
      const masteryLevel = word.masteryLevel || 0;
      const timesReviewed = word.timesReviewed || 0;
      const userProgress = word.userProgress;
      const isLearned = masteryLevel >= 1;

      newProgress.set(word.id, {
        vocabularyId: word.id,
        isLearned,
        attempts: timesReviewed,
        correctAttempts: userProgress?.correct_answers || 0,
      });
    });

    setVocabularyProgress(newProgress);
    setIsInitialized(true);
  }, [vocabulary]);

  // Calculate overall progress
  const learnedCount = Array.from(vocabularyProgress.values()).filter(p => p.isLearned).length;
  const totalCount = vocabulary.length;
  const progressPercentage = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  // Update progress when it changes (but not during initialization)
  useEffect(() => {
    // Only update progress if the component has been initialized
    // This prevents overwriting database progress during initial load
    if (!isInitialized)
      return;

    onProgressUpdateRef.current?.();

    // Check if lesson is complete
    if (progressPercentage === 100 && totalCount > 0) {
      onLessonCompleteRef.current?.();
    }
  }, [progressPercentage, totalCount, isInitialized]);

  const markWordAsLearned = async (vocabularyId: string, isCorrect: boolean = true) => {
    const currentProgress = vocabularyProgress.get(vocabularyId);
    if (!currentProgress)
      return;

    const newProgress = {
      ...currentProgress,
      attempts: currentProgress.attempts + 1,
      correctAttempts: currentProgress.correctAttempts + (isCorrect ? 1 : 0),
      isLearned: isCorrect ? true : currentProgress.isLearned,
    };

    // Update local state
    const newProgressMap = new Map(vocabularyProgress);
    newProgressMap.set(vocabularyId, newProgress);
    setVocabularyProgress(newProgressMap);

    // Update database
    try {
      await updateVocabularyMutation.mutateAsync({
        userId,
        vocabularyId,
        isCorrect,
      });
    }
    catch (error) {
      console.error("Failed to update vocabulary progress:", error);
    }
  };

  const resetWordProgress = (vocabularyId: string) => {
    const currentProgress = vocabularyProgress.get(vocabularyId);
    if (!currentProgress)
      return;

    const newProgress = {
      ...currentProgress,
      isLearned: false,
    };

    const newProgressMap = new Map(vocabularyProgress);
    newProgressMap.set(vocabularyId, newProgress);
    setVocabularyProgress(newProgressMap);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Lesson Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Words Learned</span>
            <span>
              {learnedCount}
              {" "}
              /
              {" "}
              {totalCount}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {progressPercentage}
            % Complete
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Word Progress:</div>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {vocabulary.map((word) => {
              const progress = vocabularyProgress.get(word.id);
              const isLearned = progress?.isLearned || false;

              return (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {isLearned
                      ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )
                      : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                    <span className="text-sm font-medium">{word.translated_word}</span>
                    <span className="text-xs text-gray-500">
                      (
                      {word.english_word}
                      )
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {!isLearned && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markWordAsLearned(word.id, true)}
                        className="h-6 px-2 text-xs"
                      >
                        ✓ Learned
                      </Button>
                    )}
                    {isLearned && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resetWordProgress(word.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {progressPercentage === 100 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">
              Congratulations! You've completed this lesson!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
