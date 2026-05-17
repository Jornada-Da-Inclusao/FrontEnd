// // ========================================
// // levels/level1/rules.level1.js
// // ========================================

// const VOGAIS = ["A", "E", "I", "O", "U"];

// export const level1 = {
//   title: "Jogo das Vogais",

//   description: () => {
//     return "Arraste apenas as vogais.";
//   },

//   setup: () => {
//     const letters = Array.from({ length: 26 }, (_, i) => ({
//       id: i + 1,
//       value: String.fromCharCode(65 + i),
//     }));

//     return {
//       letters,
//       targetLetters: VOGAIS,
//     };
//   },

//   validate: ({ letter }) => {
//     return VOGAIS.includes(letter.value);
//   },

//   isCompleted: ({ droppedLetters, gameData }) => {
//     return droppedLetters.length === gameData.targetLetters.length;
//   },
// };

export const level1 = {
  title: "Jogo das Vogais",

  description: () => {
    return "Arraste apenas as vogais.";
  },

  setup: () => {
    const letters = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      value: String.fromCharCode(65 + i),
    }));

    return {
      letters,
      targetLetters: ["A", "E", "I", "O", "U"],
    };
  },

  validate: ({ letter }) => {
    return ["A", "E", "I", "O", "U"].includes(letter.value);
  },

  isCompleted: ({ droppedLetters }) => {
    return droppedLetters.length === 5;
  },
};
