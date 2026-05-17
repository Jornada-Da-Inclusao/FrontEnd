const WORDS = ["BOLA", "ANOS", "MESA", "PATO", "GATO"];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export const level2 = {
  title: "Monte a Palavra",

  description: ({ gameData }) => {
    return `Monte a palavra: ${gameData.word}`;
  },

  setup: () => {
    const word = randomWord();

    const letters = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      value: String.fromCharCode(65 + i),
    }));

    return {
      letters,
      word,
    };
  },

  validate: ({ letter, droppedLetters, gameData }) => {
    const expected = gameData.word[droppedLetters.length];

    return letter.value === expected;
  },

  isCompleted: ({ droppedLetters, gameData }) => {
    return droppedLetters.length === gameData.word.length;
  },
};
