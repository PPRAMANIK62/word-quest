import { Volume2 } from "lucide-react";
import { useState } from "react";

import type { Vocabulary } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WordMatchingProps = {
  vocabulary: Vocabulary[];
  onComplete: (matches: { [key: string]: string }) => void;
  onAudioPlay?: (audioUrl: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctMatches?: { [key: string]: string };
};

type MatchPair = {
  id: string;
  english: string;
  translated: string;
  audioUrl?: string;
};

export function WordMatching({
  vocabulary,
  onComplete,
  onAudioPlay,
  disabled = false,
  showFeedback = false,
  correctMatches: _correctMatches = {},
}: WordMatchingProps) {
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [selectedTranslated, setSelectedTranslated] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  // Create pairs from vocabulary (limit to 4-6 words for better UX)
  const pairs: MatchPair[] = vocabulary.slice(0, 6).map(v => ({
    id: v.id,
    english: v.english_word,
    translated: v.translated_word,
    audioUrl: v.audio_url || undefined,
  }));

  // Shuffle the translated words for display
  const shuffledTranslated = [...pairs.map(p => p.translated)].sort(() => Math.random() - 0.5);

  const handleEnglishSelect = (word: string) => {
    if (disabled || matches[word])
      return;

    setSelectedEnglish(selectedEnglish === word ? null : word);
    setSelectedTranslated(null);
  };

  const handleTranslatedSelect = (word: string) => {
    if (disabled)
      return;

    // Check if this translated word is already matched
    const alreadyMatched = Object.values(matches).includes(word);
    if (alreadyMatched)
      return;

    if (selectedEnglish) {
      // Make a match
      const newMatches = { ...matches, [selectedEnglish]: word };
      setMatches(newMatches);
      setSelectedEnglish(null);
      setSelectedTranslated(null);

      // Check if all matches are complete
      if (Object.keys(newMatches).length === pairs.length) {
        onComplete(newMatches);
      }
    }
    else {
      setSelectedTranslated(selectedTranslated === word ? null : word);
    }
  };

  const handleAudioPlay = async (audioUrl: string, wordId: string) => {
    if (!onAudioPlay)
      return;

    setIsPlaying(wordId);
    try {
      onAudioPlay(audioUrl);
      // Reset playing state after a reasonable time
      setTimeout(() => setIsPlaying(null), 3000);
    }
    catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(null);
    }
  };

  const getEnglishWordStyle = (word: string) => {
    if (matches[word]) {
      if (!showFeedback) {
        return "border-blue-500 bg-blue-50 dark:bg-blue-950 opacity-60";
      }

      const correctTranslation = pairs.find(p => p.english === word)?.translated;
      const isCorrect = matches[word] === correctTranslation;
      return isCorrect
        ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
        : "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
    }

    return selectedEnglish === word
      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600";
  };

  const getTranslatedWordStyle = (word: string) => {
    const isMatched = Object.values(matches).includes(word);

    if (isMatched) {
      if (!showFeedback) {
        return "border-blue-500 bg-blue-50 dark:bg-blue-950 opacity-60";
      }

      const englishWord = Object.keys(matches).find(k => matches[k] === word);
      const correctTranslation = pairs.find(p => p.english === englishWord)?.translated;
      const isCorrect = word === correctTranslation;
      return isCorrect
        ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
        : "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
    }

    return selectedTranslated === word
      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600";
  };

  const getMatchIcon = (word: string, isEnglish: boolean) => {
    if (!showFeedback)
      return null;

    const englishWord = isEnglish ? word : Object.keys(matches).find(k => matches[k] === word);
    const translatedWord = isEnglish ? matches[word] : word;

    if (!englishWord || !translatedWord)
      return null;

    const correctTranslation = pairs.find(p => p.english === englishWord)?.translated;
    const isCorrect = translatedWord === correctTranslation;

    return isCorrect
      ? <span className="text-green-600 dark:text-green-400">✓</span>
      : <span className="text-red-600 dark:text-red-400">✗</span>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Word Matching
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Match the English words with their translations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Words */}
          <div className="space-y-3">
            <h3 className="font-medium text-center text-gray-900 dark:text-white">
              English
            </h3>
            {pairs.map(pair => (
              <button
                key={`en-${pair.id}`}
                onClick={() => handleEnglishSelect(pair.english)}
                disabled={disabled}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-200 ${getEnglishWordStyle(pair.english)} ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{pair.english}</span>
                  <div className="flex items-center space-x-2">
                    {getMatchIcon(pair.english, true)}
                    {pair.audioUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAudioPlay(pair.audioUrl!, pair.id);
                        }}
                        disabled={isPlaying === pair.id}
                        className="p-1 h-auto"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Translated Words */}
          <div className="space-y-3">
            <h3 className="font-medium text-center text-gray-900 dark:text-white">
              Translation
            </h3>
            {shuffledTranslated.map(word => (
              <button
                key={`tr-${word}`}
                onClick={() => handleTranslatedSelect(word)}
                disabled={disabled}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-200 ${getTranslatedWordStyle(word)} ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{word}</span>
                  {getMatchIcon(word, false)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Matched:
          {" "}
          {Object.keys(matches).length}
          {" "}
          /
          {" "}
          {pairs.length}
        </div>

        {/* Instructions */}
        {Object.keys(matches).length === 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Click an English word, then click its translation to make a match
          </div>
        )}
      </CardContent>
    </Card>
  );
}
