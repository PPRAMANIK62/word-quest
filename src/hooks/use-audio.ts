import { useCallback, useRef, useState } from "react";

type UseAudioOptions = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
};

export function useAudio(options: UseAudioOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const play = useCallback(async (url: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Stop current audio if playing
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio instance if URL changed or no audio exists
      if (!audioRef.current || currentUrlRef.current !== url) {
        audioRef.current = new Audio(url);
        currentUrlRef.current = url;

        // Set up event listeners
        audioRef.current.onloadstart = () => {
          setIsLoading(true);
        };

        audioRef.current.oncanplay = () => {
          setIsLoading(false);
        };

        audioRef.current.onplay = () => {
          setIsPlaying(true);
          options.onPlay?.();
        };

        audioRef.current.onpause = () => {
          setIsPlaying(false);
          options.onPause?.();
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          options.onEnd?.();
        };

        audioRef.current.onerror = () => {
          const errorMsg = "Failed to load or play audio";
          setError(errorMsg);
          setIsPlaying(false);
          setIsLoading(false);
          options.onError?.(new Error(errorMsg));
        };
      }

      // Play the audio
      await audioRef.current.play();
    }
    catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Audio playback failed";
      setError(errorMsg);
      setIsPlaying(false);
      setIsLoading(false);
      options.onError?.(new Error(errorMsg));
    }
  }, [options]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      currentUrlRef.current = null;
    }
  }, []);

  return {
    play,
    pause,
    stop,
    cleanup,
    isPlaying,
    isLoading,
    error,
  };
}
