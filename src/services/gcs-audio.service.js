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
/** @type {Record<string, { text: string; audioFile: string }>} */
export const audioContentMap = {
  // Exemplo para a página de Explicações
  explicacao_introducao: {
    text: 'Bem-vindo ao Jornada da Inclusão! Este é um espaço dedicado a promover acessibilidade e inclusão através de jogos educativos.',
    audioFile: 'explicacoes/introducao.mp3',
  },
  explicacao_cores: {
    text: 'O Jogo das Cores ensina as crianças a identificar e nomear cores através de atividades lúdicas. Além de estimular a observação, ajuda a expandir o vocabulário e a criatividade.',
    audioFile: 'explicacoes/cores/description.mp3',
  },
  explicacao_memoria: {
    text: 'O Jogo da Memória ajuda as crianças a melhorarem a concentração e a memória visual. Ao encontrar pares de cartas relacionadas a conceitos educativos, os alunos reforçam o aprendizado de forma divertida.',
    audioFile: 'explicacoes/memoria/description.mp3',
  },
  explicacao_numeros: {
    text: 'Neste jogo, as crianças praticam a ordenação de números em sequência crescente ou decrescente. Essa atividade desenvolve o raciocínio lógico e familiariza os alunos com a sequência numérica.',
    audioFile: 'explicacoes/numeros/description.mp3',
  },
  explicacao_vogais: {
    text: 'Neste jogo, as crianças aprendem sobre vogais de forma interativa. Através de atividades de reconhecimento e combinação, desenvolvem habilidades de leitura e aumentam o interesse pela linguagem.',
    audioFile: 'explicacoes/vogais/description.mp3',
  },
  // Nossa Página section paragraphs
  sobre_plataforma_1: {
    text: 'A plataforma "Integra Kids" foi desenvolvida com o objetivo de apoiar crianças do ensino fundamental que enfrentam dificuldades em matérias específicas. Com um ambiente lúdico e interativo, a plataforma oferece uma variedade de games educativos que tornam o aprendizado mais divertido e acessível. Ao identificar as áreas em que o aluno precisa de mais ajuda, a plataforma adapta as atividades, proporcionando um suporte personalizado que visa aumentar a confiança e a compreensão da criança.',
    audioFile: 'main/1.mp3',
  },
  sobre_plataforma_2: {
    text: 'Os jogos disponíveis na Integra Kids abrangem disciplinas, como: matemática, ciências e língua portuguesa. Cada jogo é projetado para ser divertido e desafiador, promovendo o engajamento dos alunos enquanto trabalham suas habilidades. A plataforma também conta com um sistema de feedback, que permite que os educadores e pais acompanhem o progresso da criança, identificando as dificuldades específicas e proporcionando conquistas ao longo do caminho.',
    audioFile: 'main/2.mp3',
  },
  sobre_plataforma_3: {
    text: 'Além disso, a Integra Kids oferece recomendações de games complementares baseados no desempenho do aluno. Quando uma criança encontra dificuldades em um conceito, a plataforma sugere atividades alternativas que reforçam o aprendizado de forma lúdica. Dessa maneira, a criança é redirecionada a games que atendem suas necessidades, facilitando a compreensão e promovendo um aprendizado mais eficaz e divertido. Com essa abordagem, a Integra Kids se torna uma ferramenta valiosa tanto para alunos quanto para educadores, contribuindo para um aprendizado significativo e divertido.',
    audioFile: 'main/3.mp3',
  },
  sobre_plataforma_4: {
    text: 'O personagem ilustrado é o símbolo central do projeto "Integra Kids". Com sua coroa dourada, capa vermelha e lápis gigante, ele representa o espírito aventureiro e criativo que a plataforma busca despertar nas crianças. Além de inspirar confiança e curiosidade, o mascote desempenha um papel essencial na conexão com o público infantil, tornando o aprendizado mais acessível e divertido. Sua presença lúdica e acolhedora ajuda a criar uma relação de proximidade, incentivando as crianças a explorar novas ideias e superar desafios de forma leve e engajante.',
    audioFile: 'main/4.mp3',
  },
  // Explicações page descriptions
  explicacao_page_cores: {
    text: 'O objetivo é arrastar cada uma das cores para a caixa do animal correspondente.',
    audioFile: 'explicacoes/cores/explanation.mp3',
  },
  explicacao_page_memoria: {
    text: 'Revele todas as cartas encontrando os pares iguais consecutivos.',
    audioFile: 'explicacoes/memoria/explanation.mp3',
  },
  explicacao_page_numeros: {
    text: 'Ordene todos os números em sequência numérica ao arrastá-los para a caixa.',
    audioFile: 'explicacoes/numeros/explanation.mp3',
  },
  explicacao_page_vogais: {
    text: 'Arraste, dentre o alfabeto inteiro, apenas as letras vogais para a caixa.',
    audioFile: 'explicacoes/vogais/explanation.mp3',
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
 * @returns {{text: string, audioUrl: string, textId: string} | null} Content object with text and audioUrl, or null if not found
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
 * @returns {{textId: string, text: string, audioUrl: string}[]} Array of all content objects
 */
export function getAllAudioContent() {
  return Object.entries(audioContentMap).map(([textId, content]) => ({
    textId,
    text: content.text,
    audioUrl: buildGCSAudioUrl(content.audioFile),
  }));
}
