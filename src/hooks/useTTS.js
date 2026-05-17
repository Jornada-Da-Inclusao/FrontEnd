import { useRef, useCallback, useState } from 'react';

/**
 * Hook for managing Text-to-Speech audio playback
 * Maps text content to audio files from GCS
 */
export function useTTS() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const play = useCallback((audioUrl) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Set up event listeners
      audioRef.current.onloadstart = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setError('Erro ao carregar o áudio');
        setIsLoading(false);
      };

      audioRef.current.src = audioUrl;
      audioRef.current.play();
    } catch (err) {
      setError('Erro ao reproduzir o áudio');
      setIsLoading(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    play,
    pause,
    stop,
    isPlaying,
    isLoading,
    error,
    audioRef,
  };
}
