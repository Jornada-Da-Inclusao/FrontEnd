export const level3 = {
  title: "Monte a frase",

  getDescription() {
    return "Arraste as palavras para formar a frase correta.";
  },

  setup() {
    const correctSentence = [
      { id: 1, value: "O" },
      { id: 2, value: "gato" },
      { id: 3, value: "corre" },
      { id: 4, value: "rápido" },
    ];

    const shuffledItems = [...correctSentence].sort(() => Math.random() - 0.5);

    const targets = correctSentence.map((_, i) => ({
      id: i,
      position: i,
    }));

    return {
      items: shuffledItems,
      targets,
      solution: correctSentence,
    };
  },

  validateMove({ item, target, gameData }) {
    const expected = gameData.solution[target.position];

    return item.value === expected.value;
  },

  isCompleted({ matchedTargets, gameData }) {
    return matchedTargets.length === gameData.solution.length;
  },
};
