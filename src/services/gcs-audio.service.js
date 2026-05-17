/**
 * Service for building GCS URLs and managing audio content mapping
 */

const GCS_BUCKET_URL = 'https://storage.googleapis.com/integra-kids-voices';

/**
 * Build a full GCS URL for an audio file
 * @param {string} filename - Filename in the GCS bucket (e.g., "explicacoes/audio-1.mp3")
 * @returns {string} Full GCS URL
 */
export function buildGCSAudioUrl(filename) {
  return `${GCS_BUCKET_URL}/${filename}`;
}

/**
 * Map text content to audio files
 * Structure: { textId: { text: string, audioFile: string } }
 */
export const audioContentMap = {
  // Exemplo para a página de Explicações
  explicacao_introducao: {
    text: 'Bem-vindo ao Jornada da Inclusão! Este é um espaço dedicado a promover acessibilidade e inclusão através de jogos educativos.',
    audioFile: 'explicacoes/introducao.mp3',
  },
  explicacao_cores: {
    text: 'No jogo de cores, você aprenderá a identificar e reconhecer diferentes cores de forma divertida e interativa.',
    audioFile: 'explicacoes/jogo-cores.mp3',
  },
  explicacao_numeros: {
    text: 'Neste jogo, você praticará habilidades de contagem e reconhecimento de números.',
    audioFile: 'explicacoes/jogo-numeros.mp3',
  },
  explicacao_vogais: {
    text: 'Aprenda sobre as vogais através de um jogo interativo que combina som, imagem e diversão.',
    audioFile: 'explicacoes/jogo-vogais.mp3',
  },
  explicacao_memoria: {
    text: 'Teste sua memória neste clássico jogo de encontrar pares de cartas correspondentes.',
    audioFile: 'explicacoes/jogo-memoria.mp3',
  },
};

/**
 * Get audio URL for a specific text ID
 * @param {string} textId - The ID of the text content
 * @returns {string|null} Full GCS URL or null if not found
 */
export function getAudioUrlForText(textId) {
  const content = audioContentMap[textId];
  if (!content) {
    console.warn(`Audio content not found for textId: ${textId}`);
    return null;
  }
  return buildGCSAudioUrl(content.audioFile);
}

/**
 * Get text content for a specific ID
 * @param {string} textId - The ID of the text content
 * @returns {string|null} Text content or null if not found
 */
export function getTextContent(textId) {
  const content = audioContentMap[textId];
  return content ? content.text : null;
}

/**
 * Get full content object (text + audio URL) for a specific ID
 * @param {string} textId - The ID of the content
 * @returns {object|null} Content object with text and audioUrl, or null if not found
 */
export function getAudioContent(textId) {
  const content = audioContentMap[textId];
  if (!content) return null;

  return {
    text: content.text,
    audioUrl: buildGCSAudioUrl(content.audioFile),
    textId,
  };
}

/**
 * Get all audio content (useful for preloading)
 * @returns {array} Array of all content objects
 */
export function getAllAudioContent() {
  return Object.entries(audioContentMap).map(([textId, content]) => ({
    textId,
    text: content.text,
    audioUrl: buildGCSAudioUrl(content.audioFile),
  }));
}
