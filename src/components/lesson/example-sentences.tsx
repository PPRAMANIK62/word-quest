import { Volume2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ExampleSentencesProps = {
  englishSentence?: string;
  translatedSentence?: string;
  audioUrl?: string;
  onAudioPlay?: (audioUrl: string) => void;
  showTitle?: boolean;
  className?: string;
};

export function ExampleSentences({
  englishSentence,
  translatedSentence,
  audioUrl,
  onAudioPlay,
  showTitle = true,
  className = "",
}: ExampleSentencesProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = async () => {
    if (!audioUrl)
      return;

    setIsPlaying(true);

    try {
      if (onAudioPlay) {
        onAudioPlay(audioUrl);
      }
      else {
        // Default audio playback
        const audio = new Audio(audioUrl);
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

  // Don't render if no sentences provided
  if (!englishSentence && !translatedSentence) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Example Usage</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {translatedSentence && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Native Language:
            </div>
            <blockquote className="text-base text-gray-900 dark:text-white italic border-l-4 border-blue-500 pl-4">
              "
              {translatedSentence}
              "
            </blockquote>
          </div>
        )}

        {englishSentence && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              English Translation:
            </div>
            <blockquote className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-gray-300 pl-4">
              "
              {englishSentence}
              "
            </blockquote>
          </div>
        )}

        {audioUrl && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAudioPlay}
              disabled={isPlaying}
              className="w-full"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isPlaying ? "Playing Example..." : "Play Example"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simplified version for inline usage
type InlineExampleProps = {
  englishSentence?: string;
  translatedSentence?: string;
  audioUrl?: string;
  onAudioPlay?: (audioUrl: string) => void;
};

export function InlineExample({
  englishSentence,
  translatedSentence,
  audioUrl,
  onAudioPlay,
}: InlineExampleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = async () => {
    if (!audioUrl)
      return;

    setIsPlaying(true);

    try {
      if (onAudioPlay) {
        onAudioPlay(audioUrl);
      }
      else {
        const audio = new Audio(audioUrl);
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

  if (!englishSentence && !translatedSentence) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Example:
      </div>

      {translatedSentence && (
        <div className="text-sm text-gray-800 dark:text-gray-200 italic">
          "
          {translatedSentence}
          "
        </div>
      )}

      {englishSentence && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          "
          {englishSentence}
          "
        </div>
      )}

      {audioUrl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAudioPlay}
          disabled={isPlaying}
          className="h-6 px-2 text-xs"
        >
          <Volume2 className="w-3 h-3 mr-1" />
          {isPlaying ? "Playing..." : "Play"}
        </Button>
      )}
    </div>
  );
}
