import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useLanguages, useRecentMistakes, useReviewQueue, useUserVocabulary } from "@/lib/queries";

export function ReviewPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState<"select" | "flashcard">("select");
  const [selectedReviewSet, setSelectedReviewSet] = useState<string | null>(null);

  // Query hooks for real data
  const { data: languages } = useLanguages();

  const selectedLanguage = searchParams.get("lang") || (languages?.[0]?.code || languages?.[0]?.name.toLowerCase() || "");
  const selectedLanguageData = languages?.find(lang =>
    lang.code === selectedLanguage || lang.name.toLowerCase() === selectedLanguage,
  );

  const { data: reviewQueue, isLoading: reviewQueueLoading } = useReviewQueue(
    user?.id,
    selectedLanguageData?.id,
  );
  const { data: recentMistakes, isLoading: mistakesLoading } = useRecentMistakes(
    user?.id,
    selectedLanguageData?.id,
  );
  const { data: allVocabulary, isLoading: vocabularyLoading } = useUserVocabulary(
    user?.id,
    selectedLanguageData?.id,
  );

  // Create review sets from real data
  const reviewSets = [
    {
      id: "due",
      title: "Due for Review",
      description: "Words that need practice based on spaced repetition",
      count: reviewQueue?.length || 0,
      priority: "high",
      icon: "🔥",
      data: reviewQueue,
      loading: reviewQueueLoading,
    },
    {
      id: "mistakes",
      title: "Recent Mistakes",
      description: "Words you got wrong in recent sessions",
      count: recentMistakes?.length || 0,
      priority: "medium",
      icon: "❌",
      data: recentMistakes,
      loading: mistakesLoading,
    },
    {
      id: "all",
      title: "All Vocabulary",
      description: "Review all words you've learned so far",
      count: allVocabulary?.length || 0,
      priority: "low",
      icon: "📚",
      data: allVocabulary,
      loading: vocabularyLoading,
    },
  ];

  // Get current flashcards based on selected review set
  const getCurrentFlashcards = () => {
    const selectedSet = reviewSets.find(set => set.id === selectedReviewSet);
    if (!selectedSet?.data)
      return [];

    return selectedSet.data.map((item) => {
      // Handle different data structures from different review sets
      let vocab;

      if (item.vocabulary) {
        // For user_vocabulary records and recent mistakes
        vocab = item.vocabulary;
      }
      else {
        // For direct vocabulary records (shouldn't happen with current queries, but safe fallback)
        vocab = item;
      }

      return {
        id: vocab?.id || "unknown",
        word: vocab?.translated_word || "Unknown",
        translation: vocab?.english_word || "Unknown",
        pronunciation: vocab?.pronunciation || "",
        example: vocab?.example_sentence_translated || "",
        exampleTranslation: vocab?.example_sentence_english || "",
      };
    });
  };

  const flashcards = getCurrentFlashcards();

  const handleStartReview = (setId: string, setTitle: string, wordCount: number) => {
    if (wordCount === 0) {
      toast.error("No words available for review in this set.");
      return;
    }

    setSelectedReviewSet(setId);
    toast.info(`Starting review session: ${setTitle}`);
    setReviewMode("flashcard");
    setCurrentCard(0);
    setShowAnswer(false);
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
    // TODO: Update spaced repetition data in database
  };

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
            {reviewQueueLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold text-red-600">{reviewQueue?.length || 0}</div>
                )}
            <p className="text-xs text-gray-500">🔥 High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vocabularyLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold text-green-600">{allVocabulary?.length || 0}</div>
                )}
            <p className="text-xs text-gray-500">📚 Words learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Recent Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mistakesLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold text-blue-600">{recentMistakes?.length || 0}</div>
                )}
            <p className="text-xs text-gray-500">❌ Need practice</p>
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
                {set.loading
                  ? (
                      <span className="text-2xl font-bold text-blue-600 animate-pulse">--</span>
                    )
                  : (
                      <span className="text-2xl font-bold text-blue-600">
                        {set.count}
                      </span>
                    )}
                <span className="text-sm text-gray-500">
                  {set.count === 1 ? "word" : "words"}
                </span>
              </div>

              <Button
                onClick={() => handleStartReview(set.id, set.title, set.count)}
                className="w-full"
                disabled={set.loading || set.count === 0}
              >
                {set.loading ? "Loading..." : set.count === 0 ? "No words available" : "Start Review Session"}
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
