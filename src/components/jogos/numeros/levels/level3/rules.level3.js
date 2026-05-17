export const level3 = {
  title: "Desafio Matemático",

  generateNumbers: () => {
    const numbers = [];
    const resultsSet = new Set();

    // 🔥 agora gera 10 contas
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 5);
      const b = Math.floor(Math.random() * 5);

      const result = a + b;

      numbers.push({
        id: `op-${i}`,
        a,
        b,
        value: `${a} + ${b}`,
        result,
      });

      resultsSet.add(result);
    }

    const results = Array.from(resultsSet);

    // sequência do jogo
    const targetOrder = [...results].sort(() => Math.random() - 0.5);

    return {
      numbers,
      results,
      targetOrder,
    };
  },

  description: (data) => {
    const resultsText = data.targetOrder.join(", ");
    return `Resolva as operações seguindo esta sequência de resultados: ${resultsText}`;
  },

  validate: ({ number, droppedNumbers, gameData }) => {
    const expectedResult = gameData.targetOrder[droppedNumbers.length];

    return number.result === expectedResult;
  },

  // 🔥 agora depende do progresso da sequência
  isCompleted: ({ droppedNumbers, gameData }) => {
    return droppedNumbers.length >= gameData.targetOrder.length;
  },
};
