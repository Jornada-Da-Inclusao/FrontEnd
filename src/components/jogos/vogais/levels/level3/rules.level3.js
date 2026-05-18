const CHALLENGES = [
  {
    image: "🍐",
    word: "PERA",
  },
  {
    image: "🐱",
    word: "GATO",
  },
  {
    image: "☀️",
    word: "SOL",
  },
  {
    image: "🍇",
    word: "UVA",
  },
  {
    image: "🌙",
    word: "LUA",
  },
];

function randomChallenge() {
  return CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
}

export const level3 = {
  title: "Descubra a Palavra",

  description: ({ gameData }) => {
    return `Monte a palavra da imagem: ${gameData.challenge.image}`;
  },

  setup: () => {
    const challenge = randomChallenge();

    const letters = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      value: String.fromCharCode(65 + i),
    }));

    return {
      letters,
      challenge,
    };
  },

  validate: ({ letter, droppedLetters, gameData }) => {
    const expected = gameData.challenge.word[droppedLetters.length];

    return letter.value === expected;
  },

  isCompleted: ({ droppedLetters, gameData }) => {
    return droppedLetters.length === gameData.challenge.word.length;
  },
};
