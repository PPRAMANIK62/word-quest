import { Volume2 } from "lucide-react";
import { useState } from "react";

import type { GameQuestion } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MultipleChoiceQuizProps = {
  question: GameQuestion;
  onAnswer: (answer: string) => void;
  onAudioPlay?: (audioUrl: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
};

export function MultipleChoiceQuiz({
  question,
  onAnswer,
  onAudioPlay,
  disabled = false,
  showFeedback = false,
  userAnswer,
  isCorrect,
}: MultipleChoiceQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(userAnswer || null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (disabled)
      return;

    setSelectedOption(option);
    onAnswer(option);
  };

  const handleAudioPlay = async () => {
    if (!question.vocabulary.audio_url || !onAudioPlay)
      return;

    setIsPlaying(true);
    try {
      onAudioPlay(question.vocabulary.audio_url);
      // Reset playing state after a reasonable time
      setTimeout(() => setIsPlaying(false), 3000);
    }
    catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showFeedback) {
      return selectedOption === option
        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600";
    }

    // Show feedback
    if (option === question.correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300";
    }

    if (selectedOption === option && !isCorrect) {
      return "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
    }

    return "border-gray-200 dark:border-gray-700 opacity-60";
  };

  const getOptionIcon = (option: string) => {
    if (!showFeedback)
      return null;

    if (option === question.correctAnswer) {
      return <span className="text-green-600 dark:text-green-400">✓</span>;
    }

    if (selectedOption === option && !isCorrect) {
      return <span className="text-red-600 dark:text-red-400">✗</span>;
    }

    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Multiple Choice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            {question.question}
          </h3>

          {/* Audio button */}
          {question.vocabulary.audio_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAudioPlay}
              disabled={isPlaying}
              className="mt-2"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {!question.options || question.options.length === 0
            ? (
                <div className="text-center text-red-500 p-4">
                  No options available for this question. Please try again.
                </div>
              )
            : (
                question.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={disabled}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getOptionStyle(option)} ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-base">{option}</span>
                      </div>
                      {getOptionIcon(option)}
                    </div>
                  </button>
                ))
              )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className={`text-center font-medium mb-2 ${
              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>

            {!isCorrect && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                The correct answer is:
                {" "}
                <strong>{question.correctAnswer}</strong>
              </div>
            )}

            {question.explanation && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {question.explanation}
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {question.hint && !showFeedback && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              💡
              {" "}
              {question.hint}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
