import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ReviewPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState<"select" | "flashcard">("select");

  const handleStartReview = (setTitle: string, wordCount: number) => {
    toast.info(`Starting review session: ${setTitle}`);
    setReviewMode("flashcard");
    setTimeout(() => {
      toast.success(`Loaded ${wordCount} words for review!`);
    }, 500);
  };

  const handleCardAnswer = (difficulty: "easy" | "medium" | "hard") => {
    const messages = {
      easy: "Great! This word will appear less frequently.",
      medium: "Good! You'll see this word again soon.",
      hard: "No worries! This word will be reviewed more often.",
    };
    toast.success(messages[difficulty]);
  };

  const reviewSets = [
    {
      id: 1,
      title: "Due for Review",
      description: "Words that need practice based on spaced repetition",
      count: 12,
      priority: "high",
      icon: "🔥",
    },
    {
      id: 2,
      title: "Recent Mistakes",
      description: "Words you got wrong in recent sessions",
      count: 8,
      priority: "medium",
      icon: "❌",
    },
    {
      id: 3,
      title: "All Vocabulary",
      description: "Review all words you've learned so far",
      count: 89,
      priority: "low",
      icon: "📚",
    },
    {
      id: 4,
      title: "Food & Drinks",
      description: "Practice vocabulary from the Food & Drinks lesson",
      count: 25,
      priority: "medium",
      icon: "🍽️",
    },
  ];

  const flashcards = [
    {
      id: 1,
      word: "Hola",
      translation: "Hello",
      pronunciation: "OH-lah",
      example: "Hola, ¿cómo estás?",
      exampleTranslation: "Hello, how are you?",
    },
    {
      id: 2,
      word: "Gracias",
      translation: "Thank you",
      pronunciation: "GRAH-see-ahs",
      example: "Gracias por tu ayuda",
      exampleTranslation: "Thank you for your help",
    },
    {
      id: 3,
      word: "Agua",
      translation: "Water",
      pronunciation: "AH-gwah",
      example: "Necesito agua, por favor",
      exampleTranslation: "I need water, please",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCard(prev => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setShowAnswer(false);
    setCurrentCard(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (reviewMode === "flashcard") {
    const card = flashcards[currentCard];

    return (
      <div className="container mx-auto p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Flashcard Review
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Card
              {" "}
              {currentCard + 1}
              {" "}
              of
              {" "}
              {flashcards.length}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setReviewMode("select")}
          >
            ← Back to Review Sets
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={((currentCard + 1) / flashcards.length) * 100} className="h-2" />
        </div>

        {/* Flashcard */}
        <Card className="min-h-[400px] flex flex-col justify-center items-center text-center p-8 mb-8">
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
              {card.word}
            </div>

            {showAnswer && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.translation}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  /
                  {card.pronunciation}
                  /
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="text-lg italic text-gray-700 dark:text-gray-300">
                    "
                    {card.example}
                    "
                  </div>
                  <div className="text-base text-gray-600 dark:text-gray-400">
                    "
                    {card.exampleTranslation}
                    "
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!showAnswer
            ? (
                <Button
                  onClick={() => setShowAnswer(true)}
                  size="lg"
                  className="px-8"
                >
                  Show Answer
                </Button>
              )
            : (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevCard}
                    disabled={currentCard === 0}
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={handleNextCard}
                    className="px-8"
                  >
                    {currentCard === flashcards.length - 1 ? "Finish" : "Next →"}
                  </Button>
                </div>
              )}
        </div>

        {/* Difficulty Feedback */}
        {showAnswer && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">How difficult was this word?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() => handleCardAnswer("easy")}
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  😊 Easy
                </Button>
                <Button
                  onClick={() => handleCardAnswer("medium")}
                  variant="outline"
                  className="text-yellow-600 border-yellow-600"
                >
                  😐 Medium
                </Button>
                <Button
                  onClick={() => handleCardAnswer("hard")}
                  variant="outline"
                  className="text-red-600 border-red-600"
                >
                  😰 Hard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Center
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice and reinforce your vocabulary with spaced repetition
        </p>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Words Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-gray-500">🔥 High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Review Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5 days</div>
            <p className="text-xs text-gray-500">📈 Keep going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mastery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-gray-500">🎯 Excellent!</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewSets.map(set => (
          <Card
            key={set.id}
            className="hover:shadow-lg transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-3xl mb-2">{set.icon}</div>
                <Badge className={getPriorityColor(set.priority)}>
                  {set.priority}
                  {" "}
                  priority
                </Badge>
              </div>
              <CardTitle className="text-lg">{set.title}</CardTitle>
              <CardDescription>{set.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {set.count}
                </span>
                <span className="text-sm text-gray-500">
                  {set.count === 1 ? "word" : "words"}
                </span>
              </div>

              <Button
                onClick={() => handleStartReview(set.title, set.count)}
                className="w-full"
              >
                Start Review Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Review Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Review words daily for best retention</li>
            <li>• Focus on words marked as "difficult" first</li>
            <li>• Use the pronunciation guide to practice speaking</li>
            <li>• Try to use new words in your own sentences</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
