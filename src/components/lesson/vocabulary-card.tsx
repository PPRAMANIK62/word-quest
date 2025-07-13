import { Volume2 } from "lucide-react";
import { useState } from "react";

import type { Vocabulary } from "@/types/common";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type VocabularyCardProps = {
  vocabulary: Vocabulary & {
    userProgress?: any;
    masteryLevel?: number;
    timesReviewed?: number;
  };
  onAudioPlay?: (audioUrl: string) => void;
  showProgress?: boolean;
  interactive?: boolean;
  onWordClick?: (vocabulary: Vocabulary) => void;
};

export function VocabularyCard({
  vocabulary,
  onAudioPlay,
  showProgress = false,
  interactive = false,
  onWordClick,
}: VocabularyCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = async () => {
    if (!vocabulary.audio_url)
      return;

    setIsPlaying(true);

    try {
      if (onAudioPlay) {
        onAudioPlay(vocabulary.audio_url);
      }
      else {
        // Default audio playback
        const audio = new Audio(vocabulary.audio_url);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          console.error("Failed to play audio");
        };
        await audio.play();
      }
    }
    catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  const handleCardClick = () => {
    if (interactive && onWordClick) {
      onWordClick(vocabulary);
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4)
      return "bg-green-500";
    if (level >= 2)
      return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 4)
      return "Mastered";
    if (level >= 2)
      return "Learning";
    return "New";
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        interactive
          ? "hover:shadow-lg hover:scale-105 cursor-pointer"
          : "hover:shadow-md"
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 dark:text-white">
              {vocabulary.translated_word}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {vocabulary.english_word}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs">
              {vocabulary.word_type}
            </Badge>
            {showProgress && vocabulary.masteryLevel !== undefined && (
              <Badge
                variant="secondary"
                className={`text-xs text-white ${getMasteryColor(vocabulary.masteryLevel)}`}
              >
                {getMasteryLabel(vocabulary.masteryLevel)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {vocabulary.pronunciation && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Pronunciation:
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
              {vocabulary.pronunciation}
            </span>
          </div>
        )}

        {vocabulary.example_sentence_translated && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Example:
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200 italic">
              "
              {vocabulary.example_sentence_translated}
              "
            </div>
            {vocabulary.example_sentence_english && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                "
                {vocabulary.example_sentence_english}
                "
              </div>
            )}
          </div>
        )}

        {showProgress && vocabulary.timesReviewed !== undefined && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Reviewed
            {" "}
            {vocabulary.timesReviewed}
            {" "}
            times
          </div>
        )}

        {vocabulary.audio_url && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking audio button
              handleAudioPlay();
            }}
            disabled={isPlaying}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Pronunciation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
