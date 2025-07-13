import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { GameQuestion } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FillInBlankProps = {
  question: GameQuestion;
  onAnswer: (answer: string) => void;
  onAudioPlay?: (audioUrl: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
};

export function FillInBlank({
  question,
  onAnswer,
  onAudioPlay,
  disabled = false,
  showFeedback = false,
  userAnswer,
  isCorrect,
}: FillInBlankProps) {
  const [answer, setAnswer] = useState(userAnswer || "");
  const [isPlaying, setIsPlaying] = useState(false);

  // Clear answer when question changes (new question loaded)
  useEffect(() => {
    if (!showFeedback) {
      setAnswer("");
    }
  }, [question.id, showFeedback]);

  const handleAnswerChange = (value: string) => {
    if (disabled)
      return;
    setAnswer(value);
  };

  const handleSubmit = () => {
    if (disabled || !answer.trim())
      return;
    onAnswer(answer.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled && answer.trim()) {
      handleSubmit();
    }
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

  const getInputStyle = () => {
    if (!showFeedback) {
      return "";
    }

    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
  };

  // Parse the question to highlight the blank
  const renderQuestion = () => {
    const parts = question.question.split("______");
    if (parts.length !== 2) {
      return <span>{question.question}</span>;
    }

    return (
      <span>
        {parts[0]}
        <span className="inline-block mx-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded border-b-2 border-dashed border-yellow-400 dark:border-yellow-600">
          ______
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Fill in the Blank
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white leading-relaxed">
            {renderQuestion()}
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

        {/* Answer Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your answer:
          </label>
          <div className="space-y-3">
            <Input
              type="text"
              value={answer}
              onChange={e => handleAnswerChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Type your answer here..."
              className={`text-center text-lg ${getInputStyle()}`}
              autoComplete="off"
              spellCheck={false}
            />
            {!showFeedback && (
              <Button
                onClick={handleSubmit}
                disabled={disabled || !answer.trim()}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            )}
          </div>
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

        {/* Word info */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>Word type:</strong>
            {" "}
            {question.vocabulary.word_type || "Unknown"}
            {question.vocabulary.pronunciation && (
              <>
                <br />
                <strong>Pronunciation:</strong>
                {" "}
                {question.vocabulary.pronunciation}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
