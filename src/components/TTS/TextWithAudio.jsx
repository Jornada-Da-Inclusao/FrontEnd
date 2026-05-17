import React from 'react';
import { AudioButton } from './AudioButton';
import styles from './TextWithAudio.module.css';

/**
 * Component that renders text with associated audio playback
 * Maps text content to GCS audio files
 * 
 * @param {string} text - Text content to display
 * @param {string} audioUrl - Full URL to GCS audio file
 * @param {string} textId - Unique identifier for the text (for linking)
 */
export function TextWithAudio({ text, audioUrl, textId }) {
  return (
    <div className={styles.textWithAudio}>
      <p id={textId} className={styles.text}>
        {text}
      </p>
      <AudioButton
        audioUrl={audioUrl}
        label="🔊"
        ariaLabel={`Ouvir: ${text.substring(0, 50)}...`}
      />
    </div>
  );
}
