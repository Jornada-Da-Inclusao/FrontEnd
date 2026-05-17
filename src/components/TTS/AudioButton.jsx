import React, { useState } from 'react';
import { useTTS } from '../../hooks/useTTS';
import styles from './AudioButton.module.css';

/**
 * Component for playing audio from GCS with accessibility features
 * 
 * @param {{
 *   audioUrl: string,
 *   label?: string,
 *   ariaLabel?: string,
 *   disabled?: boolean,
 * }} props
 */
export function AudioButton({ 
  audioUrl, 
  label = '🔊 Ouvir', 
  ariaLabel = 'Reproduzir áudio',
  disabled = false 
}) {
  const { play, pause, stop, isPlaying, isLoading, error } = useTTS();
  const [showError, setShowError] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlaying) {
      stop();
    } else {
      play(audioUrl);
    }
  };

  React.useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={styles.audioButtonContainer}>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`${styles.audioButton} ${isPlaying ? styles.playing : ''} ${isLoading ? styles.loading : ''}`}
        aria-label={ariaLabel}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Parar áudio' : 'Reproduzir áudio'}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true">⏳</span>}
        {!isLoading && (isPlaying ? '⏹' : label)}
      </button>

      {showError && (
        <div 
          className={styles.errorMessage}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
