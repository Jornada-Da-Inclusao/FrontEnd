import React from 'react';
import { TextWithAudio } from '../TTS/TextWithAudio';
import { getAudioContent, getAllAudioContent } from '../../services/gcs-audio.service';

/**
 * Example component showing how to use TextWithAudio
 * Integrates TTS into your existing Explicacoes component
 */
export function ExplicacoesWithTTS() {
  // Get all audio content at once
  const audioContent = getAllAudioContent();

  return (
    <div>
      <h1>Explicações dos Jogos</h1>
      <p>Clique no botão 🔊 para ouvir cada explicação</p>

      {/* Option 1: Using the TextWithAudio component */}
      {audioContent.map((content) => (
        <TextWithAudio
          key={content.textId}
          text={content.text}
          audioUrl={content.audioUrl}
          textId={content.textId}
        />
      ))}

      {/* Option 2: Manual usage with AudioButton component */}
      <div style={{ marginTop: '40px' }}>
        <h2>Jogo de Cores</h2>
        {(() => {
          const coresContent = getAudioContent('explicacao_cores');
          return coresContent ? (
            <TextWithAudio
              text={coresContent.text}
              audioUrl={coresContent.audioUrl}
              textId={coresContent.textId}
            />
          ) : null;
        })()}
      </div>
    </div>
  );
}
