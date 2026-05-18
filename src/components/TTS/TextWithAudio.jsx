import React from 'react';
import { AudioButton } from './AudioButton';
import styles from './TextWithAudio.module.css';

/**
 * Component that renders text with associated audio playback
 * Maps text content to GCS audio files
 * 
 * @param {{
 *   text: string,
 *   audioUrl: string,
 *   textId: string,
 *   textStyle?: React.CSSProperties
 * }} props
 */
export function TextWithAudio({ text, audioUrl, textId, textStyle }) {
  return (
    <div className={styles.textWithAudio}>
      <p id={textId} className={styles.text} style={textStyle}>
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
