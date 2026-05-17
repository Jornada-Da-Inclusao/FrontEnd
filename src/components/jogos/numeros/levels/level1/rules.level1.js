export const level1 = {
  title: "Jogo dos Números",
  description: "Arraste os números na sequência correta.",
  generateNumbers: () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
    }));
  },

  validate: ({ number, numbers, droppedNumbers, over }) => {
    const expected = droppedNumbers.length;
    return number.value === expected;
  },

  isCompleted: (numbers, dropped) => {
    return numbers.length === 0;
  },
};
