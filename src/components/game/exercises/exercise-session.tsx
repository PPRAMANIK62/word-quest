import { CheckCircle, Clock, Target, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { GameAnswer, GameSession, Vocabulary } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExerciseGenerator } from "@/lib/exercises/exercise-generator";

import { FillInBlank } from "./fill-in-blank";
import { MultipleChoiceQuiz } from "./multiple-choice-quiz";

type ExerciseSessionProps = {
  vocabulary: Vocabulary[];
  lessonId: string;
  userId: string;
  onComplete: (session: GameSession) => void;
  onExit: () => void;
  onAudioPlay?: (audioUrl: string) => void;
};

export function ExerciseSession({
  vocabulary,
  lessonId,
  userId,
  onComplete,
  onExit,
  onAudioPlay,
}: ExerciseSessionProps) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [sessionStartTime] = useState(Date.now());

  // Initialize session
  useEffect(() => {
    try {
      const questions = ExerciseGenerator.generateMixedExercises(vocabulary, 8);

      const newSession: GameSession = {
        id: `session_${Date.now()}`,
        lessonId,
        userId,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startedAt: new Date(),
        isCompleted: false,
      };

      setSession(newSession);
      toast.success(`Exercise session started with ${questions.length} questions!`);
    }
    catch (error) {
      console.error("Failed to generate exercises:", error);
      toast.error("Failed to generate exercises. Please try again.");
      onExit();
    }
  }, [vocabulary, lessonId, userId, onExit]);

  const currentQuestion = session?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (session?.questions.length || 0) - 1;

  const handleAnswer = (answer: string) => {
    if (!currentQuestion)
      return;

    setCurrentAnswer(answer);

    // Handle all question types except word matching
    if (currentQuestion.type === "multiple_choice"
      || currentQuestion.type === "fill_in_blank"
      || currentQuestion.type === "translate_from_english"
      || currentQuestion.type === "translate_to_english") {
      const isCorrect = ExerciseGenerator.validateAnswer(answer, currentQuestion.correctAnswer);

      const gameAnswer: GameAnswer = {
        questionId: currentQuestion.id,
        userAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
        attempts: 1,
      };

      setAnswers(prev => [...prev, gameAnswer]);
      setShowFeedback(true);

      if (isCorrect) {
        toast.success("Correct!");
      }
      else {
        toast.error("Incorrect. Try again!");
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete session
      const completedSession: GameSession = {
        ...session!,
        answers,
        endedAt: new Date(),
        isCompleted: true,
        score: Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100),
      };

      setSession(completedSession);
      onComplete(completedSession);
    }
    else {
      // Next question
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      setCurrentAnswer("");
    }
  };

  const handleExit = () => {
    if (answers.length > 0) {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm("Are you sure you want to exit? Your progress will be lost.");
      if (!confirmed)
        return;
    }
    onExit();
  };

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Preparing exercises...</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (session.isCompleted) {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / answers.length) * 100);

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            Exercise Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {accuracy}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{session.questions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={onExit} size="lg" className="w-full">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exercise Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question
            {" "}
            {currentQuestionIndex + 1}
            {" "}
            of
            {" "}
            {session.questions.length}
          </p>
        </div>
        <Button variant="outline" onClick={handleExit}>
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>
            {Math.round(progress)}
            %
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="min-h-[400px]">
        {currentQuestion.type === "multiple_choice" && (
          <MultipleChoiceQuiz
            question={currentQuestion}
            onAnswer={handleAnswer}
            onAudioPlay={onAudioPlay}
            disabled={showFeedback}
            showFeedback={showFeedback}
            userAnswer={currentAnswer}
            isCorrect={answers[answers.length - 1]?.isCorrect}
          />
        )}

        {currentQuestion.type === "fill_in_blank" && (
          <FillInBlank
            question={currentQuestion}
            onAnswer={handleAnswer}
            onAudioPlay={onAudioPlay}
            disabled={showFeedback}
            showFeedback={showFeedback}
            userAnswer={currentAnswer}
            isCorrect={answers[answers.length - 1]?.isCorrect}
          />
        )}

        {currentQuestion.type === "translate_from_english" && (
          <MultipleChoiceQuiz
            question={currentQuestion}
            onAnswer={handleAnswer}
            onAudioPlay={onAudioPlay}
            disabled={showFeedback}
            showFeedback={showFeedback}
            userAnswer={currentAnswer}
            isCorrect={answers[answers.length - 1]?.isCorrect}
          />
        )}
      </div>

      {/* Navigation */}
      {showFeedback && (
        <div className="flex justify-center">
          <Button onClick={handleNext} size="lg">
            {isLastQuestion ? "Complete Exercise" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  );
}
